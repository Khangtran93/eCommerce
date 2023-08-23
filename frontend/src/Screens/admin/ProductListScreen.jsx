import { LinkContainer } from "react-router-bootstrap"
import { Table, Button, Row, Col, Image } from 'react-bootstrap'
import { Link, useParams } from "react-router-dom"
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import Paginate from "../../components/Paginate"
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useGetProductsQuery, useCreateProductMutation, useDeleteProductMutation } from "../../slices/productsApiSlice"
import { toast } from 'react-toastify'
import Meta from "../../components/Meta"

const ProductListScreen = () => {
    const {pageNumber} = useParams();
    console.log("pageNumber in productlist: ", pageNumber)
    const {data, isLoading, error, refetch} = useGetProductsQuery({pageNumber});
    const [createProduct, {isLoading: loadingCreate}] = useCreateProductMutation();
    const [deleteProduct, {isLoading: loadingDelete}] = useDeleteProductMutation();
    
    const createProductHandler = async () => {
        if (window.confirm("Create new product?")){
            try {
                await createProduct();
                refetch();
            } catch (error) {
                toast.error(error?.data?.message || error.error)
            }
        }
    }

    const deleteItem = async (productId) => {
        if(window.confirm("Are you sure?")){
        try {
            await deleteProduct(productId);
            refetch();
            toast.success("Item deleted successfully");
        }
        catch {
            toast.error(error?.data?.message || error.error)
        }
    }
}

  return (
    <>
        <Meta title="Product List"/>
        <Row>
            <Col>
                <h3>Products</h3>
            </Col>

            <Col md={2}>
                <Button className="btn-sm mb-3" style={{float: 'right'}} onClick={createProductHandler}>
                    <FaEdit style={{marginBottom: '4px', marginRight: '2px'}}></FaEdit>
                    <span>Add Product</span>  
                </Button>
                {loadingCreate && <Loader/>}
            </Col>
        </Row>
        <Row>
            <Table bordered striped responsive className="table-sm">
                <thead>
                    <tr>
                        <td>Image</td>
                        <td>ID</td>
                        <td>Name</td>
                        <td>Price</td>
                        <td>Brand</td>
                        <td>Category</td>
                        <td></td>
                        <></>
                    </tr>
                </thead>
                    {loadingCreate && <Loader/>}
                    {loadingDelete && <Loader/>}
                    {isLoading ? (<Loader/>) : error ? (<Message variant='danger'>{error.error}</Message>) : (
                        <tbody>
                            {data.products.map((product) => (
                                <tr key={product._id}>
                                    <td style={{width: '20px', height: "20px"}}>
                                    <Link to={`/product/${product._id}`}>
                                       <Image rounded fluid src={product.image}/>
                                    </Link>
                                    </td>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.category}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button variant='light' className="btn-sm mx-2">
                                                <FaEdit/>
                                            </Button>
                                        </LinkContainer>
                                        <Button variant='danger' className="btn-sm" onClick={() => deleteItem(product._id)}>
                                            <FaTrash/>
                                        </Button>
                                    </td>
                                </tr>
                                
                            ))}
                        </tbody>
                    )}
                
            </Table>
        </Row>
        
        {data && 
        <Paginate pages={data.pages} page={data.page}  isAdmin={true}/>
        }
    </>
  )
}

export default ProductListScreen