import React from 'react'
import logo from '../media/logo.png'
import { Jumbotron, Media, Image, Container, Row } from 'react-bootstrap'
import '../styles.css'

/** Component for showing product name and recycling information. */
const InfoBar = ({ header, text }) => {
  return (
    <div>
      <Jumbotron id='infobar'>
        <Media>
          <Container >
            <Row className='justify-content-sm-center'>

              <Image
                width={128}
                height={128}
                className='mr-3'
                src={logo}
                alt='Logo'
              />
              <Media.Body>
                <h3>{header}</h3>
                <p>
                  {text}
                </p>
              </Media.Body>
            </Row>
          </Container>
        </Media>
      </Jumbotron>
    </div>
  )
}

export default InfoBar