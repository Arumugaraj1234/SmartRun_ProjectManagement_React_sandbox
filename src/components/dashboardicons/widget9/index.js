import React from 'react'

const Widget9 = () => {
  return (
    <div className="row">
      <div
        className="col-lg-2"
        style={{ 'height': '140px', 'padding-right': '0px', 'margin-top': '8px', 'display':'none' }}
      >
        <i className="fe fe-monitor" style={{ 'font-size': '40px' }} />
      </div>
      <div
        className="col-lg-8"
        style={{ height: '140px', 'padding-right': '0px', 'margin-top': '8px' }}
      >
        <div className="col-lg-12" style={{ 'padding-right': '0px' }}>
          <div className="text-dark font-weight-bold align-center">
            <span className="setmarginbottomzero">
              <span>1</span>
              <br />
              <span className="set-desc-fontsize-color">Gateway</span>
            </span>
          </div>
        </div>
        
      </div>
      <div
        className="col-lg-4"
        style={{ 'height': '140px', 'padding-right': '0px', 'margin-top': '8px'}}
      >
        <img src="resources/images/avatars/greentickicon.png.jpeg" alt="Mary Stanform" style={{'height':'30px'}} />
      </div>
    </div>
  )
}

export default Widget9
