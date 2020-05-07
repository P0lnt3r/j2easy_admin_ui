import React, { useState, useEffect, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, TreeSelect, Tree, Card, Typography, Alert, DatePicker, Button, Divider, Modal, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Edit from './components/Edit';
import Assign from './components/Assign'
import { query } from '@/services/system/role';

export default () => {

    const actionRef = useRef();
    const [ editVisible , setEditVisible ] = useState( false );
    const [ editData , setEditData ] = useState( undefined );
    const [ assignVisible , setAssignVisible ] = useState( false );

    const columns = [
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
            title: '角色名称',
            dataIndex: 'name',
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
            title: '创建时间',
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
                        setEditData( record );
                        setEditVisible( true ) ;
                    } }>
                        编辑
                    </a>
                    <Divider type="vertical" />
                    <a onClick={ () => {
                        setEditData( record );
                        setAssignVisible( true );
                    } }>
                        权限分配
                    </a>
                </>
            )
        }
    ];

    return (
        <PageHeaderWrapper subTitle='对系统中所有角色进行管理'>
            <ProTable
                headerTitle="查询表格"
                style={{ marginLeft: '10px', marginTop: '2px' }}
                request={ params => query(params) }
                rowKey="id"
                actionRef={actionRef}
                toolBarRender={() => {
                    return ([
                        <Button type="primary" onClick={ async () => {
                            await setEditData( undefined );
                            setEditVisible( true );
                        }}>
                            <PlusOutlined />新建角色
                        </Button>
                    ])
                }}
                columns={columns}
            >
            </ProTable>

            <Modal
                title="角色信息"
                visible={ editVisible }
                rowKey='edit'
                footer={ null }
                onCancel={ () => { 
                    setEditVisible( false );
                } }
                destroyOnClose
            >
                <Edit data={ editData } callback = { () => { 
                    setEditVisible( false ); 
                    actionRef.current.reload() 
                }} >
                </Edit>
            </Modal>

            <Modal
                title="分配权限"
                visible={ assignVisible }
                rowKey='assign'
                footer={ null }
                onCancel={ () => { 
                    setAssignVisible( false );
                } }
                destroyOnClose
            >
                <Assign data={ editData } callback = { () => { 
                    setAssignVisible( false ); 
                    actionRef.current.reload() 
                }} >
                </Assign>
            </Modal>

        </PageHeaderWrapper>
    )

}

