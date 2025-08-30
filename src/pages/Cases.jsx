import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import supabaseClient from "../utils/supabase";
import { Table, Card, Select, Row, Col, Spin } from "antd";

function Cases() {
  const email = Cookies.get("user_email");
  const [role, setRole] = useState("");
  const [sedes, setSedes] = useState([]);
  const [sede, setSede] = useState();
  const [cases, setCases] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchBasement = async () => {
    const { data } = await supabaseClient.from("basement").select("*");
    if (data) setSedes(data);
  };

  const fetchRole = async () => {
    const { data } = await supabaseClient
      .from("users")
      .select("role")
      .eq("email", email)
      .single();
    if (data) setRole(data.role);
  };

  const fetchCases = async () => {
    setLoading(true);
    const { data } = await supabaseClient
      .from("cases")
      .select("id, titulo, url, espacio, sede")
      .eq("basement", sede);
    if (data) setCases(data);
    setLoading(false);
  };

  const fetchSede = async () => {
    const { data } = await supabaseClient
      .from("users")
      .select("id_basement")
      .eq("email", email)
      .single();
    if (data) setSede(data.id_basement);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchBasement(), fetchRole(), fetchSede()]);
      setLoading(false);
    };
    init();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (sede) fetchCases();
  }, [sede]);

  // columnas para la tabla
  const columns = [
    { title: "Título", dataIndex: "titulo", key: "titulo" },
    { title: "Espacio", dataIndex: "espacio", key: "espacio" },
    {
      title: "URL",
      dataIndex: "url",
      key: "url",
      render: (text) => (
        <a href={text} target="_blank" rel="noreferrer">
          {text}
        </a>
      ),
    },
  ];

  return (
    <div className="p-4">
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" tip="Cargando datos..." />
        </div>
      ) : !isMobile ? (
        <Table
          dataSource={cases}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
          loading={loading}
        />
      ) : (
        <Row gutter={[16, 16]}>
          {cases.map((c) => (
            <Col span={24} key={c.id}>
              <Card title={c.titulo} bordered>
                <p>
                  <strong>Espacio:</strong> {c.espacio}
                </p>
                <p>
                  <strong>URL:</strong>{" "}
                  <a href={c.url} target="_blank" rel="noreferrer">
                    {c.url}
                  </a>
                </p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default Cases;
