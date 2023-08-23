import Meta from '../../components/Meta'
import { Row, Col, Card, Table, ListGroup, Button} from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useGetUserByIdQuery} from '../../slices/usersApiSlice'
import { useGetUsersOrdersQuery } from '../../slices/orderApiSlice'
import {Link} from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap';
import {FaCheck, FaTimes} from 'react-icons/fa'
import Message from '../../components/Message';
import Loader from '../../components/Loader';

const UserScreen = () => {
  const {id: userId} = useParams();
  const {data: user, isLoading, error} = useGetUserByIdQuery(userId);
  const {data: orders, isLoading: loadingOrders, error: errorOrder} = useGetUsersOrdersQuery(userId);

  return (
    <>
    {isLoading ? (<Loader/>) ? error : <Message variant='danger'>{error}</Message> :(
      <Row>
        <Meta title={`${user.name} Profile`}/>
        <Col md={3}>
        <h3>User Details</h3>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <strong>Name: </strong>
              <p>{user.name}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <strong>Email: </strong>
              <p>{user.email}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <strong>Admin Status: </strong>
              <p>{user.isAdmin ? <FaCheck style={{color: 'green'}}/> : <FaTimes style={{color: 'red'}}/>}</p>
            </ListGroup.Item>

            <ListGroup.Item>
              <strong>Member Since: </strong>
              <p>{user.createdAt.substring(0,10)}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={9}>
             <h3>Orders</h3>
              {loadingOrders ? <Loader/> : errorOrder ? <Message variant='danger'>{errorOrder}</Message> : (
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
                        {orders.length === 0 ? <Message style={{width: '100%'}} variant='danger'>No order to show.</Message> : (
                          orders.map((order, index) => (
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
                        ))
                        )}
                        
                    

                    </tbody>
                </Table>
              )}
            {/*{isLoading ? (<Loader/>) : error ? (<Message variant='danger'>{error?.data?.message || error.error}</Message>) : (
                
            )} */}
        </Col>
    </Row>
    )}
   
  </>)
}



export default UserScreen