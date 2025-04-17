import React, { useState } from 'react'
import Navbar from '../../COMPONENTS/Navbar/Navbar'
import styles from '../../PAGES/NewStudent/NewStudent.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import * as XLSX from 'xlsx'
import { v4 as uuidv4 } from 'uuid';
import loader from '../../ASSETS/loader.gif'
import { Bounce, toast, ToastContainer } from 'react-toastify'

const Settings = () => {

  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  function excelDateToJSDate(serial) {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);
    const day = String(date_info.getDate()).padStart(2, '0');
    const month = String(date_info.getMonth() + 1).padStart(2, '0');
    const year = date_info.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const onSubmit = (data) => {
    const file = data.file[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target.result;
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const parsedData = XLSX.utils.sheet_to_json(worksheet);

        // adding id 
        const idUpdatedData = parsedData.map((item) => ({
          ...item, id: uuidv4(), joiningDate: item.joiningDate ? excelDateToJSDate(Number(item.joiningDate)) : ""
        }));
        console.log(idUpdatedData);

        // collegeData 
        if (data.upload === "college") {

          const correctFile = idUpdatedData.filter(item => !item.College && !item.Location);

          if (correctFile.length > 0) {
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.error('Please Upload Correct File!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });
            }, 1200);
            return;
          }
          const collegeData = JSON.parse(localStorage.getItem("college"));
          const existingColleges = collegeData ? collegeData : [];

          // filtering new colleges 
          const newColleges = idUpdatedData.filter((item) => {
            return !existingColleges.some((existingCollege) => existingCollege.College === item.College && existingCollege.Location === item.Location);
          });

          if (newColleges.length > 0) {
            const updatedCollege = [...existingColleges, ...newColleges];
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.success('Uploaded Successfully!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });
            }, 1200);
            localStorage.setItem("college", JSON.stringify(updatedCollege));
          } else {
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.error('College Already Exists!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });
            }, 1200);
          }
        }
        // courseData
        if (data.upload === "course") {
          // correctFile check
          const correctFile = idUpdatedData.filter(item => !item.course && !item.college && !item.duration)
          if (correctFile.length > 0) {
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.error('Please Upload Correct File!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });
            }, 1200);
            return;
          }
          // getting from LS
          const courseData = JSON.parse(localStorage.getItem("courses"))
          const existingData = courseData ? courseData : []

          // check new datas
          const newCoursesData = idUpdatedData?.filter((item) => {
            return !existingData.some((existingCourse) => existingCourse.course === item.course && existingCourse.college === item.college && existingCourse.duration === item.duration)
          })

          if (newCoursesData.length > 0) {
            const updatedCourse = [...existingData, ...newCoursesData]
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.success('uploaded Successfully!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });
            }, 1200);
            localStorage.setItem("courses", JSON.stringify(updatedCourse))
          } else {
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.error('Course Already Exists!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });;
            }, 1200);
          }
        }
        // studentData
        if (data.upload === "students") {
          // correctFile Check
          const correctFile = idUpdatedData.filter(item => !item.joiningDate)
          if (correctFile.length > 0) {
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.error('Please Upload Correct File!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });
            }, 1200);
            return;
          }
          // getting from LS 
          const studentData = JSON.parse(localStorage.getItem("students"))
          const existingData = studentData ? studentData : []

          // check new data 
          const newStudentData = idUpdatedData.filter((item) => {
            return !existingData.some((existingStudent) => existingStudent.rollNo === item.rollNo)
          })
          if (newStudentData.length > 0) {
            const updatedStudents = [...existingData, ...newStudentData]
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.success('Uploaded Successfully!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });
            }, 1200);
            localStorage.setItem("students", JSON.stringify(updatedStudents))
          } else {
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.error('Student Already Exists!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });
            }, 1200);
          }
        }
        // resultData
        if (data.upload === "results") {
          // check correctFile
          const correctFile = idUpdatedData.filter(item => !item.student && !item.score)
          if (correctFile.length > 0) {
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.error('Please Upload Correct File!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });
            }, 1200);
            return
          }
          // getting from LS
          const resultData = JSON.parse(localStorage.getItem("results"))
          const existingData = resultData ? resultData : []
          // check for new data
          const newResultData = idUpdatedData.filter((item) => {
            return !existingData.some((existingResult) => existingResult.rollNo == item.rollNo)
          })
          if (newResultData.length > 0) {
            const updateResult = [...existingData, ...newResultData]
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.success('Uploaded Successfully!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });
            }, 1200);
            localStorage.setItem("results", JSON.stringify(updateResult))
          } else {
            setLoading(true)
            setTimeout(() => {
              setLoading(false)
              toast.error('Results Already Exists!', {
                position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "colored", transition: Bounce,
              });
            }, 1200);
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
    reset();
  };

  const handleCancel = (event) => {
    event.preventDefault();
    reset();
  };

  const handleLogout = () => {
    localStorage.removeItem('logged')
    navigate('/')
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <Navbar insideSettings={true} />

        <main className="col p-4 pt-md-5">
          <div className="w-100">
            <button onClick={handleLogout} className={styles.logoutButton}>
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> Logout
            </button>
          </div>

          <div className='w-100'>
            <Link to={'/students'} className={`text-dark ${styles.backStudents}`}>
              <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#000000" }} className='me-1' /> Back to Home
            </Link>

            <div className="mt-4">
              <h1 className='my-2 fw-bold'>Data Upload</h1>

              <form id="form" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="upload">Upload Type</label><br />
                <select className={styles.settingsInput} name="upload" id="upload"
                  {...register("upload", { required: "File is Required" })}>
                  <option value="" selected hidden>Choose Upload Type</option>
                  <option value="college">College</option>
                  <option value="course">Course</option>
                  <option value="students">Students</option>
                  <option value="results">Results</option>
                </select>
                {errors.upload && <p className={styles.errorMessage}>{errors.upload.message}</p>} <br />

                <input type="file" name='file' className={`mt-4 ${styles.settingsInput}`}
                  {...register("file", { required: "Choose a File" })} />
                {errors.file && <p className={styles.errorMessage}>{errors.file.message}</p>}


                <div className={`mt-1 ${styles.settingsInput}`}>
                  <button type="submit" className={`me-3 ${styles.actionBtn}`}>Upload</button>
                  <button type="button" className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={handleCancel}>
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        </main>
      </div>

      {loading &&
        <div className={styles.loaderDiv}>
          <img src={loader} alt="" className={styles.loader} />
        </div>}

      <ToastContainer position="top-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" transition={Bounce} />
    </div>
  )
}

export default Settings