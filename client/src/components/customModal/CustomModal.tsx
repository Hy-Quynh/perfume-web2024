import React, { useState } from 'react';
import { Modal } from 'antd';

type CustomModalProps = {
  title?: string;
  okText?: string;
  cancelText?: string;
  isOpen: boolean;
  width?: string
  handleSubmit?: () => Promise<any>;
  handCanel: () => void;
  children?: React.ReactNode;
  hiddenOkBtn?: boolean
  className?: string
};

const CustomModal: React.FC<CustomModalProps> = (props) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmit(true);
    await props?.handleSubmit?.();
    setIsSubmit(false);
  };

  return (
    <Modal
      title={props.title}
      open={props?.isOpen}
      onOk={() => handleSubmit()}
      onCancel={() => props.handCanel()}
      okText={props.okText || 'Lưu'}
      cancelText={props?.cancelText || 'Huỷ'}
      okButtonProps={{ className: '!bg-primary', loading: isSubmit, hidden: props?.hiddenOkBtn || false }}
      maskClosable={false}
      width={props?.width}
      className={props?.className || ''}
    >
      {props?.children}
    </Modal>
  );
};

export default CustomModal;
