/* eslint-disable eqeqeq */
import React, { useState, useEffect } from 'react'
import { Table } from 'ant-table-extensions'
import store from 'store'
import { Input, Skeleton } from 'antd'
import moment from 'moment'
import { useHistory } from 'react-router-dom'
import ModalPopup from 'components/shared/ModalPopupComponent'
import ButtonComponent from 'components/shared/ButtonComponent'
import SupCompState from 'modules/scm/components/ScsComponent'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import currentDateTime from 'currentDateTime'
import { FileExcelOutlined } from '@ant-design/icons'
import ViewPoModal from 'modules/scm/components/IndentGroup/ViewPoModal'

const CommonPJSComponent = () => {
  let defaultfilterData = {}
  const history = useHistory()
  console.log(history)
  const prevPath = history.location.state?.from
  console.log(prevPath)
  if (history?.location?.state?.record?.refCode) {
    defaultfilterData = {
      indentCode: [history?.location?.state?.record?.refCode],
    }
  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pJSCompTablData, setPJSCompTablData] = useState([])
  const [poModalvisible, setPOmodalvisible] = useState(false)
  const [scsHdrid, setScsHdrid] = useState('')
  const [station, setStation] = useState('')
  const [subAssy, setSubAssy] = useState('')
  const [indentType, setIndentType] = useState('')
  const [indId, setIndId] = useState('')
  const [totalcost, settotalcost] = useState('')
  const [openindex, setOpenindex] = useState('')
  const [scsStatus, setScsStatus] = useState('')
  const [finalcost, setFinalcost] = useState('')
  const [indIdcd, setIndIdcd] = useState('')
  const [searchText, setSearchText] = useState('')
  const [filtersinfo, setfilterinfo] = useState(defaultfilterData)
  const [hdrdata, setHdrdata] = useState([])
  const [loading, setLoading] = useState(false)
  const tenantid = store.get('tenantId')
  const isInternal = store.get('isInternal')

  useEffect(() => {
    getPJSResponse()
  }, [])

  const getPJSResponse = async () => {
    const keyareaobj = {
      tenantId: tenantid,
      hdrId: store.get('ProjectID'),
      processCode: isInternal == 1 ? '8' : '5',
      // hdrId: '1',
    }
    setLoading(true)
    const response = await indentFileUpload({
      requestPath: 'getIndentGroupDtlsForSCS',
      requestData: keyareaobj,
    })
    if (response) {
      const updatedData = response?.responseData?.map((item, index) => {
        return {
          ...item,
          snumber: index + 1,
        }
      })
      setPJSCompTablData(updatedData)
    }
    setLoading(false)
  }
  const handleChange = (pagination, filters) => {
    setfilterinfo(filters)
  }

  const IndentCode1 = []
  const ScsStatus1 = []
  const PoStatus1 = []
  const sbcDesc1 = []
  const pkDesc1 = []
  const pskDesc1 = []
  const groupName1 = []
  const nextStatus1 = []
  const isInventory1 = []
  const expectedDeliveryDate1 = []

  if (pJSCompTablData && pJSCompTablData.length > 0) {
    pJSCompTablData.forEach(h => IndentCode1.push(h.indentCode))
    pJSCompTablData.forEach(h => ScsStatus1.push(h.scsStatus))
    pJSCompTablData.forEach(h => PoStatus1.push(h.poStatus))
    pJSCompTablData.forEach(h => sbcDesc1.push(h.sbcDesc))
    pJSCompTablData.forEach(h => pkDesc1.push(h.pkDesc))
    pJSCompTablData.forEach(h => pskDesc1.push(h.pskDesc))
    pJSCompTablData.forEach(h => isInventory1.push(h.isInventory))
    pJSCompTablData.forEach(h => groupName1.push(h.groupName))
    pJSCompTablData.forEach(h => nextStatus1.push(h.nextStatus))
    pJSCompTablData.forEach(h => expectedDeliveryDate1.push(h.expectedDeliveryDate))
  }

  // const distinct = (value, index, self) => self.indexOf(value) === index
  const distinct = (value, index, self) => {
    return value !== null && value !== undefined && value !== '' && self.indexOf(value) === index
  }

  const IndentCode2 = IndentCode1.filter(distinct)
  const isInventory2 = isInventory1.filter(distinct)
  const ScsStatus2 = ScsStatus1.filter(distinct)
  const PoStatus2 = PoStatus1.filter(distinct)
  const sbcDesc2 = sbcDesc1.filter(distinct)
  const pkDesc2 = pkDesc1.filter(distinct)
  const pskDesc2 = pskDesc1.filter(distinct)
  const groupName2 = groupName1.filter(distinct)
  const nextStatus2 = nextStatus1.filter(distinct)
  const expectedDeliveryDate2 = expectedDeliveryDate1.filter(distinct)

  const IndentCode3 = []
  const isInventory3 = []
  const ScsStatus3 = []
  const PoStatus3 = []
  const sbcDesc3 = []
  const pkDesc3 = []
  const pskDesc3 = []
  const groupName3 = []
  const nextStatus3 = []
  const expectedDeliveryDate3 = []

  IndentCode2.sort((a, b) => {
    const numA = parseInt(a.split('-').pop(), 10)
    const numB = parseInt(b.split('-').pop(), 10)
    return numA - numB
  }).forEach(element => {
    IndentCode3.push({
      text: element,
      value: element,
    })
  })

  isInventory2.forEach(element => {
    isInventory3.push({
      text: element === 'True' ? 'Yes' : 'No',
      value: element,
    })
  })

  ScsStatus2.slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      ScsStatus3.push({
        text: element,
        value: element,
      })
    })

  PoStatus2.slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      PoStatus3.push({
        text: element,
        value: element,
      })
    })

  sbcDesc2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      sbcDesc3.push({
        text: element,
        value: element,
      })
    })

  pkDesc2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      pkDesc3.push({
        text: element,
        value: element,
      })
    })

  pskDesc2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      pskDesc3.push({
        text: element,
        value: element,
      })
    })

  groupName2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      groupName3.push({
        text: element,
        value: element,
      })
    })

  nextStatus2
    .slice()
    .sort((a, b) => a?.localeCompare(b))
    .forEach(element => {
      nextStatus3.push({
        text: element,
        value: element,
      })
    })

  expectedDeliveryDate2.forEach(element => {
    expectedDeliveryDate3.push({
      text: moment(element).format('DD-MMM-YYYY'),
      value: element,
    })
  })

  const searchedData = (pJSCompTablData ?? [])
    .filter(item => {
      if (!searchText) return true
      return Object.values(item).some(value =>
        value
          ?.toString()
          .toLowerCase()
          .includes(searchText.toLowerCase()),
      )
    })
    // Target Cost has no real equivalent for NEW-flow (always the legacy indent_hdr.TARGET_VALUE,
    // permanently 0 there) - blank it at the data level so it's also correct in any CSV export.
    .map(item => (item.costFlowType === 'NEW' ? { ...item, targetCost: '-' } : item))
  const columns = [
    {
      title: 'S No.',
      dataIndex: 'snumber',
      key: 'snumber',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
    },
    {
      title: 'Indent No.',
      dataIndex: 'indentCode',
      key: 'indentCode',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: IndentCode3,
      filteredValue: filtersinfo.indentCode,
      onFilter: (value, record) => record?.indentCode === value,
    },
    {
      title: 'PJS No.',
      dataIndex: 'pjsRefNo',
      key: 'pjsRefNo',
      render: text => (text != null && text !== '' ? text : '-'),
    },
    {
      title: 'Indent Type',
      dataIndex: 'sbcDesc',
      key: 'sbcDesc',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: sbcDesc3,
      filteredValue: filtersinfo.sbcDesc,
      onFilter: (value, record) => record?.sbcDesc === value,
    },
    {
      title: 'Station',
      dataIndex: 'pkDesc',
      key: 'pkDesc',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: pkDesc3,
      filteredValue: filtersinfo.pkDesc,
      onFilter: (value, record) => record?.pkDesc === value,
    },
    {
      title: 'Sub Assembly',
      dataIndex: 'pskDesc',
      key: 'pskDesc',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: pskDesc3,
      filteredValue: filtersinfo.pskDesc,
      onFilter: (value, record) => record?.pskDesc === value,
    },

    {
      title: 'Group Name',
      dataIndex: 'groupName',
      key: 'groupName',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: groupName3,
      filteredValue: filtersinfo.groupName,
      onFilter: (value, record) => record?.groupName === value,
    },

    {
      title: 'Part Count',
      dataIndex: 'partCount',
      key: 'partCount',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      className: 'right-align-cell',
    },
    {
      title: 'Delivery Date',
      dataIndex: 'expectedDeliveryDate',
      key: 'expectedDeliveryDate',
      filters: expectedDeliveryDate3.sort((a, b) => {
        return new Date(a.value) - new Date(b.value)
      }),
      filteredValue: filtersinfo.expectedDeliveryDate || null,
      onFilter: (value, record) => record?.expectedDeliveryDate === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text ? moment(text).format('DD-MMM-YYYY') : '-',
      }),
    },
    {
      title: 'Target Cost (Rs.)',
      key: 'targetCost',
      dataIndex: 'targetCost',
      className: 'right-align-cell',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text === '-' ? '-' : text != null ? Number(text).toLocaleString('en-IN') : '-',
      }),
    },
    {
      title: 'Final Cost (Rs.)',
      key: 'finalCost',
      dataIndex: 'finalCost',
      className: 'right-align-cell',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? Number(text).toLocaleString('en-IN') : '-',
      }),
    },
    {
      title: 'Final Cost FX',
      key: 'finalCostFx',
      dataIndex: 'finalCostFx',
      className: 'right-align-cell',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? Number(text).toLocaleString('en-IN') : '-',
      }),
    },
    {
      title: 'Stock Availability',
      dataIndex: 'isInventory',
      key: 'isInventory',
      filters: isInventory3,
      filteredValue: filtersinfo.isInventory,
      onFilter: (value, record) => record?.isInventory === value,
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: <div>{text === 'True' ? 'Yes' : 'No'}</div>,
      }),
    },

    {
      title: 'PJS Current Status',
      dataIndex: 'scsStatus',
      key: 'scsStatus',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: ScsStatus3,
      filteredValue: filtersinfo.scsStatus,
      onFilter: (value, record) => record?.scsStatus === value,
    },
    {
      title: 'PJS Next Status',
      dataIndex: 'nextStatus',
      key: 'nextStatus',
      render: (text, record) => ({
        props: {
          style: {
            backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
          },
        },
        children: text != null ? text : '-',
      }),
      filters: nextStatus3,
      filteredValue: filtersinfo?.nextStatus,
      onFilter: (value, record) => record?.nextStatus === value,
      // render: text => (text !== undefined && text !== null ? text : '-'),
    },

    {
      title: 'PO Status',
      dataIndex: 'poStatus',
      key: 'poStatus',
      render: (text, record) => {
        const style = {
          backgroundColor: record.versionCheck === '1' ? '#FFFF00' : 'transparent',
        }

        if (text === 'Approved') {
          return {
            props: { style },
            children: (
              <a
                role="button"
                tabIndex={0}
                style={{ color: '#1890ff', textDecoration: 'underline', cursor: 'pointer' }}
                onClick={() => {
                  setPOmodalvisible(true)
                  setHdrdata(record)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setPOmodalvisible(true)
                    setHdrdata(record)
                  }
                }}
              >
                {text}
              </a>
            ),
          }
        }

        return {
          props: { style },
          children: text != null ? text : '-',
        }
      },
      filters: PoStatus3,
      filteredValue: filtersinfo.poStatus || null,
      onFilter: (value, record) => record?.poStatus === value,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, record, index) => {
        return (
          <div style={{ display: 'flex', justifyContent: 'left' }}>
            {isModalOpen && index === openindex ? (
              <ModalPopup
                isModalVisible={isModalOpen}
                FieldsComponent={renderScsComponent}
                text="PO Justification Sheet"
                maskClosable={false}
                onCancel={() => {
                  setScsmodalvisible(false)
                }}
                width="900"
              />
            ) : null}
            <ButtonComponent
              type="primary"
              text="PJS"
              onClick={() => {
                OpenScsCard(
                  record.igHdrId,
                  record.pkDesc,
                  record.sbcDesc,
                  record.pskDesc,
                  record.indentId,
                  index,
                  record.scsStatus,
                  record.targetCost,
                  record.indentCode,
                  record.finalCost,
                )
              }}
            />
          </div>
        )
      },
    },
    // This screen is always scoped to one project (store.get('ProjectID')), so every row shares
    // the same costFlowType - drop the whole column when the project is NEW-flow instead of just
    // blanking each cell.
  ].filter(col => col.key !== 'targetCost' || pJSCompTablData?.[0]?.costFlowType !== 'NEW')
  const OpenScsCard = (HdrId, st, it, sub, id, ind, sts, cost, indentCode, fincst) => {
    setIsModalOpen(true)
    setScsHdrid(HdrId)
    setStation(st)
    setSubAssy(sub)
    setIndentType(it)
    setIndId(id)
    settotalcost(cost)
    setOpenindex(ind)
    setScsStatus(sts)
    setIndIdcd(indentCode)
    setFinalcost(fincst)

    /* return(
      <ModalPopup
        isModalVisible={isModalOpen}
        FieldsComponent={renderScsComponent}
        text={`Supplier Comparative Statement  - ${slctdIndntCode}`}
        onCancel={() => {
          setScsmodalvisible(false)
        }}
        width="900"
      />
    )
    return (
      <Modal
        title={`Supplier Comparative Statement - ${slctdIndntCode}`}
        visible={isModalOpen}
        width="900"
        footer={null}
        onCancel={() => {
          setScsmodalvisible(false)
        }}
      >
        <ModalSCSComponent
          hdrId={scsHdrid}
          indentType={indentType}
          subAssy={subAssy}
          station={station}
          indentId={indId}
          scsStatus={scsStatus}
          totalcost={totalcost}
          indentcode={indIdcd}
          finalcost={finalcost}
          onmodalCancel={() => {
            setScsmodalvisible(false)
            getPJSResponse()
          }}
        />
      </Modal>
    ) */
  }
  const renderScsComponent = () => {
    return (
      <SupCompState
        hdrId={scsHdrid}
        indentType={indentType}
        subAssy={subAssy}
        station={station}
        indentId={indId}
        scsStatus={scsStatus}
        totalcost={totalcost}
        indentcode={indIdcd}
        finalcost={finalcost}
        ProcessCode1={isInternal == 1 ? '8' : '5'}
        onmodalCancel={() => {
          setScsmodalvisible(false)
          getPJSResponse()
        }}
        width="900"
      />
    )
  }
  const setScsmodalvisible = () => {
    setIsModalOpen(false)
  }
  return (
    <div>
      <Skeleton loading={loading} active>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Input.Search
            placeholder="Search..."
            allowClear
            enterButton
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 450 }}
          />
        </div>
        <Table
          dataSource={searchedData}
          columns={columns}
          bordered
          exportableProps={{
            fileName: `IndentGroup_${currentDateTime}`,
            btnProps: {
              type: 'primary',
              icon: <FileExcelOutlined />,
              children: <span>Export to CSV</span>,
            },
          }}
          pagination={{
            pageSizeOptions: ['10', '20', '30', '50', [pJSCompTablData?.length]],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          onChange={handleChange}
          scroll={{ y: 400 }}
        />
      </Skeleton>

      {poModalvisible ? (
        <ViewPoModal
          isModalVisible={poModalvisible}
          text="Indent Group Details"
          onCancel={() => {
            setPOmodalvisible(false)
          }}
          HdrId={hdrdata}
          width="900"
        />
      ) : null}
    </div>
  )
}

export default CommonPJSComponent
