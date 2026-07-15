import React, { useState } from 'react'
import { Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
// import TopBar from 'components/cleanui/layout/TopBar'
import MenuTop from 'components/cleanui/layout/Menu/MenuTop'
import MenuLeft from 'components/cleanui/layout/Menu/MenuLeft'
import Menu from 'components/cleanui/layout/Menu'
import Sidebar from 'components/cleanui/layout/Sidebar'
import SupportChat from 'components/cleanui/layout/SupportChat'

const mapStateToProps = ({ settings }) => ({
  isContentMaxWidth: settings.isContentMaxWidth,
  isAppMaxWidth: settings.isAppMaxWidth,
  isGrayBackground: settings.isGrayBackground,
  isSquaredBorders: settings.isSquaredBorders,
  isCardShadow: settings.isCardShadow,
  isBorderless: settings.isBorderless,
  isTopbarFixed: settings.isTopbarFixed,
  isGrayTopbar: settings.isGrayTopbar,
})

const MainLayout = ({
  children,
  isContentMaxWidth,
  isAppMaxWidth,
  isGrayBackground,
  isSquaredBorders,
  isCardShadow,
  isBorderless,
  isTopbarFixed,
  isGrayTopbar,
}) => {
  const [selectedkey, SetSelectedKey] = useState([])
  const handleClick = e => {
    SetSelectedKey([e.key])
  }
  return (
    <div className={classNames({ cui__layout__grayBackground: isGrayBackground })}>
      <Layout
        className={classNames({
          cui__layout__contentMaxWidth: isContentMaxWidth,
          cui__layout__appMaxWidth: isAppMaxWidth,
          cui__layout__grayBackground: isGrayBackground,
          cui__layout__squaredBorders: isSquaredBorders,
          cui__layout__cardsShadow: isCardShadow,
          cui__layout__borderless: isBorderless,
        })}
      >
        <Sidebar />
        <SupportChat />
        <Menu />
        <Layout>
          <Layout.Header
            className={classNames('cui__layout__header', {
              cui__layout__fixedHeader: isTopbarFixed,
              cui__layout__headerGray: isGrayTopbar,
            })}
            style={{ display: 'block', backgroundColor: '#001F3E', color: 'black' }}
          >
            {/* <TopBar /> */}
            <MenuTop onhandleClick={handleClick} />
          </Layout.Header>

          <Layout.Content
            style={{
              minHeight: '100vh',
              position: 'relative',
              display: 'flex',
              paddingTop: '60px',
            }}
          >
            <div style={{ display: 'none' }}>
              <MenuLeft selectkey={selectedkey} />
            </div>
            <div
              className="cui__utils__content"
              style={{ flex: 1, paddingTop: '0px', paddingBottom: '0px', color: 'black' }}
            >
              {children}
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    </div>
  )
}

export default withRouter(connect(mapStateToProps)(MainLayout))
