import React, { useEffect, useState } from "react";
import HomeView from "./HomeView";
import dayjs from "dayjs";
import { getGeneralStats } from "../../service/hotel";

type Props = {};

const HomeController = (props: Props) => {
  const [dateRange, setDateRange] = useState({
    checkIn: dayjs(),
    checkOut: dayjs().add(1, "day"),
  });
  const [dateRangeRevenueMethod, setDateRangeRevenueMethod] = useState({
    mode: "week",
    checkIn: dayjs().startOf("isoWeek"),
    checkOut: dayjs().endOf("isoWeek"),
  });

  const [dataGeneral, setDataGeneral] = useState({});
  useEffect(() => {
    getGeneral();
  }, [dateRange]);
  const getGeneral = async () => {
    try {
      let params = new URLSearchParams({
        start_time: dateRange.checkIn
          .hour(0)
          .minute(0)
          .second(0)
          .format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: dateRange.checkOut
          .hour(23)
          .minute(59)
          .second(59)
          .format("YYYY-MM-DDTHH:mm:ssZ"),
        room_type_id: "lD49C0cWJAUw",
      });

      let result = await getGeneralStats("4kJ8wQz9aB2L", params);
      if (result?.hourly) {
        setDataGeneral(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <HomeView
      setDateRange={setDateRange}
      dataGeneral={dataGeneral}
      dateRange={dateRange}
      setDateRangeRevenueMethod={setDateRangeRevenueMethod}
      dateRangeRevenueMethod={dateRangeRevenueMethod}
    />
  );
};

export default HomeController;
