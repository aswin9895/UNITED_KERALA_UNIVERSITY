import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { Bounce, toast, ToastContainer } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid';
import styles from '../NewStudent/NewStudent.module.css';
import Navbar from '../../COMPONENTS/Navbar/Navbar';
import img from '../../ASSETS/Learning-amico.svg';

const NewResult = ({ insideEditResult }) => {

    const [submittedData, setSubmittedData] = useState(JSON.parse(localStorage.getItem("results")) || [])
    const [allColleges, setAllColleges] = useState(JSON.parse(localStorage.getItem("college")) || [])
    const [allCourses, setAllCourses] = useState(JSON.parse(localStorage.getItem("courses")) || [])
    const [allStudents, setAllStudents] = useState(JSON.parse(localStorage.getItem("students")) || [])
    const [selectedCollege, setSelectedCollege] = useState("")
    const [selectedCourse, setSelectedCourse] = useState("")
    const [selectedStudent, setSelectedStudent] = useState("")
    const [filteredCourse, setFilteredCourse] = useState([])
    const [filteredStudent, setFilteredStudent] = useState([])
    const [editIndex, setEditIndex] = useState(null)
    const [editDetails, setEditDetails] = useState([])
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    console.log(filteredStudent);

    // storing submited data to local storage
    useEffect(() => {
        localStorage.setItem("results", JSON.stringify(submittedData))
    }, [submittedData])

    // storing data to editFields
    useEffect(() => {
        if (insideEditResult) {
            const id = localStorage.getItem("editId")
            const index = submittedData.findIndex((std) => std.id == id)
            setEditIndex(index)
            const editResults = submittedData.find((reslt) => reslt.id == id)
            setEditDetails(editResults)
            setValue("college", editResults?.college)
            setValue("score", editResults?.score)
            setValue("rollNo", editResults?.rollNo)
            setSelectedCollege(editResults?.college)
            // setSelectedStudent(editResults?.rollNo)
        }
    }, [])

    // filtering courses based on college Selected 
    useEffect(() => {
        const filteredCourses = allCourses.filter(item => item.college === selectedCollege)
        setFilteredCourse(filteredCourses)
    }, [selectedCollege])

    // filtering studets based on college and course 
    useEffect(() => {
        const filteredStudents = filteredCourse?.length > 0 && allStudents.filter(item => item.course === selectedCourse && item.college === selectedCollege)
        setFilteredStudent(filteredStudents)
    }, [selectedCourse, selectedCollege])

    // for storing rolldata for checking alredy exist reslt
    // useEffect(() => {
    //     setValue("rollNo", selectedStudent)
    // }, [selectedStudent])

    // setting course on edit field
    useEffect(() => {
        if (editDetails?.course && filteredCourse.length>0) {
            setValue("course", editDetails.course)
            setSelectedCourse(editDetails.course)
        }
    }, [filteredCourse])

    useEffect(() => {
        if (editDetails?.student && filteredStudent.length>0) {
            setValue("student", editDetails.rollNo)
        }
    }, [filteredStudent])

    useEffect(() => {
        selectedStudent && setValue("rollNo", selectedStudent)
    }, [selectedStudent])

    // formSubmission
    const onSubmit = (data) => {
        if (insideEditResult) {
                const update = [...submittedData]
                update[editIndex] = { ...data, id: update[editIndex].id, student: filteredStudent.find(item => item.rollNo == selectedStudent)?.firstName + " " + filteredStudent.find(item => item.rollNo == selectedStudent)?.lastName }
                setSubmittedData(update)
                toast.success('Result Updated Successfully!', {
                    position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: false, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
                });
                setEditIndex(null)
                localStorage.removeItem("editIndex")
                setTimeout(() => {
                    navigate('/results');
                }, 1200);
        } else {
                const newData = { ...data, id: uuidv4(), rollNo: selectedStudent, student: filteredStudent.find(item => item.rollNo == selectedStudent)?.firstName + " " + filteredStudent.find(item => item.rollNo == selectedStudent)?.lastName }
                setSubmittedData([...submittedData, newData])
                toast.success('Result Added Successfully!', {
                    position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: false, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
                });
            }
        reset()
        setSelectedStudent("")
    };

    // Handle reset
    const handleCancel = (event) => {
        event.preventDefault();
        reset();
        localStorage.removeItem("editId")
        if (insideEditResult) {
            navigate('/results')
        }
    };

    return (
        <div style={{ minHeight: "100vh" }} className="container-fluid">
            <div className="row">
                <Navbar insideResult={true} />

                {/* Main Content */}
                <div className="col-md-7 col-lg-10 p-4 ps-md-5 pt-md-5">

                    {/* Back to Students Link */}
                    <div>
                        <Link to={'/results'} className={`text-dark ${styles.backStudents}`}>
                            <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#000000" }} className='me-1' /> Back to Result List
                        </Link>
                    </div>

                    {/* New Student Form & Image */}
                    <div className="row">
                        <div className="col-sm-12 col-md-6 col-lg-5" style={{ maxHeight: "100vh" }}>
                            <h5 className={styles.newStudentHeading}>{insideEditResult ? "Edit" : "New"} Result</h5>
                            <form id="form" onSubmit={handleSubmit(onSubmit)}>
                                <label htmlFor="college">College</label><br />
                                <select name="college" id="college"
                                    {...register("college", { required: "College is Required", onChange: (e) => setSelectedCollege(e.target.value) })}>
                                    <option value="" selected hidden>Select College</option>
                                    {allColleges?.length > 0 &&
                                        allColleges?.map((item, index) => (
                                            <option key={index} value={item?.College}>{item?.College}</option>
                                        ))
                                    }
                                </select>
                                {errors.college && <p className={styles.errorMessage}>{errors.college.message}</p>}
                                <br />

                                <label htmlFor="course">Course</label><br />
                                <select name="course" id="course"
                                    {...register("course", { required: "Course is Required", onChange: (e) => setSelectedCourse(e.target.value) })}>
                                    <option value="" selected hidden>Select Course</option>
                                    {filteredCourse &&
                                        filteredCourse?.map((item, index) => (
                                            <option key={index} value={item?.course}>{item?.course}</option>
                                        ))
                                    }
                                </select>
                                {errors.course && <p className={styles.errorMessage}>{errors.course.message}</p>}
                                <br />

                                <label htmlFor="student">Student Name</label><br />
                                <select name="student" id="student"
                                    {...register("student", { required: "Student Name is Required", onChange: (e) => setSelectedStudent(e.target.value) })}>
                                    <option value="" selected hidden>Select Student</option>
                                    {filteredStudent &&
                                        filteredStudent?.map((item, index) => (
                                            <option key={index} value={item?.rollNo}>{item?.firstName + " " + item?.lastName} &#40;{item?.rollNo}&#41;</option>
                                        ))
                                    }
                                </select>
                                {errors.student && <p className={styles.errorMessage}>{errors.student.message}</p>}
                                <br />

                                <label className="mt-2" htmlFor="rollNo">Roll Number</label><br />
                                <input disabled className={`${styles.rollInput}`} type="text" id="rollNo" name="rollNo" defaultValue={selectedStudent}
                                    {...register("rollNo")} />
                                {errors.rollNo && <p className={styles.errorMessage}>{errors.rollNo.message}</p>}
                                <br />

                                <label htmlFor="score">Score Percentage</label><br />
                                <input type="number" name="score" id="score" placeholder="Score in Percentage"
                                    {...register("score", { required: "Final Score is Required" , min:{value:0, message:"Score Can't be Less Than 0"}, max:{value: 100 , message:"Score Percentage Can't be Greater Than 100"}})} />
                                {errors.score && <p className={styles.errorMessage}>{errors.score.message}</p>}

                                <div className="mt-1">
                                    {insideEditResult ?
                                        <button type="submit" className={`me-3 ${styles.actionBtn}`}>Update</button>
                                        :
                                        <button type="submit" className={`me-3 ${styles.actionBtn}`}>Save</button>
                                    }
                                    <button type="button" onClick={handleCancel} className={`${styles.actionBtn} ${styles.cancelBtn}`}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Student Image */}
                        <div className={`col-md-6 col-lg-7 ${styles.imgDiv}`}>
                            <div>
                                <img className={`img img-fluid ${styles.newStudentLogo}`} src={img} alt="learningImg" />
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            <ToastContainer position="top-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" transition={Bounce} />
        </div>
    )
}

export default NewResult