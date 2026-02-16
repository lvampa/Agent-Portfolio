#!/bin/bash
set -e

# Register with ECS cluster
echo "ECS_CLUSTER=${ecs_cluster_name}" >> /etc/ecs/ecs.config
echo "ECS_ENABLE_TASK_IAM_ROLE=true" >> /etc/ecs/ecs.config

# Write certs from embedded base64 (injected by OpenTofu from your cert files)
# ECS task mounts /opt/certs so Caddy container can read TLS certs
mkdir -p /opt/certs
echo "${cert_body_b64}" | base64 -d > /opt/certs/certificate.pem
echo "${cert_chain_b64}" | base64 -d > /opt/certs/chain.pem
echo "${cert_private_key_b64}" | base64 -d > /opt/certs/private.key
cat /opt/certs/certificate.pem /opt/certs/chain.pem > /opt/certs/fullchain.pem
chmod 644 /opt/certs/*.pem
chmod 600 /opt/certs/private.key
