import React, { useEffect, useState } from 'react'
import store from 'store'
import { Card, Button } from 'antd'
import { InfoCircleOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
// import DueDateIconClick from 'modules/project/components/ProjectProcessComponent/dueDateIconClick'
import DueDateIconClick from 'modules/project/components/ProjectDueDateEditable'
import EnquiryDetails from '../ProjectDetails'
import NavigationTabComponent from '../../../../components/shared/NavigationTabComponent'
import DisignBase from '../ProjectBase'
import NavigationComponent from '../ProjectNavigationComponent'
import '../style.scss'
import './style.scss'

// services
import SubMenuService from '../../../../services/SubMenu'

const Projectprocess = () => {

  const [EnquiryDtlsArry, setEnquiryDtlsArry] = useState(store.get('Enquiry'))

  // const enqryDetlsArry=enqrydetlsvwdtlsval.EnquiryDtlsArry;

  useEffect(() => {
    const handleEnquiryRefresh = e => {
      setEnquiryDtlsArry(e.detail || store.get('Enquiry'))
    }
    window.addEventListener('enquiry-refresh', handleEnquiryRefresh)
    return () => window.removeEventListener('enquiry-refresh', handleEnquiryRefresh)
  }, [])

  const [subMenu, setSubMenu] = useState([])
  // const [comp, Setcomponent] = useState([]);
  // const [tabvalue, setTabvalue] = useState([]);
  const [content, setContent] = useState(null)
  const [slaveId, setSlaveId] = useState(null)
  const [docTypeCode, setDocTypeCode] = useState(null)
  const [showPopUpModal, setShowPopUpModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  store.set('processDoc', 3)

  const ProjectID = store.get('ProjectPMHdrId')
  const processDoc = store.get('processDoc')
  const tenantId = store.get('tenantId')
  const currentTab = store.get('currentTab')
  const setDueDateStats = store.get('dueDateBtnStats')

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

  const showModalView = () => {
    setShowPopUpModal(true)
  }
  const handleCancel = () => {
    setShowPopUpModal(false)
  }

  const EnqueiryDetailsComponent = () => {
    return (
      <div>
        {/* <Card bordered={false} className="custom-card">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {EnquiryDtlsArry?.map(item => (
              <div key={item.key}>
                <p style={{ fontWeight: 'bold', margin: '0px' }}>
                  {item.label}
                  {item.editable === true && setDueDateStats === '1' ? (
                    <Button
                      onClick={showModalView}
                      style={{ minWidth: '15px', minHeight: '15px', borderColor: 'white' }}
                    >
                      <InfoCircleOutlined />
                    </Button>
                  ) : null}
                </p>
                <p style={{ margin: '0px' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </Card> */}
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
                      <span style={{ fontWeight: 'bold', margin: '0px' }}>
                        {item.label}
                        {item.editable === true && setDueDateStats === '1' ? (
                          <Button
                            onClick={showModalView}
                            style={{ minWidth: '15px', minHeight: '15px', borderColor: 'white' }}
                          >
                            <InfoCircleOutlined />
                          </Button>
                        ) : null}
                      </span>
                      &nbsp; : &nbsp;
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="Project_Details">
                {EnquiryDtlsArry.map(item => (
                  <div key={item.key}>
                    <p style={{ fontWeight: 'bold', margin: '0px' }}>
                      {item.label}
                      {item.editable === true && setDueDateStats === '1' ? (
                        <Button
                          onClick={showModalView}
                          style={{ minWidth: '15px', minHeight: '15px', borderColor: 'white' }}
                        >
                          <InfoCircleOutlined />
                        </Button>
                      ) : null}
                    </p>
                    <p style={{ margin: '0px' }}>{item.value}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        {showPopUpModal === true ? (
          <DueDateIconClick onClose={handleCancel} showPopUpModal={showPopUpModal} />
        ) : null}
      </div>
    )
  }

  return (
    <div>
      <NavigationComponent
        EntryDetailsComponent={EnquiryDetails}
        NavTabComponent={NavigationTabComponent}
        MainComponent={DisignBase}
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

export default Projectprocess
