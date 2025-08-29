import { useState, useEffect } from "react";
import { Table, Card, Button, Alert } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import supabaseClient from "../utils/supabase";

function MyForms() {
  const [isMobile, setIsMobile] = useState(false);
  const [data, setData] = useState([]);

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
      title: "URL del Caso",
      dataIndex: "url",
      key: "url",
      render: (text) => (
        <a
          href={text}
          className="text-blue-600 hover:text-blue-800 underline"
          target="_blank"
          rel="noreferrer"
        >
          {text}
        </a>
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
        <h1 className="font-[Poppins] m-5 font-bold text-2xl md:text-4xl text-blue-900">
          Mis Formularios
        </h1>
        <Button
          icon={<PlusCircleOutlined />}
          className="font-[Poppins] m-2 h-full bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 transition-transform rounded-xl shadow-md text-sm md:text-lg"
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
                  <span className="text-blue-700 font-semibold">
                    {item.nombre}
                  </span>
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
                <p>
                  <b>URL: </b>
                  <a
                    href={item.url}
                    className="text-blue-600 hover:text-blue-800 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.url}
                  </a>
                </p>
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
    </>
  );
}

export default MyForms;
