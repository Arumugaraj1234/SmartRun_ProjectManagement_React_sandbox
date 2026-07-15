import React, { lazy, Suspense, useEffect, useState } from 'react'
import store from 'store'
import { Route, Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { connect } from 'react-redux'
import Layout from 'layouts'
import AlreadyLoggedIn from 'components/cleanui/system/Errors/alreadyLoggedIn'

const routes = [
  // Sale
  {
    path: '/sales',
    Component: lazy(() => import('modules/sales/pages')),
    exact: true,
  },
  {
    path: '/salesdetails',
    Component: lazy(() => import('modules/sales/components/SalesProcessComponent/index')),
    exact: true,
  },
  {
    path: '/sales/dashboard',
    Component: lazy(() => import('modules/sales/components/Dashboard/index')),
    exact: true,
  },
  {
    path: '/finance/dashboard',
    Component: lazy(() => import('modules/finance/components/Dashboard/index')),
    exact: true,
  },
  {
    path: '/commonPJS',
    Component: lazy(() => import('components/common/CommonPJS')),
    exact: true,
  },
  // Design
  {
    path: '/design',
    Component: lazy(() => import('modules/design/pages/index')),
    exact: true,
  },
  {
    path: '/designdetails',
    Component: lazy(() => import('modules/design/components/DesignProcessComponent/index')),
    exact: true,
  },
  {
    path: '/indentlifecycle',
    Component: lazy(() => import('modules/design/components/IndentLifecycle/index')),
    exact: true,
  },
  {
    path: '/master/customerMaster',
    Component: lazy(() => import('modules/master/components/CustomerMaster/index')),
    exact: true,
  },
  // Master
  {
    path: '/master/itemsmaster',
    Component: lazy(() => import('modules/master/components/ItemsMaster/index')),
    exact: true,
  },
  {
    path: '/master/vendorMaster',
    Component: lazy(() => import('modules/master/components/VendorMaster/index')),
    exact: true,
  },
  {
    path: '/master/typeCategoryMaster',
    Component: lazy(() => import('modules/master/components/TypeCategoryMaster/index')),
    exact: true,
  },
  {
    path: '/master/tasktype',
    Component: lazy(() => import('modules/master/components/TaskType/index')),
    exact: true,
  },
  {
    path: '/master/taskTemplatetype',
    Component: lazy(() => import('modules/master/components/TaskTemplateType/index')),
    exact: true,
  },
  {
    path: '/master/projectInitiationMaster',
    Component: lazy(() => import('modules/master/components/ProjectInitiationMaster/index')),
    exact: true,
  },
  // commonIndentcomponents/common/MaterialReturn
  {
    path: '/CommonIndentManagement',
    Component: lazy(() => import('components/common/CommonIndentManagement')),
    exact: true,
  },

  {
    path: '/design/designDashboard',
    Component: lazy(() => import('modules/design/components/Dashboard/index')),
    exact: true,
  },

  // Design
  {
    path: '/scm',
    Component: lazy(() => import('modules/scm/pages/index')),
    exact: true,
  },
  {
    path: '/scm/indent',
    Component: lazy(() => import('modules/scm/components/ScmIndentManagement/index')),
    exact: true,
  },
  {
    path: '/scm/scs',
    Component: lazy(() => import('modules/scm/components/IndentGroup/index')),
    exact: true,
  },
  {
    path: '/scm/poimport',
    Component: lazy(() => import('modules/scm/components/Poimport/index')),
    exact: true,
  },
  {
    path: '/scm/polocal',
    Component: lazy(() => import('modules/scm/components/Polocal/index')),
    exact: true,
  },
  {
    path: '/scm/purchaseorder',
    Component: lazy(() => import('modules/scm/components/Podetail/index')),
    exact: true,
  },
  {
    path: '/scm/materialInward',
    Component: lazy(() => import('modules/scm/components/MaterialInward')),
    exact: true,
  },
  {
    path: '/scm/GRN',
    Component: lazy(() => import('modules/scm/components/GRN/Grnindex')),
    exact: true,
  },
  {
    path: '/scm/deliverychallan',
    Component: lazy(() => import('modules/scm/components/DeliveryChallan/index')),
    exact: true,
  },
  {
    path: '/scm/inventorymaterialtransfer',
    Component: lazy(() => import('modules/scm/components/InventoryMaterialTransfer/index')),
    exact: true,
  },
  {
    path: '/scm/inventoryjournal',
    Component: lazy(() => import('modules/scm/components/Inventoryjournal/index')),
    exact: true,
  },
  {
    path: '/scm/inventoryadjustment',
    Component: lazy(() => import('modules/scm/components/Inventoryadjustment/index')),
    exact: true,
  },
  {
    path: '/master/inventorymaster',
    Component: lazy(() => import('modules/master/components/InventoryMaster/index')),
    exact: true,
  },
  {
    path: '/master/taskTypemaster',
    Component: lazy(() => import('modules/master/components/TaskTypeMaster/index')),
    exact: true,
  },
  {
    path: '/master/fileUploadmaster',
    Component: lazy(() => import('modules/master/components/FileUploadMaster/index')),
    exact: true,
  },
  {
    path: '/master/taskCategory',
    Component: lazy(() => import('modules/master/components/TaskCategory/index')),
    exact: true,
  },
  {
    path: '/master/taskTemplate',
    Component: lazy(() => import('modules/master/components/TaskTemplate/index')),
    exact: true,
  },
  {
    path: '/scm/materialissue',
    Component: lazy(() => import('modules/scm/components/MaterialIssue/index')),
    exact: true,
  },
  {
    path: '/scm/billingdispatch',
    Component: lazy(() => import('modules/scm/components/Billingdispatch/index')),
    exact: true,
  },
  {
    path: '/scmdetails',
    Component: lazy(() => import('modules/scm/components/ScmProcessComponent/index')),
    exact: true,
  },
  {
    path: '/project',
    Component: lazy(() => import('modules/project/pages/index')),
    exact: true,
  },
  {
    path: '/projectdetails',
    Component: lazy(() => import('modules/project/components/ProjectProcessComponent/index')),
    exact: true,
  },
  {
    path: '/assembly',
    Component: lazy(() => import('modules/assembly/pages/index')),
    exact: true,
  },
  {
    path: '/assembly/assemblyDashboard',
    Component: lazy(() => import('modules/assembly/components/Dashboard/index')),
    exact: true,
  },
  {
    path: '/assemblydetails',
    Component: lazy(() => import('modules/assembly/components/assyProcessComponent/index')),
    exact: true,
  },
  {
    path: '/quality',
    Component: lazy(() => import('modules/Quality/pages/index')),
    exact: true,
  },
  {
    path: '/qualitydetails',
    Component: lazy(() => import('modules/Quality/components/qtyProcessComponent/index')),
    exact: true,
  },
  {
    path: '/landingpage',
    Component: lazy(() => import('components/getMenuComp')),
    exact: true,
  },
  {
    path: '/RequestManagement',
    Component: lazy(() => import('components/common/RequestManagement')),
    exact: true,
  },
  {
    path: '/MaterialReturn',
    Component: lazy(() => import('components/common/MaterialReturn')),
    exact: true,
  },
  {
    path: '/MaterialRequest',
    Component: lazy(() => import('components/common/MaterialRequest')),
    exact: true,
  },
  {
    path: '/qualityRating',
    Component: lazy(() => import('modules/Quality/components/VendorBasedQualityRating')),
    exact: true,
  },
  {
    path: '/qualityDashboard',
    Component: lazy(() => import('modules/Quality/components/Dashboard/index')),
    exact: true,
  },
  {
    path: '/scm/scmDashboard',
    Component: lazy(() => import('modules/scm/components/Dashboard/index')),
    exact: true,
  },
  {
    path: '/projectDashboard',
    Component: lazy(() => import('modules/project/components/Dashboard/index')),
    exact: true,
  },
  {
    path: '/finance',
    Component: lazy(() => import('modules/finance/pages/index')),
    exact: true,
  },
  {
    path: '/financedetails',
    Component: lazy(() => import('modules/finance/components/financeprocessComponent')),
    exact: true,
  },
  {
    path: '/notificationdetails/:params*',
    Component: lazy(() => import('./components/common/NotificationCalendar')),
    exact: true,
  },
  {
    path: '/timesheet',
    Component: lazy(() => import('modules/Timesheet/pages/index')),
    exact: true,
  },
  {
    path: '/timesheetReports',
    Component: lazy(() => import('modules/Timesheet/components/TimesheetReport/SearchCard/index')),
    exact: true,
  },
  {
    path: '/timesheet/category',
    Component: lazy(() => import('modules/Timesheet/components/TimeSheetCategory/index')),
    exact: true,
  },
  {
    path: '/timesheet/task',
    Component: lazy(() => import('modules/Timesheet/components/TimeSheetTask/index')),
    exact: true,
  },
  {
    path: '/finance/PRA',
    Component: lazy(() => import('modules/finance/components/PRASearchCard/index')),
    exact: true,
  },
  // admin
  {
    path: '/admin/userdetails',
    Component: lazy(() => import('modules/Admin/components/UserDetails/index')),
    exact: true,
  },
  {
    path: '/admin/rolescreenmap',
    Component: lazy(() => import('modules/Admin/components/RoleScreenMap/index')),
    exact: true,
  },
  {
    path: '/admin/documentlifecycle',
    Component: lazy(() => import('modules/Admin/components/DocumentLifecycle/index')),
    exact: true,
  },
  // Auth Pages
  {
    path: '/auth/login',
    Component: lazy(() => import('pages/auth/login')),
    exact: true,
  },
  {
    path: '/auth/forgot-password',
    Component: lazy(() => import('pages/auth/forgot-password')),
    exact: true,
  },
  {
    path: '/auth/register',
    Component: lazy(() => import('pages/auth/register')),
    exact: true,
  },
  {
    path: '/auth/lockscreen',
    Component: lazy(() => import('pages/auth/lockscreen')),
    exact: true,
  },
  {
    path: '/auth/404',
    Component: lazy(() => import('pages/auth/404')),
    exact: true,
  },
  {
    path: '/auth/500',
    Component: lazy(() => import('pages/auth/500')),
    exact: true,
  },
  {
    path: '/alreadyLoggedIn',
    Component: lazy(() => import('pages/auth/alreadyLoggedIn')),
    exact: true,
  },
  {
    path: '/master/salaryMaster',
    Component: lazy(() => import('modules/master/components/SalaryMaster/index')),
    exact: true,
  },
]

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings.routerAnimation,
})

