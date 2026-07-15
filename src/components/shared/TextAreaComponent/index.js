import React from 'react'
import { Input } from 'antd'

const { TextArea } = Input

const TextAreaComponent = ({ value, onChange, placeholder, width, height, mb }) => {
  return (
    <TextArea
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ width: `${width}`, height: `${height}`, marginBottom: `${mb}` }}
    />
  )
}

export default TextAreaComponent
