import { useState, useEffect } from "react";
import {
  Modal,
  List,
  Row,
  Input,
  Col,
  Typography,
  Button,
  Card,
  AutoComplete,
  message,
} from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import supabase from "../utils/supabase";

const { Title, Text } = Typography;

function PlaceCategory({ place, setPlace, edit }) {
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [options, setOptions] = useState([]); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [loading, setLoading] = useState(false);

  const isEmpty = !place || Object.keys(place).length === 0;

  // traer categorías del lugar
  const fetchCategories = async () => {
    if (!place?.id) return;
    const { data, error } = await supabase
      .from("place_category")
      .select("id, category(id, name)")
      .eq("id_place", place.id);

    if (!error) setCategories(data || []);
  };

  // traer todas las categorías disponibles
  const fetchAllCategories = async () => {
    const { data, error } = await supabase.from("category").select("id, name").eq('state',true);
    if (!error) setAllCategories(data || []);
  };

  // añadir categoría seleccionada
  const addCategory = async () => {
    if (!place?.id || !selectedCategory) {
      message.warning("Primero selecciona una categoría");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("place_category").insert([
      {
        id_place: place.id,
        id_category: selectedCategory,
      },
    ]);
    setLoading(false);
    if (!error) {
      message.success("Categoría añadida");
      setSelectedCategory(null);
      fetchCategories();
    } else {
      message.error("Error al añadir categoría");
    }
  };

  // eliminar categoría
  const removeCategory = async (id) => {
    setLoading(true);
    const { error } = await supabase.from("place_category").delete().eq("id", id);
    setLoading(false);
    if (!error) {
      message.success("Categoría eliminada");
      fetchCategories();
    } else {
      message.error("Error al eliminar categoría");
    }
  };

  // filtrar sugerencias en AutoComplete
  const handleSearch = (value) => {
    if (!value) {
      setOptions([]);
      return;
    }
    const filtered = allCategories
      .filter((cat) => cat.name.toLowerCase().includes(value.toLowerCase()))
      .map((cat) => ({
        value: cat.id,
        label: cat.name,
      }));
    setOptions(filtered);
  };

  useEffect(() => {
    fetchCategories();
    fetchAllCategories();
  }, [place]);

  return (
    <Modal
      open={!isEmpty}
      onCancel={() => setPlace(null)}
      footer={null}
      className="font-[Poppins]"  // 🔥 aplica Poppins a todo el modal
      width={700}
      title={<Title level={4}>Lugar - {place?.name ?? ""}</Title>}
    >
      <div className="font-[Poppins]"> {/* 🔥 asegura que todo herede la fuente */}
        {/* Datos generales */}
        <Card bordered={false} className="shadow-sm rounded-xl mb-4 font-[Poppins]">
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>Nombre del Lugar:</Text>
              <Input
                className="mt-1 font-[Poppins]"
                disabled
                value={place?.name}
                placeholder="Sin nombre"
              />
            </Col>
            <Col span={12}>
              <Text strong>Edificio:</Text>
              <Input
                className="mt-1 font-[Poppins]"
                disabled
                value={place?.building?.name}
                placeholder="Sin edificio"
              />
            </Col>
          </Row>
        </Card>
        {/* Categorías */}
        <Card bordered={false} className="shadow-sm rounded-xl mb-4 font-[Poppins]">
          <div className="mb-4">
            <Title level={5}>Añadir Categoría</Title>
            <Row gutter={8}>
              <Col flex="auto">
                <AutoComplete
                  style={{ width: "100%" }}
                  options={options}
                  onSearch={handleSearch}
                  placeholder="Escribe para buscar una categoría"
                  onSelect={(value) => setSelectedCategory(value)}
                  value={
                    options.find((opt) => opt.value === selectedCategory)?.label ||
                    ""
                  }
                  onChange={() => setSelectedCategory(null)}
                  filterOption={false}
                  className="font-[Poppins]"
                />
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={addCategory}
                  loading={loading}
                  className="font-[Poppins]"
                >
                  Agregar
                </Button>
              </Col>
            </Row>
          </div>
          <Title level={5}>Categorías que tiene el lugar</Title>
          <List
            bordered
            dataSource={categories}
            locale={{ emptyText: "Este lugar no tiene categorías" }}
            className="font-[Poppins]"
            renderItem={(item) => (
              <List.Item
                actions={[
                  edit && (
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeCategory(item.id)}
                      loading={loading}
                      className="font-[Poppins]"
                    >
                      Eliminar
                    </Button>
                  ),
                ]}
              >
                <Text>{item.category?.name}</Text>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </Modal>
  );
}

export default PlaceCategory;
