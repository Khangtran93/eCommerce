// import { React, useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import Product from '../components/Product'
import { useParams, Link } from 'react-router-dom'
import {useGetProductsQuery} from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import {IoArrowBackCircleOutline} from 'react-icons/io5'
import Meta from '../components/Meta'

// import axios from 'axios'

const HomeScreen = () => {
  // const [products, setProducts] = useState([])
  
  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const { data } = await axios.get('/api/products')
  //     setProducts(data)
  //   }
  //   fetchProducts();
  // }, [])

  const { pageNumber, keyword } = useParams();
  const {data, isLoading, error} = useGetProductsQuery({pageNumber, keyword});

  return (
    <>
      <Meta title="Welcome to playTech"/>
      {!keyword ? (
        <>
          <ProductCarousel/>
          <h2>Latest Product</h2>
        </>
       ) : (
        <>
        <h3>Search Results</h3>
        <Link className='go-back' to='/'>
            <IoArrowBackCircleOutline/>
        </Link>
        </>
       )
      }
      {isLoading ? (<Loader/>) : error ? (<Message variant='danger'> {error?.data?.message || error.error} </Message> ) : (
        <>  
        <Row>
            {data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product}/>
                </Col>
            ))}
        </Row>

        <Paginate
        pages = {data.pages}
        page = {data.page}
        keyword={keyword ? keyword : ''}
        />
      </>)}
    </>
  )
}

export default HomeScreen