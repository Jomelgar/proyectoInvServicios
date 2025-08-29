import { useState } from "react";
import { Calendar, Card, Typography, Tag, Modal, List, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [dayEvents, setDayEvents] = useState([]);

  // 🔹 Ejemplo de eventos (puedes reemplazar con los de tu backend)
  const events = {
    "2025-07-15": [{ time: "08:00 - 09:00", title: "Gimnasio" }],
    "2025-08-18": [
      { time: "09:00 - 10:00", title: "Reunión de equipo" },
      { time: "15:00 - 16:00", title: "Clase universitaria" },
    ],
    "2025-08-19": [{ time: "11:00 - 12:00", title: "Consulta médica" }],
  };

  // 🔹 Función para obtener eventos de una fecha
  const getEventsForDate = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    return events[formattedDate] || [];
  };

  // 🔹 Render de cada celda del calendario
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

  // 🔹 Cuando se selecciona una fecha
  const handleSelect = (date) => {
    setSelectedDate(date);
    setDayEvents(getEventsForDate(date));
    setModalVisible(true);
  };

  // 🔹 Navegar meses con flechas personalizadas
  const handlePrevMonth = () => setSelectedDate(selectedDate.subtract(1, "month"));
  const handleNextMonth = () => setSelectedDate(selectedDate.add(1, "month"));

  return (
    <div className="!font-[Poppins] w-full h-full flex justify-center items-center p-6">
      <Card
        title={
          <Title
            level={2}
            className="!font-[Poppins] !font-bold !text-blue-900 mt-5"
          >
            Calendario de Eventos
          </Title>
        }
        bordered
        style={{ width: "100%", maxWidth: 1200, borderRadius: "16px" }}
      >
        <Calendar
          className="font-[Poppins]"
          fullscreen // 👉 siempre en vista mes
          value={selectedDate}
          onSelect={handleSelect}
          dateCellRender={dateCellRender}
          headerRender={() => {
            const month = selectedDate.format("MMMM");
            const year = selectedDate.format("YYYY");
            return (
              <div className="flex items-center justify-between px-4 py-2">
                <Button
                  type="text"
                  icon={<LeftOutlined />}
                  onClick={handlePrevMonth}
                />
                <Title
                  level={4}
                  className="!font-[Poppins] !text-blue-900 m-0"
                >
                  {month} {year}
                </Title>
                <Button
                  type="text"
                  icon={<RightOutlined />}
                  onClick={handleNextMonth}
                />
              </div>
            );
          }}
        />
      </Card>

      {/* 🔹 Modal para mostrar eventos */}
      <Modal
        title={
          <Title
            level={4}
            className="!font-[Poppins] !font-extrabold !text-blue-900"
          >
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
          <p className="font-[Poppins] mt-5">
            No hay horarios ocupados este día.
          </p>
        )}
      </Modal>
    </div>
  );
}

export default MyCalendar;
