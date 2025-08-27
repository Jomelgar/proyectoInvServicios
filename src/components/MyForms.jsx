import { useState, useEffect } from "react";
import { Table, Card } from "antd";

function MyForms() {
  const [isMobile, setIsMobile] = useState(false);

  const dataSource = [
    {
      key: "1",
      fecha: "2025-08-20",
      nombre: "Caso Juan Pérez",
      descripcion: "Revisión de documentos",
      url: "url ofnbfonfnob",
    },
    {
      key: "2",
      fecha: "2025-08-22",
      nombre: "Caso María López",
      descripcion: "Solicitud de soporte técnico",
      url: "url ofnbfonfnob",
    },
  ];

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
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "URL del Caso",
      dataIndex: "url",
      key: "url"
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // breakpoint tipo "phone"
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <h1 className="m-5 font-bold text-xl md:text-4xl text-blue-800">
        Mis Formularios
      </h1>
      {isMobile ? (
        <div className="mt-5 p-4 space-y-4">
          {dataSource.map((item) => (
            <Card key={item.key} title={item.nombre} bordered>
              <p>
                <b>Fecha:</b> {item.fecha}
              </p>
              <p>
                <b>Descripción:</b> {item.descripcion}
              </p>
              <p className="text-blue-500 underline">
                <b className='text-black'>URL:</b> {item.url}
              </p>
            </Card>
          ))}
        </div>
      ) : (
        <Table className="mt-9" dataSource={dataSource} columns={columns} pagination={{position:["bottomCenter"],pageSize: 5}}/>
      )}
    </>
  );
}

export default MyForms;
