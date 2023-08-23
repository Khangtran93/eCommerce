import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap'

const SearchBox = () => {
  const {keyword: urlKeyword} = useParams();
  const [keyword, setKeyword] = useState(urlKeyword);
  const navigate = useNavigate();

  const submitHander = (e) => {
    e.preventDefault();
    if(keyword.trim()){
        navigate(`/search/${keyword}`);
        setKeyword('');
    }
    else {
        navigate('/')
    }
  }
  return (
   <>
    <Form onSubmit={submitHander} className='d-flex'>
        <Form.Control
        type='text'
        placeholder='Search Products'
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}> 
        </Form.Control>
        <Button type='submit' variant='outline-light' className='mx-2' >
            Search
        </Button>
    </Form>
   </>
  )
}

export default SearchBox