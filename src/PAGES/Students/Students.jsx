import React, { useState } from 'react'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import SearchBar from '../../COMPONENTS/SearchBar/SearchBar'
import StudentTable from '../../COMPONENTS/StudentTable/StudentTable'

const Students = () => {

  const [students, setStudents] = useState(JSON.parse(localStorage.getItem("students")) || [])
  const [searchValue, setSearchValue] = useState("")
  const [currentPage, setCureentPage] = useState(1)

  const studentSearch = (e) => {
    setSearchValue(e.target.value)
    setCureentPage(1)
  }

  return (
    <div style={{ minHeight: "100vh" }} className='container-fluid'>
      <div className='row'>
        <Navbar insideStudents={true} />
        <>
          <main className="col-md-9 col-lg-10 p-4 pt-md-5">
            {/* count  and search  */}
            <SearchBar insideStudents={true} search={studentSearch} students={students} />
            {/* student table  */}
            <StudentTable searchValue={searchValue} students={students} setStudents={setStudents} currentPage={currentPage} setCureentPage={setCureentPage} />
          </main>
        </>
      </div>
    </div>
  )
}

export default Students