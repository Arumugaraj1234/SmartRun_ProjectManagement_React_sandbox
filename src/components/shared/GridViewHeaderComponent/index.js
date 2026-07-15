import React, { useEffect, useState } from 'react'
import { UnorderedListOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import Button from '../ButtonComponent'
import style from './style.module.scss'

const GridViewHeader = ({
  EnquiryLabel,
  handleCardView = () => {},
  handleClickTable = () => {},
  openSidebar = () => {},
  openFilterCard = () => {},
  istableopen,
  showcreatebtn,
  enqEnabledtl,
}) => {
  const [enabledtl, setEnableDtl] = useState(null)
  useEffect(() => {
    async function onLoadFunc() {
      if (enqEnabledtl === '1') {
        setEnableDtl(false)
      } else {
        setEnableDtl(true)
      }
    }
    onLoadFunc()
  }, [enqEnabledtl])

  return (
    <div className={`${style.header}`}>
      <div style={{ display: 'flex' }}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          className="bi bi-filter"
          viewBox="0 0 16 16"
          style={{ cursor: 'pointer' }}
          onClick={openFilterCard}
        >
          <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" />
        </svg>
        <p style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '18px' }}>{EnquiryLabel}</p>
      </div>
      <div style={{ display: 'flex', marginRight: '18px' }}>
        <div style={{ marginRight: '15px', marginTop: '5px' }}>
          {istableopen ? (
            <MenuUnfoldOutlined style={{ fontSize: '20px' }} onClick={handleCardView} />
          ) : (
            <UnorderedListOutlined style={{ fontSize: '20px' }} onClick={handleClickTable} />
          )}
        </div>
        {showcreatebtn ? (
          <Button
            type="primary"
            size="medium"
            text="Create"
            onClick={openSidebar}
            disable={enabledtl}
          />
        ) : null}
      </div>
    </div>
  )
}

export default GridViewHeader
