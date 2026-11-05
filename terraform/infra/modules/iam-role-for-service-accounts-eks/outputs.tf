output "role_arn" {
  description = "ARN of the IAM role created for the ServiceAccount"
  value       = aws_iam_role.this.arn
}

output "role_name" {
  description = "Name of the IAM role created"
  value       = aws_iam_role.this.name
}

output "external_dns_policy_json" {
  description = "Standard ExternalDNS IAM policy document JSON"
  value       = data.aws_iam_policy_document.external_dns.json
}

output "aws_load_balancer_controller_policy_json" {
  description = "Standard AWS Load Balancer Controller IAM policy document JSON"
  value       = data.aws_iam_policy_document.aws_load_balancer_controller.json
}

