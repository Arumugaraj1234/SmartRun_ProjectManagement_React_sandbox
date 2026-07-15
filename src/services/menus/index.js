import serverApi from 'services/serverApi'

const getMenuList = async (loginId, tenantId, userRoleId) => {
  try {
    const response = await serverApi.post(
      'getMenuByUserRole',
      {
        loginId,
        tenantId,
        userRoleId,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    return response
  } catch (error) {
    console.error(error)
    return false
  }
}

export default getMenuList
