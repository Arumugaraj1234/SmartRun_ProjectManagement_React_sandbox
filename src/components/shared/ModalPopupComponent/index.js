import React from 'react'
import { Modal } from 'antd'

const ModalPopup = ({
  onCancel,
  isModalVisible,
  FieldsComponent,
  ButtonsComponent,
  text,
  width,
  maskClosable,
}) => {
  const modalWidth = width || 800
  // const modalHeight = height || 2000;
  return (
    <Modal
      title={text}
      visible={isModalVisible}
      width={modalWidth}
      onCancel={onCancel}
      footer={null}
      bodyStyle={{ overflowX: 'auto' }}
      maskClosable={maskClosable}
    >
      {FieldsComponent ? <FieldsComponent /> : null}
      {ButtonsComponent ? <ButtonsComponent /> : null}
    </Modal>
  )
}

export default ModalPopup
