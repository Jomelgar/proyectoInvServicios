import { useState, useEffect } from "react";
import { Modal, Form, Select, Button, message } from "antd";
import supabaseClient from "../utils/supabase";

function DeletePlace({ isDeleteModalOpen, setDeleteModalOpen, deleteLugar }) {
  const [form] = Form.useForm();
  const [sedes, setSedes] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [lugares, setLugares] = useState([]);

  const [selectedSede, setSelectedSede] = useState(null);
  const [selectedEdificio, setSelectedEdificio] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Cargar sedes al abrir modal
  useEffect(() => {
    if (isDeleteModalOpen) {
      const fetchSedes = async () => {
        const { data, error } = await supabaseClient
          .from("basement")
          .select("id, name")
          .eq("state", true);
        if (error) {
          console.error(error);
          message.error("Error al cargar sedes");
        } else {
          setSedes(data || []);
        }
      };
      fetchSedes();
    }
  }, [isDeleteModalOpen]);

  // Cargar edificios al seleccionar sede
  useEffect(() => {
    if (selectedSede) {
      const fetchBuildings = async () => {
        const { data, error } = await supabaseClient
          .from("building")
          .select("id, name")
          .eq("id_basement", selectedSede)
          .eq("state", true);
        if (error) {
          console.error(error);
          message.error("Error al cargar edificios");
        } else {
          setEdificios(data || []);
          setSelectedEdificio(null);
          setLugares([]);
        }
      };
      fetchBuildings();
    }
  }, [selectedSede]);

  // Cargar lugares al seleccionar edificio
  useEffect(() => {
    if (selectedEdificio) {
      const fetchPlaces = async () => {
        const { data, error } = await supabaseClient
          .from("place")
          .select("id, name")
          .eq("id_building", selectedEdificio)
          .eq("state", true);
        if (error) {
          console.error(error);
          message.error("Error al cargar lugares");
        } else {
          setLugares(data || []);
          setSelectedPlace(null);
        }
      };
      fetchPlaces();
    }
  }, [selectedEdificio]);

  return (
    <Modal
      title="Eliminar Lugar"
      open={isDeleteModalOpen}
      onCancel={() => {
        setDeleteModalOpen(false);
        setSelectedSede(null);
        setSelectedEdificio(null);
        setSelectedPlace(null);
        form.resetFields();
      }}
      footer={null}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={() => {
          if (selectedPlace) {
            deleteLugar(selectedPlace);
            form.resetFields();
            setDeleteModalOpen(false);
          } else {
            message.warning("Seleccione un lugar para eliminar");
          }
        }}
      >
        {/* Selección de sede */}
        <Form.Item
          label="Seleccione la sede"
          name="sede"
          rules={[{ required: true, message: "Seleccione una sede" }]}
        >
          <Select
            placeholder="Selecciona una sede"
            onChange={(id) => setSelectedSede(id)}
            value={selectedSede}
          >
            {sedes.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Selección de edificio */}
        <Form.Item
          label="Seleccione el edificio"
          name="edificio"
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

        {/* Selección de lugar */}
        <Form.Item
          label="Seleccione el lugar"
          name="place"
          rules={[{ required: true, message: "Seleccione un lugar" }]}
        >
          <Select
            placeholder="Selecciona un lugar"
            onChange={(id) => setSelectedPlace(id)}
            value={selectedPlace}
            disabled={!selectedEdificio}
          >
            {lugares.map((l) => (
              <Select.Option key={l.id} value={l.id}>
                {l.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Button danger type="primary" htmlType="submit" block>
          Eliminar
        </Button>
      </Form>
    </Modal>
  );
}

export default DeletePlace;
