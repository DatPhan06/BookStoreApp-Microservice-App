import axios from 'axios';

const BACKEND_API_GATEWAY_URL = process.env.REACT_APP_BACKEND_API_GATEWAY_URL || 'http://localhost:8765';

export const fetchBooks = async () => {
  try {
    const response = await axios.get(`${BACKEND_API_GATEWAY_URL}/api/catalog/products?page=0&size=1000`);
    return response.data.page.content || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

export const fetchProductReviews = async (productId) => {
  try {
    const response = await axios.get(`${BACKEND_API_GATEWAY_URL}/api/catalog/review?productId=${productId}`);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
}; 