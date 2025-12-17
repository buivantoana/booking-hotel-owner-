import React, { useEffect, useState } from "react";
import InforHotelView from "./InforHotelView";
import { getHotels } from "../../service/hotel";

type Props = {};

const InforHotelController = (props: Props) => {
  const [hotels,setHotels] = useState([])
  useEffect(()=>{
    getDataHotels()
  },[])
  const getDataHotels =async () => {
    try {
      let result = await getHotels();
      if(result?.hotels){
        setHotels(result?.hotels)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return <InforHotelView hotels={hotels} getDataHotels={getDataHotels} />;
};

export default InforHotelController;
