import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Badge, NavDropdown } from "react-bootstrap"
import {FaShoppingCart, FaUser} from "react-icons/fa"
import { LinkContainer } from 'react-router-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useLogoutMutation } from '../slices/usersApiSlice'
import { logout } from '../slices/authSlice'
import { clearCartItems } from '../slices/cartSlice'
import "../index.css"
import SearchBox from './SearchBox'

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo} = useSelector((state) => state.auth);

  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try{
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(clearCartItems());
      navigate('/login');
    }
   catch (error) {
    console.log("error")
  }
}
  return (
    <header>
    <Navbar bg="dark" variant='dark' expand='lg' collapseOnSelect style={{padding: "1rem"}}>
        <Container>
        <LinkContainer to='/'>
            <Navbar.Brand >Playtech</Navbar.Brand>
        </LinkContainer>
            
          <Navbar.Toggle aria-controls='basic-navbar-nav'/>
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ml-auto'>
              <SearchBox/>
              <LinkContainer to='/cart'>
                <Nav.Link >
                <FaShoppingCart className='nav-items'/>Cart
                { cartItems.length > 0 && (
                  <Badge pill bg='primary' style={{marginLeft: '5px'}}>
                  {cartItems.reduce((acc, curItem) => acc + curItem.qty, 0)}

                  </Badge>
                )
                  
                }
                </Nav.Link>
              </LinkContainer>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id='username' style={{marginRight: '10px'}}>
                    <LinkContainer to='/profile'>
                      <NavDropdown.Item>
                        Profile
                      </NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to='/logout'>
                      <NavDropdown.Item onClick={logoutHandler}>
                        Logout
                      </NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                ) : 
                (<LinkContainer to='/login'>
                  <Nav.Link ><FaUser className='nav-items'/>Sign In</Nav.Link>
              </LinkContainer>)}

              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id='admin'>
                  <LinkContainer to='/admin/orderlist'>
                    <NavDropdown.Item>
                      Show Orders
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/userlist'>
                    <NavDropdown.Item>
                      Show Users
                    </NavDropdown.Item>
                  </LinkContainer>

                  <LinkContainer to='/admin/productlist'>
                    <NavDropdown.Item>
                      Show Products
                    </NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
              

            </Nav>
            
          </Navbar.Collapse>
        </Container>
    </Navbar>
    </header>
  ) }


export default Header