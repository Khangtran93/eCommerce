import React from 'react'
import { Container } from "react-bootstrap"
import Header from "./components/Header"
import Footer from "./components/Footer"
import HomeScreen from './Screens/HomeScreen'
import "react-bootstrap"
import { Outlet } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <>
      <Header/>
      <main class='py-3'>
        <Container>
          <Outlet/>
        </Container>
        </main>
      
      <ToastContainer/>
      
    </>
  )
}

export default App