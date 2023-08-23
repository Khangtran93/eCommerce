import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Row, Col, Image, ListGroup, Card } from 'react-bootstrap'
import CheckoutSteps from '../components/CheckoutSteps'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { useCreateOrderMutation } from '../slices/orderApiSlice'
import { clearCartItems } from '../slices/cartSlice'
import { toast } from 'react-toastify'
import Meta from '../components/Meta'


const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const userInfo = useSelector((state)=> state.auth)
  const user = userInfo.userInfo;
  const dispatch = useDispatch();
  
  const [createOrder, {isLoading, error}] = useCreateOrderMutation();

  console.log("Error: ", error);

  useEffect(() => {
    if (!cart.shippingAddress.address){
      navigate('/shipping');
    }else if (!cart.paymentMethod){
      navigate('/payment')
    }
    }, [cart.shippingAddress.address, cart.paymentMethod, navigate])


    const placeOrderHandler = async () => {
      try {
        const res = await createOrder({
          user: user._id,
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        }).unwrap();
        console.log("res: ", res)
        navigate(`/orders/${res._id}`);
        dispatch(clearCartItems());
       
      } catch (error) {
        toast.error(error);
      }
    }

    return (
      <>
        <Meta title="Place Order"/>
        <CheckoutSteps step1 step2 step3 step4/>
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>Shipping</h3>
                <strong>Address: </strong>
                {cart.shippingAddress.address}{' '}{cart.shippingAddress.city}
                {' '}{cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
              </ListGroup.Item>

              <ListGroup.Item>
                <h3>Payment</h3>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order items: </h2>
                {cart.cartItems.length === 0 ? (
                  <Message variant='danger'>Your cart is empty.</Message>
                ) : (
                  <ListGroup variant='flush'>
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image src={item.image} alt={item.name} fluid rounded></Image>
                          </Col>

                          <Col>
                            <Link to={`/product/${item._id}`}>
                            {item.name}
                            </Link> 
                          </Col>

                          <Col>
                            ${ item.price } x { item.qty } =  {' '}${ item.price * item.qty }
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>

            </ListGroup>
          </Col>
          
          
          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>

                <ListGroup.Item>
                     <h2>Order Summary</h2>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Items:</Col>
                    <Col>${cart.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Shipping:</Col>             
                    <Col>${cart.shippingPrice}</Col>                                         
                  </Row>
                </ListGroup.Item>
                  
                <ListGroup.Item>
                  <Row>
                    <Col>Tax:</Col>             
                    <Col>${cart.taxPrice}</Col>                                         
                  </Row>
                </ListGroup.Item>
                  
                <ListGroup.Item>
                  <Row>
                    <Col>Total:</Col>             
                    <Col>${cart.totalPrice}</Col>                                         
                  </Row>
                </ListGroup.Item>
                
                {error && (
                  <ListGroup.Item>
                    <Message variant="danger">
                      There was an error.
                    </Message>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button type='button' className='btn-block' disabled={cart.cartItems.length===0} onClick={placeOrderHandler}>
                      Place Order
                  </Button>
                  {isLoading && <Loader/>}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
    )
}

export default PlaceOrderScreen