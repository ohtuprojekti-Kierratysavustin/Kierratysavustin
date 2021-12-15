import React from 'react'
import { useStore } from '../store'

import { Alert } from 'react-bootstrap'
import '../styles.css'

const Notification = () => {
  const { message, condition } = useStore().notification
  if (message === null) {
    return null
  }
  if (condition === 'success') {
    return (
      <Alert variant='success' className='better-notification'>
        {message}
      </Alert>
    )
  } else {
    return (
      <Alert variant='danger' className='better-notification'>
        {message}
      </Alert>
    )
  }
}

export default Notification