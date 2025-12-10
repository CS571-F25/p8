import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const ACTIVE_COLOR = "#3A4F39";

  const navItems = [
    { path: "/", label: "HOME" },
    { path: "/gallery", label: "GALLERY" },
    { path: "/create", label: "UPLOAD" }
  ];

  return (
    <>
      <nav
        style={{
          width: "100%",
          height: "72px",
          background: "white",
          borderBottom: "1px solid #ddd",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 300
        }}
      >
        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "28px",
            fontWeight: 700,
            color: ACTIVE_COLOR,
            textTransform: "uppercase"
          }}
        >
          PhotoSphere
        </div>

        <div
          className="mobile-icon"
          onClick={() => setOpen(true)}
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            gap: "4px"
          }}
        >
          <div style={{ width: "28px", height: "3px", background: ACTIVE_COLOR }}></div>
          <div style={{ width: "28px", height: "3px", background: ACTIVE_COLOR }}></div>
          <div style={{ width: "28px", height: "3px", background: ACTIVE_COLOR }}></div>
        </div>
      </nav>

     
      <div
        style={{
          position: "fixed",
          top: open ? "0" : "-60vh",   
          left: 0,
          width: "100%",
          height: "35vh",             
          background: "white",
          boxShadow: "0 4px 18px rgba(0,0,0,0.2)",
          transition: "top 0.35s ease",
          zIndex: 500,
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            top: "24px",
            right: "28px",
            fontSize: "32px",
            cursor: "pointer",
            color: ACTIVE_COLOR
          }}
        >
          ✕
        </div>

        <div
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "48px",
            fontWeight: 700,
            color: ACTIVE_COLOR,
            marginTop: "40px",
            marginBottom: "40px",
            textTransform: "uppercase"
          }}
        >
          PhotoSphere
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "20px",
                  textDecoration: "none",
                  letterSpacing: "1.5px",
                  color: active ? ACTIVE_COLOR : "#333",
                  fontWeight: active ? 600 : 400
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
