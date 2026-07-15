import React, { useState } from 'react'
import { DatePicker, Space, Input } from 'antd'
import moment from 'moment'
import Table from '../TableComponent'
import Button from '../../shared/ButtonComponent'
import AddIconButton from '../../shared/AddIconComponent'
import RemoveIconButton from '../../shared/RemoveIconComponent'

const GapListComponent = ({ handleBack = () => {} }) => {
  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Gap Point',
      dataIndex: 'gappoint',
      key: 'gappoint',
    },
    {
      title: 'Raised On',
      dataIndex: 'raisedon',
      key: 'raisedon',
    },
    {
      title: 'Raised By',
      key: 'raisedby',
      dataIndex: 'raisedby',
    },
    {
      title: 'Target Date',
      key: 'targetdate',
      dataIndex: 'targetdate',
    },
  ]

  const data = [
    {
      sno: 1,
      gappoint: 'Robot quote from 3 suppliers',
      raisedon: '17/01/2023',
      raisedby: 'Mahendran',
      targetdate: '30/01/2023',
    },
    {
      sno: 2,
      gappoint: 'Component study/varients data matrix',
      raisedon: '17/01/2023',
      raisedby: 'John',
      targetdate: '30/01/2023',
    },
    {
      sno: 3,
      gappoint: 'Dispencing quote from 3 suppliers',
      raisedon: '17/01/2023',
      raisedby: 'Vinoth',
      targetdate: '30/01/2023',
    },
    {
      sno: 4,
      gappoint: 'Motors or servo motors quote from 3 suppliers',
      raisedon: '17/01/2023',
      raisedby: 'Ravi',
      targetdate: '30/01/2023',
    },
  ]
  const [Addtabledata, setaddtableData] = useState([
    {
      sno: 1,
      gappoint: 'Prabu',
      targetDate: '2024-01-01',
      action: '',
    },
  ])

  const AddTablecolumns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Gap Point',
      dataIndex: 'gappoint',
      key: 'gappoint',
      render: (_, record) => (
        <Input
          value={record.teamMembers}
          onChange={e => handleTeamMembersChange(record.key, e.target.value)}
        />
      ),
    },
    {
      title: 'Target Date',
      dataIndex: 'targetDate',
      key: 'targetDate',
      width: 200,
      render: text => <DatePicker value={moment(text)} />,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space>
          <AddIconButton onClick={() => handleAddRow(Addtabledata[Addtabledata.length - 1].key)} />
          {record.key !== 1 && Addtabledata.length > 1 ? (
            <RemoveIconButton onClick={() => handleRemoveRow(record.key)} />
          ) : (
            <RemoveIconButton
              ispointerEve="none"
              iscursor="not-allowed"
              onClick={() => handleRemoveRow(record.key)}
            />
          )}
        </Space>
      ),
    },
  ]

  const handleTeamMembersChange = (key, value) => {
    const newData = Addtabledata.map(item =>
      item.key === key ? { ...item, teamMembers: value } : item,
    )
    setaddtableData(newData)
  }

  const handleAddRow = key => {
    const newData = [...Addtabledata]

    const index = newData.findIndex(item => key === item.key)
    if (index > -1) {
      newData.splice(index + 1, 0, {
        key: String(Addtabledata.length + 1),
        sno: Addtabledata.length + 1,
        editable: true,
        gapPoint: '',
        targetDate: moment(),
      })

      setaddtableData(newData)
    }
  }
  const handleRemoveRow = key => {
    const newData = Addtabledata.filter(item => item.key !== key)
    setaddtableData(newData)
  }

  return (
    <div>
      <Table columns={columns} data={data} />

      <h5 style={{ fontWeight: 'bold' }}>Add New Gap Point</h5>

      <Table columns={AddTablecolumns} data={Addtabledata} />
      <div style={{ textAlign: 'center', marginTop: '5px', justifyContent: 'center' }}>
        <Button text="Submit" type="primary" marginright="10px" />
        <Button text="Cancel" type="primary" onClick={handleBack} />
      </div>
    </div>
  )
}

export default GapListComponent
