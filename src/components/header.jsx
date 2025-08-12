import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const { Header: AntHeader } = Layout;

function Header({ collapsed, setCollapsed }) {
  return (
    <AntHeader className="bg-white flex items-center justify-between px-4 mb-2 border-b border-gray-500">
      {/* Botón + título */}
      <div className="flex items-center">
        {collapsed ? (
          <MenuUnfoldOutlined
            onClick={() => setCollapsed(false)}
            className="text-xl cursor-pointer"
          />
        ) : (
          <MenuFoldOutlined
            onClick={() => setCollapsed(true)}
            className="text-xl cursor-pointer"
          />
        )}
        <h2 className="ml-4 text-lg font-semibold">Panel de Control</h2>
      </div>

      {/* Logo a la derecha */}
      <img
        src="/logo.png"
        alt="Logo"
        className="h-12 mr-5"
      />
    </AntHeader>
  );
}

export default Header;
