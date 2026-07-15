import React from 'react'
import { useMediaQuery } from 'react-responsive'

const NavigationComponent = ({
  handleTabClick,
  NavTabComponent,
  MainComponent,
  Navdata,
  activeTab,
  SlaveID,
  DocTypeCode,
  content,
  EnqueiryComponent,
}) => {
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
  return (
    <div>
      <div>
        <NavTabComponent handleTabClick={handleTabClick} activeTab={activeTab} Navdata={Navdata} />
      </div>
      <div className="row">
        <div
          className="col-12"
          style={isMobile ? { width: '100px', marginTop: '1px' } : { marginTop: '56px' }}
        >
          <EnqueiryComponent />
        </div>
        <div className="col-12" style={isMobile ? { width: '100px', marginTop: '0px' } : {}}>
          <MainComponent content={content} SlaveID={SlaveID} DocTypeCode={DocTypeCode} />
        </div>
      </div>
    </div>
  )
}

export default NavigationComponent
