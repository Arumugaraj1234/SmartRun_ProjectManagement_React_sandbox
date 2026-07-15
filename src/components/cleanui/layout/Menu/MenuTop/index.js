import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Menu, Popover, Badge } from 'antd'
import { Link, withRouter, useHistory } from 'react-router-dom'
import { BellOutlined, HomeFilled, ReloadOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import store from 'store'
import UserMenu from 'components/cleanui/layout/TopBar/UserMenu'
import { find } from 'lodash'
import GetMenuList from 'services/menus'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import logViewSearchCardFunction from '../../../../../_helpers/topmenu'
import NotificationList from './NotificaitonList'
import style from './style.module.scss'

const mapStateToProps = ({ menu, settings }) => ({
  menuData: menu.menuData,
  logo: settings.logo,
  menuColor: settings.topMenuColor,
  // role: user.role,
})

const MenuTop = ({
  // menuData = [],
  location: { pathname },
  menuColor,
  logo,

  onhandleClick,
}) => {
  const getList1 = store.get('MenuListData')
  const [selectedKeys, setSelectedKeys] = useState(store.get('app.menu.selectedKeys') || [])
  const [getList, setGetlist] = useState(getList1)
  const [notificationCount, setNotificationCount] = useState(0)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const MenuItemData = []
  const history = useHistory()
  const loginId = store.get('loginUserID')
  const tenantId = store.get('tenantId')
  const userRoleId = store.get('roleID')
  const employeeId = store.get('employeeId')

  useEffect(() => {
    const fetchData = async () => {
      const data = await logViewSearchCardFunction()
      setGetlist(data)
      store.set('MenuListData', data)
    }
    fetchData()
  }, [])

  useEffect(() => {
    updateNotificationCount()
    const interval = setInterval(() => {
      updateNotificationCount()
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const updateNotificationCount = () => {
    const count = store.get('notificationCount')
    if (count) {
      setNotificationCount(count)
    }
  }

  if (getList !== undefined && getList && getList.length > 0) {
    getList[0].uiModule.forEach(module => {
      const moduleItem = {
        children: [],
        // count: module.uiScreenMstList.length,
        title: module.displayName,
        key: module.seqNO,
      }

      module.uiScreenMstList.forEach(screen => {
        moduleItem.children.push({
          title: screen.displayName,
          key: screen.seqNO,
          url: screen.linkUrl,
        })
      })

      MenuItemData.push(moduleItem)
    })
  }

  useEffect(() => {
    applySelectedKeys()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const applySelectedKeys = () => {
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])
    const flatteitem = flattenItems(MenuItemData, 'children')

    const selectedItem = find(flatteitem, ['url', pathname])

    setSelectedKeys(selectedItem ? [selectedItem.key] : [])
  }
  const fetchBusinessMstdata = () => {
    const returnData = GetMenuList(loginId, tenantId, userRoleId)
    return returnData
  }

  const onLoadFunc = async () => {
    const response = await fetchBusinessMstdata(loginId, tenantId, userRoleId)
    let data = []
    if (response !== null && response !== undefined) {
      data = response.data.responseData
      store.set('MenuListData', data)
    } else {
      data = ''
    }

    if (data) {
      history.push(`${data[0].landingPageUrl}`)
    }
  }

  // const handleClick = e => {
  //   store.set('app.menu.selectedKeys', [e.key])
  //   setSelectedKeys([e.key])
  // }

  const generateMenuItems = () => {
    const generateItem = item => {
      const { key, title, url, icon, disabled, count } = item
      if (item.category) {
        return null
      }
      if (item.url) {
        return (
          <Menu.Item key={key} disabled={disabled}>
            {item.target && (
              <a href={url} target={item.target} rel="noopener noreferrer">
                {icon && <span className={`${icon} ${style.icon}`} />}
                <span className={style.title}>{title}</span>
                {count && <span className="badge badge-success ml-2">{count}</span>}
              </a>
            )}
            {!item.target && (
              <Link to={url}>
                {icon && <span className={`${icon} ${style.icon}`} />}
                <span className={style.title}>{title}</span>
                {count && <span className="badge badge-success ml-2">{count}</span>}
              </Link>
            )}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} disabled={disabled}>
          {icon && <span className={`${icon} ${style.icon}`} />}
          <span className={style.title}>{title}</span>
          {count && <span className="badge badge-success ml-2">{count}</span>}
        </Menu.Item>
      )
    }

    const generateSubmenu = items =>
      items.map(menuItem => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              {menuItem.icon && <span className={`${menuItem.icon} ${style.icon}`} />}
              <span className={style.title}>{menuItem.title}</span>
              {menuItem.count && <span className="badge badge-success ml-2">{menuItem.count}</span>}
            </span>
          )
          return (
            <Menu.SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </Menu.SubMenu>
          )
        }
        return generateItem(menuItem)
      })
    return MenuItemData.map(menuItem => {
      // if (menuItem.roles && !menuItem.roles.includes(role)) {
      //   return null
      // }

      if (menuItem.children) {
        const subMenuTitle = (
          <span key={menuItem.key}>
            {menuItem.icon && <span className={`${menuItem.icon} ${style.icon}`} />}
            <span className={style.title}>{menuItem.title}</span>
            {menuItem.count && <span className="badge badge-success ml-2">{menuItem.count}</span>}
          </span>
        )

        return (
          <Menu.SubMenu title={subMenuTitle} key={menuItem.key}>
            {generateSubmenu(menuItem.children)}
          </Menu.SubMenu>
        )
      }
      return generateItem(menuItem)
    })
  }
  const handlereload = () => {
    window.location.reload()
  }
  const handleLandingpage = () => {
    store.set('currentTab', undefined)
    onLoadFunc()
  }
  const handlePopoverVisibleChange = () => {
    if (isPopoverOpen === true) {
      setIsPopoverOpen(false)
    } else {
      setIsPopoverOpen(true)
      updateNotificaitonDetails()
    }
    setNotificationCount(0)
    store.set('notificationCount', 0)
  }

  const updateNotificaitonDetails = async () => {
    const keyareaobj = {
      tenantID: tenantId,
      empId: employeeId,
    }
    // eslint-disable-next-line no-unused-vars
    const response = await indentFileUpload({
      requestPath: 'updateNotificationDtls',
      requestData: keyareaobj,
    })
  }
  const onclosepopover = () => {
    console.log('close')
    handlePopoverVisibleChange()
  }
  return window.location.hash !== '#/alreadyLoggedIn' ? (
    <div
      className={classNames(`${style.menu}`, {
        [style.white]: menuColor === 'white',
        [style.gray]: menuColor === 'gray',
        [style.dark]: menuColor === 'dark',
        [style.none]: menuColor === 'none',
      })}
      style={{
        position: 'fixed',
        width: '100%',
        top: 0,
        zIndex: 1000,
        height: '60px',
        backgroundColor: '#001F3E',
      }}
    >
      <div className={style.logoContainer}>
        <div className={style.logo}>
          <img
            src="resources/images/logo.png"
            className="mr-2"
            alt="Clean UI"
            width="100px"
            height="50px"
            style={{ marginLeft: '-15px', marginTop: '0px' }}
          />
          <div className={style.name}>{logo}</div>
          {logo === 'React App' && <div className={style.descr}>React</div>}
        </div>
      </div>
      <div className={style.icons} style={{ color: 'white', fontSize: 'large' }}>
        <ReloadOutlined
          className={style.reload}
          style={{ marginRight: '10px' }}
          onClick={handlereload}
        />
        <HomeFilled onClick={handleLandingpage} />
      </div>
      <div className={style.navigation}>
        <Menu onClick={onhandleClick} selectedKeys={selectedKeys} mode="horizontal">
          {generateMenuItems()}
        </Menu>
      </div>
      <Popover
        content={<NotificationList isOpen={isPopoverOpen} ClosePopover={() => onclosepopover()} />}
        trigger="click"
        placement="bottomRight"
        overlayClassName={style.notificationPopover}
        onVisibleChange={handlePopoverVisibleChange}
        visible={isPopoverOpen}
      >
        <div className={style.notification_container}>
          <Badge
            count={notificationCount > 9 ? '9+' : notificationCount}
            className={style.badge_notification}
            offset={[-5, 0]}
          >
            <BellOutlined
              style={{
                marginLeft: '10px',
                cursor: 'pointer',
                color: 'white',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '23px',
              }}
            />
          </Badge>
        </div>
      </Popover>
      <div className={style.userMenu}>
        <UserMenu />
      </div>
    </div>
  ) : null
}

export default withRouter(connect(mapStateToProps)(MenuTop))
