import React from 'react'
import PRASearchCardComp from 'modules/finance/components/PRASearchCard'

// PM login PRA tab: same screen as SCM (ScmPRA) and Finance, so all three logins share one PRA
// screen and its fixes. The approve/cancel buttons come from the PRA Document Lifecycle per
// designation.
const PRASearchCard = () => {
  return (
    <div>
      <PRASearchCardComp />
    </div>
  )
}

export default PRASearchCard
