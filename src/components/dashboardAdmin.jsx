import React, { useEffect, useState } from "react";
import { Table } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import supabase from "../utils/supabase";

const Dashboard = ({ data }) => {
  const [pendientes,setPendientes] = useState(0);
  const [aprobadas,setAprobadas] = useState(0);
  const [rechazadas,setRechazadas] = useState(0);
  const [total,setTotal] = useState(0);
  const [events,setEvents] = useState([]);

  const fetchStatistics = async()=>{
    const {count: pendientes} = await supabase.from('case').select("*", { count: "exact", head: true }).eq('phase', "En Proceso");
    setPendientes(pendientes || 0);
    const {count: rechazadas} = await supabase.from('case').select("*", { count: "exact", head: true }).eq('phase', "Rechazada");
    setRechazadas(rechazadas || 0);
    const {count: aprobadas} = await supabase.from('case').select("*", { count: "exact", head: true }).eq('phase', "Aceptada");
    setAprobadas(aprobadas || 0);
    const {count: total} = await supabase.from('case').select("*", { count: "exact", head: true });
    setTotal(total || 0);
  };

  const fetchCases= async()=>{
    const { data, error } = await supabase
    .from("case")
    .select(`
      title,
      calendar (
        date
      )
    `)
    .order("date", { foreignTable: "calendar", ascending: false }) // 👈 clave
    .limit(3);
    setEvents(data);
  }

  useEffect(()=>{
    fetchStatistics();
    fetchCases();
  }
  ,[]);

  const cards = [
    {
      title: "Solicitudes Pendientes",
      value: data?.pendientes,
      color: "bg-blue-400",
      icon: <ClockCircleOutlined className="text-3xl opacity-80" />,
      value: <p className="text-center">{pendientes}</p>,
    },
    {
      title: "Solicitudes Aprobadas",
      value: data?.aprobadas,
      color: "bg-blue-700",
      icon: <CheckCircleOutlined className="text-3xl opacity-80" />,
      value: <p className="text-center">{aprobadas}</p>,
    },
    {
      title: "Solicitudes Rechazadas",
      value: data?.rechazadas,
      color: "bg-blue-500",
      icon: <CloseCircleOutlined className="text-3xl opacity-80" />,
      value: <p className="text-center">{rechazadas}</p>,
    },
    {
      title: "Total de Solicitudes",
      value: data?.total,
      color: "bg-blue-900",
      icon: <BarsOutlined className="text-3xl opacity-80" />,
      value: <p className="text-center">{total}</p>,
    },
  ];
  const columns = [
    {
      title: "Evento",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Fecha",
      key: "date",
      render: (_,record) => record.calendar[0].date,
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
          dataSource={events}
          pagination={false}
          scroll={{ x: true }} // Scroll horizontal en móvil
        />
      </div>
    </div>
  );
};

export default Dashboard;
