import React, { useEffect, useState } from 'react'
import { Select } from 'antd'
import { commongetmethod } from '../../../services/common/AppeovedDocumentService/adddocumentservice'

// Payment Term dropdown; options come from payment_term_mst (active rows, by SEQ_NO).
// value/onChange are injected by the wrapping Form.Item, so the selected term text is
// stored in the form field exactly like the old free-text input.
const PaymentTermSelect = ({ value, onChange, style = { width: '200px' }, disabled }) => {
  const [options, setOptions] = useState([])

  useEffect(() => {
    let active = true
    const loadTerms = async () => {
      const response = await commongetmethod({ requestPath: 'getPaymentTermMst' })
      if (active && Array.isArray(response?.responseData)) {
        setOptions(response.responseData.map(item => ({ label: item.termDesc, value: item.termDesc })))
      }
    }
    loadTerms()
    return () => {
      active = false
    }
  }, [])

  return (
    <Select
      value={value || undefined}
      onChange={val => onChange?.(val ?? '')}
      options={options}
      placeholder="Select payment term"
      showSearch
      allowClear
      optionFilterProp="label"
      style={style}
      disabled={disabled}
      dropdownMatchSelectWidth={false}
    />
  )
}

export default PaymentTermSelect
