import serverApi from 'services/serverApi'

const getSubMenuList = async (referenceId, processDoc, tenantId) => {
  try {
    const response = await serverApi.post(
      'getstageprocessDtl',
      {
        referenceId,
        processDoc,
        tenantId,
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

export default getSubMenuList
