import React, { useState } from 'react'
import InfoBar from '../InfoBar'
import Map from '../Map'
import { useStore } from '../../store'
import kierratysInfoService from '../../services/kierratysInfo'
import { Container, Button, Form, Row, Col } from 'react-bootstrap'
import { ErrorResponse } from '../../types/requestResponses'

// käyttäjän paikan haku:
//navigator.geolocation.getCurrentPosition((position) => {
//  console.log(position.coords.latitude, position.coords.longitude)
//})


const RecycleLocationsView = () => {
  var defaultCoordinates: [number, number] = [60.150, 24.96]
  const { setNotification } = useStore()
  const [input, setInput] = useState('')
  const [recyclingSpots, setRecyclingSpots] = useState([])
  const [mapCenter, setMapCenter] = useState(defaultCoordinates)

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    var coordinates: [number, number] = defaultCoordinates
    var isPostalCode = /[0-9]{5}/

    if (isPostalCode.test(input)) {    // jos hakusanana postinumero
      await kierratysInfoService.getCollectionSpotsByPostalCode(input)
        .then(result => {
          setRecyclingSpots(result.results)
          console.log(result.results)
          coordinates = [result.results[0].geometry.coordinates[1], result.results[0].geometry.coordinates[0]]
        })
        .catch((error: ErrorResponse) => {
          setNotification((`Postinumerolla ${input} haettaessa tapahtui virhe!`)
            , 'error')
          console.log(error.message)
        })

    } else {  // hakusanana paikkakunta tai joku muu
      await kierratysInfoService.getCollectionSpotsByMunicipality(input)
        .then(result => {
          setRecyclingSpots(result.results)
          coordinates = [result.results[0].geometry.coordinates[1], result.results[0].geometry.coordinates[0]]
        })
        .catch((error: ErrorResponse) => {
          setNotification((`Hakusanalla ${input} haettaessa tapahtui virhe!`)
            , 'error')
          console.log(error.message)
        })
    }

    setInput('')
    setMapCenter(coordinates)
  }

  /*
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    var input = event.target.value

    // hakusanana postinumero
    if (Number.isInteger(input) && input.length===5) {
      setPostalCode(input)
      setMunicipality('')
    } else {  //hakusanana paikkakunta (tai mitä tahansa muuta)
      setMunicipality(input)
    }
  }
  */

  return (
    <div>
      <InfoBar header={'Kierrätyspisteet'} text={'Tällä sivulla voit hakea kierrätyspisteitä paikkakunnan tai postinumeron perusteella.'} />
      <div>
        <Container>
          <Form id='kierratysinfoHaku' onSubmit={onSubmit}>
            <Form.Group as={Row}>
              <Col md="6">
                <Form.Control
                  type="text"
                  placeholder="Kirjoita paikkakunnan nimi tai postinumero..."
                  id="hakusanaInput"
                  onChange={({ target }) => setInput(target.value)} />
              </Col>
              <Col>
                <Button id='hakusanaSubmit' type="submit">
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