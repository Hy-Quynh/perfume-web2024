import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Button, Switch, Table, message } from 'antd';
import type { TableProps } from 'antd';
import TableAction from '../../../components/table/TableAction';
import { displayDate } from '../../../utils/datetime';
import { categoryAPI } from '../../../services/category';
import ControlCategoryModal from './components/ControlCategoryModal';
import { ModalControlType } from '../../../types/modal';
import { TABLE_ITEM_PER_PAGE } from '../../../constants/table';

export interface CategoryType {
  _id: string;
  index: number;
  name: string;
  image: string;
  status: boolean;
  createdAt: string;
}

const AdminCategory: React.FC = () => {
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [openControlModal, setOpenControlModal] = useState<boolean>(false);
  const [modalInitData, setModalInitData] = useState<CategoryType>();
  const controlModalType = useRef<ModalControlType>('');

  const columns: TableProps<CategoryType>['columns'] = [
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

  const getCategoryList = async () => {
    try {
      const res = await categoryAPI.getAllCategory();

      if (res?.data?.success) {
        setCategoryList(res?.data?.payload?.category);
      } else {
        message.error('Lấy thông tin danh mục thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin danh mục thất bại');
      console.log('get category list error >>> ', error);
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  const handleCancelControlModal = () => {
    setOpenControlModal(false);
  };

  const handleOpenControlModal = (type: ModalControlType) => {
    setModalInitData(undefined);
    controlModalType.current = type;
    setOpenControlModal(true);
  };

  const handleChangeStatus = async (categoryId: string, checked: boolean) => {
    try {
      const res = await categoryAPI.updateCategoryStatus(categoryId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật trạng thái thành công');
        getCategoryList();
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

  const handleDelete = async (categoryId: string) => {
    try {
      const res = await categoryAPI.deleteCategory(categoryId);
      if (res?.data?.success) {
        message.success('Xoá danh mục thành công');
        getCategoryList();
      } else {
        message.error(res?.data?.error?.message || 'Xoá thông tin thất bại');
      }
    } catch (error) {
      message.error('Xoá danh mục thất bại');
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
              title: 'Danh mục',
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
        dataSource={categoryList}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />

      {openControlModal ? (
        <ControlCategoryModal
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
            getCategoryList();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminCategory;
