import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  FormOutlined,
  HomeOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";

const { Sider } = Layout;

function Sidebar({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("1");

  useEffect(() => {
    // Cambia el seleccionado según la ruta
    switch (location.pathname) {
      case "/":
        setSelectedKey("1");
        break;
      case "/formularios":
        setSelectedKey("2");
        break;
      default:
        setSelectedKey("1");
    }
  }, [location]);

  const handleLogout = () => {
    Cookies.remove("user_email");
    navigate("/login");
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="lg"
      className="min-h-screen bg-[#001529] border-r border-gray-500"
    >
      <div>
        <img
          src="/UT2.png"
          alt="Logo"
          className="h-10 mx-auto my-3 block mb-5"
        />
        <div className="border-b border-white mx-4 my-4" />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={[
          {
            key: "1",
            icon: <HomeOutlined />,
            label: "Inicio",
            onClick: () => navigate("/"),
          },
          {
            key: "2",
            icon: <FormOutlined />,
            label: "Formularios",
            onClick: () => navigate("/formularios"),
          },
          {
            key: "0",
            icon: <LogoutOutlined />,
            label: "Cerrar sesión",
            onClick: handleLogout,
          },
        ]}
      />
    </Sider>
  );
}

export default Sidebar;
