import React, { useEffect, useState } from 'react'
import ReconciliationView from './ReconciliationView'
import { getHotels } from '../../service/hotel';

type Props = {}

const ReconciliationController = (props: Props) => {
  const [hotels, setHotels] = useState([]);
  const [idHotel, setIdHotel] = useState(null);
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
  return (
    <ReconciliationView  hotels={hotels}
    idHotel={idHotel}
    setIdHotel={setIdHotel}/>
  )
}

export default ReconciliationController