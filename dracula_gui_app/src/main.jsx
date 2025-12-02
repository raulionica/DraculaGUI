import React from "react";
import { createRoot } from "react-dom/client";
import DraculaGUI from "./components/DraculaGUI";

const root = document.getElementById("dracula-gui-react-root");
createRoot(root).render(<DraculaGUI />);
