import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "HOME" },
    { path: "/gallery", label: "GALLERY" },
    { path: "/create", label: "UPLOAD" }
  ];

  const ACTIVE_COLOR = "#3A4F39";

  const styles = {
    navContainer: {
      width: "100%",
      height: "68px",       
      display: "flex",
      alignItems: "center",
      padding: "0 32px",       
      background: "white",
      borderBottom: "1px solid #ddd",
      position: "sticky",
      top: 0,
      zIndex: 50
    },
    logo: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "28px",        
      fontWeight: 700,
      letterSpacing: "0.5px",
      color: "#222",
      textTransform: "uppercase",
    },
    spacer: { flex: 1 },
    navLinks: {
      display: "flex",
      gap: "28px"             
    },
    linkContainer: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    link: {
      fontFamily: "Inter, sans-serif",
      fontSize: "12px",       
      letterSpacing: "1.5px",  
      color: "#444",
      textDecoration: "none",
      paddingBottom: "4px",
      transition: "color 0.25s"
    },
    underline: {
      height: "2px",
      width: "0%",
      background: "#ccc",
      transition: "width 0.25s ease"
    },
    underlineActive: {
      width: "100%",
      background: ACTIVE_COLOR
    }
  };

  return (
    <nav style={styles.navContainer}>
      <div style={styles.logo}>PhotoSphere</div>

      <div style={styles.spacer}></div>

      <div style={styles.navLinks}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          const [hover, setHover] = useState(false);

          return (
            <div
              key={item.path}
              style={styles.linkContainer}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <Link
                to={item.path}
                style={{
                  ...styles.link,
                  ...(active ? { color: ACTIVE_COLOR, fontWeight: 500 } : {})
                }}
              >
                {item.label}
              </Link>

              <div
                style={{
                  ...styles.underline,
                  ...(hover && !active ? { width: "100%" } : {}),
                  ...(active ? styles.underlineActive : {})
                }}
              />
            </div>
          );
        })}
      </div>
    </nav>
  );
}
