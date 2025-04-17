import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Pnf = () => {
  const [user,setUser]=useState(JSON.parse(localStorage.getItem('logged')) ||[])
  // const user = JSON.parse(localStorage.getItem('user')) || null
  return (
    <div className="d-flex justify-content-center align-items-center flex-column vh-100">
      <h1 className="fw-bolder fs-1 mb-2">ERROR 404</h1>
      <img width={'300px'} height={'200px'} src='https://cdn.svgator.com/images/2024/04/electrocuted-caveman-animation-404-error-page.gif' alt="" />
      <h1 className="fw-bold fs-3 mb-2">Looks like You'r Lost.</h1>
      <p className="mb-2">The Page You Are Looking For Is Not Available.</p>
      <Link to={user.role === "admin" ? '/students' : user.role === "representative" ? '/results' : '/'} className='bg-success p-2 text-light rounded'>Home</Link>
    </div>
  )
}

export default Pnf