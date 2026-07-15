import React, { useState, useEffect } from 'react'
import { Table, Space } from 'antd'
import DropDown from '../../shared/DropDownComponent'
import TextArea from '../../shared/TextAreaComponent'
import Input from '../../shared/InputComponent'
import Button1 from '../../shared/ButtonComponent'
import AddIconButton from '../../shared/AddIconComponent'
import RemoveIconButton from '../../shared/RemoveIconComponent'

const BudgetSheet = ({ handleBack = () => {} }) => {
  const dropdowndata = [
    {
      key: 1,
      value: 'Mechanical',
    },
    {
      key: 2,
      value: 'Electrical',
    },
    {
      key: 3,
      value: 'Service',
    },
    {
      key: 4,
      value: 'Others',
    },
  ]

  const generateInitialData = () => {
    return [
      {
        key: 1,
        sno: '1',
        keyCategory: dropdowndata[0].value,
        value: 4698680,
        editing: true,
      },
      {
        key: 2,
        sno: '2',
        keyCategory: dropdowndata[1].value,
        value: 1434270,
        editing: true,
      },
    ]
  }
  const [data, setData] = useState(generateInitialData())
  const [totalBudgetCost, setTotalBudgetCost] = useState(0)

  const handleAddRow = key => {
    const newData = [...data]
    const index = newData.findIndex(item => key === item.key)

    if (index > -1) {
      newData.splice(index + 1, 0, {
        key: String(data.length + 1),
        sno: data.length + 1,
        editable: true,
        keyCategory: '',
        value: '',
      })

      setData(newData)
    }
  }
  const handleRemoveRow = key => {
    const newData = data.filter(item => item.key !== key)
    setData(newData)
  }
  useEffect(() => {
    const updateBudgetCost = () => {
      const sum = data?.reduce((accumulator, row) => accumulator + row.value, 0)
      setTotalBudgetCost(sum)
    }

    updateBudgetCost()
  }, [data])

  const columns = [
    { title: 'S.No', dataIndex: 'sno' },
    {
      title: 'Key Category',
      dataIndex: 'keyCategory',
      render: (text, record) => (
        <DropDown
          data={dropdowndata}
          onChange={() => {}}
          onSelect={() => {}}
          defaultValue={record.keyCategory}
        />
      ),
    },

    {
      title: 'Value',
      dataIndex: 'value',
      render: (text, record) => (
        <Input
          type="text"
          value={record.value.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
          })}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space>
          {record.key !== 1 ? (
            <>
              <AddIconButton onClick={() => handleAddRow(record.key)} />
              {record.key !== 2 ? (
                <RemoveIconButton onClick={() => handleRemoveRow(record.key)} />
              ) : (
                <RemoveIconButton
                  onClick={() => handleRemoveRow(record.key)}
                  iscursor="not-allowed"
                  ispointerEve="none"
                />
              )}
            </>
          ) : (
            ''
          )}
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Table dataSource={data} columns={columns} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
        <p style={{ margin: '5px 10px' }}>Budget Cost</p>
        <Input
          value={totalBudgetCost.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
          readOnly
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
        <p style={{ margin: '15px 10px' }}>Payment Terms</p>
        <TextArea width="183px" />
      </div>

      <div style={{ textAlign: 'center', marginTop: '5px', justifyContent: 'center' }}>
        <Button1 text="Submit" type="primary" marginright="10px" />
        <Button1 text="Cancel" type="primary" onClick={handleBack} />
      </div>
    </div>
  )
}

export default BudgetSheet
