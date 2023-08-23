import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, FormGroup, FormLabel, FormControl } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { useRegisterMutation } from '../slices/usersApiSlice'
import { setCredentials } from '../slices/authSlice'
import { toast } from 'react-toastify'
import Meta from '../components/Meta'

const RegisterScreen = () => {
    const [name, setName]  = useState('');
    const [email, setEmail]  = useState('');
    const [password, setPassword ] = useState('')
    const [confirmedPassword, setConfirmedPassword]  = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [register, {isLoading}] = useRegisterMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const {search} = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    //if there is userInfo, navigate to the redirect (will be either the root path or whatever the current URL is)
    useEffect(() => {
        if(userInfo){
            navigate(redirect);
        }
    }, [userInfo, redirect, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if(password !== confirmedPassword){
            toast.error("Password don't match");
            console.log('password dont match')
            return;
            
        }
        else {
            try {
                const res = await register({name, email, password}).unwrap();
                dispatch(setCredentials({...res}));
                navigate(redirect);
                console.log('registered')
            }
            catch (err) {
                toast.error(err?.data?.message || err.error)
                // console.log('error registered');
                // navigate(redirect);
            }
        }
      
       
    }
  return (
    <FormContainer>
        <Meta title="Register"/>
        <h1>Sign Up</h1>
        <Form onSubmit={submitHandler}>

            <Form.Group controlId='username' className='my-3'>
                <Form.Label>
                    Username
                </Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter Username'
                value={name}
                onChange={(e) => {setName(e.target.value)}}>
                </Form.Control>

            </Form.Group>
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

            <Form.Group controlId='confirmedPassword' className='my-3'>
                <Form.Label>
                    Confirm password
                </Form.Label>
                <Form.Control
                type='password'
                placeholder='Confirm Password'
                value={confirmedPassword}
                onChange={(e) => {setConfirmedPassword(e.target.value)}}>
                </Form.Control>
            </Form.Group>

            <Button variant='primary'
            type='submit'
            disabled={isLoading}
            className='mt-2'>
                Register
            </Button>

            {isLoading && <Loader/>}
            <Row className='py-3'>
                <Col>
                    Already have an account? {' '} <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
                </Col>
            </Row>
        </Form>
    </FormContainer>
  )
}

export default RegisterScreen;