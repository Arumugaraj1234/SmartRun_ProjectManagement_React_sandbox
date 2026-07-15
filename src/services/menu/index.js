import store from 'store'

export default async function getMenuData() {
  const menuStore = store.get(`app.menu`)
  return menuStore || []
}
