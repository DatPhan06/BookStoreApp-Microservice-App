import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap';
import Message from '../components/Message';
import CartItem from '../components/CartItem';
import { addToCartAction, getCartDetailsAction } from '../actions/cartActions';
import FullPageLoader from '../components/FullPageLoader';

const CartScreen = ({ match, location }) => {
  const productId = match.params.id;
  const qty = location.search ? Number(location.search.split('=')[1]) : 1;
  const dispatch = useDispatch();
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const cartState = useSelector((state) => state.cart);
  const { cart } = cartState;
  let loading = cartState.loading;
  let error = cartState.error;
  const { userInfo } = userLogin;
  const redirect = location.pathname + location.search;

  useEffect(() => {
    if (userInfo === null || userInfo === undefined) {
      history.push(`/login?redirect=${redirect}`);
      return;
    }
    if (productId) {
      dispatch(addToCartAction(productId, qty));
    } else {
      dispatch(getCartDetailsAction());
    }
  }, [dispatch, productId, qty, userInfo, history]);

  const checkoutHandler = () => {
    history.push('/login?redirect=shipping');
  };

  return (
    <>
      {error ? (
        <Message variant='danger'> {JSON.stringify(error.message)}</Message>
      ) : (
        <>
          <Row>
            <h1>Shopping Cart</h1>
          </Row>
          <Row>
            <Col md={8}>
              {cart == null || cart?.cartItems?.length == 0 ? (
                <Message>
                  Your cart is empty <Link to='/'>Go Back</Link>
                </Message>
              ) : (
                <ListGroup.Item variant='flush'>
                  {cart?.cartItems?.map((item) => (
                    <CartItem key={item.productId} item={item} addToCart={addToCartAction}></CartItem>
                  ))}
                </ListGroup.Item>
              )}
              <Row className='m-5 justify-content-md-center'>
                <Link to={'/'}>Add more books</Link>
              </Row>
            </Col>
            <Col md={4}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <h3>Subtotal ({cart?.cartItems?.length}) Items</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <h3>${cart?.totalPrice}</h3>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Button type='button' className='btn-block' disabled={cart?.cartItems?.length === 0} onClick={checkoutHandler}>
                      Proceed To Checkout
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      )}
      {loading && <FullPageLoader></FullPageLoader>}
    </>
  );
};

export default CartScreen;
