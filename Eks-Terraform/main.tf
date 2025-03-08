# IAM role for EKS Cluster
resource "aws_iam_role" "opensearch_cluster_role" {
  name = "opensearch-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "opensearch-cluster-role"
  }
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.opensearch_cluster_role.name
}

# IAM role for EKS Node Group
resource "aws_iam_role" "opensearch_node_role" {
  name = "opensearch-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "opensearch-node-role"
  }
}

# Attach AmazonEKSWorkerNodePolicy to the worker node role
resource "aws_iam_role_policy_attachment" "eks_node_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.opensearch_node_role.name
}

# Attach AmazonEKS_CNI_Policy to allow CNI plugin management
resource "aws_iam_role_policy_attachment" "eks_cni_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.opensearch_node_role.name
}

# Attach AmazonEC2ContainerRegistryReadOnly to allow pulling images from ECR
resource "aws_iam_role_policy_attachment" "eks_ecr_readonly_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.opensearch_node_role.name
}

# EKS Cluster
resource "aws_eks_cluster" "opensearch_cluster" {
  name     = var.eks_cluster_name
  role_arn = aws_iam_role.opensearch_cluster_role.arn

  vpc_config {
    # Attach the subnets and security groups from your VPC
    subnet_ids         = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]
    security_group_ids = [aws_security_group.eks_sg.id]
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy_attachment
  ]

  tags = {
    Name = "opensearch-eks-cluster"
  }
}

# EKS Node Group
resource "aws_eks_node_group" "opensearch_node_group" {
  cluster_name    = aws_eks_cluster.opensearch_cluster.name
  node_group_name = var.node_group_name
  node_role_arn   = aws_iam_role.opensearch_node_role.arn

  # Attach the VPC subnets to the node group
  subnet_ids = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]

  scaling_config {
    desired_size = var.desired_size
    max_size     = var.max_size
    min_size     = var.min_size
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_node_policy_attachment,
    aws_iam_role_policy_attachment.eks_cni_policy_attachment,
    aws_iam_role_policy_attachment.eks_ecr_readonly_policy_attachment
  ]

  tags = {
    Name = "opensearch-eks-node-group"
  }
}

