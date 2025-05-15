import React from 'react';
import { BACKEND_API_GATEWAY_URL } from '../constants/appConstants';
import { Card } from 'react-bootstrap';
import Rating from './Rating';
import { Link } from 'react-router-dom';
import './Product.css';

const Product = (props) => {
  const product = props.product;
  return (
    <Card className='product-card'>
      <div className="product-image-container">
        <Link to={`/product/${product.productId}`}>
          <Card.Img
            className="product-image"
            src={`${BACKEND_API_GATEWAY_URL}/api/catalog/image/${product?.imageId}`}
            alt={product.productName}
          />
        </Link>
        
        {/* Badge hiển thị nếu sách mới */}
        {product.isNew && (
          <div className="product-badge">Mới</div>
        )}
      </div>
      
      <div className="product-body">
        {product.productCategory && (
          <div className="product-category">{product.productCategory}</div>
        )}
        
        <h3 className="product-title">
          <Link to={`/product/${product.productId}`}>
            {product.productName}
          </Link>
        </h3>
        
        <div className="product-rating">
          <Rating 
            value={product.averageRating} 
            text={`${product.noOfRatings} đánh giá`} 
          />
        </div>
        
        <div className="product-price">
          <span className="product-price-currency">$</span>
          {product.price}
        </div>
      </div>
    </Card>
  );
};

export default Product;