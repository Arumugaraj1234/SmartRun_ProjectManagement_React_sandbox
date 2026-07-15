import React from 'react'
import { useMediaQuery } from 'react-responsive'

const NavigationComponent = ({
  handleTabClick,
  EntryDetailsComponent,
  NavTabComponent,
  MainComponent,
  NewEnqdata,
  NewEnqtext,
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
      {NewEnqdata ? (
        <div>
          <div>
            <NavTabComponent
              handleTabClick={handleTabClick}
              activeTab={activeTab}
              Navdata={Navdata}
              style={{ marginLeft: '10px' }}
            />
          </div>
          {/* <div className="col-9" style={{ marginLeft: '-15px', marginTop: '56px' }}> */}
          <div className="row">
            <div
              className="col-12"
              style={isMobile ? { width: '100px', marginTop: '0px' } : { marginTop: '56px' }}
            >
              <MainComponent content={content} SlaveID={SlaveID} DocTypeCode={DocTypeCode} />
            </div>
            <div className="col-3">
              <EntryDetailsComponent data={NewEnqdata} text={NewEnqtext} />
            </div>
          </div>
        </div>
      ) : null}

      {EnqueiryComponent ? (
        <div>
          <div>
            {/* <NavTabComponent
              handleTabClick={handleTabClick}
              activeTab={activeTab}
              Navdata={Navdata}
              style={{ marginLeft: '10px' }}
            /> */}
            <NavTabComponent
              ModuleName="Design"
              handleTabClick={handleTabClick}
              activeTab={activeTab}
              Navdata={Navdata}
            />
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
      ) : null}
    </div>
  )
}

export default NavigationComponent
