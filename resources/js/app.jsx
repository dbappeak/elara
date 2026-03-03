import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import StartApp from "./StartApp.jsx";

ReactDOM.createRoot(document.getElementById("app")).render(
    <BrowserRouter>
        <StartApp />
    </BrowserRouter>
);