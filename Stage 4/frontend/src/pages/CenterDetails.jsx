import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import API from "../api/axios";

function CenterDetails() {
  const { id } = useParams();
  const [center, setCenter] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [courses, setCourses] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user.role;

  useEffect(() => {
    API.patch(`/centers/${id}/view`).catch(() => {});
    API.get(`/centers/${id}`)
      .then(res => { setCenter(res.data); setLoading(false); })
      .catch(() => setLoading(false));
    API.get(`/reviews/center/${id}`)
      .then(res => setReviews(res.data.reviews))
      .catch(() => {});
    API.get(`/centers/${id}/courses`)
      .then(res => setCourses(res.data))
      .catch(() => {});
  }, [id]);

  const handleReview = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/reviews', { centre_id: id, rating, comment });
      setReviews([...reviews, res.data]);
      setSuccess('تمت إضافة التقييم بنجاح');
      setComment('');
    } catch (err) {
      setError('فشل إضافة التقييم. الرجاء تسجيل الدخول أولاً.');
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', {
        course_id: selectedCourse.id,
        center_id: id,
        date: bookingDate
      });
      setBookingSuccess('تم الحجز بنجاح');
      setBookingDate('');
      setTimeout(() => {
        setSelectedCourse(null);
        setBookingSuccess('');
      }, 2000);
    } catch (err) {
      setBookingError('فشل الحجز. الرجاء المحاولة مرة أخرى.');
    }
  };

  if (loading) return <div className="loader"></div>;
  if (!center) return <h1>المركز غير موجود</h1>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' }}>

      {/* Popup */}
      {selectedCourse && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '30px', width: '400px', maxWidth: '90%', position: 'relative' }}>
            <button onClick={() => setSelectedCourse(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            <h2 style={{ color: '#3b5b7a', marginBottom: '15px' }}>{selectedCourse.name || selectedCourse.title}</h2>
            <p><strong>السعر:</strong> {selectedCourse.price} ريال</p>
            <p><strong>المدة:</strong> {selectedCourse.duration}</p>
            <p><strong>الأيام:</strong> {selectedCourse.days}</p>
            <p><strong>الوقت:</strong> {selectedCourse.times}</p>
            {selectedCourse.instructor && <p><strong>المدرب:</strong> {selectedCourse.instructor}</p>}
            <hr style={{ margin: '15px 0' }} />
            {bookingSuccess ? (
              <p style={{ color: 'green', textAlign: 'center', fontSize: '18px' }}>{bookingSuccess}</p>
            ) : (
              <form onSubmit={handleBooking}>
                <label><strong>اختر التاريخ:</strong></label>
                <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required
                  style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '10px', border: '2px solid #ffe082' }} />
                {bookingError && <p style={{ color: 'red' }}>{bookingError}</p>}
                <button type="submit" style={{ width: '100%' }}>تأكيد الحجز</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* معلومات المركز */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '30px', marginBottom: '30px', border: '1px solid #d6e6f5', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <img
            src={center.image || "/default-center.jpg"}
            alt={center.name}
            style={{ width: "100%", height: "260px", objectFit: "cover", borderRadius: "18px" }}
          />
        </div>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <h1 style={{ color: '#3b5b7a', marginBottom: '10px' }}>{center.name}</h1>
          <p style={{ color: '#64748b' }}>{center.location}</p>
          <p style={{ color: '#475569', marginTop: '10px', lineHeight: '1.8' }}>{center.description}</p>
        </div>
        <div style={{ flex: 1, minWidth: '250px', background: '#f8faff', borderRadius: '16px', padding: '20px' }}>
          <p><strong>التقييم:</strong> {reviews.length > 0 ? `${center.average_rating}/5` : "لا يوجد تقييم"}</p>
          <p><strong>عدد التقييمات:</strong> {reviews.length}</p>
          <p><strong>عدد الكورسات:</strong> {courses.length}</p>
        </div>
      </div>

      {/* الكورسات */}
      <h2 style={{ color: '#3b5b7a', marginBottom: '15px' }}>الكورسات المتاحة</h2>
      {courses.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>لا توجد كورسات متاحة حتى الآن.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          {courses.map(course => (
            <div key={course.id} style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '2px solid #ffe082', boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>
              <h3 style={{ color: '#e65100', marginBottom: '10px' }}>{course.name || course.title}</h3>
              <p>{course.price} ريال</p>
              <p>{course.duration}</p>
              <p>{course.days}</p>
              {course.times && <p>{course.times}</p>}
              {course.instructor && <p>{course.instructor}</p>}
              {role === 'parent' && (
                <button onClick={() => setSelectedCourse(course)} style={{ marginTop: '10px', width: '100%' }}>
                  عرض التفاصيل والحجز
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* التقييمات */}
      <h2 style={{ color: '#3b5b7a', marginBottom: '15px' }}>التقييمات</h2>
      {reviews.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>لا توجد تقييمات حتى الآن.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          {reviews.map((review, index) => (
            <div key={index} style={{ background: '#fff9c4', padding: '16px', borderRadius: '16px', border: '1px solid #ffe082' }}>
              <p><strong>{review.user_name}</strong></p>
              <p>{review.rating}/5</p>
              <p>{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {role === 'parent' && (
        <>
          <h3>أضف تقييماً</h3>
          {success && <p style={{ color: 'green' }}>{success}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <form onSubmit={handleReview}>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="5">5 نجوم</option>
              <option value="4">4 نجوم</option>
              <option value="3">3 نجوم</option>
              <option value="2">2 نجوم</option>
              <option value="1">نجمة واحدة</option>
            </select>
            <textarea
              placeholder="اكتب تقييمك..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">إرسال التقييم</button>
          </form>
        </>
      )}

      {role === 'admin' && (
        <p style={{ color: '#ff6f00', fontWeight: 'bold' }}>المدير لا يستطيع إضافة تقييمات</p>
      )}
      {role === 'center' && (
        <p style={{ color: '#ff6f00', fontWeight: 'bold' }}>المركز لا يستطيع إضافة تقييمات</p>
      )}

    </div>
  );
}

export default CenterDetails;
