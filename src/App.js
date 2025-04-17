import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS (includes Popper.js)
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './PAGES/Login/Login';
import Students from './PAGES/Students/Students';
import Courses from './PAGES/Courses/Courses';
import NewStudent from './PAGES/NewStudent/NewStudent';
import Results from './PAGES/Result/Results';
import Settings from './PAGES/Settings/Settings';
import Pnf from './PAGES/Pnf';
import NewCourse from './PAGES/NewCourse/NewCourse';
import NewResult from './PAGES/NewResult/NewResult';
import { useEffect, useState } from 'react';

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("logged"));
    setUser(loggedUser);
  }, []);

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/forgotPassword' element={<Login insideForgotPass={true} />} />

          {user?.role == "admin" && (
            <>
              <Route path='/students' element={<Students />} />
              <Route path='/newStudent' element={<NewStudent />} />
              <Route path='/editStudent' element={<NewStudent insideEditStudent={true} />} />
              <Route path='/courses' element={<Courses />} />
              <Route path='/newCourse' element={<NewCourse />} />
              <Route path='/editCourse' element={<NewCourse insideEditCourse={true} />} />
              <Route path='/results' element={<Results />} />
              <Route path='/newResult' element={<NewResult />} />
              <Route path='/editResult' element={<NewResult insideEditResult={true} />} />
              <Route path='/settings' element={<Settings />} />
            </>
          )}

          {user?.role === "representative" && (
            <Route path='/results' element={<Results />} />
          )}

          <Route path='/*' element={<Pnf />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
