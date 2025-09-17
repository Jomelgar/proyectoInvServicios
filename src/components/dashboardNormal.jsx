import {useState,useEffect} from "react";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import CardEspacio from "./SpaceCard";
import { useNavigate } from "react-router-dom";



const UserDashboard = ({ userCases }) => {
  const navigate = useNavigate();
  const [pendientes,setPendientes] = useState(0);
  const [aprobadas,setAprobadas] = useState(0);
  const [rechazadas,setRechazadas] = useState(0);

  const fetchStatistics = async()=>{
    const {count: pendientes} = await supabase.from('case').select("*", { count: "exact", head: true }).eq('phase', "En Proceso");
    setPendientes(pendientes || 0);
    const {count: rechazadas} = await supabase.from('case').select("*", { count: "exact", head: true }).eq('phase', "Rechazada");
    setRechazadas(rechazadas || 0);
    const {count: aprobadas} = await supabase.from('case').select("*", { count: "exact", head: true }).eq('phase', "Aceptada");
    setAprobadas(aprobadas || 0);
  };
  const cards = [
    {
      title: "Pendientes",
      value: pendientes,
      color: "bg-blue-400",
      icon: <ClockCircleOutlined className="text-3xl opacity-80" />,
    },
    {
      title: "Aprobadas",
      value: aprobadas,
      color: "bg-blue-700",
      icon: <CheckCircleOutlined className="text-3xl opacity-80" />,
    },
    {
      title: "Rechazadas",
      value: rechazadas,
      color: "bg-blue-500",
      icon: <CloseCircleOutlined className="text-3xl opacity-80" />,
    },
  ];

  const columns = [
    {
      title: "Evento",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado) => {
        let color;
        if (estado === "Pendiente") color = "blue";
        else if (estado === "Aprobada") color = "green";
        else if (estado === "Rechazada") color = "red";
        return <Tag color={color}>{estado}</Tag>;
      },
    },
  ];

  return (
    <div className="p-6 min-h-screen items-center flex-col">
      <h1 className="text-4xl font-bold mb-6 text-blue-900 border-b">Mis Solicitudes</h1>

      {/* Cards con conteo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.color} text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform flex items-center justify-between`}
          >
            <div>
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
            </div>
            <div>{card.icon}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center">
        {/* Contenedor del botón grande */}
        <div className="w-full max-w-2xl bg-white p-10 rounded-3xl shadow-2xl flex flex-col items-center mt-12">
          <p className=" font-[Poppins] text-center mb-6 text-gray-700 font-medium text-xl md:text-2xl">
            ¡Reserva tus espacios favoritos de manera rápida y sencilla!
          </p>
          <Button
            icon={<PlusCircleOutlined />}
            className="flex items-center font-[Poppins] justify-center font-bold px-12 py-6 text-white bg-blue-500 hover:bg-blue-600 rounded-2xl shadow-2xl text-3xl md:text-4xl transform transition-transform hover:scale-110"
            onClick={() => navigate("/lugares")}
          >
            Solicitar Espacios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
