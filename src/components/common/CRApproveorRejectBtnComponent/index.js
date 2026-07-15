import React, { useState, useEffect } from 'react'
import { Select, Table, Card, Input } from 'antd'
import store from 'store'
import moment from 'moment'
import { CommentOutlined } from '@ant-design/icons'
import { useHistory } from 'react-router-dom'
import statusDropdownService from 'services/common/ApprovalRejectBtnService/statusDropdownService'
import approvalService from 'services/common/ApprovalRejectBtnService/approveBtnService'
import disapproveBtnService from 'services/common/ApprovalRejectBtnService/disapproveBtnService'
import Popuptable from 'components/shared/PopuptableComponent'
import messageReturn from '_helpers/messageReturn'
import Buttons from '../../shared/ButtonComponent'

const { Option } = Select
const { TextArea } = Input
const CRApproveOrReject = ({
  refId,
  refDoctTyp,
  tenId,
  componentToRender,
  currentSeq,
  onApproveSuccess,
  submitFunction,
  // eslint-disable-next-line no-unused-vars
  saveButtonStatus,
  getReferenceIdVal,
  saveButtonStatusVal,
}) => {
  const employeID = store.get('employeeId')
  const [selectedOption, setSelectedOption] = useState('')
  const [documentStatusMstlist, setDocumentStatusMstlist] = useState([])
  const [statusDetaillist, setStatusDetaillist] = useState([])
  const [saveButtonStatusVals, setSaveButtonStatus] = useState(false)
  const [cancelseq, setCancelseq] = useState(null)
  const [currentlseq, setCurrentseq] = useState(null)
  const [lastSequence, setLastSequence] = useState(0)
  const history = useHistory()
  const [detailCard, setdetailCard] = useState(false)
  const [approveRemarksCard, setApproveRemarksCard] = useState(false)
  const [rejectRemarksCard, setRejectRemarksCard] = useState(false)
  const [rejectRemarksVal, setRejectRemarksVal] = useState('')
  const [remarksVal, setRemarksVal] = useState('')

  const Tab = store.get('Tab')
  const { processCode, isEditable } = Tab
  // const processed = '1'
  const processed = processCode
  const curSeq = currentSeq

  const fetchapprovalListServicedata = async () => {
    const returnData = await statusDropdownService({
      refId,
      refDoctTyp,
      tenId,
      employeID,
      getReferenceIdVal,
    })
    return returnData
  }
  const fetchapprovalBtnResponse = async () => {
    const returnData = await approvalService({
      refId,
      refDoctTyp,
      tenId,
      processed,
      curSeq,
      lastSequence,
      selectedOption,
      employeID,
      remarksVal,
    })
    const approvalresponse = returnData?.responseCode ?? ''
    window.location.reload()
    return approvalresponse
  }

  const fetchdisapprovalBtnResponse = async () => {
    const returnData = await disapproveBtnService({
      refId,
      refDoctTyp,
      tenId,
      processed,
      curSeq,
      lastSequence,
      cancelseq,
      rejectRemarksVal,
    })
    const disapprovalresponse = returnData?.responseMessage ?? ''
    window.location.reload()
    return disapprovalresponse
  }

  useEffect(() => {
    const onLoadFunc = async () => {
      if (saveButtonStatusVal === '1' && isEditable === '1' && saveButtonStatusVal !== '') {
        setSaveButtonStatus(true)
      } else {
        setSaveButtonStatus(false)
      }

      const response = await fetchapprovalListServicedata()

      const httpResponse = response?.responseData ?? ''

      if (httpResponse.length > 0) {
        if (httpResponse[0]?.statusDtl?.length > 0) {
          setStatusDetaillist(httpResponse[0].statusDtl)
        }
        if (httpResponse[0]?.documentStatusMstlist?.length > 0) {
          setDocumentStatusMstlist(httpResponse[0].documentStatusMstlist)
        } else {
          setDocumentStatusMstlist('')
        }

        const cancelsquence = httpResponse[0]?.cancelseq?.cancelSeq || null
        const currentsequence = httpResponse[0]?.cancelseq?.currStatusDesc || 'NA'
        setCancelseq(cancelsquence)
        setCurrentseq(currentsequence)
      }
    }
    onLoadFunc()
  }, [refId, refDoctTyp, tenId])

  const handleDropdownChange = value => {
    setSelectedOption(value)

    const selectedOptionData = documentStatusMstlist.find(option => option.currSequence === value)
    if (selectedOptionData) {
      setLastSequence(selectedOptionData.lastSeq !== null ? selectedOptionData.lastSeq : 0)
    }
  }

  const handleBackClick = () => {
    history.goBack()
    if (false) {
      history.push(`/${componentToRender}`)
    }

    // const currentRoute = history.location.pathname.substring(1)
    // if (componentToRender !== currentRoute) {
    //   history.push(`/${componentToRender}`)
    // } else {
    //   window.location.reload()
    // }
  }

  const handleApproveBtn = () => {
    submitFunction()
    if (selectedOption !== '') {
      if (remarksVal !== '') {
        const response = fetchapprovalBtnResponse()
        if (response === '200') {
          if (onApproveSuccess) {
            onApproveSuccess()
          }
        }
      } else {
        messageReturn(405)
      }
    } else {
      messageReturn(605)
    }
  }
  // const error = resp => {
  //   message.error(resp)
  // }

  const handleDisapproveBtn = () => {
    const response = fetchdisapprovalBtnResponse()
    if (response === '200') {
      if (onApproveSuccess) {
        onApproveSuccess()
      }
    }
  }

  function OpenDetailCard() {
    setdetailCard(true)
  }

  const columns = [
    {
      title: 'Status Description',
      dataIndex: 'seqStatusDesc',
      key: 'seqStatus',
    },
    {
      title: 'Updated by',
      dataIndex: 'empDesc',
      key: 'empId',
      render: text => {
        let updatedBy = null
        if (text !== null) {
          updatedBy = text
        } else {
          updatedBy = '-'
        }
        return updatedBy
      },
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      render: text => {
        let remarks = null
        if (text !== null) {
          remarks = text
        } else {
          remarks = '-'
        }
        return remarks
      },
    },
    {
      title: 'Updated On',
      dataIndex: 'updatedOn',
      key: 'updatedOn',
      render: text => {
        let updatedOn = null
        if (text !== null) {
          updatedOn = moment(text).format('DD-MMM-YYYY HH:mm')
        } else {
          updatedOn = '-'
        }
        return updatedOn
      },
    },
  ]

  function addRemarksSubmit() {
    setApproveRemarksCard(true)
  }
  function RejectRemarksCard() {
    setRejectRemarksCard(true)
  }
  function getRemarksVal(e) {
    setRemarksVal(e.target.value)
  }
  function getRejectRemarksVal(e) {
    setRejectRemarksVal(e.target.value)
  }

  const AddRemarksComponent = () => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div>
            <div>
              <h5>
                Add Remarks <span style={{ color: 'red' }}>*</span>{' '}
              </h5>
              <TextArea rows={4} onChange={getRemarksVal} />
              <center style={{ marginTop: '10px' }}>
                <Buttons type="primary" text="Save" onClick={() => handleApproveBtn()} />
              </center>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const RejectRemarksComponent = () => {
    return (
      <div>
        <Card bordered={false} className="custom-card">
          <div>
            <div>
              <h5>Add Remarks</h5>
              <TextArea rows={4} onChange={getRejectRemarksVal} />
              <center style={{ marginTop: '10px' }}>
                <Buttons type="primary" text="Save" onClick={() => handleDisapproveBtn()} />
              </center>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center' }}>
      {currentlseq && currentlseq !== 'NA' && currentlseq !== '' ? (
        <h5>Stage - {currentlseq}</h5>
      ) : (
        ''
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        {documentStatusMstlist.length > 0 ? (
          <Select
            id="approvalDropdown"
            style={{ width: '150px' }}
            dropdownStyle={{ textAlign: 'left' }}
            onChange={value => handleDropdownChange(value)}
            value={selectedOption}
            placeholder="Select"
          >
            <Option value="" key="defaultOption">
              Select
            </Option>
            {documentStatusMstlist.map(option => (
              <Option key={option.currSequence} value={option.currSequence}>
                {option.docStatusDesc}
              </Option>
            ))}
          </Select>
        ) : null}

        {documentStatusMstlist.length > 0 ? (
          // <Button type="primary" text="Approve" onClick={handleApproveBtn} />,
          <Buttons type="primary" text="Update" onClick={addRemarksSubmit} />
        ) : null}
        <Popuptable
          onClose={() => setApproveRemarksCard(false)}
          cardLabel=""
          component={AddRemarksComponent}
          visible={approveRemarksCard}
        />
        <div style={{ marginLeft: '-16px', display: 'none' }}>
          {saveButtonStatusVals === true ? (
            <Buttons type="primary" text="Save" onClick={() => submitFunction()} />
          ) : null}
        </div>
        <div style={{ marginLeft: '0px' }}>
          <Buttons text="Back" onClick={handleBackClick} />
        </div>
        {cancelseq !== null ? (
          // <Button text="Disapprove" type="danger" onClick={handleDisapproveBtn} />
          <Buttons text="Hold / Previous Stage" type="danger" onClick={RejectRemarksCard} />
        ) : null}
        <Popuptable
          onClose={() => setRejectRemarksCard(false)}
          cardLabel=""
          component={RejectRemarksComponent}
          visible={rejectRemarksCard}
        />
        {currentlseq !== 'NA' ? (
          <Buttons
            // text="View Approval Cycle"
            type="primary"
            icon={<CommentOutlined />}
            onClick={() => {
              OpenDetailCard()
            }}
          />
        ) : null}
        <Popuptable
          onClose={() => setdetailCard(false)}
          cardLabel=""
          component={<Table dataSource={statusDetaillist} columns={columns} />}
          visible={detailCard}
        />
      </div>
    </div>
  )
}

export default CRApproveOrReject
