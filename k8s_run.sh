# Create the namespace
kubectl apply -f k8s/namespace.yaml

# Deploy all services
kubectl apply -f k8s/mysql.yaml
kubectl apply -f k8s/consul.yaml
kubectl apply -f k8s/zuul-gateway.yaml
kubectl apply -f k8s/account-service.yaml
kubectl apply -f k8s/billing-service.yaml
kubectl apply -f k8s/catalog-service.yaml
kubectl apply -f k8s/order-service.yaml
kubectl apply -f k8s/payment-service.yaml
kubectl apply -f k8s/zipkin.yaml
kubectl apply -f k8s/prometheus.yaml
kubectl apply -f k8s/grafana.yaml
kubectl apply -f k8s/tick-stack.yaml
kubectl apply -f k8s/frontend.yaml