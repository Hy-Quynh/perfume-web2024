import { Button, Form, Grid, Input, message, theme, Typography } from 'antd';
import { MailOutlined, SettingOutlined } from '@ant-design/icons';
import './style.scss';
import { ROUTER } from '../../enums/router';
import WebLogo from '../../assets/images/logo.png';
import { useEffect, useState } from 'react';
import { LockOutlined } from '@ant-design/icons';
import { userAPI } from '../../services/user';
import { Spin } from 'antd';
import { formatCountDownTime } from '../../utils/datetime';
import { useNavigate } from 'react-router-dom';

const { useToken } = theme;
const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;
const TIME_SEND_OTP = 2 * 60;

type ForgotPasswordType = {
  isAdmin?: boolean;
};

export default function ForgotPasswordPage({ isAdmin }: ForgotPasswordType) {
  const [sentOtp, setSentOtp] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countDownTime, setCountDownTime] = useState(TIME_SEND_OTP);
  const { token } = useToken();
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      setIsLoading(true);
      if (!sentOtp) {
        await sendOtp(values?.email);
      } else {
        const res = await userAPI.verifyOtpForgotPw({
          email: values?.email,
          password: values?.password,
          otp: values?.otp,
        });

        if (res?.data?.success) {
          message.success(
            'Bạn đã đổi mật khẩu thành công, chuyển tiếp trang đăng nhập'
          );
          navigate('/login');
        } else {
          throw new Error(res?.data?.error?.message || 'Xác thực thất bại');
        }
      }
    } catch (error: any) {
      message.error(error?.message || 'Xử lí thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const sendOtp = async (email: string) => {
    try {
      const res = await userAPI.sendOtpForgotPw(email);
      if (res?.data?.success) {
        setCountDownTime(TIME_SEND_OTP);
        setSentOtp(true);
      } else {
        throw new Error(res?.data?.error?.message || 'Gửi OTP thất bại');
      }
    } catch (error: any) {
      message.error(error?.message || 'Gửi OTP thất bại');
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCountDownTime((preValue) => {
        if (preValue > 0) {
          if (preValue === 1) {
            return 0;
          }
          return preValue - 1;
        }
        return preValue;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section style={styles.section} className='forgot-password-page'>
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
            QUÊN MẬT KHẨU
          </Title>
          <Text style={styles.text} className='text-center'>
            Nhập vào tài khoản email để nhận OTP từ hệ thống
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
          form={form}
        >
          <Form.Item
            name='email'
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Vui lòng nhập vào email',
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder='Nhập vào email'
              disabled={sentOtp}
            />
          </Form.Item>

          {sentOtp ? (
            <>
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

              <div className='mt-[30px]'>
                <p>Mã OTP</p>
                <Form.Item
                  name='otp'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập đầy đủ otp',
                    },
                  ]}
                >
                  <Input.OTP length={6} />
                </Form.Item>
              </div>

              <div>
                {countDownTime === 0 ? (
                  <div>
                    {!resendLoading ? (
                      <div
                        className='cursor-pointer'
                        onClick={async () => {
                          const email = form.getFieldValue('email');
                          setResendLoading(true);
                          await sendOtp(email);
                          setResendLoading(false);
                        }}
                      >
                        Gửi lại
                      </div>
                    ) : (
                      <Spin className='text-white' />
                    )}
                  </div>
                ) : (
                  <div>{formatCountDownTime(countDownTime)}</div>
                )}
              </div>
            </>
          ) : (
            <></>
          )}

          <Form.Item style={{ marginBottom: '0px' }} className='mt-[30px]'>
            <Button
              block={true}
              type='primary'
              htmlType='submit'
              className='bg-mainColor text-white font-bold hover:!bg-mainColor hover:!text-white'
              disabled={loading}
            >
              {loading ? <Spin className='text-white' /> : 'Gửi OTP'}
            </Button>
            <div style={styles.footer} className='footer'>
              <Text style={styles.text}>Quay lại trang đăng nhập</Text>{' '}
              <Link
                href={isAdmin ? ROUTER.ADMIN_LOGIN : ROUTER.LOGIN}
                className='!text-primary'
              >
                Đăng nhập
              </Link>
            </div>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}
