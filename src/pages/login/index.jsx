import { Form, Input, Button , Alert  } from 'antd';
import React, { useState } from 'react';
import { UserOutlined, LockTwoTone } from '@ant-design/icons';
import { login } from '@/services/login'
import ResponseHandler from '@/utils/ResponseHandler';
import RSAUtils from '@/utils/RSAUtils'


const Login = props => {

  const [ loading , setLoading ] = useState( false );
  const [ errorMsg , setErrorMsg ] = useState( undefined );


  const onFinish = async ( values ) => {
    if ( errorMsg ){
      return;
    }
    await setLoading( true );

    for ( let key in values ){
      values[ key ] = RSAUtils.encrypt( values[key] );
    }
    console.log( values );

    const response = await login( values );
    ResponseHandler.handle( response , ()=>{
    } , ()=>{
      setLoading( false );
      setErrorMsg( response.message );
    });
  }

  return (
    <div style={{ width: '20%', margin: 'auto', marginTop: '6%' }}>

      <Form onFinish={onFinish} onChange={ ()=> setErrorMsg(undefined) }>

        <Form.Item name='username' hasFeedback rules={ [{ required:true , message: '请输入用户名' }] } >
          <Input size="large" prefix={<UserOutlined />} placeholder='用户名:'
            style={{
              color: '#1890ff',
            }} />
        </Form.Item>
        <Form.Item name='password' hasFeedback rules={ [{ required:true , message: '请输入密码' }] }>
          <Input.Password size="large" prefix={<LockTwoTone />} placeholder='密码:' />
        </Form.Item>

        { errorMsg && <Alert message={errorMsg} type="error" showIcon /> }

        <Button type="primary" block size="large" htmlType="submit" loading={loading} style={{ marginTop:'30px' }}>
          登录
        </Button>

      </Form>

    </div>
  );
};
export default Login;
