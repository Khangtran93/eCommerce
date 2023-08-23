import {useState, useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { IoArrowBackCircleOutline } from 'react-icons/io5'
import { Form, FormGroup, Button } from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import { useGetUserByIdQuery, useUpdateUserMutation } from '../../slices/usersApiSlice'
import Meta from '../../components/Meta'

const UserEditScreen = () => {
    const {id: userId} = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    

    const {data: user, isLoading, error, refetch} = useGetUserByIdQuery(userId);

  const [updateUser, {isLoading: loadingUpdate}] = useUpdateUserMutation();

    useEffect(() => {
        if (user){
            setName(user.name);
            setEmail(user.email);      
            setIsAdmin(user.isAdmin);
        }
    }, [user])
    
  
    const submitHandler = async (e) =>{
        e.preventDefault();
        const updatedUser = {
            _id: userId,
            name: name,
            email: email,
            isAdmin: isAdmin,
        }
        try {
            await updateUser(updatedUser);
            refetch();
            navigate('/admin/userlist');
            toast.success('User updated successfully!');
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    }
  return (
   <>
    <Meta title="Edit User"/>
    <Link to='/admin/userlist' className='go-back'><IoArrowBackCircleOutline/></Link>
    <FormContainer>
        <h3>Updating User: </h3>
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

                <FormGroup controlId='email' className='my-2'>
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                    type='email'
                    value={email}
                    placeholder="Enter email"
                    onChange={(e) => setEmail(e.target.value)}>
                    </Form.Control>
                </FormGroup>

                <Form.Group>
                    <Form.Check
                    type='checkbox'
                    label='Is Admin'
                    checked={isAdmin}
                    onChange={(e)=> setIsAdmin(e.target.value)}>

                    </Form.Check>
                </Form.Group>

                

                <Button type='submit' className='btn btn-primary my-3'>Update User</Button>
            </Form>
        )}
    </FormContainer>
   </>
  )
}

export default UserEditScreen