import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Select,
  Card,
  Modal,
  Typography,
  List,
} from "antd";
import supabaseClient from "../utils/supabase";
import AddBasement from "../modals/AddBasement";
import AddBuilding from "../modals/AddBuilding";
import AddPlace from "../modals/AddPlace";
import DeleteBasement from "../modals/DeleteBasement";
import DeleteBuilding from "../modals/DeleteBuilding";
import DeletePlace from "../modals/DeletePlace";

const { Title } = Typography;

function Admin() {
  const [sedes, setSedes] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [lugares, setLugares] = useState([]);


  // Estados modales
  const [isSedeModalOpen, setSedeModalOpen] = useState(false);
  const [isEdificioModalOpen, setEdificioModalOpen] = useState(false);
  const [isLugarModalOpen, setLugarModalOpen] = useState(false);
  const [isSedeDeleteModalOpen, setSedeDeleteModalOpen] = useState(false);
  const [isEdificioDeleteModalOpen, setEdificioDeleteModalOpen] = useState(false);
  const [isLugarDeleteModalOpen, setLugarDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchSedes();
    fetchEdificios();
    fetchLugares();
  }, []);

  // ------------------ FETCH ------------------
  const fetchSedes = async () => {
    const { data, error } = await supabaseClient.from("basement").select("*").eq('state',true);
    if (!error) setSedes(data);
  };

  const fetchEdificios = async () => {
    const { data, error } = await supabaseClient.from("building").select("id,name,basement(name)").eq('state',true);
    if (!error) setEdificios(data);
  };

  const fetchLugares = async () => {
    const { data, error } = await supabaseClient.from("place").select("id,name,building(name)").eq('state',true);
    if (!error) setLugares(data);
  };

  // ------------------ CREAR ------------------
  const createSede = async (values) => {
    await supabaseClient.from("basement").insert([{ name: values.name }]);
    fetchSedes();
    setSedeModalOpen(false);
  };

  const createEdificio = async (values,selectedSedeCreate) => {
    if (!selectedSedeCreate) return;
    await supabaseClient
      .from("building")
      .insert([{ name: values.name, id_basement: selectedSedeCreate }]);
    fetchEdificios();
    setEdificioModalOpen(false);
  };

  const createLugar = async (values) => {
    await supabaseClient
      .from("place")
      .insert([{ name: values.name, id_building: values.building, is_classroom: values.is_classroom }]);
    fetchLugares();
    setLugarModalOpen(false);
  };

  // ------------------ CREAR ------------------
  const eliminarSede = async(selectedSede)=>{
    if (!selectedSede) return;
    console.log(selectedSede);
    const {error} = await supabaseClient.from('basement').update({state: false}).eq('id',selectedSede);
    fetchSedes();
    fetchEdificios();
    fetchLugares();
  };

  const eliminarEdificio = async(selectedEdificio)=>{
    if (!selectedEdificio) return;
    const {error} = await supabaseClient.from('building').update({state: false}).eq('id',selectedEdificio);
    fetchEdificios();
    fetchLugares();
  };

  const eliminarLugar =async(selectedLugar)=>{
    if (!selectedLugar) return;
    const {error} = await supabaseClient.from('place').update({state: false}).eq('id',selectedLugar);
    fetchLugares();
  };

  return (
    <div className="p-5 space-y-10" style={{ fontFamily: "Poppins, sans-serif" }}>
      <div className="flex flex-col border-b">
        <h1 className="text-blue-800 font-semibold text-xl md:text-3xl mb-3">
          Gestión de Sedes, Edificios y Lugares
        </h1>
      </div>

      {/* SEDE */}
      <Card
        title="Sedes"
        extra={<div className="flex justify-between gap-2">
        <Button className="w-auto h-[24px] md:h-[30px] text-[10px] md:text-sm" type="primary" onClick={() => setSedeModalOpen(true)}>Crear Sede</Button>
        <Button className="w-auto h-[24px] md:h-[30px] text-[10px] md:text-sm bg-red-600 hover:!bg-red-500 hover:!border-red-600" type="primary" onClick={() => setSedeDeleteModalOpen(true)}>Eliminar Sede</Button>
        </div>
        }
      >
        <div className="overflow-y-auto max-h-32 md:max-h-64">
          <List
            bordered
            dataSource={sedes}
            renderItem={(item) => <List.Item>{item.name}</List.Item>}
          />
        </div>
      </Card>

      {/* EDIFICIOS */}
      <Card
        title="Edificios"
        extra={<div className="justify-between flex items-center gap-2">
          <Button className="w-auto h-[24px] md:h-[30px] text-[10px] md:text-sm" type="primary" onClick={() => setEdificioModalOpen(true)}>Crear Edificio</Button>
          <Button className="w-auto h-[24px] md:h-[30px] text-[10px] md:text-sm bg-red-600 hover:!bg-red-500 hover:!border-red-600" type="primary" onClick={() => setEdificioDeleteModalOpen(true)}>Eliminar Edificio</Button>
        </div>}
      >
        <div className="overflow-y-auto max-h-32 md:max-h-64">
          <List
            bordered
            dataSource={edificios}
            renderItem={(item) => (
              <List.Item>
                {item.name} <span className="text-gray-400"> ({item.basement.name})</span>
              </List.Item>
            )}
          />
        </div>
      </Card>

      {/* LUGARES */}
      <Card
        className="overflow-y-auto"
        title="Lugares"
        extra={
        <div className="flex justify-between gap-2">
          <Button className="w-auto h-[24px] md:h-[30px] text-[10px] md:text-sm" type="primary" onClick={() => setLugarModalOpen(true)}>Crear Lugar</Button>
          <Button className="w-auto h-[24px] md:h-[30px] text-[10px] md:text-sm bg-red-600 hover:!bg-red-500 hover:!border-red-600"type="primary" onClick={() => setLugarDeleteModalOpen(true)}>Eliminar Lugar</Button>
        </div>
        }
      >
        <div>
          <List
          bordered
          dataSource={lugares}
          renderItem={(item) => (
            <List.Item>
              {item.name} <span className="text-gray-400">({item.building.name})</span>
            </List.Item>
          )}
          />
        </div>
      </Card>

      {/* ------------------ MODALES ------------------ */}
      <AddBasement setSedeOpen={setSedeModalOpen} createSede={createSede} isSedeModalOpen={isSedeModalOpen}/>
      <AddBuilding sedes={sedes} setEdificioModalOpen={setEdificioModalOpen} createEdificio={createEdificio} isEdificioModalOpen={isEdificioModalOpen}/>
      <AddPlace isLugarModalOpen={isLugarModalOpen} setLugarModalOpen={setLugarModalOpen} createLugar={createLugar} sedes={sedes}/>
      <DeleteBasement onDelete={eliminarSede} isDeleteModalOpen={isSedeDeleteModalOpen} setDeleteModalOpen={setSedeDeleteModalOpen} sedes={sedes}/>
      <DeleteBuilding deleteEdificio={eliminarEdificio} isDeleteModalOpen={isEdificioDeleteModalOpen} setDeleteModalOpen={setEdificioDeleteModalOpen} sedes={sedes}/>
      <DeletePlace isDeleteModalOpen={isLugarDeleteModalOpen} setDeleteModalOpen={setLugarDeleteModalOpen} deleteLugar={eliminarLugar}/>
    </div>
  );
}

export default Admin;
