import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/600.css';

import LoginUI from "./pages/login";
import SignUp from "./pages/signup";
import CreateAccount from "./pages/createaccount";
import Home from "./pages/home";
import DashboardAdmin from "./components/dashboardAdmin";
import DashboardNormal from "./components/dashboardNormal";
import Perfil from "./pages/Profile";
import MisForms from "./pages/MyForms";
import Calendario from "./pages/Calendar";
import supabaseClient from "./utils/supabase";

function Dashboard() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const { data, error } = await supabaseClient
          .from("users")
          .select("role")
          .eq("email", Cookies.get("user_email"))
          .single();

        if (error) {
          console.error("Error al obtener rol:", error.message);
        } else {
          setRole(data?.role);
        }
      } catch (err) {
        console.error("Error inesperado:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, []);

  if (loading) return <p>Cargando...</p>;
  return role === "USUARIO" ? <DashboardNormal /> : <DashboardAdmin />;
}

function App() {
  const [userEmail, setUserEmail] = useState(Cookies.get("user_email"));
  const [registerEmail,setRegisterEmail] =useState(Cookies.get("register_email"));

  useEffect(() => {
    const interval = setInterval(() => {
      const cookieEmail = Cookies.get("user_email");
      const cookieRegister = Cookies.get("register_email");

      if (cookieEmail !== userEmail) setUserEmail(cookieEmail);
      if (cookieRegister !== registerEmail) setRegisterEmail(cookieRegister);
    }, 200);
    return () => clearInterval(interval);
  }, [userEmail, registerEmail]);


  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN Y SIGNUP */}
        <Route path="/login" element={<LoginUI setUserEmail={setUserEmail} />} />
        <Route path="/signup" element={<SignUp setUserEmail={setUserEmail}/>}/>
        
        {/* CREATE ACCOUNT */}
        <Route 
          path="/create-account" 
          element={registerEmail ? <CreateAccount userEmail={registerEmail}/> : <Navigate to="/login" />} 
        />

        {/* HOME + DASHBOARD */}
        <Route
          path="/"
          element={userEmail ? <Home /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard/>} />
          <Route path="perfil" element={<Perfil/>} />
          <Route path="calendario" element={<Calendario/>}/>
          <Route path="formularios" element={<MisForms/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
