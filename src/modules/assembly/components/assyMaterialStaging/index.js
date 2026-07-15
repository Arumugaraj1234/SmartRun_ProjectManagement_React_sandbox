import React, { useState, useEffect } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import Button from 'components/shared/ButtonComponent'
import { Table, Modal, message } from 'antd'
import moment from 'moment'
import AddNewMaterialStg from 'modules/assembly/components/AddAssyMaterialStaging'
import store from 'store'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'

const AssyMaterialStaging = () => {
  const tenantid = store.get('tenantId')
  const assyHdrId = store.get('ProjectID')
  const hdrId = store.get('hdrId')
  const doctype = 'DC036'
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [showDtlTablLoading, setShowDtlTablLoading] = useState(false)
  const [materilStgnHdrResp, setMaterilStgnHdrResp] = useState([])
  const [matrlStgngPopupDtl, setMatrlStgngPopupDtl] = useState([])
  const [onClicksetMsHdrId, setOnClicksetMsHdrId] = useState('')
  const [materialStaging, setMaterialStaging] = useState(true)
  const [filtersinfo, setfilterinfo] = useState([])

  useEffect(() => {
    getOnloadMtrllStgnDtls()
    getOnloadStaging()
  }, [])
  const getOnloadMtrllStgnDtls = async () => {
    const keyareaobj = {
      hdrId: assyHdrId,
      tenantId: tenantid,
    }
    const response = await indentFileUpload({
      requestPath: 'msHdrRetrieve',
      requestData: keyareaobj,
    })
    setMaterilStgnHdrResp(response?.responseData || [])
  }

  const getOnloadStaging = async () => {
    const props = {
      isQc: '0',
      tenantId: tenantid,
      hdrId,
    }
    const httpget = await indentFileUpload({
      requestPath: 'retriveIsStagingStatus',
      requestData: props,
    })
    if (httpget.responseCode === '200') {
      setMaterialStaging(httpget.responseDataMessage)
    }
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const columns = [
    {
      title: 'Stage Name',
      dataIndex: 'msName',
      key: 'msName',
    },
    {
      title: 'Stage Qty.',
      dataIndex: 'stageQty',
      key: 'stageQty',
      className: 'right-align-cell',
      render: text => Number(text).toFixed(0),
    },
    {
      title: 'Created on',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: text => moment(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Action',
      dataIndex: 'address',
      key: 'address',
      render: (text, record, index) => (
        <div>
          <Button
            type="primary"
            text="Details"
            onClick={() => handleClickOnDetails(record, index)}
          />
        </div>
      ),
    },
  ]
  const handleClickOnDetails = record => {
    setOnClicksetMsHdrId(record.msHdrId)
    getMtrllStgngDtls(record.msHdrId)
    setShowDtlTablLoading(true)
  }
  const getMtrllStgngDtls = async msDtlId => {
    const keyareaobj = {
      hdrId: msDtlId,
      tenantId: tenantid,
    }
    const response = await indentFileUpload({
      requestPath: 'retrieveMSDtlByHdr',
      requestData: keyareaobj,
    })
    setMatrlStgngPopupDtl(response.responseData)
  }

  const handleCancelMatrlStgng = () => {
    cancelMSStaging()
    setShowDtlTablLoading(false)
  }
  const handleCancelMatrlStgngs = () => {
    setShowDtlTablLoading(false)
  }
  const cancelMSStaging = async () => {
    const keyareaobj = {
      hdrId: onClicksetMsHdrId,
      // hdrId: assyHdrId,
      tenantId: tenantid,
    }
    const response = await indentFileUpload({
      requestPath: 'cancelMsHdrReq',
      requestData: keyareaobj,
    })
    if (response.responseCode === '200') {
      message.success(response.responseMessage)
      getOnloadMtrllStgnDtls()
      setShowDtlTablLoading(false)
    } else {
      message.error(response.responseMessage)
    }
  }

  const distinct1 = (value, index, self) => {
    return self.indexOf(value) === index
  }

  const distinctValues = key => {
    if (!Array.isArray(matrlStgngPopupDtl)) {
      return [] // Return an empty array if dtlTabledata is not an array
    }

    return matrlStgngPopupDtl
      .map(item => item[key])
      .filter(distinct1)
      .map(value => ({
        text: value !== 'null' && value !== null ? value : '-',
        value,
      }))
  }

  const matrlStgngDtlCol = [
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      filters: distinctValues('productCode'),
      filteredValue: filtersinfo.productCode,
      onFilter: (value, record) => record?.productCode === value,
    },
    {
      title: 'Description',
      dataIndex: 'productDesc',
      key: 'productDesc',
      filters: distinctValues('productDesc'),
      filteredValue: filtersinfo.productDesc,
      onFilter: (value, record) => record?.productDesc === value,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      filters: distinctValues('specification'),
      filteredValue: filtersinfo.specification,
      onFilter: (value, record) => record?.specification === value,
    },
    {
      title: 'Make',
      dataIndex: 'make',
      key: 'make',
      render: text => (text !== 'null' && text !== null ? text : '-'),
      filters: distinctValues('make'),
      filteredValue: filtersinfo.make,
      onFilter: (value, record) => record?.make === value,
    },
    {
      title: 'Station',
      dataIndex: 'station',
      key: 'station',
      filters: distinctValues('station'),
      filteredValue: filtersinfo.station,
      onFilter: (value, record) => record?.station === value,
    },
    {
      title: 'Sub Assembly',
      dataIndex: 'subAssy',
      key: 'subAssy',
      filters: distinctValues('subAssy'),
      filteredValue: filtersinfo.subAssy,
      onFilter: (value, record) => record?.subAssy === value,
    },
    {
      title: 'Qty.',
      dataIndex: 'qty',
      key: 'qty',
      className: 'right-align-cell',
      render: text => Number(text).toLocaleString('en-IN'),
    },
    {
      title: 'UOM',
      dataIndex: 'uomLongDesc',
      key: 'uomLongDesc',
      filters: distinctValues('uomLongDesc'),
      filteredValue: filtersinfo.uomLongDesc,
      onFilter: (value, record) => record?.uomLongDesc === value,
    },
  ]

  const handleSubmit = () => {
    console.log('')
  }
  const handleCancel = () => {
    getOnloadMtrllStgnDtls()
    setIsModalVisible(false)
  }
  return (
    <div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h5>Material Staging</h5>
          {materialStaging === '1' ? (
            <Button
              text="Add Material Staging"
              type="primary"
              icon={<PlusOutlined style={{ color: 'white' }} />}
              onClick={showModal}
            />
          ) : null}
        </div>
        <Table
          columns={columns}
          dataSource={materilStgnHdrResp}
          bordered
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [materilStgnHdrResp?.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          scroll={{ y: 400 }}
        />
      </div>
      <Modal
        // title={`Material Staging Detail -`}
        title="Material Stage Details"
        visible={showDtlTablLoading}
        width="900"
        footer={null}
        onCancel={handleCancelMatrlStgngs}
      >
        <div className="my-3" style={{ display: showDtlTablLoading ? 'block' : 'none' }}>
          <Table
            columns={matrlStgngDtlCol}
            dataSource={matrlStgngPopupDtl}
            bordered
            onChange={handleChange}
          />
          <center>
            <Button text="Cancel MS" type="primary" onClick={handleCancelMatrlStgng} />
          </center>
        </div>
      </Modal>
      <AddNewMaterialStg
        submit={handleSubmit}
        projDoc={doctype}
        handleCancel={handleCancel}
        isModalVisible={isModalVisible}
      />
    </div>
  )
}

export default AssyMaterialStaging
