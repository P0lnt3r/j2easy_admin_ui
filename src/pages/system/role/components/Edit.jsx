import { Form, Input, Button, Checkbox, Modal, Divider, Select, message, Row, Col } from 'antd';
import React, { useState } from 'react';
import { saveOrUpdate } from '@/services/system/role';
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

/**
 * data : 是 Edit 组件需要显示的数据,一般是在列表栏点击编辑之后,将对应的数据带过来的
 * callback : 是 这个以 Modal 形式显示的 编辑完成后的回调函数,一般用户更新 MODAL 之前的那个列表数据.
 */
export default ( props ) => {

    
    const { data , callback } = props;
    const [form] = Form.useForm();
    const [update , setUpdate] = useState( false );

    const onFinish = async ( values ) => {
        if ( !update ) {
            callback();
            return;
        }
        await setSubmitting( true );
        const response = await saveOrUpdate( values );
        await setSubmitting( false );
        ResponseHandler.handle( response , ()=>{
            message.success('保存成功');
            callback();
        } )

    }

    const [ submitting , setSubmitting ] = useState( false );

    return (
        <Form {...layout} onFinish={onFinish} initialValues={ ({ ...data }) } form={form} onChange={ ()=>setUpdate(true) } >

            <Form.Item label='主键ID' name='id' hidden>
                <Input hidden/>
            </Form.Item>

            <Form.Item label='角色名称' name='name' hasFeedback 
                       rules={ [{ required:true , message:'请输入角色名称' }] } >
                <Input />
            </Form.Item>

            <Form.Item name='realm' label='角色所属域'  hasFeedback
                        rules={ [{ required:true , message:'请选择角色所属域' }] }  >
                <Select onChange={ ()=>setUpdate(true) }>
                    <Select.Option value="1">后台</Select.Option>
                    <Select.Option value="2">前台</Select.Option>
                </Select>
            </Form.Item>

            <Form.Item name='state' label='角色状态' hasFeedback
                    rules={ [{ required:true , message:'请选择角色状态' }] } >
                <Select onChange={ ()=>setUpdate(true) }>
                    <Select.Option value="1">正常</Select.Option>
                    <Select.Option value="2">禁用</Select.Option>
                </Select>
            </Form.Item>

            <Divider />

            <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit" loading={submitting} >
                    提交
                </Button>
                <Divider type="vertical" />
                <Button type="default" onClick={() => {form.resetFields() ; setUpdate(false)}}>
                    重置
                </Button>
            </Form.Item>

        </Form>
    )

} 