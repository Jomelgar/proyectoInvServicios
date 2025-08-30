import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout, Menu, Drawer } from "antd";
import {
  CalendarOutlined,
  FormOutlined,
  HomeOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  EyeOutlined
} from "@ant-design/icons";
import Cookies from "js-cookie";
import supabaseClient from "../utils/supabase";

const { Sider } = Layout;
const { SubMenu } = Menu;

function Sidebar({ collapsed, setCollapsed, drawerVisible, setDrawerVisible, isMobile, setIsMobile }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("1");
  const [userRole, setUserRole] = useState(null);

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
      case "/verificar": setSelectedKey("5"); break;
      case "/gestion": setSelectedKey("99"); break;
      case "/gestion/sedes": setSelectedKey("98"); break;
      case "/gestion/categorias": setSelectedKey("97"); break;
      case "/gestion/usuarios": setSelectedKey("96"); break;
      default: setSelectedKey("1");
    }
  }, [location]);

  useEffect(() => {
    const fetchUserRole = async () => {
      const email = Cookies.get("user_email");
      if (!email) return;

      const { data, error } = await supabaseClient
        .from("user_roles")
        .select("role")
        .eq("uuid", email)
        .single();

      if (!error && data) setUserRole(data.role);
    };

    fetchUserRole();
  }, []);

  const handleLogout = async() => {
    const {error} = await supabaseClient.auth.signOut();
    Cookies.remove("user_email");
    navigate("/login");
  };

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

  const renderMenu = () => (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      className="transparent-menu !font-[Poppins]"
      expandIcon={() => null}
    >
      <Menu.Item
        key="1"
        icon={<HomeOutlined />}
        onClick={() => { navigate("/"); if(isMobile) setDrawerVisible(false); }}
        className="menu-item-hover"
      >
        Inicio
      </Menu.Item>

      <Menu.Item
        key="4"
        icon={<CalendarOutlined />}
        onClick={() => { navigate("/calendario"); if(isMobile) setDrawerVisible(false); }}
        className="menu-item-hover"
      >
        Calendario
      </Menu.Item>

      {userRole !== "USUARIO" && (
        <Menu.Item
          key="5"
          icon={<EyeOutlined />}
          onClick={() => { navigate("/verificar"); if(isMobile) setDrawerVisible(false); }}
          className="menu-item-hover"
        >
          Verificar Casos
        </Menu.Item>
      )}

      {userRole === "CREADOR" && (
        <SubMenu
          key="99"
          icon={<SettingOutlined />}
          title="Gestión"
          popupClassName="submenu-popup"
        >
          <Menu.Item
            key="98"
            onClick={() => { navigate("/gestion/sedes"); if(isMobile) setDrawerVisible(false); }}
            className="!font-[Poppins] submenu-item"
          >
            Sedes
          </Menu.Item>
          <Menu.Item
            key="97"
            onClick={() => { navigate("/gestion/categorias"); if(isMobile) setDrawerVisible(false); }}
            className="!font-[Poppins] submenu-item"
          >
            Categorías
          </Menu.Item>
          <Menu.Item
            key="96"
            onClick={() => { navigate("/gestion/usuarios"); if(isMobile) setDrawerVisible(false); }}
            className="!font-[Poppins] submenu-item"
          >
            Usuarios
          </Menu.Item>
        </SubMenu>
      )}

      <Menu.Item
        key="2"
        icon={<FormOutlined />}
        onClick={() => { navigate("/formularios"); if(isMobile) setDrawerVisible(false); }}
        className="menu-item-hover"
      >
        Mis Casos
      </Menu.Item>

      <Menu.Item
        key="3"
        icon={<UserOutlined />}
        onClick={() => { navigate("/perfil"); if(isMobile) setDrawerVisible(false); }}
        className="menu-item-hover"
      >
        Mi Perfil
      </Menu.Item>

      <Menu.Item
        key="0"
        icon={<LogoutOutlined />}
        onClick={handleLogout}
        className="menu-item-hover"
      >
        Cerrar sesión
      </Menu.Item>

      {/* ESTILOS PARA EL MENÚ TRANSPARENTE */}
      <style>{`
        /* Menú principal transparente */
        .transparent-menu, 
        .transparent-menu .ant-menu-sub, 
        .transparent-menu .ant-menu-item, 
        .transparent-menu .ant-menu-submenu-title {
          background: transparent !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        /* Items seleccionados */
        .transparent-menu .ant-menu-item-selected,
        .transparent-menu .ant-menu-submenu-selected > .ant-menu-submenu-title {
          background: linear-gradient(90deg, #3b82f6, #06b6d4) !important;
          border-radius: 5px;
          color: white !important;
          font-weight: 600;
          border: 1px solid #ffffffa3;
          box-shadow: 0 0 10px rgba(59,130,246,0.5);
          transition: all 0.3s ease;
        }

        /* Hover effects */
        .menu-item-hover:hover,
        .transparent-menu .ant-menu-submenu-title:hover {
          background: rgba(59, 130, 246, 0.2) !important;
          color: white !important;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        /* Submenu popup (cuando está colapsado) */
        .submenu-popup > .ant-menu {
          background: #000000aa !important;
          backdrop-filter: blur(10px);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 8px;
        }

        .submenu-popup .ant-menu-item {
          background: transparent !important;
          color: rgba(255, 255, 255, 0.9) !important;
          border-radius: 5px;
          margin: 2px 0;
        }

        .submenu-popup .ant-menu-item:hover {
          background: rgba(255, 255, 255, 0.15) !important;
          color: white !important;
        }

        .submenu-popup .ant-menu-item-selected {
          background: linear-gradient(90deg, rgba(59, 130, 246, 0.8), rgba(6, 182, 212, 0.8)) !important;
          color: white !important;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
        }

        /* Submenu inline (cuando NO está colapsado) */
        .transparent-menu .ant-menu-submenu-popup > .ant-menu {
          background: transparent !important;
        }

        .transparent-menu .ant-menu-sub.ant-menu-inline {
          background: rgba(30, 41, 59, 0.7) !important;
          backdrop-filter: blur(5px);
          border-radius: 8px;
          margin: 4px 8px;
          padding: 4px 0;
        }

        .transparent-menu .ant-menu-sub.ant-menu-inline .ant-menu-item {
          margin: 0;
          height: 36px;
          line-height: 36px;
        }

        .submenu-item:hover {
          background: rgba(59, 130, 246, 0.25) !important;
        }
      `}</style>
    </Menu>
  );

  if (isMobile) {
    return (
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0, backgroundColor: 'transparent' }}
        className="transparent-drawer"
        styles={{
          body: {
            padding: 0,
            background: 'transparent'
          }
        }}
      >
        <div className="relative h-full text-white overflow-hidden">
          <AnimatedLinesBackground />
          <div className="relative z-10 text-center mt-5">
            <img src="/UT2.png" alt="Logo" className="h-10 mx-auto mb-2" />
            <h3 className="text-lg font-bold text-gray-100">Universidad Tecnológica Centroamericana</h3>
            <p className="text-sm text-gray-300">Innovando para tu futuro</p>
            <div className="border-b border-gray-300 mx-4 my-4" />
          </div>
          <div className="relative z-10">{renderMenu()}</div>
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
      style={{ background: 'transparent' }}
    >
      <AnimatedLinesBackground />
      <div className="relative z-10 text-center mt-5">
        <img src="/UT2.png" alt="Logo" className="h-10 mx-auto mb-2" />
        <div className="border-b border-white mx-4 my-4" />
      </div>
      <div className="relative z-10">{renderMenu()}</div>
    </Sider>
  );
}

export default Sidebar;