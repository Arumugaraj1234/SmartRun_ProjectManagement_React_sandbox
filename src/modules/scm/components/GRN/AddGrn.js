import React, { useState, useEffect } from 'react'
import store from 'store'
import { Modal, Form, Input, message, Select } from 'antd'
import { Table } from 'ant-table-extensions'
import ButtonComponent from 'components/shared/ButtonComponent'
import messageReturn from '_helpers/messageReturn'
import Grnfields from './Grnfields'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const AddGrn = ({ onClose, visible }) => {
  const { Option } = Select
  const [projectList, setProjectList] = useState([])
  const [projectData, setProjectData] = useState([])
  const [allqtyForm] = Form.useForm()
  // const [allqtyForm1] = Form.useForm()
  const [locForm] = Form.useForm()
  const [locationlist, setlocationlist] = useState([])
  const [pmhdrId, setPmhdrId] = useState(null)
  const [disableInsrtBtn, setDisableInsrtBtn] = useState(false)

  const tenantId = store.get('tenantId')
  const empId = store.get('employeeId')

  useEffect(() => {
    getLocationlist()
  }, [])

  // const columns = [
  //   {
  //     title: 'Part Number',
  //     dataIndex: 'productCode',
  //     key: 'productCode',
  //     render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
  //   },
  //   {
  //     title: 'Description',
  //     dataIndex: 'description',
  //     key: 'description',
  //     render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
  //   },
  //   {
  //     title: 'Material',
  //     dataIndex: 'material',
  //     key: 'material',
  //     render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
  //   },
  //   {
  //     title: 'Make',
  //     dataIndex: 'make',
  //     key: 'material',
  //     render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
  //   },
  //   {
  //     title: 'Specification',
  //     dataIndex: 'specification',
  //     key: 'material',
  //     render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
  //   },
  //   {
  //     title: 'GRN Qty',
  //     dataIndex: 'orderedQty',
  //     key: 'material',
  //     render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
  //   },
  //   {
  //     title: 'Inspected Qty',
  //     dataIndex: 'inspectedQty',
  //     key: 'material',
  //     render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
  //   },
  //   {
  //     title: 'GRN Received Qty',
  //     dataIndex: 'grnReceivedQty',
  //     key: 'material',
  //     render: (text, record, index) => (
  //       <Form form={allqtyForm}>
  //         <Form.Item name={`receiveqty${index}`} initialValue={record.grnReceivedQty}>
  //           <Input
  //             value={record.grnReceivedQty}
  //             onChange={handleQtyChang}
  //             placeholder="Inward Qty.."
  //             type="number"
  //             name="qtyfieldvalue"
  //           />
  //         </Form.Item>
  //       </Form>
  //     ),
  //   },
  // ]

  const getLocationlist = async () => {
    const response = await indentFileUpload({
      requestPath: 'getInvLocationForInward',
      requestData: {
        tenantId,
      },
    })
    if (response?.responseCode === '200') {
      setlocationlist(response?.responseData)
    } else {
      message.error(response.responseMessage)
    }
  }

  const getDtls = async (formData, isVisible) => {
    // allqtyForm1.resetFields();
    const isMandatory =
      isVisible === '1'
        ? formData.Projectcode !== undefined && formData.PONo !== undefined
        : formData.Projectcode !== undefined
    if (isMandatory) {
      setPmhdrId(formData.Projectcode)
      const response = await indentFileUpload({
        requestPath: 'getDcDtlByDcId',
        requestData: {
          tenantId,
          dcHdrId: formData.PONo,
        },
      })
      if (response) {
        if (response.responseCode === '200') {
          if (response.responseData && response.responseData.length > 0) {
            setProjectData(response?.responseData)
            setProjectList(response?.responseData?.[0].dcDtlList)
          } else {
            messageReturn(619)
            setProjectData([])
            setProjectList([])
          }
        } else {
          messageReturn(619)
          setProjectData([])
          setProjectList([])
        }
      }
    } else {
      messageReturn(405)
    }
  }

  useEffect(() => {
    const values = {}
    projectList.forEach((record, index) => {
      values[`bin_${index}`] = record.bin
    })
    allqtyForm.setFieldsValue(values)
  }, [projectList])

  const columns = [
    {
      title: 'Description of Goods',
      dataIndex: 'descOfGoods',
      key: 'descOfGoods',
      width: '20%',
    },
    {
      title: 'HSN Code',
      dataIndex: 'hsnNo',
      key: 'hsnNo',
      width: '10%',
      align: 'right',
    },
    {
      title: 'Qty.',
      dataIndex: 'qty',
      key: 'qty',
      width: '10%',
      align: 'right',
      render: text => (text !== null || text !== undefined ? parseFloat(text) : ''),
    },
    {
      title: 'Received Qty.',
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      width: '10%',
      align: 'right',
      render: text => (text !== null || text !== undefined ? parseFloat(text) : ''),
    },
    {
      title: 'UOM',
      dataIndex: 'uomDesc',
      key: 'uomDesc',
      width: '10%',
    },
    {
      title: `Unit Rate `,
      dataIndex: 'rate',
      key: 'rate',
      align: 'right',
      width: '10%',
      // render: text => getFormattedValue(text),
    },
    {
      title: `Total Value `,
      dataIndex: 'total',
      key: 'total',
      align: 'right',
      width: '10%',
      // render: text => getFormattedValue(text),
    },
    {
      title: 'GRN Qty.',
      dataIndex: 'grnqty',
      key: 'material',
      align: 'right',
      width: '15%',
      render: (text, record, index) => (
        <Form form={allqtyForm}>
          <Form.Item name={`receiveqty_${index}`}>
            <Input
              // value={record.grnReceivedQty}
              onChange={e => handleQtyChang(e.target.value, record, index)}
              placeholder="GRN Qty.."
              type="number"
              step="0.01"
              name="qtyfieldvalue"
            />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: 'BIN',
      dataIndex: 'bin',
      key: 'bin',
      width: '15%',
      render: (text, record, index) => {
        return (
          <Form form={allqtyForm}>
            <Form.Item name={`bin_${index}`}>
              <Input maxLength={8} />
            </Form.Item>
          </Form>
        )
      },
    },
  ]

  const handleClear = () => {
    setProjectList([])
  }

  const handleQtyChang = (value, record, index) => {
  if (value !== '') {
    if (parseFloat(value) !== 0) {
      if (
        parseFloat(record.qty) - parseFloat(record.receivedQty) >=
        parseFloat(value)
      ) {
        allqtyForm.setFieldsValue({ [`receiveqty_${index}`]: parseFloat(value) })
      } else {
        allqtyForm.setFieldsValue({ [`receiveqty_${index}`]: '' })
        messageReturn(663)
      }
    } else {
      allqtyForm.setFieldsValue({ [`receiveqty_${index}`]: '' })
      messageReturn(664)
    }
  }
}
  const handleAllocate = () => {
    if (projectData.length > 0) {
      const updatedValues = projectData[0].dcDtlList.map((record, index) => {
        const grnqty = Number(record?.qty || 0) - Number(record?.receivedQty || 0)
        const fieldName = `receiveqty_${index}`
        return { [fieldName]: grnqty }
      })
      allqtyForm.setFieldsValue(Object.assign({}, ...updatedValues))
    }
  }
  const handleUnAllocate = () => {
    if (projectData.length > 0) {
      const updatedValues = projectData[0].dcDtlList.map((record, index) => {
        const fieldName = `receiveqty_${index}`
        return { [fieldName]: 0 }
      })
      allqtyForm.setFieldsValue(Object.assign({}, ...updatedValues))
    }
  }

  const UpdateGRNMaterialInwrdDtls = async () => {
    const formValues = allqtyForm.getFieldsValue()
    const formVal = locForm.getFieldsValue()
    if (formVal.Location !== undefined) {
      let check = false
      Object.keys(formValues).forEach(key => {
        if (Object.prototype.hasOwnProperty.call(formValues, key)) {
          if (formValues[key] !== undefined) {
            check = true
          }
        }
      })
      if (check === true) {
        if (projectData.length > 0) {
          setDisableInsrtBtn(true)
          const reqArr = projectData[0].dcDtlList.map((item, index) => {
            return {
              recivedQty: (formValues[`receiveqty_${index}`] || 0).toString(),
              bin: (formValues[`bin_${index}`] || '').toString(),
              poDtlId: projectData[0].poDtlId,
              tenantId,
              // indentDtlId: projectData[0].indentDtlId,
              indentDtlId: item.indentDtlId,
              pmHdrId: pmhdrId,
              productCode: item.productCode,
              createdBy: empId,
              // dcDtlId: item.dcId,
              dcDtlId: item.dcDtlId,
              qty: item.qty,
              uom: item.uom,
              productId: item.hdrId,
            }
          })

          const reqObj = projectData.reduce((acc, item) => {
            const newObj = {
              grnDate: item.dcDate,
              createdBy: empId,
              tenantId,
              poId: '0',
              poCode: item.poCode,
              invLocation: formVal.Location,
              grnDtlList: reqArr,
            }
            return { ...acc, newObj }
          }, {})

          const response = await indentFileUpload({
            requestPath: 'insertGrnHdrAndDtl',
            requestData: reqObj.newObj,
          })
          if (response) {
            if (response.responseCode === '200') {
              allqtyForm.resetFields()
              setDisableInsrtBtn(false)
              onClose()
              message.success(response.responseMessage)
            } else {
              setDisableInsrtBtn(false)
              message.error(response.responseMessage)
            }
          }
        } else {
          setDisableInsrtBtn(false)
        }
      } else {
        setDisableInsrtBtn(false)
        messageReturn(665)
      }
    } else {
      setDisableInsrtBtn(false)
      messageReturn(405)
    }
  }
  return (
    <div>
      <Modal title="Create GRN" visible={visible} width="900" onCancel={onClose} footer={null}>
        <div>
          <Grnfields
            onGetDetails={getDtls}
            onClear={handleClear}
            showMinwardDrpDwn="1"
            isVisible="1"
          />
          {projectList.length > 0 && (
            <div>
              <div className="row mt-1">
                <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    <ButtonComponent type="primary" text="Allocate All" onClick={handleAllocate} />
                    <ButtonComponent type="primary" text="Unallocate" onClick={handleUnAllocate} />
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
                  <Form form={locForm}>
                    <Form.Item
                      name="Location"
                      label={
                        <span>
                          Location<span style={{ color: 'red', marginRight: '22px' }}>*</span>{' '}
                        </span>
                      }
                    >
                      <Select style={{ width: '100%' }} placeholder="Select Location">
                        {locationlist?.map(item => (
                          <Option
                            key={item.inventoryLocationCode}
                            value={item.inventoryLocationCode}
                          >
                            {item.inventoryLocationDescription}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form>
                </div>
              </div>
              <Table columns={columns} dataSource={projectList} scroll={{ y: 400 }} />
              <center>
                <ButtonComponent
                  text="Submit"
                  type="primary"
                  onClick={UpdateGRNMaterialInwrdDtls}
                  disable={disableInsrtBtn}
                />
                &nbsp;&nbsp;&nbsp;
                <ButtonComponent type="primary" text="Clear" onClick={handleClear} />
              </center>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default AddGrn
