import React, { useState, useEffect, useCallback } from 'react'
// import validator from 'validator'
import moment from 'moment'
import { Card, message, Button, Form, Input, Select, AutoComplete, DatePicker, Upload } from 'antd'
import { Table } from 'ant-table-extensions'
import { useHistory } from 'react-router-dom'
import { PlusOutlined, FileExcelOutlined, UploadOutlined } from '@ant-design/icons'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
// import ReactCountryDropdown from 'react-country-dropdown'
import store from 'store'
import ButtonComponent from 'components/shared/ButtonComponent'
import ModalPopup from 'components/shared/ModalPopupComponent'
import TextArea from 'antd/lib/input/TextArea'
import DownloadDocuments from 'components/common/FileDownloadComponent'
import { useMediaQuery } from 'react-responsive'
import messageReturn from '_helpers/messageReturn'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import currentDateTime from '../../../../currentDateTime'
import checkFileSize from '../../../../_helpers/fileUtill'

const VendorMater = () => {
  let defaultfilterData = {}
  const history = useHistory()
  if (history?.location?.state?.record?.refCode) {
    const splitText = history?.location?.state?.record?.refCode.split('-')
    defaultfilterData = {
      vendorUniqueCode: [splitText[0]],
      // "productDesc": [splitText[1]]
    }
  }

  const [form] = Form.useForm()
  const [vendorForm] = Form.useForm()
  const { Option } = Select
  const [vendorTab, setvendorTab] = useState([])
  const [insertVendorvisible, setinsertVendorvisible] = useState(false)
  const [vendordtlvisible, setvendordtlvisible] = useState(false)
  const [btndisable, setBtndisable] = useState(false)
  const [filtersinfo, setfilterinfo] = useState(defaultfilterData)
  const [filteredvendor, setfilteredvendor] = useState([])
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const [vendorCategory, setVendorCategory] = useState([])
  const [vendorMstDetailsTable, setVendorMstDetailsTable] = useState([])
  const [vendorDetailresponse, setVendorDetailresponse] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })
  const [tableWidth, setTableWidth] = useState('300px')
  // const [selectedCountry, setSelectedCountry] = useState('in')
  // const [isDropDownOpen, setIsDropDownOpen] = useState(true)

  const setVendorDtl = (record, index) => {
    console.log('record', index)
    const vname = index.vendorName
    // handleCountryChange(index.locCountryCode)
    form.setFieldsValue({
      VendorName: vname,
      Gst: index.gst,
      Pan: index.pan,
      Email: index.emailId,
      VendorType: index.vendorType,
      PoType: index.potype === '1' ? 'Local' : 'Import',
      LocationRefName: index.locationRefName,
      Address: index.locAddressLine,
      City: index.locCity,
      State: index.locState,
      Country: index.locCountryCode,
      Pincode: index.locPinCode,
      VendorCode: index.vendorUniqueCode,
      LocationId: index.locationId,
      Contactno: index.contactNo,
      suppliercategory: index.vendorCategory,
      gstType: index.gstType,
      currencyType: index.currencyType,
    })
  }
  // const validateEmail = () => {
  //   const formData = form.getFieldsValue()
  //   const value = formData.Email
  //   const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //   // Your custom validation logic here
  //   if (emailRegex.test(value)) {
  //     // callback(''); // Valid email
  //     setBtndisable(false)
  //   } else {
  //     // callback('Please enter a valid email address!');
  //     setBtndisable(true)
  //     // message.error('error')
  //   }
  // }
  const column1 = [
    {
      title: 'Inspection Rating',
      dataIndex: 'inspectionRating',
      key: 'inspectionRating',
    },
    {
      title: 'Inspected ON',
      dataIndex: 'inspectionDate',
      key: 'inspectionDate',
      render: text => moment(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Inspected By',
      dataIndex: 'inspectedBy',
      key: 'inspectedBy',
    },
    {
      title: 'Action',
      dataIndex: 'dmId',
      key: 'dmId',
      render: (text, record) => {
        return (
          <div>
            {record && record.dmId !== '0' ? (
              <DownloadDocuments
                isPdf={record.isPdf}
                tenanrId={tenantId}
                refid={record.dmId}
                fileDocode=""
                docTypeCode=""
              />
            ) : (
              '-'
            )}
          </div>
        )
      },
    },
  ]
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      setTableWidth(`${screenWidth - 30}px`)
    }

    window.addEventListener('resize', handleResize)
    handleResize() // Initial call to set width on component mount

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getVendortableDetails = async record => {
    const response = await indentFileUpload({
      requestPath: 'getVendorInspRatingDtls',
      requestData: {
        empId: employeeId,
        tenantId,
        vendorCode: record.vendorCode,
      },
    })
    if (response?.responseData) {
      setVendorDetailresponse(response?.responseData[0])
      setVendorMstDetailsTable(response?.responseData[0]?.list)
    }
  }
  const handleDetailCancel = () => {
    form.resetFields()
    setinsertVendorvisible(false)
    setvendordtlvisible(false)
    setBtndisable(false)
  }
  // const handleCountryChange = country => {
  //   console.log(country)
  //   const countryCode = country.code.toLowerCase() // Convert country code to lowercase (e.g., "IN" -> "in")
  //   setSelectedCountry(countryCode)
  //   form.setFieldsValue({ Contactno: '' })
  //   form.setFieldsValue({ Country: country.name })
  // }

  const openinsertcard = () => {
    return (
      <div>
        <Form form={form}>
          <div className="row">
            {/* {vendordtlvisible ? () : null} / */}
            <div
              className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
              style={{ display: 'block' }}
            >
              <Form.Item name="VendorCode" label={<span>Vendor Code</span>}>
                <Input type="text" defaultValue="<--Auto Generated-->" disabled />
              </Form.Item>
            </div>

            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="VendorType"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Vendor Type<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select placeholder="Select Vendor Type">
                  <Option key={1} value={1}>
                    Approved
                  </Option>
                  <Option key={0} value={0}>
                    Not Approved
                  </Option>
                  <Option key={2} value={2}>
                    Blocked
                  </Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="VendorName"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Vendor Name<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Address"
                label={
                  <span>
                    Address<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <TextArea rows={3} />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                name="City"
                label={
                  <span>
                    City<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" />
                {/* <span style={{paddingLeft:'50px'}}><Input type="text" style={{width:'81%'}} /></span> */}
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="State"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    State<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input type="text" />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Country"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                initialValue="India"
                label={
                  <span>
                    Country<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                {/* <span>
                  {' '} */}
                {/* Ensures full width */}
                {/* <>
                    <ReactCountryDropdown
                      defaultCountry={selectedCountry}
                      onSelect={handleCountryChange}
                    />
                  </>
                </span> */}
                {/* <span> */}
                <Input type="text" />
                {/* </span> */}
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Pincode"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Pincode<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input
                  // type='text'
                  style={{ width: '100%' }}
                  maxLength={6}
                  onKeyPress={event => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault()
                    }
                  }}
                />
                {/* <span><Input type="text" maxLength={6} style={{ width: '100%' }} /></span> */}
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-2 col-xl-3">
              <Form.Item
                name="Contactno"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Contact No<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <PhoneInput
                  // country={selectedCountry}
                  countryCodeEditable={false}
                  // disableCountryCode
                  // onChange={setIsDropDownOpen(true)}
                  // disableDropdown="true"
                  placeholder="Enter phone number"
                  inputStyle={{ width: '100%' }}
                />
                {/* <span style={{paddingLeft:'50px'}}><Input type="text" style={{width:'81%'}} /></span> */}
              </Form.Item>
            </div>

            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                // onMouseLeave={validateEmail}
                name="Email"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Email Id<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
                rules={[{ type: 'email', message: 'Please Enter valid Email' }]}
              >
                <Input type="text" />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Gst"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    GST<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input maxLength={15} type="text" />
                {/* <span style={{paddingLeft: '80px'}}><Input maxLength={15} type="text" style={{ width: '72%' }}  /></span> */}
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="Pan"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    PAN<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input maxLength={12} type="text" />
                {/* <span style={{paddingLeft: '20px'}}><Input maxLength={10} type="text" style={{ width: '93%' }} /></span> */}
              </Form.Item>
            </div>

            {/* <div className='col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3'>
              <Form.Item
                name="PoType"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    PO Type<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select placeholder="Select Location">
                  <Option key={1} value={1}>
                    Domestic
                  </Option>
                  <Option key={2} value={2}>
                    Import
                  </Option>
                </Select>
              </Form.Item>
            </div> */}

            <div
              className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
              style={{ display: 'none' }}
            >
              <Form.Item
                name="LocationRefName"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                labelAlign="left"
                label={<span>Location Ref Name</span>}
              >
                <Input type="text" />
              </Form.Item>
            </div>

            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="suppliercategory"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Supplier Category<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                {/* <Select placeholder="Supplier Category">
                  {vendorCategory && vendorCategory.map((data) => {
                    return (
                      <Option key={data.vendorId} value={data.vendorId}>
                        {data.vendorCategory}
                      </Option>
                    );
                  })}
                </Select> */}
                <AutoComplete
                  style={{ width: 200 }}
                  placeholder="Select Category"
                  options={vendorCategory}
                  filterOption={(inputValue, option) =>
                    option && option.value?.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSelect={value => form.setFieldsValue({ suppliercategory: value })}
                  onSearch={value => form.setFieldsValue({ suppliercategory: value })}
                />
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="gstType"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    GST Type<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select placeholder="Select GST Type">
                  <Option value="1">SGST</Option>
                  <Option value="2">IGST</Option>
                  <Option value="3">NA</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
              <Form.Item
                name="currencyType"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                labelAlign="left"
                label={
                  <span>
                    Currency Type<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Input maxLength={3} type="text" />
                {/* <span style={{paddingLeft: '20px'}}><Input maxLength={10} type="text" style={{ width: '93%' }} /></span> */}
              </Form.Item>
            </div>

            {vendordtlvisible ? (
              <div
                className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3"
                style={{ display: 'none' }}
              >
                <Form.Item name="LocationId" label={<span>Location Id</span>}>
                  <Input type="text" style={{ width: '90%', marginLeft: '35px' }} disabled />
                  {/* <span style={{paddingLeft:'35px'}}><Input type="text" style={{ width: '90%' }} /></span> */}
                </Form.Item>
              </div>
            ) : null}
          </div>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}
          >
            {insertVendorvisible ? (
              <Button type="primary" disabled={btndisable} onClick={() => insertVendor(0)}>
                Submit
              </Button>
            ) : null}
            {vendordtlvisible ? (
              <Button type="primary" onClick={() => insertVendor(1)}>
                Update
              </Button>
            ) : null}

            <Button type="primary" onClick={handleDetailCancel}>
              Cancel
            </Button>
          </div>
        </Form>
        {vendordtlvisible && (
          <Form form={vendorForm}>
            <div style={{ width: '100%' }}>
              <h5>Vendor Master</h5>
              <Table columns={column1} dataSource={vendorMstDetailsTable} />
              {
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
                >
                  <h5>
                    Next Inspection On :{' '}
                    {vendorDetailresponse?.nextInspectionOn
                      ? moment(vendorDetailresponse?.nextInspectionOn).format('DD-MMM-YYYY')
                      : '-'}
                  </h5>
                  {vendorDetailresponse?.inspRaisedBtn === '1' ? (
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                      <Button onClick={raiseRequest} type="primary">
                        Raise Request
                      </Button>
                    </div>
                  ) : null}
                </div>
              }
              {vendorDetailresponse?.newRating === '1' ? (
                <div>
                  {vendorDetailresponse?.inspReqRaised === 1 ? (
                    <div>
                      <div className="row">
                        <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
                          <Form.Item
                            name="inspectionRating"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            labelAlign="left"
                            label={
                              <span>
                                New Rating<span style={{ color: 'red' }}>*</span>
                              </span>
                            }
                          >
                            <Select style={{ width: '100%' }} placeholder="Select Rating">
                              <Option value="A">A</Option>
                              <Option value="B">B</Option>
                              <Option value="C">C</Option>
                            </Select>
                          </Form.Item>
                        </div>
                        <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
                          <Form.Item
                            name="inspectionDate"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            labelAlign="left"
                            label={
                              <span>
                                Inspection Date<span style={{ color: 'red' }}>*</span>
                              </span>
                            }
                          >
                            <DatePicker
                              style={{ width: '100%' }}
                              disabledDate={d => !d || d.isAfter(moment())}
                            />
                          </Form.Item>
                        </div>
                        <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3">
                          <Form.Item
                            name="file"
                            label={
                              <span>
                                Upload Document<span style={{ color: 'red' }}>*</span>{' '}
                              </span>
                            }
                          >
                            <Upload
                              maxCount={1}
                              listType="text"
                              // onChange={onFileChange}
                              beforeUpload={beforeUpload1}
                              showUploadList={false}
                            >
                              <Button icon={<UploadOutlined />}>Choose File below 100MB</Button>
                            </Upload>
                          </Form.Item>
                          {selectedFile && (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <p style={{ margin: '0px' }}>
                                <b>Selected File : </b> {selectedFile.name}
                              </p>
                              <p style={{ margin: '0px' }}>
                                <b>File Size : </b> {(selectedFile.size / (1024 * 1024)).toFixed(2)}
                                MB
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div
                          style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
                        >
                          <Button onClick={insertnextInspection} type="primary">
                            Submit
                          </Button>
                          <Button onClick={clearVendorForm} style={{ marginLeft: '10px' }}>
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </Form>
        )}
      </div>
    )
  }
  const beforeUpload1 = file => {
    if (checkFileSize(file)) {
      setSelectedFile(file)
    } else {
      setSelectedFile(null)
    }
  }
  const clearVendorForm = () => {
    vendorForm.resetFields()
    setSelectedFile(null)
  }
  const raiseRequest = async () => {
    const response = await indentFileUpload({
      requestPath: 'updateInspectionRaised',
      requestData: {
        vendorCode: selectedRecord.vendorCode,
        tenantId,
        empId: employeeId,
      },
    })
    if (response?.responseCode === '200') {
      getVendortableDetails(selectedRecord)
      message.success(response?.responseMessage)
    }
  }
  const insertnextInspection = async () => {
    const formvalues = vendorForm.getFieldsValue()
    if (formvalues.inspectionRating && formvalues.inspectionDate && selectedFile !== null) {
      const reqObj = [
        {
          vendorCode: selectedRecord?.vendorCode,
          inspectionDate: formvalues.inspectionDate
            ? moment(formvalues.inspectionDate).format('YYYY-MM-DD')
            : '',
          inspectionRating: formvalues.inspectionRating,
          inspectedBy: employeeId,
          tenantId,
          type: 'Vendor',
        },
      ]
      const formData = new FormData()
      formData.append('vendorRatingReq', JSON.stringify({ reqObj }))
      formData.append('file', selectedFile)
      const response = await indentFileUpload({
        requestPath: 'vendorDtlInsert',
        requestData: formData,
      })
      if (response?.responseCode === '200') {
        clearVendorForm()
        getVendortableDetails(selectedRecord)
        message.success(response?.responseMessage)
      }
    } else {
      messageReturn(405)
    }
  }
  const insertVendor = async val => {
    const formData = form.getFieldsValue()
    if (
      formData.VendorName !== '' &&
      formData.VendorName !== undefined &&
      formData.Gst !== '' &&
      formData.Gst !== undefined &&
      formData.Pan !== '' &&
      formData.Pan !== undefined &&
      formData.Email !== '' &&
      formData.Email !== undefined &&
      // formData.PoType !== '' &&
      // formData.PoType !== undefined &&
      // formData.LocationRefName !== '' &&
      // formData.LocationRefName !== undefined &&
      formData.Address !== '' &&
      formData.Address !== undefined &&
      formData.City !== '' &&
      formData.City !== undefined &&
      formData.State !== '' &&
      formData.State !== undefined &&
      formData.Country !== '' &&
      formData.Country !== undefined &&
      formData.Pincode !== '' &&
      formData.Pincode !== undefined &&
      formData.Contactno !== '' &&
      formData.Contactno !== undefined &&
      formData.VendorType !== '' &&
      formData.VendorType !== undefined &&
      formData.suppliercategory !== '' &&
      formData.suppliercategory !== undefined &&
      formData.gstType &&
      formData.currencyType !== '' &&
      formData.currencyType !== undefined
    ) {
      const response = await indentFileUpload({
        requestPath: 'insertVendorDtls',
        requestData: {
          tenantId,
          vendorName: formData.VendorName,
          gst: formData.Gst,
          pan: formData.Pan,
          arn: '0',
          emailId: formData.Email,
          vendorStatus: '1',
          // poType: formData.PoType,
          vendorType: formData.VendorType,
          locationReferenceName:
            formData.LocationRefName !== undefined ? formData.LocationRefName : '',
          locationAddressLine: formData.Address,
          locationCity: formData.City,
          locationState: formData.State,
          locationConutryCode: formData.Country,
          locationPinCode: formData.Pincode,
          vendorCode: val === 0 ? '' : selectedRecord?.vendorCode,
          locationId: val === 0 ? '' : formData.LocationId,
          contactNo: formData.Contactno,
          supplyCategory: formData.suppliercategory,
          gstType: formData.gstType,
          currencyType: formData.currencyType,
        },
      })
      if (response?.responseCode === '200') {
        message.success(response?.responseMessage)
        setinsertVendorvisible(false)
        setvendordtlvisible(false)
        form.resetFields()
        getvendor()
      } else {
        message.error(response?.responseMessage)
      }
    } else {
      messageReturn(405)
    }
  }
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const vendorUniqueCode1 = []
  const Potype1 = []
  const venCat1 = []
  const locCity1 = []
  const locState1 = []
  const locCountryCode1 = []
  const reInspectionDate1 = []
  const inspectionRaised1 = []

  vendorTab.forEach(h => {
    vendorUniqueCode1.push(h.vendorUniqueCode)
  })
  vendorTab.forEach(h => {
    Potype1.push(h.vendorType)
  })
  vendorTab.forEach(h => {
    venCat1.push(h.vendorCategory)
  })
  vendorTab.forEach(h => {
    locCity1.push(h.locCity)
  })
  vendorTab.forEach(h => {
    locState1.push(h.locState)
  })
  vendorTab.forEach(h => {
    locCountryCode1.push(h.locCountryCode)
  })
  vendorTab.forEach(h => {
    reInspectionDate1.push(h.reInspectionDate)
  })
  vendorTab.forEach(h => {
    inspectionRaised1.push(h.inspectionRaised)
  })
  const distinct = (value, index, self) => {
    // return self.indexOf(value) === index
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const Potype2 = Potype1.filter(distinct)
  const venCat2 = venCat1.filter(distinct)
  const locCity2 = locCity1.filter(distinct)
  const locState2 = locState1.filter(distinct)
  const locCountryCode2 = locCountryCode1.filter(distinct)
  const reInspectionDate2 = reInspectionDate1.filter(distinct)
  const inspectionRaised2 = inspectionRaised1.filter(distinct)
  const vendorUniqueCode2 = vendorUniqueCode1.filter(distinct)

  const Potype3 = []
  const venCat3 = []
  const locCity3 = []
  const locState3 = []
  const locCountryCode3 = []
  const reInspectionDate3 = []
  const inspectionRaised3 = []
  const vendorUniqueCode3 = []

  Potype2.slice() // copy array
    .sort((a, b) => a - b) // numeric sort
    .forEach(element => {
      Potype3.push({
        text:
          element === 1
            ? 'Approved'
            : element === 0
            ? 'Not Approved'
            : element === 2
            ? 'Blocked'
            : '',
        value: element,
      })
    })

  vendorUniqueCode2
    .slice()
    .sort((a, b) => String(a).localeCompare(String(b))) // string sort
    .forEach(element => {
      vendorUniqueCode3.push({
        text: element,
        value: element,
      })
    })

  venCat2
    .slice()
    .sort((a, b) => String(a).localeCompare(String(b)))
    .forEach(element => {
      venCat3.push({
        text: element,
        value: element,
      })
    })

  locCity2
    .slice()
    .filter(Boolean) // remove null/undefined/empty
    .map(e => e.trim()) // remove extra spaces
    .sort((a, b) => a?.localeCompare(b, undefined, { sensitivity: 'base' })) // ignore case
    .forEach(element => {
      locCity3.push({
        text: element,
        value: element,
      })
    })

  locState2
    .slice()
    .filter(Boolean)
    .map(e => e.trim())
    .sort((a, b) => a?.localeCompare(b, undefined, { sensitivity: 'base' }))
    .forEach(element => {
      locState3.push({
        text: element,
        value: element,
      })
    })

  locCountryCode2
    .slice()
    .sort((a, b) => String(a).localeCompare(String(b)))
    .forEach(element => {
      locCountryCode3.push({
        text: element,
        value: element,
      })
    })

  reInspectionDate2
    .slice()
    .sort((a, b) => new Date(a) - new Date(b)) // date sort ascending
    .forEach(element => {
      reInspectionDate3.push({
        text: element ? moment(element).format('DD-MMM-YYYY') : '',
        value: element,
      })
    })

  inspectionRaised2
    .slice()
    .sort((a, b) => String(a).localeCompare(String(b))) // yes/no string sort
    .forEach(element => {
      inspectionRaised3.push({
        text: element === '1' ? 'Yes' : 'No',
        value: element,
      })
    })

  const column = [
    // {
    //   title: 'S.No',
    //   dataIndex: 'sno',
    //   key: 'sno',
    //   width:'5%'
    // },
    {
      title: 'Vendor Code',
      dataIndex: 'vendorUniqueCode',
      key: 'vendorUniqueCode',
      filters: vendorUniqueCode3,
      filteredValue: filtersinfo.vendorUniqueCode || null,
      onFilter: (value, record) => record?.vendorUniqueCode === value,
      render: text => text,
    },
    {
      title: 'Vendor Type',
      dataIndex: 'vendorType',
      key: 'vendorType',
      filters: Potype3,
      filteredValue: filtersinfo.vendorType || null,
      onFilter: (value, record) => record?.vendorType === value,
      render: text =>
        text === 1 ? 'Approved' : text === 0 ? 'Not Approved' : text === 2 ? 'Blocked' : '',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      filters: Array.from(new Set(vendorTab.map(item => item.vendorName)))
        .filter(Boolean)
        .map(name => name.trim())
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
        .map(name => ({
          text: name,
          value: name,
        })),
      onFilter: (value, record) => record.vendorName?.toLowerCase() === value.toLowerCase(),
    },
    {
      title: 'Vendor Category',
      dataIndex: 'vendorCategory',
      key: 'vendorCategory',
      filters: venCat3,
      filteredValue: filtersinfo.vendorCategory || null,
      onFilter: (value, record) => record?.vendorCategory === value,
      render: text => text,
    },
    {
      title: 'City',
      dataIndex: 'locCity',
      key: 'locCity',
      filters: locCity3,
      filteredValue: filtersinfo.locCity || null,
      onFilter: (value, record) => record?.locCity === value,
      render: text => text,
    },
    {
      title: 'State',
      dataIndex: 'locState',
      key: 'locState',
      filters: locState3,
      filteredValue: filtersinfo.locState || null,
      onFilter: (value, record) => record?.locState === value,
      render: text => text,
    },
    {
      title: 'Country',
      dataIndex: 'locCountryCode',
      key: 'locCountryCode',
      filters: locCountryCode3,
      filteredValue: filtersinfo.locCountryCode || null,
      onFilter: (value, record) => record?.locCountryCode === value,
      render: text => text,
    },
    {
      title: 'Contact No',
      dataIndex: 'contactNo',
      key: 'contactNo',
      render: data => <div style={{ textAlign: 'right' }}>{data !== 'null' ? data : '-'}</div>,
      align: 'right',
    },
    {
      title: 'Pincode',
      dataIndex: 'locPinCode',
      key: 'locPinCode',
      render: data => <div style={{ textAlign: 'right' }}>{data}</div>,
      align: 'right',
    },
    {
      title: 'Gmail ID',
      dataIndex: 'emailId',
      key: 'emailId',
      render: text => text || '-',
    },
    {
      title: 'GST',
      dataIndex: 'gst',
      key: 'gst',
      render: data => <div style={{ textAlign: 'right' }}>{data}</div>,
      align: 'right',
    },
    {
      title: 'PAN',
      dataIndex: 'pan',
      render: data => <div style={{ textAlign: 'right' }}>{data}</div>,
      align: 'right',
    },
    // {
    //   title: 'Vendor Status',
    //   dataIndex: 'vendorStatus',
    //   key: 'vendorStatus',
    //   render: Status => {
    //     return Status === '1' ? 'Approved' : 'Pending' // Rendering 'Approved' for status 1, else 'Pending'
    //   },
    // },
    {
      title: 'Approved Date',
      dataIndex: 'firstInspectionDate',
      key: 'firstInspectionDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Latest Inspected Date',
      dataIndex: 'latestInspectedDate',
      key: 'latestInspectedDate',
      render: text => (text ? moment(text).format('DD-MMM-YYYY') : '-'),
    },
    {
      title: 'Latest Inspection Rating',
      dataIndex: 'latestInspectionRating',
      key: 'latestInspectionRating',
      render: text => text || '-',
    },
    {
      title: 'Next Inspection Date',
      dataIndex: 'reInspectionDate',
      key: 'reInspectionDate',
      filters: reInspectionDate3.sort((a, b) => {
        return new Date(a.value) - new Date(b.value)
      }),
      filteredValue: filtersinfo.reInspectionDate || null,
      onFilter: (value, record) => record?.reInspectionDate === value,
      render: text => <div>{text ? moment(text).format('DD-MMM-YYYY') : '-'}</div>,
    },
    {
      title: 'Inspection Raised',
      dataIndex: 'inspectionRaised',
      key: 'inspectionRaised',
      filters: inspectionRaised3,
      filteredValue: filtersinfo.inspectionRaised || null,
      onFilter: (value, record) => record?.inspectionRaised === value,
      render: text => <div>{text === '1' ? 'Yes' : 'No'}</div>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (record, index) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            type="primary"
            onClick={() => {
              setVendorDtl(record, index)
              setvendordtlvisible(true)
              setSelectedRecord(index)
              getVendortableDetails(index)
              clearVendorForm()
            }}
          >
            Details
          </Button>
        </div>
      ),
    },
  ]

  useEffect(() => {
    getvendor()
    getVendorCategory()
  }, [])

  const getVendorCategory = async () => {
    const response = await indentFileUpload({
      requestPath: 'getVendorCategory',
      requestData: {
        tenantID: tenantId,
      },
    })
    if (response?.responseCode === '200') {
      const options = response?.responseData.map(item => ({
        key: item.vendorId,
        value: item.vendorCategory,
      }))
      setVendorCategory(options)
    } else {
      setVendorCategory([])
    }
  }
  //   const cols = [
  //   { title: "Vendor Code", dataIndex: "vendorCode" },
  //   { title: "Vendor Type", dataIndex: "vendorType" },
  //   { title: "Vendor Name", dataIndex: "vendorName" },
  //   { title: "Vendor Category", dataIndex: "vendorCategory" },
  //   { title: "City", dataIndex: "locCity" },
  //   { title: "State", dataIndex: "locState" },
  //   { title: "Country", dataIndex: "locCountryCode" },
  //   { title: "Contact No", dataIndex: "contactNo" },
  //   { title: "Pincode", dataIndex: "locPinCode" },
  //   { title: "GST", dataIndex: "gst" },
  //   { title: "PAN", dataIndex: "pan" },
  //   { title: "Inspection Date", dataIndex: "reInspectionDate" },
  //   { title: "Inspection Raised", dataIndex: "inspectionRaised" }
  // ];
  // const handleExportCSV = () => {
  //   const csvData =
  //     filteredvendor &&
  //     filteredvendor.map(row => {
  //       const rowData = cols.map(col => {
  //         const cellData = row[col.dataIndex]
  //         return cellData === null || cellData === 'null' ? '-' : cellData
  //       })
  //       rowData[1] = row.vendorType === 1 ? 'Approved' : 'Not Approved'
  //       rowData[12] = row.vendorType === 1 ? 'Yes' : 'No'
  //       return rowData.join(',')
  //     })

  //     const csvContent = [
  //       cols.map(col => col.title).join(','), // Join header titles
  //       ...csvData
  //     ].join('\n');

  //   console.log(csvContent , "csvContent")
  //   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  //   const link = document.createElement('a')
  //   if (link.download !== undefined) {
  //     const url = URL.createObjectURL(blob)
  //     link.setAttribute('href', url)
  //     link.setAttribute('download', `Vendor_Master${currentDateTime}.csv`)
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //   }
  // }

  const convertToCSV = data => {
    const header = Object.keys(data[0]).join(',')
    const rows = data.map(row => Object.values(row).join(','))
    return [header, ...rows].join('\n')
  }

  const downloadCSV = (csvData, fileName) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExport = () => {
    const cleanedData = cleanupDataSource(vendorTab)
    const csvData = convertToCSV(cleanedData)
    downloadCSV(csvData, `Vendor_Details-${currentDateTime}.csv`)
  }

  const cleanupDataSource = dataSource => {
    return dataSource.map(row => {
      const escapeValue = value => {
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('\n') || value.includes('"'))
        ) {
          // Escape special characters (double quotes and commas)
          return `"${value.replace(/"/g, '""').replace(/\n/g, '')}"`
        }
        return value
      }

      return {
        'Vendor Code': escapeValue(row.vendorUniqueCode),
        'Vendor Type': escapeValue(
          row.vendorType === 1
            ? 'Approved'
            : row.vendorType === 0
            ? 'Not Approved'
            : row.vendorType === 2
            ? 'Blocked'
            : '',
        ),
        'Vendor Name': escapeValue(row.vendorName),
        'Vendor Category': escapeValue(row.vendorCategory),
        City: escapeValue(row.locCity),
        State: escapeValue(row.locState),
        Country: escapeValue(row.locCountryCode),
        'Contact No': escapeValue(row.contactNo),
        Pincode: escapeValue(row.locPinCode),
        GST: escapeValue(row.gst),
        PAN: escapeValue(row.pan),
        'Gmail ID': escapeValue(row.emailId),
        'Approved Date': escapeValue(
          row.firstInspectionDate ? moment(row.firstInspectionDate).format('DD-MMM-YYYY') : '',
        ),
        'Latest Inspected Date': escapeValue(
          row.latestInspectedDate ? moment(row.latestInspectedDate).format('DD-MMM-YYYY') : '',
        ),
        'Latest Inspection Rating': escapeValue(row.latestInspectionRating || ''),
        'Next Inspection Date': escapeValue(row.reInspectionDate),
        'Inspection Raised': escapeValue(row.inspectionRaised === '1' ? 'Yes' : 'No'),
      }
    })
  }

  const getvendor = async () => {
    // const formData = form.getFieldsValue()
    const response = await indentFileUpload({
      requestPath: 'getApprVendorDtls',
      requestData: {
        tenantId,
        approved: '1',
      },
    })
    if (response?.responseCode === '200') {
      const updatedData = response?.responseData.map((data, ind) => {
        return {
          ...data,
          sno: ind + 1,
        }
      })
      setvendorTab(updatedData)
      setfilteredvendor(response?.responseData)
      // message.success(response?.responseMessage)
    } else {
      message.error(response?.responseMessage)
      setvendorTab([])
      setfilteredvendor([])
    }
  }
  // const handleSearch = e => {
  //   const filtered = filteredvendor.filter(item =>
  //     Object.keys(item).some(key =>
  //       item[key]
  //         ?.toString()
  //         .toLowerCase()
  //         .includes(e.target.value.toLowerCase()),
  //     ),
  //   )
  //   setvendorTab(filtered)
  // }

  const debouncedSearch = useCallback(
    // eslint-disable-next-line no-undef
    _.debounce(value => {
      const filtered = filteredvendor.filter(item =>
        Object.keys(item).some(key =>
          item[key]
            ?.toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        ),
      )
      setvendorTab(filtered)
    }, 300),
    [filteredvendor],
  )

  const handleSearch = e => {
    debouncedSearch(e.target.value)
  }
  return (
    <div className="my-3" style={isMobile ? { width: tableWidth } : {}}>
      <Card
        style={{ width: '100%' }}
        title="Vendor Master"
        extra={
          <ButtonComponent
            text="New Vendor"
            type="primary"
            icon={<PlusOutlined style={{ color: 'white' }} />}
            onClick={() => {
              openinsertcard()
              setinsertVendorvisible(true)
              // getprojectdropdown()
              // setinsertmodalVisible(true)
            }}
          />
        }
      >
        <Input.Search
          style={{ margin: '0 0 10px 0', width: isMobile ? '100%' : '30%', float: 'right' }}
          placeholder="Search here..."
          enterButton
          // onSearch={handleSearch}
          onChange={e => handleSearch(e)}
        />
        <Button
          type="primary"
          exportableProps={{
            fileName: `Vendor_Master${currentDateTime}`,
            btnProps: {
              type: 'primary',
              icon: <FileExcelOutlined />,
              children: <span>Export to CSV</span>,
            },
          }}
          onClick={handleExport}
          style={{ marginTop: '10px' }}
        >
          Export to CSV
        </Button>
        <Table
          columns={column}
          dataSource={vendorTab}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [vendorTab?.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ y: 400 }}
          onChange={handleChange}
        />
        {insertVendorvisible ? (
          <ModalPopup
            text="New Vendor"
            FieldsComponent={openinsertcard}
            isModalVisible="setinsetVendorvisible"
            width="900"
            onCancel={() => {
              handleDetailCancel()
              getvendor()
            }}
          />
        ) : null}
        {vendordtlvisible ? (
          <ModalPopup
            text="Vendor Details"
            FieldsComponent={openinsertcard}
            isModalVisible="setvendordtlvisible"
            width="900"
            onCancel={() => {
              handleDetailCancel()
              getvendor()
              clearVendorForm()
            }}
          />
        ) : null}
      </Card>
    </div>
  )
}
export default VendorMater
