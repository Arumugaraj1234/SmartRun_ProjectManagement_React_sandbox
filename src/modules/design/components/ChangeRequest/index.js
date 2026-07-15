import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { Skeleton, Select, Form, message, Spin, Button, Upload, AutoComplete } from 'antd'
import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'
import store from 'store'
import { PlusOutlined, UploadOutlined } from '@ant-design/icons'
import checkFileSize from '_helpers/fileUtill'
import messageReturn from '_helpers/messageReturn'
import Table from '../../../../components/common/TableComponent'
import ButtonComponent from '../../../../components/shared/ButtonComponent'
import FileDownload from '../../../../components/common/FileDownloadComponent'
import BackButton from '../../../../components/common/BackBtnComponent'

import RetrieveTableService from '../../../../services/design/ChangeRequest/RetrieveTable'
import ModalPopup from '../../../../components/shared/ModalPopupComponent'
import TextBox from '../../../../components/shared/InputComponent'
import TextArea from '../../../../components/shared/TextAreaComponent'

// service
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import getEmployeeService from '../../../../services/common/getDepartmentAndEmployeeDropDownDataService'
import InsertAndUpdateService from '../../../../services/design/ChangeRequest/InsertAndUpdate'
import UpdateCommentService from '../../../../services/design/ChangeRequest/UpdateComments'
import ApproveReqService from '../../../../services/design/ChangeRequest/ApproveRequest'

