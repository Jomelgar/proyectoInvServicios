import { Modal, Button, message } from "antd";
import { useState } from "react";
import SupabaseClient from "../utils/supabase";

export default function DeleteUserModal({ open, onClose, userId, onDeleted }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await SupabaseClient.from("users").update({state: 'false'}).eq("id", userId);
    if (error) {
      message.error("Error al eliminar usuario");
    } else {
      message.success("Usuario eliminado");
      onDeleted(userId);
      onClose();
    }
    setLoading(false);
  };

  return (
    <Modal
      title="Eliminar Usuario"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="delete" type="primary" danger loading={loading} onClick={handleDelete}>
          Eliminar
        </Button>,
      ]}
      destroyOnClose
    >
      <p>¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.</p>
    </Modal>
  );
}
