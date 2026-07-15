import React, { useState, useEffect } from 'react'
import store from 'store'
import { Card, Input, Form, Select } from 'antd'
import messageReturn from '_helpers/messageReturn'
import { indentFileUpload } from '../../../services/common/AppeovedDocumentService/adddocumentservice'
import Button from '../../shared/ButtonComponent'

const BudgetComponent = ({ record, singleIndent }) => {
  const { Option } = Select
  const ProjectID = store.get('ProjectID')
  const Tab = store.get('Tab')
  const [budgetForm] = Form.useForm()
  const [BudgetList, setBudgetList] = useState([])
  const [singleIndents, setSingleIndents] = useState({})

  useEffect(() => {
    setSingleIndents(singleIndent)
    getBudgetDetail()
  }, [record, singleIndent])

  const getBudgetDetail = async () => {
    const reqobj = {
      pmHdrId: ProjectID,
      pskId: singleIndents.keyAreaId,
      tenantId: Tab.tenantId,
    }
    const response = await indentFileUpload({
      requestPath: 'getbugetextnListbyDSkId',
      requestData: reqobj,
    })
    setBudgetList(response?.responseData || [])
  }

  const handleSelect = (value, type) => {
    if (type === 'Indent') {
      budgetForm.setFieldsValue({
        Availableqty: BudgetList.find(item => item.sbExtnId === value)?.totalQty,
        AvailableBudget: BudgetList.find(item => item.sbExtnId === value)?.totalValue,
      })
    } else {
      const formValues = budgetForm.getFieldsValue()
      const selectedObject = BudgetList.find(item => item.sbExtnId === formValues.budget)
      if (formValues.Availableqty >= value) {
        budgetForm.setFieldsValue({
          AllocatedBudget: selectedObject?.perPartVal * value,
        })
      } else {
        messageReturn(612)
      }
    }
  }

  return (
    <div>
      <Form form={budgetForm}>
        <Card bordered={false} className="custom-card budget-card">
          <Form.Item
            name="budget"
            label={
              <span>
                Element<span style={{ color: 'red' }}>*</span>
              </span>
            }
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            labelAlign="left"
          >
            <Select
              style={{ width: '100%' }}
              placeholder="Select Indent"
              onSelect={value => handleSelect(value, 'Indent')}
            >
              {BudgetList?.map(item => (
                <Option key={item.sbExtnId} value={item.sbExtnId}>
                  {item.elementDtl}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="Availableqty"
            label={
              <span>
                AvailableQty<span style={{ color: 'red' }}>*</span>
              </span>
            }
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            labelAlign="left"
          >
            <Input type="number" readOnly />
          </Form.Item>
          <Form.Item
            name="AllocatedQty"
            label={
              <span>
                AllocatedQty<span style={{ color: 'red' }}>*</span>
              </span>
            }
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            labelAlign="left"
          >
            <Input type="number" onChange={e => handleSelect(e.target.value, 'Qty')} />
          </Form.Item>
          <Form.Item
            name="AvailableBudget"
            label={
              <span>
                Available Budget<span style={{ color: 'red' }}>*</span>
              </span>
            }
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            labelAlign="left"
          >
            <Input type="number" readOnly />
          </Form.Item>
          <Form.Item
            name="AllocatedBudget"
            label={
              <span>
                Allocated Budget<span style={{ color: 'red' }}>*</span>
              </span>
            }
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            labelAlign="left"
          >
            <Input type="number" readOnly />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="primary" text="Save" style={{ marginTop: '10px' }} />
          </div>
        </Card>
      </Form>
    </div>
  )
}

export default BudgetComponent
