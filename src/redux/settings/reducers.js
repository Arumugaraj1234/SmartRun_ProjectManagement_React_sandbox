import store from 'store'
import actions from './actions'

const STORED_SETTINGS = storedSettings => {
  const settings = {}
  Object.keys(storedSettings).forEach(key => {
    const item = store.get(`app.settings.${key}`)
    settings[key] = typeof item !== 'undefined' ? item : storedSettings[key]
  })
  return settings
}

const firstname = store.get('firstname')
const lastname = store.get('lastname')
const logiimg = store.get('logopath')
const bgimg = store.get('bgimg')

const initialState = {
  ...STORED_SETTINGS({
    authProvider: 'jwt', // firebase, jwt
    logo:'',
    logocl: `${firstname} ${lastname}`,
    logoimg:logiimg,
    bg:bgimg,
    locale: 'en-US',  
    isSidebarOpen: true,
    isSupportChatOpen: false,
    isMobileView: true,
    isMobileMenuOpen: false,
    isMenuCollapsed: true,
    menuLayoutType: 'nomenu', // left, top, nomen
    routerAnimation: 'slide-fadein-up', // none, slide-fadein-up, slide-fadein-right, fadein, zoom-fadein
    topMenuColor: 'none', // white, dark, gray
    leftMenuColor: 'dark', // white, dark, gray
    theme: 'default', // default, dark
    authPagesColor: 'white', // white, gray, image
    isMenuShadow: false,
    primaryColor: '#4b7cf3',
    leftMenuWidth: 170,
    isMenuUnfixed: false,
    isTopbarFixed: false,
    isGrayTopbar: false,
    isContentMaxWidth: false,
    isAppMaxWidth: false,
    isGrayBackground: true,
    isCardShadow: true,
    isSquaredBorders: false,
    isBorderless: false,
  }),
}

export default function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.SET_STATE:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
