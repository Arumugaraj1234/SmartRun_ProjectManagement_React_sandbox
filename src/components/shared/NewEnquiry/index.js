import React, { useRef } from 'react'
import { Divider } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { useMediaQuery } from 'react-responsive'
import 'react-perfect-scrollbar/dist/css/styles.css'
import style from './style.module.scss'

const NewEnquiry = ({ data, children, text, closeNewCreateCard, Btncomponent }) => {
  // const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const isSmallMobile = useMediaQuery({ query: '(max-width: 400px)' })
  const cardRef = useRef(null)
  return (
    <div ref={cardRef} className={`${style.popup}`}>
      <div
        className="card"
        style={
          isSmallMobile ? { height: '500px', width: '320px' } : { width: '390px', height: '550px' }
        }
      >
        <div className="card-body" style={{ flexDirection: 'column', display: 'flex', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '-10px' }}>
            <h5
              style={{
                fontWeight: 'bold',
                margin: 0,
                marginTop: '10px',
                marginLeft: isSmallMobile ? '30px' : '1px',
              }}
            >
              {text}
            </h5>
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
                onClick={closeNewCreateCard}
              />
            </div>
          </div>

          <Divider style={{ margin: '15px 0' }} />
          <PerfectScrollbar
            style={{ maxHeight: '100%', overflowX: 'hidden' }}
            options={{ suppressScrollX: true }}
          >
            {data &&
              data.map((datas, index) => (
                <div key={datas.key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ color: 'black' }}>
                    {datas.mandatory === 1 ? (
                      <span>
                        {' '}
                        {datas.label}
                        <span style={{ color: 'red' }}>*</span>{' '}
                      </span>
                    ) : (
                      <span> {datas.label} </span>
                    )}
                    <span style={{ fontWeight: 'bold', fontSize: '15px' }}>
                      {datas.value !== undefined ? `${datas.value}` : null}{' '}
                    </span>
                  </p>
                  {children && children[index]}
                </div>
              ))}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {Btncomponent && Btncomponent.map(button => <>{button}</>)}
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
  )
}

export default NewEnquiry
