import React, { useState, useEffect } from 'react'
import { Card, Table, Skeleton, Popover, Button, Select, List, message } from 'antd'
import store from 'store'
import messageReturn from '_helpers/messageReturn'
import { EditOutlined } from '@ant-design/icons'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'

const ProjectInitiationMaster = () => {
  const [tableloading, setTableloading] = useState(true)
  const [tableData, setTableData] = useState([])
  const [designationData, setDesignationData] = useState([])
  const [popoverVisible, setPopoverVisible] = useState({})
  const [newDesi, setNewDesi] = useState('')
  const [designationDatas, setDesignationDatas] = useState([])
  const [popoverVisibles, setPopoverVisibles] = useState({})
  const [popoverDeptVisibles, setPopoverDeptVisibles] = useState({})
  const [departmentList, setDepartmentList] = useState([])
  const [newDesis, setNewDesis] = useState('')
  const [newDepart, setNewDepart] = useState('')
  const tenantId = store.get('tenantId')
  useEffect(() => {
    getProjectInitiationList()
    getDesignationList()
    getDepartment()
  }, [tenantId])
  const getDepartment = async () => {
    setDepartmentList([])
    try {
      const response = await indentFileUpload({
        requestPath: 'getDepartmentAndEmpInfo',
        requestData: {
          tenantId,
          isActive: '1',
          employeID: '',
        },
      })
      // const options = response.map(item => ({
      //   key: item.departmentCode,
      //   value: item.departmentName,
      // }))
      setDepartmentList(response)
    } catch (error) {
      console.error('Error fetching getDepartmentDropDownData:', error)
    }
  }
  const getDesignationList = async () => {
    const keyareaobj = {
      tenantID: tenantId,
    }

    try {
      const response = await indentFileUpload({
        requestPath: 'getEmpDesignationList',
        requestData: keyareaobj,
      })
      if (response && response.responseData) {
        setDesignationData(response.responseData)
        setDesignationDatas(response.responseData)
      }
    } catch (error) {
      console.error('Error fetching template list:', error)
    }
  }
  const handleVisibleChange = (index, visible) => {
    setPopoverVisible(prev => ({ ...prev, [index]: visible }))
  }
  const handleVisibleChanges = (index, visible) => {
    setPopoverVisibles(prev => ({ ...prev, [index]: visible }))
  }
  const handleVisibleDepthanges = (index, visible) => {
    setPopoverDeptVisibles(prev => ({ ...prev, [index]: visible }))
  }
  const getProjectInitiationList = async () => {
    const keyareaobj = {
      tenantID: tenantId,
    }

    try {
      const response = await indentFileUpload({
        requestPath: 'getProjectInitiationDtl',
        requestData: keyareaobj,
      })
      if (response && response.responseData) {
        if (response.responseData.length > 0) {
          setTableloading(false)
          const x = [...response.responseData]
          console.log(x)
          // setUniqueKey(prevKey => prevKey + 1)
          setTableData(x)
          // setTableData2(x)
        } else {
          setTableloading(false)
          // setUniqueKey(prevKey => prevKey + 1)
          // response.responseData.push({ ...emptyrow })
          setTableData(response.responseData)
          // setTableData2(response.responseData)
        }
      }
    } catch (error) {
      console.error('Error fetching template list:', error)
    }
  }

  const columns = [
    {
      title: (
        <span>
          Department Name <span style={{ color: 'red' }}>*</span>
        </span>
      ),
      dataIndex: 'departmentName',
      key: 'departmentName',
      width: '20%',
    },
    {
      title: (
        <span>
          Primary POC <span style={{ color: 'red' }}>*</span>
        </span>
      ),
      dataIndex: 'primaryPoc',
      key: 'primaryPoc',
      width: '10%',
      render: (text, record, index) => (
        <Popover
          content={renderPopoverContent(record, index)}
          title="Approving Designations"
          trigger="click"
          visible={popoverVisible[index]}
          onVisibleChange={visible => handleVisibleChange(index, visible)}
        >
          <Button style={{ color: text !== '' ? 'green' : 'blue' }} icon={<EditOutlined />} />
        </Popover>
      ),
    },
    {
      title: (
        <span>
          Master POC <span style={{ color: 'red' }}>*</span>
        </span>
      ),
      dataIndex: 'masterPoc',
      key: 'masterPoc',
      width: '10%',
      render: (text, record, index) => (
        <Popover
          content={renderPopoverContents(record, index)}
          title="Approving Designations"
          trigger="click"
          visible={popoverVisibles[index]}
          onVisibleChange={visible => handleVisibleChanges(index, visible)}
        >
          <Button style={{ color: text !== '' ? 'green' : 'blue' }} icon={<EditOutlined />} />
        </Popover>
      ),
    },
    {
      title: (
        <span>
          Department Assigned <span style={{ color: 'red' }}>*</span>
        </span>
      ),
      dataIndex: 'departmentAssigned',
      key: 'departmentAssigned',
      width: '10%',
      render: (text, record, index) => (
        <Popover
          content={renderDeptAssgndContents(record, index)}
          title="Approving Department"
          trigger="click"
          visible={popoverDeptVisibles[index]}
          onVisibleChange={visible => handleVisibleDepthanges(index, visible)}
        >
          <Button style={{ color: text !== '' ? 'green' : 'blue' }} icon={<EditOutlined />} />
        </Popover>
      ),
    },
  ]
  const renderPopoverContent = (record, index) => (
    <div>
      <List
        size="small"
        bordered
        dataSource={
          record.primaryPoc
            ? record.primaryPoc.split(',').map(code => {
                const desiObj = designationData.find(d => d.designationCode === code)
                return desiObj || code
              })
            : []
        }
        renderItem={desi => (
          <List.Item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'baseline',
              }}
            >
              <p>{desi.designationDesc}</p>
              <Button
                type="link"
                onClick={() => handleRemoveDesignation(index, desi.designationCode)}
              >
                Remove
              </Button>{' '}
              {/* Pass the object */}
            </div>
          </List.Item>
        )}
      />
      <Select
        showSearch
        placeholder="Select a designation"
        value={newDesi}
        style={{ width: '100%', marginTop: 10 }}
        onChange={value => setNewDesi(value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {designationData.map(desi => (
          <Select.Option key={desi.designationCode} value={desi.designationCode}>
            {desi.designationDesc}
          </Select.Option>
        ))}
      </Select>
      <div style={{ textAlign: 'center' }}>
        <Button
          style={{ marginTop: 10 }}
          type="primary"
          onClick={() => handleAddDesignation(index)}
        >
          Add
        </Button>
      </div>
    </div>
  )
  const renderPopoverContents = (record, index) => (
    <div>
      <List
        size="small"
        bordered
        dataSource={
          record.masterPoc
            ? record.masterPoc.split(',').map(code => {
                const desiObjs = designationDatas.find(d => d.designationCode === code)
                return desiObjs || code
              })
            : []
        }
        renderItem={desis => (
          <List.Item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'baseline',
              }}
            >
              <p>{desis.designationDesc}</p>
              <Button
                type="link"
                onClick={() => handleRemoveDesignations(index, desis.designationCode)}
              >
                Remove
              </Button>{' '}
              {/* Pass the object */}
            </div>
          </List.Item>
        )}
      />
      <Select
        showSearch
        placeholder="Select a designation"
        value={newDesis}
        style={{ width: '100%', marginTop: 10 }}
        onChange={value => setNewDesis(value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {designationDatas.map(desis => (
          <Select.Option key={desis.designationCode} value={desis.designationCode}>
            {desis.designationDesc}
          </Select.Option>
        ))}
      </Select>
      <div style={{ textAlign: 'center' }}>
        <Button
          style={{ marginTop: 10 }}
          type="primary"
          onClick={() => handleAddDesignations(index)}
        >
          Add
        </Button>
      </div>
    </div>
  )

  const renderDeptAssgndContents = (record, index) => (
    <div>
      <List
        size="small"
        bordered
        dataSource={
          record.departmentAssigned
            ? record.departmentAssigned.split(',').map(code => {
                const deptObjs = departmentList.find(d => d.departmentCode === code)
                return deptObjs || code
              })
            : []
        }
        renderItem={deprt => (
          <List.Item>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                alignItems: 'baseline',
              }}
            >
              <p>{deprt.departmentName}</p>
              <Button
                type="link"
                onClick={() => handleRemoveDepartment(index, deprt.departmentCode)}
              >
                Remove
              </Button>{' '}
              {/* Pass the object */}
            </div>
          </List.Item>
        )}
      />
      <Select
        showSearch
        placeholder="Select a Department"
        value={newDepart}
        style={{ width: '100%', marginTop: 10 }}
        onChange={value => setNewDepart(value)}
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
      >
        {departmentList.map(depart => (
          <Select.Option key={depart.departmentCode} value={depart.departmentCode}>
            {depart.departmentName}
          </Select.Option>
        ))}
      </Select>
      <div style={{ textAlign: 'center' }}>
        <Button style={{ marginTop: 10 }} type="primary" onClick={() => handleAddDepartment(index)}>
          Add
        </Button>
      </div>
    </div>
  )

  const handleAddDesignation = index => {
    console.log(index)
    if (!newDesi) {
      messageReturn(624)
      return
    }

    const newData = [...tableData]
    const currentDesi = newData[index].primaryPoc ? newData[index].primaryPoc.split(',') : []
    console.log(currentDesi)
    if (currentDesi.includes(newDesi)) {
      messageReturn(625)
      return
    }

    currentDesi.push(newDesi)
    newData[index].primaryPoc = currentDesi.join(',')
    setTableData(newData)
    setNewDesi('')
  }
  const handleAddDesignations = index => {
    console.log(index)
    if (!newDesis) {
      messageReturn(624)
      return
    }

    const newData = [...tableData]
    const currentDesis = newData[index].masterPoc ? newData[index].masterPoc.split(',') : []
    console.log(currentDesis)
    if (currentDesis.includes(newDesis)) {
      messageReturn(625)
      return
    }

    currentDesis.push(newDesis)
    newData[index].masterPoc = currentDesis.join(',')
    setTableData(newData)
    setNewDesis('')
  }

  const handleAddDepartment = index => {
    console.log(index)
    if (!newDepart) {
      messageReturn(624)
      return
    }

    const newData = [...tableData]
    const currentDepart = newData[index].departmentAssigned
      ? newData[index].departmentAssigned.split(',')
      : []
    console.log(currentDepart)
    if (currentDepart.includes(newDepart)) {
      messageReturn(625)
      return
    }

    currentDepart.push(newDepart)
    newData[index].departmentAssigned = currentDepart.join(',')
    setTableData(newData)
    setNewDepart('')
  }

  const handleRemoveDesignation = (index, desi) => {
    const newData = [...tableData]
    const currentDesi = newData[index].primaryPoc.split(',').filter(d => d !== desi)
    newData[index].primaryPoc = currentDesi.join(',')
    setTableData(newData)
  }
  const handleRemoveDesignations = (index, desi) => {
    console.log('index',index);
    const newData = [...tableData]
    const currentDesi = newData[index].masterPoc.split(',').filter(d => d !== desi)
    newData[index].masterPoc = currentDesi.join(',')
    setTableData(newData)
  }
  const handleRemoveDepartment = (index, depart) => {
    const newData = [...tableData]
    const currentDepart = newData[index].departmentAssigned.split(',').filter(d => d !== depart)
    newData[index].departmentAssigned = currentDepart.join(',')
    setTableData(newData)
  }
  const insertTableData = async () => {
    const filteredData = tableData.filter(
      row => row.primaryPoc !== '' && row.masterPoc !== '' && row.departmentAssigned !== '',
    )
    const isValid = filteredData.every(
      row => row.primaryPoc && row.masterPoc && row.departmentAssigned,
    )

    if (!isValid) {
      messageReturn(405)
      return
    }
    // if (tableData.length < 2) {
    //   return;
    // }
    console.log('--------------->check inserted data<------------------')
    try {
      const updatedTableData = filteredData.map(row => {
        const updatedRow = {
          // ...row,
          primaryPoc: row.primaryPoc,
          masterPoc: row.masterPoc,
          departmentAssigned: row.departmentAssigned,
          piId: row.piId,
          // tenantId,
          // empId: employeeId,
        }
        console.log(row.primaryPoc)
        console.log(row.masterPoc)
        Object.keys(updatedRow).forEach(key => {
          if (!updatedRow[key]) {
            updatedRow[key] = null
          }
        })
        return updatedRow
      })
      const dataArray = updatedTableData.map(item => {
        if (item.docStatus === 'New') {
          item.docStatus = ''
        }
        return item
      })
      console.log(dataArray)
      const response = await indentFileUpload({
        requestPath: 'updateProjectIntiationMaster',
        requestData: dataArray,
      })
      if (response && response.responseCode === '200') {
        message.success(response.responseMessage)
        getProjectInitiationList()
      }
    } catch (error) {
      console.error('Error fetching template list:', error)
    }
  }
  return (
    <div>
      <Card title="Project Initiation Master" bordered={false}>
        <Skeleton active loading={tableloading}>
          <Table
            columns={columns}
            dataSource={tableData}
            pagination={false}
            rowKey={(record, index) => index}
          />
          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px',
              justifyContent: 'center',
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                insertTableData()
              }}
            >
              Submit
            </Button>
          </div>
        </Skeleton>
      </Card>
    </div>
  )
}
export default ProjectInitiationMaster
