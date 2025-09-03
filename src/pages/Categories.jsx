import { useState, useEffect } from "react";
import { Input, Button, List, Card, Table, Space } from "antd";
import supabase from "../utils/supabase";
import AddCategories from "../modals/AddCategories";
import DeleteCategories from "../modals/DeleteCategories";
import PlaceCategory from "../modals/PlaceCategory";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, TagOutlined } from "@ant-design/icons";

function Categories() {
  const [isAdd, setIsAdd] = useState(false);
  const [isDelete, setIsDelete] = useState(false); 
  const [categories, setCategories] = useState([]);
  const [place, setPlace] = useState();
  const [lugares, setLugares] = useState([]);
  const [edit, setEdit] = useState(false);

  // Fetch lugares
  const fetchLugares = async () => {
    const { data } = await supabase
      .from("place")
      .select("id,name,building(name)")
      .eq("state", true);
    if (data) setLugares(data);
  };
  
  // Fetch categorías
  const fetchCategorias = async () => {
    const { data, error } = await supabase.from("category").select("*").eq('state', true);
    if (!error && data) setCategories(data);
  };

  // Agregar categoría
  const addCategory = async (values) => {
    const { error } = await supabase.from("category").insert([{ name: values.name }]);
    if (!error) await fetchCategorias();
  };

  // Eliminar categoría (lógica de soft delete)
  const deleteCategory = async (values) => {
    const { error } = await supabase.from("category").update({ state: false }).eq('id', values.category);
    if (!error) await fetchCategorias();
  }

  useEffect(() => {
    fetchLugares();
    fetchCategorias();
  }, []);

  const columns = [
    {
      title: "Edificio",
      dataIndex: ["building", "name"],
      key: "edificio",
      className: "font-[Poppins]",
    },
    {
      title: "Lugar",
      dataIndex: "name",
      key: "name",
      className: "font-[Poppins]",
    },
    {
      title: "Acciones",
      key: "acciones",
      className: "font-[Poppins]",
      render: (record) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => { setPlace(record); setEdit(true); }}
            className="font-[Poppins] hover:!border-none !underline"
          >
            Editar
          </Button>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => { setPlace(record); setEdit(false); }}
            className="font-[Poppins] hover:!border-none !underline"
          >
            Ver
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="font-[Poppins] p-4 flex flex-col h-full space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-blue-800 font-semibold text-2xl sm:text-4xl">
          Gestión de Categorías
        </h1>
        <Space wrap>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAdd(true)}
            className="font-[Poppins] bg-blue-600 hover:bg-blue-700"
          >
            Agregar Categoría
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setIsDelete(true)}
            className="font-[Poppins] !bg-red-600 hover:!bg-red-500 !text-white"
          >
            Eliminar Categoría
          </Button>
        </Space>
      </div>

      {/* Lista de categorías */}
      <Card title="Categorías" bordered className="shadow-sm rounded-xl">
        <div className="max-h-[40vh] overflow-y-auto">
          <List
            bordered
            dataSource={categories}
            locale={{ emptyText: "No hay categorías disponibles" }}
            renderItem={(item) => (
              <List.Item className="flex items-center gap-3">
                <TagOutlined className="text-gray-400" />
                <span>{item.name}</span>
              </List.Item>
            )}
          />
        </div>
      </Card>

      {/* Tabla de lugares */}
      <Card title="Lugares" bordered className="shadow-sm rounded-xl">
        <div className="max-h-[50vh] overflow-y-auto">
          <Table
            columns={columns}
            dataSource={lugares}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            scroll={{ y: '45vh' }}
            rowClassName={() => "font-[Poppins]"}
          />
        </div>
      </Card>

      {/* Modales */}
      <AddCategories isOpen={isAdd} setOpen={setIsAdd} onAdd={addCategory} />
      <DeleteCategories categories={categories} isOpen={isDelete} setOpen={setIsDelete} onDelete={deleteCategory} />
      <PlaceCategory place={place} setPlace={setPlace} edit={edit} />
    </div>
  );
}

export default Categories;
