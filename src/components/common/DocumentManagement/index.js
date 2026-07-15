import React, { useState, useEffect } from 'react'
import { UserOutlined } from '@ant-design/icons'
// import approvalListRetrievalService from 'services/common/DocumentManagement/RetrivalService'
import AccessDtlSerivce from 'services/common/DocumentManagement/AccessDetailService'
import store from 'store'
import moment from 'moment'
import messageReturn from '_helpers/messageReturn'
import BackButtonComponent from '../BackBtnComponent'
import DownloadDocuments from '../FileDownloadComponent'
import Table from '../TableComponent'
import Button from '../../shared/ButtonComponent'
import AccessDetails from '../../../modules/sales/components/AccessDetails'
import { indentFileUpload } from '../../../services/common/AppeovedDocumentService/adddocumentservice'

const DocumentManagement = ({ backcomponent }) => {
  const [isAccessDetailsModalVisible, setAccessDetailsModalVisible] = useState(false)
  const [accessDtl, setaccessDtl] = useState([])

  const [retrievaldata, setRetrievaldata] = useState([])
  const [docuname, setDocuname] = useState('')
  const [docutype, setDocutype] = useState('')
  const [creatername, setCreatername] = useState('')
  const [docuId, setDocuId] = useState('')
  const [filtersinfo, setfilterinfo] = useState([])
  const [isDownloading, setIsDownloading] = useState(false) // New state variable for download button

  const origionalData = []

  const Tab = store.get('Tab')
  const { tenantId } = Tab
  const enquiryid = store.get('EnquiryID')
  const employeID = store.get('employeeId')
  const projId = store.get('ProjectID')

  // const fetchapprovalServicedata = async () => {
  //   const returnData = await approvalListRetrievalService({
  //     equipId: enquiryid,
  //     tenId: tenantId,
  //     employeeId: employeID,
  //   })
  //   return returnData
  // }

  const fetchapprovalServicedata = async () => {
    const response = await indentFileUpload({
      requestPath: 'getDocumentManagementDetails',
      requestData: {
        enquiryId: enquiryid,
        tenantId,
        empId: employeID,
        projectId: projId,
      },
    })
    if (response) {
      setRetrievaldata(response)
    }
  }
  retrievaldata.map(h => {
    const timefor = moment(h.fileCreatedDate).format('DD-MMM-YYYY HH:mm')
    return origionalData.push({
      dmId: h.dmId,
      stgDescription: h.stgDescription,
      documentTypeDescription: h.documentTypeDescription,
      documentName: h.documentName,
      access: h.access,
      dateTime: timefor,
      empName: h.empName,
      filetypecode: h.fuCode,
      doctypecode: h.documentTypeCode,
      remarks: h.remarks,
      accessDesc: h.accessDesc,
      isPdf: h.isPdf,
    })
  })

  useEffect(() => {
    fetchapprovalServicedata()
    // const onLoadFunc = async () => {
    //   const response = await fetchapprovalServicedata()

    //   const httpResponse = response ?? ''

    //   if (httpResponse) {
    //     setRetrievaldata(httpResponse)
    //   }
    // }

    // onLoadFunc()
  }, [])

  const handleAccessSubmit = () => {
    setAccessDetailsModalVisible(false)
  }

  const handleAccessCancel = () => {
    setAccessDetailsModalVisible(false)
  }

  const fetchaccessServicedata = async () => {
    const returnData = await AccessDtlSerivce({ documId: docuId, tenId: tenantId })
    return returnData
  }

  const fetchAccessData = async () => {
    const response = await fetchaccessServicedata()
    const httpResponse = response ?? ''
    if (httpResponse) {
      setaccessDtl(httpResponse)
    }
  }

  const handleDelete = () => {
    fetchAccessData()
  }

  const handleAccesschange = (dname, dtype, crname, dcid) => {
    setCreatername(crname)
    setDocuname(dname)
    setDocutype(dtype)
    setDocuId(dcid)
    setAccessDetailsModalVisible(true)
  }

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }
  const StageDesc1 = []
  const Docutyoe1 = []
  origionalData.map(h => {
    return StageDesc1.push(h.stgDescription)
  })
  origionalData.map(h => {
    return Docutyoe1.push(h.documentTypeDescription)
  })
  const distinct = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const Stagedesc2 = StageDesc1.filter(distinct)
  const Docutyoe2 = Docutyoe1.filter(distinct)

  const Stagedesc3 = []
  const Docutype3 = []

  Stagedesc2.slice()
    .sort((a, b) => a?.localeCompare(b))
    .map(element => {
      return Stagedesc3.push({
        text: element,
        value: element,
      })
    })

  Docutyoe2.slice()
    .sort((a, b) => a?.localeCompare(b))
    .map(element => {
      return Docutype3.push({
        text: element,
        value: element,
      })
    })

  const columns = [
    {
      title: 'Stage Description',
      dataIndex: 'stgDescription',
      key: 'stgDescription',
      filters: Stagedesc3,
      filteredValue: filtersinfo.stgDescription,
      onFilter: (value, record) => record?.stgDescription === value,
    },
    {
      title: 'Document Type',
      dataIndex: 'documentTypeDescription',
      key: 'documentTypeDescription',
      filters: Docutype3,
      filteredValue: filtersinfo.documentTypeDescription,
      onFilter: (value, record) => record?.documentTypeDescription === value,
    },
    {
      title: 'Document Name',
      dataIndex: 'documentName',
      key: 'documentName',
    },

    {
      title: 'Document ID',
      dataIndex: 'dmId',
      key: 'dmId',
      className: 'right-align-cell',
    },
    {
      title: 'Uploaded On',
      key: 'dateTime',
      dataIndex: 'dateTime',
    },
    {
      title: 'Uploaded By',
      key: 'empName',
      dataIndex: 'empName',
    },
    {
      title: 'Remarks',
      key: 'remarks',
      dataIndex: 'remarks',
    },

    {
      title: 'Access Department',
      dataIndex: 'accessDesc',
      render: (text, record) => (
        <div>
          {record &&
            record?.accessDesc?.split(',').map(item => <div key={item}>{item.trim()}</div>)}
        </div>
      ),
    },
    {
      title: 'Access',
      key: 'access',
      dataIndex: 'access',

      render: (text, record) => (
        <Button
          type="primary"
          onClick={() =>
            handleAccesschange(
              record.documentName,
              record.documentTypeDescription,
              record.empName,
              record.dmId,
            )
          }
          icon={<UserOutlined />}
          size="small"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render: (text, record) => (
        <DownloadDocuments
          isPdf={record.isPdf}
          refid={record.dmId}
          tenanrId={tenantId}
          fileDocode={record.filetypecode}
          docTypeCode={record.doctypecode}
        />
      ),
    },
  ]

  const handleDownload = async () => {
    setIsDownloading(true) // Disable button and change text

    const downloadPromises = origionalData.map(async record => {
      const dmId = record?.dmId
      if (dmId) {
        const response = await indentFileUpload({
          requestPath: 'documentDownloadDocFile',
          requestData: {
            referenceId: dmId,
            tenantId,
            fileCode: '',
            docTypeCode: '',
          },
        })

        if (response && response.fileContent !== null) {
          const link = document.createElement('a')
          link.href = `data:application/octet-stream;base64,${response.fileContent}`
          link.download = response.fileName
          link.click()
        }
      }
    })

    try {
      await Promise.all(downloadPromises)
    } catch (error) {
      console.error('Error downloading files', error)

      messageReturn(606)
    }

    setIsDownloading(false) // Re-enable button and reset text
  }

  return (
    <div>
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <h5 style={{ margin: 0 }}>Approved Document</h5>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            text={isDownloading ? 'Downloading...' : 'Download All'}
            disabled={isDownloading}
            type="primary"
            onClick={handleDownload}
          />
        </div>

        <Table columns={columns} data={origionalData} onChange={handleChange} />
        <div>
          <BackButtonComponent componentToRender={backcomponent} />
        </div>
      </div>
      {isAccessDetailsModalVisible ? (
        <AccessDetails
          handleSubmit={handleAccessSubmit}
          handleCancel={handleAccessCancel}
          handleDelete={handleDelete}
          isModalVisible={isAccessDetailsModalVisible}
          docName={docuname}
          docType={docutype}
          createdBy={creatername}
          docId={docuId}
          accessresponsedata={accessDtl}
          fetchapprovalServicedata={fetchapprovalServicedata}
        />
      ) : null}
    </div>
  )
}
export default DocumentManagement
