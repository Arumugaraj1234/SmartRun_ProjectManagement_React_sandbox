import React from 'react'
import { Button } from 'antd'

const ButtonComponent = ({
  type,
  size,
  text,
  onClick,
  bgcolor,
  textcolor,
  href,
  target,
  marginright,
  icon,
  bgcolors,
  disable,width
}) => {
  const buttonStyle = {
    backgroundColor: bgcolor,
    background: bgcolors,
    color: textcolor,
    marginRight: marginright,
    width
  }
  return (
    <Button
      type={type}
      size={size}
      onClick={onClick}
      href={href}
      style={buttonStyle}
      target={target}
      icon={icon}
      disabled={disable}
    >
      {text}
    </Button>
  )
}

export default ButtonComponent
