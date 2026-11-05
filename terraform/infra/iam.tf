# -----------------------------------------------------------------------------
# IRSA Role for AWS Load Balancer Controller
# -----------------------------------------------------------------------------
module "alb_controller_role" {
  source = "./modules/iam-role-for-service-accounts-eks"

  role_name                 = "${var.cluster_name}-aws-load-balancer-controller"
  role_description          = "IAM Role for AWS Load Balancer Controller in EKS"
  oidc_provider_arn         = aws_iam_openid_connect_provider.this.arn
  oidc_provider_url         = replace(aws_eks_cluster.this.identity[0].oidc[0].issuer, "https://", "")
  service_account_namespace = "kube-system"
  service_account_name      = "aws-load-balancer-controller"
  policy_json               = module.alb_controller_role.aws_load_balancer_controller_policy_json

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# -----------------------------------------------------------------------------
# IRSA Role for ExternalDNS
# -----------------------------------------------------------------------------
module "external_dns_role" {
  source = "./modules/iam-role-for-service-accounts-eks"

  role_name                 = "${var.cluster_name}-external-dns"
  role_description          = "IAM Role for ExternalDNS in EKS"
  oidc_provider_arn         = aws_iam_openid_connect_provider.this.arn
  oidc_provider_url         = replace(aws_eks_cluster.this.identity[0].oidc[0].issuer, "https://", "")
  service_account_namespace = "external-dns"
  service_account_name      = "external-dns"
  policy_json               = module.external_dns_role.external_dns_policy_json

  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}
