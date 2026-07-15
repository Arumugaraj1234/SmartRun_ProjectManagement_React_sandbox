import React, { useState, useEffect } from 'react'
import store from 'store'
import { Table, Select, AutoComplete, message } from 'antd'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import AddIcon from 'components/shared/AddIconComponent'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import BackButtonComponent from 'components/common/BackBtnComponent'
import messageReturn from '_helpers/messageReturn'

const SubAssembly = () => {
  const [subRetrieval, setSubRetrieval] = useState([])
  const [substationdata, setSubstationdata] = useState([])
  const [substationid, setSubstationid] = useState(undefined)
  const [substationvalue, setSubstationvalue] = useState(undefined)
  const [subassydata, setSubassydata] = useState(undefined)
  const [filtersInfo, setfilterinfo] = useState({})

  const emptydata = {
    deHdrid: '',
    pskDesc: '',
    pkDesc: '',
    tenantId: '',
    pksaId: '',
  }
  const tenantId = store.get('tenantId')
  const PmHdrIdVal = store.get('ProjectID')
  const { Option } = Select
  useEffect(() => {
    getRetrivaldata()
    getKeySubAreaFun()
    getSubAssydata()
  }, [])

  const getRetrivaldata = async () => {
    const props = {
      pmHdrId: PmHdrIdVal,
      tenantId,
    }
    const httpgetdetails = await IndentGroupgetDetails({
      requestPath: 'getKeySubAreaDtl',
      requestData: props,
    })

    if (httpgetdetails.responseCode === '200') {
      setSubRetrieval([...httpgetdetails.responseData, emptydata])
    } else {
      setSubRetrieval([emptydata])
    }
  }

  const handleAddSubRows = async record => {
    if (record.pskDesc !== '' && record.pkDesc !== '') {
      const props = {
        phHdrId: PmHdrIdVal,
        pkaId: substationid,
        pskId: record.pskDesc,
        pksaId: '',
        tenantId,
      }
      const httpupdate = await IndentGroupgetDetails({
        requestPath: 'updatedesignSubKeyArea',
        requestData: [props],
      })
      if (httpupdate.responseCode === '200') {
        message.success(httpupdate.responseMessage)
        getRetrivaldata()
        setSubstationid(undefined)
        setSubstationvalue(undefined)
      } else {
        message.error(httpupdate.responseMessage)
      }
    } else {
      messageReturn(405)
    }
  }

  const handleRemoveSubRows = async id => {
    const props = {
      pksaId: id,
      tenantId,
    }
    const httpupdate = await IndentGroupgetDetails({
      requestPath: 'deletedesignSubKeyArea',
      requestData: props,
    })
    if (httpupdate.responseCode === '200') {
      message.success(httpupdate.responseMessage)
      getRetrivaldata()
      setSubstationid(undefined)
      setSubstationvalue(undefined)
    } else {
      message.error(httpupdate.responseMessage)
    }
  }

  const getKeySubAreaFun = async () => {
    try {
      const keyareaobj = {
        tenantId,
        pmHdrId: PmHdrIdVal,
      }

      const response = await IndentGroupgetDetails({
        requestPath: 'getKeyArea',
        requestData: keyareaobj,
      })

      if (response && response.responseData) {
        const options = response.responseData.map(item => ({
          key: item.pkaId,
          value: `${item.keyName} - (${item.code})`,
          code: item.code,
        }))
        setSubstationdata(options)
      } else {
        console.error('Error: Response data is missing')
      }
    } catch (error) {
      console.error('Error fetching key area:', error)
    }
  }

  const handlesubassyChange = (val, code, ind) => {
    const updatedDatas = [...subRetrieval]
    updatedDatas[ind] = { ...updatedDatas[ind], pskDesc: val }
    setSubRetrieval(updatedDatas)
  }
  const handlekeyAreaChange = (val, c, ind) => {
    const updatedVal = val.replace(` - (${c.code})`, '');
    const updatedDatas = [...subRetrieval]
    updatedDatas[ind] = { ...updatedDatas[ind], pskDesc: updatedVal }
    setSubRetrieval(updatedDatas)
  }

  const handlestationchange = (index, value) => {
    const newData = [...subRetrieval]
    newData[index].pkDesc = value
    setSubRetrieval(newData)
  }

  const getSubAssydata = async () => {
    const props = {
      pmHdrId: '',
      tenantId,
    }

    const response = await IndentGroupgetDetails({
      requestPath: 'getKeySubArea',
      requestData: props,
    })

    if (response.responseCode === '200') {
      const options = response.responseData.map(item => ({
        key: item.pkaId,
        value: `${item.keyName} - (${item.code})`,
        code: item.code,
      }))
      setSubassydata(options)
    }
  }

  // const distinct = (value, index, self) => {
  //   return self.indexOf(value) === index
  // }

  const distinctValues = () => {
    if (!Array.isArray(subRetrieval)) {
      return []
    }
  
    return subRetrieval
      .filter(item => item.pkDesc && item.pkCode)
      .map(item => `${item.pkDesc} - (${item.pkCode})`)
      .filter((value, index, self) => self.indexOf(value) === index) 
      .map(value => ({
        text: value,
        value,
      }))
  }

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const Subcolumnss = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      width: '10%',
      render: (text, record, index) => index + 1,
    },    
    {
      title: 'Station',
      dataIndex: 'pkDesc',
      key: 'pkDesc',
      width: '35%',
      render: (text, record, index) =>
        index === subRetrieval.length - 1 ? (
          <Select
            value={substationvalue}
            onChange={(value, option) => {
              handlestationchange(index, value, option);
              setSubstationvalue(value);
              setSubstationid(option.key);
            }}
            placeholder="Select Station"
            style={{ marginRight: '10px', width: '400px' }}
          >
            {substationdata.map(item => (
              <Option key={item.key} value={item.key}>
                {item.value}
              </Option>
            ))}
          </Select>
        ) : (
          `${record.pkDesc} - (${record.pkCode})`
        ),
      filters: distinctValues(), 
      filteredValue: filtersInfo.pkDesc,
      onFilter: (value, record) =>
        `${record.pkDesc} - (${record.pkCode})` === value, 
    },
    {
      title: 'Sub Assembly',
      dataIndex: 'pskDesc',
      key: 'pskDesc',
      width: '35%',
      render: (text, record, index) =>
        index === subRetrieval.length - 1 ? (
          <AutoComplete
            style={{ width: 400 }}
            options={subassydata}
            onSearch={(value, code) => handlesubassyChange(value, code, index)}
            onSelect={(value, code) => handlekeyAreaChange(value, code, index)}
          />
        ) : (
           `${record.pskDesc} - (${record.pskCode})`
        ),
    },

    {
      title: 'Action',
      dataIndex: 'employeeDept',
      key: 'employeeDept',
      width: '20%',
      render: (text, record, index) =>
        subRetrieval.length >= 1 ? (
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            {index === subRetrieval.length - 1 ? (
              <AddIcon onClick={() => handleAddSubRows(record, index)} />
            ) : null}

            {index !== subRetrieval.length - 1 ? (
              <RemoveIcon onClick={() => handleRemoveSubRows(record.pksaId)} />
            ) : null}
          </span>
        ) : null,
    },
  ]
  return (
    <div>
      <Table
        columns={Subcolumnss}
        dataSource={subRetrieval}
        pagination={false}
        onChange={handleChange}
      />
      <div style={{ margin: '10px' }}>
        <BackButtonComponent componentToRender="design" />
      </div>
    </div>
  )
}

export default SubAssembly
