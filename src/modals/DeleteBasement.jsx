import { useState } from "react";
import { Modal, Form, Select, Button, Typography } from "antd";

const { Text } = Typography;

function DeleteBasement({ onDelete, isDeleteModalOpen, setDeleteModalOpen, sedes }) {
  const [selectedEdificio, setSelectedEdificio] = useState(null);

  const handleDelete = () => {
    if (selectedEdificio) {
      onDelete(selectedEdificio); // aquí tu lógica de delete en cascada
      setSelectedEdificio(null);
      setDeleteModalOpen(false);
    }
  };

  return (
    <Modal
      className="font-[Poppins]"
      title="Eliminar Edificio"
      open={isDeleteModalOpen}
      onCancel={() => {
        setSelectedEdificio(null);
        setDeleteModalOpen(false);
      }}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleDelete}>
        <Form.Item
          label="Seleccione el edificio a eliminar"
          rules={[{ required: true, message: "Seleccione un edificio" }]}
        >
          <Select
            placeholder="Selecciona un edificio"
            onChange={(id) => setSelectedEdificio(id)}
            value={selectedEdificio}
          >
            {sedes.map((e) => (
              <Select.Option key={e.id} value={e.id}>
                {e.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {selectedEdificio && (
          <>
            <Text type="danger">
              ⚠️ Esto eliminará el edificio seleccionado de forma permanente.
            </Text>
            <br />
            <Text type="warning">
              ⚠️ Atención: la eliminación es en cascada, se borrarán también todos los lugares y aulas asociados.
            </Text>
          </>
        )}

        <Button
          type="primary"
          htmlType="submit"
          danger
          block
          className="mt-4"
          disabled={!selectedEdificio}
        >
          Eliminar
        </Button>
      </Form>
    </Modal>
  );
}

export default DeleteBasement;
