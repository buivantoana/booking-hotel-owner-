import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useBookingContext } from "../App";
import RegisterController from "../pages/register/RegisterController";
import LoginController from "../pages/login/LoginController";

import LayoutWebsite from "../components/layouts/LayoutWebsite";
import PrivateRouter from "../components/PrivateRouter";
import GuestRoute from "../components/GuestRoute";
import { useEffect } from "react";
import CreateHotelController from "../pages/create_hotel/CreateHotelController";
import HomeController from "../pages/home/HomeController";
import ReviewController from "../pages/review/ReviewController";
import NotificateController from "../pages/notificate/NotificateController";
import ManagerRoomController from "../pages/manager-room/ManagerRoomController";
import InforHotelController from "../pages/infor-hotel/InforHotelController";
import ManagerBookingController from "../pages/manager-booking/ManagerBookingController";
import ReconciliationController from "../pages/reconciliation/ReconciliationController";

const Router = () => {
  const context: any = useBookingContext();
  const { pathname } = useLocation();
  useEffect(() => {
    // window.scrollTo(0, 0);
    // hoặc mượt hơn:
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return (
    <>
      <Routes>
        <Route path='/' element={<LayoutWebsite />}>
          <Route path='/home' element={<HomeController />} />
          <Route path='/notificate' element={<NotificateController />} />
          <Route path='/review' element={<ReviewController />} />
          <Route path='/manager-room' element={<ManagerRoomController />} />
          <Route path='/reconciliation' element={<ReconciliationController />} />
          <Route
            path='/manager-bookings'
            element={<ManagerBookingController />}
          />
          <Route path='/info-hotel' element={<InforHotelController />} />
        </Route>
        <Route path='/register' element={<RegisterController />} />
        <Route path='/create-hotel' element={<CreateHotelController />} />

        <Route path='/login' element={<LoginController />} />
      </Routes>
    </>
  );
};

export default Router;
