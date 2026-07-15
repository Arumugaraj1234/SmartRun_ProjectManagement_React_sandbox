import React from 'react'
import { Spin } from 'antd'

const Loader = ({ loading, children }) => {
  return loading ? <Spin>{children}</Spin> : children
}

export default Loader
