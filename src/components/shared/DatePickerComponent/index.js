import React from 'react'
import { DatePicker } from 'antd'
import moment from 'moment'

const DatePickerComponent = ({ onChange, placeholder, width, mb, defaultVal, disablepicker }) => {
  const currentDate = new Date()
  // const dateFormatList = ['DD-MM-YYYY','DD/MM/YYYY', 'DD/MM/YY','DD-MM-YY']
  return (
    <DatePicker
      onChange={onChange}
      placeholder={placeholder}
      defaultValue={defaultVal ? moment(defaultVal) : moment(currentDate)}
      disabledDate={d => !d || d.isAfter(moment())}
      format="DD-MMM-YYYY"
      disabled={disablepicker}
      style={{ width: `${width}`, marginBottom: `${mb}` }}
    />
  )
}

export default DatePickerComponent
