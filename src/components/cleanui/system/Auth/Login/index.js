import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { EyeOutlined } from '@ant-design/icons'
import { Input, Button, Form } from 'antd'
import { useMediaQuery } from 'react-responsive'
// import { Link } from 'react-router-dom'
import style from '../style.module.scss'

import ForgotPassword from '../ForgotPassword'

const mapStateToProps = ({ user, settings, dispatch }) => ({
  dispatch,
  user,
  authProvider: settings.authProvider,
  logo: settings.logo,
})

const Login = ({ dispatch }) => {
  const [loginform] = Form.useForm()
  const [isVisible, setIsVisible] = useState(false)
  const [newname, setNewName] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 769px)' })

  const backtoSignin = () => {
    setIsVisible(false)
  }

  const updateNewName = e => {
    setNewName(e)
  }

  const backtoLogin = () => {
    setIsVisible(true)
  }

  const onFinish = values => {
    // const cutoffDate = new Date('2026-12-28T00:00:00')
    // if (new Date() >= cutoffDate) {
    //   loginform.resetFields()
    //   // return window.alert("Login has been disabled");
    //   return null
    // }
    dispatch({
      type: 'user/LOGIN',
      payload: {
        ...values,
        callback: result => {
          if (!result) {
            loginform.resetFields()
          }
        },
      },
    })
    return null
  }

  useEffect(() => {
    localStorage.clear()
  }, [])

  const onFinishFailed = errorInfo => {
    console.error('Failed:', errorInfo)
  }

  const handleForgotPassword = () => {
    setIsVisible(true)
  }

  return (
    <div
      className={`card ${style.container}`}
      style={
        !isMobile
          ? {
              paddingTop: '40px',
              marginTop: '-53px',
              height: 'auto',
              width: '400px',
              maxWidth: '480px',
              background: 'white',
            }
          : {
              height: 'auto',
              width: '300px',
              // maxWidth: '480px',
              background: 'white',
            }
      }
    >
      <div className="text-center">
        <strong style={{ fontSize: '28px' }}>
          <br />
          <span style={{ color: '#1e4388' }}>BGR NEO LIMITED</span>
          <br />
          <span style={{ color: '#ff5d22' }}>Project </span>
          <span style={{ color: 'deepskyblue' }}>Management</span>
        </strong>
      </div>

      <div className="text-dark font-size-24 mb-3">
        <strong>
          {!isVisible && !newname
            ? 'Sign in'
            : isVisible && !newname
            ? 'Forgot Password'
            : 'Update Password'}
        </strong>
      </div>

      {!isVisible ? (
        <div>
          <Form
            form={loginform}
            layout="vertical"
            hideRequiredMark
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="mb-4"
            initialValues={{ email: '', password: '' }}
            onLoad={onFinish}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'The Username field is required.' }]}
            >
              <Input size="large" placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'The Password field is required.' }]}
            >
              <Input.Password
                size="large"
                type="password"
                placeholder="Password"
                iconRender={visible => (visible ? <EyeOutlined /> : <EyeOutlined />)}
              />
            </Form.Item>
            <Button type="primary" size="large" className="text-center w-100" htmlType="submit">
              <strong>Sign in</strong>
            </Button>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <span
              style={{ textAlign: 'right', cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onClick={handleForgotPassword}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  handleForgotPassword()
                }
              }}
            >
              Forgot Password
            </span>
          </div>
        </div>
      ) : (
        <div>
          <ForgotPassword
            backtoSignin={backtoSignin}
            backtoLogin={backtoLogin}
            updateNewName={updateNewName}
          />
        </div>
      )}
    </div>
  )
}

export default connect(mapStateToProps)(Login)
