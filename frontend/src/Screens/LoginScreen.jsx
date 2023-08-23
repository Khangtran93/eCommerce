import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { useLoginMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'
import Meta from '../components/Meta'

const LoginScreen = () => {
    const [email, setEmail]  = useState('');
    const [ password, setPassword ] = useState('')

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [login, {isLoading}] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';
    console.log("redirect is ", search);

    //if there is userInfo, navigate to the redirect (will be either the root path or whatever the current URL is)
    useEffect(() => {
        if(userInfo){
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({email, password}).unwrap(); //call reducer function login in usersApiSlice and pass in an object contain email and password
            dispatch(setCredentials({...res})); //call dispatch(setCredentials) and pass in a copy of res object (spread operator) to avoid mutating the original
            navigate(redirect);
        }
        catch (err) {
            toast.error(err?.data?.message || err.error)
        }
       
    }
  return (
    <FormContainer>
        <Meta title="Login"/>
        <h1>Sign In</h1>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='email' className='my-3'>
                <Form.Label>
                    Email Address
                </Form.Label>
                <Form.Control
                type='email'
                placeholder='Enter Email'
                value={email}
                onChange={(e) => {setEmail(e.target.value)}}>
                </Form.Control>
            </Form.Group>

            <Form.Group controlId='password' className='my-3'>
                <Form.Label>
                    Password
                </Form.Label>
                <Form.Control
                type='password'
                placeholder='Enter Password'
                value={password}
                onChange={(e) => {setPassword(e.target.value)}}>
                </Form.Control>
            </Form.Group>

            <Button variant='primary'
            type='submit'
            disabled={isLoading}
            className='mt-2'>
                Sign In
            </Button>

            {isLoading && <Loader/>}
            <Row className='py-3'>
                <Col>
                    New Customer? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
                </Col>
            </Row>
        </Form>
    </FormContainer>
  )
}

export default LoginScreen