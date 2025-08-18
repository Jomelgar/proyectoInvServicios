import React from "react";
import { Table } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarsOutlined,
} from "@ant-design/icons";

const Dashboard = ({ data }) => {
  const cards = [
    {
      title: "Solicitudes Pendientes",
      value: data?.pendientes,
      color: "bg-blue-400",
      icon: <ClockCircleOutlined className="text-3xl opacity-80" />,
    },
    {
      title: "Solicitudes Aprobadas",
      value: data?.aprobadas,
      color: "bg-blue-700",
      icon: <CheckCircleOutlined className="text-3xl opacity-80" />,
    },
    {
      title: "Solicitudes Rechazadas",
      value: data?.rechazadas,
      color: "bg-blue-500",
      icon: <CloseCircleOutlined className="text-3xl opacity-80" />,
    },
    {
      title: "Total de Solicitudes",
      value: data?.total,
      color: "bg-blue-900",
      icon: <BarsOutlined className="text-3xl opacity-80" />,
    },
  ];

  const eventos = [
    { key: 1, nombre: "Reunión de coordinación", fecha: "2025-08-20" },
    { key: 2, nombre: "Entrega de Becas", fecha: "2025-08-25" },
    { key: 3, nombre: "Mecatón", fecha: "2025-09-05" },
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
      responsive: ["xs", "sm", "md", "lg"],
    },
  ];

  return (
    <div className="p-6 min-h-screen ">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">
        Panel de Solicitudes
      </h1>

      {/* Cards con iconos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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

      {/* Tabla con Ant Design */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Eventos por venir</h2>
        <Table
          columns={columns}
          dataSource={eventos}
          pagination={false}
          scroll={{ x: true }} // Scroll horizontal en móvil
        />
      </div>
    </div>
  );
};

export default Dashboard;
