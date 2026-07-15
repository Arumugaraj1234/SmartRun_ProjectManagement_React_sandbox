import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { DatePicker, Select } from 'antd'
import store from 'store'
import ModalPopup from 'components/shared/ModalPopupComponent'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'

const ExpectDefaultDate = moment().add(15, 'days')
const RequestManagementAdd = ({ handleCancel, isModalVisible }) => {
  const { Option } = Select

  const [expectindentDate, setExpectIndentDate] = useState(ExpectDefaultDate)
  const [projectDropdown, setProjectDropdown] = useState([])
  const tenantid = store.get('tenantId')
  useEffect(() => {
    getProjectCode()
  }, [tenantid])

  const getProjectCode = async () => {
    try {
      const response = await indentFileUpload({
        requestPath: 'getPmInvDtl',
        requestData: {
          projectId: '',
          tenantId: tenantid,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData !== null && response.responseData.length > 0) {
            setProjectDropdown(response.responseData)
          } else {
            setProjectDropdown([])
          }
        } else {
          setProjectDropdown([])
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const getSelectedFromDate = (value, dateString) => {
    console.log('from date', dateString)
    setExpectIndentDate(dateString)
  }
  const getSelectedToDate = (value, dateString) => {
    console.log('to date', dateString)
  }
  const clearform = () => {
    console.log('clear all fields')
  }
  const FieldsComponent = () => {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <p style={{ marginRight: '10px' }} htmlFor="taskType">
            From Date <span style={{ color: 'red' }}>*</span>
          </p>
          <DatePicker defaultVal={expectindentDate} onChange={getSelectedFromDate} />
          <p style={{ marginRight: '10px', marginLeft: '10px' }} htmlFor="taskCategory">
            To Date <span style={{ color: 'red' }}>*</span>
          </p>
          <DatePicker defaultVal={expectindentDate} onChange={getSelectedToDate} />
          <p style={{ marginRight: '10px', marginLeft: '10px' }} htmlFor="taskCategory">
            Project <span style={{ color: 'red' }}>*</span>
          </p>
          <Select
            placeholder="Select Project"
            style={{ width: '200px' }}
            // onChange={(value, option) => handleSelectChange(value, option)}
          >
            <Option value="getall">Get All</Option>
            {projectDropdown &&
              projectDropdown.map(item => (
                <Option key={item.projCode} value={item.projCode}>
                  {item.projCode}-{item.customerName}
                </Option>
              ))}
          </Select>
        </div>
      </div>
    )
  }

  return (
    <ModalPopup
      isModalVisible={isModalVisible}
      FieldsComponent={FieldsComponent}
      text="Request Management Add"
      onCancel={() => {
        clearform()
        handleCancel()
      }}
      width="900"
    />
  )
}

export default RequestManagementAdd
