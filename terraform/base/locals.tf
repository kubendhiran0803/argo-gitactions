locals {
  cluster_name = "${var.project_name}-${var.environment}"

  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    Layer       = "base"
    ManagedBy   = "Terraform"
  }
}
