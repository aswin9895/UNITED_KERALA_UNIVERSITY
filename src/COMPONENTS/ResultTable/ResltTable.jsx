import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { Bounce, toast, ToastContainer } from 'react-toastify'
import styles from '../TableStyle/TableStyle.module.css'
import deleteBtn from '../../ASSETS/deleteBtn.svg'
import editBtn from '../../ASSETS/editBtn.svg'


const ResltTable = ({ searchValue, results, setResults, currentPage, setCureentPage }) => {

    const [filteredResults, setFilteredResults] = useState(null)
    const [ascend, setAscend] = useState(false)
    const navigate = useNavigate()
    const users = JSON.parse(localStorage.getItem("logged"))

    // handleDelete
    const handleDelete = (id) => {
        const dels = results.filter((res) => res.id !== id)
        setFilteredResults(dels)
    }
    const handleConfirmDelete = () => {
        localStorage.setItem("results", JSON.stringify(filteredResults))
        setResults(filteredResults)
        setFilteredResults(null)
        setCureentPage(1)
        toast('Result Deleted Successfully!', {
            position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: false, draggable: true, progress: undefined, theme: "dark", transition: Bounce,
        });
    }
    // handleCancel delete
    const handleCancel = () => {
        setFilteredResults(null)
    }

    // edit
    const handleEdit = (id) => {
        localStorage.setItem("editId", id)
        navigate('/editResult')
    }

    // handling result sort functions
    const handleSort = (key) => {
        let sortedResults = [...results]

        sortedResults.sort((a, b) => {
            return key === "score" ? (ascend ? a.score - b.score : b.score - a.score)
                :
                (ascend ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]))
        })
        setAscend(!ascend)
        setResults(sortedResults)
    }

    // result search 
    const searchData = results?.filter((result) =>
        result.student.toLowerCase().includes(searchValue.toLowerCase()) ||
        result.rollNo.toLowerCase().includes(searchValue.toLowerCase()) ||
        result.course.toLowerCase().includes(searchValue.toLowerCase()) ||
        result.college.toLowerCase().includes(searchValue.toLowerCase())
    )

    // pagination
    const resultsPerPage = 8
    const totalPage = Math.ceil(searchData ? searchData.length / resultsPerPage : currentPage)
    const currentPageLastStudentIndex = currentPage * resultsPerPage
    const currentPageFirstStudentIndex = currentPageLastStudentIndex - resultsPerPage
    const visibleresults = searchData?.slice(currentPageFirstStudentIndex, currentPageLastStudentIndex)

    const limiter = 3
    const startPage = Math.max(1, currentPage - Math.floor(limiter / 2))
    const endPage = Math.min(totalPage, startPage + limiter - 1)
    const pageNumber = []
    for (let i = startPage; i <= endPage; i++) {
        pageNumber.push(i)
    }
    const handleClick = (pageNumbers) => {
        setCureentPage(pageNumbers)
    }


    return (
        <>
            <div className="table-responsive mt-5">
                {
                    results?.length > 0 ?
                        <table className="table table-hover">
                            <thead>
                                {/* student table heads with sorting collapse option  */}
                                <tr>
                                    <th>
                                        <div className={styles.tableHeadSortAlign}>
                                            Name <button className={styles.sortBTN}><FontAwesomeIcon icon={faSort} onClick={() => handleSort("student")} /></button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`ps-2 ${styles.tableHeadSortAlign}`}>
                                            Roll Number <button className={styles.sortBTN}><FontAwesomeIcon icon={faSort} onClick={() => handleSort("rollNo")} /></button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`ps-2 ${styles.tableHeadSortAlign}`}>
                                            Course <button className={styles.sortBTN}><FontAwesomeIcon icon={faSort} onClick={() => handleSort("course")} /></button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`ps-2 ${styles.tableHeadSortAlign}`}>
                                            College <button className={styles.sortBTN}><FontAwesomeIcon icon={faSort} onClick={() => handleSort("college")} /></button>
                                        </div>
                                    </th>
                                    <th>
                                        <div className={`ps-2 ${styles.tableHeadSortAlign}`}>
                                            Final Score <button className={styles.sortBTN}><FontAwesomeIcon icon={faSort} onClick={() => handleSort("score")} /></button>
                                        </div>
                                    </th>
                                    {users.role === "admin" &&
                                        <td></td>
                                    }
                                </tr>
                            </thead>
                            <tbody id="stdTableBody" className="table-group-divider">
                                {
                                    visibleresults?.map((item, index) => (
                                        <tr key={index} className={styles.tableBodyRow}>
                                            <td className="pt-3">{item?.student}</td>
                                            <td className="pt-3 ps-3">{item?.rollNo}</td>
                                            <td className="pt-3 ps-3">{item?.course}</td>
                                            <td className="pt-3 ps-3">{item?.college}</td>
                                            <td className="pt-3 ps-3">{item?.score}%</td>
                                            {users.role === "admin" &&
                                                <td className={`pt-3 ${styles["actionTd"]}`}>
                                                    <div className={styles.actionContainer}>
                                                        {/* edit btn  */}
                                                        <button onClick={() => handleEdit(item?.id)} className={`${styles["actionBTN"]} ${styles["editBtn"]}`} ><img src={editBtn} alt="editBtn" /></button>
                                                        {/* dlt btn and confirmation modal  */}
                                                        <button onClick={() => handleDelete(item?.id)} className={`${styles.actionBTN} ${styles.delBtn}`}> <img src={deleteBtn} alt="deleteBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop1" /></button>
                                                        <div className="modal fade border-roundedd" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                            <div className="modal-dialog modal-dialog-centered">
                                                                <div className="modal-content">
                                                                    <div className="modal-body bg-dark">
                                                                        <p className={styles.deleteConfirmMsg}> Are You Sure You Want To Delete This Result?</p>
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
                                            }
                                        </tr>
                                    ))
                                }

                            </tbody>
                        </table>
                        :
                        <div className="text-center text-danger fw-bolder">No Results Available</div>
                }
            </div>

            {/* table pagination  */}
            {results.length > 0 &&
                <div className={`mt-5 ${styles.paginationContainer}`}>
                    <div className='d-flex'>
                        <span className={styles.navPages}>Pages</span>
                        {
                            startPage > 1 &&
                            <>
                                <button onClick={() => handleClick(1)} className={`${currentPage == 1 && styles.active} ${styles.paginationBtn}`}>1</button>

                                <div className="d-flex justify-content-center align-items-center">
                                    <div className={styles.paginationDiv}></div>
                                    <div className={styles.paginationDiv}></div>
                                    <div className={styles.paginationDiv}></div>
                                </div>

                            </>
                        }
                        {
                            pageNumber?.map(pageNumbers => (
                                <button key={pageNumbers} onClick={() => handleClick(pageNumbers)} className={`${currentPage == pageNumbers && styles.active} ${styles.paginationBtn}`}>{pageNumbers}</button>
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

export default ResltTable