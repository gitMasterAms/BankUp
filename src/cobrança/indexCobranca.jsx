import React from "react";
import Sidebar from "../components/Sidebar";
import CobrancaForm from "./CobrancaForm";
import "./Cobranca.css";

export default function Cobranca() {
  return (
    <div className="cobranca-container">
      <Sidebar />
      <main className="cobranca-content">
        <CobrancaForm />
      </main>
    </div>
  );
}
