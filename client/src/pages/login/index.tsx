import { Button, Form, Grid, Input, message, theme, Typography } from 'antd';
import { LockOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import './style.scss';
import { ROUTER } from '../../enums/router';
import { userAPI } from '../../services/user';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/admin';
import { USER_INFO_KEY } from '../../constants';
import WebLogo from '../../assets/images/logo.png';

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

type LoginPageType = {
  isAdmin?: boolean;
};

export default function LoginPage({ isAdmin }: LoginPageType) {
  const { token } = useToken();
  const screens = useBreakpoint();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const signUpData = {
        email: values?.email,
        password: values?.password,
      };

      if (!isAdmin) {
        const res = await userAPI.userLogin(signUpData);

        if (res?.data?.success) {
          localStorage.setItem(
            USER_INFO_KEY,
            JSON.stringify(res?.data?.payload)
          );
          message.success('Đăng nhập thành công. Chuyển sang trang chủ');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          message.error(res?.data?.error?.message || 'Đăng nhập thất bại');
        }
      } else {
        const res = await adminAPI.adminLogin(signUpData);
        if (res?.data?.success) {
          localStorage.setItem(
            USER_INFO_KEY,
            JSON.stringify(res?.data?.payload)
          );
          message.success('Đăng nhập thành công. Chuyển sang trang quản trị');
          setTimeout(() => {
            navigate('/admin');
          }, 1000);
        } else {
          message.error(res?.data?.error?.message || 'Đăng nhập thất bại');
        }
      }
    } catch (error) {
      message.error('Đăng nhập thất bại');
    }
  };

  const styles = {
    container: {
      margin: '0 auto',
      padding: screens.md
        ? `${token.paddingXL}px`
        : `${token.sizeXXL}px ${token.padding}px`,
      width: '380px',
      background: isAdmin ? 'rgb(20, 20, 20)' : 'rgb(255, 255, 255)',
      borderRadius: '8px',
      boxShadow:
        'rgba(0, 0, 0, 0.03) 0px 1px 2px 0px, rgba(0, 0, 0, 0.02) 0px 1px 6px -1px, rgba(0, 0, 0, 0.02) 0px 2px 4px 0px',
    },
    footer: {
      marginTop: token.marginLG,
    },
    header: {
      marginBottom: token.marginXL,
    },
    section: {
      alignItems: 'center',
      background: isAdmin ? 'rgb(0, 0, 0)' : '#F3F5F5',
      display: 'flex',
      height: screens.sm ? '100vh' : 'auto',
      padding: screens.md ? `${token.sizeXXL}px 0px` : '0px',
    },
    text: {
      color: isAdmin ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
    },
    title: {
      fontSize: screens.md ? token.fontSizeHeading2 : token.fontSizeHeading3,
      color: isAdmin ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
    },
    adminSettingIcon: {
      fontSize: '32px',
      color: 'rgba(255, 255, 255, 0.85)',
    },
  };

  return (
    <section style={styles.section} className='login-page'>
      <div style={styles.container}>
        <div style={styles.header}>
          {isAdmin ? (
            <div className='flex justify-center mb-[10px]'>
              <SettingOutlined style={styles.adminSettingIcon} />
            </div>
          ) : (
            <div className='logo mb-[20px] flex justify-center items-center gap-[10px]'>
              <img src={WebLogo} className='w-[30px] h-[30px]' alt='logo'></img>
              <p className='font-bold text-mainColor'>PERFUMES</p>
            </div>
          )}

          <Title style={styles.title} className='text-center'>
            {isAdmin ? 'QUẢN TRỊ VIÊN' : 'ĐĂNG NHẬP'}
          </Title>
          <Text style={styles.text} className='text-center'>
            {isAdmin
              ? 'Dùng tài khoản quản trị viên để đăng nhập quản trị hệ thống'
              : 'Vui lòng đăng nhập để sử dụng đầy đủ dịch vụ của chúng tôi'}
          </Text>
        </div>
        <Form
          name='normal_login'
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout='vertical'
          requiredMark='optional'
        >
          <Form.Item
            name='email'
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Email sai định dạng',
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder='Nhập vào email' />
          </Form.Item>
          <div className='mt-[30px]'>
            <Form.Item
              name='password'
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type='password'
                placeholder='Nhập vào mật khẩu'
              />
            </Form.Item>
          </div>
          {!isAdmin ? (
            <div className='forgot-password'>
              <a
                href={
                  isAdmin
                    ? ROUTER.ADMIN_FORGOT_PASSWORD
                    : ROUTER.FORGOT_PASSWORD
                }
                className={
                  isAdmin ? 'text-white hover:text-white' : '!text-primary'
                }
              >
                Quên mật khẩu?
              </a>
            </div>
          ) : (
            <></>
          )}
          <Form.Item style={{ marginBottom: '0px' }}>
            <Button
              block={true}
              type='primary'
              htmlType='submit'
              className='bg-mainColor text-white font-bold hover:!bg-mainColor hover:!text-white'
            >
              Đăng nhập
            </Button>
            {!isAdmin ? (
              <div style={styles.footer} className='footer'>
                <Text style={styles.text}>Bạn chưa có tài khoản?</Text>{' '}
                <Link href={ROUTER.REGISTER}>Đăng ký ngay</Link>
              </div>
            ) : (
              <></>
            )}
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
