import React from 'react'
import logo from '../media/logo.png'
import { Image, Container, Row } from 'react-bootstrap'
import '../styles.css'

type Props = {
  header: string,
  text: string
}

/** Component for showing product name and recycling information. */
const InfoBar: React.FC<Props> = ({ header, text }) => {
  return (
    <div>
      <Container >
        <Row className='justify-content-sm-center'>

          <Image
            width={128}
            height={128}
            className='mr-3'
            src={logo}
            alt='Logo'
          />
          <div>
            <h3>{header}</h3>
            <p>
              {text}
            </p>
          </div>
        </Row>
      </Container>
    </div>
  )
}

export default InfoBar