import React, { useState } from 'react'
import InfoBar from '../InfoBar'
import Map from '../Map'
//import { RecyclingSpot } from '../../types/objects'
import kierratysInfoService from '../../services/kierratysInfo'
import { Container, Button, Form, Row, Col } from 'react-bootstrap'

// käyttäjän paikan haku:
//navigator.geolocation.getCurrentPosition((position) => {
//  console.log(position.coords.latitude, position.coords.longitude)
//})


const RecycleLocationsView = () => {
  var defaultCoordinates: [number, number] = [60.150, 24.96]
  const [municipality, setMunicipality] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [recyclingSpots, setRecyclingSpots] = useState([])
  const [mapCenter, setMapCenter] = useState(defaultCoordinates)

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    var coordinates: [number, number] = defaultCoordinates

    if (municipality !== '') {
      await kierratysInfoService.getCollectionSpotsByMunicipality(municipality)
        .then(result => {
          setRecyclingSpots(result.results)
          coordinates = [result.results[0].geometry.coordinates[1], result.results[0].geometry.coordinates[0]]
        })
    }
    if (postalCode !== '') {
      await kierratysInfoService.getCollectionSpotsByPostalCode(postalCode)
        .then(result => {
          setRecyclingSpots(result.results)
          coordinates = [result.results[0].geometry.coordinates[1], result.results[0].geometry.coordinates[0]]
        })
    }
    setMunicipality('')
    setPostalCode('')
    setMapCenter(coordinates)
  }

  return (
    <div>
      <InfoBar header={'Kierrätyspisteet'} text={'Tällä sivulla voit hakea kierrätyspisteitä paikkakunnan tai postinumeron perusteella.'} />
      <div>
        <Container>
          <Form id='kierratysinfoHaku' onSubmit={onSubmit}>
            <Form.Group as={Row}>
              <Col md="auto">
                <Form.Control
                  type="text"
                  placeholder="Kirjoita paikkakunnan nimi..."
                  id="paikkakuntaInput"
                  onChange={({ target }) => setMunicipality(target.value)} />
              </Col>
              <Col md='auto'>
                <Form.Control
                  type='text'
                  placeholder='Tai kirjoita postinumero...'
                  id='postinumeroInput'
                  onChange={({ target }) => setPostalCode(target.value)} />
              </Col>
              <Col>
                <Button id='paikkakuntaSubmit' type="submit">
                  Hae
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Container>
      </div>
      <Map mapCenter={mapCenter} recyclingSpots={recyclingSpots} />
    </div>
  )
}

export default RecycleLocationsView