import React, { useState } from 'react'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import SearchBar from '../../COMPONENTS/SearchBar/SearchBar'
import CourseTable from '../../COMPONENTS/CourseTable/CourseTable'

const Courses = () => {
  const [courses, setCourses] = useState(JSON.parse(localStorage.getItem("courses")) || [])
  const [currentPage, setCureentPage] = useState(1)
  const [searchValue, setSearchValue] = useState("")

  const handleSearch = (e) => {
    setSearchValue(e.target.value)
    setCureentPage(1)
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <Navbar insideCourse={true} />

        <main className="col-md-9 col-lg-10 p-4 pt-md-5">
          {/* course search*/}
          <SearchBar insideCourses={true} search={handleSearch} courses={courses} />

          {/* course table  */}
          <CourseTable searchValue={searchValue} courses={courses} setCourses={setCourses} currentPage={currentPage} setCureentPage={setCureentPage} />
        </main>
      </div>
    </div>
  )
}

export default Courses