import React, { useState, useEffect, useCallback } from 'react'
import store from 'store'
import {
  Select,
  Card,
  Button,
  Divider,
  Table,
  Input,
  message,
  Popover,
  List,
  AutoComplete,
  Form,
  Row,
  Col,
  Skeleton,
} from 'antd'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import { EditOutlined } from '@ant-design/icons'
import { useMediaQuery } from 'react-responsive'
import AddIconComponent from 'components/shared/AddIconComponent'
import RemoveIconComponent from 'components/shared/RemoveIconComponent'
import messageReturn from '_helpers/messageReturn'
import ExtendTable from '../ExtendTable'

const DocumentLifecycle = () => {
  const tenantID = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const [searchForm] = Form.useForm()
  const [inputForm] = Form.useForm()

  const [documentGroup, setDocumentGroup] = useState([])
  const [documentGroupCode, setDocumentGroupCode] = useState('')

  const [uniqueKey, setUniqueKey] = useState(0)
  const [docGroupValue, setDocGroupValue] = useState('')
  const [tableData, setTableData] = useState([])
  const [tableloading, setTableloading] = useState(true)
  const [documentList, setDocumentList] = useState([])
  const [documentStatusList, setDocumentStatusList] = useState([])
  const [selectedDocumentType, setSelectedDocumentType] = useState(null)
  const [popoverVisible, setPopoverVisible] = useState({})
  const [newDesi, setNewDesi] = useState('')
  const [designationData, setDesignationData] = useState([])
  // const [tableData2, setTableData2] = useState([])
  const [pmlistArray, setPmlistArray] = useState([])
  const [tableWidth, setTableWidth] = useState('300px')
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const formSelected = searchForm.getFieldsValue()
  const emptyrow = {
    dsmId: '',
    docType: '',
    docTypeDesc: '',
    docStatus: '',
    docStatusDesc: '',
    curSeq: '',
    apprDesiCode: '',
    lastSeq: 0,
    nextSeq: '',
    cancelSeq: '',
    isEditable: 1,
    isActive: 1,
    seqBatch: '',
    sno: '',
  }

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 30}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getDocumentsList = useCallback(async () => {
    const formValues = searchForm.getFieldsValue()
    setDocumentList([])
    setDocumentGroup([])
    setTableData([])
    searchForm.resetFields(['documentType'])
    searchForm.setFieldsValue({
      documentGroup: '',
    })
    try {
      const keyareaobj = {
        tenantId: tenantID,
        processCode: formValues.pmList,
      }
      const response = await indentFileUpload({
        requestPath: 'getDocTypes',
        requestData: keyareaobj,
      })

      if (response && response.responseData) {
        const options = response?.responseData?.map(item => ({
          ...item,
          label: item.docTypeDesc,
          value: item.docTypeCode,
        }))
        setDocumentList(options)
      } else {
        setDocumentList([])
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }, [tenantID])

  const getDocumentStatusList = async () => {
    const formValues = searchForm.getFieldsValue()

    try {
      const keyareaobj = {
        tenantId: tenantID,
        pmHdrId: formValues.pmList || '',
      }
      const response = await indentFileUpload({
        requestPath: 'getDocStatusTypes',
        requestData: keyareaobj,
      })

      if (response && response.responseData) {
        const options = response?.responseData?.map(item => ({
          ...item,
          key: item.docTypeCode,
          value: item.docTypeDesc,
        }))
        setDocumentStatusList(options)
      } else {
        setDocumentStatusList([])
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }

  useEffect(() => {
    getDocumentsList()
    getDesignationList()
    getPmList()
  }, [])

  const getTemplateList = async () => {
    const formValues = searchForm.getFieldsValue()
    // setTableData2([])

    if (
      formValues.documentType !== undefined &&
      formValues.pmList !== undefined &&
      formValues.documentGroup !== undefined
    ) {
      const keyareaobj = {
        docType: selectedDocumentType,
        tenantId: tenantID,
        processCode: formValues.pmList,
        docGroup: docGroupValue,
      }

      try {
        const response = await indentFileUpload({
          requestPath: 'getDocTypesDataList',
          requestData: keyareaobj,
        })
        if (response && response.responseData) {
          if (response.responseData.length > 0) {
            setTableloading(false)
            const maxSno = Math.max(...response.responseData.map(item => item.sno))
            emptyrow.sno = maxSno + 1

            const x = [...response.responseData, emptyrow]

            setUniqueKey(prevKey => prevKey + 1)
            setTableData(x)
            // setTableData2(x)
          } else {
            setTableloading(false)
            setUniqueKey(prevKey => prevKey + 1)
            emptyrow.sno = 1
            response.responseData.push({ ...emptyrow })
            setTableData(response.responseData)
            // setTableData2(response.responseData)
          }
        }
      } catch (error) {
        console.error('Error fetching template list:', error)
      }
    } else {
      messageReturn(405)
    }
  }

  const getDesignationList = async () => {
    const keyareaobj = {
      tenantID,
    }

    try {
      const response = await indentFileUpload({
        requestPath: 'getEmpDesignationList',
        requestData: keyareaobj,
      })
      if (response && response.responseData) {
        setDesignationData(response.responseData)
      }
    } catch (error) {
      console.error('Error fetching template list:', error)
    }
  }

  const getPmList = async () => {
    const keyareaobj = {
      tenantID,
    }

    try {
      const response = await indentFileUpload({
        requestPath: 'getPmIdList',
        requestData: keyareaobj,
      })
      if (response && response.responseData) {
        const options = response?.responseData?.map(item => ({
          ...item,
          label: item.designationDesc,
          value: item.designationCode,
        }))
        setPmlistArray(options)
      }
    } catch (error) {
      console.error('Error fetching template list:', error)
    }
  }

  const clearTable = () => {
    setTableData([])
    // setTableData2([])
    setSelectedDocumentType(null)
    searchForm.resetFields()
  }

  const handleInputChange = (index, key, value) => {
    const newData = [...tableData]

    if (key === 'curSeq') {
      const maxSeq = Math.max(...tableData.map(row => parseInt(row.curSeq, 10) || 0))
      const newSeq = parseInt(value, 10)

      if (newSeq < 1 || newSeq > maxSeq + 1) {
        messageReturn(null, `Sequence must be between 1 and ${maxSeq + 1}`, 'error')
        return
      }

      const duplicate = tableData.some(
        (row, idx) => parseInt(row.curSeq, 10) === newSeq && idx !== index,
      )
      if (duplicate) {
        messageReturn(null, `Sequence ${newSeq} already exists`, 'error')
        return
      }
    }

    if (['seqBatch', 'cancelSeq', 'nextSeq'].includes(key)) {
      const maxSeq = Math.max(...tableData.map(row => parseInt(row.curSeq, 10) || 0))
      const newSeq = parseInt(value, 10)

      if (newSeq < 1 || newSeq > maxSeq) {
        messageReturn(null, `Sequence must be between 1 and ${maxSeq}`, 'error')
        return
      }
    }

    if (key === 'processCode') {
      const valueToUpdate = value
      tableData.forEach((row, idx) => {
        if (idx !== index) {
          row.processCode = valueToUpdate
        }
      })
      newData[index][key] = valueToUpdate
    }

    if (key === 'isEditable') {
      const valueToUpdate = value
      newData[index][key] = valueToUpdate
    }
    // if (key === 'isActive') {
    //   const valueToUpdate = value
    //   newData[index][key] = valueToUpdate
    // }

    if (key === 'lastSeq') {
      if (value === 1) {
        newData.forEach((row, idx) => {
          if (idx !== index) {
            row.lastSeq = 0
          }
        })
      }
    }

    newData[index][key] = value
    setTableData(newData)
  }

  const handleInputChanged = (index, key, option) => {
    const newData = [...tableData]
    if (key === 'docStatus') {
      const duplicate = tableData.some((row, idx) => row.docStatus === option.key && idx !== index)
      if (duplicate) {
        messageReturn(623)
        newData[index].docStatus = ''
        newData[index].docStatusDesc = ''
      } else {
        newData[index].docStatus = option.key
        newData[index].docStatusDesc = option.value
      }
    }
    setTableData(newData)
  }

  const handleDocstatuschange = (index, key, value) => {
    const newData = [...tableData]
    if (key === 'docStatus') {
      const data = documentStatusList.find(d => d.value === value)
      if (data) {
        newData[index].docStatus = data.key
        newData[index].docStatusDesc = data.value
      } else {
        newData[index].docStatus = 'New'
        newData[index].docStatusDesc = value
      }
    }
  }

  const handleAddDesignation = index => {
    if (!newDesi) {
      messageReturn(624)
      return
    }

    const newData = [...tableData]
    const currentDesi = newData[index].apprDesiCode ? newData[index].apprDesiCode.split(',') : []
    console.log(currentDesi)
    if (currentDesi.includes(newDesi)) {
      messageReturn(625)
      return
    }

    currentDesi.push(newDesi)
    newData[index].apprDesiCode = currentDesi.join(',')
    setTableData(newData)
    setNewDesi('')
  }

  const handleRemoveDesignation = (index, desi) => {
    const newData = [...tableData]
    const currentDesi = newData[index].apprDesiCode.split(',').filter(d => d !== desi)
    newData[index].apprDesiCode = currentDesi.join(',')
    setTableData(newData)
  }

  const handleVisibleChange = (index, visible) => {
    setPopoverVisible(prev => ({ ...prev, [index]: visible }))
  }

  const renderPopoverContent = (record, index) => (
    <div>
      <List
        size="small"
        bordered
        dataSource={
          record.apprDesiCode
            ? record.apprDesiCode.split(',').map(code => {
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
  useEffect(() => {
    const newTableData = tableData.map(item => {
      if (!documentStatusList.find(status => status.value === item.docStatus)) {
        return { ...item, docStatus: '', docStatusDesc: '' }
      }
      return item
    })
    setTableData(newTableData)
  }, [documentStatusList])

  const handleInputChanges = (index, value) => {
    setTableData(prevData => {
      const newData = [...prevData]
      newData[index] = { ...newData[index], curSeq: value }
      return newData
    })
  }

  const handleValidation = (index, value) => {
    if (value !== '') {
      const newSeq = parseInt(value, 10)
      const sequences = tableData.map(({ curSeq }) => parseInt(curSeq, 10))
      const maxSeq = Math.max(...sequences, 0)

      if (Number.isNaN(newSeq) || newSeq < 1 || newSeq > maxSeq + 1) {
        message.error(`Sequence must be a number between 1 and ${maxSeq + 1}`)
        return ''
      }

      const isDuplicate = tableData.some(
        ({ curSeq }, idx) => parseInt(curSeq, 10) === newSeq && idx !== index,
      )

      if (isDuplicate) {
        setTableData(prevData => {
          const newData = [...prevData]
          newData[index] = { ...newData[index], curSeq: '' }
          return newData
        })
        message.error(`Sequence ${newSeq} already exists`)
        return ''
      }

      const isDuplicateValue = tableData.some(
        ({ curSeq }, idx) => curSeq === parseInt(value, 10) && idx === index,
      )
      // const isContinuous = (sequences.includes(newSeq - 1) && isDuplicate) || sequences.length === 0;

      if (isDuplicateValue) return ''
      // if (!isContinuous) {
      //   setTableData(prevData => {
      //     const newData = [...prevData];
      //     newData[index] = { ...newData[index], curSeq: '' };
      //     return newData;
      //   });
      //   message.error(`Sequence must be continuous. Insert ${newSeq - 1} before ${newSeq}.`);
      //   return '';
      // }
    }
    if (value === '') {
      setTableData(prevData => {
        const newData = [...prevData]
        newData[index] = { ...newData[index], curSeq: '' }
        return newData
      })
      return ''
    }
    return value
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Enter') {
      const { value } = e.target
      const validValue = handleValidation(index, value)
      if (validValue !== undefined) {
        handleInputChanges(index, validValue)
      }
    }
  }

  const handleBlur = (index, e) => {
    const { value } = e.target
    const validValue = handleValidation(index, value)
    if (validValue !== undefined && validValue !== '') {
      handleInputChanges(index, validValue)
    }
  }

  const columns = [
    // {
    //   title: (
    //     <span>
    //       Process Code <span style={{ color: 'red' }}>*</span>
    //     </span>
    //   ),
    //   dataIndex: 'procesCode',
    //   key: 'procesCode',
    //   width: '150px',
    //   render: (text, record, index) => (
    //     <Select
    //       options={pmlistArray}
    //       placeholder="Search to Select"
    //       value={text}
    //       style={{ width: '150px' }}
    //       onChange={(value) => { handleInputChange(index, 'procesCode', value); getDocumentStatusList(value) }}
    //     />
    //   )
    // },
    {
      title: (
        <span>
          Document Status <span style={{ color: 'red' }}>*</span>
        </span>
      ),
      dataIndex: 'docStatus',
      key: 'docStatus',
      width: '20%',
      render: (text, record, index) => (
        <Form form={inputForm} style={{ marginTop: '20px' }}>
          <Form.Item name={`docStatus${record.sno}`}>
            <AutoComplete
              options={documentStatusList}
              onSelect={(value, option) => handleInputChanged(index, 'docStatus', option, value)}
              // value={text}
              defaultValue={record.docStatusDesc}
              filterOption={(inputValue, option) =>
                option?.value?.toUpperCase().indexOf(inputValue?.toUpperCase()) !== -1
              }
            >
              <Input
                placeholder="Select here"
                value={text}
                onChange={e => handleDocstatuschange(index, 'docStatus', e.target.value)}
              />
            </AutoComplete>
          </Form.Item>
        </Form>
      ),
    },
    // {
    //   title: (
    //     <span>
    //       Document Group
    //     </span>
    //   ),
    //   dataIndex: 'docGroup',
    //   key: 'docGroup',
    //   width: '200px',
    //   render: (text, record, index) => (
    //     <AutoComplete
    //       options={documentStatusList}
    //       onSelect={(value, option) => handleInputChanged(index, 'docGroup', value, option)}
    //       // value={text}
    //       defaultValue={record.docStatusDesc}
    //       filterOption={(inputValue, option) =>
    //         option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
    //       }
    //     >
    //       <Input placeholder="Select here" onChange={(e) => handleDocstatuschange(index, 'docStatus', e.target.value)} />
    //     </AutoComplete>
    //   ),
    // },
    {
      title: (
        <span>
          Sequence <span style={{ color: 'red' }}>*</span>
        </span>
      ),
      dataIndex: 'curSeq',
      key: 'curSeq',
      width: '10%',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={e => handleInputChanges(index, e.target.value)}
          onKeyDown={e => handleKeyDown(index, e)}
          onBlur={e => handleBlur(index, e)}
        />
      ),
    },
    {
      title: (
        <span>
          Approving Designations <span style={{ color: 'red' }}>*</span>
        </span>
      ),
      dataIndex: 'apprDesiCode',
      key: 'apprDesiCode',
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
          Last Sequence <span style={{ color: 'red' }}>*</span>
        </span>
      ),
      dataIndex: 'lastSeq',
      key: 'lastSeq',
      width: '10%',
      render: (text, record, index) => (
        <Select
          placeholder="Please select"
          style={{ width: '100%' }}
          value={text}
          onChange={value => handleInputChange(index, 'lastSeq', value)}
        >
          <Select.Option value={1}>True</Select.Option>
          <Select.Option value={0}>False</Select.Option>
        </Select>
      ),
    },

    {
      title: 'Sequence Batch',
      dataIndex: 'seqBatch',
      key: 'seqBatch',
      width: '10%',
      render: (text, record, index) => (
        <Input value={text} onChange={e => handleInputChange(index, 'seqBatch', e.target.value)} />
      ),
    },
    {
      title: 'Cancel Seq',
      dataIndex: 'cancelSeq',
      key: 'cancelSeq',
      width: '10%',
      render: (text, record, index) => (
        <Input value={text} onChange={e => handleInputChange(index, 'cancelSeq', e.target.value)} />
      ),
    },
    {
      title: 'Next Seq',
      dataIndex: 'nextSeq',
      key: 'nextSeq',
      width: '10%',
      render: (text, record, index) => (
        <Input value={text} onChange={e => handleInputChange(index, 'nextSeq', e.target.value)} />
      ),
    },
    {
      title: (
        <span>
          Editable <span style={{ color: 'red' }}>*</span>
        </span>
      ),
      dataIndex: 'isEditable',
      key: 'isEditable',
      width: '10%',
      render: (text, record, index) => (
        <Select
          placeholder="Please select"
          style={{ width: '100%' }}
          value={text}
          onChange={value => handleInputChange(index, 'isEditable', value)}
        >
          <Select.Option value={1}>True</Select.Option>
          <Select.Option value={0}>False</Select.Option>
        </Select>
      ),
    },
    // {
    //   title: (
    //     <span>
    //       Active <span style={{ color: 'red' }}>*</span>
    //     </span>
    //   ),
    //   dataIndex: 'isActive',
    //   key: 'isActive',
    //   width: '10%',
    //   render: (text, record, index) => (
    //     <Select
    //       placeholder="Please select"
    //       style={{ width: '100%' }}
    //       value={text}
    //       onChange={value => handleInputChange(index, 'isActive', value)}
    //     >
    //       <Select.Option value={1}>True</Select.Option>
    //       <Select.Option value={0}>False</Select.Option>
    //     </Select>
    //   ),
    // },
    {
      title: 'Action',
      dataIndex: 'isEditable',
      key: 'isEditable',
      render: (text, record, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
          {index !== tableData.length - 1 && (
            <RemoveIconComponent onClick={() => Removerow(index)} />
          )}
          {index === tableData.length - 1 && <AddIconComponent onClick={() => Addnewrow()} />}
        </div>
      ),
    },
  ]

  const Addnewrow = () => {
    const lastRowIndex = tableData.length - 1
    const lastRow = tableData[lastRowIndex]
    const mandatoryFields = ['docStatus', 'curSeq', 'apprDesiCode']
    const missingFields = mandatoryFields.filter(field => !lastRow[field])
    const areMandatoryFieldsFilled = missingFields.length === 0

    if (!areMandatoryFieldsFilled) {
      // const missingFieldsMessage = missingFields.map(field => `\`${field}\``).join(', ')
      messageReturn(405)
      return
    }
    // const maxSno = Math.max(tableData.map(item => item.sno))
    const maxSno = Math.max(...tableData.map((item, index) => index + 1))
    emptyrow.sno = maxSno + 1
    setTableData([...tableData, { ...emptyrow }])
  }

  const Removerow = index => {
    const newTableData = tableData.filter((_, rowIndex) => rowIndex !== index)
    setTableData(newTableData)
  }

  useEffect(() => {
    setTableData(tableData)
  }, [tableData])

  const handleSetAsDefault = async dataArr => {
    const response = await indentFileUpload({
      requestPath: 'setDefaultDoc',
      requestData: dataArr,
    })
    if (response && response.responseCode === '200') {
      getTemplateList()
    }
  }

  const insertTableData = async () => {
    // const isValid = tableData.every(row => (
    //   row.docStatus && row.curSeq && row.apprDesiCode && row.lastSeq !== '' && row.isEditable !== ''
    // ));

    const filteredData = tableData.filter(
      row => row.docStatus !== '' && row.curSeq !== '' && row.apprDesiCode !== '',
    )
    const isValid = filteredData.every(row => {
      const isMissing =
        !row.docStatus ||
        !row.curSeq ||
        !row.apprDesiCode ||
        row.lastSeq === '' ||
        row.isEditable === ''
      if (isMissing) {
        console.log(
          `row with sno: ${row.sno} is missing one of the following: docStatus, curSeq, apprDesiCode, lastSeq, isEditable`,
        )
      }
      return !isMissing
    })

    if (!isValid) {
      messageReturn(405)
      return
    }
    // if (tableData.length < 2) {
    //   return;
    // }
    try {
      const updatedTableData = filteredData.map(row => {
        const updatedRow = {
          ...row,
          docType: selectedDocumentType,
          tenantId: tenantID,
          docGroup: docGroupValue,
          processCode: formSelected.pmList,
          empId: employeeId,
          isActive: row.isActive ? row.isActive : 1,
        }
        // Object.keys(updatedRow).forEach(key => {
        //   if (!updatedRow[key] && key !== 'isActive') {
        //     updatedRow[key] = null
        //   }
        // })

        return updatedRow
      })
      const dataArray = updatedTableData.map(item => {
        if (item.docStatus === 'New') {
          item.docStatus = ''
        }
        return item
      })
      // const reqObj = {
      //   deletetArr: tableData2
      //     .filter(row => !tableData.some(data => data.dsmId === row.dsmId))
      //     .map(row => row),
      //   insertArr: dataArray,
      // }

      const response = await indentFileUpload({
        requestPath: 'updateDocLifeCycleVersion',
        requestData: dataArray,
      })
      if (response && response.responseCode === '200') {
        message.success(response.responseMessage)
        getTemplateList()
      }
    } catch (error) {
      console.error('Error fetching template list:', error)
    }
  }

  const handlegetDocGroup = async values => {
    // Handle form submission
    setDocumentGroup([])
    searchForm.setFieldsValue({
      documentGroup: '',
    })
    setTableData([])
    setSelectedDocumentType(values)
    const formValues = searchForm.getFieldsValue()
    const props = {
      docType: formValues.documentType,
      processCode: formValues.pmList,
      tenantId: tenantID,
    }

    const response = await indentFileUpload({
      requestPath: 'getDocGroups',
      requestData: props,
    })
    if (response.responseCode === '200') {
      const options = response?.responseData?.map(item => ({
        key: item.docGroupCode,
        value: item.docGroupDesc,
      }))

      setDocumentGroup(options)
    } else {
      setDocumentGroup([])
    }
  }

  const handleDocGroupInputChange = (e, option) => {
    setDocGroupValue(option?.key)
    setDocumentGroupCode(option?.key)
    if (option?.key === '' || option?.key === undefined || option?.key === null) {
      setDocGroupValue(e)
      setDocumentGroupCode(e)
    }
  }

  return (
    <div style={isMobile ? { width: tableWidth } : {}}>
      <Card title="Document Lifecycle" bordered={false}>
        <Form form={searchForm} onFinish={getTemplateList} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
              <Form.Item
                name="pmList"
                label="Process Type"
                rules={[{ required: true, message: 'Please select Process Type' }]}
              >
                <Select
                  id="pmList"
                  className="form-control"
                  style={{ width: '100%' }}
                  options={pmlistArray}
                  placeholder="Select Process Type"
                  // value={text}
                  onChange={() => {
                    getDocumentsList()
                    getDocumentStatusList()
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
              <Form.Item
                name="documentType"
                label="Document Type"
                rules={[{ required: true, message: 'Please select Document Type' }]}
              >
                <Select
                  id="documentType"
                  className="form-control"
                  style={{ width: '100%' }}
                  placeholder="Select Document Type"
                  options={documentList}
                  value={selectedDocumentType}
                  onChange={value => handlegetDocGroup(value)}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6} xl={5} xxl={4}>
              <Form.Item
                name="documentGroup"
                label="Document Group"
                rules={[{ required: true, message: 'Please select document group' }]}
              >
                <AutoComplete
                  id="documentgroup"
                  style={{ width: '100%' }}
                  options={documentGroup}
                  // data={documentGroup}
                  // value={documentGroupCode}
                  // onChange={text => setDocumentGroupCode(text)}
                  onSelect={(value, option) => handleDocGroupInputChange(value, option)}
                  // value={text}
                  // defaultValue={record.docStatusDesc}
                  filterOption={(inputValue, option) =>
                    option?.value?.toUpperCase().indexOf(inputValue?.toUpperCase()) !== -1
                  }
                >
                  <Input
                    placeholder="Select Document Group"
                    onChange={(e, option) => handleDocGroupInputChange(e.target.value, option)}
                  />
                </AutoComplete>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <div
          style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}
        >
          <Button
            type="primary"
            onClick={() => {
              getTemplateList()
              setTableData([])
            }}
          >
            Get Details
          </Button>
          <Button type="primary" onClick={clearTable}>
            Clear
          </Button>
        </div>
        <Divider />
        {tableData && tableData.length > 0 ? (
          <div>
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
          </div>
        ) : null}

        <div style={{ display: tableData && tableData.length > 0 ? 'block' : 'none' }}>
          <Divider />
          <ExtendTable
            tableData={tableData}
            key={uniqueKey}
            docTypeSelect={formSelected.documentType}
            processCode={formSelected.pmList}
            docGroupval={documentGroupCode}
            handleSetAsDefault={handleSetAsDefault}
          />
        </div>
      </Card>
    </div>
  )
}

export default DocumentLifecycle
