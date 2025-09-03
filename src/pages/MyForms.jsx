import { useState, useEffect } from "react";
import { Table, Card, Button, Alert, Modal, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { PlusCircleOutlined, EyeOutlined } from "@ant-design/icons";
import supabaseClient from "../utils/supabase";

const { Title, Text } = Typography;

function MyForms() {
  const navigate= useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    // Ejemplo para traer datos de Supabase
    // const { data, error } = await supabaseClient.from("formularios").select("*");
    // if (!error) setData(data);
  };

  const columns = [
    {
      title: "Fecha",
      dataIndex: "fecha",
      key: "fecha",
    },
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Encabezado */}
      <div
        className={`w-full ${
          !isMobile
            ? "flex items-center justify-between border-b"
            : "flex flex-col justify-between items-center"
        } px-5 py-3`}
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
                key={item.key}
                title={
                  <span className="text-blue-700 font-semibold">{item.nombre}</span>
                }
                bordered={false}
                className="shadow-md border border-blue-200 rounded-xl"
                headStyle={{ backgroundColor: "#ebf5ff" }}
              >
                <p>
                  <b>Fecha:</b> {item.fecha}
                </p>
                <p>
                  <b>Descripción:</b> {item.description}
                </p>
                <p>
                  <b>Estado:</b> {item.phase}
                </p>
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
        /* Vista Desktop */
        <Table
          className="!font-[Poppins] mt-9 shadow-lg border border-blue-200 rounded-xl"
          dataSource={data}
          columns={columns}
          pagination={{ position: ["bottomCenter"], pageSize: 5 }}
          locale={{ emptyText: "No hay casos disponibles" }}
        />
      )}

      {/* Modal de caso */}
      <Modal
        open={isModalOpen}
        title={selectedCase?.nombre}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="font-[Poppins]"
      >
        {selectedCase && (
          <div className="space-y-2">
            <p>
              <b>Fecha:</b> {selectedCase.fecha}
            </p>
            <p>
              <b>Descripción:</b> {selectedCase.description}
            </p>
            <p>
              <b>Estado:</b> {selectedCase.phase}
            </p>
            <p>
              <b>URL:</b>{" "}
              <a
                href={selectedCase.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {selectedCase.url}
              </a>
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}

export default MyForms;
