import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom"; // <- Importa Outlet
import Sidebar from "../components/sidebar";
import Header from "../components/Header";

const { Content } = Layout;

function Home() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      {/* Contenido */}
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} />
        <Content style={{ margin: "16px", background: "#fff", padding: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
