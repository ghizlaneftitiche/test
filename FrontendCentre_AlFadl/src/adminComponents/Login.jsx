import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import Loading from "../Layout/Loading";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email_genere: email,
        password: password,
      });

      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user_role", response.data.user.role);
        localStorage.setItem("user_name", response.data.user.nomComplet);

        const role = response.data.user.role;

        if (role === "admin") navigate("/admin-dashboard");
        else {
          navigate("/notes");
        }
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.status === 401) {
        setError("Email ou mot de passe incorrect.");
      } else {
        setError("Erreur de connexion au serveur.");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] min-h-[550px] flex flex-col p-8 rounded-2xl bg-white shadow-2xl">
        <section className="text-center mb-8">
          <img
            src="fadl-02-150x150.png"
            className="w-24 m-auto mb-4"
            alt="logo"
          />
          <h3 className="font-bold text-[26px] text-gray-800">
            Centre <span className="text-amber-600">AL Fadl</span>
          </h3>
          <p className="text-gray-500 text-sm">Connectez-vous à votre espace</p>
        </section>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center mb-4 border border-red-100 font-bold">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 ml-1">
              Login
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="block w-full pl-10 pr-3 py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="@centre-alfadl.ma"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 ml-1">
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all tracking-[0.3em] font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 mt-2 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all font-bold text-lg active:scale-[0.98] cursor-pointer"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
