import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {  Row, Col, Image, ListGroup, Button, Form, FormGroup } from 'react-bootstrap'
import {IoArrowBackCircleOutline} from 'react-icons/io5'
import Rating from "../components/Rating"
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { toast } from 'react-toastify'
import { addToCart } from "../slices/cartSlice"
import Meta from '../components/Meta'

const ProductScreen = () => {
    const {id: productID} = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [qtyAdded, setQtyAdded] = useState(0);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');

    const { userInfo } = useSelector((state) => state.auth);

    const increaseQtyAdded = () => {
        setQtyAdded(qtyAdded+1)
    }

    const {data: product, isLoading, error, refetch} = useGetProductDetailsQuery(productID);
    const [createReview, {isLoading: loadingReview}] = useCreateReviewMutation(productID);
    
    const addToCartHandler = () => {
        dispatch(addToCart({...product, qty})); 
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createReview({
                productID,
                rating, 
                comment,
            }).unwrap();
            refetch();
            toast.success("Review Submitted")
            setRating(0);
            setComment('');
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }
    return (
    <>
        
        <Link className='go-back' to='/'>
            <IoArrowBackCircleOutline/>
        </Link>

        {isLoading ? (
        
        <Loader/>) : error ? (
            <Message variant='danger'> {error?.data?.message || error.error} </Message> ) : (
            
            <>
            <Meta title={product.name}/>
            <Row className='product-img'>
                <Col md={6}>
                    <Image  src={product.image} alt={product.name} fluid/>
                </Col>

                <Col md={4} >
                    <ListGroup>
                        <h4>{product.name}</h4>
                    </ListGroup>

                    <ListGroup className="product-rating" >
                        <Rating rating={product.rating} text={`${product.numReviews} reviews`}/>
                    </ListGroup>

                    <ListGroup className="product-rating">
                        {`${product.description}.`}
                    </ListGroup>

                    {/* render the quantity component if countInStock > 0 */}
                    {/* {console.log([...Array(product.countInStock).keys()])} */}
                        {product.countInStock > 0 && (
                            <ListGroup.Item>
                            <Row>
                                <Col>
                                    Qty
                                </Col>

                                <Col>
                                    <Form.Control 
                                        as='select'
                                        value={qty}
                                        onChange={(e) => setQty(Number(e.target.value))}>
                                        {[...Array(product.countInStock).keys()].map((x) => (
                                            <option key={ x + 1 } value={ x + 1 }>
                                                { x + 1 }
                                            </option>
                                    ))}
                                    </Form.Control>
                                </Col>
                            </Row>
                            </ListGroup.Item>
                        )}
                    
                    <ListGroup className="product-rating">
                        <Row className='price-col'>
                            <h4>{`Price: $${product.price}`}</h4>
                            <Button 
                            variant='dark' 
                            className='add-to-cart btn-block'
                            type='button'
                            disabled={product.countInStock === 0 || product.countInStock === qtyAdded}
                            onClick={()=> {addToCartHandler();
                                            increaseQtyAdded()}
                                            }>
                            Add To Cart
                            </Button>
                            <h6>{product.countInStock > 0 ? "In Stock" : <span style={{color:'red'}}>Out of Stock</span>}</h6>
                        </Row>
                        
                    </ListGroup>
                </Col>  
            </Row>

            <Row>
            
                <Col md={6} style={{marginLeft: '6rem'}}> 
                    <h4 className='my-4'>Reviews</h4>
                    {product.reviews.length === 0 && <Message>No Reviews</Message>}
                    <ListGroup>
                        {product.reviews.map((review) => (
                            <ListGroup.Item key={review._id}>
                                <strong>{review.name}</strong>
                                <Rating rating={review.rating}></Rating>
                                <p>{review.createdAt.substring(0,10)}</p>
                                <p>{`'${review.comment}'`}</p>
                            </ListGroup.Item>
                        ))}
                        <ListGroup.Item>
                            <h4>Write a review</h4>
                            {loadingReview && <Loader/>}
                            {userInfo ? (
                                <Form onSubmit={submitHandler}>
                                    <Form.Group controlId='rating' className='my-2'>
                                        <Form.Label>
                                            Rating
                                        </Form.Label>
                                        <Form.Control
                                        as='select'
                                        value={rating}
                                        onChange={(e) => setRating(Number(e.target.value))}>
                                            <option value=''>Select...</option>
                                            <option value='1'>1 - Poor</option>
                                            <option value='2'>2 - Fair</option>
                                            <option value='3'>3 - Good</option>
                                            <option value='4'>4 - Great</option>s
                                            <option value='5'>5 - Excellent</option>
                                        </Form.Control>
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control
                                        as="textarea"
                                        row='3'
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        ></Form.Control>
                                    </Form.Group>

                                    <Button className='my-2'
                                    disabled={loadingReview}
                                    type='submit'
                                    variant='primary'>
                                    Submit
                                    </Button>
                                </Form>
                            ) : (
                                <Message>Please <Link to='/login'>sign in </Link> to write a review</Message>
                            )}
                           
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

            </Row>
        </>
        ) }   
    </>
    )    
}
    
  


export default ProductScreen