import { useState, useEffect, useMemo } from 'react';
import CenterCard from "../components/CenterCard";
import API from "../api/axios";
import heroImage from "../assets/girl-microscope.png";


const CATEGORIES = ['All', 'Art', 'Programming', 'Language', 'Science', 'Robotics'];

function Home() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const res = await API.get("/centers");
        const approvedCenters = res.data.filter((center) => center.approved === true);
        setCenters(approvedCenters);
      } catch (err) {
        console.error(err);
        setError('حدث خطأ أثناء تحميل المراكز. حاول مجدداً.');
      } finally {
        setLoading(false);
      }
    };
    fetchCenters();
  }, []);
  
  const filteredCenters = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return centers.filter(center => {
      const matchesSearch =
        center.name?.toLowerCase().includes(search) ||
        center.city?.toLowerCase().includes(search) ||
        center.category?.toLowerCase().includes(search);

      const matchesCategory =
        activeCategory === 'All' ||
        center.category?.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [centers, searchTerm, activeCategory]);

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
      <section className="hero">
        <div>
          <h1>اعثر على أفضل مراكز تنمية المهارات لطفلك</h1>
          <p>اكتشف مراكز موثوقة في الفنون والبرمجة والعلوم وغيرها</p>
        </div>
      </section>
      <section className="featured-section">
        <h2>المراكز المميزة</h2>
        <div className="filter-bar">
        <div className="categories">
          {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
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
          <button onClick={() => {}}>بحث</button>
        </div>
        </div>
        <div className="cards-container">
          {loading ? (
            <p>جاري البحث...</p>
          ) : error ? (
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
