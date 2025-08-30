import { useState,useEffect } from "react";
import {Modal,Form,Input,Select,Button,Checkbox} from "antd";
import supababaseClient from "../utils/supabase";

function AddPlace({isLugarModalOpen, setLugarModalOpen,createLugar,sedes}){
    const [form] = Form.useForm();
  const [selectedEdificioCreate, setSelectedEdificioCreate] = useState(null);
  const [selectedSedeCreate, setSelectedSedeCreate] = useState(null);
  const [edificios,setEdificios] = useState([]);

  useEffect(()=> {
    const fetchBuilding = async()=>{
        const {data} = await supababaseClient.from('building').select('*').eq('id_basement',selectedSedeCreate).eq('state',true);
        console.log(data);
        if(data) setEdificios(data);
    };
    fetchBuilding();
  },[selectedSedeCreate])
return(
    <Modal
    title="Crear Lugar"
    open={isLugarModalOpen}
    onCancel={() => {
        setLugarModalOpen(false);
        setSelectedEdificioCreate(null);
        setSelectedSedeCreate(null);
        setEdificios([]);
        form.resetFields();
    }}
    footer={null}
  >
    <Form layout="vertical" form={form} onFinish={(values) =>{createLugar(values); form.resetFields()}}>
      <div className="flex items-center justify-between gap-1">
        <Form.Item
            className="flex-1"
            name="name"
            label="Nombre del lugar"
            rules={[{ required: true, message: "Ingrese el nombre" }]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            className="mt-7"
            name="is_classroom"
            valuePropName="checked"
        >
            <Checkbox>¿Es un aula de clase?</Checkbox>
        </Form.Item>
      </div>
      <Form.Item
        label="Seleccione la sede"
        name="basement"
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
      <Form.Item
        label="Seleccione el edificio"
        name="building"
        rules={[{ required: true, message: "Seleccione un edificio" }]}
      >
        <Select
          placeholder="Selecciona un edificio"
          disabled={edificios.length <= 0}
          onChange={(id) => setSelectedEdificioCreate(id)}
          value={selectedEdificioCreate}
        >
          {edificios.map((e) => (
            <Select.Option key={e.id} value={e.id}>
              {e.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit" block>Crear</Button>
    </Form>
  </Modal>
    );
};

export default AddPlace;