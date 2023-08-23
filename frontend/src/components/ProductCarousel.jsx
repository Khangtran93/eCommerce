import {Link} from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import Loader from './Loader'
import Message from './Message'
import { useGetTopProductsQuery } from '../slices/productsApiSlice'

const ProductCarousel = () => {
  const {data: products, isLoading, error} = useGetTopProductsQuery();
  return (
    <>
        {isLoading ? <Loader/> ? error : <Message variant='danger'>{error.error}</Message> : (
            <Carousel slide={false} bordered pause='hover' className='bg-dark mb-4 custom-carousel'>
                {products.map((product) => (
                    <Carousel.Item key={product._id}>
                        <Link to={`/product/${product._id}`}>
                            <Image src={product.image} alt={product.name} fluid/>
                        </Link>
                        <Carousel.Caption>
                        <h4>{product.name} ${product.price}</h4>
                        </Carousel.Caption>
                        
                    </Carousel.Item>
                ))}
            </Carousel>
        )}
    </>
  )
}

export default ProductCarousel