output "zone_id" {
  description = "The Hosted Zone ID"
  value       = aws_route53_zone.this.zone_id
}

output "name_servers" {
  description = "The 4 Route53 nameservers to register at your domain registrar"
  value       = aws_route53_zone.this.name_servers
}

output "domain_name" {
  description = "The registered domain name"
  value       = aws_route53_zone.this.name
}
