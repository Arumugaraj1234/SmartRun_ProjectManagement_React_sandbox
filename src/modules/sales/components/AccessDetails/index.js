import React, { useState, useEffect } from 'react'
import { message, Space } from 'antd'
import moment from 'moment'
import store from 'store'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import AddIconButton from 'components/shared/AddIconComponent'
import DropDownComponent from 'components/shared/DropDownComponent'
import AccessDtlRemove from 'services/common/DocumentManagement/AccessDtlRemoveService'
import AccessDtlInsert from 'services/common/DocumentManagement/AccessDtlInsertService'
import AccessDtlSerivce from 'services/common/DocumentManagement/AccessDetailService'
import getDepartmentAndEmployeeDropDownDataService from 'services/common/getDepartmentAndEmployeeDropDownDataService'
import messageReturn from '_helpers/messageReturn'
import Input from '../../../../components/shared/InputComponent'
import ModalPopup from '../../../../components/shared/ModalPopupComponent'
import Button from '../../../../components/shared/ButtonComponent'
import Table from '../../../../components/common/TableComponent'

// import InsertAssignTeamDataService from 'services/common/InsertAssignTeamDataService'

const createEmptyRow = () => ({
  depname: '',
  startDate: moment().format('DD-MMM-YYYY'),
  dmaId: '',
  key: '',
})

