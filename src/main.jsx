import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import App from "./App.jsx";
import { reducido } from "./lib/movimiento.js";
import "./styles.css";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);
document.documentElement.classList.toggle("reducido", reducido);
document.fonts?.ready.then(() => ScrollTrigger.refresh());

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
