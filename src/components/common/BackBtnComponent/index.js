import React from 'react'
import { useHistory } from 'react-router-dom'
import Buttons from 'components/shared/ButtonComponent'

const BackButtonComponent = ({ componentToRender }) => {
  const history = useHistory()
  const handleBackClick = () => {
    history.goBack()
    console.log(componentToRender)
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5px' }}>
      <Buttons type="primary" text="Back" onClick={handleBackClick} />
    </div>
  )
}

export default BackButtonComponent
