import React from 'react'
import { useState } from 'react'
import { Form, Button, FormGroup, FormControl} from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../slices/cartSlice'
import CheckoutSteps from '../components/CheckoutSteps'
import Meta from '../components/Meta'

const ShippingScreen = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [address, setAdress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');
    
    const submidHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({address, city, postalCode, country}));
        navigate('/payment');
    }
  return (
    
    <FormContainer>
    <Meta title="Shipping"/>
    <CheckoutSteps step1 step2/>
    <h2>Shipping</h2>
        <Form onSubmit={submidHandler}> 
            <FormGroup controlId='address' className='my-2'>
                <Form.Label>Address</Form.Label>
                <FormControl
                type='text'
                required
                value={address}
                onChange={(e) =>setAdress(e.target.value)}>

                </FormControl>
            </FormGroup>

            <FormGroup controlId='city' className='my-2'>
                <Form.Label>City</Form.Label>
                <FormControl
                type='text'
                required
                value={city}
                onChange={(e) =>setCity(e.target.value)}>

                </FormControl>
            </FormGroup>

            <FormGroup controlId='postalCode' className='my-2'>
                <Form.Label>Postal Code</Form.Label>
                <FormControl
                type='text'
                required
                value={postalCode}
                onChange={(e) =>setPostalCode(e.target.value)}>

                </FormControl>
            </FormGroup>

            <FormGroup controlId='country' className='my-2'>
                <Form.Label>Address</Form.Label>
                <FormControl
                type='text'
                required
                value={country}
                onChange={(e) =>setCountry(e.target.value)}>

                </FormControl>
            </FormGroup>
            <Button variant='primary' type='submit'>Continue</Button>
        </Form>
    </FormContainer>
  )
}

export default ShippingScreen