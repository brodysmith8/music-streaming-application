import React from 'react'
import { Link } from 'react-router-dom'



const Trackcard = ({track}) => {
  return (
    <div>
        <h1>
          <p>{track.track_title}</p>
        </h1>
    </div>
  )
}

export default Trackcard