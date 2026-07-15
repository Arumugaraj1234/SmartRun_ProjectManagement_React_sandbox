import React, { useEffect, useState } from 'react'
import store from 'store'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import FinanceDetails from '../financeDetails'
import NavigationTabComponent from '../../../../components/shared/NavigationTabComponent'
import FinanceBase from '../financeBase'
import NavigationComponent from '../financeNavigationComponent'
import './index.scss'

// services
import SubMenuService from '../../../../services/SubMenu'

const Financeprocess = () => {
  const EnquiryDtlsArry = store.get('Enquiry')
  const [subMenu, setSubMenu] = useState([])
  const [content, setContent] = useState(null)
  const [slaveId, setSlaveId] = useState(null)
  const [docTypeCode, setDocTypeCode] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const currentTab = store.get('currentTab')

  store.set('processDoc', 7)

  const feHdrId = store.get('feHdrId')
  const processDoc = store.get('processDoc')
  const tenantId = store.get('tenantId')

  const fetchSubMenuList = () => {
    const returnData = SubMenuService(feHdrId, processDoc, tenantId)
    return returnData
  }
  useEffect(() => {
    async function onLoadFunc() {
      const response = await fetchSubMenuList(feHdrId, processDoc, tenantId)
      if (response !== null && response !== undefined) {
        setSubMenu(response.data.responseData || [])
      } else {
        setSubMenu([])
      }
    }
    onLoadFunc()
  }, [feHdrId, processDoc, tenantId])
  const [activeTab, setActiveTab] = useState('')
  useEffect(() => {
    let staticTab = null
    if (currentTab && subMenu && subMenu.length > 0) {
      const currentTab1 = subMenu.find(data => data.stgDesc === currentTab)
      staticTab = currentTab1
    } else {
      const defaultTab = subMenu.find(data => data.isdefault === 'True')
      if (defaultTab) {
        staticTab = defaultTab
      }
    }

    if (staticTab != null) {
      setActiveTab(staticTab.stgDesc)
      setSlaveId(staticTab.slaveId)
      setDocTypeCode(staticTab.docTypeCode)
      store.set('Tab', staticTab)
      store.set('referenceMstId', staticTab.mstId)
    }
  }, [subMenu])

  const handleTabClick = tab => {
    if (tab) {
      store.set('currentTab', tab)
      setActiveTab(tab)
      setSlaveId(tab.slaveId)
      setDocTypeCode(tab.docTypeCode)
    }
  }

  useEffect(() => {
    const tab = subMenu.find(tabs => tabs.stgDesc === activeTab)
    const contents = tab && tab.component
    setContent(contents)
  }, [activeTab, subMenu])

  const EnqueiryDetailsComponent = () => {
    return (
      <div>
        <Card bordered={false} bodyStyle={{ padding: 10 }} className="custom-card">
          <div className="Project_Details_opener">
            {showDetails ? (
              <UpOutlined onClick={() => setShowDetails(!showDetails)} />
            ) : (
              <DownOutlined onClick={() => setShowDetails(!showDetails)} />
            )}
          </div>
          {showDetails ? (
            <div className="Project_Details1">
              {EnquiryDtlsArry.map(item => (
                <div key={item.key}>
                  <p>
                    <span style={{ fontWeight: 'bold', margin: '0px' }}>{item.label}</span> :{' '}
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="Project_Details">
              {EnquiryDtlsArry.map(item => (
                <div key={item.key}>
                  <p style={{ fontWeight: 'bold', margin: '0px' }}>{item.label}</p>
                  <p style={{ margin: '0px' }}>{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
        {/* <Card bordered={false} bodyStyle={{ padding: 10 }} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {EnquiryDtlsArry?.map(item => (
              <div key={item.key}>
                <p style={{ fontWeight: 'bold', margin: '0px' }}>{item.label}</p>
                <p style={{ margin: '0px' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card> */}
      </div>
    )
  }

  return (
    <div>
      <NavigationComponent
        EntryDetailsComponent={FinanceDetails}
        NavTabComponent={NavigationTabComponent}
        MainComponent={FinanceBase}
        content={content}
        handleTabClick={handleTabClick}
        Navdata={subMenu}
        activeTab={activeTab}
        SlaveID={slaveId}
        DocTypeCode={docTypeCode}
        EnqueiryComponent={EnqueiryDetailsComponent}
      />
    </div>
  )
}

export default Financeprocess
