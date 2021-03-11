import React from 'react'
import './notification.css'

const Notification = ({ message }) => {

  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

export default Notification