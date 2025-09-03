import { useState, useEffect } from "react";
import {Modal,Form, Select,Button} from "antd";

function DeleteCategories({isOpen, setOpen, categories,onDelete})
{
    const [form] = Form.useForm();
    return (
        <Modal
            className="font-[Poppins]"
            title="Eliminar Categoría"
            open={isOpen}
            onCancel={() => setOpen(false)}
            footer={null}    
        >
            <div className="w-full">
                <Form
                    className="w-full"
                    form={form}
                    layout="vertical"
                    onFinish={async(values) => {
                        await onDelete(values);
                        form.resetFields();
                        setOpen(false);
                    }}
                >
                <Form.Item
                    name="category"
                    label={<p className="font-[Poppins]">Categorías</p>}
                    rules={[{ required: true, message: "Seleccione una categoría" }]}
                >
                    <Select 
                    className="font-[Poppins]" 
                    placeholder="Seleccione una categoría"
                    onChange={(value) => console.log("ID seleccionado:", value)}
                    >
                    {categories.map((c) => (
                        <Select.Option key={c.id} value={c.id}>
                        {c.name}
                        </Select.Option>
                    ))}
                    </Select>
                </Form.Item>

                <Button className=" font-[Poppins] bg-red-500 hover:!border-red-400 hover:!bg-red-400"type="primary" htmlType="submit" block>Eliminar</Button>
                </Form>
            </div>
        </Modal>
    );
}

export default DeleteCategories;