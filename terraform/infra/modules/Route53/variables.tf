variable "domain_name" {
  description = "The root domain name for the hosted zone (e.g. example.com)"
  type        = string
}

variable "comment" {
  description = "Comment for the hosted zone"
  type        = string
  default     = "Managed by Terraform for EKS GitOps"
}

variable "tags" {
  description = "Tags for the Route53 hosted zone"
  type        = map(string)
  default     = {}
}
