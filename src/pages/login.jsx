import { useNavigate } from 'react-router-dom';
import{useState} from 'react';
import { Modal, Button, Input, Form } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { sendVerificationCode } from '../utils/email';
import Cookies from 'js-cookie';

function LoginUI() {
  const showModal = false;
  const navigate = useNavigate();
  const [verification,setVerification] = useState(false);
  const [code,setCode] = useState(Math.random().toString(36).substring(2, 8).toUpperCase());

  const onFinish = async(values) => {
    if(verification === false)
    {
      sendVerificationCode(values.email, code);
      setVerification(true);
    }else
    {
      if(code === values.code)
      {
        Cookies.set('user_email',values.email, {expires: 7});
        navigate('/');
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
        open={showModal}
        onCancel={() => {}}
        footer={[
          <Button
            key="close"
            type="primary"
            className="bg-blue-500 hover:bg-blue-400"
          >
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
        <img alt='UNITEC' src="/logo.png" className="w-48 h-auto mx-auto"/>
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
            label={
                <span className="text-5md font-bold">
                Correo electrónico
                </span>
            }
            name="email"
            rules={[
              { required: true, message: "Por favor ingrese su correo" },
              {
                pattern: /^[\w-.]+@unitec\.edu$/,
                message: "El correo debe terminar con @unitec.edu.hn",
              },
            ]}
          >
            <Input disabled={verification}placeholder="Ejemplo@unitec.edu.hn" />
          </Form.Item>

            {verification && (
                <Form.Item
                    label={
                        <span className="text-5md font-bold">
                        Código de verificación
                        </span>
                    }
                    name="code"
                    rules={[
                    { required: true, message: "Por favor ingrese su correo" },
                    
                    ]}
                >
                    <input
                            type="text"
                            maxLength={6}
                            value={verification}
                            placeholder="Código de verificación"
                            className="border border-gray-300 bg-white rounded-md p-2 mb-2  w-full text-center tracking-widest text-sm"
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
              {!verification? 'Verificar':'Ingresar'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default LoginUI;
