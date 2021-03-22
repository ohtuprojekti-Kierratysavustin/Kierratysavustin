import React from 'react'
import './notification.css'
import { useStore } from '../App'

const Notification = () => {
  const { message, condition } = useStore().notification
  if (message === null) {
    return null
  }
  if (condition === 'success') {
    return (
      <div className="success">
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