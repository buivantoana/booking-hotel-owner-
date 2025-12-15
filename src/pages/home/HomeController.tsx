import React, { useEffect, useState } from "react";
import HomeView from "./HomeView";
import dayjs from "dayjs";
import { getEventMonth, getGeneralStats, getGeneralWeek, getGeneralWeekRoomType } from "../../service/hotel";

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
  const [dateRangeRevenueEvent, setDateRangeRevenueEvent] = useState({
    mode: "week",
    checkIn: dayjs().startOf("isoWeek"),
    checkOut: dayjs().endOf("isoWeek"),
  });
  const [dateRangeRevenueEventView, setDateRangeRevenueEventView] = useState({
    mode: "week",
    checkIn: dayjs().startOf("isoWeek"),
    checkOut: dayjs().endOf("isoWeek"),
  });
  const [roomTypeGeneral, setRoomTypeGeneral] = useState('all');
  const [dataGeneral, setDataGeneral] = useState({});
  const [dataGeneralMethod, setDataGeneralMethod] = useState([]);
  const [dataGeneralRoomType, setDataGeneralRoomType] = useState({});
  const [dataEventVisit, setDataEventVisit] = useState({});
  const [dataEventView, setDataEventView] = useState({});
  useEffect(() => {
    getGeneral();
  }, [dateRange]);
  useEffect(() => {
    getGeneralMethod();
  }, [dateRangeRevenueMethod]);
  useEffect(() => {
    getGeneralRoomTypeWeek();
  }, [roomTypeGeneral]);
  useEffect(() => {
    getEnventVisitMonth();
  }, [dateRangeRevenueEvent]);
  useEffect(() => {
    getEnventViewMonth();
  }, [dateRangeRevenueEventView]);
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
  const getGeneralMethod = async () => {
    try {
      let params = new URLSearchParams({
        start_time: dateRangeRevenueMethod.checkIn
          .hour(0)
          .minute(0)
          .second(0)
          .format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: dateRangeRevenueMethod.checkOut
          .hour(23)
          .minute(59)
          .second(59)
          .format("YYYY-MM-DDTHH:mm:ssZ"),
          rent_type: "all",
      });

      let result = await getGeneralWeek("4kJ8wQz9aB2L", params);
      if (result?.revenue_by_method) {
        setDataGeneralMethod(result?.revenue_by_method);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getGeneralRoomTypeWeek = async () => {
    try {
      let result = {
        start:[],
        end:[]
      }
      const startOfLastWeek = dayjs().subtract(1, 'week').startOf('isoWeek'); // Thứ 2 tuần trước
    const endOfLastWeek = dayjs().subtract(1, 'week').endOf('isoWeek');     // Chủ nhật tuần trước

    let params_start = new URLSearchParams({
      start_time: startOfLastWeek.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
      end_time: endOfLastWeek.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
      rent_type: roomTypeGeneral,
    });

    // === TUẦN NÀY ===
    const startOfThisWeek = dayjs().startOf('isoWeek'); // Thứ 2 tuần này
    const endOfThisWeek = dayjs().endOf('isoWeek');     // Chủ nhật tuần này
    // Nếu muốn chỉ lấy đến ngày hiện tại (thay vì cả chủ nhật tương lai), dùng dòng dưới:
    // const endOfThisWeek = dayjs().hour(23).minute(59).second(59);

    let params_end = new URLSearchParams({
      start_time: startOfThisWeek.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
      end_time: endOfThisWeek.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
      rent_type: roomTypeGeneral,
    });

      let result_start = await getGeneralWeekRoomType("4kJ8wQz9aB2L", params_start);
      if (result_start?.revenue_by_day) {
        result.start = (result_start?.revenue_by_day);
      }
      let result_end = await getGeneralWeekRoomType("4kJ8wQz9aB2L", params_end);
      if (result_end?.revenue_by_day) {
        result.end =result_end?.revenue_by_day ;
      }
      setDataGeneralRoomType(result)
    } catch (error) {
      console.log(error);
    }
  };

  const getEnventVisitMonth = async () => {
    try {
      let result = { start: [], end: [] };
  
      let startPrev, endPrev, startCurrent, endCurrent;
  
      if (dateRangeRevenueEvent.mode === "week") {
        // ===== TUẦN =====
        startPrev = dayjs().subtract(1, "week").startOf("isoWeek");
        endPrev   = dayjs().subtract(1, "week").endOf("isoWeek");
  
        startCurrent = dayjs().startOf("isoWeek");
        endCurrent   = dayjs().endOf("isoWeek");
      }
  
      if (dateRangeRevenueEvent.mode === "month") {
        // ===== THÁNG =====
        startPrev = dayjs().subtract(1, "month").startOf("month");
        endPrev   = dayjs().subtract(1, "month").endOf("month");
  
        startCurrent = dayjs().startOf("month");
        endCurrent   = dayjs().endOf("month");
      }
  
      const params_start = new URLSearchParams({
        start_time: startPrev.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endPrev.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "visit",
      });
  
      const params_end = new URLSearchParams({
        start_time: startCurrent.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endCurrent.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "visit",
      });
  
      const result_start = await getEventMonth("4kJ8wQz9aB2L", params_start);
      if (result_start?.daily) result.start = result_start.daily;
  
      const result_end = await getEventMonth("4kJ8wQz9aB2L", params_end);
      if (result_end?.daily) result.end = result_end.daily;
  
      setDataEventVisit(result);
    } catch (error) {
      console.log(error);
    }
  };
  const getEnventViewMonth = async () => {
    try {
      let result = { start: [], end: [] };
  
      let startPrev, endPrev, startCurrent, endCurrent;
  
      if (dateRangeRevenueEvent.mode === "week") {
        // ===== TUẦN =====
        startPrev = dayjs().subtract(1, "week").startOf("isoWeek");
        endPrev   = dayjs().subtract(1, "week").endOf("isoWeek");
  
        startCurrent = dayjs().startOf("isoWeek");
        endCurrent   = dayjs().endOf("isoWeek");
      }
  
      if (dateRangeRevenueEvent.mode === "month") {
        // ===== THÁNG =====
        startPrev = dayjs().subtract(1, "month").startOf("month");
        endPrev   = dayjs().subtract(1, "month").endOf("month");
  
        startCurrent = dayjs().startOf("month");
        endCurrent   = dayjs().endOf("month");
      }
  
      const params_start = new URLSearchParams({
        start_time: startPrev.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endPrev.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "visit",
      });
  
      const params_end = new URLSearchParams({
        start_time: startCurrent.hour(0).minute(0).second(0).format("YYYY-MM-DDTHH:mm:ssZ"),
        end_time: endCurrent.hour(23).minute(59).second(59).format("YYYY-MM-DDTHH:mm:ssZ"),
        event_type: "visit",
      });
  
      const result_start = await getEventMonth("4kJ8wQz9aB2L", params_start);
      if (result_start?.daily) result.start = result_start.daily;
  
      const result_end = await getEventMonth("4kJ8wQz9aB2L", params_end);
      if (result_end?.daily) result.end = result_end.daily;
  
      setDataEventView(result);
    } catch (error) {
      console.log(error);
    }
  };
  
  console.log("AAAA dateRangeRevenueMethod",dateRangeRevenueMethod)
  console.log("AAA dataGeneralMethod",dataGeneralMethod)
  console.log("AAA dataGeneralRoomType",dataGeneralRoomType)
  console.log("AAA dataEventVisit",dataEventVisit)
  return (
    <HomeView
      setDateRange={setDateRange}
      dataGeneral={dataGeneral}
      dateRange={dateRange}
      setDateRangeRevenueMethod={setDateRangeRevenueMethod}
      dateRangeRevenueMethod={dateRangeRevenueMethod}
      dataGeneralMethod={dataGeneralMethod}
      setRoomTypeGeneral={setRoomTypeGeneral}
      roomTypeGeneral={roomTypeGeneral}
      dataGeneralRoomType={dataGeneralRoomType}
      setDateRangeRevenueEvent={setDateRangeRevenueEvent}
      dateRangeRevenueEvent={dateRangeRevenueEvent}
      setDateRangeRevenueEventView={setDateRangeRevenueEventView}
      dateRangeRevenueEventView={dateRangeRevenueEventView}
      dataEventView={dataEventView}
      dataEventVisit={dataEventVisit}
    />
  );
};

export default HomeController;
