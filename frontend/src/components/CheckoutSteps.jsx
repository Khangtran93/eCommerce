import { Nav } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { NavLink } from 'react-router-dom'


const CheckoutSteps = ({step1, step2, step3, step4}) => {
  return (
    <Nav className='justify-content-center mb-4' >
        <Nav.Item style={{margin: '10px'}}>
            {step1 ? (
                <LinkContainer to='/login' >
                    <NavLink>Sign In</NavLink>
                </LinkContainer>
            ) : (<NavLink disabled>Sign In</NavLink>)}
        </Nav.Item>

        <Nav.Item style={{margin: '10px'}}>
            {step2 ? (
                <LinkContainer to='/shipping' >
                <NavLink>Shipping</NavLink>
                </LinkContainer>
            ) : (<NavLink disabled>Shipping</NavLink>)}
        </Nav.Item>

        <Nav.Item style={{margin: '10px'}}>
            {step3 ? (
                <LinkContainer to='/payment' >
                   <NavLink>Payment</NavLink> 
                </LinkContainer>
            ) : (<NavLink disabled>Payment</NavLink>)}
        </Nav.Item>

        <Nav.Item style={{margin: '10px'}}>
            {step4 ? (
                <LinkContainer to='/placeorder' >
                    <NavLink>Place Order</NavLink>
                </LinkContainer>
            ) : (<NavLink disabled>Place Order</NavLink>)}
        </Nav.Item>
    </Nav>
  )
}

export default CheckoutSteps