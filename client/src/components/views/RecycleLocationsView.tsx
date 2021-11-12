import React from 'react'
import InfoBar from '../InfoBar'
import Map from '../Map'


// käyttäjän paikan haku:
//navigator.geolocation.getCurrentPosition((position) => {
//  console.log(position.coords.latitude, position.coords.longitude)
//})


const RecycleLocationsView = () => {
  return (
    <div>
      <InfoBar header={'Kierrätyspisteet'} text={'Tällä sivulla voit hakea kierrätyspisteitä paikkakunnan perusteella'} />
      <Map mapCenter={[60.150, 24.96]} recyclingSpots={[]} />
    </div>
  )
}

export default RecycleLocationsView