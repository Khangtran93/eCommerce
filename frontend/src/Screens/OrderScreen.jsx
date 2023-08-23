import { Link, useParams } from 'react-router-dom'
import { Row, Col, ListGroup, Image, Button, Card } from 'react-bootstrap'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { usePayOrderMutation, useGetPaypalClientIdQuery, useGetOrderDetailsQuery } from '../slices/orderApiSlice'
import { useDeliverOrderMutation } from '../slices/orderApiSlice'
import Meta from '../components/Meta'

const OrderScreen = () => {
    const { id: orderId } = useParams();
    const {data: order, refetch, isLoading, error} = useGetOrderDetailsQuery(orderId);
    
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();

    const [ {isPending }, paypalDispatch] = usePayPalScriptReducer(); //paypal documentation

    const {userInfo} = useSelector((state) => state.auth);

    const { data: paypal, isLoading: loadingPaypal, error: errorPaypal} = useGetPaypalClientIdQuery();


    useEffect(() => {
        if(!errorPaypal && !loadingPaypal && paypal.clientdId) {
            const loadPaypalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'clientId': paypal.clientdId,
                        currency: 'USD'
                    }
                });
                paypalDispatch({
                    type: 'setLoadingStatus',
                    value: 'pending'
                })
            };
            // if order found and is not paid
            if (order && !order.isPaid) {

                if(!window.paypal){
                    loadPaypalScript();
                }
            }
        }
    
    }, [order, paypal, paypalDispatch, loadingPaypal, errorPaypal]);

    const deliverOrderHandler = async () => {
        try {
            await deliverOrder(orderId);
            refetch();
            toast.success("Order has been marked as delivered");
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }
    
    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
            try {
                await payOrder({orderId, details});
                refetch();
                toast.success("Payment successful.")
            } catch (error) {
                toast.error(error?.data?.message || error?.message);
            }
        })
     }
    async function onApproveTest() {
        await payOrder({orderId, details : {payer: {} }})
        refetch();
        toast.success("Payment successful")
     }

    function onError(error) {
        toast.error(error.message)
     }

    function createOrder(data, actions) { 
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice
                    },
                },
            ],
    }).then((orderId) => {
        return orderId;
    });
    }


    return isLoading ? <Loader/> : error ? (<Message variant='danger'>No order found.</Message>) : (
        <>
            <Meta title="Order Details"/>
            <h2>Order: {orderId}</h2>
            <Row>
                <Col md={8}>
                    <ListGroup >
                        <ListGroup.Item>
                            <h3>Shipping</h3>
                            <p>
                                <strong>Name: </strong>
                                {order?.user?.name}
                            </p>
                            <p>
                                <strong>Email: </strong>
                                {order?.user?.email}
                            </p>
                            
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address} {order.shippingAddress.city} {order.shippingAddress.postalCode} {order.shippingAddress.country}
                            </p>

                            {order.isDelivered 
                            ? <Message variant='success'>Delivered at: {order.deliveredAt.substring(0,10)}</Message> 
                            : <Message variant='danger'>Not Delivered.</Message>}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h3>Payment Method </h3>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid 
                            ? <Message variant='success'>Paid On: {order.paidAt.substring(0,10)}</Message> 
                            : <Message variant='danger'>Not paid.</Message>}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h3>Order Items</h3>
                            {order.orderItems.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} atl={item.name} fluid rounded/>
                                        </Col>

                                        <Col>
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>                                            
                                        </Col>

                                        <Col> 
                                            ${item.price} x {item.qty} = ${item.price * item.qty}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            )       
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup>
                            <ListGroup.Item>
                                <h3>Order Summary</h3>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Items:
                                    </Col>
                                    <Col>
                                        ${order.itemsPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Shipping:
                                    </Col>
                                    <Col>
                                        ${order.shippingPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Tax
                                    </Col>
                                    <Col>
                                        ${order.taxPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>
                                        Total:
                                    </Col>
                                    <Col>
                                        ${order.totalPrice}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                            {/* if order is not paid, then show a LisGroup.Item */}
                            {!order.isPaid && (
                                <ListGroup.Item>
                                {/* if isLoading is true then show a Loader */}
                                    {isLoading && <Loader/>}
                                    {/* if isPending is true also show a Loader
                                    if not and if user is not an admin, then we want to show the pay buttons */}
                                    {isPending ? <Loader/> : !userInfo.isAdmin && (
                                        <div>
                                            <Button onClick={onApproveTest} style={{marginBottom: '10px'}}>Test Pay Order</Button>
                                            <div>
                                                <PayPalButtons
                                                createOrder={createOrder}
                                                onApprove={onApprove}
                                                onError={onError}>

                                                </PayPalButtons>
                                            </div>
                                        </div>
                                       
                                    )}
                                </ListGroup.Item>
                            )}
                            {/* if order is paid and user is admin, we want to show the button to mark item as delivered */}
                            {userInfo && order.isPaid && userInfo.isAdmin && !order.isDelivered && (
                                <ListGroup.Item>
                                    <Button type='button' variant='dark' className='btn-block'
                                    onClick={deliverOrderHandler}>
                                        Mark as Delivered
                                    </Button>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    )
  
}

export default OrderScreen