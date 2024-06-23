import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Button, Switch, Table, message } from 'antd';
import type { TableProps } from 'antd';
import TableAction from '../../../components/table/TableAction';
import { displayDate } from '../../../utils/datetime';
import { brandAPI } from '../../../services/brand';
import ControlBrandModal from './components/ControlBrandModal';
import { ModalControlType } from '../../../types/modal';
import { TABLE_ITEM_PER_PAGE } from '../../../constants/table';

export interface BrandType {
  _id: string;
  index: number;
  name: string;
  image: string;
  status: boolean;
  createdAt: string;
}

const AdminBrand: React.FC = () => {
  const [brandList, setBrandList] = useState<BrandType[]>([]);
  const [openControlModal, setOpenControlModal] = useState<boolean>(false);
  const [modalInitData, setModalInitData] = useState<BrandType>();
  const controlModalType = useRef<ModalControlType>('');

  const columns: TableProps<BrandType>['columns'] = [
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

  const getBrandList = async () => {
    try {
      const res = await brandAPI.getAllBrand();

      if (res?.data?.success) {
        setBrandList(res?.data?.payload?.brand);
      } else {
        message.error('Lấy thông tin thương hiệu thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin thương hiệu thất bại');
      console.log('get brand list error >>> ', error);
    }
  };

  useEffect(() => {
    getBrandList();
  }, []);

  const handleCancelControlModal = () => {
    setOpenControlModal(false);
  };

  const handleOpenControlModal = (type: ModalControlType) => {
    setModalInitData(undefined);
    controlModalType.current = type;
    setOpenControlModal(true);
  };

  const handleChangeStatus = async (brandId: string, checked: boolean) => {
    try {
      const res = await brandAPI.updateBrandStatus(brandId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật trạng thái thành công');
        getBrandList();
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

  const handleDelete = async (brandId: string) => {
    try {
      const res = await brandAPI.deleteBrand(brandId);
      if (res?.data?.success) {
        message.success('Xoá thương hiệu thành công');
        getBrandList();
      } else {
        message.error(res?.data?.error?.message || 'Xoá thông tin thất bại');
      }
    } catch (error) {
      message.error('Xoá thương hiệu thất bại');
      console.log('handleDelete error >> ', error);
    }
  };

  return (
    <div>
      <div className='mb-[10px]'>
        <Breadcrumb
          items={[
            {
              title: 'Quản lí',
            },
            {
              title: 'Thương hiệu',
            },
          ]}
        />
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
        dataSource={brandList}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />

      {openControlModal ? (
        <ControlBrandModal
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
            getBrandList();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminBrand;
