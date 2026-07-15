import React from 'react'
import ReactDOM from 'react-dom'
import JSPDF from 'jspdf'
import html2canvas from 'html2canvas'
import Button from 'components/shared/ButtonComponent'

const ExportPDF = ({ FirstComponent, SecondComponent }) => {
  const handleExportToPDF = () => {
    const container = document.createElement('div')
    const firstContainer = document.createElement('div')
    const secondContainer = document.createElement('div')

    ReactDOM.render(<FirstComponent />, firstContainer)
    ReactDOM.render(<SecondComponent />, secondContainer)

    container.appendChild(firstContainer)
    container.appendChild(secondContainer)

    document.body.appendChild(container)

    html2canvas(container)
      .then(canvas => {
        const pdf = new JSPDF()
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        const aspectRatio = canvas.width / canvas.height
        let pdfCanvasWidth = pdfWidth
        let pdfCanvasHeight = pdfWidth / aspectRatio

        if (pdfCanvasHeight > pdfHeight) {
          pdfCanvasHeight = pdfHeight
          pdfCanvasWidth = pdfHeight * aspectRatio
        }

        pdf.addImage(
          canvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          0,
          0,
          pdfCanvasWidth,
          pdfCanvasHeight,
        )
        pdf.save('exported.pdf')

        document.body.removeChild(container)
      })
      .catch(error => {
        console.error('Error capturing canvas:', error)
        document.body.removeChild(container)
      })
  }

  return (
    <div>
      <Button onClick={handleExportToPDF} text="Export to PDF" type="primary" />
    </div>
  )
}

export default ExportPDF
