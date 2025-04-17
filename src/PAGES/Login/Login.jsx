import React, { useEffect } from 'react';
import styles from './Login.module.css';
import loginLogo from '../../ASSETS/loginImage.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import universityLogo from '../../ASSETS/Path 2.svg'
import users from '../../UTILS/users'
import { Bounce, toast, ToastContainer } from 'react-toastify'

const Login = ({ insideForgotPass }) => {

  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  useEffect(() => {
    localStorage.removeItem("logged")
  }, [])

  const onSubmit = (data) => {
    const user = users.find(user => user?.email == data.email && user?.password == data.password)
    if (user) {
      localStorage.setItem("logged", JSON.stringify(user))
      toast('Login Successfull!!', {
        position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark", transition: Bounce,
      });
      if (user.role == "admin") {
        setTimeout(() => {
          navigate('/students');
        }, 1300);
      } else if (user.role == "representative") {
        setTimeout(() => {
          navigate('/results');
        }, 1300);
      }
    } else {
      toast('Invalid Email / Password', {
        position: "top-center", autoClose: 1000, hideProgressBar: false, closeOnClick: false, pauseOnHover: true, draggable: true, progress: undefined, theme: "dark", transition: Bounce,
      });
    }
  }

  return (
    <>
      {/* login page nav with only university  */}
      <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
          {/* Header Logo and Name */}
          <Link style={{ textDecoration: "none", color: "black" }} className="navbar-brand">
            <div className="d-flex justify-content-center align-items-center">
              <div>
                <img src={universityLogo} className={styles.headerLogo} alt="headerLogo" />
              </div>
              <div className={styles.universityName}>
                United Kerala <br /> University
              </div>
            </div>
          </Link>
        </div>
      </nav>

      <div className={`container-fluid ${styles.loginContainer}`}>
        <div className="row align-items-center justify-content-center">

          {/* Login Image */}
          <div className="d-none d-lg-block col-lg-5 text-center">
            <img src={loginLogo} alt="Login" className={styles.LoginLogo} />
          </div>

          {/* Login and reset heads */}
          <div className="col-12 col-lg-5">
            <div className={styles.formWrapper}>
              {!insideForgotPass ?
                <h3 className={styles.LoginHeading}>Login</h3>
                :
                <h3 className={styles.LoginHeading}>Reset Password</h3>
              }
              {/* login and rest forms  */}
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email Input */}
                <div className={styles.inputContainer}>
                  <FontAwesomeIcon icon={faEnvelope} className={styles.inputLogo} />
                  <input type="email" placeholder="Enter Your Email" className={styles.loginInput}
                    {...register("email", { required: "Email is Required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid Email" } })} />
                  {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
                </div>

                {/* Password Input */}
                {!insideForgotPass &&
                  <div className={styles.inputContainer}>
                    <FontAwesomeIcon icon={faLock} className={styles.inputLogo} />
                    <input type="password" placeholder="Enter Your Password" className={styles.loginInput}
                      {...register("password", { required: "Password is Required", minLength: { value: 6, message: "Password must be at least 6 characters" }, maxLength: { value: 12, message: "Password must be less than 12 characters" } })} />
                    {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
                  </div>}

                {/* Login Button & reset pass buton */}
                {!insideForgotPass ?
                  <button type="submit" className={styles.LoginBtn}>Login</button>
                  :
                  <button type="submit" className={styles.LoginBtn}>Reset Password</button>
                }
              </form>

              {/* forgot pass and back lagin  */}
              {!insideForgotPass ?
                <Link to="/forgotPassword" className={styles.Forgotpassword}>Forgot Password?</Link>
                :
                <Link to="/" className={styles.Forgotpassword}>Back To Login</Link>
              }
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={1000} hideProgressBar={false} newestOnTop={false} closeOnClick={false} rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Bounce} />
    </>

  );
};

export default Login;
