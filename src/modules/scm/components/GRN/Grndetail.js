import React, { useState, useEffect } from 'react'
import store from 'store'
import moment from 'moment'
import ModalPopup from 'components/shared/ModalPopupComponent'
import ButtonComponent from 'components/shared/ButtonComponent'
import TextArea from 'antd/lib/input/TextArea'
import { Card, Form, message, Table } from 'antd'
import Popuptable from 'components/shared/PopuptableComponent'
import IndentGroupgetDetails from 'services/common/IndentGroupService'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'
import '../../../style.scss'

const Grndetail = ({ visible, onClose, details, slctdProjectCode, slctdProjectName }) => {
  const tenantId = store.get('tenantId')
  const [inputForm] = Form.useForm()
  const [detailList, setDetailList] = useState({})
  const [grnCancelCard, setGrnCancelCard] = useState(false)
  const [detailVisible, setDetailVisible] = useState(visible)
  console.log('Details of GRn', details)

  useEffect(() => {
    getDtls()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getDtls = async () => {
    console.log(details)
    const response = await indentFileUpload({
      requestPath: 'getGrnDtlwithMaterialInwardDtl',
      requestData: {
        tenantId,
        grnHdrId: details.grnHdrId,
      },
    })
    setDetailList(response?.responseData || [])
  }

  const handleGrnCancel = async () => {
    // const insertCheck = await handleinsert()

    const formvalue = inputForm.getFieldValue()
    console.log('Details for cancel grn', details)
    const props = {
      grnHdrId: details.grnHdrId,
      remarks: formvalue.remarks,
      poCode: details.poCode,
      miId: details.miId,
      inventoryLoc: details.invLocCode,
      tenantId,
      grnDtlEntityList: detailList,
    }
    // if (insertCheck) {
    const httpapprovals = await IndentGroupgetDetails({
      requestPath: 'grnCancel',
      requestData: props,
    })

    if (httpapprovals.responseCode === '200') {
      // onmodalCancel()
      setGrnCancelCard(false)
      message.success(httpapprovals.responseMessage)
      setDetailVisible(false)
    } else {
      message.error(httpapprovals.responseMessage)
    }
    // }
  }
  const cancelGrnComponent = () => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h5>Add Remarks</h5>
              <Form form={inputForm}>
                <Form.Item name="remarks">
                  <TextArea rows={4} />
                </Form.Item>
              </Form>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ButtonComponent
                  text="Save"
                  type="primary"
                  // disable={isdisablebtn}
                  onClick={() => handleGrnCancel()}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
  const cancelGrnRemarks = () => {
    setGrnCancelCard(true)
  }

  const columns = [
    {
      title: 'DC/Invoice No.',
      dataIndex: 'dcCode',
      key: 'dcCode',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'DC/Invoice Date',
      dataIndex: 'dcDate',
      key: 'dcDate',
      render: text =>
        text !== '' && text !== null && text !== undefined
          ? moment(text).format('DD-MMM-YYYY')
          : '-',
    },
    {
      title: 'Part Number',
      dataIndex: 'productCode',
      key: 'productCode',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Ordered Qty.',
      dataIndex: 'orderedQty',
      key: 'orderedQty',
      align: 'right',
      render: text =>
        text !== '' && text !== null && text !== undefined ? parseInt(text, 10) : '-',
    },
  ]

  const FieldsComponent = () => {
    return (
      <div className="mt-1 custom_antd_Table">
        <div className="row">
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Inward Code
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.miCode}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Inward Date
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{moment(details?.createdOn).format('DD-MMM-YYYY')}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Inward By
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.createdEmpName}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Inward Location
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.invLocation}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              GRN Number
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.grnCode}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              GRN Date
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{moment(details?.grnDate).format('DD-MMM-YYYY')}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              GRN Location
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.invLocation}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              GRN Qty.
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{detailList[0]?.grnReceivedQty}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Project Number
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{slctdProjectCode}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Project Name
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{slctdProjectName}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              PO Number
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.poCode}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Vendor Name
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.vendorName}</span>
          </div>
          {/* <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Created On
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.createdOn}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Created By
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.createdEmpName}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Last Updated By
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.lastUpdatedEmpName}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Last Updated On
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.createdOn}</span>
          </div>
          <div className="col-12 col-sm-12 col-md-4 col-lg-3 col-xl-3 top_detail">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Vendor Name
            </span>
            <span>:&nbsp;&nbsp;&nbsp;{details?.vendorName}</span>
          </div> */}
        </div>
        {detailList && detailList.length > 0 && (
          <Table
            columns={columns}
            dataSource={detailList}
            pagination={{
              pageSizeOptions: ['10', '20', '30', '50', [detailList?.length]],
              showSizeChanger: true,
              defaultPageSize: 10,
            }}
            scroll={{ y: 400 }}
          />
        )}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ButtonComponent type="danger" text="Cancel GRN" onClick={() => cancelGrnRemarks()} />
          <Popuptable
            onClose={() => setGrnCancelCard(false)}
            cardLabel=""
            component={cancelGrnComponent('')}
            visible={grnCancelCard}
          />
        </div>
      </div>
    )
  }
  return (
    <div>
      <ModalPopup
        text="GRN Detail View"
        isModalVisible={detailVisible}
        onCancel={onClose}
        FieldsComponent={FieldsComponent}
        width="900"
      />
    </div>
  )
}

export default Grndetail