const Router = ({ history, routerAnimation }) => {
  const [isDuplicateTab, setIsDuplicateTab] = useState(null) // null = not determined yet

  useEffect(() => {
    const tabId = `${Date.now()}_${Math.random()}`
    sessionStorage.setItem('tabId', tabId)

    const bc = new BroadcastChannel('app_channel')
    let hasReceivedReply = false
    const activeTabs = new Set()

    const setDuplicateFlag = value => {
      localStorage.setItem('isDuplicateTab', value ? 'true' : 'false')
      setIsDuplicateTab(value)
    }

    bc.postMessage({ type: 'HELLO', senderTabId: tabId })

    const handleMessage = event => {
      const { type, senderTabId } = event.data
      if (senderTabId === tabId) return // Ignore own messages

      if (type === 'HELLO') {
        // Someone new joined — respond with ACTIVE_TAB
        bc.postMessage({ type: 'ACTIVE_TAB', senderTabId: tabId })
      }

      if (type === 'ACTIVE_TAB') {
        hasReceivedReply = true
        // Only set as duplicate if this tab is newer than responder
        if (senderTabId < tabId) {
          setDuplicateFlag(true)
        }
      }

      if (type === 'CLOSE_TAB') {
        activeTabs.delete(senderTabId)
      }
    }

    bc.addEventListener('message', handleMessage)

    const timeoutId = setTimeout(() => {
      if (!hasReceivedReply) {
        setDuplicateFlag(false) // no other tab responded — original tab
      }
    }, 500)

    const handleBeforeUnload = () => {
      bc.postMessage({ type: 'CLOSE_TAB', senderTabId: tabId })
      bc.close()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      clearTimeout(timeoutId)
      bc.close()
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <ConnectedRouter history={history}>
      {isDuplicateTab ? (
        // Don't render Layout, directly render AlreadyLoggedIn route
        <SwitchTransition>
          <CSSTransition
            key="alreadyLoggedIn"
            appear
            classNames={routerAnimation}
            timeout={routerAnimation === 'none' ? 0 : 300}
          >
            <Switch>
              <Route
                path="/alreadyLoggedIn"
                render={() => (
                  <div className={routerAnimation}>
                    <Suspense fallback={null}>
                      <AlreadyLoggedIn />
                    </Suspense>
                  </div>
                )}
              />
              {/* Fallback for any path, if user tries anything else */}
              <Redirect to="/alreadyLoggedIn" />
            </Switch>
          </CSSTransition>
        </SwitchTransition>
      ) : (
        <Layout>
          <Route
            render={state => {
              const { location } = state
              const MenulistData = store.get('MenuListData')

              let Authroutes
              if (MenulistData && MenulistData.length > 0) {
                const Authroute = MenulistData[0]?.authUrl.map(item => item.linkurl)
                Authroutes = [
                  ...Authroute,
                  '/auth/login',
                  '/auth/404',
                  '/alreadyLoggedIn',
                  '/landingpage',
                  '/notificationdetails/:params*',
                  '/CommonIndentManagement',
                  '/sales/dashboard',
                  '/finance/dashboard',
                  '/commonPJS',
                  '/timesheet',
                  '/master/taskTypemaster',
                  '/design/designDashboard',
                  '/assembly/assemblyDashboard',
                  '/finance/PRA',
                  '/master/projectInitiationMaster',
                ]
                if (Authroute.includes('/sales')) Authroutes.push('/salesdetails')
                if (Authroute.includes('/design')) Authroutes.push('/designdetails')
                if (Authroute.includes('/scm')) Authroutes.push('/scmdetails')
                if (Authroute.includes('/project')) Authroutes.push('/projectdetails')
                if (Authroute.includes('/quality')) Authroutes.push('/qualitydetails')
                if (Authroute.includes('/finance')) Authroutes.push('/financedetails')
                if (Authroute.includes('/assembly')) Authroutes.push('/assemblydetails')
                if (Authroute.includes('/quality')) Authroutes.push('/qualityDashboard')
                if (Authroute.includes('/scm')) Authroutes.push('/scm/scmDashboard')
                if (Authroute.includes('/project')) Authroutes.push('/projectDashboard')
              } else {
                Authroutes = [
                  '/auth/login',
                  '/auth/404',
                  '/alreadyLoggedIn',
                  '/landingpage',
                  '/notificationdetails/:params*',
                  '/sales/dashboard',
                  '/finance/dashboard',
                  '/commonPJS',
                  '/timesheet',
                  '/master/taskTypemaster',
                  '/scm/scmDashboard',
                  '/finance/PRA',
                  '/master/projectInitiationMaster',
                ]
              }

              return (
                <SwitchTransition>
                  <CSSTransition
                    key={location.pathname}
                    appear
                    classNames={routerAnimation}
                    timeout={routerAnimation === 'none' ? 0 : 300}
                  >
                    <Switch location={location}>
                      <Route exact path="/" render={() => <Redirect to="/landingpage" />} />
                      {routes.map(({ path, Component, exact }) => {
                        const isAuthRoute = Authroutes.includes(path)
                        return (
                          <Route
                            path={path}
                            key={path}
                            exact={exact}
                            render={() => {
                              if (isAuthRoute) {
                                return (
                                  <div className={routerAnimation}>
                                    <Suspense fallback={null}>
                                      <Component />
                                    </Suspense>
                                  </div>
                                )
                              }
                              return <Redirect to="/auth/404" />
                            }}
                          />
                        )
                      })}
                      <Redirect to="/auth/404" />
                    </Switch>
                  </CSSTransition>
                </SwitchTransition>
              )
            }}
          />
        </Layout>
      )}
    </ConnectedRouter>
  )
}

export default connect(mapStateToProps)(Router)
