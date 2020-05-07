import { Form, Input, Button, Checkbox, Modal, Divider, Select, message , Row , Col } from 'antd';
import React, { useState } from 'react';
import { saveOrUpdate, checkUniqExists, checkValExistsInSiblings } from '@/services/system/dict'

/** 输入项中 Label 与 Input 之间的间距调整 */
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
};
/** 输入表单中 底部按钮的位置调整 */
const tailLayout = {
    wrapperCol: { offset: 12, span: 12, }
};

export const Edit = (props) => {

    const [form] = Form.useForm();

    // 从父组件中获取的信息:
    /*
     * data : 被编辑的字典数据,如果不存在,则本次提交为添加，否则为更新
       selectedTreeNode :  是外层树中被点击的 字典目录 数据
       callback : 一个当确认时的回调函数,以便修改字典数据后,对外层的数据进行重新查询进行更新
     */
    const { data, selected, callback } = props;
    
    // Form 提交状态
    const [loading, setLoading] = useState(false);

    // Form 初始值配置
    const initialValues = {
        pName: selected.name,
        pId: selected.id,
        uniq: data ? data.uniq : selected.uniq ? selected.uniq + '.' : '' , 
        ...data
    }

    // 表单提交
    const onFinish = async (values) => {
        setLoading(true);
        const response = await saveOrUpdate({
            ...values
        });
        if (response.code === '0') {
            message.success('success')
            callback();
        }
    }

    // 两个输入项的异步检查控制
    const [asyncUniqCheckStatus, setAsyncUniqCheckStatus] = useState(false);
    const [asyncValCheckStatus, setAsyncValCheckStatus] = useState(false);

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
            <Form.Item name='pId' label='父节点主键ID' hidden>
                <Input />
            </Form.Item>
            <Form.Item name='pName' label='父节点'>
                <Input disabled />
            </Form.Item>

            <Form.Item name='type' label='字典类型'  >
                <Select>
                    <Option value="1">字典值</Option>
                    <Option value="2">字典目录</Option>
                </Select>
            </Form.Item>

            <Form.Item name='name' label='字典名称' rules={[{ required: true, message: '请输入字典名称!' }]} >
                <Input />
            </Form.Item>

            <Form.Item name='uniq' label='Unique' validateTrigger='onBlur' hasFeedback validateStatus={asyncUniqCheckStatus}
                rules={[(form) => ({
                    validator: async (rule, value, _) => {
                        if (!value) {
                            return Promise.reject('请输入字典UNIQ');
                        }
                        setAsyncUniqCheckStatus('validating')
                        const response = await checkUniqExists({
                            uniq: value,
                            id: data ? data.id : 0
                        })
                        if (response.data === 0) {
                            setAsyncUniqCheckStatus('success')
                            return Promise.resolve();
                        }
                        setAsyncUniqCheckStatus('error')
                        return Promise.reject('全局唯一值已被其他字典使用');
                    }
                })]}>
                <Input />
            </Form.Item>

            <Form.Item name='val' label='字典值' validateTrigger='onBlur' hasFeedback validateStatus={asyncValCheckStatus}
                rules={[(form) => ({
                    validator: async (rule, value, _) => {
                        if (!value) {
                            return Promise.reject('请输入字典值');
                        }
                        setAsyncValCheckStatus('validating')
                        const response = await checkValExistsInSiblings({
                            val: value,
                            pId: selected.id,
                            id: data ? data.id : 0
                        })
                        if (response.data === 0) {
                            setAsyncValCheckStatus('success')
                            return Promise.resolve();
                        }
                        setAsyncValCheckStatus('error')
                        return Promise.reject('同辈中已存在使用相同字典值');
                    }
                })]}>
                <Input />
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
        
    );
};


