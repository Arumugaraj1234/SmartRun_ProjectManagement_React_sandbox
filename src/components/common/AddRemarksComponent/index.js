import React, { useState } from 'react'
import { Input, Button } from 'antd' // Import Ant Design components

const { TextArea } = Input

const RemarksInput = ({ onRemarksChange }) => {
  const [remarks, setRemarks] = useState('')

  const handleRemarksChange = e => {
    setRemarks(e.target.value)
    onRemarksChange(e.target.value) // Call the callback function to update the parent component's state
  }

  return <TextArea rows={4} value={remarks} onChange={handleRemarksChange} />
}

const AddRemarksComponent = ({ onSubmit }) => {
    
  const [remarks, setRemarks] = useState('')

  const handleRemarksChange = value => {
    setRemarks(value)
  }

  const handleSubmit = () => {
    onSubmit(remarks)
  }

  return (
    <div>
      <h5>Add Remarks</h5>
      <RemarksInput onRemarksChange={handleRemarksChange} />
      <center style={{ marginTop: '10px' }}>
        <Button type="primary" text="Save" onClick={handleSubmit} />
      </center>
    </div>
  )
}

export default AddRemarksComponent
