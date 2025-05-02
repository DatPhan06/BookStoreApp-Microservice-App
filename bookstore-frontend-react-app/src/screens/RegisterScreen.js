import React, { useEffect } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import { register } from '../actions/userActions';
import Message from '../components/Message';
import FullPageLoader from '../components/FullPageLoader';
import { USER_REGISTER_RESET } from '../constants/userConstants';

const RegisterScreen = ({ location }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search
    ? new URLSearchParams(location.search).get('redirect') || '/'
    : '/';

  useEffect(() => {
    console.log('RegisterScreen useEffect triggered. userInfo:', userInfo, 'redirect:', redirect);

    if (userInfo) {
      console.log('User registered. Redirecting to:', redirect);
      history.push(redirect);
      return;
    }

    const handleMessage = (event) => {
      console.log('RegisterScreen received message:', event);
      if (event.origin !== 'http://localhost:5678') {
        console.log('Invalid origin:', event.origin);
        return;
      }

      const { type, data } = event.data;
      console.log('Message data:', { type, data });

      if (
        type === 'register' &&
        data.userName &&
        data.firstName &&
        data.email &&
        data.password
      ) {
        console.log('Dispatching register with:', data);
        dispatch(register(data.userName, data.firstName, data.email, data.password));
      } else {
        console.error('Invalid register message data:', { type, data });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      console.log('Removing RegisterScreen message event listener');
      window.removeEventListener('message', handleMessage);
    };
  }, [history, userInfo, redirect, dispatch]);

  const handleRegisterClick = () => {
    console.log('Register button clicked. Opening localhost:3001/register');
    dispatch({ type: USER_REGISTER_RESET });
    window.open('http://localhost:5678/register', '_blank');
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
          onClick={handleRegisterClick}
          style={{ width: '150px', marginBottom: '15px' }}
        >
          Register
        </Button>
        <Row className="py-3">
          <Col>
            Have an account?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
          </Col>
        </Row>
        {loading && <FullPageLoader />}
      </div>
    </div>
  );
};

export default RegisterScreen;