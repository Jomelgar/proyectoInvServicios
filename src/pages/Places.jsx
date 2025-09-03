// src/pages/Places.jsx
import { useState, useEffect } from "react";
import { Pagination, Spin, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import supabase from "../utils/supabase";
import Cookies from "js-cookie";
import CardEspacio from "../components/SpaceCard";

const { Title } = Typography;

function Places() {
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // cantidad de cards por página

  const fetchPlaces = async () => {
    setLoading(true);

    try {
      // Obtener el basement del usuario según su cookie
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id_basement")
        .eq("uuid", Cookies.get("user_email"))
        .single();

      if (userError || !userData)
        throw userError || new Error("Usuario no encontrado");

      const userBasementId = userData.id_basement;

      // Traer lugares filtrados por basement del usuario
      const { data, error } = await supabase
        .from("place")
        .select(`
          id,
          name,
          id_building,
          is_classroom,
          state,
          building(id_basement, name),
          place_category(category(name))
        `)
        .eq("state", true)
        .eq("building.id_basement", userBasementId);

      if (error) throw error;

      const formatted = data.map((place) => ({
        ...place,
        categoria: place.place_category
          ? place.place_category.map((pc) => pc.category.name)
          : [],
      }));

      setPlaces(formatted);
    } catch (err) {
      console.error("Error fetching places:", err);
      setPlaces([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  // Paginación
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPlaces = places.slice(startIndex, endIndex);

  return (
    <div className="p-4 font-[Poppins]">
      {/* Título */}
      <div className="flex justify-between items-center mb-6 flex-wrap border-b">
        <Title level={1} className="font-[Poppins] !text-blue-800">
          Lugares
        </Title>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <CardEspacio
            espacios={paginatedPlaces}
            onReservar={(id) => navigate(`/reservar/${id}`)}
          />

          {places.length > pageSize && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={places.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Places;
