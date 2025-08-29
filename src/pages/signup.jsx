import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Input, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { sendVerificationCode } from "../utils/email";
import supabaseClient from "../utils/supabase";

export default function LoginUI({ setUserEmail }) {
  const navigate = useNavigate();
  const [verification, setVerification] = useState(false);
  const [code] = useState(Math.random().toString(36).substring(2, 8).toUpperCase());
  const [verificationCode, setVerificationCode] = useState("");

  const onFinish = async (values) => {
    if (!verification) {
      sendVerificationCode(values.email, code);
      setVerification(true);
    } else {
      if (code === verificationCode.toUpperCase()) {
        Cookies.set("register_email", values.email, { path: "/", expires: 1 });
        setUserEmail(values.email);
        navigate("/create-account");
      }
    }
  };

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

      {/* Formulario */}
      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl p-8 flex flex-col gap-3 z-10">
        <img alt="UNITEC" src="/logo.png" className="w-48 h-auto mx-auto" />
        <h1 className="text-blue-500 font-[Poppins] text-3xl font-extrabold text-center">
          REGISTRARSE
        </h1>
        <p className="text-center font-[Poppins] font-extrabold text-gray-700 font-medium">
          INGRESE SU CORREO ASOCIADO
        </p>

        <Form name="loginForm" layout="vertical" onFinish={onFinish} requiredMark={false}>
          <Form.Item
            label={<span className="text-5md font-bold font-[Poppins]">Correo electrónico</span>}
            name="email"
            rules={[
              { required: true, message: "Por favor ingrese su correo" },
              { pattern: /^[\w-.]+@unitec\.edu$/, message: "El correo debe terminar con @unitec.edu.hn" },
            ]}
          >
            <Input className="font-[Poppins]" disabled={verification} placeholder="Ejemplo@unitec.edu.hn" />
          </Form.Item>

          {verification && (
            <Form.Item
              label={<span className="text-5md font-bold">Código de verificación</span>}
              name="code"
              rules={[{ required: true, message: "Por favor ingrese el código" }]}
            >
              <Input
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                maxLength={6}
                placeholder="CODIGO"
                style={{
                  textTransform: "uppercase",
                  textAlign: "center",
                  letterSpacing: "0.3em",
                }}
                className="border border-gray-300 bg-white rounded-md p-2 mb-2 w-full text-sm"
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="mt-5 bg-blue-700 font-[Poppins] font-bold hover:scale-105 active:bg-blue-500 hover:bg-blue-500"
              block
            >
              {!verification ? "Verificar" : "Ingresar"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