const ChangeRequest = () => {
  const { Option } = Select
  const [form] = Form.useForm()
  const [addremark] = Form.useForm()
  const [tableData, setTabledata] = useState([])
  const [filtersInfo, setfilterinfo] = useState([])
  const [detailstable, setDetailstable] = useState([])
  const [filterdata, setFilterData] = useState([])
  const [disable, SetDisable] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedProdcode, setSelectedProdCode] = useState(null)

  const [selectStationNo, setSelectStationNo] = useState(null)
  const [selectStationname, setSelectStationName] = useState(null)
  const [selectStationVal, setSelectStationVal] = useState(null)

  const [selectSubAssyNo, setSelectSubAssyNo] = useState(null)

  const [dtlPopupId, setDetailsPopupId] = useState(null)

  const [isLoading, setIsLoading] = useState(false)
  // Dropdown
  const [keyAreadata, setKeyArea] = useState([])
  const [keySubAreadata, setKeySubArea] = useState([])

  const [chngeReqHdr, setChngeReqHdr] = useState([])
  const [productDesc, setProductDesc] = useState([])
  const [deptEmp, setDeptEmp] = useState([])
  const [docLifemst, setDocLifeMst] = useState([])

  // const [editingKey, setEditingKey] = useState('');
  const [hdrId, setHdrId] = useState('')

  const [crId, setCrId] = useState(null)
  const [file, setFile] = useState(null)

  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    const defaultUploadData =
      tableData &&
      tableData.length > 0 &&
      tableData.map((data, index) => ({
        key: index + 1,
        uploadFile: '',
      }))
    setReuploadFile(defaultUploadData)
  }, [tableData, isModalVisible])

  const [reuploadFile, setReuploadFile] = useState([])
  const [dmid, setDmId] = useState(null)

  const [isAddModal, setAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const Tab = store.get('Tab')
  const PmId = store.get('ProjectID')
  const deHdrId = store.get('DesignID')
  const EmpId = store.get('employeeId')
  const tenantId = store.get('tenantId')
  const tenantid = store.get('tenantId')
  const EnquiryId = store.get('enquiryId')

  console.log(keyAreadata, 'keyAreadata========')
  console.log(selectStationNo)
  useEffect(() => {
    getRerieveData()
  }, [PmId, tenantId])

  const handleProductChange = e => {
    setSelectedProduct(e.value)
    setSelectedProdCode(e.key)
    getChangeReqHdrService(e.key)
  }

  useEffect(() => {
    // getKeyArea()
    // getKeySubArea()
    getProductDesc()
    getDeptAndEmp()
  }, [tenantId])

  const getChangeReqHdrService = async (prodcode, intVal) => {
    try {
      const keyareaobj = {
        tenantId: tenantid,
        masterId: deHdrId,
        productCode: prodcode,
        indentId: intVal,
      }

      const response = await indentFileUpload({
        requestPath: 'getChangeReqHdrDtlsByProdCode',
        requestData: keyareaobj,
      })

      if (response && response.responseData) {
        const stationNo =
          response.responseData.length > 0 &&
          response.responseData[0].keyArea &&
          response.responseData[0].keyArea.length > 0 &&
          response.responseData[0].keyArea.length === 1 &&
          response.responseData[0].keyArea[0].keyId
        const subAssyNo =
          response.responseData.length > 0 &&
          response.responseData[0].subKeyArea &&
          response.responseData[0].subKeyArea.length > 0 &&
          response.responseData[0].subKeyArea.length === 1 &&
          response.responseData[0].subKeyArea[0].keyId
        setChngeReqHdr(response.responseData)

        setKeyArea(
          response.responseData &&
          response.responseData.length > 0 &&
          response.responseData[0].keyArea,
        )

        console.log(keyAreadata)
        setKeySubArea(
          response.responseData &&
          response.responseData.length > 0 &&
          response.responseData[0].subKeyArea,
        )
        setSelectStationNo(stationNo)
        setSelectSubAssyNo(subAssyNo)
      } else {
        console.error('Error: No responseData in the response.')
      }
    } catch (error) {
      console.error('Error in getKeySubArea:', error)
    }
  }

  const getRerieveData = async () => {
    setLoading(true)
    const response = await RetrieveTableService(PmId, EmpId, tenantId)
    let data
    if (response !== null && response !== undefined) {
      if (response.responseData !== null) {
        if (response.responseData.length > 0) {
          setLoading(false)
          data = response.responseData
        } else {
          data = ''
        }
      }
    } else {
      setLoading(false)
      data = ''
    }
    setTabledata(data)
  }

  const Productcode = tableData ? tableData.map(h => h.productCode) : []
  const Assembly = tableData ? tableData.map(h => h.pkdesc) : []
  const SubAssembly = tableData ? tableData.map(h => h.pskDesc) : []
  const ProductName = tableData ? tableData.map(h => h.productDesc) : []
  const InitiatedBy = tableData ? tableData.map(h => h.initiatedByDesc) : []
  const CurStatus = tableData ? tableData.map(h => h.transactionStatusDesc) : []

  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }
  const filterproductCode = Productcode.filter(distinct)
  const filterassembly = Assembly.filter(distinct)
  const filtersubassembly = SubAssembly.filter(distinct)
  const filterprodname = ProductName.filter(distinct)
  const filterInitiated = InitiatedBy.filter(distinct)
  const filterCurStats = CurStatus.filter(distinct)

  const FilterProductCode = filterproductCode.map(element => ({
    text: element,
    value: element,
  }))

  const FilterAssembly = filterassembly.map(element => ({
    text: element,
    value: element,
  }))

  const FilterSubAssembly = filtersubassembly.map(element => ({
    text: element,
    value: element,
  }))

  const FilterProductName = filterprodname.map(element => ({
    text: element,
    value: element,
  }))

  const FilterInitiated = filterInitiated.map(element => ({
    text: element,
    value: element,
  }))

  const FilterCurStatus = filterCurStats.map(element => ({
    text: element,
    value: element,
  }))

  const FilterChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  // const getKeyArea = async () => {
  //   try {
  //     const keyareaobj = {
  //       tenantId: tenantid,
  //       pmHdrId: PmId,
  //     }
  //     const response = await indentFileUpload({
  //       requestPath: 'getKeyArea',
  //       requestData: keyareaobj,
  //     })

  //     if (response && response.responseData) {
  //       setKeyArea(response.responseData)
  //     } else {
  //       console.error('Error: Response data is missing')
  //     }
  //   } catch (error) {
  //     console.error('Error fetching key area:', error)
  //   }
  // }
  // const getKeySubArea = async () => {
  //   try {
  //     const keyareaobj = {
  //       tenantId: tenantid,
  //       pmHdrId: '',
  //     }

  //     const response = await indentFileUpload({
  //       requestPath: 'getKeySubArea',
  //       requestData: keyareaobj,
  //     })

  //     if (response && response.responseData) {
  //       setKeySubArea(response.responseData)
  //     } else {
  //       console.error('Error: No responseData in the response.')
  //     }
  //   } catch (error) {
  //     console.error('Error in getKeySubArea:', error)
  //   }
  // }

  const getProductDesc = async () => {
    const keyareaobj = {
      tenantId: tenantid,
      pmHdrId: PmId,
    }
    const response = await indentFileUpload({
      requestPath: 'getAllProductsByPmHdrId',
      requestData: keyareaobj,
    })
    if (response) {
      setProductDesc(response.responseData)
    }
  }

  const getDeptAndEmp = async () => {
    const response = await getEmployeeService({
      tenantId,
      isActive: '1',
      employeID: '',
    })
    let data = []
    if (response !== null && response !== undefined && response.length > 0) {
      data = response
    } else {
      data = ''
    }
    setDeptEmp(data)
  }

  const handleDetails = (e, id) => {
    setDetailsPopupId(id + 1)
    const filteredData = tableData && tableData.filter(item => item.crId === e.crId)
    setFilterData(filteredData)
    const crDtlListWithKeys =
      filteredData &&
      filteredData.length > 0 &&
      filteredData[0].crDtlList.map((item, index) => {
        return {
          ...item,
          key: index.toString(),
        }
      })
    setDetailstable(crDtlListWithKeys)
    setHdrId(
      filteredData &&
      filteredData.length > 0 &&
      filteredData[0].crDtlList &&
      filteredData[0].crDtlList.length > 0 &&
      filteredData[0].crDtlList[0].crhdrId,
    )

    setDmId(
      filteredData && filteredData.length > 0 && filteredData[0].dmId !== ''
        ? filteredData[0].dmId
        : null,
    )
    // setDtlId(filteredData && filteredData[0].crDtlList && filteredData[0].crDtlList[0].crDtlId);
    // setCurrentSeq(filteredData && filteredData[0].crDtlList && filteredData[0].crDtlList[0].transactionStatusSeq);
    setCrId(filteredData && filteredData.length > 0 && filteredData[0].crId)
    setDocLifeMst(filteredData && filteredData.length > 0 && filteredData[0].docLifeCycleMstList)
    setIsModalVisible(true)
  }
  const handleCloseModal = () => {
    setReuploadFile([])
    setIsModalVisible(false)
    setDetailsPopupId(null)
  }
  const handleshowAddModal = () => {
    setAddModal(true)
  }
  const handlehideAddModal = () => {
    setAddModal(false)
    setSelectStationNo(null)
    setSelectSubAssyNo(null)
    setChngeReqHdr([])
    setSelectedProduct(null)
    setSelectedProdCode(null)
    setSelectStationName(null)
    setKeyArea(null)
    setKeySubArea(null)
    form.resetFields()
    setFile(null)
  }

  const validateFormValues = formValues => {
    const keys = Object.keys(formValues)
    return keys.every(key => {
      return key === 'IndentDate' || formValues[key] !== undefined
    })
  }

  const handleSubmit = async () => {
    const formValues = form.getFieldsValue()
    const isValidForm = validateFormValues(formValues)
    if (isValidForm && file !== null) {
      SetDisable(true)
      setIsLoading(true)
      const response = await InsertAndUpdateService(
        '',
        EmpId,
        deHdrId,
        formValues.initiatedBy,
        EmpId,
        '',
        selectStationVal,
        PmId,
        '2',
        selectedProdcode,
        selectSubAssyNo,
        formValues.requestDetails,
        tenantId,
        selectedProdcode,
        chngeReqHdr && chngeReqHdr.length > 0 && chngeReqHdr[0].revisionNo,
        '',
        '',
        formValues.comments,
        tenantId,
      )
      if (response !== undefined && response !== null) {
        if (response.responseCode === 'Successfully Executed') {
          SetDisable(false)
          submitExcel(response.responseDataMessage)
          setAddModal(false)
          setSelectStationNo(null)
          setSelectSubAssyNo(null)
          setChngeReqHdr([])
          setSelectedProduct(null)
          setSelectedProdCode(null)
          setSelectStationName(null)
          form.resetFields()
          setFile(null)
          setIsLoading(false)
          messageReturn(212)
        } else {
          SetDisable(false)
          setIsLoading(false)
          messageReturn(633)
        }
      }
    } else {
      messageReturn(405)
    }
  }

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Assy',
      dataIndex: 'pkdesc',
      key: 'pkdesc',
      filters: FilterAssembly,
      filteredValue: filtersInfo.pkdesc,
      onFilter: (value, record) => record?.pkdesc === value,
    },
    {
      title: 'Sub Assy',
      dataIndex: 'pskDesc',
      key: 'pskDesc',
      filters: FilterSubAssembly,
      filteredValue: filtersInfo.pskDesc,
      onFilter: (value, record) => record?.pskDesc === value,
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      filters: FilterProductCode,
      filteredValue: filtersInfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Product Name',
      dataIndex: 'productDesc',
      key: 'productDesc',
      filters: FilterProductName,
      filteredValue: filtersInfo.productDesc,
      onFilter: (value, record) => record?.productDesc === value,
    },
    {
      title: 'Initiated By',
      dataIndex: 'initiatedByDesc',
      key: 'initiatedByDesc',
      filters: FilterInitiated,
      filteredValue: filtersInfo.initiatedByDesc,
      onFilter: (value, record) => record?.initiatedByDesc === value,
    },
    {
      title: 'Created By',
      dataIndex: 'createdBydesc',
      key: 'createdBydesc',
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: date => moment(date).format('DD-MMM-YYYY'),
    },
    {
      title: 'Current Status',
      dataIndex: 'transactionStatusDesc',
      key: 'transactionStatusDesc',
      filters: FilterCurStatus,
      filteredValue: filtersInfo.transactionStatusDesc,
      onFilter: (value, record) => record?.transactionStatusDesc === value,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: (text, record, index) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <ButtonComponent
            type="primary"
            text="Details"
            onClick={() => handleDetails(record, index)}
          />
          {record.dmId === '0' ? (
            ''
          ) : (
            <FileDownload refid={record.dmId} tenanrId={tenantid} fileDocode="" docTypeCode="" />
          )}
        </div>
      ),
    },
  ]

  // const handleAddRow = (key) => {
  //   const newData = [...detailstable];
  //   const newKey = parseInt(key, 10) + 1;
  //   const newRow = {
  //     key: newKey.toString(),
  //     designerComments: '',
  //     editable: true,
  //     isExist: false,
  //   };
  //   newData.push(newRow);
  //   setDetailstable(newData)
  // };
  // const handleRemoveRow = (key) => {
  //   const newData = detailstable.filter(item => item.key !== key);
  //   setDetailstable(newData);
  // };
  // const handleRemarkChange = (key, value) => {
  //   const newData = detailstable.map(item => {
  //     if (item.key === key) {
  //       return { ...item, designerComments: value };
  //     }
  //     return item;
  //   });
  //   setDetailstable(newData);
  // };

  // const handleEdit = (record) => {
  //   setEditingKey(record.key);
  // };
  // const handleEdit = (key) => {
  //   const newData = detailstable.map(item => {
  //     if (item.key === key) {
  //       return { ...item, editing: true };
  //     }
  //     return { ...item, editing: false };
  //   });
  //   setDetailstable(newData);
  // };

  // const isEditing = (record) => record.editing

  // const handleSaveRow = async (record) => {
  //   const formValues = Addform.getFieldsValue(['comments']);
  //   const comments = formValues.comments[record.key];
  //   if (comments !== "") {
  //     const newData = detailstable.map((item) => {
  //       if (item.key === record.key) {
  //         return { ...item, editing: false };
  //       }
  //       return item;
  //     });
  //     setDetailstable(newData);
  //     let response;
  //     if (record.crhdrId !== undefined) {
  //       const hdrid = record.crhdrId;
  //       const dtlid = record.crDtlId;
  //       response = await UpdateCommentService(dtlid, hdrid, comments, tenantId);
  //     } else {
  //       response = await UpdateCommentService("", hdrId, comments, tenantId);
  //     }
  //     if (response) {
  //       if (response.responseCode === "Successfully Executed") {
  //         message.success(response.responseMessage);
  //         setIsModalVisible(false);
  //         getRerieveData()
  //       } else {
  //       }
  //     } else {
  //     }
  //   } else {
  //   }

  // };

  const handleApprove = async () => {
    const curseq = docLifemst.length > 0 && docLifemst[0].currSequence
    try {
      setIsModalVisible(false)
      const response = await ApproveReqService(curseq, EmpId, tenantId, crId)
      if (response !== null && response !== undefined) {
        if (response.responseCode === '200') {
          getRerieveData()
          messageReturn(213)
        } else {
          messageReturn(607)
        }
      }
    } catch (err) {
      throw err
    }
  }

  const handleDisApprove = async () => {
    const calseq = docLifemst.length > 0 && docLifemst[0].cancelSeq
    try {
      setIsModalVisible(false)
      const response = await ApproveReqService(calseq, EmpId, tenantId, crId)
      if (response !== null && response !== undefined) {
        if (response.responseCode === '200') {
          getRerieveData()
          messageReturn(213)
        } else {
          messageReturn(607)
        }
      }
    } catch (err) {
      throw err
    }
  }

  // const handleUpdate = async (e) => {
  //   const response = await UpdateCommentService('', hdrId, e, tenantId)
  //   if (response) {
  //     if (response.responseCode === 'Successfully Executed') {
  //       message.success(response.responseMessage)
  //     } else {
  //     }
  //   } else {
  //   }
  // }
  const handleUpdate = e => {
    return new Promise((resolve, reject) => {
      UpdateCommentService('', hdrId, e, tenantId, EmpId)
        .then(response => {
          if (response) {
            if (response.responseCode === 'Successfully Executed') {
              message.success(response.responseMessage)
              resolve(response)
            } else {
              messageReturn(633)
              reject(new Error('Failed to Record Insert'))
            }
          } else {
            messageReturn(607)
            reject(new Error('Something Went Wrong'))
          }
        })
        .catch(error => {
          messageReturn(607)
          reject(error)
        })
    })
  }

  // const detailsColumns = [
  //   {
  //     title: 'S.No',
  //     dataIndex: 'sno',
  //     key: 'sno',
  //     render: (text, record, index) => index + 1
  //   },
  //   {
  //     title: 'Remarks',
  //     dataIndex: 'designerComments',
  //     key: 'designerComments',
  //     width: 450,
  //     render: (text, record) => {
  //       const editable = isEditing(record);
  //       return editable ? (
  //         <Form form={Addform} layout="vertical" labelAlign="left">
  //           <Form.Item
  //             key={record.key}
  //             name={['comments', record.key]}
  //             initialValue={record.designerComments}
  //           >
  //             <TextBox />
  //           </Form.Item>
  //         </Form>
  //       ) : (
  //           <div>{record.designerComments}</div>
  //         );
  //     }
  //   },
  //   {
  //     title: 'Action',
  //     key: 'action',
  //     width: 200,
  //     render: (text, record, index) => {
  //       const editable = isEditing(record);
  //       const isfield = 'isExist' in record;
  //       const lastIndex = detailstable.length - 1;
  //       return (
  //         <div style={{ display: 'flex', justifyContent: 'center' }}>
  //           {editable ? (
  //             <ButtonComponent type="primary" text="Save" onClick={() => handleSaveRow(record)} />
  //           ) : (
  //               <div style={{ display: 'flex', justifyContent: 'space-between', gap: "20px" }}>
  //                 { lastIndex !== index && <AddIconButton disableInputBoxes />}
  //                 { lastIndex === index && <AddIconButton onClick={() => handleAddRow(record.key)} />}
  //                 {isfield && (
  //                   <RemoveIconButton onClick={() => handleRemoveRow(record.key)} />
  //                 )}
  //                 {index === parseInt(record.key, 10) && !isfield && <RemoveIconButton disableInputBoxes />}
  //                 <Button onClick={() => handleEdit(record.key)}>Edit</Button>
  //               </div>
  //             )}
  //         </div>
  //       );
  //     },
  //   }
  // ];

  const DetailsTableComponent = () => {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            Part Number :{' '}
            <span style={{ fontWeight: 'bold' }}>{filterdata && filterdata[0].productCode}</span>{' '}
          </div>
          <div>
            Product Name :{' '}
            <span style={{ fontWeight: 'bold' }}>{filterdata && filterdata[0].productDesc}</span>{' '}
          </div>
          {dmid !== null ? (
            <div style={{ marginBottom: '10px' }}>
              <FileDownload refid={dmid} tenanrId={tenantid} fileDocode="" docTypeCode="" />
            </div>
          ) : (
            ''
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            Assy : <span style={{ fontWeight: 'bold' }}>{filterdata && filterdata[0].pkdesc}</span>
          </div>
          <div>
            Sub Assy :{' '}
            <span style={{ fontWeight: 'bold' }}>{filterdata && filterdata[0].pskDesc}</span>
          </div>
          <div>
            Initiated By :{' '}
            <span style={{ fontWeight: 'bold' }}>
              {filterdata && filterdata[0].initiatedByDesc}
            </span>
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <p>Remarks</p>
          <div style={{ border: '1px solid #ccc' }}>
            <PerfectScrollbar
              style={{ maxHeight: '130px', overflowX: 'hidden' }}
              options={{ suppressScrollX: true }}
            >
              {detailstable &&
                detailstable.map(detail => {
                  const date = detail.reportedDateTime.split(' ')
                  return (
                    <div style={{ display: 'flex', marginLeft: '3px' }}>
                      <p>{detail.designerComments}</p>
                      <span style={{ marginLeft: '5px' }}> On </span>
                      <p style={{ marginLeft: '2px' }}>{moment(date[0]).format('DD-MMM-YYYY')}</p>
                      <span style={{ marginLeft: '5px' }}> By </span>
                      <p style={{ marginLeft: '5px' }}>
                        {detail.empName}({detail.empId})
                      </p>
                    </div>
                  )
                })}
            </PerfectScrollbar>
          </div>
        </div>
        <Form form={addremark} layout="vertical" labelAlign="left">
          <div className="row" style={{ marginTop: '15px' }}>
            <div className="col-md-8">
              <Form.Item
                name="comments"
                label={
                  <span>
                    Add Remark<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <TextArea />
              </Form.Item>
            </div>
            {/* <div className="col-md-4" style={{ marginTop: '40px' }}>
              <ButtonComponent text="Submit" type="primary" onClick={handleUpdate} />
            </div> */}
          </div>
        </Form>
        {/* <Table data={detailstable} columns={detailsColumns} /> */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px' }}>
          <div>
            <Upload
              maxCount={1}
              listType="text"
              // onChange={onFileChangeUpload}
              showUploadList={false}
              beforeUpload={beforeUpload1}
            >
              <Button type="primary" icon={<UploadOutlined />}>
                Re Upload Files
              </Button>
            </Upload>
          </div>
          {reuploadFile &&
            reuploadFile !== null &&
            reuploadFile !== undefined &&
            reuploadFile &&
            reuploadFile.length > 0 && (
              <ButtonComponent text="Save" type="primary" onClick={handleReuploadSubmit} />
            )}
          {docLifemst !== null && docLifemst.length > 0 && docLifemst[0].currSequence !== null ? (
            <ButtonComponent
              text={docLifemst && docLifemst.length > 0 && docLifemst[0].docStatusDesc}
              type="primary"
              onClick={handleApprove}
            />
          ) : (
            ''
          )}
          {docLifemst && docLifemst.length > 0 && docLifemst[0].cancelSeq !== null ? (
            <ButtonComponent
              text={docLifemst && docLifemst[0].cancelStatusDesc}
              type="danger"
              onClick={handleDisApprove}
            />
          ) : (
            ''
          )}
        </div>
        <div style={{ marginTop: '10px' }}>
          {reuploadFile &&
            reuploadFile.length > 0 &&
            reuploadFile.map(filedata => {
              if (filedata.key === dtlPopupId) {
                if (filedata.uploadFile.name) {
                  return (
                    <div key={filedata.key} style={{ display: 'flex', justifyContent: 'center' }}>
                      <p>Selected File</p>
                      <p style={{ fontWeight: 'bold', marginLeft: '5px' }}>
                        {filedata.uploadFile.name}
                      </p>
                    </div>
                  )
                }
              }
              return null
            })}
        </div>
      </div>
    )
  }
  // const onFileChange = info => {
  //   setFile(info.file.originFileObj)
  // }
  const beforeUpload = files => {
    if (checkFileSize(files)) {
      setFile(files)
    } else {
      setFile(null)
    }
  }

  const beforeUpload1 = files => {
    if (checkFileSize(files)) {
      setReuploadFile(prevFiles => {
        const updatedFiles = [...prevFiles]
        let found = false
        updatedFiles.forEach(prefile => {
          if (prefile.key === dtlPopupId && !found) {
            prefile.uploadFile = files
            found = true
          }
        })
        return updatedFiles
      })
    }
  }
  // const onFileChangeUpload = info => {
  //   setReuploadFile(prevFiles => {
  //     const updatedFiles = [...prevFiles]
  //     let found = false
  //     updatedFiles.forEach(prefile => {
  //       if (prefile.key === dtlPopupId && !found) {
  //         prefile.uploadFile = info.file.originFileObj
  //         found = true
  //       }
  //     })
  //     return updatedFiles
  //   })
  // }

  const submitExcel = async e => {
    const { stgCode } = Tab
    const reqObj = [
      {
        enquiryId: EnquiryId,
        tenantId: tenantid,
        type: 'Projects',
        empId: EmpId,
        refId: e,
        projectId: PmId,
        stageCode: stgCode,
      },
    ]
    const formData = new FormData()
    formData.append('insertDocRequest', JSON.stringify({ reqObj }))
    formData.append('file', file)
    const response = await indentFileUpload({
      requestPath: 'insertChangeRequestFile',
      requestData: formData,
    })
    if (response) {
      if (response.responseCode === '200') {
        setFile(null)
        getRerieveData()
        messageReturn(214)
      } else {
        messageReturn(634)
      }
    }
  }

  const handleReuploadSubmit = async () => {
    const reqObj = [
      {
        dmId: dmid,
        tenantId: tenantid,
        type: 'Projects',
        documentType: 'DC020',
        uploadDocType: 'FC016',
      },
    ]
    const formValues = addremark.getFieldsValue()
    const filteredData = reuploadFile && reuploadFile.filter(item => item.uploadFile !== '')
    if (
      filteredData !== null &&
      filteredData !== undefined &&
      filteredData.length > 0 &&
      formValues.comments !== undefined
    ) {
      const formData = new FormData()
      formData.append('updateDocRequest', JSON.stringify({ reqObj }))
      formData.append('file', filteredData[0].uploadFile)
      const response = await indentFileUpload({
        requestPath: 'updateFileByDmId',
        requestData: formData,
      })
      if (response) {
        if (response.responseCode === '200') {
          handleUpdate(formValues.comments)
            .then(res => {
              console.log('----response', res)
              getRerieveData()
            })
            .catch(error => {
              console.log(error, '----error')
            })
          addremark.resetFields()
          setReuploadFile([])
          // getRerieveData()
          setIsModalVisible(false)
          messageReturn(214)
        } else {
          messageReturn(634)
        }
      }
    } else {
      messageReturn(405)
    }
  }

  const handleChangeStationNo = e => {
    setSelectStationNo(e.key)
    setSelectStationVal(e.value)
    setSelectStationName(e.children)
    getChangeReqHdrService(selectedProdcode, e.key)
  }
  const handleChangeSubAssy = e => {
    setSelectSubAssyNo(e)
  }

  const AddRequestComponent = () => {
    return (
      <div>
        <Form form={form} layout="vertical" labelAlign="left">
          <div className="row form_datas">
            <div className="col-md-4">
              <Form.Item
                name="initiatedBy"
                label={
                  <span>
                    Initiated By<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Select placeholder="Select Department">
                  {deptEmp &&
                    deptEmp.map(item => (
                      <Option key={item.departmentCode} value={item.departmentCode}>
                        {item.departmentName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item
                name="productDesc"
                label={
                  <span>
                    Part Number<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                {/* <Select
                  placeholder="Select Part Number"
                  onChange={(value, option) => handleProductChange(option)}
                  value={selectedProduct}
                >
                  {productDesc &&
                    productDesc.map(item => (
                      <Option key={item.productCode} value={item.productDesc}>
                        {item.productCode}
                      </Option>
                    ))}
                </Select> */}
                <AutoComplete
                  // style={{ width: 400 }}
                  options={productDesc}
                  // onSearch={(value, code) => handlesubassyChange(value, code, index)}
                  onSelect={(value) => handleProductChange(value)}
                />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item name="productDesc" label={<span>Description</span>}>
                {selectedProduct}
              </Form.Item>
            </div>
            <div className="col-md-4">
              {/* <Form.Item
                name="KeyArea"
                label={
                  <span>
                    Station No<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              > */}
              <div>
                <div>
                  <span> Station No </span>
                </div>
                <Select
                  placeholder="Select Station No"
                  defaultValue="Select Station No"
                  onChange={(value, option) => handleChangeStationNo(option)}
                  style={{ width: '280px' }}
                  value={selectStationname}
                >
                  {keyAreadata &&
                    keyAreadata.map(item => (
                      <Option key={item.indentId} value={item.keyId}>
                        {item.keyName}
                      </Option>
                    ))}
                </Select>
              </div>
              {/* </Form.Item> */}
            </div>
            <div className="col-md-4">
              {/* <Form.Item
                name="keySubArea"
                label={
                  <span>
                    Sub Assy.<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              > */}
              <div>
                <div>
                  <span> Sub Assy. </span>
                </div>
                <Select
                  placeholder="Select Sub Assy"
                  defaultValue={selectSubAssyNo || 'Select Sub Assy'}
                  onChange={option => handleChangeSubAssy(option)}
                  style={{ width: '280px' }}
                >
                  {keySubAreadata &&
                    keySubAreadata.map(item => (
                      <Option key={item.keyId} value={item.keyId}>
                        {item.keyName}
                      </Option>
                    ))}
                </Select>
              </div>
              {/* </Form.Item> */}
            </div>
            <div className="col-md-4">
              <Form.Item
                name="requestDetails"
                label={
                  <span>
                    Request Details<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <TextArea />
              </Form.Item>
            </div>
            <div className="col-md-4" style={{ marginTop: '-20px' }}>
              <span>Drawing No </span>
              <div style={{ marginTop: '7px' }}>
                <TextBox disabled defaultValue={selectedProdcode} />
              </div>
            </div>
            <div className="col-md-4" style={{ marginTop: '-20px' }}>
              <span>Drawing Rev No </span>
              <div style={{ marginTop: '7px' }}>
                <TextBox
                  disabled
                  defaultValue={
                    chngeReqHdr && chngeReqHdr.length > 0 ? chngeReqHdr[0].revisionNo : ''
                  }
                />
              </div>
            </div>
            <div className="col-md-4" style={{ marginTop: '-20px' }}>
              <Form.Item
                label={
                  <span>
                    Choose File<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <Upload
                  maxCount={1}
                  listType="text"
                  // onChange={onFileChange}
                  beforeUpload={beforeUpload}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Upload Files</Button>
                  <span style={{ fontSize: '12px' }}>Upload Files below 100MB</span>
                </Upload>
                {file ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p>Selected File </p>
                    <p style={{ fontWeight: 'bold' }}>{file.name}</p>
                    <p>File Size</p>
                    <p style={{ fontWeight: 'bold' }}>{(file.size / (1024 * 1024)).toFixed(2)}MB</p>
                  </div>
                ) : null}
              </Form.Item>
            </div>
            <div className="col-md-8">
              <Form.Item
                name="comments"
                label={
                  <span>
                    Comments<span style={{ color: 'red' }}>*</span>{' '}
                  </span>
                }
              >
                <TextArea height={200} />
              </Form.Item>
            </div>
          </div>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <ButtonComponent text="Submit" type="primary" onClick={handleSubmit} disable={disable} />
        </div>
      </div>
    )
  }
  return (
    <div>
      <h5> Change Request </h5>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
        <ButtonComponent
          text="Add Request"
          type="primary"
          icon={<PlusOutlined style={{ color: 'white' }} />}
          onClick={handleshowAddModal}
        />
      </div>
      <Skeleton loading={loading && tableData && tableData.length > 0} active>
        <Table data={tableData} columns={columns} handleChange={FilterChange} />
      </Skeleton>
      <ModalPopup
        text="Designer Remarks"
        isModalVisible={isModalVisible}
        onCancel={handleCloseModal}
        FieldsComponent={DetailsTableComponent}
      />
      <ModalPopup
        text="Add Request"
        isModalVisible={isAddModal}
        onCancel={handlehideAddModal}
        FieldsComponent={AddRequestComponent}
        width={950}
      />
      <div style={{ textAlign: 'center', marginTop: 50, display: isLoading ? 'block' : 'none' }}>
        <Spin size="large" tip="Loading..." />
      </div>
      <BackButton componentToRender="design" />
    </div>
  )
}

export default ChangeRequest
