import React from 'react'

const Icon1 = (props) => {
  // const {name}=props;
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card" style={{ 'background-color': '#345ce0', height: '500px' }}>
          <div className="card-body overflow-hidden position-relative" style={{'padding-left':'10px','padding-right':'10px'}}>
            <div className="remove-card-body-over-spacing-left-right">
              <div className="text-dark align-center">
                <center>
                  <div className="pr-3" style={{ color: 'white', 'font-size': '30px', 'font-weight':'bold' }}>
                    RANERGY
                  </div>
                  <div className="mb-2" style={{ color: 'white' }}>
                    T.Karlsalkulam,<br /> 
                    Virudhunagar District,<br /> Tamil Nadu
                  </div>
                  
                </center>
              </div>
              <br />
              <div className="text-dark align-center">
                <center>
                  <div className="pr-3" style={{ color: 'white', 'font-size': '20px' }}>
                    2.30 MWp
                  </div>
                  <div className="mb-2" style={{ color: 'white', 'font-size': '23px', 'font-weight':'bold' }}>
                    DC Capacity
                  </div>
                </center>
              </div>
              <br />
              <div className="text-dark font-weight-bold align-center">
                <center>
                  <div className="pr-12 mr-auto">
                    <center>
                      <i
                        className="fe fe-sun"
                        style={{ color: 'white', 'font-size': '30px' }}
                      />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <span style={{ color: 'white', 'font-size': '20px' }}>52.90° C</span>
                      <br />
                    </center>
                  </div>
                </center>
              </div>
              <div className="text-dark font-weight-bold align-center">
                <center>
                  <div className="pr-12 mr-auto" style={{ color: 'white', 'font-size': '30px' }}>
                    <center>
                      <i className="fe fe-wind" style={{ color: 'white', 'font-size': '30px' }} />
                      &nbsp;&nbsp;&nbsp;
                      <span style={{ color: 'white', 'font-size': '20px' }}>2.60 m/s</span>
                      <br />
                    </center>
                  </div>
                </center>
              </div>
              <br />
              <div className="text-dark align-center">
                <center>
                  <p className="setmarginbottomzero">
                    <span style={{ color: 'white', 'font-size': '20px' }}>12.83 GWh</span>
                  </p>
                  <p style={{ color: 'white', 'font-size': '20px', 'font-weight':'bold' }}>Total Export till Date</p>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Icon1
