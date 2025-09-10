import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import supabaseClient from "../utils/supabase";
import { Calendar, Card, Typography, Tag, Modal, List, Select, Spin,Button} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

function MyCalendar() {
  const token = Cookies.get("user_email");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [dayEvents, setDayEvents] = useState([]);
  const [events, setEvents] = useState({});
  const [sedes, setSedes] = useState([]);
  const [sede, setSede] = useState();
  const [role,setRole] = useState();
  const [loading, setLoading] = useState(true);

  // 🔹 Traer sedes y sede del usuario
  const fetchSedesAndUser = async () => {
    const { data: sedesData } = await supabaseClient.from("basement").select("*");
    setSedes(sedesData || []);

    const { data: userData } = await supabaseClient
      .from("users")
      .select("id_basement,role")
      .eq("uuid", token)
      .single();
    setRole(userData?.role || null);
    setSede(userData?.id_basement || null);
  };

  // 🔹 Traer eventos de calendar
  const fetchEvents = async () => {
    if (!sede) return;
    setLoading(true);
    const { data, error } = await supabaseClient
      .from("calendar")
      .select(`
        id,
        date,
        start_at,
        end_at,
        place(
          id,
          name,
          building(id,name, id_basement)
        )
      `)
      .eq("approved", true)
      .eq("place.building.id_basement", sede);
    if (error) {
      console.error(error);
      setEvents({});
    } else {
      // Convertir a objeto por fecha
      const grouped = {};
      (data || []).forEach((item) => {
        const dateKey = dayjs(item.date).format("YYYY-MM-DD");
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push({
          ...item,
          time: `${item.start_at} - ${item.end_at}`,
          title: item.place?.name || "Lugar desconocido",
        });
      });
      setEvents(grouped);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSedesAndUser();
  }, []);

  useEffect(() => {
    if (sede) fetchEvents();
  }, [sede]);

  // 🔹 Obtener eventos para una fecha
  const getEventsForDate = (date) => {
    const key = date.format("YYYY-MM-DD");
    return events[key] || [];
  };

  const dateCellRender = (date) => {
    const dayEvents = getEventsForDate(date);
    return (
      <ul className="font-[Poppins] list-none p-0 m-0">
        {dayEvents.map((item, index) => (
          <li key={index}>
            <Tag color="blue" className="font-[Poppins] m-0 text-xs">
              {item.time}
            </Tag>
          </li>
        ))}
      </ul>
    );
  };

  const handleSelect = (date) => {
    setSelectedDate(date);
    setDayEvents(getEventsForDate(date));
    setModalVisible(true);
  };

  const handlePrevMonth = () => setSelectedDate(selectedDate.subtract(1, "month"));
  const handleNextMonth = () => setSelectedDate(selectedDate.add(1, "month"));

  return (
    <div className="!font-[Poppins] w-full h-full flex justify-center items-center p-6">
      <Card
        title={
          <Title level={2} className="!font-[Poppins] !font-bold !text-blue-900 mt-5">
            Calendario de Eventos
          </Title>
        }
        bordered
        style={{ width: "100%", maxWidth: 1200, borderRadius: "16px" }}
      >
        {/* 🔹 Select de sede */}
        <div className="mb-4">
          <Select value={sede} style={{ width: 220 }} disabled={role !== "CREADOR"}>
            {sedes.map((s) => (
              <Select.Option key={s.id} value={s.id}>
                {s.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Cargando eventos..." />
          </div>
        ) : (
          <Calendar
            className="font-[Poppins]"
            fullscreen
            value={selectedDate}
            onSelect={handleSelect}
            dateCellRender={dateCellRender}
            headerRender={() => {
              const month = selectedDate.format("MMMM");
              const year = selectedDate.format("YYYY");
              return (
                <div className="flex items-center justify-between px-4 py-2">
                  <Button type="text" icon={<LeftOutlined />} onClick={handlePrevMonth} />
                  <Title level={4} className="!font-[Poppins] !text-blue-900 m-0">
                    {month} {year}
                  </Title>
                  <Button type="text" icon={<RightOutlined />} onClick={handleNextMonth} />
                </div>
              );
            }}
          />
        )}
      </Card>

      {/* 🔹 Modal de eventos por día */}
      <Modal
        title={
          <Title level={4} className="!font-[Poppins] !font-extrabold !text-blue-900">
            Horarios del {selectedDate.format("DD/MM/YYYY")}
          </Title>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {dayEvents.length > 0 ? (
          <List
            dataSource={dayEvents}
            renderItem={(item) => (
              <List.Item className="!border-0 !p-0">
                <div className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-3 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col text-left">
                    <span className="font-[Poppins] text-sm text-gray-500 font-semibold">
                      Horario
                    </span>
                    <span className="text-lg font-bold font-[Poppins] text-blue-700">
                      {item.time}
                    </span>
                  </div>
                  <div className="flex-1 ml-6">
                    <span className="text-base font-[Poppins] font-semibold text-gray-800">
                      {item.title}
                    </span>
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <p className="font-[Poppins] mt-5">No hay horarios ocupados este día.</p>
        )}
      </Modal>
    </div>
  );
}

export default MyCalendar;
