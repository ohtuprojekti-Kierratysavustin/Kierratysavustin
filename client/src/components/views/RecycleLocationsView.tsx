import React, { useState, useEffect } from 'react'
import InfoBar from '../InfoBar'
import Map from '../Map'
import CheckboxGroup from 'react-checkbox-group'
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
  const { setNotification, user } = useStore()
  const [recyclingSpots, setRecyclingSpots] = useState([])
  const [mapCenter, setMapCenter] = useState(defaultCoordinates)
  const [materials, setMaterials] = useState<any[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<any[]>([])
  const [input, setInput] = useState('')


  useEffect(() => {
    const getRecyclingMaterials = () => {
      return kierratysInfoService.getAllRecyclingMaterials()
    }
    getRecyclingMaterials().then(res => {
      setMaterials(res.results)
    })
  },[user])

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    var coordinates: [number, number] = defaultCoordinates
    var isPostalCode = /[0-9]{5}/

    if (isPostalCode.test(input)) {    // jos hakusanana postinumero
      await kierratysInfoService.getCollectionSpotsByPostalCode(input, selectedMaterials)
        .then(result => {
          setRecyclingSpots(result.results)
          coordinates = [result.results[0].geometry.coordinates[1], result.results[0].geometry.coordinates[0]]
        })
        .catch((error: ErrorResponse) => {
          setNotification((`Postinumerolla ${input} haettaessa tapahtui virhe!`)
            , 'error')
          console.log(error.message)
        })

    } else {  // hakusanana paikkakunta tai joku muu
      await kierratysInfoService.getCollectionSpotsByMunicipality(input, selectedMaterials)
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
    setMapCenter(coordinates)
  }

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
          <CheckboxGroup className='checkboxgroup' name='materiaalit' value={selectedMaterials} onChange={setSelectedMaterials}>
            {(Checkbox: any) => (
              <>
                {materials.map(material => {
                  return (
                    <label className='checkbox-label' key={material.code}>
                      <Checkbox checked='true' className="checkbox" value={material} /> {material.name}
                    </label>
                  )
                })}
              </>
            )}
          </CheckboxGroup>
          <Row>
            <Map mapCenter={mapCenter} recyclingSpots={recyclingSpots} />
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default RecycleLocationsView