import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Input, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { sendVerificationCode } from "../utils/email";
import supabaseClient from "../utils/supabase";

export default function LoginUI({ setUserEmail }) {
  const navigate = useNavigate();
  const [verification, setVerification] = useState(false);
  const [code, setCode] = useState(
    Math.random().toString(36).substring(2, 8).toUpperCase()
  );
  const [verificationCode, setVerificationCode] = useState("");

  const onFinish = async (values) => {
    if (!verification) {
      sendVerificationCode(values.email, code);
      setVerification(true);
    } else {
      if (code === verificationCode.toUpperCase()) {
          const {error} = await supabaseClient.from('users').insert([{email:values.email}]);
          if (error) {
            const {data}= await supabaseClient.from('users').select().eq('email', values.email).single();
            if(!data) {return;}
          }         
        Cookies.set("user_email", values.email, { path: "/", expires: 7 });
        setUserEmail(values.email);
        navigate("/");
      }
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-center bg-no-repeat bg-cover overflow-hidden"
      style={{ backgroundImage: "url('/fondoDARK.webp')" }}
    >
      {/* Modal de error */}
      <Modal
        open={false} // puedes controlar si mostrar error
        onCancel={() => {}}
        footer={[
          <Button key="close" type="primary" className="bg-blue-500 hover:bg-blue-400">
            Cerrar
          </Button>,
        ]}
        title={
          <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
            <ExclamationCircleOutlined /> Correo inválido
          </div>
        }
        centered
      >
        <p className="text-center text-gray-700">
          Por favor, ingrese un correo institucional válido.
        </p>
      </Modal>

      {/* Formulario */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-8 flex flex-col gap-3">
        <img alt="UNITEC" src="/logo.png" className="w-48 h-auto mx-auto" />
        <h1 className="text-blue-500 text-3xl font-extrabold text-center">
          Sistema de Inventario
        </h1>
        <p className="text-center text-gray-700 font-medium">
          Ingrese su correo institucional.
        </p>

        <Form
          name="loginForm"
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            label={<span className="text-5md font-bold">Correo electrónico</span>}
            name="email"
            rules={[
              { required: true, message: "Por favor ingrese su correo" },
              {
                pattern: /^[\w-.]+@unitec\.edu$/,
                message: "El correo debe terminar con @unitec.edu.hn",
              },
            ]}
          >
            <Input disabled={verification} placeholder="Ejemplo@unitec.edu.hn" />
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
              className="mt-5 bg-blue-700 hover:scale-105 active:bg-blue-500 hover:bg-blue-500"
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
