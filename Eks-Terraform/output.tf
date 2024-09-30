output "eks_cluster_endpoint" {
  description = "EKS Cluster Endpoint"
  value       = aws_eks_cluster.gbfs_cluster.endpoint
}

output "eks_cluster_certificate_authority" {
  description = "EKS Cluster Certificate Authority Data"
  value       = aws_eks_cluster.gbfs_cluster.certificate_authority[0].data
}

output "rds_endpoint" {
  description = "RDS MySQL endpoint"
  value       = aws_db_instance.mysql.endpoint
}


