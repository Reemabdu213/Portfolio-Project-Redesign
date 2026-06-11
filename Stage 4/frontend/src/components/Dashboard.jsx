import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import {
  FaShieldAlt, FaBuilding, FaCalendarAlt, FaBook,
  FaCheck, FaTrash, FaPlus, FaEye, FaStar,
  FaFileAlt, FaImage, FaMapMarkerAlt, FaChartBar,
  FaUsers, FaClock,
} from "react-icons/fa";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [centers, setCenters] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [licenseFile, setLicenseFile] = useState(null);
  const [category, setCategory] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;
  const navigate = useNavigate();

  // ── فورم الدورات ──
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseInstructor, setCourseInstructor] = useState("");
  const [courseType, setCourseType] = useState("");
  const [courseTime, setCourseTime] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseDays, setCourseDays] = useState("");
  const [courseSuccess, setCourseSuccess] = useState("");

  // ── فورم تعديل دورة ──
  const [editingCourse, setEditingCourse] = useState(null);
  const [editName, setEditName] = useState("");
  const [editInstructor, setEditInstructor] = useState("");
  const [editType, setEditType] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editDays, setEditDays] = useState("");

  useEffect(() => {
    setLoading(true);
    if (role === "admin") {
      Promise.all([
        API.get("/centers/all"),
        API.get("/bookings/all"),
        API.get("/courses"),
      ]).then(([centersRes, bookingsRes, coursesRes]) => {
        setCenters(centersRes.data);
        setBookings(bookingsRes.data);
        setCourses(coursesRes.data);
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [role]);

  // ── أكشنز الأدمن ──
  const handleApprove = async (id) => {
    try {
      await API.patch(`/centers/${id}/approve`);
      setSuccess("تمت الموافقة على المركز بنجاح");
      setCenters(centers.map((c) => c.id === id ? { ...c, approved: true } : c));
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/centers/${id}`);
      setSuccess("تم حذف المركز بنجاح");
      setCenters(centers.filter((c) => c.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleAddCenter = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      let licenseUrl = "";

      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadRes = await API.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.url;
      }

      if (licenseFile) {
        const formData = new FormData();
        formData.append("document", licenseFile);
        const uploadRes = await API.post("/upload/document", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        licenseUrl = uploadRes.data.url;
      }

      await API.post("/centers", {
        name, location, description,
        image: imageUrl, license_file: licenseUrl, category
      });
      setSuccess("تم إرسال بيانات المركز بنجاح");
      setShowForm(false);
      setName(""); setLocation(""); setDescription("");
      setImage(null); setLicenseFile(null); setCategory("");
      if (role === "admin") {
        const res = await API.get("/centers/all");
        setCenters(res.data);
      }
    } catch (err) { console.error(err); }
  };

  const getCenterBookingsCount = (center) =>
    bookings.filter((b) => b.center_name === center.name).length;

  const getCenterCoursesCount = (center) =>
    courses.filter((c) => c.center_id === center.id).length;

  const getStatusArabic = (status) => {
    if (status === "pending") return "قيد الانتظار";
    if (status === "confirmed") return "مؤكد";
    if (status === "cancelled") return "ملغي";
    return status;
  };

  const chartData = centers.map((center) => ({
    name: center.name?.length > 10 ? center.name.substring(0, 10) + "..." : center.name,
    الحجوزات: getCenterBookingsCount(center),
    الكورسات: getCenterCoursesCount(center),
    المشاهدات: center.views || 0,
  }));

  const topCourses = [...courses]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);

  if (loading) return <div className="loader"></div>;

  if (role === "admin") {
    return (
      <div className="dashboard-layout" dir="rtl">
        <aside className="dashboard-sidebar">
          <div className="sidebar-header">
            <FaShieldAlt className="sidebar-logo-icon" />
            <span>لوحة التحكم</span>
          </div>
          <nav className="sidebar-nav">
            {[
              { id: "overview", icon: <FaChartBar />, label: "نظرة عامة" },
              { id: "centers", icon: <FaBuilding />, label: "المراكز" },
              { id: "bookings", icon: <FaCalendarAlt />, label: "الحجوزات" },
              { id: "courses", icon: <FaBook />, label: "الكورسات" },
            ].map((item) => (
              <button
                key={item.id}
                className={`sidebar-btn ${activeTab === item.id ? "active" : ""}`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <p>مرحباً، {user.name || "المدير"}</p>
          </div>
        </aside>

        <main className="dashboard-main">
          <div className="dashboard-topbar">
            <h1 className="dashboard-title">
              {activeTab === "overview" && "نظرة عامة"}
              {activeTab === "centers" && "إدارة المراكز"}
              {activeTab === "bookings" && "الحجوزات"}
              {activeTab === "courses" && "الكورسات"}
            </h1>
            {activeTab === "centers" && (
              <button className="admin-add-btn" onClick={() => setShowForm(!showForm)}>
                <FaPlus /> إضافة مركز
              </button>
            )}
          </div>

          {success && <div className="success-message">{success}</div>}

          {showForm && activeTab === "centers" && (
            <form onSubmit={handleAddCenter} className="form-container admin-form">
              <input placeholder="اسم المركز" value={name} onChange={(e) => setName(e.target.value)} required />
              <input placeholder="الموقع" value={location} onChange={(e) => setLocation(e.target.value)} required />
              <input placeholder="الوصف" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <label>صورة المركز</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
              <label>وثيقة أو ترخيص المركز</label>
              <input type="file" accept=".pdf,image/*" onChange={(e) => setLicenseFile(e.target.files[0])} />
              <button type="submit">حفظ المركز</button>
            </form>
          )}

          <div className="stats-grid">
            <div className="stat-card">
              <FaBuilding className="stat-icon" />
              <h3>{centers.length}</h3>
              <p>إجمالي المراكز</p>
            </div>
            <div className="stat-card">
              <FaCheck className="stat-icon success" />
              <h3>{centers.filter((c) => c.approved).length}</h3>
              <p>المراكز المقبولة</p>
            </div>
            <div className="stat-card">
              <FaClock className="stat-icon warning" />
              <h3>{centers.filter((c) => !c.approved).length}</h3>
              <p>بانتظار الموافقة</p>
            </div>
            <div className="stat-card">
              <FaCalendarAlt className="stat-icon" />
              <h3>{bookings.length}</h3>
              <p>إجمالي الحجوزات</p>
            </div>
            <div className="stat-card">
              <FaBook className="stat-icon" />
              <h3>{courses.length}</h3>
              <p>إجمالي الكورسات</p>
            </div>
          </div>

          {activeTab === "overview" && (
            <div className="overview-grid">
              <div className="chart-card">
                <h3>الحجوزات والكورسات لكل مركز</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="الحجوزات" fill="#2f5578" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="الكورسات" fill="#ff7a00" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-card">
                <h3>الكورسات الأكثر مشاهدة</h3>
                {topCourses.length === 0 ? (
                  <p>لا توجد بيانات</p>
                ) : (
                  <div className="top-courses-list">
                    {topCourses.map((course, i) => (
                      <div key={course.id} className="top-course-item">
                        <span className="top-course-rank">#{i + 1}</span>
                        <div className="top-course-info">
                          <p className="top-course-name">{course.name}</p>
                          <p className="top-course-center">{course.center_name}</p>
                        </div>
                        <div className="top-course-views">
                          <FaEye />
                          <span>{course.views || 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "centers" && (
            <div className="dashboard-cards">
              {centers.length === 0 ? <p>لا توجد مراكز حتى الآن</p> : (
                centers.map((center) => (
                  <div key={center.id} className="dashboard-box">
                    {center.image && (
                      <img src={center.image} alt={center.name} className="admin-center-image" />
                    )}
                    <h2>{center.name}</h2>
                    <p><FaMapMarkerAlt className="inline-icon" />{center.location}</p>
                    <p className="center-desc">{center.description}</p>
                    <div className="center-stats-row">
                      <span><FaCalendarAlt className="inline-icon" />{getCenterBookingsCount(center)} حجز</span>
                      <span><FaBook className="inline-icon" />{getCenterCoursesCount(center)} كورس</span>
                      <span><FaEye className="inline-icon" />{center.views || 0} مشاهدة</span>
                    </div>
                    <div className="center-stats-row">
                      <span><FaStar className="inline-icon" />{center.average_rating || "لا يوجد"}</span>
                      <span><FaUsers className="inline-icon" />{center.review_count || 0} تقييم</span>
                      <span className={center.approved ? "status-approved" : "status-pending"}>
                        {center.approved ? "مقبول" : "بانتظار الموافقة"}
                      </span>
                    </div>
                    <div className="admin-files">
                      {center.image && (
                        <a href={center.image} target="_blank" rel="noreferrer">
                          <FaImage /> عرض الصورة
                        </a>
                      )}
                      {center.license_file && (
                        <a href={center.license_file} target="_blank" rel="noreferrer">
                          <FaFileAlt /> عرض الوثيقة
                        </a>
                      )}
                    </div>
                    <div className="admin-actions">
                      {!center.approved && (
                        <button className="approve-btn" onClick={() => handleApprove(center.id)}>
                          <FaCheck /> قبول
                        </button>
                      )}
                      <button className="delete-center-btn" onClick={() => handleDelete(center.id)}>
                        <FaTrash /> حذف
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "bookings" && (
            <div className="modern-table-wrapper">
              {bookings.length === 0 ? <p>لا توجد حجوزات حتى الآن</p> : (
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>المركز</th>
                      <th>الكورس</th>
                      <th>المستخدم</th>
                      <th>التاريخ</th>
                      <th>الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.center_name}</td>
                        <td>{booking.course_name}</td>
                        <td>{booking.email}</td>
                        <td>{booking.date ? new Date(booking.date).toLocaleDateString("ar-SA") : "-"}</td>
                        <td>
                          <span className={`status-badge ${booking.status}`}>
                            {getStatusArabic(booking.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === "courses" && (
            <div className="dashboard-cards">
              {courses.length === 0 ? <p>لا توجد كورسات حتى الآن</p> : (
                courses.map((course) => (
                  <div key={course.id} className="dashboard-box">
                    <h3>{course.name}</h3>
                    <p><strong>المركز:</strong> {course.center_name || "غير محدد"}</p>
                    <p><strong>المدرب:</strong> {course.instructor || "غير محدد"}</p>
                    <p><strong>الوصف:</strong> {course.description || "لا يوجد"}</p>
                    <p><strong>الأيام:</strong> {course.days || "-"}</p>
                    <p><strong>الوقت:</strong> {course.times || "-"}</p>
                    <p><strong>المدة:</strong> {course.duration || "-"}</p>
                    <p><strong>السعر:</strong> {course.price} ريال</p>
                    <div className="top-course-views">
                      <FaEye />
                      <span>{course.views || 0} مشاهدة</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    );
  }

  if (role === "center") {
    return (
      <div className="dashboard-page" dir="rtl">
        <h1>بوابة المركز</h1>
        {success && <p className="success-message">{success}</p>}
        <button onClick={() => setShowForm(!showForm)} className="admin-add-btn">
          <FaPlus /> إضافة مركزي
        </button>
        {showForm && (
          <form onSubmit={handleAddCenter} className="form-container admin-form">
            <input placeholder="اسم المركز" value={name} onChange={(e) => setName(e.target.value)} required />
            <input placeholder="الموقع" value={location} onChange={(e) => setLocation(e.target.value)} required />
            <input placeholder="الوصف" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <label>التصنيف</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">اختر تصنيفاً (اختياري)</option>
              <option value="Art">فنون</option>
              <option value="Programming">برمجة</option>
              <option value="Language">لغات</option>
              <option value="Science">علوم</option>
              <option value="Robotics">روبوتيكس</option>
              <option value="Math">رياضيات</option>
              <option value="Sports">رياضة</option>
            </select>
            <label>صورة المركز</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            <label>وثيقة أو ترخيص المركز</label>
            <input type="file" accept=".pdf,image/*" onChange={(e) => setLicenseFile(e.target.files[0])} />
            <button type="submit">إرسال للمراجعة</button>
          </form>
        )}
        <p className="status-pending">سيظهر مركزك بعد موافقة الإدارة.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page" dir="rtl">
      <h1>حسابي</h1>
      <p>يمكنك إدارة حسابك من هنا.</p>
    </div>
  );
}

export default Dashboard;
