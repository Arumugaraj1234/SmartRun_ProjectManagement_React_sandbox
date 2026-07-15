import React from 'react'
import { Input } from 'antd'
// import style from './style.module.scss';

const InputComponent = ({
  placeholder,
  defaultValue,
  onChange,
  value,
  width,
  height,
  type,
  maxLengthEnabled,
  showCount,
  contperson,
  onBlur,
  name,
  disabled,
  colors,
}) => {
  const maxLengthValue = maxLengthEnabled === 'true' ? 64 : undefined

  return (
    // <div className={`${style.input}`}>
    <Input
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      value={value}
      style={{ width: `${width}`, height: `${height}`, color: `${colors}` }}
      type={type}
      suffix={showCount ? <span>{value && value.length}/10</span> : null}
      maxLength={maxLengthValue}
      ref={contperson}
      onBlur={onBlur}
      name={name}
      disabled={disabled}
    />
    // </div>
  )
}

export default InputComponent
