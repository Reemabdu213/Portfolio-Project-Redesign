import React, { useState } from 'react';
import API from '../api/axios';
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
const [showPassword, setShowPassword] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      alert('تم تسجيل الدخول بنجاح');
      window.location.href = '/';
    } catch (err) {
      setError('البريد الالكتروني او كلمة المرور غير صحيحة');
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>تسجيل الدخول</h2>
        {error && <p style={{color: 'red'}}>{error}</p>}
        <input
          type="email"
          placeholder="البريد الالكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">تسجيل الدخول</button>
      </form>
    </div>
  </div>
);

}

export default Login;
