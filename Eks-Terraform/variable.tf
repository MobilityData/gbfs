variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  default     = "10.0.0.0/16"
}

variable "subnet1_cidr" {
  description = "CIDR block for the first subnet"
  default     = "10.0.1.0/24"
}

variable "subnet2_cidr" {
  description = "CIDR block for the second subnet"
  default     = "10.0.2.0/24"
}

variable "region" {
  description = "AWS region for resources"
  default     = "eu-west-2"
}

variable "eks_cluster_name" {
  description = "Name of the EKS cluster"
  default     = "opensearch-cluster"
}

variable "node_group_name" {
  description = "Name of the EKS Node Group"
  default     = "opensearch-node-group"
}

variable "desired_size" {
  description = "Desired number of worker nodes in the EKS cluster"
  default     = 2
}

variable "max_size" {
  description = "Maximum number of worker nodes in the EKS cluster"
  default     = 3
}

variable "min_size" {
  description = "Minimum number of worker nodes in the EKS cluster"
  default     = 1
}

