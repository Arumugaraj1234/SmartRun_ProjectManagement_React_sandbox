import React from 'react'


const Widget5 = () => {
  return (
    <div className="row">
      <div className="col-lg-12" style={{ height: '140px', 'margin-top': '8px' }}>
        <div className="col-lg-12">
          <div className="text-dark font-weight-bold align-center">
            <p className="setmarginbottomzero">
              <span>128 k</span>
            </p>
            <p className="set-desc-fontsize-color">Trees Planted</p>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="text-dark font-weight-bold align-center">
            <p className="setmarginbottomzero">
              <span>8979.49 Ton</span>
            </p>
            <p className="set-desc-fontsize-color">Carbon Emissions Saved</p>
          </div>
        </div>
      </div>
      <div className="col-lg-3" style={{ 'margin-top': '-40px','display':'none' }}>
        <div className="align-center" style={{ 'font-size': '30px', color: 'blue' }}>
          <br />
          &#x1F333;
        </div>
      </div>
    </div>
  )
}

export default Widget5
