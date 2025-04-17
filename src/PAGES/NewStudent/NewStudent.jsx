import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './NewStudent.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons/faArrowLeft';
import { Bounce, toast, ToastContainer } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../../COMPONENTS/Navbar/Navbar';
import img from '../../ASSETS/Learning-amico.svg';

const NewStudent = ({ insideEditStudent }) => {

  const [submittedData, setSubmittedData] = useState(JSON.parse(localStorage.getItem("students")) || [])
  const [allCourses, setAllCourses] = useState(JSON.parse(localStorage.getItem("courses")) || [])
  const [allCollege, setAllCollege] = useState(JSON.parse(localStorage.getItem("college")) || [])
  const [selectedCollege, setSelectedCollege] = useState("")
  const [filteredCourse, setFilteredCourse] = useState([])

  const [editIndex, setEditIndex] = useState(null)
  const [editDetails, setEditDetails] = useState(null)

  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  // store student data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(submittedData))
  }, [submittedData])

  // Filter courses based on selected college
  useEffect(() => {
    setFilteredCourse(allCourses.filter(item => item.college === selectedCollege))
  }, [selectedCollege])

  // Load edit student details
  useEffect(() => {
    if (insideEditStudent) {
      const id = localStorage.getItem("editId")
      const index = submittedData.findIndex((std) => std.id === id)
      const details = submittedData.find((std) => std.id === id)

      if (details) {
        setEditIndex(index)
        setEditDetails(details)

        setValue("rollNo", details.rollNo)
        setValue("firstName", details.firstName)
        setValue("lastName", details.lastName)
        setValue("college", details.college)
        setValue("joiningDate", details.joiningDate)

        setSelectedCollege(details.college)
      }
    }
  }, [])

  // Set course value when filteredCourse updates and editDetails exists
  useEffect(() => {
    if (insideEditStudent && editDetails?.course) {
      setValue("course", editDetails.course)
    }
  }, [filteredCourse])

  // form submit function
  const onSubmit = (data) => {
    if (insideEditStudent) {
      const updated = [...submittedData]
      updated[editIndex] = { ...data, id: updated[editIndex].id }
      setSubmittedData(updated)
      toast.success('Student Updated Successfully!', {
        position: "top-center", autoClose: 1000, hideProgressBar: false, theme: "colored", transition: Bounce,
      });
      setEditIndex(null)
      localStorage.removeItem("editId")
      setTimeout(() => {
        navigate('/students');
      }, 1200);
    } else {
      if (submittedData.some((item) => item.rollNo === data.rollNo)) {
        setSelectedCollege("")
        toast.error('Same RollNo Already Exists!', {
          position: "top-center", autoClose: 1000, hideProgressBar: false, theme: "colored", transition: Bounce,
        });
      } else {
        const newData = { ...data, id: uuidv4() };
        setSubmittedData([...submittedData, newData]);
        setSelectedCollege("")
        toast.success('Student Added Successfully!', {
          position: "top-center", autoClose: 1000, hideProgressBar: false, theme: "colored", transition: Bounce,
        });
      }
    }
    reset();
  };

  // Handle reset
  const handleCancel = (event) => {
    event.preventDefault();
    reset();
    setSelectedCollege("")
    localStorage.removeItem("editId")
    if (insideEditStudent) {
      navigate('/students')
    }
  };

  return (
    <div style={{ minHeight: "100vh" }} className="container-fluid">
      <div className="row">
        <Navbar insideStudents={true} />

        <div className="col-md-7 col-lg-10 p-4 ps-md-5 pt-md-5">
          <div>
            <Link to={'/students'} className={`text-dark ${styles.backStudents}`}>
              <FontAwesomeIcon icon={faArrowLeft} className='me-1' /> Back to Students List
            </Link>
          </div>

          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-5" style={{ maxHeight: "100vh" }}>
              <h5 className={styles.newStudentHeading}>{insideEditStudent ? "Edit" : "New"} Student</h5>
              {/* form  */}
              <form id="form" onSubmit={handleSubmit(onSubmit)}>
                {/* rollno  */}
                <label className="mt-2" htmlFor="rollNo">Roll Number</label><br />
                <input disabled={insideEditStudent} className={styles.rollInput} type="text" id="rollNo" name="rollNo"
                  {...register("rollNo", { required: "Roll Number is Required" })} />
                {errors.rollNo && <p className={styles.errorMessage}>{errors.rollNo.message}</p>}
                <br />
                {/* name  */}
                <label htmlFor="fname">First Name</label><br />
                <input type="text" name="firstName" id="fname" placeholder="First Name"
                  {...register("firstName", { required: "First Name is Required" })} />
                {errors.firstName && <p className={styles.errorMessage}>{errors.firstName.message}</p>}
                <br />

                <label htmlFor="lName">Last Name</label><br />
                <input type="text" name="lastName" id="lName" placeholder="Last Name"
                  {...register("lastName", { required: "Last Name is Required" })} />
                {errors.lastName && <p className={styles.errorMessage}>{errors.lastName.message}</p>}
                <br />
                {/* college  */}
                <label htmlFor="college">College</label><br />
                <select name="college" id="college" value={selectedCollege}
                  {...register("college", { required: "College is Required", onChange: (e) => setSelectedCollege(e.target.value) })}>
                  <option value="" hidden>Select College</option>
                  {
                    allCollege.length > 0 ?
                      allCollege.map((item, index) => (
                        <option key={index} value={item.College}>{item.College}</option>
                      ))
                      :
                      <option value="">No Colleges Available</option>
                  }
                </select>
                {errors.college && <p className={styles.errorMessage}>{errors.college.message}</p>}
                <br />
                {/* course  */}
                <label htmlFor="course">Course</label><br />
                <select name="course" id="course"
                  {...register("course", { required: "Course is Required" })}>
                  <option value="" hidden>Select Course</option>
                  {
                    filteredCourse.length > 0 ?
                      filteredCourse.map((item, index) => (
                        <option key={index} value={item.course}>{item.course}</option>
                      ))
                      :
                      <option value="">No Courses Available</option>
                  }
                </select>
                {errors.course && <p className={styles.errorMessage}>{errors.course.message}</p>}
                <br />
                {/* date */}
                <label htmlFor="jDate">Joining Date</label><br />
                <input className={styles.joinDate} type="date" name="joiningDate" id="jDate"
                  {...register("joiningDate", { required: "Joining Date is Required" })} />
                {errors.joiningDate && <p className={styles.errorMessage}>{errors.joiningDate.message}</p>}
                {/* update and cancel button */}
                <div className="mt-1">
                  <button type="submit" className={`me-3 ${styles.actionBtn}`}>
                    {insideEditStudent ? "Update" : "Save"}
                  </button>
                  <button type="button" onClick={handleCancel} className={`${styles.actionBtn} ${styles.cancelBtn}`}>
                    Cancel
                  </button>
                </div>

              </form>
            </div>
            {/* image */}
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
  );
};

export default NewStudent;
