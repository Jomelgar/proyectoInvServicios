import {Modal,Form,Input,Button} from "antd";

function AddBasement({isSedeModalOpen,setSedeOpen,createSede}){
   return ( 
   <Modal
        title="Crear Sede"
        open={isSedeModalOpen}
        onCancel={() => setSedeOpen(false)}
        footer={null}
    >
        <Form layout="vertical" onFinish={createSede}>
          <Form.Item
            name="name"
            label="Nombre de la sede"
            rules={[{ required: true, message: "Ingrese el nombre" }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Crear</Button>
        </Form>
    </Modal>
   );
};

export default AddBasement;