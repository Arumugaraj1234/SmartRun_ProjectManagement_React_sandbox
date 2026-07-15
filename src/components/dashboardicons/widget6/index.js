import React from 'react'

const Widget6 = () => {
  return (
    <div className="row">
      <div className="col-lg-2" style={{ 'height': '140px', 'margin-top': '8px', 'display':'none' }}>
        <i className="fe fe-sun" style={{ 'font-size': '40px' }} />
      </div>
      <div className="col-lg-12" style={{ height: '140px', 'margin-top': '8px' }}>
        <div className="col-lg-12">
          <div className="text-dark font-weight-bold align-center">
            <p className="setmarginbottomzero">
              <span>7296</span>
              <br />
            </p>
            <p className="set-desc-fontsize-color">Panels</p>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="text-dark font-weight-bold align-center">
            <p className="setmarginbottomzero">
              <span>60.10 C</span>
            </p>
            <p className="set-desc-fontsize-color">Module Temp</p>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Widget6
