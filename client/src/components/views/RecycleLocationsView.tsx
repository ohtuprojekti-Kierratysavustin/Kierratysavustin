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
  const [municipality, setMunicipality] = useState('')
  const [recyclingSpots, setRecyclingSpots] = useState([])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    await kierratysInfoService.getCollectionSpotsByMunicipality(municipality)
      .then(result => {
        setRecyclingSpots(result.results)
        console.log(result.results[0].geometry.coordinates)
      })
  }

  return (
    <div>
      <InfoBar header={'Kierrätyspisteet'} text={'Tällä sivulla voit hakea kierrätyspisteitä paikkakunnan perusteella'} />
      <div>
        <Container>
          <Form onSubmit={onSubmit}>
            <Form.Group as={Row}>
              <Col md="auto">
                <Form.Control
                  type="text"
                  placeholder="Kirjoita paikkakunnan nimi..."
                  id="paikkakuntaInput"
                  onChange={({ target }) => setMunicipality(target.value)} />
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
      <Map mapCenter={[60.150, 24.96]} recyclingSpots={recyclingSpots} />
    </div>
  )
}

export default RecycleLocationsView