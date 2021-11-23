import React, { useState, useEffect } from 'react'
import InfoBar from '../InfoBar'
import Map from '../Map'
import MaterialsCheckboxGroup from '../MaterialsCheckboxGroup'
import { useStore } from '../../store'
import { KierratysInfoService } from '../../services/kierratysInfo'
import { Container, Button, Form, Row, Col } from 'react-bootstrap'
import { ErrorResponse } from '../../types/requestResponses'
import credentialService from '../../services/credentials'

type Props = {
  kierratysInfoService: KierratysInfoService
}

const RecycleLocationsView: React.FC<Props> = ({ kierratysInfoService }) => {
  var defaultCoordinates: [number, number] = [60.150, 24.96]
  const { setNotification, selectedMaterials } = useStore()
  const [recyclingSpots, setRecyclingSpots] = useState<any[]>([])
  const [filteredRecyclingSpots, setFilteredRecyclingSpots] = useState<any[]>([])
  const [mapCenter, setMapCenter] = useState(defaultCoordinates)
  const [materials, setMaterials] = useState<any[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    const getCredentialsAndLoadMaterials = async () => {
      const key = await credentialService.getCredentialsFor('KInfo')
      kierratysInfoService.setKey(key)
      kierratysInfoService.getAllRecyclingMaterials()
        .then(res => {
          setMaterials(res.results.sort((first: any, second: any) => {
            return ((first.name > second.name) ? 1 : -1)
          }))
        })
    }
    getCredentialsAndLoadMaterials()
  }, [])

  useEffect(() => {
    if (recyclingSpots.length !== 0) {
      setFilteredRecyclingSpots(filterRecyclingSpotsByMaterials(recyclingSpots))
    }
  }, [selectedMaterials])

  const filterRecyclingSpotsByMaterials = (data: any[]) => {
    let spots = data.filter((spot: { geometry: null }) => spot.geometry !== null)

    if (selectedMaterials.length === 0) {
      return (spots)
    }

    for (var i = 0; i < spots.length; i++) {
      spots[i].goodness = 0
      const spotMaterials: any[] = spots[i].materials
      for (var j = 0; j < spotMaterials.length; j++) {
        for (var k = 0; k < selectedMaterials.length; k++) {
          if (selectedMaterials[k].code === spotMaterials[j].code) {
            spots[i].goodness += 1
            break
          }
        }
      }
    }

    let filteredSpots: any[] = spots
      .filter(spot => spot.goodness > 0)
      .sort((first, second) => second.goodness - first.goodness)

    return (filteredSpots)
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    var coordinates: [number, number] = defaultCoordinates
    var isPostalCode = /[0-9]{5}/

    if (isPostalCode.test(input)) {    // jos hakusanana postinumero
      await kierratysInfoService.getCollectionSpotsByPostalCode(input)
        .then(result => {
          setRecyclingSpots(result.results)
          const filteredSpots: any[] = filterRecyclingSpotsByMaterials(result.results)
          setFilteredRecyclingSpots(filteredSpots)
          coordinates = [filteredSpots[0].geometry.coordinates[1], filteredSpots[0].geometry.coordinates[0]]
        })
        .catch((error: ErrorResponse) => {
          setNotification((`Postinumerolla ${input} haettaessa ei löytynyt hakutuloksia!`)
            , 'error')
          console.log(error)
        })

    } else {  // hakusanana paikkakunta tai joku muu
      await kierratysInfoService.getCollectionSpotsByMunicipality(input)
        .then(result => {
          setRecyclingSpots(result.results)
          const filteredSpots: any[] = filterRecyclingSpotsByMaterials(result.results)
          setFilteredRecyclingSpots(filteredSpots)
          coordinates = [filteredSpots[0].geometry.coordinates[1], filteredSpots[0].geometry.coordinates[0]]
        })
        .catch((error: ErrorResponse) => {
          setNotification((`Hakusanalla ${input} haettaessa ei löytynyt hakutuloksia!`)
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
          <MaterialsCheckboxGroup materials={materials}/>
          <Row>
            <Map mapCenter={mapCenter} recyclingSpots={filteredRecyclingSpots} />
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default RecycleLocationsView