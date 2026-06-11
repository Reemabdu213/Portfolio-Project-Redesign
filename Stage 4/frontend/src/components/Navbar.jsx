import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaHome, FaShieldAlt, FaBuilding, FaUser, FaKey, FaStar, FaSignOutAlt, FaSeedling } from 'react-icons/fa';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const [showNavbar, setShowNavbar] = useState(true);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

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
    <nav className="navbar" dir="rtl" style={{ top: showNavbar ? '0' : '-80px', transition: 'top 0.3s' }}>
      <div className="logo">
        <FaSeedling style={{ color: '#ff7a00', fontSize: '28px' }} />
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
          <button onClick={handleLogout} className="logout-btn">
            <FaSignOutAlt /> تسجيل الخروج
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
