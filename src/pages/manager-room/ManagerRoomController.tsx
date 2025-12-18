import React, { useEffect, useState } from "react";
import ManagerRoomView from "./ManagerRoomView";
import dayjs from "dayjs";
import {
  getHotels,
  getInventoryHotelDaily,
  getInventoryHotelHourly,
  getInventoryHotelOvernight,
} from "../../service/hotel";
import { formatDateWithTimezone } from "../../utils/utils";

type Props = {};

const ManagerRoomController = (props: Props) => {
  const [active, setActive] = useState("hourly");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [idHotel, setIdHotel] = useState(null);
  const [dateRange, setDateRange] = useState({
    checkIn: dayjs(),
    checkOut: dayjs().add(1, "day"),
  });

  useEffect(() => {
    if(idHotel){
      getData();

    }
  }, [dateRange,active,idHotel]);
  const getData = async () => {
    setLoading(true);
    try {
      let result;
      let params = new URLSearchParams({
        start_time: dateRange.checkIn.format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: dateRange.checkOut.format("YYYY-MM-DDTHH:mm:ssZ"),
        room_type_id: "lD49C0cWJAUw",
      });

      if (active == "hourly") {
        result = await getInventoryHotelHourly("4kJ8wQz9aB2L", params);
      }
      if (active == "daily") {
        result = await getInventoryHotelDaily("4kJ8wQz9aB2L", params);
      }
      if (active == "overnight") {
        result = await getInventoryHotelOvernight("4kJ8wQz9aB2L", params);
      }
      setData(result);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  useEffect(() => {
    getListHotel()
  }, [])
  const getListHotel = async () => {
    try {
      let result = await getHotels();
      if (result?.hotels) {
        setIdHotel(result?.hotels[0]?.id)
        setHotels(result?.hotels)
      }
    } catch (error) {

    }
  }
  console.log("AAAA data",data)
  return (
    <ManagerRoomView
      setActive={setActive}
      active={active}
      dateRange={dateRange}
      setDateRange={setDateRange}
      loading={loading}
      data={data}
    />
  );
};

export default ManagerRoomController;
