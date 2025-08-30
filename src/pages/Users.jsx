import { useState, useEffect } from "react";
import { Table, Input, Button, Space, Card, Pagination } from "antd";
import Cookies from "js-cookie";
import supabase from "../utils/supabase"; 
import EditUserModal from "../modals/EditUserModal";
import DeleteUserModal from "../modals/DeleteUserModal";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentRole, setCurrentRole] = useState("");
  const pageSize = 5;

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCurrentRole = async () => {
      const email = Cookies.get("user_email");
      if (!email) return;
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("uuid", email)
        .single();
      if (!error && data) setCurrentRole(data.role);
    };
    fetchCurrentRole();
  }, []);

  const handleEdit = (userId) => {
    setSelectedUserId(userId);
    setEditModalOpen(true);
  };

  const handleDelete = (userId) => {
    setSelectedUserId(userId);
    setDeleteModalOpen(true);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      setUsers(data.filter(u => u.email !== Cookies.get("user_email")));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const columns = [
    { title: "Email", dataIndex: "email", key: "email", responsive: ["sm"] },
    { title: "Rol", dataIndex: "role", key: "role", responsive: ["sm"] },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) =>
        (currentRole !== "CREADOR" && record.role === "CREADOR") ? (
          <p className="font-semibold text-sm">{'Es un usuario creador, no tienes permisos'}</p>
        ) : (
          <Space direction="horizontal" size="small">
            <Button type="link" onClick={() => handleEdit(record.id)}>Editar</Button>
            <Button type="link" danger onClick={() => handleDelete(record.id)}>Eliminar</Button>
          </Space>
        ),
    },
  ];

  return (
    <div className="flex flex-col p-4 md:p-6 h-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b pb-3 mb-4 gap-2">
        <h1 className="font-[Poppins] text-blue-900 font-semibold text-2xl md:text-3xl">
          Gestión de Usuarios
        </h1>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Input.Search
            placeholder="Buscar por nombre o email"
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            className="w-full md:w-auto"
          />
          <Button onClick={fetchUsers} className="w-full md:w-auto">
            Refrescar
          </Button>
        </div>
      </div>

      {!isMobile ? (
        <Table
          className="font-[Poppins]"
          rowKey="id"
          columns={columns}
          dataSource={filteredUsers}
          loading={loading}
          pagination={{ pageSize: 5 }}
          scroll={{ x: "max-content" }}
        />
      ) : (
        <>
          <div className="flex flex-col gap-4">
            {paginatedUsers.map(user => (
              <Card key={user.id} className="rounded-lg shadow-md">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Rol:</strong> {user.role}</p>
                {(currentRole === "CREADOR" || record.role !== "CREADOR") ? (
                  <Space>
                    <Button type="link" onClick={() => handleEdit(user.id)}>Editar</Button>
                    <Button type="link" danger onClick={() => handleDelete(user.id)}>Eliminar</Button>
                  </Space>
                ) : (
                  <p className="text-sm font-semibold">Usuario creador, no tienes permisos</p>
                )}
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredUsers.length}
              onChange={setCurrentPage}
            />
          </div>
        </>
      )}

      <EditUserModal
        open={editModalOpen}
        userId={selectedUserId}
        onClose={() => setEditModalOpen(false)}
        onUpdated={(updated) => console.log("Usuario actualizado", updated)}
      />
      <DeleteUserModal
        open={deleteModalOpen}
        userId={selectedUserId}
        onClose={() => setDeleteModalOpen(false)}
        onDeleted={(deletedId) => console.log("Usuario eliminado", deletedId)}
      />
    </div>
  );
}

export default Users;
