import {useState, useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { Form, FormGroup, Button } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import { useUpdateProductMutation, useGetProductDetailsQuery, useUpLoadImageMutation } from '../../slices/productsApiSlice'
import Meta from '../../components/Meta'

const ProductEditScreen = () => {
    const {id: productId} = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')

    const {data: product, isLoading, error, refetch} = useGetProductDetailsQuery(productId);

    const [uploadImage, {isLoading: loadingUpload, error: errorUpload}] = useUpLoadImageMutation();
    
    const [updateProduct, {isLoading: loadingUpdate} ] = useUpdateProductMutation();

    useEffect(() => {
        if (product){
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product])
    
    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image)
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
                
    }
    const submitHandler = async (e) =>{
        e.preventDefault();
        const updatedProduct = {
            _id: productId, 
            name, 
            price,
            image,
            brand,
            category,
            countInStock,
            description,
        };

        const res = await updateProduct(updatedProduct);
        if (res.error){
            toast.error(res.error);
        
        }
        else {
            toast.success("Product updated successfully");
            refetch();
            navigate('/admin/productlist');
        }
    }
  return (
   <>
    <Meta title="Edit Product"/>
    <Link to='/admin/productlist' className='go-back'><IoArrowBackCircleOutline/></Link>
    <FormContainer>
        <h3>Editing Product: </h3>
        {loadingUpdate && <Loader/>}
        {isLoading ? <Loader/> : error ? (<Message variant='danger'>{error.error}</Message>) : (
            <Form onSubmit={submitHandler}>
                <FormGroup controlId='name' className='my-2'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    type='text'
                    value={name}
                    placeholder="Enter name"
                    onChange={(e) => setName(e.target.value)}>
                    </Form.Control>
                </FormGroup>

                <FormGroup controlId='price' className='my-2'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                    type='number'
                    value={price}
                    placeholder="Enter price"
                    onChange={(e) => setPrice(e.target.value)}>
                    </Form.Control>
                </FormGroup>

                <Form.Group controlId="image" className='my-2'>
                    <Form.Label>Image</Form.Label>
                    <Form.Control 
                    type='text' 
                    value={image} 
                    placeholder='Enter image' 
                    onChange={(e) => setImage(e.target.value)}>
                    </Form.Control>
                    <Form.Control type='file' label='Choose file' onChange={uploadFileHandler}></Form.Control>
                </Form.Group>

                <FormGroup controlId='brand' className='my-2'>
                    <Form.Label>Brand</Form.Label>
                    <Form.Control
                    type='text'
                    value={brand}
                    placeholder="Enter brand"
                    onChange={(e) => setBrand(e.target.value)}>
                    </Form.Control>
                </FormGroup>

                <FormGroup controlId='category' className='my-2'>
                    <Form.Label>Category</Form.Label>
                    <Form.Control
                    type='text'
                    value={category}
                    placeholder="Enter category"
                    onChange={(e) => setCategory(e.target.value)}>
                    </Form.Control>
                </FormGroup>

                <FormGroup controlId='countInStock' className='my-2'>
                    <Form.Label>Count In Stock</Form.Label>
                    <Form.Control
                    type='number'
                    value={countInStock}
                    placeholder="Enter count in stock"
                    onChange={(e) => setCountInStock(e.target.value)}>
                    </Form.Control>
                </FormGroup>

                <FormGroup controlId='description' className='my-2'>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                    type='text'
                    value={description}
                    placeholder="Enter description"
                    onChange={(e) => setDescription(e.target.value)}>
                    </Form.Control>
                </FormGroup>

                <Button type='submit' className='btn btn-primary my-3'>Update Product</Button>
            </Form>
        )}
    </FormContainer>
   </>
  )
}

export default ProductEditScreen