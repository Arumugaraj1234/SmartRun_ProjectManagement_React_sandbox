import React, { useEffect, useState } from 'react'
import store from 'store'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import EnquiryDetails from 'modules/sales/components/EnquiryDetails'
import NavigationTabComponent from '../../../../components/shared/NavigationTabComponent'
import MainCard from '../ScmBase'
import NavigationComponent from '../ScmNavigationComponent'
import '../style.scss'
import './style.scss'

// services
import SubMenuService from '../../../../services/SubMenu'

const ScsProcessComp = () => {
  const EnquiryDtlsArry = store.get('Enquiry')
  const currentTab = store.get('currentTab')
  const [subMenu, setSubMenu] = useState([])
  const [content, setContent] = useState(null)
  const [slaveId, setSlaveId] = useState(null)
  const [docTypeCode, setDocTypeCode] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  store.set('processDoc', '5')

  const ProjectID = store.get('ScmHdrId')
  const processDoc = store.get('processDoc')
  const tenantId = store.get('tenantId')

  const fetchSubMenuList = () => {
    const returnData = SubMenuService(ProjectID, processDoc, tenantId)
    return returnData
  }

  useEffect(() => {
    async function onLoadFunc() {
      const response = await fetchSubMenuList(ProjectID, processDoc, tenantId)
      if (response !== null && response !== undefined) {
        setSubMenu(response.data.responseData || [])
      } else {
        setSubMenu([])
      }
    }
    onLoadFunc()
  }, [ProjectID, processDoc, tenantId])

  const [activeTab, setActiveTab] = useState('')
  // useEffect(() => {
  //   const defaultTab = subMenu.find(data => data.isdefault === 'True')

  //   if (defaultTab) {
  //     setActiveTab(defaultTab.stgDesc)
  //     setSlaveId(defaultTab.slaveId)
  //     setDocTypeCode(defaultTab.docTypeCode)
  //     store.set('Tab', defaultTab)
  //     store.set('referenceMstId', defaultTab.mstId)
  //   }
  // }, [subMenu])

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

  // const handleTabClick = tab => {
  //   if (tab) {
  //     setActiveTab(tab)
  //     setSlaveId(tab.slaveId)
  //     setDocTypeCode(tab.docTypeCode)
  //   }
  // }

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
        {/* <Card bordered={false} className="custom-card">
          <div className="custom_project_details" style={{ display: 'flex', justifyContent: 'space-between' }}>
            {EnquiryDtlsArry?.map(item => (
              <div key={item.key}>
                <p style={{ fontWeight: 'bold', margin: '0px' }}>{item.label}</p>
                <p style={{ margin: '0px' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card> */}
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
      </div>
    )
  }

  return (
    <div>
      <NavigationComponent
        EntryDetailsComponent={EnquiryDetails}
        NavTabComponent={NavigationTabComponent}
        MainComponent={MainCard}
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

export default ScsProcessComp
