import React from 'react'
import { useStore } from '../App'

import { Alert } from 'react-bootstrap'

const Notification = () => {
  const { message, condition } = useStore().notification
  if (message === null) {
    return null
  }
  if (condition === 'success') {
    return (
      <Alert variant='success'>
        {message}
      </Alert>
    )
  } else {
    return (
      <Alert variant='danger'>
        {message}
      </Alert>
    )
  }

}

export default Notification