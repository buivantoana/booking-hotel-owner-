// ManagerBookingController.tsx
import React, { useEffect, useState } from "react";
import ManagerBookingView from "./ManagerBookingView";
import { getHotels } from "../../service/hotel";
import { listBooking } from "../../service/booking";

const ManagerBookingController = () => {
  const [hotels, setHotels] = useState([]);
  const [idHotel, setIdHotel] = useState<string | null>(null);

  // State cho booking và phân trang
  const [bookings, setBookings] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });
  const [loading, setLoading] = useState(false);

  // Lấy danh sách khách sạn
  useEffect(() => {
    const getListHotel = async () => {
      try {
        const result = await getHotels();
        if (result?.hotels && result.hotels.length > 0) {
          setHotels(result.hotels);
          setIdHotel(result.hotels[0].id); // Chọn khách sạn đầu tiên mặc định
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách khách sạn:", error);
      }
    };
    getListHotel();
  }, []);

  // Gọi API lấy booking khi idHotel thay đổi hoặc page thay đổi
  const fetchBookings = async (hotelId: string, page: number = 1) => {
    if (!hotelId) return;
    setLoading(true);
    try {
      const result = await listBooking(hotelId);
      // Giả sử API trả về cấu trúc như mẫu bạn cung cấp
      setBookings(result.bookings || []);
      setPagination({
        page: result.page || 1,
        limit: result.limit || 10,
        total: result.total || 0,
        total_pages: result.total_pages || 1,
      });
    } catch (error) {
      console.error("Lỗi lấy danh sách booking:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Khi chọn khách sạn mới
  useEffect(() => {
    if (idHotel) {
      fetchBookings(idHotel, 1); // Reset về trang 1 khi đổi khách sạn
    }
  }, [idHotel]);

  // Xử lý đổi trang
  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    if (idHotel) {
      
      fetchBookings(idHotel, newPage);
    }
  };

  return (
    <ManagerBookingView
      hotels={hotels}
      idHotel={idHotel}
      setIdHotel={setIdHotel}
      bookings={bookings}
      pagination={pagination}
      loading={loading}
      onPageChange={handlePageChange}
      fetchBookings={fetchBookings}
    />
  );
};

export default ManagerBookingController;