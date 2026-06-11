import React from 'react';
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaShieldAlt, FaBuilding, FaUser, FaKey, FaStar, FaSignOutAlt, FaSeedling } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
const [showNavbar, setShowNavbar] = useState(true);

  useEffect(() => {
  let lastScrollY = window.scrollY;

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }

    lastScrollY = window.scrollY;
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
  return (
    <nav className="navbar" dir="rtl">
      <div className="logo">
        <FaSeedling style={{color: '#ff7a00', fontSize: '28px'}} />
        <h2 className="logo-text">جيل</h2>
      </div>
      <div className="nav-links">
        <Link to="/"><FaHome /> الرئيسية</Link>
        {role && (
          <Link to="/dashboard">
            {role === 'admin'
              ? <><FaShieldAlt /> لوحة التحكم</>
              : role === 'center'
              ? <><FaBuilding /> بوابة المركز</>
              : <><FaUser /> حسابي</>}
          </Link>
        )}
        {!role ? (
          <>
            <Link to="/login"><FaKey /> تسجيل الدخول</Link>
            <Link to="/register"><FaStar /> إنشاء حساب</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={{ marginTop: '0' }}>
            <FaSignOutAlt /> تسجيل الخروج
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
