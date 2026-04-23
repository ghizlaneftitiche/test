import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import SidBar from "./Layout/SidBar";
import Dashboard from "./adminComponents/Dashboard";
import FormateurModule from "./adminComponents/FormateurModule";
import FormateurBranche from "./adminComponents/FormateurBranche";
import AjouterFormateur from "./adminComponents/AjouterFormateur";
import Login from "./adminComponents/Login";
import ListeFormateurs from "./adminComponents/ListeFormateurs";


function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      ) : (
        <div className="flex">
          <SidBar />
          <div className="flex-1 bg-white p-6">
            <Routes>
              <Route path="/admin-dashboard" element={<Dashboard />} />
              <Route path="/formateurModule" element={<FormateurModule />} />
              <Route path="/formateurBranche" element={<FormateurBranche />} />
              <Route path="/ajouter-formateur" element={<AjouterFormateur />} />
              <Route path="/liste-formateurs" element={<ListeFormateurs />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
