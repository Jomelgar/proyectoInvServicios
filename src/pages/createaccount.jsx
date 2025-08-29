import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form, notification, Select } from "antd"; // 👈 importamos notification
import supabaseClient from "../utils/supabase";
import bcrypt from "../utils/bcrypt";
import Cookies from "js-cookie";

export default function RegisterUI({userEmail}) {
  const navigate = useNavigate();
  const [basements,setBasements] = useState([]);
  const [loading, setLoading] = useState(false);

  // 👇 Hook de notificación
  const [api, contextHolder] = notification.useNotification();
    const fetchBasement = async () => {
    const { data, error } = await supabaseClient.from("basement").select('*');
    if (!error) setBasements(data);
  };

  useEffect(()=>{
    const fetchData = async()=>{
      await fetchBasement();
    }
    fetchData();
  },[]);

  const onFinish = async (values) => {
    setLoading(true);
    const hashPassword = bcrypt.hashPassword(values.password);

    const {error} = await supabaseClient.from('users').insert([{
        first_name: values.firstName,
        second_name: values.secondName,
        email: values.email,
        last_name: values.lastName1,
        last_second_name: values.lastName2,
        password: hashPassword,
        id_basement: values.basement,
    }]);

    if(!error){
      Cookies.remove("register_email");
      navigate("/");
    } else {
      api.error({
        message: "Error al crear la cuenta",
        description: "No se pudo crear su cuenta, intente de nuevo o registre otro correo.",
        placement: "top",
        duration: 5, // 👈 se cierra solo en 5s (puedes poner null si quieres que sea manual)
      });
    }

    setLoading(false);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center overflow-hidden bg-blue-400">
      {/* 👇 Muy importante: sin esto no sale nada */}

      {/* Fondo animado */}
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

      {contextHolder}
      {/* Formulario */}
      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-xl p-8 flex flex-col gap-3 z-10">
        <img alt="UNITEC" src="/logo.png" className="w-48 h-auto mx-auto" />
        <h1 className="text-blue-500 font-[Poppins] text-3xl font-extrabold text-center">
          CREAR CUENTA
        </h1>
        <p className="text-center font-[Poppins] text-gray-700 font-medium">
          Complete sus datos para registrarse
        </p>

        <Form name="registerForm" layout="vertical" onFinish={onFinish} requiredMark={false} initialValues={{email: userEmail}}>
            <Form.Item
                label={<span className="text-5md font-bold font-[Poppins]">Correo electrónico</span>}
                name="email"
            >
                <Input value={userEmail} disabled className="font-[Poppins] !text-black bg-gray-100" />
            </Form.Item>
            <Form.Item
              label={<span className="text-5md font-bold font-[Poppins]">Sede</span>}
              name="basement"
              rules={[{ required: true, message: "Por favor ingresa un lugar" },]}
            >
              <Select
                placeholder="Sede"
                className="rounded-xl text-xl font-[Poppins]"
              >
                {basements.map((p)=>(
                  <Select.Option key={p.id} value={p.id}>
                      {p.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={<span className="text-5md font-bold font-[Poppins]">Primer nombre</span>}
              name="firstName"
              rules={[{ required: true, message: "Ingrese su primer nombre" }]}
            >
              <Input className="font-[Poppins]" placeholder="Ej. Juan" />
            </Form.Item>

            <Form.Item
              label={<span className="text-5md font-bold font-[Poppins]">Segundo nombre</span>}
              name="secondName"
            >
              <Input className="font-[Poppins]" placeholder="Ej. Carlos" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={<span className="text-5md font-bold font-[Poppins]">Primer apellido</span>}
              name="lastName1"
              rules={[{ required: true, message: "Ingrese su primer apellido" }]}
            >
              <Input className="font-[Poppins]" placeholder="Ej. Pérez" />
            </Form.Item>

            <Form.Item
              label={<span className="text-5md font-bold font-[Poppins]">Segundo apellido</span>}
              name="lastName2"
            >
              <Input className="font-[Poppins]" placeholder="Ej. Gómez" />
            </Form.Item>
          </div>

          <Form.Item
            label={<span className="text-5md font-bold font-[Poppins]">Contraseña</span>}
            name="password"
            rules={[
                { required: true, message: "Por favor ingresa tu contraseña" },
                { min: 6, message: "La contraseña debe tener al menos 6 caracteres" }
            ]}
            hasFeedback
          >
            <Input.Password className="font-[Poppins]" placeholder="Ingresa tu contraseña" />
            </Form.Item>

            <Form.Item
            label={<span className="text-5md font-bold font-[Poppins]">Confirmar contraseña</span>}
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
                { required: true, message: "Por favor confirma tu contraseña" },
                ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                    }
                    return Promise.reject(new Error("Las contraseñas no coinciden"));
                },
                }),
            ]}
            >
            <Input.Password className="font-[Poppins]" placeholder="Confirma tu contraseña" />
            </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="mt-5 bg-blue-700 font-[Poppins] font-bold hover:scale-105 active:bg-blue-500 hover:bg-blue-500"
              block
            >
              Crear cuenta
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
