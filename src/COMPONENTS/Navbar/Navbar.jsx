import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import styles from './Navbar.module.css';
import universityLogo from '../../ASSETS/Path 2.svg'
import studentLogo from '../../ASSETS/studentLogo.svg'
import coursesLogo from '../../ASSETS/coursesLogo.svg'
import profileLogo from '../../ASSETS/profilePhoto.png'
import resultLogo from '../../ASSETS/resultLogo.svg'
import settingsLogo from '../../ASSETS/settings.svg'

const Navbar = ({ insideStudents, insideCourse, insideResult, insideSettings }) => {

    const user = JSON.parse(localStorage.getItem('logged'));

    return (
        <>
            {/* Top Navbar */}
            <nav className="navbar navbar-expand-lg bg-light d-block d-md-none">
                <div className="container-fluid">
                    {/* Header Logo and Name */}
                    <Link style={{ textDecoration: "none", color: "black" }} className={`navbar-brand ${styles.navbarBrand}`}>
                        <div className="d-flex justify-content-center align-items-center">
                            <div>
                                <img src={universityLogo} className={styles.headerLogo} alt="headerLogo" />
                            </div>
                            <div className={styles.universityName}>
                                United Kerala <br /> University
                            </div>
                        </div>
                    </Link>
                    {/* Toggle Button */}
                    <button className={`navbar-toggler border-light ${styles["togglerButton"]}`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" >&#9776;</button>
                    {/* Nav Links */}
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 text-center">
                            <hr />
                            {user.role === "admin" &&
                                <>
                                    <li className={`nav-item pt-2 pb-2 text-dark rounded ${styles.navItem}`}>
                                        <Link style={{ textDecoration: "none", color: "black" }} to={'/students'} className={`nav-link ${insideStudents && styles["active"]} ${styles.navLink}`} aria-current="page">
                                            <img src={studentLogo} className="pe-2" alt="studentLogo" /> Students
                                        </Link>
                                    </li>
                                    <li className={`nav-item pt-1 pb-1 text-dark rounded ${styles.navItem}`}>
                                        <Link style={{ textDecoration: "none", color: "black" }} to={'/courses'} className={`nav-link ${insideCourse && styles["active"]} ${styles.navLink}`} aria-current="page" >
                                            <img src={coursesLogo} className="pe-2" alt="courseLogo" /> Courses
                                        </Link>
                                    </li>
                                </>
                            }
                            <li className={`nav-item pt-1 pb-1 text-dark rounded ${styles.navItem}`}>
                                <Link style={{ textDecoration: "none", color: "black" }} to={'/results'} className={`nav-link ${insideResult && styles["active"]} ${styles.navLink}`} aria-current="page" >
                                    <img src={resultLogo} className="pe-2" alt="ResultLogo" /> Results
                                </Link>
                            </li>
                            <hr />
                            <li className={`nav-item pt-1 pb-1 text-dark rounded ${styles.navItem}`}>
                                <Link style={{ textDecoration: "none", color: "black" }} className={`nav-link ${styles.navLink}`} aria-current="page" >
                                    <img className={styles.profileLogo} src={profileLogo} alt="" /> {user?.name}
                                </Link>
                            </li>
                            <hr />
                            {user.role === "admin" &&
                                <li className={`nav-item pt-1 pb-1 text-dark rounded ${styles.navItem}`}>
                                    <Link style={{ textDecoration: "none", color: "black" }} to={'/settings'} className={`nav-link ${insideSettings && styles["active"]} ${styles.navLink}`} aria-current="page" >
                                        <img src={settingsLogo} className="pe-2" alt="settingsLogo" /> Settings
                                    </Link>
                                </li>
                            }
                            {user.role === "representative" &&
                                <li className={`nav-item pt-1 pb-1 rounded ${styles.navItem}`}>
                                    <Link style={{ textDecoration: "none" }} to={'/'} className={`nav-link ${styles.navLink} ${styles.logout}`} aria-current="page" >
                                        <FontAwesomeIcon icon={faArrowRightFromBracket} className='pe-2' /> Logout
                                    </Link>
                                </li>}
                        </ul>
                    </div>
                </div>
            </nav>

            {/* sidebar */}
            <nav className={`col-md-3 col-lg-2 d-none d-md-block ${styles["sidebar"]}`}>
                {/* sidebar logo and name  */}
                <Link style={{ textDecoration: "none", color: "black" }} className={styles.sidebarHomeLink}>
                    <div>
                        <img src={universityLogo} className={`ps-0 ${styles["headerLogo"]}`} alt="headerLogo" />
                    </div>
                    <div className={`fs-5 ${styles["universityName"]}`}>
                        United Kerala <br /> University
                    </div>
                </Link>
                <br />
                {/* sidebar navLinks  */}
                <div className={styles.siderbarAlign}>
                    <div className="w-100">
                        {user.role === "admin" &&
                            <>
                                <Link style={{ textDecoration: "none", color: "black" }} to={'/students'} className={`mt-3 ps-4 ${insideStudents && styles["active"]} ${styles["sidebarNavLinks"]}`}>
                                    <img src={studentLogo} alt="studentLogo" className="me-2" /> Students
                                </Link>
                                <Link style={{ textDecoration: "none", color: "black" }} to={'/courses'} className={`ps-4 ${insideCourse && styles["active"]} ${styles["sidebarNavLinks"]}`}>
                                    <img src={coursesLogo} alt="coursesLogo" className="me-2" /> Courses
                                </Link>
                            </>
                        }
                        <Link style={{ textDecoration: "none", color: "black" }} to={'/results'} className={`ps-4 ${insideResult && styles["active"]} ${styles["sidebarNavLinks"]}`} >
                            <img src={resultLogo} alt="resultLogo" className="me-2" /> Results
                        </Link>
                    </div>

                    <div className="w-100">
                        {/* profile  */}
                        <Link style={{ textDecoration: "none", color: "black" }} className={`ps-4 ${styles["sidebarNavLinks"]} ${styles["profileLink"]}`} >
                            <img className={styles.profileLogo} src={profileLogo} alt="profilePhoto" /> {user?.name}
                        </Link>
                        <hr className={styles.hrLine} />
                        {user.role === "admin" &&
                            <Link style={{ textDecoration: "none", color: "black" }} to={'/settings'} className={`ps-4 ${insideSettings && styles["active"]} ${styles["sidebarNavLinks"]}`}>
                                <img src={settingsLogo} className='me-2' alt="settingsLogo" /> Settings
                            </Link>
                        }
                        {
                            user.role === "representative" &&
                            <Link style={{ textDecoration: "none", color:"red" }} to={'/'} className={`ps-4 ${styles["sidebarNavLinks"]} ${styles["logout"]}`}>
                                <FontAwesomeIcon icon={faArrowRightFromBracket} className='me-2' /> Logout
                            </Link>
                        }
                    </div>
                </div>
            </nav>

        </>
    );
};

export default Navbar;
