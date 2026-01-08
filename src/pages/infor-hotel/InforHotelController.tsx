import React, { useEffect, useState } from "react";
import InforHotelView from "./InforHotelView";
import { getAttribute, getHotels, getLocations } from "../../service/hotel";

type Props = {};

const InforHotelController = (props: Props) => {
  const [hotels, setHotels] = useState([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [attribute, setAttribute] = useState({});
  useEffect(() => {
    getDataHotels();
  }, []);
  const getDataHotels = async () => {
    try {
      let result = await getHotels();
      if (result?.hotels) {
        setHotels(result?.hotels);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const resultAttribute = await getAttribute();
        setAttribute(resultAttribute);
        const result = await getLocations();
        // Giả sử API trả về { locations: [...] }
        if (result?.locations && Array.isArray(result.locations)) {
          setLocations(result.locations);
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
      }
    };

    fetchLocations();
  }, []);
  return (
    <InforHotelView
      hotels={hotels}
      locations={locations}
      getDataHotels={getDataHotels}
      attribute={attribute}
    />
  );
};

export default InforHotelController;
