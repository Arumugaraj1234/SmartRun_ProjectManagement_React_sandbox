import React, { useEffect, Suspense, useState } from 'react'

const MainCard = ({ content, SlaveID, DocTypeCode }) => {
  const [LazyComponent, setLazyComponent] = useState(null)
  const lazyProps = {
    slaveid: SlaveID,
    doctype: DocTypeCode,
  }

  useEffect(() => {
    const importComponent = async () => {
      if (content) {
        const lazyComponent = React.lazy(() => import(`../${content}`))
        setLazyComponent(lazyComponent)
      }
    }
    importComponent()
  }, [content])

  return (
    <div className="card">
      <div className="card-body">
        <div className="main-card">
          <Suspense fallback={<div>Loading...</div>}>
            {/* Dynamically render the lazy-loaded component */}
            {LazyComponent && <LazyComponent {...lazyProps} />}
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default MainCard
