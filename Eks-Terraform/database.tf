# RDS MySQL Instance
resource "aws_db_instance" "mysql" {
  engine            = "mysql"
  instance_class    = var.db_instance_class
  db_name           = var.db_name
  username          = var.db_username
  password          = var.db_password
  allocated_storage = 20
  vpc_security_group_ids = [aws_security_group.eks_sg.id]  # Attach VPC security group for RDS
  db_subnet_group_name   = aws_db_subnet_group.db_subnet.name

  # Add identifier to reflect the desired RDS instance name
  identifier = "gbfs-rds-instance"

  # Enabling Multi-AZ for higher availability (optional)
  multi_az = false

  # Storage autoscaling (optional)
  max_allocated_storage = 100

  tags = {
    Name = "gbfs-rds-instance"
  }
}

# Subnet group for RDS instance
resource "aws_db_subnet_group" "db_subnet" {
  name       = "gbfs-db-subnet-group"
  subnet_ids = [aws_subnet.subnet1.id, aws_subnet.subnet2.id]  # Attach VPC subnets

  tags = {
    Name = "gbfs-db-subnet-group"
  }
}

