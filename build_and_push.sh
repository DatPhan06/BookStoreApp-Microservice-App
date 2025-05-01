#!/bin/bash

# List of services to build and push
services=(
    "bookstore-account-service"
    "bookstore-billing-service"
    "bookstore-catalog-service"
    "bookstore-order-service"
    "bookstore-payment-service"
    "bookstore-api-gateway-service"
    "bookstore-eureka-discovery-service"
)

# Build and push each service
for service in "${services[@]}"; do
    echo "Building $service..."
    cd $service
    # Build the service with Maven
    mvn clean package -DskipTests
    # Build and push Docker image
    docker build -t datfan06/$service:latest .
    docker push datfan06/$service:latest
    cd ..
    echo "Successfully built and pushed $service"
done

echo "All services have been built and pushed successfully!" 