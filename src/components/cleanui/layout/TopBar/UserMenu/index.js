import React from 'react'
import store from 'store'
import { connect } from 'react-redux'
import { LogoutOutlined } from '@ant-design/icons'
import style from './style.module.scss'

const mapStateToProps = ({ user }) => ({ user })

const ProfileMenu = ({ dispatch }) => {
  const username = store.get('firstname')
  const logout = e => {
    store.set('currentTab', undefined)
    e.preventDefault()
    dispatch({
      type: 'user/LOGOUT',
    })
    localStorage.clear()
    store.remove('accessToken')
    window.location.reload()
  }

  return (
    <div className={style.main}>
      <div className={style.subMain}>
        Hello, {`  `}
        {username || 'Anonymous'}
      </div>
      <div className={style.logoutIcon}>
        <LogoutOutlined
          onClick={logout}
          style={{
            marginLeft: '10px',
            cursor: 'pointer',
            color: 'white',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '20px',
            transform: 'rotate(-90deg)',
          }}
        />
      </div>
    </div>
  )
}

export default connect(mapStateToProps)(ProfileMenu)
