import { useEffect, useState } from "react";
import { Modal, Form, Select, Button, Typography } from "antd";
import supabase from "../utils/supabase";

const { Text } = Typography;

function DeleteBuilding({
  deleteEdificio,
  isDeleteModalOpen,
  setDeleteModalOpen,
  sedes, 
}) {
  const [selectedSede, setSelectedSede] = useState(null);
  const [edificios,setEdificios] = useState([]);
  const [selectedEdificio, setSelectedEdificio] = useState(null);

  const handleDelete = () => {
    if (selectedEdificio) {
      deleteEdificio(selectedEdificio);
      setSelectedEdificio(null);
      setSelectedSede(null);
      setDeleteModalOpen(false);
    }
  };

  useEffect(()=>{
    const fetchEdificios=async()=>{
      const {data} = await supabase.from('building').select('*').eq('id_basement',selectedSede).eq('state',true);
      if(data) setEdificios(data);
    }
    fetchEdificios();
  },[selectedSede])

  return (
    <Modal
      className="font-[Poppins]"
      title="Eliminar Edificio"
      open={isDeleteModalOpen}
      onCancel={() => {
        setSelectedEdificio(null);
        setSelectedSede(null);
        setDeleteModalOpen(false);
      }}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleDelete}>
        {/* Select de sedes */}
        <Form.Item
          label="Seleccione la sede"
          rules={[{ required: true, message: "Seleccione una sede" }]}
        >
          <Select
            placeholder="Selecciona una sede"
            onChange={(id) => {
              setSelectedSede(id);
              setSelectedEdificio(null);
            }}
            value={selectedSede}
          >
            {sedes.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Select de edificios filtrados */}
        <Form.Item
          label="Seleccione el edificio a eliminar"
          rules={[{ required: true, message: "Seleccione un edificio" }]}
        >
          <Select
            placeholder="Selecciona un edificio"
            onChange={(id) => setSelectedEdificio(id)}
            value={selectedEdificio}
            disabled={!selectedSede}
          >
            {edificios.map((e) => (
              <Select.Option key={e.id} value={e.id}>
                {e.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {selectedEdificio && (
          <Text type="danger">
            ⚠️ Esto eliminará el edificio seleccionado de forma permanente.
          </Text>
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

export default DeleteBuilding;
