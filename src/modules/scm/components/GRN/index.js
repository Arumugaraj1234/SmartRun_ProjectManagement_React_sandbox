import React, { useState } from 'react'
import { Button, Card, Table, Row, Divider, Form, Input } from 'antd'
import store from 'store'
import moment from 'moment'
import { PlusOutlined } from '@ant-design/icons'
import ButtonComponent from 'components/shared/ButtonComponent'
import ModalPopupBox from 'components/shared/ModalPopupComponent'
import CommonFields3 from 'modules/scm/components/CommonFields3'
import messageReturn from '_helpers/messageReturn'
import { indentFileUpload } from '../../../../services/common/AppeovedDocumentService/adddocumentservice'

const ScmGrns = () => {
  const [allqtyForm] = Form.useForm()
  const tenantId = store.get('tenantId')
  const [isModalVal, setIsModalVal] = useState(false)
  const [showInwardDetail, setShowInwardDetail] = useState(false)
  const [showaddinwardpop, setshowaddinwardpop] = useState(false)
  const [respGrnDtls, setRespGrnDtls] = useState('')
  const [grnPopUpRespVal, setGRNPopUpRespVal] = useState([])
  // const [productCodelbl, setProductCodelbl] = useState([])
  const [inwardCode, setInwardCode] = useState('')
  const [createdOn, setCreatedOn] = useState('')
  const [createdBy, setCreatedBy] = useState('')
  const [lastUpdtdBy, setLastUpdtdBy] = useState('')
  const [lastUpdtdOn, setLastUpdtdOn] = useState('')
  const [vendorName, setVendorName] = useState('')
  const [grnPopUpTableUpdt, setGrnPopUpTableUpdt] = useState([])
  const [showpopupcrtetbl, setshowpopupcrtetbl] = useState(false)
  const [insertGrnMiCodeVals, setInsertGrnMiCodeVals] = useState([])
  const [grnQty, setGrnQty] = useState([])
  const [grninspectedQty, setGrninspectedQty] = useState([])
  const [grngrnReceivedQty, setGrngrnReceivedQty] = useState([])

  const dateformatter = dateStringval => {
    const splitdatendtym = dateStringval.split(' ')
    const dateSp = splitdatendtym[0].split('-')
    const finalStr = `${dateSp[2]}-${moment(dateSp[1]).format('MMM')}-${dateSp[0]} ${
      splitdatendtym[1]
    }`
    return finalStr
  }
  const currencyFormat = value =>
    new Intl.NumberFormat('en-IN', {
      style: 'decimal',
    }).format(value)
  const showModal = (record, index) => {
    console.log(record)
    // setProductCodelbl(index.productCode)
    getGrnValsPopUp(index.grnHdrId)
    setInwardCode(index.miCode)
    setCreatedOn(index.createdOn)
    setCreatedBy(index.createdEmpName)
    setLastUpdtdBy(index.lastUpdatedEmpName)
    setLastUpdtdOn(index.lastUpdatedOn)
    setVendorName(index.vendorName)
    setIsModalVal(true)
  }
  const getGrnValsPopUp = async value => {
    const response = await indentFileUpload({
      requestPath: 'getGrnDtlwithMaterialInwardDtl',
      requestData: {
        tenantId,
        grnHdrId: value,
      },
    })
    if (response.responseData.length > 0) {
      setGRNPopUpRespVal(response.responseData)
    }
  }
  const getGRNDtls = formData => {
    if (
      formData.ToDate !== null &&
      formData.FromDate !== null &&
      formData.Projectcode !== undefined
    ) {
      getGrnDetailsVal(formData.Projectcode)
      setShowInwardDetail(true)
      setshowaddinwardpop(false)
    } else {
      messageReturn(405)
    }
  }
  const getGrnDetailsVal = async value => {
    const response = await indentFileUpload({
      requestPath: 'getGrnHdrDetails',
      requestData: {
        tenantId,
        poId: value,
      },
    })

    setRespGrnDtls(response?.responseData || [])
  }
  const AddGRNMaterialInwardDtls = (formData, pONoCodeVal, slctdMtrlObjList) => {
    console.log(pONoCodeVal)
    setInsertGrnMiCodeVals(slctdMtrlObjList)
    if (
      formData.ToDate !== null &&
      formData.FromDate !== null &&
      formData.Projectcode !== undefined &&
      formData.PONo !== null &&
      formData.PONo !== undefined &&
      formData.materialInwardNo !== null &&
      formData.materialInwardNo !== undefined
    ) {
      getGrnEditableTableView(formData.materialInwardNo)
    } else {
      messageReturn(405)
    }
  }
  const getGrnEditableTableView = async value => {
    const response = await indentFileUpload({
      requestPath: 'getGrnDtlwithMaterialInwardDtl',
      requestData: {
        tenantId,
        grnHdrId: value,
      },
    })
    setshowpopupcrtetbl(true)
    setGrnPopUpTableUpdt(response?.responseData || [])
    setGrnQty(response.responseData[0].orderedQty)
    setGrninspectedQty(response.responseData[0].inspectedQty)
    setGrngrnReceivedQty(response.responseData[0].grnReceivedQty)
  }
  function handleCancel() {
    setIsModalVal(false)
    setshowpopupcrtetbl(false)
    setGrnPopUpTableUpdt([])
  }
  function showAddInwardModal() {
    setshowaddinwardpop(true)
    setShowInwardDetail(false)
    setshowpopupcrtetbl(false)
    setGrnPopUpTableUpdt([])
  }
  function handleCancelAddInward() {
    setshowaddinwardpop(false)
    setshowpopupcrtetbl(false)
    setGrnPopUpTableUpdt([])
  }

  const columns = [
    {
      title: 'Inward Code',
      dataIndex: 'miCode',
      key: 'miCode',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Created On',
      dataIndex: 'createdOn',
      key: 'createdOn',
      render: text =>
        text !== '' && text !== null && text !== undefined ? dateformatter(text) : '-',
    },
    {
      title: 'Created By',
      dataIndex: 'createdEmpName',
      key: 'createdEmpName',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Last Updated By',
      dataIndex: 'lastUpdatedEmpName',
      key: 'lastUpdatedEmpName',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Last Updated On',
      dataIndex: 'lastUpdatedOn',
      key: 'lastUpdatedOn',
      render: text =>
        text !== '' && text !== null && text !== undefined ? dateformatter(text) : '-',
    },
    {
      title: 'Vendor Name',
      dataIndex: 'vendorName',
      key: 'vendorName',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Action',
      dataIndex: 'address',
      key: 'address',
      render: (record, index) => (
        <Button
          type="primary"
          onClick={() => {
            showModal(record, index)
          }}
        >
          Details
        </Button>
      ),
    },
  ]
  const grnpopupcolumns = [
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
      title: 'Ordered Qty.',
      dataIndex: 'orderedQty',
      key: 'orderedQty',
      render: text =>
        text !== '' && text !== null && text !== undefined ? currencyFormat(text) : '-',
    },
    {
      title: 'GRN Received Qty.',
      dataIndex: 'grnReceivedQty',
      key: 'grnReceivedQty',
      render: text =>
        text !== '' && text !== null && text !== undefined ? currencyFormat(text) : '-',
    },
    {
      title: 'Inspected Qty.',
      dataIndex: 'inspectedQty',
      key: 'inspectedQty',
      render: text =>
        text !== '' && text !== null && text !== undefined ? currencyFormat(text) : '-',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
  ]
  const handleClear = () => {
    console.log('handleClear---> ')
  }
  function UpdateGRNMaterialInwrdDtls() {
    const inspctdndGrnQty = Number(grngrnReceivedQty) + Number(grninspectedQty)
    if (Number(inspctdndGrnQty) > Number(grnQty)) {
      messageReturn(675)
    } else {
      const updtGRNCode = {
        grnCode: '',
        transactionNo: '',
        financialYearMstId: '',
        grnDate: '2024-03-11',
        createdBy: 'E0015',
        lastUpdatedBy: 'E0006',
        miId: insertGrnMiCodeVals.miId,
        grnDtlList: [
          {
            miDtlId: '',
            recivedQty: '200',
          },
        ],
      }
      // getUpdatePopUpDetls(updtMtrlInwrd)
      console.log(updtGRNCode)
    }
  }
  function handleQtyChange(index, e) {
    console.log(index)
    setGrngrnReceivedQty(e.target.value)
  }
  const getgrndtlsModlPopup = [
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
      title: 'Make',
      dataIndex: 'make',
      key: 'material',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'material',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'GRN Qty',
      dataIndex: 'orderedQty',
      key: 'material',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'Inspected Qty',
      dataIndex: 'inspectedQty',
      key: 'material',
      render: text => (text !== '' && text !== null && text !== undefined ? text : '-'),
    },
    {
      title: 'GRN Received Qty',
      dataIndex: 'grnReceivedQty',
      key: 'material',
      render: (text, record, index) => (
        <Form form={allqtyForm}>
          <Form.Item name={`receiveqty${index}`} initialValue={record.grnReceivedQty}>
            <Input
              value={record.grnReceivedQty}
              onChange={e => handleQtyChange(index, e)}
              placeholder="Inward Qty.."
              type="number"
              name="qtyfieldvalue"
            />
          </Form.Item>
        </Form>
      ),
    },
  ]
  function onClear() {
    console.log('clera')
  }
  const FieldsComponent = () => {
    return (
      <div className="row ml-2">
        <div className="form_indent" style={{ width: '100%' }}>
          <CommonFields3
            onGetDetails={AddGRNMaterialInwardDtls}
            SubmitorGetDtls="1"
            onClear={handleClear}
            showMinwardDrpDwn="1"
          />
        </div>
        <div style={{ display: showpopupcrtetbl ? 'block' : 'none', marginTop: '20px' }}>
          <Table columns={getgrndtlsModlPopup} dataSource={grnPopUpTableUpdt} />
          <center>
            <ButtonComponent text="Submit" type="primary" onClick={UpdateGRNMaterialInwrdDtls} />
            &nbsp;&nbsp;&nbsp;
            <ButtonComponent type="primary" text="Clear" onClick={onClear} />
          </center>
        </div>
      </div>
    )
  }
  const ButtonsComponent = () => {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '25px',
          justifyContent: 'center',
          display: 'flex',
          gap: '12px',
        }}
      >
        <Button type="primary" text="Submit" />
        <Button type="primary" text="Cancel" />
      </div>
    )
  }
  const GRNDtlFieldsComponent = () => {
    return (
      <div className="mt-1 custom_antd_Table">
        <div className="row">
          <div className="col-3 tob_details">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Inward Code&nbsp;:&nbsp;&nbsp;
            </span>
            <span>{inwardCode}</span>
          </div>
          <div className="col-3 tob_details">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Created On&nbsp;:&nbsp;&nbsp;
            </span>
            <span>{dateformatter(createdOn)}</span>
          </div>
          <div className="col-3 tob_details">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Created By&nbsp;:&nbsp;&nbsp;
            </span>
            <span>{createdBy}</span>
          </div>
          <div className="col-3 tob_details">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Last Updated By&nbsp;:&nbsp;&nbsp;
            </span>
            <span>{lastUpdtdBy}</span>
          </div>
          <div className="col-3 tob_details">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Last Updated On&nbsp;:&nbsp;&nbsp;
            </span>
            <span>{dateformatter(lastUpdtdOn)}</span>
          </div>
          <div className="col-3 tob_details">
            <span className="tob_label" style={{ fontWeight: 'bold' }}>
              Vendor Name&nbsp;:&nbsp;&nbsp;
            </span>
            <span>{vendorName}</span>
          </div>
        </div>
        <Table columns={grnpopupcolumns} dataSource={grnPopUpRespVal} />
      </div>
    )
  }

  return (
    <div>
      <Card
        style={{ width: '100%', marginTop: '13px' }}
        title="GRN"
        extra={
          <>
            <ButtonComponent
              text="Create GRN"
              type="primary"
              icon={<PlusOutlined style={{ color: 'white' }} />}
              onClick={showAddInwardModal}
            />
          </>
        }
      >
        <CommonFields3
          onGetDetails={getGRNDtls}
          SubmitorGetDtls="1"
          onClear={handleClear}
          showMinwardDrpDwn="0"
          getAllEnable
        />
        <div style={{ display: showInwardDetail ? 'block' : 'none' }}>
          <Row>
            <Divider orientation="left">GRN Details</Divider>
          </Row>
          <div>
            <Table columns={columns} dataSource={respGrnDtls} />
          </div>
        </div>
      </Card>

      <ModalPopupBox
        text="GRN Detail View"
        isModalVisible={isModalVal}
        onCancel={handleCancel}
        FieldsComponent={GRNDtlFieldsComponent}
        width="900"
      />
      <ModalPopupBox
        text="Create GRN"
        isModalVisible={showaddinwardpop}
        onCancel={handleCancelAddInward}
        FieldsComponent={FieldsComponent}
        ButtonsComponent={ButtonsComponent}
        width="900"
      />
    </div>
  )
}

export default ScmGrns
