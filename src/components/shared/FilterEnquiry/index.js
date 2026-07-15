import React, { useRef } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import style from './style.module.scss'

const EnquiryFilter = ({ closeFilterCard = () => {}, data, cardLabel }) => {
  const isSmallMobile = useMediaQuery({ query: '(max-width: 400px)' })
  const cardReffilter = useRef(null)
  const arrowElement = React.createElement('div', { className: 'arrow' })
  return (
    <div ref={cardReffilter} className={`${style.filter}`}>
      <div className="filter-card-container">
        <div className="card" style={{ width: isSmallMobile ? '280px' : '320px', height: 'auto' }}>
          <div className="card-body">
            <div className="arrow">{arrowElement}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', height: '40px' }}>
              <h5 style={{ fontWeight: 'bold', margin: 0 }}>{cardLabel}</h5>
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '5px',
                  cursor: 'pointer',
                  width: '28px',
                  height: '30px',
                  backgroundColor: '#001F3E',
                }}
              >
                <CloseOutlined
                  style={{ color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={closeFilterCard}
                />
              </div>
            </div>

            {data &&
              data.map(res => (
                <div key={res.key}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '5px',
                    }}
                  >
                    {res.key === 5 ? (
                      <>
                        <div style={{ marginLeft: '65px' }}>{res.component}</div>
                        <p style={{ marginRight: '20px' }}>{res.label}</p>
                      </>
                    ) : (
                      <>
                        <p>{res.label}</p>
                        {res.component}
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default EnquiryFilter
