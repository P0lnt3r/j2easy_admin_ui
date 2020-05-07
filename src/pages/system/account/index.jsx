import React, { useState, useEffect, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, TreeSelect, Tree, Card, Typography, Alert, DatePicker, Button, Divider, Modal, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Edit from './components/Edit';
import Assign from './components/Assign'
import { query } from '@/services/system/account';


const AccountPage = ( props ) => {

    const actionRef = useRef();

    const [ editVisible , setEditVisible ] = useState( false );
    const [ data , setData ] = useState( {} );
    const [ assignVisible , setAssignVisible ] = useState( false );

    const columns = [
        {
            title: '账户用户名',
            dataIndex: 'username',
        },
        {
            title: '登陆密码',
            dataIndex: 'password',
            hideInSearch: true,
        },
        {
            title: '状态',
            dataIndex: 'state',
            valueEnum: {
                1: {
                    text: '正常',
                    status: 'Success',
                },
                2: {
                    text: '禁用',
                }
            },
            hideInSearch: true,
        },
        {
            title: '所属域',
            dataIndex: 'realm',
            valueEnum: {
                1: {
                    text: '后台',
                },
                2: {
                    text: '前台',
                }
            },
            hideInSearch: true
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            hideInSearch: true,
        },
        {
            title: '最近登陆',
            dataIndex: 'createTime',
            hideInSearch: true,
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: ( _ , record ) => (
                <>
                    <a onClick={ async ()=>{
                        await setData( record );
                        setEditVisible( true ) ;
                    } }>
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <a onClick={ async ()=>{
                        await setData( record );
                        setAssignVisible( true );
                    } }>
                        角色分配
                    </a>
                </>
            )
        }
    ];

    return (
        <PageHeaderWrapper subTitle='对系统中的所有账户进行管理'>
            <ProTable
                headerTitle="查询表格"
                style={{ marginLeft: '10px', marginTop: '2px' }}
                request={ params => query(params) }
                rowKey="id"
                actionRef={actionRef}
                toolBarRender={() => {
                    return ([
                        <Button type="primary" onClick={ async () => {
                            await setData({});
                            setEditVisible( true );
                        }}>
                            <PlusOutlined />新建账户
                        </Button>
                    ])
                }}
                columns={columns}
            >
            </ProTable>

            <Modal
                title="账户信息"
                visible={ editVisible }
                key='accountEdit'
                footer={ null }
                onCancel={ () => { 
                    setEditVisible( false );
                } }
                destroyOnClose
            >
                <Edit data={ data } callback = { () => { 
                    setEditVisible( false ); 
                    actionRef.current.reload() 
                } } ></Edit>
            </Modal>

            <Modal
                title="角色分配"
                visible={ assignVisible }
                key='accountAssign'
                footer={ null }
                onCancel={ () => { 
                    setAssignVisible( false );
                } }
                width='50%'
                destroyOnClose
            >
                <Assign data={ data } callback = { () => { 
                    setAssignVisible( false ); 
                    actionRef.current.reload() 
                } } ></Assign>
            </Modal>
        </PageHeaderWrapper>
    )



}

export default AccountPage;