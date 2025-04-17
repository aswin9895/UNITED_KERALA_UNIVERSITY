import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import styles from '../TableStyle/TableStyle.module.css';
import deleteBtn from '../../ASSETS/deleteBtn.svg';
import editBtn from '../../ASSETS/editBtn.svg';

const StudentTable = ({ searchValue, students, setStudents, currentPage, setCureentPage }) => {

    // state for storing deleting item
    const [filteredStudents, setFilteredStudents] = useState(null)
    const [ascend, setAscend] = useState(false)
    const navigate = useNavigate()

    // handle delete function 
    const handleDelete = (id) => {
        const dels = students.filter((student) => student.id !== id)
        setFilteredStudents(dels)
    }
    const handleConfirmDelete = () => {
        localStorage.setItem("students", JSON.stringify(filteredStudents))
        setStudents(filteredStudents)
        setFilteredStudents(null)
        setCureentPage(1)
        toast('Student Deleted Successfully!', {
            position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: false, draggable: true, progress: undefined, theme: "dark", transition: Bounce,
        });
    }
    // delte canceletion function
    const handleCancel = () => {
        setFilteredStudents(null)
    }

    // handleedit
    const handleEdit = (id) => {
        localStorage.setItem("editId", id)
        navigate('/editStudent')
    }

    // handling sort functions
    const handleSort = (key) => {
        let sortedStudents = [...students];
        if (key === "fullName") {
            sortedStudents.sort((a, b) => {
                return ascend ?
                    (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName)
                    :
                    (b.firstName + b.lastName).localeCompare(a.firstName + a.lastName)
            });
        } else {
            sortedStudents.sort((a, b) => {
                return ascend ?
                    a[key].localeCompare(b[key])
                    :
                    b[key].localeCompare(a[key]);
            });
        }
        setAscend(!ascend);
        setStudents(sortedStudents);
    };

    // student search 
    const searchData = students?.filter((student) => {
        const fullName = `${student.firstName} ${student.lastName}`
        return (
            student.firstName.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.lastName.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.rollNo.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.course.toLowerCase().includes(searchValue.toLowerCase()) ||
            student.college.toLowerCase().includes(searchValue.toLowerCase()) ||
            fullName.toLowerCase().trim().includes(searchValue.toLowerCase().trim())
        )
    }
    )

    // pagination
    const studentsPerPage = 8
    const totalPage = Math.ceil(searchData ? searchData.length / studentsPerPage : currentPage)
    const currentPageLastStudentIndex = currentPage * studentsPerPage
    const currentPageFirstStudentIndex = currentPageLastStudentIndex - studentsPerPage
    const visibleStudents = searchData?.slice(currentPageFirstStudentIndex, currentPageLastStudentIndex)

    const limiter = 3
    const startPage = Math.max(1, currentPage - Math.floor(limiter / 2))
    const endPage = Math.min(totalPage, startPage + limiter - 1)
    const pageNumber = []
    for (let i = startPage; i <= endPage; i++) {
        pageNumber.push(i)
    }
    const handleClick = (pageNumber) => {
        setCureentPage(pageNumber)
    }

    return (
        <>
            <div className="table-responsive mt-5">
                {
                    students.length > 0 ? (
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        <div className={styles.tableHeadSortAlign}>
                                            Name <button className={styles.sortBTN}><FontAwesomeIcon icon={faSort} onClick={() => handleSort("fullName")} /></button>
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
                                    <td></td>
                                </tr>
                            </thead>
                            <tbody id="stdTableBody" className="table-group-divider">
                                {
                                    visibleStudents?.map((item, index) => (
                                        <tr key={index} className={styles.tableBodyRow}>
                                            <td className="pt-3">{item?.firstName} {item?.lastName}</td>
                                            <td className="pt-3 ps-3">{item?.rollNo}</td>
                                            <td className="pt-3 ps-3">{item?.course}</td>
                                            <td className="pt-3 ps-3">{item?.college}</td>
                                            <td className={`pt-3 ${styles["actionTd"]}`}>
                                                <div className={styles.actionContainer}>
                                                    {/* edit btn  */}
                                                    <button onClick={() => handleEdit(item?.id)} className={`${styles["actionBTN"]} ${styles["editBtn"]}`}><img src={editBtn} alt="editBtn" /></button>
                                                    {/* dlt btn and confirmation modal  */}
                                                    <button onClick={() => handleDelete(item?.id)} className={`${styles.actionBTN} ${styles.delBtn}`}> <img src={deleteBtn} alt="deleteBtn" data-bs-toggle="modal" data-bs-target="#staticBackdrop1" /></button>
                                                    {/* deleteModal */}
                                                    <div className="modal fade border-roundedd" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                                        <div className="modal-dialog modal-dialog-centered">
                                                            <div className="modal-content">
                                                                <div className="modal-body bg-dark">
                                                                    <p className={styles.deleteConfirmMsg}> Are You Sure You Want To Delete This Student?</p>
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
                    )
                        :
                        <div className='text-danger text-center fw-bolder'>No Students To Display</div>
                }
            </div>

            {/* table pagination  */}
            {students.length > 0 &&
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
                            pageNumber?.map(pageNumbers => (
                                <button key={pageNumbers} onClick={() => handleClick(pageNumbers)} className={`${currentPage == pageNumbers && styles.active}  ${styles.paginationBtn}`}>{pageNumbers}</button>
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

export default StudentTable