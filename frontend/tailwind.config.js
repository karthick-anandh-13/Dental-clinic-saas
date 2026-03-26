export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {

      /* =========================
         🎨 COLOR SYSTEM
      ========================= */
      colors: {
        navy: "#0B1D2A",
        gold: "#D4AF37",
        crimson: "#8B0000",
        black: "#000000",
        white: "#FFFFFF",
      },

      /* =========================
         🌈 GRADIENTS
      ========================= */
      backgroundImage: {
        "premium-gradient": "linear-gradient(135deg, #8B0000, #D4AF37)",
        "navy-gradient": "radial-gradient(circle at 20% 20%, #0B1D2A, #000000)",
      },

      /* =========================
         ✨ SHADOWS (glow effects)
      ========================= */
      boxShadow: {
        gold: "0 0 40px rgba(212, 175, 55, 0.4)",
        crimson: "0 0 40px rgba(139, 0, 0, 0.4)",
      },

      /* =========================
         🔥 ANIMATIONS
      ========================= */
      animation: {
        blob: "blob 10s infinite ease-in-out",
      },

      keyframes: {
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(40px, -40px) scale(1.1)" },
        },
      },

      /* =========================
         🔤 FONT (optional future)
      ========================= */
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

    },
  },
  plugins: [],
};