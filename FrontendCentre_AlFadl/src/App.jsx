import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import SidBar from "./Layout/SidBar";
import Dashboard from "./adminComponents/Dashboard";
import FormateurModule from "./adminComponents/FormateurModule";
import FormateurBranche from "./adminComponents/FormateurBranche";
import AjouterFormateur from "./adminComponents/AjouterFormateur";
import Login from "./adminComponents/Login";
import ListeFormateurs from "./adminComponents/ListeFormateurs";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  
  // On récupère le rôle pour savoir si on affiche la sidebar
  const userRole = localStorage.getItem("user_role");

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      ) : (
        <div className="flex">
          {userRole === "admin" && <SidBar />}
          
          <div className="flex-1 bg-white p-6">
            <Routes>
              <Route 
                path="/admin-dashboard" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/ajouter-formateur" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AjouterFormateur />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/liste-formateurs" 
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <ListeFormateurs />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/FormateurModule" 
                element={
                  <ProtectedRoute allowedRoles={["FormateurModule"]}>
                    <FormateurModule />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/FormateurBranche" 
                element={
                  <ProtectedRoute allowedRoles={["FormateurBranche"]}>
                    <FormateurBranche />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      )}
    </>
  );
}

export default App;