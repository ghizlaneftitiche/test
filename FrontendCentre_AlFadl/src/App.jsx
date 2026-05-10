import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import SidBar from "./Layout/SidBar";
import Dashboard from "./adminComponents/Dashboard";
import AjouterFormateur from "./adminComponents/AjouterFormateur";
import ListeFormateurs from "./adminComponents/ListeFormateurs";
import AjouterStagiaires from "./adminComponents/AjouterStagiaires";
import GestionListesBranches from "./adminComponents/GestionListeBranches";
import Login from "./adminComponents/Login";

import NotesBranchePage from "./composantsFormateur/pages/NotesBranchePage";
import NotesModulePage from "./composantsFormateur/pages/NotesModulePage";
import SortiesPage from "./composantsFormateur/pages/SortiesPage";

import ProtectedRoute from "./ProtectedRoute";
import Topbar from "./composantsFormateur/components/Topbar";
import ListeSorties from "./Admin_Sorties/ListeSorties";
import TableauNotes from "./AdminNotes/TableauNotes";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  const userRole = localStorage.getItem("user_role");
  const userName = localStorage.getItem("user_name");
  const isAdmin = userRole === "admin";
  const isFormateur =
    userRole === "FormateurBranche" || userRole === "FormateurModule";

  return (
    <>
      {isLoginPage ? (
        <Routes>
          <Route path="/" element={<Login />} />
        </Routes>
      ) : (
        <div
          className={
            isAdmin ? "flex min-h-screen" : "block min-h-screen bg-gray-50"
          }
        >
          {isAdmin && <SidBar />}

          <div className="flex-1">
            {isFormateur && <Topbar role={userRole} userName={userName} />}

            <main className="p-6">
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
                  path="/inscription"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <AjouterStagiaires />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/gestionStagiaires"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <GestionListesBranches />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/notes"
                  element={
                    <ProtectedRoute
                      allowedRoles={["FormateurBranche", "FormateurModule"]}
                    >
                      {userRole === "FormateurBranche" ? (
                        <NotesBranchePage />
                      ) : (
                        <NotesModulePage />
                      )}
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/sorties"
                  element={
                    <ProtectedRoute allowedRoles={["FormateurBranche"]}>
                      <SortiesPage />
                    </ProtectedRoute>
                  }
                />

                 <Route
                  path="/notesAdmin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <TableauNotes />
                    </ProtectedRoute>
                  }
                />
                 <Route
                  path="/sortiesAdmin"
                  element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                      <ListeSorties />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
