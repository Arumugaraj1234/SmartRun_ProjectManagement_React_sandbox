import React from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { message, Upload } from 'antd'
import messageReturn from '_helpers/messageReturn'
import Button from '../ButtonComponent'

const UploadComponent = ({ text, onFileUploadSuccess }) => {
  const props = {
    name: 'file',
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188', // Replace with your actual API endpoint
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      // if (info.file.status !== 'uploading') {
      //   console.log(info.file, info.fileList);
      // }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`)
        // Call the callback function with the uploaded file information
        if (onFileUploadSuccess) {
          onFileUploadSuccess(info.file)
        }
      } else if (info.file.status === 'error') {
        messageReturn(null, `${info.file.name} file upload failed.`, 'error')
      }
    },
  }

  return (
    <Upload {...props}>
      <Button icon={<UploadOutlined />} text={text} />
    </Upload>
  )
}

export default UploadComponent
