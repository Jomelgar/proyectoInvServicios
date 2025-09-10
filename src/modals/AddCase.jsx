import { Modal, Form, Button, Input, message, Row, Col, DatePicker, TimePicker } from "antd";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import supabase from "../utils/supabase";

function AddCase({ isOpen, setOpen, placeId }) {
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchPlace = async () => {
    const { data, error } = await supabase
      .from("place")
      .select(
        `id,
        name,
        id_building,
        is_classroom,
        state,
        building(id_basement,name),
        place_category(category(name))`
      )
      .eq("id", placeId)
      .single();

    if (error) {
      message.error("Error al cargar el lugar");
    } else if (data) {
      setPlace(data);
    }
  };

  useEffect(() => {
    if (placeId) fetchPlace();
  }, [placeId]);

const handleSubmit = async (values) => {
  try {
    setLoading(true);

    // Buscar al usuario
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("uuid", Cookies.get("user_email"))
      .single();
    if (userError || !user) {
      message.error("No se encontró el usuario");
      return;
    }

    // 1️⃣ Verificar choques de horarios en calendar
    const { data: conflicts, error: conflictError } = await supabase
      .from("calendar")
      .select("id, start_at, end_at")
      .eq("date", values.day?.format("YYYY-MM-DD"))
      .eq("approved", true)
      .eq("id_place", placeId)
      .gt("end_at",  values.start_schedule?.format("HH:mm"))
      .lt("start_at",  values.end_schedule?.format("HH:mm"));
    console.log(conflictError);
    if (conflictError) {
      message.error("Error al verificar horarios");
      return;
    }

    if (conflicts && conflicts.length > 0) {
      message.error("Ya existe un evento en este horario");
      return;
    }

    // 2️⃣ Insertar el caso y recuperar id
    const { data: caseData, error: caseError } = await supabase
      .from("case")
      .insert([
        {
          title: values.title,
          description: values.description,
          id_place: placeId,
          id_user: user.id,
        },
      ])
      .select("id")
      .single();

    if (caseError || !caseData) {
      message.error("Error al crear el caso");
      return;
    }

    // 3️⃣ Insertar en calendar con el id_case correcto
    const { error: calendarError } = await supabase.from("calendar").insert([
      {
        id_case: caseData.id,
        id_place: placeId,
        date: values.day?.format("YYYY-MM-DD"),
        start_at: values.start_schedule?.format("HH:mm"),
        end_at: values.end_schedule?.format("HH:mm"),
      },
    ]);

    if (calendarError) {
      message.error("Error al agregar al calendario");
      return;
    }

    // ✅ Todo bien
    message.success("Evento agregado correctamente");
    form.resetFields();
    setOpen(false);
  } catch (err) {
    console.error(err);
    message.error("No se pudo agregar el evento");
  } finally {
    setLoading(false);
  }
};


  return (
    <Modal
      title={
        <h1 className="text-xl md:text-2xl font-[Poppins] text-blue-600">
          Nuevo Evento {place ? `- ${place.name}` : ""}
        </h1>
      }
      open={isOpen}
      onCancel={() => {
        setOpen(false);
        form.resetFields();
      }}
      footer={null}
    >
      <Form
        form={form}
        className="font-[Poppins]"
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="title"
          label={<span className="font-[Poppins]">Título</span>}
          rules={[{ required: true, message: "El título es obligatorio" }]}
        >
          <Input
            placeholder="Título"
            className="font-[Poppins] border-blue-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </Form.Item>

        <Form.Item
          name="day"
          label={<span className="font-[Poppins]">Día</span>}
          rules={[{ required: true, message: "El día es obligatorio" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            className="w-full font-[Poppins] border-blue-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="start_schedule"
              label={<span className="font-[Poppins]">Empieza (Hora)</span>}
              rules={[{ required: true, message: "El horario de inicio es obligatorio" }]}
            >
              <TimePicker
                format="HH:mm"
                className="w-full font-[Poppins] border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="end_schedule"
              label={<span className="font-[Poppins]">Termina (Hora)</span>}
              rules={[{ required: true, message: "El horario de fin es obligatorio" }]}
            >
              <TimePicker
                format="HH:mm"
                className="w-full font-[Poppins] border-blue-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label={<span className="font-[Poppins]">Descripción</span>}
          rules={[{ required: true, message: "La descripción es obligatoria" }]}
        >
          <Input.TextArea
            placeholder="Descripción..."
            rows={4}
            className="font-[Poppins] border-blue-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </Form.Item>

        <div className="flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="!bg-blue-600 hover:!bg-blue-700 !border-none font-[Poppins] rounded-lg"
          >
            Enviar
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddCase;
