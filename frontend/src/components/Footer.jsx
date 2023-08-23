import React from 'react'
import { Col, Row, Container } from 'react-bootstrap';
import "../index.css"

const Footer = () => {
    const currentYear = new Date().getFullYear();
  return (
    <footer>
    <Container>
        <Row>
            <Col className='text-center py-3'>
                <p style={{color: 'white'}}>sneakerZone &copy; {currentYear} </p>
            </Col> 
        </Row>
    </Container>
    </footer>
  )
}

export default Footer