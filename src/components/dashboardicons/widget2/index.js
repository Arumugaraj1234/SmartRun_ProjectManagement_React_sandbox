import React from 'react'

const Widget2 = () => {
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card" style={{ 'background-color':'#345ce0', 'height':'500px' }}>
          <div className="card-body overflow-hidden position-relative">
            <div className="text-dark font-weight-bold align-center">
              <center>
                <div className="pr-4 mr-auto" style={{'font-size':'30px', 'color':'white'}}>
                  <center>
                    <i className="fe fe-calendar" />
                    <br />
                  </center>
                </div>
              </center>
              <center>
                <div className="pr-3" style={{'font-size':'20px', 'color':'white'}}>15-Feb-2021</div>
              </center>
            </div>
            <br />
            <div className="text-dark align-center">
              <center>
                <div className="pr-3" style={{'color':'white', 'font-size':'20px'}}>74.41 %</div>
                <div className="mb-2" style={{'color':'white', 'font-size':'20px', 'font-weight':'bold' }}>Performance Ratio</div>
              </center>
            </div>
            <br />
            <div className="text-dark align-center">
              <center>
                <div className="pr-3" style={{'color':'white', 'font-size':'20px'}}>0.64 kWh/m<sup>2</sup></div>
                <div className="mb-2" style={{'color':'white', 'font-size':'20px', 'font-weight':'bold'}}>Insolation</div>
              </center>
            </div>
            <br />
            <div className="text-dark align-center">
              <center>
                <div className="pr-3" style={{'color':'white', 'font-size':'20px'}}>1.98%</div>
                <div className="mb-2" style={{'color':'white', 'font-size':'20px', 'font-weight':'bold'}}>CUF</div>
              </center>
            </div>
            <br />
            <div className="text-dark align-center">
              <center>
                <div className="pr-3" style={{'color':'white', 'font-size':'20px'}}>0.48 kWh/kWp</div>
                <div className="mb-2" style={{'color':'white', 'font-size':'20px', 'font-weight':'bold'}}>Specific Yield</div>
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Widget2
