import { useState, useEffect } from "react";
import { Row, Col, Card, Form, Input, Select, Button, Spin, Modal, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  EditOutlined,
  LockOutlined,
} from "@ant-design/icons";
import SupabaseClient from "../utils/supabase";
import Cookies from "js-cookie";

const { Option } = Select;

const BlueLabel = ({ children }) => (
  <span className="font-[Poppins] text-blue-700 font-bold">{children}</span>
);

function Profile() {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [roles, setRoles] = useState([]);
  const [basements, setBasements] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Estado para modal de cambio de contraseña
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm] = Form.useForm();

  const fetchUser = async () => {
    const { data, error } = await SupabaseClient.from("users")
      .select('*')
      .eq("uuid", Cookies.get("user_email"))
      .single();
    console.log(error);
    if (error) return null;
    return data;
  };

  const fetchRole = async () => {
    const { data, error } = await SupabaseClient.rpc("get_roles");
    if (!error) setRoles(data);
  };

  const fetchBasement = async () => {
    const { data, error } = await SupabaseClient.from("basement").select();
    if (!error) setBasements(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchRole(), fetchBasement()]);
      const u = await fetchUser();
      if (u) {
        form.setFieldsValue({
          firstName: u.first_name,
          secondName: u.second_name,
          lastName1: u.last_name,
          lastName2: u.last_second_name,
          email: u.email,
          role: u.role,
          basement: u.id_basement,
        });
        setUser(u);
      }
      setLoading(false);
    };
    fetchData();
  }, [form]);

  const handleSave = async (values) => {
    setLoading(true);
    const {data,error} = await SupabaseClient.from("users")
      .update({
        first_name: values.firstName,
        second_name: values.secondName,
        last_name: values.lastName1,
        last_second_name: values.lastName2,
        email: values.email,
        role: values.role,
        id_basement: values.basement,
      })
      .eq("email", values.email).select().single();
    if (!error) {
     window.location.reload();
    }
    setIsEditing(false);
    setLoading(false);
  };

  // 🔑 Manejar cambio de contraseña
  const handlePasswordChange = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Las contraseñas no coinciden");
      return;
    }
    const { error } = await SupabaseClient.auth.updateUser({
      password: values.newPassword,
    });
    if (error) {
      message.error("Error al cambiar contraseña");
    } else {
      message.success("Contraseña cambiada con éxito");
      setPasswordModalOpen(false);
      passwordForm.resetFields();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Cargando datos..." />
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen flex flex-col items-center">
      <h1 className="text-4xl font-[Poppins] font-bold mb-6 text-center text-blue-900 border-b w-full">
        Mi Perfil
      </h1>
      <Card bordered={false} className="w-full rounded-2xl p-6">
        <Form form={form} layout="vertical" onFinish={handleSave}>
          {/* Email */}
          <Form.Item
            label={<BlueLabel>Correo Electrónico</BlueLabel>}
            name="email"
            rules={[{ required: true, message: "Correo requerido" }]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="ejemplo@email.com"
              disabled
              className="!text-gray-500 font-[Poppins] rounded-xl"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              {/* Rol */}
              <Form.Item
                label={<BlueLabel>Rol</BlueLabel>}
                name="role"
                rules={[{ required: true, message: "Rol requerido" }]}
              >
                <Select
                  disabled={user.role !== "CREADOR" || !isEditing}
                  className="!text-black font-[Poppins] rounded-xl text-xl"
                  placeholder="Rol"
                  style={{ width: "100%" }}
                >
                  {roles.map((role) => (
                    <Option key={role} value={role}>
                      {role}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<BlueLabel>Sede</BlueLabel>}
                name="basement"
                rules={[{ required: true, message: "Sede requerida" }]}
              >
                <Select
                  disabled={user.role !== "CREADOR" || !isEditing}
                  placeholder="Lugar"
                  className="!text-black font-[Poppins] rounded-xl text-xl"
                >
                  {basements.map((basement) => (
                    <Option key={basement.id} value={basement.id}>
                      {basement.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Nombres y apellidos */}
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<BlueLabel>Primer Nombre</BlueLabel>}
                name="firstName"
                rules={[{ required: true, message: "Primer nombre requerido" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-blue-900" />}
                  placeholder="Ej. Juan"
                  disabled={!isEditing}
                  className="font-[Poppins] rounded-xl"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<BlueLabel>Segundo Nombre</BlueLabel>}
                name="secondName"
                rules={[{ required: true, message: "Segundo nombre requerido" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-blue-900" />}
                  placeholder="Ej. Carlos"
                  disabled={!isEditing}
                  className="font-[Poppins] rounded-xl"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                label={<BlueLabel>Primer Apellido</BlueLabel>}
                name="lastName1"
                rules={[{ required: true, message: "Primer apellido requerido" }]}
              >
                <Input
                  prefix={<IdcardOutlined className="text-blue-900" />}
                  placeholder="Ej. Pérez"
                  disabled={!isEditing}
                  className="font-[Poppins] rounded-xl"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<BlueLabel>Segundo Apellido</BlueLabel>}
                name="lastName2"
                rules={[{ required: true, message: "Segundo apellido requerido" }]}
              >
                <Input
                  prefix={<IdcardOutlined className="text-blue-900" />}
                  placeholder="Ej. López"
                  disabled={!isEditing}
                  className="font-[Poppins] rounded-xl"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Botones */}
          <Form.Item className="mt-6">
            {isEditing ? (
              <Col className="flex justify-end gap-4 mt-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="font-[Poppins] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 px-6 py-2"
                >
                  Guardar
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  className="font-[Poppins] bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl shadow-sm transition-all duration-200 px-6 py-2"
                >
                  Cancelar
                </Button>
              </Col>
            ) : (
              <div className="flex flex-col items-center w-full gap-3">
                <Button
                  type="primary"
                  onClick={() => setIsEditing(true)}
                  className="font-[Poppins] w-[80%] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 px-6 py-2"
                >
                  <EditOutlined /> Editar
                </Button>
                <Button
                  danger
                  onClick={() => setPasswordModalOpen(true)}
                  className="font-[Poppins] w-[80%] bg-red-500 hover:bg-red-600 text-red-500 font-semibold rounded-xl shadow-md transition-all duration-200 px-6 py-2"
                >
                  <LockOutlined /> Cambiar Contraseña
                </Button>
              </div>
            )}
          </Form.Item>
        </Form>
      </Card>

      {/* 🔑 Modal cambio de contraseña */}
      <Modal
        title="Cambiar Contraseña"
        open={isPasswordModalOpen}
        onCancel={() => setPasswordModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={passwordForm} onFinish={handlePasswordChange}>
          <Form.Item
            label={<BlueLabel>Nueva Contraseña</BlueLabel>}
            name="newPassword"
            rules={[{ required: true, message: "Ingrese nueva contraseña" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nueva contraseña" />
          </Form.Item>
          <Form.Item
            label={<BlueLabel>Confirmar Contraseña</BlueLabel>}
            name="confirmPassword"
            rules={[{ required: true, message: "Confirme su contraseña" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Confirmar contraseña" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Guardar Contraseña
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default Profile;
