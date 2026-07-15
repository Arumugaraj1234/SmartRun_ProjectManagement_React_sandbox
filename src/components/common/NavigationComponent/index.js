import React from 'react'

const NavigationComponent = ({
  handleTabClick,
  EntryDetailsComponent,
  NavTabComponent,
  MainComponent,
  NewEnqdata,
  NewEnqtext,
  Navdata,
  activeTab,
  content,
}) => {
  return (
    <div>
      <div>
        <NavTabComponent handleTabClick={handleTabClick} activeTab={activeTab} Navdata={Navdata} />
      </div>
      <div className="row">
        <div className="col-9" style={{ marginRight: '-20px', marginTop: '56px' }}>
          <MainComponent content={content} />
        </div>
        <div className="col-3">
          <EntryDetailsComponent data={NewEnqdata} text={NewEnqtext} />
        </div>
      </div>
    </div>
  )
}

export default NavigationComponent
