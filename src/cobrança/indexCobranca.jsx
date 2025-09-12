import React from "react";
import SidebarLayout from "../components/SidebarLayout";
import CobrancaForm from "./CobrancaForm";
import "./Cobranca.css";

export default function Cobranca() {
  return (
    <SidebarLayout>
      <main className="cobranca-content">
        <CobrancaForm />
      </main>
    </SidebarLayout>
  );
}
