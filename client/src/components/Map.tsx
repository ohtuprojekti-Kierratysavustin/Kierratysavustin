import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from '@monsonjeremy/react-leaflet'
import { RecyclingSpot } from '../types/objects'

type Props = {
  mapCenter: [number, number],
  recyclingSpots: RecyclingSpot[]
}

const Map: React.FC<Props> = ({ mapCenter, recyclingSpots }) => {
  // nää pitäisi jotenkin parsia
  console.log(recyclingSpots.length)
  return (
    <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true}>
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
  )
}

export default Map