import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from '@monsonjeremy/react-leaflet'
import { RecyclingSpot } from '../types/objects'

type Props = {
  mapCenter: [number, number],
  recyclingSpots: RecyclingSpot[]
}

const Map: React.FC<Props> = ({ mapCenter, recyclingSpots }) => {
  const Markers = () => {
    if (!recyclingSpots || recyclingSpots.length === 0) {
      return null
    }
    return (
      <>
        {recyclingSpots.map(spot => (
          <Marker position={[spot.geometry.coordinates[1],spot.geometry.coordinates[0]]} key={spot.spot_id}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
        ))}
        )
      </>
    )
  }

  return (
    <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Markers />
    </MapContainer>
  )
}

export default Map