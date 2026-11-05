module "route53" {
  count  = var.enable_custom_domain ? 1 : 0
  source = "./modules/Route53"

  domain_name = var.domain_name
  comment     = "Hosted zone for ${var.domain_name} managed by Terraform EKS GitOps"

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

