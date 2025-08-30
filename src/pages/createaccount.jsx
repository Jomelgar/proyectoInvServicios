import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Form, notification, Select, Row, Col } from "antd"; 
import supabaseClient from "../utils/supabase";
import Cookies from "js-cookie";

export default function RegisterUI({userEmail,setUserEmail}) {
  const navigate = useNavigate();
  const [basements,setBasements] = useState([]);
  const [loading, setLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const fetchBasement = async () => {
    const { data, error } = await supabaseClient.from("basement").select('*').eq('state',true);
    if (!error) setBasements(data);
  };

  useEffect(()=>{
    fetchBasement();
  },[]);

  const onFinish = async (values) => {
    setLoading(true);

    const { data, error: signUpError } = await supabaseClient.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (signUpError) {
      api.error({
        message: "Error al registrar",
        description: signUpError.message,
        placement: "top",
        duration: 5,
      });
      setLoading(false);
      return;
    }

    const userUuid = data.user?.id;

    if (userUuid) {
      const { data, error } = await supabaseClient.from("users").insert([
        {
          uuid: userUuid,
          first_name: values.firstName,
          second_name: values.secondName,
          email: values.email,
          last_name: values.lastName1,
          last_second_name: values.lastName2,
          id_basement: values.basement,
        },
      ]).select().single();

      const {error: errorRel} = await supabaseClient.from("user_roles").insert([{
        id_user: data.id,
        uuid: userUuid,
        role: "USUARIO",
      }])

      if (!error && !errorRel) {
        Cookies.remove("register_email");
        setUserEmail(userUuid);
        Cookies.set("user_email",userUuid);
        navigate("/");
      } else {
        api.error({
          message: "Error al crear la cuenta",
          description: "No se pudo crear su cuenta, intente de nuevo o registre otro correo.",
          placement: "top",
          duration: 5,
        });
        
      }
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen w-screen flex items-center justify-center overflow-y-auto bg-blue-400">
      {contextHolder}

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

      {/* Card formulario con scroll */}
      <div className="relative bg-white w-full max-w-3xl rounded-xl shadow-xl p-8 flex flex-col gap-3 z-10 my-8">
        <img alt="UNITEC" src="/logo.png" className="w-48 h-auto mx-auto" />
        <h1 className="text-blue-500 font-[Poppins] text-3xl font-extrabold text-center">
          CREAR CUENTA
        </h1>
        <p className="text-center font-[Poppins] text-gray-700 font-medium">
          Complete sus datos para registrarse
        </p>

        <Form 
          name="registerForm" 
          layout="vertical" 
          onFinish={onFinish} 
          requiredMark={false} 
          initialValues={{email: userEmail}}
        >
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Correo electrónico" name="email">
                <Input value={userEmail} disabled className="bg-gray-100 !text-black font-[Poppins]" />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item 
                label="Sede" 
                name="basement" 
                rules={[{ required: true, message: "Por favor selecciona una sede" }]}
              >
                <Select placeholder="Sede" className="font-[Poppins]">
                  {basements.map((p)=>(
                    <Select.Option key={p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Primer nombre" name="firstName" rules={[{ required: true, message: "Ingrese su primer nombre" }]}>
                <Input placeholder="Ej. Juan" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Segundo nombre" name="secondName">
                <Input placeholder="Ej. Carlos" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Primer apellido" name="lastName1" rules={[{ required: true, message: "Ingrese su primer apellido" }]}>
                <Input placeholder="Ej. Pérez" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Segundo apellido" name="lastName2">
                <Input placeholder="Ej. Gómez" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                label="Contraseña" 
                name="password"
                rules={[
                  { required: true, message: "Por favor ingresa tu contraseña" },
                  { min: 6, message: "Debe tener al menos 6 caracteres" }
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Ingresa tu contraseña" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item 
                label="Confirmar contraseña" 
                name="confirmPassword" 
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Confirma tu contraseña" },
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
                <Input.Password placeholder="Confirma tu contraseña" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              className="mt-4 bg-blue-700 font-[Poppins] font-bold hover:scale-105 active:bg-blue-500 hover:bg-blue-500" 
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
