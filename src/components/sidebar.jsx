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

function Sidebar({
  collapsed,
  setCollapsed,
  drawerVisible,
  setDrawerVisible,
  isMobile,
  setIsMobile,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("1");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setSelectedKey("1");
        break;
      case "/formularios":
        setSelectedKey("2");
        break;
      case "/perfil":
        setSelectedKey("3");
        break;
      case "/calendario":
        setSelectedKey("4");
        break;
      default:
        setSelectedKey("1");
    }
  }, [location]);

  const handleLogout = () => {
    Cookies.remove("user_email");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "1",
      icon: <HomeOutlined />,
      label: "Inicio",
      onClick: () => {
        navigate("/");
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: "4",
      icon: <CalendarOutlined />,
      label: "Calendario",
      onClick: () => {
        navigate("/calendario");
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: "2",
      icon: <FormOutlined />,
      label: "Formularios",
      onClick: () => {
        navigate("/formularios");
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: "Mi Perfil",
      onClick: () => {
        navigate("/perfil");
        if (isMobile) setDrawerVisible(false);
      },
    },
    {
      key: "0",
      icon: <LogoutOutlined />,
      label: "Cerrar sesión",
      onClick: handleLogout,
    },
  ];

  // === SVG decorativo (azules claros y blancos) ===
  const CurvesBackground = () => (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="absolute top-0 left-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 200 800"
      >
        <path
          d="M 0 100 C 80 200, 120 400, 0 600"
          stroke="#3b82f6"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M 200 0 C 120 200, 80 400, 200 800"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 100 0 C 160 150, 60 500, 150 700"
          stroke="#60a5fa"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 50 0 C 20 200, 180 500, 50 800"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
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
        className="!bg-[#001529]"
      >
        <div className="relative h-full bg-gradient-to-b from-blue-900 to-blue-500 text-white overflow-hidden">
          <CurvesBackground />

          {/* Logo y texto */}
          <div className="text-center relative z-10">
            <img
              src="/UT2.png"
              alt="Logo"
              className="h-10 mx-auto my-3 block mt-5 mb-5"
            />
            <h3 className="text-lg font-[Poppins] font-bold text-gray-100">
              Universidad Tecnológica Centroamericana
            </h3>
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
      className="relative min-h-screen bg-gradient-to-b from-blue-900 to-blue-500 text-white overflow-hidden"
    >
      <CurvesBackground />

      <div className="relative z-10">
        <img
          src="/UT2.png"
          alt="Logo"
          className="h-10 mx-auto my-3 block mb-5"
        />
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
