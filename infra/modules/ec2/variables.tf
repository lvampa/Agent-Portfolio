variable "project_name" {
  type = string
}

variable "subnet_ids" {
  description = "Subnet IDs for ECS capacity"
  type        = list(string)
}

variable "security_group_id" {
  description = "Security group (SSH from home IP, 443 from Cloudflare)"
  type        = string
}

variable "ec2_keypair_name" {
  description = "Key pair for SSH"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "ecs_cluster_name" {
  description = "ECS cluster name to register instances with"
  type        = string
}

# Cert contents as base64 (from your local cert files in root)
variable "cert_body_b64" {
  description = "Certificate body (PEM) base64-encoded"
  type        = string
  sensitive   = true
}

variable "cert_chain_b64" {
  description = "Certificate chain (PEM) base64-encoded"
  type        = string
  sensitive   = true
}

variable "cert_private_key_b64" {
  description = "Private key (PEM) base64-encoded"
  type        = string
  sensitive   = true
}
