import React, { useState, useEffect } from 'react'
import { Form, Table, Input, message } from 'antd'
import store from 'store'
import debounce from 'lodash.debounce'
import Buttons from 'components/shared/ButtonComponent'
import RemoveIcon from 'components/shared/RemoveIconComponent'
import ModalPopup from 'components/shared/ModalPopupComponent'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import messageReturn from '_helpers/messageReturn'

const AddAssyIndent = ({ handleCancel, isModalVisible }) => {
  const tenantid = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const [inputForm] = Form.useForm()
  const [allqtyForm] = Form.useForm()
  const [createMtrlStgRespVal, setCreateMtrlStgRespVal] = useState([])
  const [responseValue2, setResponseValue2] = useState([])
  const [submitBtnDisble, setSubmitBtnDisble] = useState(false)
  const [filtersinfo, setfilterinfo] = useState([])
  useEffect(() => {
    getCreateRespDtlVals()
    inputForm.resetFields()
    allqtyForm.resetFields()
  }, [isModalVisible])

  // useEffect(() => {
  //   inputForm.resetFields()
  //   allqtyForm.resetFields()
  // }, [isModalVisible])

  const getCreateRespDtlVals = async () => {
    const keyareaobj = {
      hdrId: store.get('ProjectID'),
      tenantId: tenantid,
    }
    const response = await indentFileUpload({
      requestPath: 'retrieveForMS',
      requestData: keyareaobj,
    })
    const updatedData = response?.responseData?.map((item, index) => {
      return { ...item, sno: index + 1 }
    })
    setCreateMtrlStgRespVal(updatedData || [])
    setResponseValue2(updatedData || [])
  }
  const productCode1 = []
  const productDesc1 = []
  const uomLongDesc1 = []
  const subAssy1 = []
  const station1 = []
  const specification1 = []
  const make1 = []

  if (createMtrlStgRespVal.length > 0) {
    createMtrlStgRespVal.map(h => {
      return productCode1.push(h.productCode)
    })

    createMtrlStgRespVal.map(h => {
      return productDesc1.push(h.productDesc)
    })

    createMtrlStgRespVal.map(h => {
      return uomLongDesc1.push(h.uomLongDesc)
    })

    createMtrlStgRespVal.map(h => {
      return subAssy1.push(h.subAssy)
    })
    createMtrlStgRespVal.map(h => {
      return station1.push(h.station)
    })

    createMtrlStgRespVal.map(h => {
      return specification1.push(h.specification)
    })
    createMtrlStgRespVal.map(h => {
      return make1.push(h.make)
    })
  }

  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== "" && self.indexOf(value) === index;
  }

  const productCode2 = productCode1.filter(distinct)
  const productDesc2 = productDesc1.filter(distinct)
  const uomLongDesc2 = uomLongDesc1.filter(distinct)
  const subAssy2 = subAssy1.filter(distinct)
  const station2 = station1.filter(distinct)
  const specification2 = specification1.filter(distinct)
  const make2 = make1.filter(distinct)

  const productCode3 = []
  const productDesc3 = []
  const uomLongDesc3 = []
  const subAssy3 = []
  const station3 = []
  const specification3 = []
  const make3 = []

  productCode2.sort((a, b) => a.localeCompare(b)).map(element => {
    return productCode3.push({
      text: element,
      value: element,
    })
  })

  productDesc2.sort((a, b) => a.localeCompare(b)).map(element => {
    return productDesc3.push({
      text: element,
      value: element,
    })
  })

  uomLongDesc2.map(element => {
    return uomLongDesc3.push({
      text: element,
      value: element,
    })
  })
  subAssy2.map(element => {
    return subAssy3.push({
      text: element,
      value: element,
    })
  })
  station2.sort((a, b) => a.localeCompare(b)).map(element => {
    return station3.push({
      text: element,
      value: element,
    })
  })

  specification2.map(element => {
    return specification3.push({
      text: element,
      value: element,
    })
  })

  make2.map(element => {
    return make3.push({
      text: element,
      value: element,
    })
  })

  const columns = [
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      width: '10%',
      filters: productCode3,
      filteredValue: filtersinfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      width: '15%',
      filters: productDesc3,
      filteredValue: filtersinfo.productDesc,
      onFilter: (value, record) => record?.productDesc === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      width: '17%',
      filters: specification3,
      filteredValue: filtersinfo.specification,
      onFilter: (value, record) => record?.specification === value,
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
      width: '7%',
      filters: make3,
      filteredValue: filtersinfo.make,
      onFilter: (value, record) => record?.make === value,
    },
    {
      title: 'Station',
      dataIndex: 'station',
      key: 'station',
      filters: station3,
      filteredValue: filtersinfo.station,
      onFilter: (value, record) => record?.station === value,
      width: '10%',
    },
    {
      title: 'Sub Assy.',
      dataIndex: 'subAssy',
      key: 'subAssy',
      filters: subAssy3,
      filteredValue: filtersinfo.subAssy,
      onFilter: (value, record) => record?.subAssy === value,
      width: '10%',
    },
    {
      title: 'Inventory Qty.',
      dataIndex: 'inventoryQtyOnHand',
      key: 'inventoryQtyOnHand',
      width: '7%',
      className: 'right-align-cell',
      render: text => Number(text).toFixed(0),
    },
    {
      title: 'UOM',
      dataIndex: 'uomLongDesc',
      key: 'uomLongDesc',
      filters: uomLongDesc3,
      filteredValue: filtersinfo.uomLongDesc,
      onFilter: (value, record) => record?.uomLongDesc === value,
      width: '6%',
    },
    {
      title: 'Allocate Qty.',
      dataIndex: 'availableQty',
      key: 'availableQty',
      width: '10%',
      render: (text, record) => (
        <Form form={inputForm}>
          <Form.Item name={`allctdQty${record.sno}`} initialValue={record.availableQty}>
            <Input
              type="number"
              style={{ textAlign: 'right' }}
              onChange={event => handleAllQtyChange(record, event, record.sno)}
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: '10%',
      render: (text, record, index) => <RemoveIcon onClick={() => handleRemove(record, index)} />,
    },
  ]

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const FieldsComponent = () => {
    const handleSearch = debounce(searchValue => {
      const filteringdatas = responseValue2.filter(item =>
        Object.keys(item).some(key =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
        ),
      )
      console.log(filteringdatas)
      setCreateMtrlStgRespVal(filteringdatas)
    }, 500)
    return (
      <div>
        <div>
          <Form form={allqtyForm}>
            <div className="row">
              <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3">
                <Form.Item
                  name="StageName"
                  label={
                    <span>
                      Stage Name<span style={{ color: 'red', marginRight: '22px' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Input placeholder="Enter Stage Name" style={{ width: '100%' }} />
                </Form.Item>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3">
                <Form.Item
                  name="qty"
                  label={
                    <span>
                      Qty.<span style={{ color: 'red', marginRight: '22px' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Input placeholder="Enter Qty." type="number" />
                </Form.Item>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-3 col-xl-3 col-xxl-3">
                <Form.Item
                  name="uom"
                  label={
                    <span>
                      UOM<span style={{ color: 'red', marginRight: '22px' }}>*</span>{' '}
                    </span>
                  }
                >
                  <Input placeholder="Enter UOM" type="text" />
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '10px',
            }}
          >
            <Buttons text="Allocate All" type="primary" onClick={setAllocateAll} />
            <Buttons text="Unallocate All" type="primary" onClick={setUnallocateAll} />
          </div>
          <Input.Search
            style={{ margin: '0 0 10px 0', width: '300px', display: 'none', float: 'right' }}
            placeholder="Search here..."
            enterButton
            // onSearch={handleSearch}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <div className="custom_antd_Table">
          <Table
            columns={columns}
            onChange={handleChange}
            dataSource={createMtrlStgRespVal}
            bordered
            pagination={false}
          />
        </div>
      </div>
    )
  }

  const ButtonsComponent = () => {
    return (
      <div>
        <div
          style={{
            textAlign: 'center',
            marginTop: '25px',
            justifyContent: 'center',
            display: 'flex',
            gap: '12px',
          }}
        >
          <Buttons text="Submit" type="primary" disable={submitBtnDisble} onClick={handleCreate} />
          <Buttons
            text="Cancel"
            type="primary"
            onClick={() => {
              handleClear()
              handleClearVals()
              handleCancel()
            }}
          />
        </div>
      </div>
    )
  }
  const handleRemove = (record, index) => {
    const newData = [...createMtrlStgRespVal]
    newData.splice(index, 1)
    setCreateMtrlStgRespVal(newData)
    // const newData = [...retrivaldata]
    // const updatedData = newData.filter((item, idx) => idx !== index)
    // setDeleteMileStones(updatedData)
    // setCreateMtrlStgRespVal(prevData => prevData.filter((_, index) => index !== indexToRemove))
  }
  const setAllocateAll = () => {
    if (createMtrlStgRespVal.length > 0) {
      const updatedValues = createMtrlStgRespVal.map(record => {
        const allocateQty = Number(record.inventoryQtyOnHand).toFixed(0)
        const fieldName = `allctdQty${record.sno}`
        return { [fieldName]: allocateQty }
      })
      inputForm.setFieldsValue(Object.assign({}, ...updatedValues))
    }
  }
  const setUnallocateAll = () => {
    if (createMtrlStgRespVal.length > 0) {
      const updatedValues = createMtrlStgRespVal.map(record => {
        const fieldName = `allctdQty${record.sno}`
        return { [fieldName]: '' }
      })
      inputForm.setFieldsValue(Object.assign({}, ...updatedValues))
    }
  }
  const handleAllQtyChange = (record, event, sno) => {
    // const qtyform = inputForm.getFieldsValue()
    if (Number(event.target.value) > Number(record.inventoryQtyOnHand)) {
      inputForm.setFieldsValue({ [`allctdQty${sno}`]: '' })
      messageReturn(630)
    } else {
      // setRequestedQtyValue(event.target.value)
      // const setIndexId = `allctdQty${sno}`
      inputForm.setFieldsValue({ [`allctdQty${sno}`]: event.target.value })
    }
  }
  const handleClear = () => {
    inputForm.resetFields()
    allqtyForm.resetFields()
  }
  const handleClearVals = () => {
    inputForm.resetFields()
    allqtyForm.resetFields()
  }
  const handleCreate = async () => {
    const qtyform = inputForm.getFieldsValue()
    const qtyform1 = allqtyForm.getFieldsValue()
    setSubmitBtnDisble(true)
    const updatedTableData = createMtrlStgRespVal.map(record => {
      return {
        qty: qtyform[`allctdQty${record.sno}`],
        productId: record.productId,
        tenantId: tenantid,
      }
    })
    const updatedData = updatedTableData && updatedTableData.filter(data => data.qty !== undefined)
    const isCheckEmpty =
      updatedTableData &&
      updatedTableData.filter(data => data.qty !== '' && data.qty !== '0' && data.qty !== undefined)
    if (
      qtyform1.StageName !== undefined &&
      qtyform1.qty !== undefined &&
      qtyform1.uom !== undefined &&
      qtyform1.StageName !== '' &&
      qtyform1.qty !== '' &&
      qtyform1.uom !== ''
    ) {
      if (updatedData.length > 0) {
        if (isCheckEmpty.length > 0) {
          const keyareaobj = {
            pmHdrId: store.get('ProjectID'),
            msName: qtyform1.StageName,
            stageQty: qtyform1.qty,
            createdBy: employeeId,
            tenantId: tenantid,
            uom: qtyform1.uom,
            msDtlList: isCheckEmpty,
          }
          const response = await indentFileUpload({
            requestPath: 'insertMsHdrAndDtl',
            requestData: keyareaobj,
          })
          if (response.responseCode === '200') {
            message.success(response.responseMessage)
            handleCancel()
            inputForm.resetFields()
            allqtyForm.resetFields()
            setSubmitBtnDisble(false)
          } else {
            message.error(response.responseMessage)
            setSubmitBtnDisble(false)
          }
        } else {
          messageReturn(631)
        }
      } else {
        messageReturn(632)
      }
    } else {
      messageReturn(405)
      setSubmitBtnDisble(false)
    }

    setSubmitBtnDisble(false)
  }

  return (
    <div style={{ marginTop: '10px', width: '100%', overflowX: 'auto' }}>
      <ModalPopup
        isModalVisible={isModalVisible}
        FieldsComponent={FieldsComponent}
        ButtonsComponent={ButtonsComponent}
        text="Create Material Staging"
        onCancel={() => {
          handleCancel()
        }}
        width="900"
      />
    </div>
  )
}

export default AddAssyIndent
