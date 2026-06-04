import { useState, useEffect, useRef } from "react";
import "./App.css";

// ── Countdown ──────────────────────────────────────────
function useCountdown(targetDate) {
  const calc = () => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const t = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

// ── Intersection Observer hook ─────────────────────────
function useVisible(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── Petal particle ─────────────────────────────────────
function Petals() {
  const petals = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 8}s`,
    duration: `${6 + Math.random() * 6}s`,
    size: `${10 + Math.random() * 14}px`,
    rotate: `${Math.random() * 360}deg`,
  }));
  return (
    <div className="petals-wrap" aria-hidden>
      {petals.map((p) => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
            "--rot": p.rotate,
          }}
        />
      ))}
    </div>
  );
}

// ── Lock screen ────────────────────────────────────────
function LockScreen({ onUnlock }) {
  const [shaking, setShaking] = useState(false);

  const handleClick = () => {
    setShaking(true);
    setTimeout(() => { setShaking(false); onUnlock(); }, 400);
  };

  return (
    <div className="lock-screen">
      <Petals />
      <div className="lock-inner">
        <div className="lock-line" />
        <div className="lock-heart">♥</div>
        <h1 className="lock-title">
          SIZGA<br />TAKLIFNOMA<br />KELDI
        </h1>
        <button
          className={`lock-btn ${shaking ? "shake" : ""}`}
          onClick={handleClick}
          aria-label="Ochish"
        >
          <span className="lock-icon">🔒</span>
        </button>
        <p className="lock-hint">Bosing</p>
      </div>
    </div>
  );
}

// ── Hero ───────────────────────────────────────────────
function Hero() {
  const [ref, visible] = useVisible(0.1);
  return (
    <section className="hero" ref={ref}>
      <div className="hero-img-wrap">
        <img src="/couple.jpg" alt="Baxroma va Sirojiddin" className="hero-img" />
        <div className="hero-overlay" />
      </div>
      <div className={`hero-text ${visible ? "fade-in" : ""}`}>
        <p className="hero-script">nikoh to'yiga taklif</p>
        <h2 className="hero-names">
          <span className="name-line">BAXROMA</span>
          <span className="hero-va">va</span>
          <span className="name-line">SIROJIDDIN</span>
        </h2>
        <div className="hero-divider"><span>♥</span></div>
        <p className="scroll-hint">PASTGA SURING ↓</p>
      </div>
    </section>
  );
}

// ── Message ────────────────────────────────────────────
function Message() {
  const [ref, visible] = useVisible();
  return (
    <section className="message-section" ref={ref}>
      <div className={`message-card ${visible ? "slide-up" : ""}`}>
        <div className="rose-deco">🌸</div>
        <p className="message-label">Aziz va qadrdon insonimiz!</p>
        <p className="message-text">
          Hayotimizdagi eng baxtli kunlardan biri — nikoh to'yimizni siz bilan
          birga nishonlashni niyat qildik. Sizni ushbu kechamizga samimiy taklif
          etamiz.
        </p>
        <p className="message-text">
          Quvonchli kunimizda aziz mehmonimiz bo'lishingizni intizorlik bilan
          kutamiz.
        </p>
        <div className="rose-deco">🌸</div>
      </div>
    </section>
  );
}

// ── Calendar ───────────────────────────────────────────
function Calendar() {
  const [ref, visible] = useVisible();
  const days = ["Du", "Se", "Chor", "Pay", "Ju", "Sha", "Ya"];
  // June 2026: starts on Monday (index 0)
  const totalDays = 30;
  const startDay = 0; // Monday
  const weddingDay = 23;

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return (
    <section className="calendar-section" ref={ref}>
      <div className={`cal-wrap ${visible ? "fade-in" : ""}`}>
        <p className="section-script">sana</p>
        <h3 className="cal-month">IYUN 2026</h3>
        <div className="cal-grid">
          {days.map((d) => (
            <div key={d} className="cal-head">{d}</div>
          ))}
          {cells.map((d, i) => (
            <div
              key={i}
              className={`cal-cell ${d === weddingDay ? "wedding-day" : ""} ${!d ? "empty" : ""}`}
            >
              {d === weddingDay ? (
                <span className="heart-bg">
                  <span className="heart-icon">♥</span>
                  <span className="day-num">{d}</span>
                </span>
              ) : d}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Venue ──────────────────────────────────────────────
function Venue() {
  const [ref, visible] = useVisible();
  return (
    <section className="venue-section" ref={ref}>
      <div className={`venue-wrap ${visible ? "slide-up" : ""}`}>
        <p className="section-script">manzil</p>
        <h3 className="venue-title">To'y manzili</h3>
        <div className="venue-icon">🏛️</div>
        <p className="venue-name">"ROHAT"<br />TANTANALAR SAROYI</p>
        <p className="venue-time">Vaqti: 18:00</p>
        <p className="venue-addr">
          Manzil: Chilonzor tumani,<br />Arnasoy ko'chasi 7/2
        </p>
        <div className="venue-btns">
          <a
            href="https://yandex.uz/maps/?text=Rohat+tantanalar+saroyi+Toshkent"
            target="_blank"
            rel="noreferrer"
            className="map-btn"
          >
            YANDEX XARITASI
          </a>
          <a
            href="https://maps.google.com/?q=Rohat+tantanalar+saroyi+Toshkent"
            target="_blank"
            rel="noreferrer"
            className="map-btn"
          >
            GOOGLE MAPS
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Gift card ──────────────────────────────────────────
function GiftCard() {
  const [ref, visible] = useVisible();
  const [copied, setCopied] = useState(false);
  const cardNum = "9860 0801 2105 2726";

  const copy = () => {
    navigator.clipboard.writeText(cardNum.replace(/\s/g, ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="gift-section" ref={ref}>
      <div className={`gift-wrap ${visible ? "slide-up" : ""}`}>
        <p className="section-script">to'yona</p>
        <h3 className="gift-title">To'yona</h3>
        <p className="gift-desc">
          Agar istasangiz, to'yonani kuyov kartasiga yuborishingiz mumkin.
        </p>
        <div className="card-visual">
          <img src="/couple.jpg" alt="" className="card-photo" />
          <div className="card-overlay-content">
            <div className="card-label">QABUL QILUVCHI</div>
            <div className="card-name">SIROJIDDIN</div>
            <div className="card-num-label">KARTA RAQAMI</div>
            <div className="card-number">{cardNum}</div>
          </div>
        </div>
        <p className="card-hint">
          Karta raqamini nusxalab olishingiz yoki quyidagi tugmalar orqali
          Payme va Click'ni ochishingiz mumkin.
        </p>
        <div className="card-actions">
          <button className="card-btn primary" onClick={copy}>
            {copied ? "✓ NUSXALANDI!" : "RAQAMNI NUSXALASH"}
          </button>
          <div className="pay-btns">
            <a
              href="https://payme.uz"
              target="_blank"
              rel="noreferrer"
              className="card-btn pay"
            >
              PAYME
            </a>
            <a
              href="https://my.click.uz"
              target="_blank"
              rel="noreferrer"
              className="card-btn pay"
            >
              CLICK
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Countdown section ──────────────────────────────────
function CountdownSection() {
  const [ref, visible] = useVisible();
  const { days, hours, minutes, seconds } = useCountdown("2026-06-23T18:00:00");

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="countdown-section" ref={ref}>
      <div className={`countdown-wrap ${visible ? "fade-in" : ""}`}>
        <p className="section-script">kutib turibmiz</p>
        <h3 className="countdown-title">Har lahzani sanayapmiz</h3>
        <div className="countdown-grid">
          {[
            { val: pad(days), label: "KUN" },
            { val: pad(hours), label: "SOAT" },
            { val: pad(minutes), label: "DAQIQA" },
            { val: pad(seconds), label: "SONIYA" },
          ].map(({ val, label }) => (
            <div key={label} className="cd-unit">
              <div className="cd-num">{val}</div>
              <div className="cd-label">{label}</div>
            </div>
          ))}
        </div>
        <p className="countdown-msg">Sizni intiqlik bilan kutamiz.</p>
        <div className="rings">💍</div>
        <div className="footer-brand">by InviteStudio</div>
      </div>
    </section>
  );
}

// ── App ────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="app">
      {!unlocked ? (
        <LockScreen onUnlock={() => setUnlocked(true)} />
      ) : (
        <main className="main">
          <Hero />
          <Message />
          <Calendar />
          <Venue />
          <GiftCard />
          <CountdownSection />
        </main>
      )}
    </div>
  );
}
