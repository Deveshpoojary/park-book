import React from 'react'
import spinner from '../images/loading.gif'

function loading() {
  return (
    <div>
      <img src={spinner} alt="Loading..."></img>
    </div>
  )
}

export default loading
