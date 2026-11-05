variable "repository_name" {
  description = "Name of the ECR repository"
  type        = string
}

variable "image_tag_mutability" {
  description = "The tag mutability setting for the repository (MUTABLE or IMMUTABLE)"
  type        = string
  default     = "MUTABLE"
}

variable "scan_on_push" {
  description = "Indicates whether images are scanned after being pushed to the repository"
  type        = bool
  default     = true
}

variable "max_image_count" {
  description = "Number of images to retain in repository before expiring older ones"
  type        = number
  default     = 10
}

variable "tags" {
  description = "Tags to attach to the ECR repository"
  type        = map(string)
  default     = {}
}
