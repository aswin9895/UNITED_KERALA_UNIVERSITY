import React, { useEffect, useState } from 'react'
import styles from './SearcchBar.module.css'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

const StudentSearch = ({ insideCourses, insideStudents, insideResults, search, students, courses, results }) => {

    const [studentCount, setStudentCount] = useState(0)
    const [courseCount, setCourseCount] = useState(0)
    const [resultCount, setResultCount] = useState(0)
    const users = JSON.parse(localStorage.getItem("logged"))

    // getting Student Count
    useEffect(() => {
        const count = students ? students.length : 0
        setStudentCount(count)
    }, [students])

    // getting Course Count
    useEffect(() => {
        const count = courses ? courses.length : 0
        setCourseCount(count)
    }, [courses])

    // getting result Count
    useEffect(() => {
        const count = results ? results.length : 0
        setResultCount(count)
    }, [results])

    return (
        <div className="row">
            {/* students count  */}
            <div className="col-sm-12  col-lg-5">
                {insideStudents ?
                    <h4 className={styles.students}>Students <span className={styles.studentSpan}>{studentCount}</span></h4>
                    : insideCourses ?
                        <h4 className={styles.students}>Courses <span className={styles.studentSpan}>{courseCount}</span></h4>
                        : insideResults &&
                        <h4 className={styles.students}>Results <span className={styles.studentSpan}>{resultCount}</span></h4>
                }
            </div>

            {/* search and new  */}
            <div className="col-sm-12 col-lg-7 d-flex justify-content-center align-items-center mt-sm-2">
                <div className={`${users.role === "admin" ? "w-50" : "w-md-100"} me-3 ${styles["search-container"]}`}>
                    {insideStudents ?
                        <>
                            <input type="text" className={`form-control w-100 ps-3 pe-5 ${styles["studentSearch"]}`} placeholder='Student Search' onChange={search} />
                            <FontAwesomeIcon icon={faMagnifyingGlass} className={`${styles["search-icon"]}`} />
                        </>
                        : insideCourses ?
                            <>
                                <input type="text" className={`form-control w-100 ps-3 pe-5 ${styles["studentSearch"]}`} placeholder='Course Search' onChange={search} />
                                <FontAwesomeIcon icon={faMagnifyingGlass} className={`${styles["search-icon"]}`} />
                            </>
                            : insideResults &&
                            <>
                                <input type="text" className={`form-control w-100 ps-3 pe-5 ${styles["studentSearch"]}`} placeholder='Result Search' onChange={search} />
                                <FontAwesomeIcon icon={faMagnifyingGlass} className={`${styles["search-icon"]}`} />
                            </>
                    }
                </div>
                <div>
                    {insideStudents ?
                        <Link to={'/newStudent'}><button className={styles.newStudentBTN}>New Student</button></Link>
                        : insideCourses ?
                            <Link to={'/newCourse'}><button className={styles.newStudentBTN}>New Course</button></Link>
                            :
                            insideResults && users.role === "admin" &&
                            <Link to={'/newResult'}><button className={styles.newStudentBTN}>Add Result</button></Link>
                    }
                </div>
            </div>

        </div>
    )
}

export default StudentSearch