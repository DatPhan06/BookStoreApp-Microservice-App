#!/bin/bash

# Set up color for outputs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Xác định prefix cho Docker Hub repository (thay thế bằng username của bạn)
# DOCKER_HUB_PREFIX="datfan06"
DOCKER_HUB_PREFIX=${1:-"datfan06"}  # default prefix is datfan06

# Chọn mode: local (chỉ build), minikube (build và load), docker-hub (build và push)
MODE=${1:-"docker-hub"}  # default mode is minikube

# echo -e "${GREEN}Building images in $MODE mode...${NC}"
echo -e "${GREEN}Building images in $MODE mode for Docker Hub user: $DOCKER_HUB_PREFIX...${NC}"

# Danh sách các service cần build bằng Maven
MAVEN_SERVICES=(
    "bookstore-account-service"
    "bookstore-billing-service"
    "bookstore-catalog-service"
    "bookstore-order-service"
    "bookstore-payment-service"
    "bookstore-api-gateway-service"
)

# Build các Maven service
for service in "${MAVEN_SERVICES[@]}"; do
    echo -e "${YELLOW}Building $service with Maven...${NC}"
    cd $service
    mvn clean package -DskipTests
    cd ..
done

# Danh sách tất cả các service cần build Docker image
SERVICES=(
    # Java services (dùng Dockerfile trong thư mục tương ứng)
    "bookstore-account-service:bookstore-account-service:bookstore-account-service-0.0.1-SNAPSHOT.jar"
    "bookstore-billing-service:bookstore-billing-service:bookstore-billing-service-0.0.1-SNAPSHOT.jar"
    "bookstore-catalog-service:bookstore-catalog-service:bookstore-catalog-service-0.0.1-SNAPSHOT.jar"
    "bookstore-order-service:bookstore-order-service:bookstore-order-service-0.0.1-SNAPSHOT.jar"
    "bookstore-payment-service:bookstore-payment-service:bookstore-payment-service-0.0.1-SNAPSHOT.jar"
    "bookstore-api-gateway-service:bookstore-zuul-api-gateway-server:bookstore-api-gateway-service-0.0.1-SNAPSHOT.jar"
    
    # Các service không cần build Maven (chỉ có Dockerfile)
    "bookstore-prometheus:bookstore-prometheus:"
    "bookstore-graphana:graphana:"
    "bookstore-telegraph:bookstore-telegraf:"
)

# Build và load/push Docker images
for service_info in "${SERVICES[@]}"; do
    # Phân tách thông tin: thư_mục:tên_image:jar_file
    IFS=':' read -r directory image_name jar_file <<< "$service_info"
    
    echo -e "${YELLOW}Building Docker image for $image_name...${NC}"
    
    # Build Docker image
    if [ -n "$jar_file" ]; then
        # Nếu có JAR file, thêm build-arg
        docker build -t $image_name:latest ./$directory -f ./$directory/Dockerfile --build-arg JAR_FILE=$jar_file
    else
        # Nếu không có JAR file
        docker build -t $image_name:latest ./$directory -f ./$directory/Dockerfile
    fi
    
    # Xử lý theo mode
    if [ "$MODE" == "minikube" ]; then
        echo -e "${YELLOW}Loading $image_name into minikube...${NC}"
        minikube image load $image_name:latest
    elif [ "$MODE" == "docker-hub" ]; then
        # Tag với prefix Docker Hub
        docker tag $image_name:latest $DOCKER_HUB_PREFIX/$image_name:latest
        echo -e "${YELLOW}Pushing $DOCKER_HUB_PREFIX/$image_name to Docker Hub...${NC}"
        docker push $DOCKER_HUB_PREFIX/$image_name:latest
    fi
    
    echo -e "${GREEN}Successfully processed $image_name${NC}"
done

echo -e "${GREEN}All services have been built and processed successfully in $MODE mode!${NC}" 