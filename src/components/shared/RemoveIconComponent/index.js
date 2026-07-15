import React from 'react'
import { Button } from 'antd'
import { MinusOutlined } from '@ant-design/icons'

const RemoveIcon = ({ onClick = () => {}, ispointerEve, iscursor, disableInputBoxes }) => {
  return (
    <Button
      type="text"
      icon={<MinusOutlined style={{ color: 'white' }} />}
      style={{
        background: 'red',
        border: 'none',
        borderRadius: '3px',
        cursor: `${iscursor}`,
        pointerEvents: `${ispointerEve}`,
      }}
      onClick={onClick}
      disabled={disableInputBoxes}
    />
  )
}

export default RemoveIcon
