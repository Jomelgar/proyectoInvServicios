import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, message, Row, Col, Card, Spin } from "antd";
import { UserOutlined, MailOutlined, IdcardOutlined, LockOutlined } from "@ant-design/icons";
import SupabaseClient from "../utils/supabase";

const { Option } = Select;

const BlueLabel = ({ children }) => (
  <span className="font-[Poppins] text-blue-700 font-bold">{children}</span>
);

export default function EditUserModal({ open, onClose, userId, onUpdated }) {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [basements, setBasements] = useState([]);
  const [isPasswordMode, setPasswordMode] = useState(false);

  useEffect(() => {
    if (!open || !userId) return;

    const fetchData = async () => {
      setLoading(true);
      // Traer datos del usuario
      const { data: user, error: userError } = await SupabaseClient
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (userError) {
        message.error("Error al cargar usuario");
        setLoading(false);
        return;
      }

      form.setFieldsValue({
        firstName: user.first_name,
        secondName: user.second_name,
        lastName1: user.last_name,
        lastName2: user.last_second_name,
        email: user.email,
        role: user.role,
        basement: user.id_basement,
      });

      // Traer roles
      const { data: rolesData } = await SupabaseClient.rpc("get_roles");
      if (rolesData) setRoles(rolesData);

      // Traer sedes
      const { data: basementData } = await SupabaseClient.from("basement").select("*").eq('state', true);
      if (basementData) setBasements(basementData);

      setLoading(false);
    };

    fetchData();
  }, [open, userId, form]);

  const handleSave = async (values) => {
    setLoading(true);
    const { data, error: userError } = await SupabaseClient
      .from("users")
      .update({
        first_name: values.firstName,
        second_name: values.secondName,
        last_name: values.lastName1,
        last_second_name: values.lastName2,
        role: values.role,
        id_basement: values.basement,
      })
      .eq("id", userId)
      .select()
      .single();

    if (userError) {
      message.error("Error al actualizar usuario");
      setLoading(false);
      return;
    }

    const { error: roleError } = await SupabaseClient.from('user_roles').update({ role: data.role }).eq('uuid', data.uuid);
    if (roleError) {
      message.error("Error al actualizar rol del usuario");
    } else {
      message.success("Usuario actualizado");
      onUpdated(data.email);
      onClose();
    }
    setLoading(false);
  };

  const handlePasswordChange = async (values) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Las contraseñas no coinciden");
      return;
    }

    const { error } = await SupabaseClient.auth.updateUser({ password: values.newPassword });
    if (error) message.error("Error al cambiar contraseña");
    else {
      message.success("Contraseña cambiada con éxito");
      setPasswordMode(false);
      passwordForm.resetFields();
    }
  };

  return (
    <Modal
      title={
        <span className="font-[Poppins] font-bold text-blue-900">
          {isPasswordMode ? "Cambiar Contraseña" : "Editar Usuario"}
        </span>
      }
      open={open}
      onCancel={() => {
        if (isPasswordMode) setPasswordMode(false);
        else onClose();
      }}
      footer={null}
      width={isPasswordMode ? 400 : 700}
      className="rounded-2xl"
    >
      <Spin spinning={loading} tip="Cargando datos...">
        {isPasswordMode ? (
          <Form layout="vertical" form={passwordForm} onFinish={handlePasswordChange}>
            <Form.Item
              label={<BlueLabel>Nueva Contraseña</BlueLabel>}
              name="newPassword"
              rules={[{ required: true, message: "Ingrese nueva contraseña" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nueva contraseña" className="rounded-xl" />
            </Form.Item>
            <Form.Item
              label={<BlueLabel>Confirmar Contraseña</BlueLabel>}
              name="confirmPassword"
              rules={[{ required: true, message: "Confirme su contraseña" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirmar contraseña" className="rounded-xl" />
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="font-[Poppins] bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl w-full"
            >
              Guardar Contraseña
            </Button>
          </Form>
        ) : (
          <Card bordered={false} className="rounded-2xl">
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item label={<BlueLabel>Correo Electrónico</BlueLabel>} name="email">
                <Input prefix={<MailOutlined />} disabled className="!text-gray-500 font-[Poppins] rounded-xl" />
              </Form.Item>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label={<BlueLabel>Rol</BlueLabel>} name="role" rules={[{ required: true }]}>
                    <Select placeholder="Rol" className="!text-black font-[Poppins] rounded-xl">
                      {roles.map(r => (<Option key={r} value={r}>{r}</Option>))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label={<BlueLabel>Sede</BlueLabel>} name="basement" rules={[{ required: true }]}>
                    <Select placeholder="Sede" className="!text-black font-[Poppins] rounded-xl">
                      {basements.map(b => (<Option key={b.id} value={b.id}>{b.name}</Option>))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label={<BlueLabel>Primer Nombre</BlueLabel>} name="firstName" rules={[{ required: true }]}>
                    <Input prefix={<UserOutlined />} placeholder="Ej. Juan" className="rounded-xl" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label={<BlueLabel>Segundo Nombre</BlueLabel>} name="secondName">
                    <Input prefix={<UserOutlined />} placeholder="Ej. Carlos" className="rounded-xl" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item label={<BlueLabel>Primer Apellido</BlueLabel>} name="lastName1" rules={[{ required: true }]}>
                    <Input prefix={<IdcardOutlined />} placeholder="Ej. Pérez" className="rounded-xl" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label={<BlueLabel>Segundo Apellido</BlueLabel>} name="lastName2">
                    <Input prefix={<IdcardOutlined />} placeholder="Ej. López" className="rounded-xl" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Button type="primary" htmlType="submit" loading={loading} className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                    Guardar
                  </Button>
                </Col>
                <Col span={12}>
                  <Button type="default" onClick={() => setPasswordMode(true)} className="w-full rounded-xl bg-red-500 hover:bg-red-600 text-white">
                    Cambiar Contraseña
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        )}
      </Spin>
    </Modal>
  );
}
