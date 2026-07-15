import React, { useState } from 'react'
import store from 'store'
import { Tabs, Drawer, Button } from 'antd'
import { useMediaQuery } from 'react-responsive'
import { FiMoreVertical } from 'react-icons/fi'
import './style.scss'

const { TabPane } = Tabs

const NavigationTab = ({ handleTabClick = () => {}, activeTab, Navdata, ModuleName }) => {
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' })
  const [drawerVisible, setDrawerVisible] = useState(false)

  const storeTab = tab => {
    store.set('Tab', tab)
  }

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible)
  }

  return (
    <>
      {isMobile ? (
        <div>
          <div style={{ textAlign: 'right', padding: '5px' }}>
            <div className="Tab_custom_icon">
              <Button onClick={toggleDrawer} type="text" icon={<FiMoreVertical />} size={24} />
            </div>
            <Drawer
              title={ModuleName || 'Navigation'}
              placement="right"
              onClose={toggleDrawer}
              visible={drawerVisible}
            >
              {Navdata.map(tab => (
                <div
                  key={tab.pcId}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    handleTabClick(tab.stgDesc)
                    storeTab(tab)
                    toggleDrawer()
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleTabClick(tab.stgDesc)
                      storeTab(tab)
                      toggleDrawer()
                    }
                  }}
                  style={{
                    margin: '10px 0',
                    padding: '10px',
                    borderBottom: activeTab === `${tab.stgDesc}` ? '7px solid #007bff' : 'none',
                    borderRadius: activeTab === `${tab.stgDesc}` ? '5px' : '5px',
                  }}
                >
                  {tab.stgDesc}
                </div>
              ))}
            </Drawer>
          </div>
        </div>
      ) : (
        <Tabs activeKey={activeTab} className="sticky_tabs">
          {Navdata.map(tab => (
            <TabPane
              key={tab.pcId}
              tab={
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    handleTabClick(tab.stgDesc)
                    storeTab(tab)
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleTabClick(tab.stgDesc)
                      storeTab(tab)
                    }
                  }}
                  style={{
                    borderBottom: activeTab === `${tab.stgDesc}` ? '7px solid #007bff' : 'none',
                    borderRadius: activeTab === `${tab.stgDesc}` ? '5px' : '5px',
                  }}
                >
                  {tab.stgDesc}
                </div>
              }
            >
              {typeof tab.component === 'function' ? <tab.component stageCode={tab} /> : null}
            </TabPane>
          ))}
        </Tabs>
      )}
    </>
  )
}

export default NavigationTab
