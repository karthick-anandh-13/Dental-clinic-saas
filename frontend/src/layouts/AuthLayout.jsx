import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

function AuthLayout() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* 🔥 Mouse tracking for glow effect */
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-navy flex items-center justify-center">

      {/* 🔥 Mouse spotlight */}
      <div
        className="pointer-events-none absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-30"
        style={{
          background: "radial-gradient(circle, #D4AF37, transparent 60%)",
          left: mousePos.x - 300,
          top: mousePos.y - 300
        }}
      />

      {/* 🔥 Animated blobs */}
      <div className="blob blob-red w-[500px] h-[500px] top-[-100px] left-[-100px]"></div>
      <div className="blob blob-gold w-[400px] h-[400px] bottom-[-100px] right-[-100px]"></div>
      <div className="blob blob-navy w-[300px] h-[300px] top-[40%] left-[60%]"></div>

      {/* 🔥 Content */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <Outlet />
      </div>

    </div>
  );
}

export default AuthLayout;