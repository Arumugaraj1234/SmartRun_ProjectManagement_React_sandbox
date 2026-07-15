import React from 'react'
import { Divider } from 'antd'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
// import style from './style.module.scss'

const FinanceDetails = ({ data, text }) => {
  return (
    <div className="card" style={{ width: '320px', height: 'auto' }}>
      <div className="card-body" style={{ flexDirection: 'column', display: 'flex', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-10px' }}>
          <h5 style={{ fontWeight: 'bold', margin: 0 }}>{text}</h5>
          {/* {closeicons} */}
        </div>
        <Divider style={{ margin: '15px 0' }} />
        <PerfectScrollbar
          style={{ maxHeight: '100%', overflowX: 'hidden' }}
          options={{ suppressScrollX: true }}
        >
          <div>
            {data &&
              data.map(datas => (
                <div className="row" key={datas.key}>
                  <div className="col-5">
                    <p style={{ color: 'black' }}>
                      <span>{datas.label}</span>
                    </p>
                  </div>
                  <div className="col-7">
                    <p style={{ color: 'black', fontWeight: 'bold', fontSize: '15px' }}>
                      {datas.value !== undefined ? `${datas.value}` : null}{' '}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </PerfectScrollbar>
      </div>
    </div>
  )
}

export default FinanceDetails
