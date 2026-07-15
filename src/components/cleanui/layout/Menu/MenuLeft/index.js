import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { Menu, Layout } from 'antd'
import classNames from 'classnames'
import { DoubleRightOutlined } from '@ant-design/icons'
import store from 'store'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { find } from 'lodash'
// import UserMenu from 'components/cleanui/layout/TopBar/UserMenu'
import logViewSearchCardFunction from '../../../../../_helpers/topmenu'
import style from './style.module.scss'

const mapStateToProps = ({ menu, settings, user }) => ({
  menuData: menu.menuData,
  isMenuCollapsed: settings.isMenuCollapsed,
  isMobileView: settings.isMobileView,
  isMenuUnfixed: settings.isMenuUnfixed,
  isMenuShadow: settings.isMenuShadow,
  leftMenuWidth: settings.leftMenuWidth,
  menuColor: settings.leftMenuColor,
  logo: settings.logo,
  logotenant: user.userlogo,
  role: user.role,
  name: user.userfullname,
})

const MenuLeft = ({
  dispatch,
  // menuData = [],
  location: { pathname },
  isMenuCollapsed,
  isMobileView,
  isMenuUnfixed,
  isMenuShadow,
  leftMenuWidth,
  menuColor,
  handleClose,
  // logo,
  // logotenant,
  role,
  // name
}) => {
  // const MenuTtemRes = selectkey && selectkey.length > 0 ? MenuItemData : []
  const getList1 = store.get('MenuListData')
  const [getList, setGetlist] = useState(getList1)
  const [selectedKeys, setSelectedKeys] = useState(store.get('app.menu.selectedKeys') || [])
  const [openedKeys, setOpenedKeys] = useState(store.get('app.menu.openedKeys') || [])
  const MenuItemData = []

  useEffect(() => {
    const fetchData = async () => {
      const data = await logViewSearchCardFunction()
      setGetlist(data)
      store.set('MenuListData', data)
    }
    fetchData()
  }, [])

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
    const selectedItem = find(flattenItems(MenuItemData, 'children'), ['url', pathname])
    setSelectedKeys(selectedItem ? [selectedItem.key] : [])
  }

  const onCollapse = type => {
    if (type === 'responsive' && isMenuCollapsed) {
      return
    }
    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'isMenuCollapsed',
        value: !isMenuCollapsed,
      },
    })
    setOpenedKeys([])
  }

  const onOpenChange = keys => {
    store.set('app.menu.openedKeys', keys)
    setOpenedKeys(keys)
  }

  const handleClick = e => {
    store.set('app.menu.selectedKeys', [e.key])
    setSelectedKeys([e.key])
    handleClose()
  }

  const generateMenuItems = () => {
    const generateItem = item => {
      const { key, title, url, icon, disabled, count } = item
      if (item.category) {
        return <Menu.ItemGroup key={Math.random()} title={item.title} />
      }
      if (item.url) {
        return (
          <Menu.Item key={key} disabled={disabled}>
            {item.target && (
              <a href={url} target={item.target} rel="noopener noreferrer">
                <span className={style.title}>{title}</span>
                {count && <span className="badge badge-success ml-2">{count}</span>}
                {icon && <span className={`${icon} ${style.icon} icon-collapsed-hidden`} />}
              </a>
            )}
            {!item.target && (
              <Link to={url}>
                <span className={style.title}>{title}</span>
                {count && <span className="badge badge-success ml-2">{count}</span>}
                {icon && <span className={`${icon} ${style.icon} icon-collapsed-hidden`} />}
              </Link>
            )}
          </Menu.Item>
        )
      }
      return (
        <Menu.Item key={key} disabled={disabled}>
          <span className={style.title}>{title}</span>
          {count && <span className="badge badge-success ml-2">{count}</span>}
          {icon && <span className={`${icon} ${style.icon} icon-collapsed-hidden`} />}
        </Menu.Item>
      )
    }

    const generateSubmenu = items =>
      items.map(menuItem => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span key={menuItem.key}>
              <span className={style.title}>{menuItem.title}</span>
              {menuItem.count && <span className="badge badge-success ml-2">{menuItem.count}</span>}
              {menuItem.icon && <span className={`${menuItem.icon} ${style.icon}`} />}
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
      if (menuItem.roles && !menuItem.roles.includes(role)) {
        return null
      }
      if (menuItem.children) {
        const subMenuTitle = (
          <span key={menuItem.key}>
            <span className={style.title}>{menuItem.title}</span>
            {menuItem.count && <span className="badge badge-success ml-2">{menuItem.count}</span>}
            {menuItem.icon && <span className={` mr-10 ${menuItem.icon} ${style.icon}`} />}
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

  const menuSettings = isMobileView
    ? {
        width: leftMenuWidth,
        collapsible: false,
        collapsed: false,
        onCollapse,
      }
    : {
        width: leftMenuWidth,
        collapsible: true,
        collapsed: isMenuCollapsed,
        onCollapse,
        breakpoint: 'lg',
      }

  return (
    <Layout.Sider
      {...menuSettings}
      className={classNames(`${style.menu}`, {
        [style.dark]: menuColor === 'dark',
        [style.white]: menuColor === 'white',
        [style.gray]: menuColor === 'gray',
        [style.unfixed]: isMenuUnfixed,
        [style.shadow]: isMenuShadow,
      })}
    >
      <div
        className={style.menuOuter}
        style={{
          width: isMenuCollapsed && !isMobileView ? 80 : leftMenuWidth,
          height: isMobileView || isMenuUnfixed ? 'calc(100% - 64px)' : 'calc(100% - 110px)',
        }}
      >
        <h6 style={{ color: 'white', textAlign: 'center', marginTop: '5px', fontWeight: 'bold' }}>
          SmartRun
        </h6>
        <PerfectScrollbar>
          <Menu
            onClick={handleClick}
            selectedKeys={selectedKeys}
            openKeys={openedKeys}
            onOpenChange={onOpenChange}
            mode="inline"
            className={style.navigation}
            inlineIndent="10"
          >
            {generateMenuItems()}
          </Menu>

          <br />
        </PerfectScrollbar>
        <div
          style={{
            color: 'white',
            fontSize: '20px',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <DoubleRightOutlined onClick={handleClose} />
        </div>
      </div>
    </Layout.Sider>
  )
}

export default withRouter(connect(mapStateToProps)(MenuLeft))
