import './LandingPage.css';
import { Link } from "react-router-dom";
import { FaSearch, FaBookOpen, FaStar, FaUserCheck, FaShieldAlt, FaArrowLeft } from "react-icons/fa";
import QRCode from "react-qr-code";

function LandingPage() {
  const siteUrl = "https://portfolio-project-1-2xla.onrender.com";

  return (
    <div className="landing-page" dir="rtl">

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1>اكتشف أفضل مراكز تعلم لطفلك</h1>
          <p>منصة جيل تساعد الأهل على إيجاد مراكز موثوقة، استكشاف الدورات، وحجزها بسهولة.</p>
          <div className="landing-hero-btns">
            <Link to="/register" className="landing-btn-primary">
              ابدأ الآن <FaArrowLeft />
            </Link>
            <Link to="/home" className="landing-btn-secondary">
              تصفح المراكز
            </Link>
          </div>
        </div>
      </section>

      {/* كيف يعمل */}
      <section className="landing-how">
        <h2>كيف يعمل جيل؟</h2>
        <div className="landing-steps">
          <div className="landing-step">
            <div className="step-icon"><FaUserCheck /></div>
            <h3>١. سجّل</h3>
            <p>أنشئ حساباً مجانياً في دقيقة واحدة</p>
          </div>
          <div className="landing-step">
            <div className="step-icon"><FaSearch /></div>
            <h3>٢. ابحث</h3>
            <p>استعرض المراكز وابحث عن الدورة المناسبة لطفلك</p>
          </div>
          <div className="landing-step">
            <div className="step-icon"><FaBookOpen /></div>
            <h3>٣. احجز</h3>
            <p>احجز الدورة بسهولة وتابع حجوزاتك</p>
          </div>
        </div>
      </section>

      {/* المميزات */}
      <section className="landing-features">
        <h2>لماذا جيل؟</h2>
        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <FaShieldAlt className="feature-icon" />
            <h3>مراكز موثوقة</h3>
            <p>جميع المراكز تمر بعملية تحقق ومراجعة قبل النشر</p>
          </div>
          <div className="landing-feature-card">
            <FaStar className="feature-icon" />
            <h3>تقييمات حقيقية</h3>
            <p>اقرأ تقييمات الأهل الآخرين واتخذ قرارك بثقة</p>
          </div>
          <div className="landing-feature-card">
            <FaBookOpen className="feature-icon" />
            <h3>دورات متنوعة</h3>
            <p>فنون، برمجة، لغات، علوم، رياضيات وأكثر</p>
          </div>
          <div className="landing-feature-card">
            <FaSearch className="feature-icon" />
            <h3>بحث سهل</h3>
            <p>ابحث عن المراكز حسب التصنيف أو الموقع بسهولة</p>
          </div>
        </div>
      </section>

      {/* QR Code */}
      <section className="landing-qr">
        <h2>زر موقعنا</h2>
        <p>امسح الكود للوصول للمنصة مباشرة</p>
        <QRCode value={siteUrl} className="qr-image" />
      </section>

      {/* CTA */}
      <section className="landing-cta">
        <h2>جاهز تبدأ؟</h2>
        <p>انضم لآلاف الأهل الذين يثقون بجيل</p>
        <Link to="/register" className="landing-btn-primary">
          سجّل مجاناً <FaArrowLeft />
        </Link>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 جيل — جميع الحقوق محفوظة</p>
      </footer>

    </div>
  );
}

export default LandingPage;
