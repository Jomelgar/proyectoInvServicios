import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

import LoginUI from "./pages/login";
import Home from "./pages/home";
import DashboardAdmin from "./components/dashboardAdmin";
import DashboardNormal from "./components/dashboardNormal";

function Dashboard() {
  const isAdmin = true;
  return isAdmin ? <DashboardAdmin /> : <DashboardNormal />;
}

function Formularios() {
  return <h1>Página de Formularios</h1>;
}

function App() {
  const [userEmail, setUserEmail] = useState(Cookies.get("user_email"));

  // Sincroniza estado con cookie
  useEffect(() => {
    const interval = setInterval(() => {
      const cookieEmail = Cookies.get("user_email");
      if (cookieEmail !== userEmail) setUserEmail(cookieEmail);
    }, 200);
    return () => clearInterval(interval);
  }, [userEmail]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginUI setUserEmail={setUserEmail} />} />
        <Route
          path="/"
          element={userEmail ? <Home /> : <Navigate to="/login" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="formularios" element={<Formularios />} />
          <Route path="perfil" element={<></>} />
          <Route path='calendario' element={<></>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
