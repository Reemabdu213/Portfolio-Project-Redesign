import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CenterCard from "../components/CenterCard";
import API from "../api/axios";
import heroImage from "../assets/girl-microscope.png";

const CATEGORIES = ["All", "Art", "Programming", "Language", "Science", "Robotics"];

function Home() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await API.get("/centers");
        const approvedCenters = res.data.filter((center) => center.approved === true);
        setCenters(approvedCenters);
      } catch (err) {
        console.error(err);
        setError("حدث خطأ أثناء تحميل المراكز. حاول مجدداً.");
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, []);

  const filteredCenters = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return centers.filter((center) => {
      const matchesSearch =
        center.name?.toLowerCase().includes(search) ||
        center.city?.toLowerCase().includes(search) ||
        center.location?.toLowerCase().includes(search) ||
        center.category?.toLowerCase().includes(search) ||
        center.description?.toLowerCase().includes(search);

      const matchesCategory =
        activeCategory === "All" ||
        center.category?.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [centers, searchTerm, activeCategory]);

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

          <h1>اكتشف أفضل مراكز التعلم للأطفال</h1>

          <p>
            جيل يساعد الأهالي على إيجاد مراكز موثوقة، استكشاف الدورات،
            وقراءة التقييمات بسهولة.
          </p>

          <button className="hero-btn" onClick={() => navigate("/search")}>
            استكشف المراكز
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

      {/* Search + Categories */}
      <section className="featured-section">
        <h2>المراكز المميزة</h2>

        <div className="filter-bar">
          <div className="categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="ابحث عن مركز أو مدينة أو تصنيف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="button">بحث</button>
          </div>
        </div>

        <div className="cards-container">
          {error ? (
            <p className="error-message">{error}</p>
          ) : filteredCenters.length === 0 ? (
            <p>لا توجد نتائج مطابقة.</p>
          ) : (
            filteredCenters.map((center) => (
              <CenterCard key={center._id || center.id} center={center} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
