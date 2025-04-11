import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { isAdmin } from '../service/CommonUtils';
import { logout } from '../actions/userActions';

const Header = () => {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar
        style={{
          background: 'linear-gradient(142deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 68%, rgba(252,176,69,1) 100%)',
          border: '0',
          color: '#00000'
        }}
        className='navbar navbar-expand-lg navbar-dark'
        collapseOnSelect
      >
        <Container>
          <Link to='/'>
            <Navbar.Brand className='bookstore-brand'>BookStore</Navbar.Brand>
          </Link>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='navbar-nav ml-auto'>
              <Link to='/cart' className='nav-link'>
                <i className='fas fa-shopping-cart'></i> Cart
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo.userName} id='username'>
                  <Link to='/userProfile' className='dropdown-item'>
                    Profile
                  </Link>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Link to='/login' className='nav-link'>
                  <i className='fas fa-user'></i> Sign In
                </Link>
              )}
              {userInfo && isAdmin() && (
                <NavDropdown title='Admin' id='adminmenu'>
                  <Link to='/admin/userlist' className='dropdown-item'>
                    Users
                  </Link>
                  <Link to='/admin/productlist' className='dropdown-item'>
                    Products
                  </Link>
                  <Link to='/admin/orderlist' className='dropdown-item'>
                    Orders
                  </Link>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
