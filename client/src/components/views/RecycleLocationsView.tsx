import React from 'react'
import InfoBar from '../InfoBar'
import { MapContainer, TileLayer, Marker, Popup } from '@monsonjeremy/react-leaflet'

// käyttäjän paikan haku:
//navigator.geolocation.getCurrentPosition((position) => {
//  console.log(position.coords.latitude, position.coords.longitude)
//})


const RecycleLocationsView = () => {
  return (
    <div>
      <InfoBar header={'Kierrätyspisteet'} text={'Tällä sivulla voit hakea kierrätyspisteitä paikkakunnan perusteella'} />

      {/* karttapohja, tulevaisuudessa omaan komponenttiin */}
      <MapContainer center={[60.207, 25.142]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}

export default RecycleLocationsView