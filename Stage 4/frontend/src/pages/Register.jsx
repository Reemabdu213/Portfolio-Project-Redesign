import React, { useState } from 'react';
import API from '../api/axios';
import Loading from "../components/Loading";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const [centerName, setCenterName] = useState('');
  const [centerLocation, setCenterLocation] = useState('');
  const [centerActivities, setCenterActivities] = useState('');
  const [centerTrade, setCenterTrade] = useState('');
  const [centerLicense, setCenterLicense] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (password.length < 8) {
      setError("كلمة المرور يجب أن تكون 8 أحرف على الأقل");
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل");
      setLoading(false);
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("كلمة المرور يجب أن تحتوي على رقم واحد على الأقل");
      setLoading(false);
      return;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setError("كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل");
      setLoading(false);
      return;
    }
    if (role === 'center' && (!centerName || !centerLocation || !centerActivities || !centerTrade)) {
      setError("يرجى تعبئة جميع بيانات المركز");
      setLoading(false);
      return;
    }
    try {
      const res = await API.post('/auth/register', { name, email, password, role });
      const token = res.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (role === 'center') {
        await API.post('/centers', {
          name: centerName,
          location: centerLocation,
          description: centerActivities,
          license: centerLicense,
        }, 
        
        { headers: { Authorization: `Bearer ${token}` } });
        setLoading(false);
        setSuccess("تم إرسال طلب المركز بنجاح! سيتم مراجعته من قبل الإدارة.");
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      } else {
        window.location.href = '/';
      }
setSuccessMessage(

      role === "center"

        ? "تم تسجيلك بنجاح. سيتم مراجعة مركزك من قبل الإدارة قبل ظهوره في الموقع."

        : "تم إنشاء حسابك بنجاح."

    );

{successMessage && (
  <div className="modal-overlay">
    <div className="edit-profile-modal">
      <h2>تم التسجيل بنجاح</h2>
      <p>{successMessage}</p>

      <button
        className="main-btn"
        onClick={() => window.location.href = "/login"}
      >
        الذهاب لتسجيل الدخول
      </button>
    </div>
  </div>
)}

    } catch (err) {
      setLoading(false);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message);
      }
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>إنشاء حساب</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        {success && (
          <div style={{background:'#e8f5e9', color:'#2e7d32', padding:'14px 20px', borderRadius:'12px', marginBottom:'16px', border:'2px solid #a5d6a7', fontSize:'16px', fontWeight:'600'}}>
            {success}
          </div>
        )}
        <input type="text" placeholder="الاسم" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="البريد الالكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
<div className="password-container">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="كلمة المرور"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>
  <div className="select-container">
        <select value={role} onChange={(e) => setRole(e.target.value)} required>
          <option value="">نوع الحساب</option>
          <option value="parent">ولي امر</option>
          <option value="center">مركز</option>
        </select>
      <span className="select-arrow">⌄</span>
    </div>
        {role === 'center' && (
          <>
            <hr style={{margin: '15px 0', borderColor: '#ffe082'}} />
            <h3 style={{color: '#3b5b7a', marginBottom: '10px'}}>بيانات المركز</h3>
            <input type="text" placeholder="اسم المركز *" value={centerName} onChange={(e) => setCenterName(e.target.value)} required />
            <input type="text" placeholder="الموقع *" value={centerLocation} onChange={(e) => setCenterLocation(e.target.value)} required />
            <input type="text" placeholder="الأنشطة (مثال: برمجة، فنون) *" value={centerActivities} onChange={(e) => setCenterActivities(e.target.value)} required />
            <input type="text" placeholder="رقم السجل التجاري *" value={centerTrade} onChange={(e) => setCenterTrade(e.target.value)} required />
            <input type="text" placeholder="رقم الترخيص" value={centerLicense} onChange={(e) => setCenterLicense(e.target.value)} />
         <label className="upload-label">
   شعار المركز أو صورته 
</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) => setImage(e.target.files[0])}
/>

<small>
  ارفع صورة واضحة للمركز (JPG، PNG، WEBP)
</small>

          </>
        )}

        <button type="submit">تسجيل</button>
      </form>
    </div>
  );
}

export default Register;
