import React, { useEffect, useRef, useState } from 'react';
import { Breadcrumb, Switch, Table, message } from 'antd';
import type { TableProps } from 'antd';
import TableAction from '../../../components/table/TableAction';
import ControlAdminUser from './components/ControlListUser';
import { userAPI } from '../../../services/user';
import { displayDate } from '../../../utils/datetime';
import { ModalControlType } from '../../../types/modal';
import { TABLE_ITEM_PER_PAGE } from '../../../constants/table';

export interface UserData {
  _id: string;
  index: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: boolean;
  createdAt: string;
}

const AdminUser: React.FC = () => {
  const [userList, setUserList] = useState<UserData[]>([]);
  const [openControlModal, setOpenControlModal] = useState<boolean>(false);
  const [modalInitData, setModalInitData] = useState<UserData>();
  const controlModalType = useRef<ModalControlType>('');

  const columns: TableProps<UserData>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (_, record, index) => <div>{index + 1}</div>,
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (_, record: any) => <div>{displayDate(record?.createdAt)}</div>,
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
          updateText='Xem'
        />
      ),
    },
  ];

  const getUserList = async () => {
    try {
      const res = await userAPI.getUserList();

      if (res?.data?.success) {
        setUserList(res?.data?.payload?.user);
      } else {
        message.error('Lấy thông tin khách hàng thất bại');
      }
    } catch (error) {
      message.error('Lấy thông tin khách hàng thất bại');
      console.log('get user list error >>> ', error);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  const handleCancelControlModal = () => {
    setOpenControlModal(false);
  };

  const handleChangeStatus = async (userId: string, checked: boolean) => {
    try {
      const res = await userAPI.updateUserStatus(userId, checked);
      if (res?.data?.success) {
        message.success('Cập nhật trạng thái thành công');
        getUserList();
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

  const handleDelete = async (userId: string) => {
    try {
      const res = await userAPI.deleteUser(userId);
      if (res?.data?.success) {
        message.success('Xoá khách hàng thành công');
        getUserList();
      } else {
        message.error(res?.data?.error?.message || 'Xoá thông tin thất bại');
      }
    } catch (error) {
      message.error('Xoá khách hàng thất bại');
      console.log('handleDelete error >> ', error);
    }
  };

  return (
    <div>
      <div className='mb-[10px]'>
        <Breadcrumb
          items={[
            {
              title: 'Quản trị',
            },
            {
              title: 'Khách hàng',
            },
          ]}
        />
      </div>
      <Table
        columns={columns}
        dataSource={userList}
        rowKey='_id'
        key='_id'
        pagination={{ pageSize: TABLE_ITEM_PER_PAGE }}
      />

      {openControlModal ? (
        <ControlAdminUser
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
            getUserList();
          }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default AdminUser;
