import { useState } from "react";
import { Calendar, Card, Typography, Tag, Modal, List } from "antd";
import dayjs from "dayjs";

const { Title } = Typography;

function MyCalendar() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [modalVisible, setModalVisible] = useState(false);
  const [dayEvents, setDayEvents] = useState([]);

  // Ejemplo de eventos ocupados (puedes reemplazar con datos de tu backend)
  const events = {
    "2025-08-18": [
      { time: "09:00 - 10:00", title: "Reunión de equipo" },
      { time: "15:00 - 16:00", title: "Clase universitaria" },
    ],
    "2025-08-19": [
      { time: "11:00 - 12:00", title: "Consulta médica" },
    ],
  };

  // Render de los días con horarios ocupados
  const dateCellRender = (date) => {
    const formattedDate = date.format("YYYY-MM-DD");
    const dayEvents = events[formattedDate] || [];
    return (
      <ul className="list-none p-0 m-0">
        {dayEvents.map((item, index) => (
          <li key={index}>
            <Tag color="blue" className="m-0 text-xs">
              {item.time}
            </Tag>
          </li>
        ))}
      </ul>
    );
  };

  // Cuando se selecciona un día
  const onSelect = (date) => {
    setSelectedDate(date);
    const formattedDate = date.format("YYYY-MM-DD");
    setDayEvents(events[formattedDate] || []);
    setModalVisible(true);
  };

  return (
    <div className="w-full h-full flex justify-center items-center p-6">
      <Card
        title={<Title level={2} className="!font-bold !text-blue-900 m-3">Calendario de Eventos</Title>}
        bordered
        style={{
          width: "100%",
          maxWidth: 1200,
            borderRadius: "16px",
        }}
      >
        <Calendar
          fullscreen
          value={selectedDate}
          onSelect={onSelect}
          dateCellRender={dateCellRender}
        />
      </Card>

      {/* Modal para mostrar los horarios del día */}
      <Modal
        title={<Title level={4} className="!font-extrabold !text-blue-900">Horarios del {selectedDate.format("DD/MM/YYYY")}</Title> }
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
                    <span className="text-sm text-gray-500 font-semibold">Horario</span>
                    <span className="text-lg font-bold text-blue-700">{item.time}</span>
                    </div>
                    <div className="flex-1 ml-6">
                    <span className="text-base font-semibold text-gray-800">{item.title}</span>
                    </div>
                </div>
                </List.Item>
            )}
          />
        ) : (
          <p className="mt-5">No hay horarios ocupados este día.</p>
        )}
      </Modal>
    </div>
  );
}

export default MyCalendar;
