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
      <section className="home-hero redesign-hero">
        <div className="hero-overlay redesign-hero-text">
          <span className="hero-badge">منصة تعليمية للأطفال</span>

          <h1>اكتشفي أفضل مراكز التعلم لطفلك</h1>

          <p>
            جيل يساعد الأهالي على إيجاد مراكز موثوقة، استكشاف الدورات،
            وقراءة التقييمات بسهولة.
          </p>

          <div className="hero-actions">
            <button className="hero-btn" onClick={() => navigate("/search")}>
              ابدأ الآن
            </button>

            <button className="hero-btn secondary" onClick={() => navigate("/search")}>
              تصفح المراكز
            </button>
          </div>
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

      <section className="why-section">
        <div className="section-title">
          <span>لماذا جيل؟</span>
          <h2>كل ما يحتاجه الأهل في مكان واحد</h2>
        </div>

        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">🔍</div>
            <h3>بحث أسهل</h3>
            <p>ابحثي عن المراكز حسب المدينة، التصنيف، أو اسم المركز.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">✅</div>
            <h3>مراكز موثوقة</h3>
            <p>نعرض المراكز المعتمدة فقط بعد مراجعتها من الإدارة.</p>
          </div>

          <div className="why-card">
            <div className="why-icon">⭐</div>
            <h3>تقييمات واضحة</h3>
            <p>اطلعي على آراء الأهالي قبل اختيار المركز المناسب.</p>
          </div>
        </div>
      </section>

      <section className="steps-section">
        <div className="section-title">
          <span>كيف يعمل؟</span>
          <h2>اختاري المركز المناسب بثلاث خطوات</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <strong>01</strong>
            <h3>ابحثي</h3>
            <p>اكتبي اسم المركز أو اختاري التصنيف المناسب لطفلك.</p>
          </div>

          <div className="step-card">
            <strong>02</strong>
            <h3>قارني</h3>
            <p>راجعي التفاصيل، المدينة، الدورات، والتقييمات.</p>
          </div>

          <div className="step-card">
            <strong>03</strong>
            <h3>احجزي</h3>
            <p>ابدئي بالتواصل مع المركز المناسب لطفلك بكل سهولة.</p>
          </div>
        </div>
      </section>

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
                {cat === "All" ? "الكل" : cat}
              </button>
            ))}
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="ابحثي عن مركز أو مدينة أو تصنيف..."
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

      <section className="reviews-section">
        <div className="section-title">
          <span>آراء الأهالي</span>
          <h2>تجربة أسهل لاختيار مراكز الأطفال</h2>
        </div>

        <div className="reviews-grid">
          <div className="review-card">
            <p>“سهل علي البحث عن مركز قريب ومناسب لعمر طفلي.”</p>
            <h4>أم خالد</h4>
          </div>

          <div className="review-card">
            <p>“التصنيفات واضحة والتفاصيل ساعدتني أقرر بسرعة.”</p>
            <h4>أم نورة</h4>
          </div>

          <div className="review-card">
            <p>“فكرة جميلة تجمع المراكز التعليمية في مكان واحد.”</p>
            <h4>أبو فيصل</h4>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <h3>جيل</h3>
        <p>منصة تساعد الأهالي على اكتشاف مراكز تعليمية موثوقة للأطفال.</p>
        <span>© 2026 جميع الحقوق محفوظة</span>
      </footer>
    </div>
  );
}

export default Home;
