import { useState } from "react";
import {Modal,Form,Select, Button,Input} from "antd";

function AddBuilding({createEdificio,isEdificioModalOpen,setEdificioModalOpen,sedes}){
    const [selectedSedeCreate, setSelectedSedeCreate] = useState(null);
    
    return(
    <Modal
    className="font-[Poppins]"
        title="Crear Edificio"
        open={isEdificioModalOpen}
        onCancel={() => setEdificioModalOpen(false)}
        footer={null}
    >
        <Form layout="vertical" onFinish={(values)=> createEdificio(values,selectedSedeCreate)}>
          <Form.Item
            name="name"
            label="Nombre del edificio"
            rules={[{ required: true, message: "Ingrese el nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Seleccione la sede"
            rules={[{ required: true, message: "Seleccione una sede" }]}
          >
            <Select
              placeholder="Selecciona una sede"
              onChange={(id) => setSelectedSedeCreate(id)}
              value={selectedSedeCreate}
            >
              {sedes.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Crear</Button>
        </Form>
      </Modal>
    );
}

export default AddBuilding;