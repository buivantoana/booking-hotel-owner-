import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useBookingContext } from "../App";
import RegisterController from "../pages/register/RegisterController";
import LoginController from "../pages/login/LoginController";

import LayoutWebsite from "../components/layouts/LayoutWebsite";
import PrivateRouter from "../components/PrivateRouter";
import GuestRoute from "../components/GuestRoute";
import { useEffect } from "react";
import CreateHotelController from "../pages/create_hotel/CreateHotelController";

const Router = () => {
  const context: any = useBookingContext();
  const { pathname } = useLocation();
  useEffect(() => {
    // window.scrollTo(0, 0);
    // hoặc mượt hơn:
     window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return (
    <>
      <Routes>
        <Route path='/' element={<LayoutWebsite />}>
          <Route path='/' element={<GuestRoute ><RegisterController /></GuestRoute>} />
          <Route path='/create-hotel' element={<CreateHotelController />} />
          
          <Route path='/login' element={<GuestRoute ><LoginController /></GuestRoute>} />
        </Route>
        
      </Routes>
    </>
  );
};

export default Router;
