import { Form, Input, Button, Modal } from "antd";

function AddCategories({ isOpen, setOpen, onAdd }) {
  const [form] = Form.useForm();

  return (
    <Modal
      className="font-[Poppins]"
      title="Crear Categoría"
      open={isOpen}
      onCancel={() => {
        form.resetFields(); 
        setOpen(false);     
      }}
      footer={null}
    >
      <Form
        form={form} 
        layout="vertical"
        onFinish={async(values) => {
          await onAdd(values);
          form.resetFields(); 
          setOpen(false);
        }}
      >
        <Form.Item
          className="font-[Poppins]"
          name="name"
          label="Nombre de Categoría"
          rules={[{ required: true, message: "Ingrese una categoría" }]}
        >
          <Input className="font-[Poppins]" placeholder="Nombre de Categoría" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Crear
        </Button>
      </Form>
    </Modal>
  );
}

export default AddCategories;
