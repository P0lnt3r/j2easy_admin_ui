import { Form, Input, Button, Checkbox, Modal, Divider, Select, message, Row, Col } from 'antd';
import React, { useState } from 'react';
import { update } from '@/services/system/permission'
import ResponseHandler from '@/utils/ResponseHandler'

/** 输入项中 Label 与 Input 之间的间距调整 */
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};
/** 输入表单中 底部按钮的位置调整 */
const tailLayout = {
    wrapperCol: { offset: 12, span: 12, }
};

export default (props) => {

    const { data , selected , callback } = props;
    const [form] = Form.useForm();
    const [loading ,setLoading] = useState( false );

    const initialValues = {
        pName : selected.name ,
        ...data
    }

    const onFinish = async ( values ) => {
        setLoading( true )
        const response = await update( values );
        ResponseHandler.handle( response , () => {
            setLoading( false )
            message.success('更新成功');
            callback();
        } )
    };

    return (

        <Form
            form={form}
            {...layout}
            initialValues={initialValues}
            onFinish={onFinish}
        >

            <Form.Item name='id' label='主键ID' hidden>
                <Input />
            </Form.Item>
            <Form.Item name='pName' label='父模块'>
                <Input disabled />
            </Form.Item>
            <Form.Item name='type' label='权限类型'  >
                <Select disabled>
                    <Option value="1">菜单</Option>
                    <Option value="2">功能</Option>
                </Select>
            </Form.Item>
            <Form.Item name='name' label='权限名称' rules={[{ required: true, message: '请输入字典名称!' }]} >
                <Input />
            </Form.Item>
            <Form.Item name='path' label='VALUE'>
                <Input disabled />
            </Form.Item>
            <Form.Item name='value' label='PATH'>
                <Input disabled />
            </Form.Item>

            <Divider />

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" loading={loading}>
                    提交
                </Button>
                <Divider type="vertical" />
                <Button type="default" onClick={() => form.resetFields()}>
                    重置
                </Button>
            </Form.Item>

        </Form>

    )

}