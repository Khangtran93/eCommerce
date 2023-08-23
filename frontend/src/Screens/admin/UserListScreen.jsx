import { LinkContainer } from "react-router-bootstrap"
import { Table, Button } from 'react-bootstrap'
import { Link } from "react-router-dom"
import { toast } from 'react-toastify'
import Message from "../../components/Message"
import Loader from "../../components/Loader"
import { useGetUsersQuery, useDeleteUserMutation } from "../../slices/usersApiSlice"
import { FaTimes, FaTrash, FaEdit, FaCheck } from 'react-icons/fa'
import Meta from "../../components/Meta"

const UserListScreen = () => {
  const {data: users, isLoading, error, refetch} = useGetUsersQuery();
  const [deleteUser, {isLoading: loadingDelete, error: errorDelete}] = useDeleteUserMutation();

  const deleteHandler = async (user) => {
    if(window.confirm(`Delete user ${user.name} with ID ${user._id}?`)){
      if(!user.isAdmin){
      try {
        await deleteUser(user._id);
        refetch();
        toast.success(`User ${user.name} with ID ${user._id} deleted successfully`)
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
    else {
      toast.error("Deletion failed: Cannot delete admin!");
    }
    }

  }
  return (
    <>
      <Meta title="Users List"/>
      <h2>Users</h2>
      {loadingDelete && <Loader/>}
      {isLoading ? (<Loader/>): error ? (<Message variant='danger'>{error.error}</Message>) : (
        <Table striped hover responsive className="table-md">
          <thead>
            <tr>
              <td>ID</td>
              <td>NAME</td>
              <td>EMAIL</td>
              <td>ADMIN</td>
              <td></td>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td><Link to={`/admin/user/${user._id}`}>{user._id}</Link></td>
                <td>{user.name}</td>
                <td><a href={`mailto: ${user.email}`}>{user.email} </a></td>
                <td>{user.isAdmin ? (<FaCheck style={{color: 'green'}}/>) : (<FaTimes style={{color: 'red'}}/>)}</td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className="btn-sm">
                      <FaEdit/>
                    </Button>
                  </LinkContainer>
                  <Button
                  variant='danger'
                  className='btn-sm'
                  onClick={() => {deleteHandler(user)}}>
                    <FaTrash/>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen