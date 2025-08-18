import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout, Menu, Drawer } from "antd";
import {
  CalendarOutlined,
  FormOutlined,
  HomeOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Cookies from "js-cookie";

const { Sider } = Layout;

function Sidebar({ collapsed, setCollapsed,drawerVisible, setDrawerVisible, isMobile,setIsMobile}) {
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
    navigate('/login');
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
      key: '4',
      icon: <CalendarOutlined/>,
      label: 'Calendario',
      onClick: () => {
        navigate('/calendario');
        if(isMobile) setDrawerVisible(false);
      }
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
      key: '3',
      icon: <UserOutlined/>,
      label: "Mi Perfil",
      onClick:() =>{
        navigate('/perfil');
        if(isMobile) setDrawerVisible(false);
      }
    },
    {
      key: "0",
      icon: <LogoutOutlined />,
      label: "Cerrar sesión",
      onClick: handleLogout,
    },
  ];

  if (isMobile) {
    return (
      <>
        {/* Drawer lateral */}
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          bodyStyle={{ padding: 0 }}
          className="!bg-[#001529]"
        >
          <div className="text-center">
            <img
              src="/UT2.png"
              alt="Logo"
              className="h-10 mx-auto my-3 block mt-5 mb-5"
            />
            <h3 className="text-lg font-[Poppins] font-bold text-gray-100">
              Universidad Tecnológica Centroamericana
            </h3>
            <p className="text-sm text-gray-400">
              Innovando para tu futuro
            </p>
            <div className="border-b border-gray-300 mx-4 my-4" />
          </div>

          <Menu
            mode="inline"
            theme='dark'
            className="!bg-[#001529]"
            selectedKeys={[selectedKey]}
            items={menuItems}
          />
        </Drawer>
      </>
    );
  }

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

      <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={menuItems} />
    </Sider>
  );
}

export default Sidebar;
