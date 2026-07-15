import React, { useState, useEffect } from 'react'
import { Tabs } from 'antd'
import { NotificationOutlined } from '@ant-design/icons'
import store from 'store'
import { useHistory } from 'react-router-dom'
import { indentFileUpload } from 'services/common/AppeovedDocumentService/adddocumentservice'
import ButtonComponent from 'components/shared/ButtonComponent'
import { getTimeDifference } from '../../../../../_helpers/timeConvertion'
import style from './style.module.scss'

const { TabPane } = Tabs

const NotificationList = ({ isOpen, ClosePopover }) => {
  const history = useHistory()
  const tenantId = store.get('tenantId')
  const employeeId = store.get('employeeId')
  const [notificationList, setNotificationList] = useState([])

  useEffect(() => {
    getNotificationDetails()
  }, [isOpen === true])

  const getNotificationDetails = async () => {
    const keyareaobj = {
      tenantID: tenantId,
      empId: employeeId,
    }
    const response = await indentFileUpload({
      requestPath: 'getNotificationDetails',
      requestData: keyareaobj,
    })
    if (response.responseCode === '200') {
      setNotificationList(response?.responseData?.[0].list)
    } else {
      setNotificationList([])
    }
  }
  const closePopup = () => {
    ClosePopover()
    history.push('/notificationdetails')
  }
  return (
    <div>
      {notificationList.length > 0 ? (
        <div className={style.notificationList}>
          <Tabs tabBarStyle={{ display: 'flex', justifyContent: 'space-evenly' }}>
            {notificationList.map(({ event, list }) => {
              const sortedList = list.sort((a, b) => new Date(b.label) - new Date(a.label))
              return (
                <TabPane tab={event} key={event}>
                  {sortedList.map(item => (
                    <div key={item.notifiyId} className={style.notificationItem}>
                      <p style={{ fontWeight: item.isNotified === '0' ? 'bold' : '100' }}>
                        {item.description}
                      </p>
                      <span className={style.time}>{getTimeDifference(item.label)}</span>
                    </div>
                  ))}
                </TabPane>
              )
            })}
          </Tabs>
        </div>
      ) : (
        <div
          className={style.notificationList}
          style={{ textAlign: 'center', paddingTop: '13px', fontSize: '17px' }}
        >
          No Notifications
        </div>
      )}
      {notificationList.length > 0 ? (
        <div style={{ textAlign: 'right', marginTop: '8px' }}>
          <ButtonComponent
            onClick={() => {
              closePopup()
            }}
            text="Notification Center"
            type="primary"
            icon={<NotificationOutlined />}
          />
        </div>
      ) : null}
    </div>
  )
}

export default NotificationList
