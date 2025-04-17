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

const NewCourse = ({ insideEditCourse }) => {

  const [submittedData, setSubbmittedData] = useState(JSON.parse(localStorage.getItem("courses")) || [])
  const [editIndex, setEditIndex] = useState(null)
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [allCollege, setAllCollege] = useState(JSON.parse(localStorage.getItem("college")) || [])

  // storing submied data to local storage
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(submittedData))
  }, [submittedData])

  // geting courses to fields on edit 
  useEffect(() => {
    if (insideEditCourse) {
      const id = localStorage.getItem("editId")
      const index = submittedData.findIndex((crs) => crs.id == id)
      setEditIndex(index)
      const editCourse = submittedData[index]
      setValue("course", editCourse?.course)
      setValue("duration", editCourse?.duration)
      setValue("college", editCourse?.college)
    }
  }, [])

  // form submission
  const onSubmit = (data) => {
    if (insideEditCourse) {
        const updated = [...submittedData]
        updated[editIndex] = { ...data, id: updated[editIndex].id }
        setSubbmittedData(updated)
        toast.success('Course Updated Successfully!', {
          position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: false, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
        });
        setEditIndex(null)
        localStorage.removeItem("editIndex")
        setTimeout(() => {
          navigate('/courses');
        }, 1200);
    } else {
        const newData = { ...data, id: uuidv4() }
        setSubbmittedData([...submittedData, newData])
        toast.success('Course Added Successfully!', {
          position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: false, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
        });
      }
    reset()
  };

  // Handle reset
  const handleCancel = (event) => {
    event.preventDefault();
    reset();
    localStorage.removeItem("editId")
    if (insideEditCourse) {
      navigate('/courses')
    }
  };

  return (
    <div style={{ minHeight: "100vh" }} className="container-fluid">
      <div className="row">
        <Navbar insideCourse={true} />

        {/* Main Content */}
        <div className="col-md-7 col-lg-10 p-4 ps-md-5 pt-md-5">

          {/* Back to Students Link */}
          <div>
            <Link to={'/courses'} className={`text-dark ${styles.backStudents}`}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#000000" }} className='me-1' /> Back to Course List
            </Link>
          </div>

          {/* New Student Form & Image */}
          <div className="row">
            <div className="col-sm-12 col-md-6 col-lg-5" style={{ maxHeight: "100vh" }}>
              <h5 className={styles.newStudentHeading}>{insideEditCourse ? "Edit" : "New"} Course</h5>
              {/* form  */}
              <form id="form" onSubmit={handleSubmit(onSubmit)}>
                {/* course  */}
                <label htmlFor="course">Course Name</label><br />
                <input type="text" name="course" id="course" placeholder="Course Name"
                  {...register("course", { required: "Course Name is Required" })} />
                {errors.course && <p className={styles.errorMessage}>{errors.course.message}</p>}
                <br />
                {/* duration  */}
                <label htmlFor="duration">Duration</label><br />
                <input type="number" name="duration" id="duration" placeholder="Duration in Years"
                  {...register("duration", { required: "Duration Period is Required", min: { value: 1, message: "Duration Can't Be Less Than 1 Year" } })} />
                {errors.duration && <p className={styles.errorMessage}>{errors.duration.message}</p>}
                <br />
                {/* college  */}
                <label htmlFor="college">College</label><br />
                <select name="college" id="college"
                  {...register("college", { required: "College is Required" })}>
                  <option value="" hidden>Select College</option>
                  {
                    allCollege?.length > 0 ?
                      allCollege?.map((item, index) => (
                        <option key={index} value={item?.College}>{item?.College} </option>
                      ))
                      :
                      <option value="">No College To List</option>
                  }
                </select>
                {errors.college && <p className={styles.errorMessage}>{errors.college.message}</p>}
                {/* button  */}
                <div className="mt-1">
                  {insideEditCourse ?
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

export default NewCourse