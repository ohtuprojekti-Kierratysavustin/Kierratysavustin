import React, { useState, useEffect, useRef } from 'react'
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
  const input = useRef('')

  useEffect(() => {
    console.log('reload')
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
    let filteredSpots: any[]

    if (selectedMaterials.length === 0) {
      spots.map(spot => {
        spot.goodness = undefined
      })
      filteredSpots = spots
    } else {
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
      filteredSpots = spots
        .filter(spot => spot.goodness > 0)
        .sort((first, second) => second.goodness - first.goodness)
    }

    if (filteredSpots.length > 0) {
      var coordinates: [number, number]
      coordinates = [filteredSpots[0].geometry.coordinates[1], filteredSpots[0].geometry.coordinates[0]]
      setMapCenter(coordinates)
    } else {
      setMapCenter(defaultCoordinates)
    }
    return (filteredSpots)
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()

    var isPostalCode = /[0-9]{5}/

    if (isPostalCode.test(input.current)) {    // jos hakusanana postinumero
      await kierratysInfoService.getCollectionSpotsByPostalCode(input.current)
        .then(result => {
          setRecyclingSpots(result.results)
          const filteredSpots: any[] = filterRecyclingSpotsByMaterials(result.results)
          setFilteredRecyclingSpots(filteredSpots)
        })
        .catch((error: ErrorResponse) => {
          setNotification((`Postinumerolla ${input} haettaessa ei löytynyt hakutuloksia!`)
            , 'error')
          console.log(error)
        })

    } else {  // hakusanana paikkakunta tai joku muu
      await kierratysInfoService.getCollectionSpotsByMunicipality(input.current)
        .then(result => {
          setRecyclingSpots(result.results)
          const filteredSpots: any[] = filterRecyclingSpotsByMaterials(result.results)
          setFilteredRecyclingSpots(filteredSpots)
        })
        .catch((error: ErrorResponse) => {
          setNotification((`Hakusanalla ${input.current} haettaessa ei löytynyt hakutuloksia!`)
            , 'error')
          console.log(error.message)
        })
    }
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
                  onChange={(event) => input.current = event.target.value} />
              </Col>
              <Col>
                <Button id='hakusanaSubmit' type="submit">
                  Hae
                </Button>
              </Col>
            </Form.Group>
          </Form>
          <MaterialsCheckboxGroup materials={materials} />
          <Row>
            <Map mapCenter={mapCenter} recyclingSpots={filteredRecyclingSpots} />
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default RecycleLocationsView