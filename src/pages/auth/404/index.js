import React from 'react'
import { Helmet } from 'react-helmet'
import { useMediaQuery } from 'react-responsive'
import Error404 from 'components/cleanui/system/Errors/404'

const System404 = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })

  return (
    <div>
      <Helmet title="Page 404" />
      <div
        className="card"
        style={
          !isMobile
            ? { marginTop: '-50px', marginLeft: '110%', height: '330px', width: '400px' }
            : { width: '300px', alignItems: 'center', justifyContent: 'center' }
        }
      >
        <Error404 />
      </div>
    </div>
  )
}

export default System404
