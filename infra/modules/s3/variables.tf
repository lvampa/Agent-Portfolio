variable "project_name" {
  description = "Project name used for resource naming (e.g. ai-agent-portfolio)"
  type        = string
}

variable "bucket_name" {
  description = "S3 bucket name (globally unique). Defaults to project-name-frontend."
  type        = string
  default     = null
}
