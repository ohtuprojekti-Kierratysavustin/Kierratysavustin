import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from '@monsonjeremy/react-leaflet'
import { RecyclingSpot } from '../types/objects'

type Props = {
  mapCenter: [number, number],
  recyclingSpots: RecyclingSpot[],
}

type CentererProps = {
  center: [number, number]
}
const Map: React.FC<Props> = ({ mapCenter, recyclingSpots }) => {

  const Markers = () => {
    if (!recyclingSpots || recyclingSpots.length === 0) {
      return null
    }
    return (
      <>
        {recyclingSpots.map(spot => {
          return (
            <Marker position={[spot.geometry.coordinates[1], spot.geometry.coordinates[0]]} key={spot.spot_id}>
              <Popup>
                <b><h6>{spot.name}</h6></b>
                {spot.operator} <br />
                {spot.address} <br /> <br />
                <b>Kohteessa kierrätettävät materiaalit:</b>
                {spot.materials.map(material => {
                  return (
                    <div key={1}>
                      {material.name} <br />
                    </div>
                  )
                })} <br />
                {spot.contact_info}
              </Popup>
            </Marker>
          )
        })}
        )
      </>
    )
  }

  //kartan uudelleenkeskittäminen haun yhteydessä
  const Centerer: React.FC<CentererProps> = ({ center }) => {
    const map = useMap()
    useEffect(() => {
      map.setView(center)
    }, [center, map])

    return null
  }

  const RecycleLocationsMap: React.FC<CentererProps> = ({ center }) => {
    return (
      <MapContainer zoom={13} scrollWheelZoom={true}>
        <Centerer center={center} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Markers />
      </MapContainer>
    )
  }

  return (
    <RecycleLocationsMap center={mapCenter}></RecycleLocationsMap>
  )
}

export default Map