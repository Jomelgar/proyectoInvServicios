import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout, Menu, Drawer } from "antd";
import {
  CalendarOutlined,
  FormOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";

const { Sider } = Layout;

function Sidebar({ collapsed, setCollapsed, drawerVisible, setDrawerVisible, isMobile, setIsMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("1");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    switch (location.pathname) {
      case "/": setSelectedKey("1"); break;
      case "/formularios": setSelectedKey("2"); break;
      case "/perfil": setSelectedKey("3"); break;
      case "/calendario": setSelectedKey("4"); break;
      default: setSelectedKey("1");
    }
  }, [location]);

  const handleLogout = () => {
    Cookies.remove("user_email");
    navigate("/login");
  };

  const menuItems = [
    { key: "1", icon: <HomeOutlined />, label: "Inicio", onClick: () => { navigate("/"); if(isMobile) setDrawerVisible(false); } },
    { key: "4", icon: <CalendarOutlined />, label: "Calendario", onClick: () => { navigate("/calendario"); if(isMobile) setDrawerVisible(false); } },
    { key: "2", icon: <FormOutlined />, label: "Formularios", onClick: () => { navigate("/formularios"); if(isMobile) setDrawerVisible(false); } },
    { key: "3", icon: <UserOutlined />, label: "Mi Perfil", onClick: () => { navigate("/perfil"); if(isMobile) setDrawerVisible(false); } },
    { key: "0", icon: <LogoutOutlined />, label: "Cerrar sesión", onClick: handleLogout },
  ];

  // === Líneas animadas como fondo ===
  const AnimatedLinesBackground = () => (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-blue-500"></div>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-1/2 bg-gradient-to-r from-blue-200/30 via-transparent to-blue-100/30 opacity-30"
          style={{
            top: `${i * 10}%`,
            transform: `rotate(-25deg) translateX(-100%)`,
            animation: `sidebarMoveLines ${20 + i * 4}s linear infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes sidebarMoveLines {
          0% { transform: rotate(-25deg) translateX(-100%); }
          50% { transform: rotate(-25deg) translateX(100%); }
          100% { transform: rotate(-25deg) translateX(-100%); }
        }
      `}</style>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
        className="!bg-transparent"
      >
        <div className="relative h-full text-white overflow-hidden">
          <AnimatedLinesBackground />

          <div className="relative z-10 text-center mt-5">
            <img src="/UT2.png" alt="Logo" className="h-10 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-gray-100">Universidad Tecnológica Centroamericana</h3>
            <p className="text-sm text-gray-300">Innovando para tu futuro</p>
            <div className="border-b border-gray-300 mx-4 my-4" />
          </div>

          <div className="relative z-10">
            <Menu
              mode="inline"
              theme="dark"
              className="!bg-transparent"
              selectedKeys={[selectedKey]}
              items={menuItems}
            />
          </div>
        </div>
      </Drawer>
    );
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="lg"
      className="relative min-h-screen text-white overflow-hidden"
    >
      <AnimatedLinesBackground />

      <div className="relative z-10 text-center mt-5">
        <img src="/UT2.png" alt="Logo" className="h-10 mx-auto mb-2" />
        <div className="border-b border-white mx-4 my-4" />
      </div>

      <div className="relative z-10">
        <Menu
          theme="dark"
          mode="inline"
          className="!bg-transparent"
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </div>
    </Sider>
  );
}

export default Sidebar;
