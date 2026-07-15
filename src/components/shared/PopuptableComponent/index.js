import React from 'react'
import { Popover } from 'antd'

const Popuptable = ({ onClose, cardLabel, component, visible, place }) => {
  return (
    <Popover
      content={component}
      title={cardLabel}
      trigger="click"
      placement={place}
      visible={visible}
      onVisibleChange={onClose}
      // overlayStyle={{ width: '400px' }}
    />
  )
}

export default Popuptable
