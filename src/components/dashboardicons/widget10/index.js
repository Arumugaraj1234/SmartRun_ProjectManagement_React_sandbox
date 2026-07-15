import React from 'react'


const Widget10 = () => {
  const value = '1092'
  const title = "Today's Export"
  return (
    <div className="row">
      <div className="col-lg-12" style={{ height: '140px', 'margin-top': '8px' }}>
        <div className="col-lg-12">
          <div className="text-dark font-weight-bold align-center">
            <p className="setmarginbottomzero">
              <span>{value} kWh</span>
            </p>
            <p className="set-desc-fontsize-color">{title}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Widget10
