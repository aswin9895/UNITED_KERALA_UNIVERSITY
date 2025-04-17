import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import styles from '../TableStyle/TableStyle.module.css'
import deleteBtn from '../../ASSETS/deleteBtn.svg'
import editBtn from '../../ASSETS/editBtn.svg'

const CourseTable = ({ searchValue, courses, setCourses, currentPage, setCureentPage }) => {

    // for storing !delete courses 
    const [filteredCourses, setFilteredCourses] = useState(null)
    const [ascend, setAscend] = useState(false)
    const navigate = useNavigate()

    // handleDelete
    const handleDelete = (id) => {
        const dels = courses.filter(course => course.id !== id)
        setFilteredCourses(dels)
    }
    const handleConfirmDelete = () => {
        localStorage.setItem("courses", JSON.stringify(filteredCourses))
        setCourses(filteredCourses)
        setFilteredCourses(null)
        setCureentPage(1)
        toast('Course Deleted Successfully!', {
            position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: false, draggable: true, progress: undefined, theme: "dark", transition: Bounce,
        });
    }
    const handleCancel = () => {
        setFilteredCourses(null)
    }

    // handleEdit
    const handleEdit = (id) => {
        localStorage.setItem("editId", id)
        navigate('/editCourse')
    }

    // handling sort functions
    const handleSort = (key, way) => {
        let sortedCourse = [...courses];

        sortedCourse.sort((a, b) => {
            return key === "duration" ? (ascend ? a.duration - b.duration : b.duration - a.duration)
                :
                (ascend ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]))
        })
        setAscend(!ascend)
        setCourses(sortedCourse)
    };

    // handleSerach
    const searchData = courses?.filter((course) =>
        course.course.toLowerCase().includes(searchValue.toLowerCase()) ||
        course.college.toLowerCase().includes(searchValue.toLowerCase())
    )

    // pagination
    const coursesPerPage = 8
    const totalPage = Math.ceil(searchData ? searchData.length / coursesPerPage : currentPage)
    const currentPageLastStudentIndex = currentPage * coursesPerPage
    const currentPageFirstStudentIndex = currentPageLastStudentIndex - coursesPerPage
    const visiblecourses = searchData?.slice(currentPageFirstStudentIndex, currentPageLastStudentIndex)

    const limiter = 3
    const startPage = Math.max(1, currentPage - Math.floor(limiter / 2))
    const endPage = Math.min(totalPage, startPage + limiter - 1)
    const pageNumbers = []
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
    }

    const handleClick = (pageNumber) => {
        setCureentPage(pageNumber)
    }


    return (
        <>
            <div className="table-responsive mt-5">
                {courses?.length > 0 ?
                    <table className="table table-hover">
                        <thead>
                            {/* student table heads with sorting collapse option  */}
                            <tr>
                                <th>
                                    <div className={styles.tableHeadSortAlign}>
                                        Course <button className={styles.sortBTN}><FontAwesomeIcon icon={faSort} onClick={() => handleSort("course")} /></button>
                                    </div>
                                </th>
                                <th>
                                    <div className={`ps-2 ${styles.tableHeadSortAlign}`}>
                                        Duration <button className={styles.sortBTN}><FontAwesomeIcon icon={faSort} onClick={() => handleSort("duration")} /></button>
                                    </div>
                                </th>
                                <th>
                                    <div className={`ps-2 ${styles.tableHeadSortAlign}`}>
                                        College <button className={styles.sortBTN}><FontAwesomeIcon icon={faSort} onClick={() => handleSort("college")} /></button>
                                    </div>
                                </th>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody id="stdTableBody" className="table-group-divider">
                            {
                                visiblecourses?.map((item, index) => (
                                    <tr key={index} className={styles.tableBodyRow}>
                                        <td className="pt-3 w-25">{item?.course}</td>
                                        <td className="pt-3 ps-3">{item?.duration} years</td>
                                        <td className="pt-3 ps-3">{item?.college}</td>
                                        <td className={`pt-3 ps-3 ${styles["actionTd"]}`}>
                                            <div className={styles.actionContainer}>
                                                {/* edit btn  */}
                                                <button onClick={() => handleEdit(item?.id)} className={`${styles["actionBTN"]} ${styles["editBtn"]}`} ><img src={editBtn} alt="editBtn" /></button>
                                                {/* dlt btn and confirmation modal  */}
                                                <button onClick={() => handleDelete(item?.id)} className={`${styles.actionBTN} ${styles.delBtn}`}> <img src={deleteBtn} alt="deleteBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop1" /></button>
                                                <div className="modal fade border-roundedd" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                    <div className="modal-dialog modal-dialog-centered">
                                                        <div className="modal-content">
                                                            <div className="modal-body bg-dark">
                                                                <p className={styles.deleteConfirmMsg}> Are You Sure You Want To Delete This Course?</p>
                                                                <div>
                                                                    <button onClick={handleCancel} type="button" className="btn btn-outline-warning me-2 fw-bold" data-bs-dismiss="modal">Cancel</button>
                                                                    <button onClick={handleConfirmDelete} type="button" className="btn btn-outline-danger fw-bold" data-bs-dismiss="modal">Delete</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>
                    :
                    <div className='text-danger fw-bolder text-center'>No Courses Available</div>
                }
            </div>

            {/* table pagination  */}
            {courses.length > 0 &&
                <div className={`mt-5 ${styles.paginationContainer}`}>
                    <div className='d-flex'>
                        <span className={styles.navPages}>Pages</span>
                        {
                            startPage > 1 &&
                            <>
                                <button onClick={() => handleClick(1)} className={`${styles.paginationBtn}`}>1</button>

                                <div className="d-flex justify-content-center align-items-center">
                                    <div className={styles.paginationDiv}></div>
                                    <div className={styles.paginationDiv}></div>
                                    <div className={styles.paginationDiv}></div>
                                </div>

                            </>
                        }
                        {
                            pageNumbers?.map(pageNumber => (
                                <button key={pageNumber} onClick={() => handleClick(pageNumber)} className={`${currentPage == pageNumber && styles.active} ${styles.paginationBtn}`}>{pageNumber}</button>
                            ))
                        }
                        {
                            endPage < totalPage &&
                            <>
                                <div className="d-flex justify-content-center align-items-center">
                                    <div className={styles.paginationDiv}></div>
                                    <div className={styles.paginationDiv}></div>
                                    <div className={styles.paginationDiv}></div>
                                </div>

                                <button onClick={() => handleClick(totalPage)} className={`${styles.paginationBtn}`}>{totalPage}</button>
                            </>
                        }
                    </div>
                </div>
            }

            <ToastContainer position="top-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} />
        </>
    )
}

export default CourseTable