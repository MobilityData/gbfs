terraform {
  backend "s3" {
    bucket         = "gbfs-backup.bucket.2024"  # Use the S3 bucket you created for the state file
    key            = "terraform/state/gbfs-project/terraform.tfstate"
    region         = "eu-west-2"
    encrypt        = true                           # Enable encryption
  }
}
