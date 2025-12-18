import React, { useEffect, useState } from "react";
import ReviewView from "./ReviewView";
import { getHotelReview, getHotels } from "../../service/hotel";

type Props = {};

const ReviewController = (props: Props) => {
  const [hotels, setHotels] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [idHotel, setIdHotel] = useState(null);
  useEffect(() => {
    getListHotel()
  }, [])

  useEffect(() => {
    if(idHotel){
      getReview()
    }
  }, [idHotel])

  const getReview =async () => {
    try {
      let result = await getHotelReview(idHotel)
      if(result?.reviews){
        setReviews(result?.reviews)
      }
    } catch (error) {
      console.log(error)
    }
  }
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
  return <ReviewView  
  hotels={hotels}
  idHotel={idHotel}
  setIdHotel={setIdHotel}
  reviews={reviews}
  getReview={getReview}
  />;
};

export default ReviewController;
