import React from 'react'
import { Helmet } from 'react-helmet'
import AlreadyLoggedIn from 'components/cleanui/system/Errors/alreadyLoggedIn'

const alreadyLoggedIn = () => {
  return (
    <div>
      <Helmet title="Page alreadyLoggedIn" />
      <AlreadyLoggedIn />
    </div>
  )
}

export default alreadyLoggedIn
