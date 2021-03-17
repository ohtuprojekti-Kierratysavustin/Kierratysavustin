import React from 'react'
import './notification.css'

const Notification = ({ message, condition }) => {

  if (message === null) {
    return null
  }
  if (condition === 'succes') {
    return (
      <div className="succes">
        {message}
      </div>
    )
  } else {
    return (
      <div className="error">
        {message}
      </div>
    )
  }

}

export default Notification