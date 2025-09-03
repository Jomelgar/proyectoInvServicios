import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";

import LoginUI from "./pages/login";
import SignUp from "./pages/signup";
import CreateAccount from "./pages/createaccount";
import Home from "./pages/home";
import DashboardAdmin from "./components/dashboardAdmin";
import DashboardNormal from "./components/dashboardNormal";
import Perfil from "./pages/Profile";
import MisForms from "./pages/MyForms";
import Casos from "./pages/Cases";
import Admin from "./pages/Basement";
import Calendario from "./pages/Calendar";
import supabaseClient from "./utils/supabase";
import Users from "./pages/Users";
import Categorias from "./pages/Categories";
import Lugares from "./pages/Places";

// 🔐 Ruta protegida
function ProtectedRoute({ allowedRoles, children }) {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const email = Cookies.get("user_email");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data } = await supabaseClient
          .from("user_roles")
          .select("role")
          .eq("uuid", email)
          .single();
        setRole(data?.role || null);
      } catch (err) {
        console.error("Error al obtener rol:", err.message);
      } finally {
        setLoading(false);
      }
    };
    if (email) fetchRole();
  }, [email]);

  if (loading) return <p>Cargando...</p>;
  if (!role) return <Navigate to="/login" />;
  return allowedRoles.includes(role) ? children : <Navigate to="/" />;
}

// 📊 Dashboard normal/admin según rol
function Dashboard() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data } = await supabaseClient
          .from("user_roles")
          .select("role")
          .eq("uuid", Cookies.get("user_email"))
          .single();
        setRole(data?.role || null);
      } catch (err) {
        console.error("Error al obtener rol:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) return <p>Cargando dashboard...</p>;
  return role === "USUARIO" ? <DashboardNormal /> : <DashboardAdmin />;
}

function App() {
  const [userEmail, setUserEmail] = useState(Cookies.get("user_email"));
  const [registerEmail, setRegisterEmail] = useState(Cookies.get("register_email"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserEmail(Cookies.get("user_email"));
      setRegisterEmail(Cookies.get("register_email"));
    };
    window.addEventListener("focus", handleStorageChange);
    return () => window.removeEventListener("focus", handleStorageChange);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN Y SIGNUP */}
        <Route path="/login" element={<LoginUI setUserEmail={setUserEmail} />} />
        <Route path="/signup" element={<SignUp setUserEmail={setRegisterEmail} />} />

        {/* CREATE ACCOUNT */}
        <Route
          path="/create-account"
          element={registerEmail ? <CreateAccount userEmail={registerEmail} setUserEmail={setUserEmail}/> : <Navigate to="/login" />}
        />

        {/* HOME + DASHBOARD */}
        <Route path="/" element={userEmail ? <Home /> : <Navigate to="/login" />}>
          <Route index element={<Dashboard />} />
          <Route path='lugares' element={<Lugares/>}/>
          <Route path="perfil" element={<Perfil />} />
          <Route path="calendario" element={<Calendario />} />
          <Route path="formularios" element={<MisForms />} />

          {/* Rutas protegidas */}
          <Route
            path="verificar"
            element={
              <ProtectedRoute allowedRoles={["CREADOR", "ADMIN"]}>
                <Casos />
              </ProtectedRoute>
            }
          />

          <Route
            path="gestion"
            element={
              <ProtectedRoute allowedRoles={["CREADOR"]}>
                <Outlet />
              </ProtectedRoute>
            }
          >
            <Route path="sedes" element={<Admin />} />
            <Route path="usuarios" element={<Users />} />
            <Route path="categorias" element={<Categorias />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
