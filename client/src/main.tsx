import { createRoot } from "react-dom/client";
import App from "./app";
import "./index.css";
import "@/lib/fontawesome";

createRoot(document.getElementById("root")!).render(<App />);