const AccessDetails = ({
  handleCancel = () => {},
  fetchapprovalServicedata = () => {},
  handleDelete,
  isModalVisible,
  docName,
  docType,
  docId,
  createdBy,
}) => {
  const Tab = store.get('Tab')
  const employeID = ''
  const employeeId = store.get('employeeId')

  const { tenantId } = Tab
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [selectedValue, setSelectedValue] = useState(undefined)
  const [depcode, setDepcode] = useState(undefined)

  const [insertData, setInsertData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [accessData, setAccessData] = useState([createEmptyRow()])
  // const [accessDtl, setaccessDtl] = useState([])
  const [fieldDisabled, setFieldDisabled] = useState(true)
  const [submitBtnDisbl, setSubmitBtnDisbl] = useState(false)

  useEffect(() => {
    setFieldDisabled(true)
    getDepartmentDropDownData()
    fetchAccessData()
  }, [])
  useEffect(() => {
    if (deleteSuccess) {
      setDeleteSuccess(false)
    }
  }, [deleteSuccess])

  // useEffect(() => {
  //   setAccessData([createEmptyRow()]);
  // }, [accessresponsedata]);

  const fetchAccessData = async () => {
    const response = await AccessDtlSerivce({ documId: docId, tenId: tenantId })
    const httpResponse = response ?? ''
    if (httpResponse) {
      // setaccessDtl(httpResponse)
      const origionalData = httpResponse.map((h, index) => ({
        depname: h.deptName,
        key: index + 1,
        startDate: moment(h.enabledDateTime).format('DD-MMM-YYYY'),
        dmaId: h.dmaId,
      }))
      setAccessData([...origionalData, ...accessData])
    }
  }
  const handleRemoveRow = async (dmaId, key) => {
    if (dmaId) {
      const dmaIdArray = [
        {
          dmaId,
          tenantId,
          empId: employeeId,
        },
      ]
      const returnData = await AccessDtlRemove(dmaIdArray)
      if (returnData.responseMessage) {
        handleDelete()
        message.info(returnData.responseMessage)
        setDeleteSuccess(true)
      }
    }
    const filteredAccessData = accessData.filter(item => item.key !== key)
    setAccessData(filteredAccessData)
    const filteredInsertData = insertData.filter(item => item.key !== key && item.key !== '')
    setInsertData(filteredInsertData)
  }

  const getDepartmentDropDownData = async () => {
    try {
      const returnData = await getDepartmentAndEmployeeDropDownDataService({
        tenantId,
        isActive: '1',
        employeID,
      })
      const options = returnData.map(item => ({
        key: item.departmentCode,
        value: item.departmentName,
      }))
      setDepartmentData(options)
      return returnData
    } catch (error) {
      console.error('Error fetching getDepartmentDropDownData:', error)
      return null
    }
  }

  const handleSubmit = async () => {
    setSubmitBtnDisbl(true)
    if (depcode) {
      const largestKey = insertData.reduce((maxKey, item) => Math.max(maxKey, item.key), 0)
      const newinsert = {
        key: largestKey + 1,
        tenantId,
        deptCode: depcode,
        startDate: moment().format('DD-MMM-YYYY'),
        dmId: docId,
      }
      const updatedlastrow = [...insertData, newinsert]
      const returnData = await AccessDtlInsert(updatedlastrow)
      if (returnData) {
        message.info(returnData.responseMessage)
        handleCancel()
        fetchapprovalServicedata()
        setSubmitBtnDisbl(false)
      }
    } else {
      setSubmitBtnDisbl(false)
      messageReturn(637)
    }
  }

  const handleAddRow = () => {
    if (selectedValue !== '' && selectedValue !== undefined) {
      const largestKey = accessData.reduce((maxKey, item) => Math.max(maxKey, item.key), 0)

      const filteredAccessData = accessData.filter(item => item.key !== '')

      const newData = {
        key: largestKey + 1,
        depname: selectedValue,
        startDate: moment().format('DD-MMM-YYYY'),
        dmaId: '',
      }

      const insval = {
        key: largestKey + 1,
        tenantId,
        deptCode: depcode,
        startDate: moment().format('DD-MMM-YYYY'),
        dmId: docId,
      }

      setInsertData([...insertData, insval])
      setAccessData([...filteredAccessData, newData, createEmptyRow()])

      setSelectedValue(undefined)
    } else {
      messageReturn(637)
    }
  }

  const handleInputChange = (fieldName, value, option) => {
    console.log(value)
    if (fieldName === 'Department') {
      setDepcode(option.key)
      setSelectedValue(option.value)
    }
  }

  const columns = [
    {
      title: 'Department',
      dataIndex: 'depname',
      key: 'depname',
      render: (text, record, index) =>
        index === accessData.length - 1 ? (
          <DropDownComponent
            data={departmentData}
            value={selectedValue}
            onChange={option => setSelectedValue(option.value)}
            onSelect={(value, option) => handleInputChange('Department', value, option)}
          />
        ) : (
          text
        ),
    },
    {
      title: 'Effective Date',
      dataIndex: 'startDate',
      key: 'startDate',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record, index) => (
        <Space>
          {index === accessData.length - 1 ? (
            <div>
              <AddIconButton onClick={handleAddRow} />
            </div>
          ) : null}
          {index !== accessData.length - 1 ? (
            <div>
              <RemoveIcon onClick={() => handleRemoveRow(record.dmaId, record.key)} />
            </div>
          ) : null}
        </Space>
      ),
    },
  ]

  const FieldsComponent = () => (
    <div>
      <div className="row">
        <div className="col-4">
          <p> Document Name </p>
          <Input color="black" value={docName} disabled={fieldDisabled} colors="black" />
        </div>
        <div className="col-4">
          <p> Document Type </p>
          <Input color="black" value={docType} disabled={fieldDisabled} colors="black" />
        </div>
        <div className="col-4">
          <p>Created By </p>
          <Input color="black" value={createdBy} disabled={fieldDisabled} colors="black" />
        </div>
      </div>
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <Table columns={columns} data={accessData} />
      </div>
    </div>
  )

  const ButtonsComponent = () => (
    <div style={{ textAlign: 'center', marginTop: '25px', justifyContent: 'center' }}>
      <Button
        text="Submit"
        type="primary"
        marginright="10px"
        disable={submitBtnDisbl}
        onClick={handleSubmit}
      />
      <Button text="Cancel" type="primary" onClick={handleCancel} />
    </div>
  )

  return (
    <ModalPopup
      isModalVisible={isModalVisible}
      FieldsComponent={FieldsComponent}
      ButtonsComponent={ButtonsComponent}
      text="Access Control"
      onCancel={handleCancel}
    />
  )
}

export default AccessDetails
