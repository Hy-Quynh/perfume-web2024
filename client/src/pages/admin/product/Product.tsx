import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Button, Input, Switch, Table, message } from 'antd';
import type { TableProps } from 'antd';
import TableAction from '../../../components/table/TableAction';
import { displayDate } from '../../../utils/datetime';
import { productAPI } from '../../../services/product';
import { ModalControlType } from '../../../types/modal';
import { TABLE_ITEM_PER_PAGE } from '../../../constants/table';
import ControlProductModal from './components/ControlProductModal';
import './style.scss';

export interface ProductType {
  _id: string;
  index: number;
  name: string;
  image: string;
  brandId: string;
  categoryId: string;
  description: string;
  price: number;
  salePrice: number;
  initQuantity: number;
  currentQuantity: number;
  status: boolean;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  brandName: string;
  categoryName: string;
}

const AdminProduct: React.FC = () => {
  const [productList, setProductList] = useState<ProductType[]>([]);
  const [openControlModal, setOpenControlModal] = useState<boolean>(false);
  const [modalInitData, setModalInitData] = useState<ProductType>();
  const [productName, setProductName] = useState('');
  const controlModalType = useRef<ModalControlType>('');

  const columns: TableProps<ProductType>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brandName',
      key: 'brandName',
    },
    {
      title: 'Số lượng nhập',
      dataIndex: 'initQuantity',
      key: 'initQuantity',
    },
    {
      title: 'Số lượng hiện tại',
      dataIndex: 'currentQuantity',
      key: 'currentQuantity',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: any) => <div>{displayDate(record)}</div>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => (
        <Switch
          checked={record?.status}
          onChange={(checked) => handleChangeStatus(record?._id, checked)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <TableAction
          key={record?._id}
          handleUpdate={() => {
            controlModalType.current = 'UPDATE';
            setModalInitData(record);
            setOpenControlModal(true);
          }}
          handleDelete={() => handleDelete(record?._id)}
        />
      ),
    },
  ];

  const getProductList = async (name: string) => {
    try {
      const res = await productAPI.getAllProduct(undefined, undefined, name);

      if (res?.data?.success) {
        setProductList(res?.data?.payload?.product);
      } else {
        message.error('Lấy thông tin sản phẩm thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin sản phẩm thất bại');
      console.log('get product list error >>> ', error);
    }
  };

  useEffect(() => {
    getProductList('');
  }, []);

  const handleCancelControlModal = () => {
    setOpenControlModal(false);
  };

  const handleOpenControlModal = (type: ModalControlType) => {
    setModalInitData(undefined);
    controlModalType.current = type;
    setOpenControlModal(true);
  };

  const handleChangeStatus = async (productId: string, checked: boolean) => {
    try {
      const res = await productAPI.updateProductStatus(productId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật trạng thái thành công');
        getProductList(productName);
      } else {
        message.error(
          res?.data?.error?.message || 'Cập nhật thông tin thất bại'
        );
      }
    } catch (error) {
      message.error('Cập nhật trạng thái thất bại');
      console.log('handleChangeStatus error >> ', error);
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      const res = await productAPI.deleteProduct(productId);
      if (res?.data?.success) {
        message.success('Xoá sản phẩm thành công');
        getProductList(productName);
      } else {
        message.error(res?.data?.error?.message || 'Xoá thông tin thất bại');
      }
    } catch (error) {
      message.error('Xoá sản phẩm thất bại');
      console.log('handleDelete error >> ', error);
    }
  };

  return (
    <div className='admin-product'>
      <div className='mb-[10px]'>
        <Breadcrumb
          items={[
            {
              title: 'Quản lí',
            },
            {
              title: 'Sản phẩm',
            },
          ]}
        />
      </div>
      <div className='flex w-[50%]'>
        <Input
          type='text'
          placeholder='Nhập vào tên sản phẩm'
          onChange={(event) => setProductName(event.target.value)}
        />
        <Button
          className='!bg-primary text-white'
          onClick={() => getProductList(productName)}
        >
          Tìm kiếm
        </Button>
      </div>
      <div className='flex justify-end mb-[20px]'>
        <Button
          type='primary'
          className='!bg-primary'
          onClick={() => handleOpenControlModal('CREATE')}
        >
          Thêm mới
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={productList}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />

      {openControlModal ? (
        <ControlProductModal
          title={
            controlModalType.current === 'CREATE'
              ? 'Thêm mới'
              : controlModalType.current === 'UPDATE'
              ? 'Cập nhật'
              : 'Xem chi tiết'
          }
          isOpen={openControlModal}
          handleCancel={() => handleCancelControlModal()}
          type={controlModalType.current}
          initData={modalInitData}
          reloadData={() => {
            setOpenControlModal(false);
            getProductList(productName);
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminProduct;
