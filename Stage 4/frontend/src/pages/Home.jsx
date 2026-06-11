import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import heroImage from "../assets/girl-microscope.png";


function Home() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = ["All", "Art", "Programming", "Language", "Science", "Robotics"];

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await API.get("/centers");
        const approvedCenters = res.data.filter((center) => center.approved === true);
        setCenters(approvedCenters);
      } catch (err) {
        console.log("Failed to load centers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  const filteredCenters = centers.filter((center) => {
    const text = searchText.toLowerCase();

    const matchesSearch =
      center.name?.toLowerCase().includes(text) ||
      center.location?.toLowerCase().includes(text) ||
      center.description?.toLowerCase().includes(text);

    const matchesCategory =
      selectedCategory === "All" || center.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading-box">جاري تحميل المراكز...</div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero redesign-hero">
        <div className="hero-overlay redesign-hero-text">
          <span className="hero-badge">منصة تعليمية للأطفال</span>

          <h1>اكتشفي أفضل مراكز التعلم لطفلك</h1>

          <p>
            جيل يساعد الأهل على إيجاد مراكز موثوقة، استكشاف الدورات،
            وقراءة التقييمات بسهولة.
          </p>

          <button className="hero-btn" onClick={() => navigate("/search")}>
            اكتشفي المزيد
          </button>
        </div>

        <div className="redesign-hero-image-box">
          <div className="hero-blob"></div>
          <img
            src={heroImage}
            alt="طفلة تتعلم"
            className="hero-image redesign-girl"
          />
        </div>
      </section>

      {/* الفلاتر */}
      <section className="filter-bar">
        <input
          type="text"
          placeholder="ابحثي عن مركز، مدينة، أو دورة..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="search-input"
        />

        <div className="filter-buttons">
          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category ? "filter-btn active" : "filter-btn"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* المراكز */}
      <section className="centers-section">
        <div className="section-header">
          <h2>المراكز المتاحة</h2>
          <p>{filteredCenters.length} تم العثور على مركز</p>
        </div>

        {filteredCenters.length === 0 ? (
          <div className="empty-centers">
            <h3>لا توجد مراكز</h3>
          </div>
        ) : (
          <div className="centers-grid">
            {filteredCenters.map((center) => (
              <div className="center-card" key={center.id || center._id}>
                {center.image ? (
                  <img
                    src={`${API.defaults.baseURL.replace("/api", "")}/uploads/${center.image}`}
                    alt={center.name}
                    className="center-image"
                  />
                ) : (
                  <div className="center-image-placeholder">🏫</div>
                )}

                <div className="center-content">
                  <span className="center-category">
                    {center.category || "تطوير الطفل"}
                  </span>

                  <h3>{center.name}</h3>

                  <p className="center-location">
                    📍 {center.location || "لم تتم إضافة الموقع"}
                  </p>

                  <p className="center-description">
                    {center.description || "لا يوجد وصف متاح."}
                  </p>

                  <div className="center-rating">
                    ⭐{" "}
                    {center.review_count > 0
                      ? center.average_rating
                      : "لا يوجد تقييم"}
                    <span> ({center.review_count || 0} تقييم)</span>
                  </div>

                  <Link
                    to={`/centers/${center.id || center._id}`}
                    className="details-btn"
                  >
                    عرض التفاصيل
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
