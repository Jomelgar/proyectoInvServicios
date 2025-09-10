// src/components/CardEspacio.jsx
import React from "react";
import { Tag,Row,Col,Button } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const CardEspacio = ({ espacios,setId, setOpen}) => {
  if (!espacios || espacios.length === 0) {
    return <p className="text-gray-500">No hay espacios disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {espacios.map((espacio, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center hover:shadow-lg hover:scale-105 transition-transform"
        >
          {/* Imagen / Ícono */}
          <div className="w-20 h-20 bg-blue-100 flex items-center justify-center rounded-full mb-4">
            {espacio.imagen ? (
              <img
                src={espacio.image}
                alt={espacio.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <EnvironmentOutlined className="text-blue-500 text-4xl" />
            )}
          </div>

          {/* Nombre */}
          <p className="text-blue-600 font-medium text-xl">{espacio.name}</p>
          {/* Área (subtítulo) */}
          <p className="text-gray-500 text-sm">{espacio.building.name}</p>
          {/* Categoría */}
            <div className="w-full flex flex-col items-center mt-5 gap-3">
            <Row gutter={[8, 8]} justify="center">
                {espacio.categoria.map((c) => (
                    <Tag className="text-center text-xs font-bold text-blue-800 bg-blue-100 border-blue-500">
                    {c}
                    </Tag>
                ))}
            </Row>

            <Button
                type="primary"
                className="mt-3 bg-blue-600 hover:bg-blue-700 border-none"
                block
                onClick={()=> {setId(espacio.id); setOpen(true);}}
            >
                Solicitar
            </Button>
            </div>
        </div>
      ))}
    </div>
  );
};

export default CardEspacio;
