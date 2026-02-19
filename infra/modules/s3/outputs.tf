output "bucket_id" {
  description = "S3 bucket name (for uploads)"
  value       = aws_s3_bucket.this.id
}

output "bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.this.arn
}

output "website_endpoint" {
  description = "S3 website endpoint hostname (use for CNAME in Cloudflare)"
  value       = aws_s3_bucket_website_configuration.this.website_endpoint
}

output "website_domain" {
  description = "S3 website domain"
  value       = aws_s3_bucket_website_configuration.this.website_domain
}

output "website_url" {
  description = "URL of the static website (HTTP)"
  value       = "http://${aws_s3_bucket_website_configuration.this.website_endpoint}"
}
