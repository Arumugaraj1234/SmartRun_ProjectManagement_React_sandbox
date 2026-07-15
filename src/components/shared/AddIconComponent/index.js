import React from 'react'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const AddIcon = ({ onClick = () => {}, disableInputBoxes }) => {
  return (
    <Button
      type="text"
      icon={<PlusOutlined style={{ color: 'white' }} />}
      style={{ background: 'green', border: 'none', borderRadius: '3px' }}
      onClick={onClick}
      disabled={disableInputBoxes}
    />
  )
}

export default AddIcon
