import React from "react";
import { Table, Tag } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import CardEspacio from "./SpaceCard";

//TODO: solo seria de limite 3
const espaciosEjemplo = [
  { categoria: ["Deportes","Cumpleaños"], nombre: "Cancha de Fútbol", imagen: "", area: "Zona Norte" },
  { categoria: ["Cultura"], nombre: "Biblioteca Central", imagen: "", area: "Zona Centro" },
  { categoria: ["Recreación"], nombre: "Parque Infantil", imagen: "", area: "Zona Sur" },
];



const UserDashboard = ({ userCases }) => {
  // Calculamos conteo de cada estado
  const pendientes = userCases?.filter(c => c.estado === "Pendiente").length;
  const aprobadas = userCases?.filter(c => c.estado === "Aprobada").length;
  const rechazadas = userCases?.filter(c => c.estado === "Rechazada").length;

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
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-blue-900">Mis Solicitudes</h1>

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
      <div className="mt-5">
        <h1 className="text-3xl text-center font-bold mb-6 text-blue-900">Espacios más Reservados</h1>
        <CardEspacio espacios={espaciosEjemplo} />
      </div>
    </div>
  );
};

export default UserDashboard;
