import { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom"; // <- Importa Outlet
import Sidebar from "../components/sidebar";
import Header from "../components/Header";

const { Content } = Layout;

function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh", minWidth: "100vw" }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed}
       isMobile={isMobile} drawerVisible={drawerVisible} setDrawerVisible={setDrawerVisible}
       setIsMobile={setIsMobile}
      />
      {/* Contenido */}
      <Layout>
        <Header collapsed={collapsed} setCollapsed={setCollapsed} isMobile={isMobile} setDrawerVisible={setDrawerVisible}/>
        <Content style={{ margin: "16px", background: "#fff", padding: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
