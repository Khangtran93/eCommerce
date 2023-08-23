import { useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import { Table, Form, Button, Row, Col } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {FaTimes} from 'react-icons/fa'
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useUpdateProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/orderApiSlice';
import Meta from '../components/Meta';


const ProfileScreen = () => {
    const {userInfo} = useSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();

    const [updateProfile, {isLoading: loadingUpdateProfile}] = useUpdateProfileMutation();

    const { data: orders, isLoading, error} = useGetMyOrdersQuery();

    useEffect(() => {
        if(userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email)

        }
    }, [userInfo.name, userInfo.email])

    const submitHandler = async (e) => {
        e.preventDefault();
        if(password !== confirmPassword){
            toast.error("Password do not match")
        }
        else {
            try {
                const res = await updateProfile({_id: userInfo._id, name, email, password}).unwrap();
                dispatch(setCredentials({...res}));
                toast.success("Profile updated successfully.")
            } catch (error) {
                toast.error(error?.data?.message || error?.error)
            }
        }
       

    }
  return (
    <Row>
        <Meta title="Your Profile"/>
        <Col md={3}>
        <h3>User Profile</h3>
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    type='text'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}>                       
                    </Form.Control>  
                </Form.Group>

                <Form.Group controlId='email' className='my-2'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                    type='email'
                    placeholder='Enter email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}>                       
                    </Form.Control>  
                </Form.Group>

                <Form.Group controlId='password' className='my-2'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type='password'
                    placeholder='Enter password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>                       
                    </Form.Control>  
                </Form.Group>

                <Form.Group controlId='name' className='my-2'>
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}>                       
                    </Form.Control>  
                </Form.Group>

                <Button type='submit' variant='primary'>Update</Button>
                {loadingUpdateProfile && <Loader/>}
            </Form>
        </Col>

        <Col md={9}>
            <h3>My Orders</h3>
            {isLoading ? (<Loader/>) : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) : (
                <Table striped hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <td>ORDER ID</td>
                            <td>DATE</td>
                            <td>TOTAL</td>
                            <td>PAID</td>
                            <td>DELIVERED</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => (
                            <tr key={index}>
                                <td><Link to={`/orders/${order._id}`}>
                                {order._id}
                                </Link></td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>${order.totalPrice}</td>
                                <td>{order.isPaid ? (order.paidAt.substring(0,10)) : (<FaTimes style={{color: 'red'}}/>)}</td>
                                <td>{order.isDelivered ? (order.deliveredAt.substring(0,10)) : (<FaTimes style={{color: 'red'}}/>) }</td>
                                <td>
                                    <LinkContainer to={`/orders/${order._id}`}>
                                        <Button variant='light'>Details</Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    

                    </tbody>
                </Table>
            )}
        </Col>
    </Row>
  )
}

export default ProfileScreen