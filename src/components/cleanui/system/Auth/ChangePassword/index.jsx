import React, { useState } from 'react'
import { Input, Form, Button, message } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { indentFileUpload } from '../../../../../services/common/AppeovedDocumentService/adddocumentservice'

const ChangePassword = ({
  disable,
  username,
  backtoLogin = () => {},
  Displayhide = () => {},
  updateNewName,
}) => {
  const [updateForm] = Form.useForm()
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  updateForm.setFieldsValue({ username })

  const validateConfirmPassword = ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('newpassword') === value) {
        setConfirmPasswordValid(true)
        return Promise.resolve('success')
      }
      setConfirmPasswordValid(false)
      return Promise.reject(new Error(`Confirm password doesnt match with the new Password!`))
    },
  })

  const onFinishFailed = errorInfo => {
    console.log(errorInfo)
  }
  const onFinish = values => {
    updatePassword(values)
  }

  const updatePassword = async e => {
    setIsLoading(true)
    const obj = {
      password: e.newpassword,
      userName: username,
    }
    const response = await indentFileUpload({
      requestPath: 'resetPassword',
      requestData: obj,
    })
    if (response) {
      if (response.responseCode === '200') {
        setIsLoading(false)
        message.success(response.responseDataMessage)
        updateForm.resetFields()
        updateNewName(false)
        backtoLogin()
        Displayhide()
      } else {
        setIsLoading(false)
        message.error(response.responseDataMessage)
      }
    }
    setIsLoading(false)
  }

  return (
    <div>
      <Form
        layout="vertical"
        hideRequiredMark
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="mb-4"
        form={updateForm}
      >
        <Form.Item name="username">
          <Input size="large" placeholder="UserName" disabled={disable} />
        </Form.Item>
        <Form.Item
          name="newpassword"
          rules={[{ required: true, message: 'Enter your New Password' }]}
        >
          <Input.Password
            placeholder="New Password"
            iconRender={visible => (visible ? <EyeOutlined /> : <EyeOutlined />)}
          />
        </Form.Item>
        <Form.Item
          name="confirmpassword"
          dependencies={['newpassword']}
          rules={[
            { required: true, message: 'Enter your Confirm New Password' },
            validateConfirmPassword,
          ]}
        >
          <Input.Password
            placeholder="Confirm New Password"
            iconRender={visible => (visible ? <EyeOutlined /> : <EyeOutlined />)}
          />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ marginTop: '20px' }}
          size="large"
          className="text-center w-100"
          disabled={!confirmPasswordValid}
          loading={isLoading}
        >
          Update Password
        </Button>
      </Form>
    </div>
  )
}

export default ChangePassword
