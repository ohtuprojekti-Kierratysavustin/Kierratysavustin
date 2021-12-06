import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from '@monsonjeremy/react-leaflet'
import L from 'leaflet'
import { RecyclingSpot, RecyclingMaterial } from '../types/objects'

type Props = {
  mapCenter: [number, number],
  recyclingSpots: RecyclingSpot[],
  selectedMaterials: RecyclingMaterial[]
}

type CentererProps = {
  center: [number, number]
}

const Map: React.FC<Props> = ({ mapCenter, recyclingSpots, selectedMaterials }) => {

  const Markers = () => {
    if (!recyclingSpots || recyclingSpots.length === 0) {
      return null
    }

    var greenMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })

    return (
      <>
        {recyclingSpots.map(spot => {
          return (
            <Marker position={[spot.geometry.coordinates[1], spot.geometry.coordinates[0]]} key={spot.spot_id} icon={greenMarker}>
              {selectedMaterials.length > 0 && <Tooltip offset={[0, 0]} opacity={spot.goodness === undefined ? 0 : 0.85} permanent><b>{spot.goodness}</b></Tooltip>}
              <Popup>
                <b><h6>{spot.name}</h6></b>
                {spot.operator} <br />
                {spot.address} <br /> <br />
                <b>Kohteessa kierrätettävät materiaalit:</b>
                {spot.materials.map(material => {
                  if (selectedMaterials.map(m => m.code).includes(material.code)) {
                    return (
                      <div key={material.code} className='selected-materials'>
                        <b>{material.name}</b> <br />
                      </div>
                    )
                  } else {
                    return (
                      <div key={material.code}>
                        {material.name} <br />
                      </div>
                    )
                  }
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
      <MapContainer zoom={12} scrollWheelZoom={true}>
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