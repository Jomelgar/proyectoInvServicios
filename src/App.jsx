import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

function Dashboard() {
  return <h1>Bienvenido al sistema</h1>;
}

function Formularios() {
  return <h1>Página de Formularios</h1>;
}

function App() {
  const [email,setEmail] = useState(Cookies.get('user_email'));

  useEffect(()=>{
    setEmail(Cookies.get('user_email'));
  },[])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={email ? <Home /> : <Navigate to="/login" />}>
          {/* Rutas hijas dentro de Home */}
          <Route index element={<Dashboard />} />
          <Route path="formularios" element={<Formularios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
