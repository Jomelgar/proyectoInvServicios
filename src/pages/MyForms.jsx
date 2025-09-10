import { useState, useEffect } from "react";
import { Table, Card, Button, Alert, Modal, Tag,Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined, EyeOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import supabase from "../utils/supabase";

const { Title, Text } = Typography;

function MyForms() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🔹 Traer datos
  const fetchData = async () => {
    try {
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("uuid", Cookies.get("user_email"))
        .single();
      if (userError || !user) {
        message.error("No se encontró el usuario");
        return;
      }

      const { data: cases, error } = await supabase
        .from("case")
        .select("id, title, description, phase, calendar(date)")
        .eq("id_user", user.id);
      if (error) {
        message.error("Error al obtener casos");
        return;
      }

      setData(cases || []);
    } catch (err) {
      console.error(err);
      message.error("Error al cargar los casos");
    }
  };

  useEffect(() => { fetchData(); }, []);

  // 🔹 Columnas tabla Desktop
  const columns = [ 
    {
      title: "Título",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Día",
      dataIndex: ["calendar"], // trae el array
      key: "date",
      render: (calendar) => 
        calendar?.[0]?.date ? new Date(calendar[0].date).toLocaleDateString() : "No asignado"
    },
    {
      title: "Estado",
      dataIndex: "phase",
      key: "phase",
    },
    {
      title: "Ver Caso",
      key: "ver",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          type="primary"
          onClick={() => {
            setSelectedCase(record);
            setIsModalOpen(true);
          }}
        >
          Ver Caso
        </Button>
      ),
    },
  ];

  // 🔹 Detectar mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div
        className={`w-full ${!isMobile ? "flex items-center justify-between border-b" : "flex flex-col justify-between items-center"} px-5 py-3`}
      >
        <h1 className="font-[Poppins] m-5 font-bold text-4xl md:text-4xl text-blue-900">
          Mis Casos
        </h1>
        <Button
          icon={<PlusCircleOutlined />}
          className="font-[Poppins] m-2 h-full bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 transition-transform rounded-xl shadow-md text-xl md:text-lg"
          onClick={() => navigate('/lugares')}
        >
          Solicitar
        </Button>
      </div>

      {/* Vista Mobile */}
      {isMobile ? (
        <div className="mt-5 p-4 space-y-4">
          {data.length === 0 ? (
            <Alert
              message="No tienes casos registrados"
              description="Cuando tengas formularios, aparecerán aquí."
              type="info"
              showIcon
              className="rounded-xl shadow-md"
            />
          ) : (
            data.map((item) => (
              <Card
                key={item.id}
                title={<span className="text-blue-700 font-semibold">{item.title}</span>}
                bordered={false}
                className="shadow-md border border-blue-200 rounded-xl"
                headStyle={{ backgroundColor: "#ebf5ff" }}
              >
                <p>
                  <b>Día:</b> {item.calendar?.[0]?.date ? new Date(item.calendar[0].date).toLocaleDateString() : "No asignado"}
                </p>
                <p><b>Descripción:</b> {item.description}</p>
                <p><b>Estado:</b> {item.phase}</p>
                {item.url && (
                  <p>
                    <b>URL:</b>{" "}
                    <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                      {item.url}
                    </a>
                  </p>
                )}
                <Button
                  type="primary"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    setSelectedCase(item);
                    setIsModalOpen(true);
                  }}
                  className="mt-2"
                >
                  Ver Caso
                </Button>
              </Card>
            ))
          )}
        </div>
      ) : (
        // Vista Desktop
        <Table
          className="!font-[Poppins] mt-9 shadow-lg border border-blue-200 rounded-xl"
          dataSource={data}
          columns={columns}
          pagination={{ position: ["bottomCenter"], pageSize: 5 }}
          locale={{ emptyText: "No hay casos disponibles" }}
          rowKey="id"
        />
      )}

      {/* Modal de caso */}
      <Modal
        open={isModalOpen}
        title={null}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        className="font-[Poppins] rounded-2xl"
      >
        {selectedCase && (
          <div className="space-y-4">
            {/* Título */}
            <div className="border-b pb-2">
              <Title level={3} className="!m-0 text-blue-800">
                {selectedCase.title}
              </Title>
            </div>

            {/* Información principal */}
            <div className="space-y-3">
              <p>
                <Text strong>Estado: </Text>
                <Tag
                  color={
                    selectedCase.phase === "Activo"
                      ? "green"
                      : selectedCase.phase === "Pendiente"
                      ? "gold"
                      : "default"
                  }
                  className="font-semibold text-sm"
                >
                  {selectedCase.phase}
                </Tag>
              </p>
              <p>
                <Text strong>Fecha: </Text>
                {selectedCase.calendar?.[0]?.date
                  ? new Date(selectedCase.calendar[0].date).toLocaleDateString()
                  : "No asignada"}
              </p>
              <p>
                <Text strong>Descripción: </Text>
                {selectedCase.description || "Sin descripción"}
              </p>
            </div>

            {/* Footer con acción */}
            <div className="flex justify-end pt-4 border-t">
              <Button onClick={() => setIsModalOpen(false)}>Cerrar</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default MyForms;
