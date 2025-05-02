import React, { useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { login } from '../actions/userActions';
import Message from '../components/Message';
import FullPageLoader from '../components/FullPageLoader';

const LoginScreen = ({ location }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const redirect = location.search
    ? new URLSearchParams(location.search).get('redirect') || '/'
    : '/';

  useEffect(() => {
    console.log('LoginScreen useEffect triggered. userInfo:', userInfo, 'redirect:', redirect);

    if (userInfo) {
      console.log('User logged in. Redirecting to:', redirect);
      history.push(redirect);
      return;
    }

    const handleMessage = (event) => {
      console.log('LoginScreen received message:', event);
      if (event.origin !== 'http://localhost:5678') {
        console.log('Invalid origin:', event.origin);
        return;
      }

      const { type, data } = event.data;
      console.log('Message data:', { type, data });

      if (type === 'login' && data.userNameOrEmail && data.password) {
        console.log('Dispatching login with:', data);
        dispatch(login(data.userNameOrEmail, data.password));
      } else {
        console.error('Invalid login message data:', { type, data });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      console.log('Removing LoginScreen message event listener');
      window.removeEventListener('message', handleMessage);
    };
  }, [history, userInfo, redirect, dispatch]);

  const handleLoginClick = () => {
    console.log('Login button clicked. Opening localhost:3001/login');
    window.open('http://localhost:5678/login', '_blank');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center', padding: '20px' }}>
        {error && (
          <Message variant="danger" style={{ marginBottom: '15px' }}>
            {error.message || JSON.stringify(error)}
          </Message>
        )}
        <Button
          variant="primary"
          onClick={handleLoginClick}
          style={{ width: '150px', marginBottom: '15px' }}
        >
          Login
        </Button>
        <Row className="py-3">
          <Col>
            Don't have an account?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
          </Col>
        </Row>
        {loading && <FullPageLoader />}
      </div>
    </div>
  );
};

export default LoginScreen;