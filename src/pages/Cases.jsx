import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import supabaseClient from "../utils/supabase";
import {
  Table,
  Card,
  Select,
  Row,
  Col,
  Spin,
  Empty,
  Button,
  Tag,
  message,
} from "antd";

function Cases() {
  const token = Cookies.get("user_email");
  const [role, setRole] = useState("");
  const [sedes, setSedes] = useState([]);
  const [sede, setSede] = useState();
  const [cases, setCases] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  const onAccept = async(caseId) =>{
    const {error} = await supabaseClient.from('case').update({phase: "Aceptada"}).eq('id',caseId);
    await fetchCases(); 
  }
  const onCancel = async(caseId) =>{
    const {error} = await supabaseClient.from('case').update({phase: "Rechazada"}).eq('id',caseId);
    await fetchCases();
  }

  // 🔹 Traer sedes
  const fetchBasement = async () => {
    const { data } = await supabaseClient.from("basement").select("*");
    if (data) setSedes(data);
  };

  // 🔹 Traer rol y sede del usuario
  const fetchRoleAndSede = async () => {
    const { data } = await supabaseClient
      .from("users")
      .select("role,id_basement")
      .eq("uuid", token)
      .single();
    if (data) {
      setSede(data.id_basement);
      setRole(data.role);
    }
  };

  // 🔹 Traer casos
const fetchCases = async () => {
  setLoading(true);
  try {
    const { data, error } = await supabaseClient
      .from("case")
      .select(`
        id,
        title,
        description,
        phase,
        place(
          id,
          name,
          state,
          building(
            id,
            name,
            state,
            basement(
              id,
              name,
              state
            )
          )
        )
      `)
      .eq("phase", "En Proceso");

    if (error) {
      message.error("Error al traer casos");
      setCases([]);
    } else if (data) {
      // Filtrar solo activos
      const activeCases = data.filter(
        (c) =>
          c.place?.state &&
          c.place?.building?.state &&
          c.place?.building?.basement?.state &&
          c.place?.building?.basement?.id === sede
      );
      setCases(activeCases);
    }
  } catch (err) {
    console.error(err);
    message.error("Error al cargar los casos");
    setCases([]);
  } finally {
    setLoading(false);
  }
};

  // 🔹 Detectar mobile y cargar inicial
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchBasement(), fetchRoleAndSede()]);
      setLoading(false);
    };
    init();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Actualizar casos cuando cambie la sede
  useEffect(() => {
    if (sede) fetchCases();
  }, [sede]);

  // 🔹 Helper para mostrar estado
  const renderStatus = (status) => (
    <Tag color={status === "Activo" ? "green" : "red"}>
      {status || "Desconocido"}
    </Tag>
  );

  // 🔹 Columnas tabla desktop
  const columns = [
    { title: "Título", dataIndex: "title", key: "title" },
    {
      title: "Edificio",
      key: "building",
      render: (record) => (
        <>
          {record.place?.building?.name}{" "}
        </>
      ),
    },
    {
      title: "Espacio",
      key: "place",
      render: (record) => (
        <>
          {record.place?.name}
        </>
      ),
    },
    {
      title: "Sede",
      key: "basement",
      render: (record) => (
        <>
          {record.place?.building?.basement?.name}
        </>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (record) => (
        <div className="flex items-center gap-2 ">
          <Button type="primary" onClick={() => onAccept(record.id)}>Aceptar</Button>
          <Button danger onClick={() =>onCancel(record.id)}>Denegar</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between px-5 md:border-b mb-5">
        <h1 className="text-blue-800 font-[Poppins] font-bold text-3xl">
          Verificar Casos
        </h1>

        <Select
          value={sede}
          onChange={setSede}
          style={{ width: 220 }}
          disabled={role !== "CREADOR"}
          className="mt-3 mb-2 font-[Poppins]"
          placeholder="Selecciona una sede"
        >
          {sedes.map((s) => (
            <Select.Option key={s.id} value={s.id} className="font-[Poppins]">
              {s.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Cargando datos..." />
        </div>
      ) : !isMobile ? (
        <Table
          dataSource={cases}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 , position: ["bottomCenter"]}}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {cases.length === 0 ? (
            <Col span={24}>
              <Empty description="No hay casos disponibles" />
            </Col>
          ) : (
            cases.map((c) => (
              <Col span={24} key={c.id}>
                <Card title={c.title} bordered>
                  <p>
                    <strong>Edificio:</strong> {c.place?.building?.name}
                  </p>
                  <p>
                    <strong>Espacio:</strong> {c.place?.name}
                  </p>
                  <p>
                    <strong>Sede:</strong> {c.place?.building?.basement?.name}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button type="primary" block>
                      Aceptar
                    </Button>
                    <Button danger block>
                      Denegar
                    </Button>
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </div>
  );
}

export default Cases;
