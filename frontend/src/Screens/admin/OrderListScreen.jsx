import { LinkContainer } from "react-router-bootstrap"
import { Table, Button } from 'react-bootstrap'
import { Link } from "react-router-dom"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { useGetOrdersQuery } from "../../slices/orderApiSlice"
import { FaTimes } from 'react-icons/fa'
import Meta from "../../components/Meta"

const OrderListScreen = () => {
  const {data: orders, isLoading, error} = useGetOrdersQuery();
  return (
    <>
    <Meta title="Order List"/>
      <h2>Orders</h2>
      {isLoading ? (<Loader/>): error ? (<Message variant='danger'>{error.error}</Message>) : (
        <Table striped hover responsive className="table-sm">
          <thead>
            <tr>
              <td>ID</td>
              <td>USER</td>
              <td>DATE</td>
              <td>TOTAL</td>
              <td>PAID</td>
              <td>DELIVERED</td>
              <td></td>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td><Link to={`/orders/${order._id}`}>{order._id}</Link></td>
                <td>{order?.user?.name}</td>
                <td>{order.createdAt.substring(0,10)}</td>
                <td>${order.totalPrice}</td>
                <td>{order.isPaid ? (<span style={{color: 'green'}}>{order.paidAt.substring(0,10)} </span>) : (<FaTimes style={{color: 'red'}}/>) }</td>
                <td>{order.isDelivered ? (<span style={{color: 'green'}}>{order.deliveredAt.substring(0,10)}</span>) : (<FaTimes style={{color: 'red'}}/>) }</td>
                <td><LinkContainer to={`/orders/${order._id}`}><Button variant='light'>Details</Button></LinkContainer></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrderListScreen