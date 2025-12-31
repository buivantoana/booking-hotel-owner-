import React, { useEffect, useState } from "react";
import ReconciliationView from "./ReconciliationView";
import { getHotels, getMySettlements } from "../../service/hotel";

type Props = {};

const ReconciliationController = (props: Props) => {
  const [hotels, setHotels] = useState([]);
  const [dataSettlement, setDataSettlement] = useState([]);
  const [settlement, setSettlement] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  const [idHotel, setIdHotel] = useState(null); 
   const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    period_month: "",
    hotel_name: "",
    status: "all", // Thêm trạng thái nếu cần
  });
  useEffect(() => {
    fetchSettlements(1); // Reset về trang 1 khi đổi khách sạn
  }, []);

  const fetchSettlements = async (page: number = 1, filterParams = filters) => {
    setLoading(true)
    try {
      const queryParams = {
        ...pagination,
        page,
        ...filterParams,
      };
      delete queryParams.status
      if(filterParams?.status &&  filterParams?.status != "all"){
        queryParams.status = filterParams.status
      }
      // Loại bỏ các tham số rỗng
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === "" || queryParams[key] === null) {
          delete queryParams[key];
        }
      });

      const query = new URLSearchParams(queryParams).toString();
      const result = await getMySettlements(query);
      if(settlement){
        setSettlement(result.settlements?.find((item)=>item.id == settlement.id))
      }
      setDataSettlement(result.settlements || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        total_pages: result.total_pages || 1,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách đối soát:", error);
      setDataSettlement([]);
    }
    setLoading(false)
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    fetchSettlements(newPage);
  };

  // Hàm xử lý filter
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    fetchSettlements(1, newFilters); // Reset về trang 1 khi filter
  };

  // Hàm reset filter
  const handleResetFilter = () => {
    const resetFilters = {
      period_month: "",
      hotel_name: "",
      status: "all",
    };
    setFilters(resetFilters);
    fetchSettlements(1, resetFilters);
  };

  return (
    <ReconciliationView
      hotels={hotels}
      idHotel={idHotel}
      dataSettlement={dataSettlement}
      pagination={pagination}
      setSettlement={setSettlement}
      settlement={settlement}
      onPageChange={handlePageChange}
      fetchSettlements={fetchSettlements}
      setIdHotel={setIdHotel}
      filters={filters}
      onFilterChange={handleFilterChange}
      onResetFilter={handleResetFilter}
      loading={loading}
    />
  );
};

export default ReconciliationController;
