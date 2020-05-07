import React, { useState, useEffect, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, TreeSelect, Tree, Card, Typography, Alert, DatePicker, Button, Divider, Modal, message, Tabs } from 'antd';
import ProTable from '@ant-design/pro-table';
import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { query, getRealms } from '@/services/system/permission'
import Edit from './components/Edit'


const { TabPane } = Tabs;

const PermissionPage = (props) => {

    const actionRef = useRef();

    // 当在 Tabs 中选择了对应的 Realms 时 , 将 permission 数据装载进 Permission
    const [ selected ,  setSelected ] = useState(undefined);
    useEffect(() => {
        if (actionRef.current) {
            actionRef.current.reload();
        }
    }, [selected])

    // 初始化加载 Realms 集合,加载完毕后默认使用第一个Permission[Realm]作为被选择的Selected
    const [realms, setRealms] = useState(undefined);
    const fetchRealms = async ( iscallback ) => {
        const realms = await getRealms();
        await setRealms(realms);
        if ( iscallback ){
            actionRef.current.reload();
        }else{
            await setSelected( realms[0] );
        }
    }
    useEffect(() => {
        fetchRealms();
    }, []);

    // 当树上的节点Permission被点击的时候,更新 Selected
    const onTreeNodeSelect = async (_,{node}) => {
        await setSelected( node.payload );
    }

    const [visible , setVisible] = useState( false );
    const [data , setData] = useState(undefined);

    const callback = () => {
        setVisible(false);
        fetchRealms( true );
    }

    const columns = [
        {
            title: '权限类型',
            dataIndex: 'type',
            valueEnum: {
                1: {
                    text: '菜单',
                },
                2: {
                    text: '功能',
                }
            },
            hideInSearch: true
        },
        {
            title: '权限名称',
            dataIndex: 'name',
        },
        {
            title: 'PATH',
            dataIndex: 'path',
        },
        {
            title: 'VALUE',
            dataIndex: 'value',
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => (
                <>
                    <a onClick={async () => {
                        await setData(record);
                        setVisible(true);
                    }}>编辑</a>
                </>
            )
        }

    ];



    return (
        <PageHeaderWrapper>
            <Row>
                <Col span={5}>
                    <Card title='菜单结构 - Tree' style={{ minHeight: '600px' }}>
                        {
                            realms &&
                            <Tabs defaultActiveKey="1" type="card" onChange={(activeKey) => {
                                let selectedRealm = realms.filter((realm) => {
                                    return realm.id + '' === activeKey + '';
                                })[0];
                                setSelected(selectedRealm);
                            }}>
                                {realms.length > 0 &&
                                    realms.map(realm => {
                                        return (
                                            <TabPane tab={realm.name} key={realm.id} >
                                                {realm.treeData && realm.treeData.length > 0 &&
                                                    <Tree
                                                        treeData={realm.treeData}
                                                        style={{ width: '100%' }}
                                                        defaultExpandAll
                                                        onSelect={ onTreeNodeSelect }
                                                    />
                                                }
                                            </TabPane>
                                        )
                                    })
                                }
                            </Tabs>
                        }

                    </Card>
                </Col>
                <Col span={18} style={{ marginLeft: '1%' }} >
                    <ProTable
                        headerTitle="查询表格"
                        style={{ marginLeft: '10px', marginTop: '2px' }}
                        request={params => query({ pId: selected.id, ...params })}
                        rowKey="id"
                        actionRef={actionRef}
                        columns={columns}
                    >
                    </ProTable>
                </Col>
            </Row>

            <Modal
                title="权限编辑"
                visible={visible}
                footer={null}
                onCancel={() => {
                    setVisible(false)
                }}
                destroyOnClose
            >
                <Edit data={data} selected={selected} callback={callback} > </Edit>
            </Modal>

        </PageHeaderWrapper>
    )
}
export default PermissionPage;