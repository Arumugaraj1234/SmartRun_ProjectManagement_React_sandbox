import React from 'react'

const Widget8 = () => {
  return (
    <div className="row">
      <div
        className="col-lg-2"
        style={{ height: '140px', 'padding-right': '0px', 'margin-top': '8px', 'display':'none' }}
      >
        <i className="fe fe-power" style={{ 'font-size': '40px' }} />
      </div>
      <div
        className="col-lg-12"
        style={{ height: '140px', 'padding-right': '0px', 'margin-top': '8px' }}
      >
        <div className="col-lg-12" style={{ 'padding-right': '0px' }}>
          <div className="text-dark font-weight-bold align-center">
            <p className="setmarginbottomzero">
              <span>16</span>
            </p>
            <p className="set-desc-fontsize-color">Inverters</p>
            
          </div>
        </div>
        <div className="col-lg-12" style={{ 'padding-right': '0px' }}>
          <div className="text-dark font-weight-bold align-center">
            <p className="setmarginbottomzero">
              <span>1286 kWh</span>
            </p>
            <p className="set-desc-fontsize-color">Total Invertor Capacity</p>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Widget8
