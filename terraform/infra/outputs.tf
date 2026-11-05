output "eks_cluster_name" {
  description = "The name of the EKS cluster"
  value       = aws_eks_cluster.this.name
}

output "eks_cluster_endpoint" {
  description = "The Kubernetes API server endpoint"
  value       = aws_eks_cluster.this.endpoint
}

output "eks_cluster_arn" {
  description = "The ARN of the EKS cluster"
  value       = aws_eks_cluster.this.arn
}

output "ecr_repository_url" {
  description = "The URL of the ECR repository for the application"
  value       = module.ecr.repository_url
}

output "route53_zone_id" {
  description = "The Hosted Zone ID in Route 53"
  value       = module.route53.zone_id
}

output "route53_nameservers" {
  description = "The 4 Route53 nameservers to copy into your domain registrar"
  value       = module.route53.name_servers
}

output "acm_certificate_arn" {
  description = "The ARN of the validated ACM Certificate"
  value       = aws_acm_certificate.this.arn
}

output "load_balancer_controller_role_arn" {
  description = "IAM Role ARN for AWS Load Balancer Controller IRSA"
  value       = module.alb_controller_role.role_arn
}

output "external_dns_role_arn" {
  description = "IAM Role ARN for ExternalDNS IRSA"
  value       = module.external_dns_role.role_arn
}

output "update_kubeconfig_command" {
  description = "Command to configure kubectl to communicate with your EKS cluster"
  value       = "aws eks update-kubeconfig --region ${var.aws_region} --name ${aws_eks_cluster.this.name}"
}

output "argocd_admin_password_command" {
  description = "Command to retrieve the initial ArgoCD admin password"
  value       = "kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath=\"{.data.password}\" | [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($input))"
}

