import React from 'react'

const Widget3 = () => {
  return (
    <div className="row">
      <div className="col-lg-9" style={{'height':'120px'}}>
        <div className="col-lg-12">
          <div className="text-dark font-weight-bold align-center">
            <p className="setmarginbottomzero"><span>1092 kWh</span></p>
            <p style={{'color':'#007bff', 'font-size':'12px'}}>Today&#8217;s Export</p>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="text-dark font-weight-bold align-center">
            <p className="setmarginbottomzero"><span>12.83 Gwh</span></p>
            <p style={{'color':'#007bff', 'font-size':'12px'}}>Total Export till date</p>
          </div>
        </div>
      </div>
      <div className="col-lg-3">
        <div className="align-center" style={{'font-size':'25px', 'color':'blue'}}>
          <br />
          <i className="fe fe-navigation" />
        </div>
      </div>
    </div>
  )
}

export default Widget3
