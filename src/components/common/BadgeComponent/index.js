import React from 'react'
import { Badge } from 'antd'

const BadgeComponent = ({ TextVal, BadgeColor }) => {
  return (
    <Badge.Ribbon
      text={TextVal}
      color={BadgeColor}
      style={{ marginRight: '-25px', fontWeight: 'bold' }}
    />
  )
}

export default BadgeComponent
