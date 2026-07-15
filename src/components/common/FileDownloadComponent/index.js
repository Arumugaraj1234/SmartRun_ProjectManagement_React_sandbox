import React, { useState } from 'react'
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import DownloadDocumentFile from 'services/common/DocumentManagement/DownloadFile'
import messageReturn from '_helpers/messageReturn'
import Button from '../../shared/ButtonComponent'

const DownloadDocuments = ({ refid, tenanrId, fileDocode, docTypeCode, isPdf }) => {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fetchDownloadDOcServicedata = async () => {
    const returnData = await DownloadDocumentFile({
      referenId: refid,
      tenId: tenanrId,
      fileCode: fileDocode,
      docTypeCode,
      isPdf,
    })
    return returnData
  }

  const handlefileDownload = async () => {
    const downloadresponse = await fetchDownloadDOcServicedata()
    if (downloadresponse.fileContent !== null) {
      const link = document.createElement('a')
      link.href = `data:application/octet-stream;base64,${downloadresponse.fileContent}`
      link.download = downloadresponse.fileName
      link.click()
      messageReturn(210)
    } else {
      messageReturn(606)
    }
  }
  const handleFilePreview = async () => {
    const previewResponse = await fetchDownloadDOcServicedata()
    if (previewResponse.fileContent !== null) {
      const byteCharacters = atob(previewResponse.fileContent)
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i))
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'application/pdf' })

      const url = URL.createObjectURL(blob)
      setPdfUrl(`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`)
      setIsModalOpen(true)
    } else {
      messageReturn(606)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      <Button
        type="primary"
        onClick={() => handlefileDownload()}
        icon={<DownloadOutlined />}
        // size="small"
      />
      {isPdf === '1' && (
        <Button type="primary" onClick={handleFilePreview} icon={<EyeOutlined />} />
      )}
      <Modal
        title="PRA Preview"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={1200}
        style={{ top: 20 }}
      >
        {pdfUrl && (
          <div style={{ marginTop: 10 }}>
            <embed
              src={pdfUrl}
              type="application/pdf"
              width="100%"
              height="500px"
              title="PDF Preview"
            />
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DownloadDocuments
