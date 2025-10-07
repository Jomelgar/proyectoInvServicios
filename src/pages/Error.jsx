import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { FrownOutlined } from "@ant-design/icons";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center overflow-hidden bg-blue-400">
      {/* Fondo animado con líneas diagonales */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-400 to-blue-600 animate-gradientShift"></div>
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-1/2 bg-gradient-to-r from-blue-100/50 via-transparent to-blue-100/50 opacity-30"
              style={{
                top: `${i * 10}%`,
                transform: `rotate(-25deg) translateX(-100%)`,
                animation: `moveLines ${20 + i * 5}s linear infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes moveLines {
          0% { transform: rotate(-25deg) translateX(-100%); }
          50% { transform: rotate(-25deg) translateX(100%); }
          100% { transform: rotate(-25deg) translateX(-100%); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradientShift {
          background-size: 200% 200%;
          animation: gradientShift 15s ease infinite;
        }
      `}</style>

      {/* Contenido principal */}
      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl p-8 flex flex-col items-center text-center z-10">
        <FrownOutlined className="text-blue-600 text-6xl mb-4 animate-bounce" />
        <h1 className="text-4xl font-extrabold text-blue-600 font-[Poppins]">
          ¡Ups! Algo salió mal
        </h1>
        <p className="text-gray-700 mt-2 font-[Poppins]">
          No pudimos procesar tu solicitud. Por favor intenta registrarte nuevamente.
        </p>

        <Button
          type="primary"
          size="large"
          className="mt-6 bg-blue-700 font-[Poppins] font-bold hover:scale-105 active:bg-blue-500 hover:bg-blue-500"
          onClick={() => navigate("/login")}
        >
          Volver al inicio de sesión
        </Button>
      </div>
    </div>
  );
}
