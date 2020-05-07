import React, { useState, useEffect, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Row, Col, TreeSelect, Tree, Card, Typography, Alert, DatePicker, Button, Divider, Modal, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import { DownOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import { Edit } from './components/Edit';
import { catalog, query, remove } from '@/services/system/dict'
import ResponseHandler from '@/utils/ResponseHandler'

const { confirm } = Modal;


const DictPage = (props) => {

    const actionRef = useRef();

    // 树数据加载
    const [treeData, setTreeData] = useState([]);
    const fetchTreeData = async () => {
        const response = await catalog();
        setTreeData(response.data)
    }
    useEffect(() => {
        fetchTreeData();
    }, []);

    // 点击字典树的时候,同时更新右侧数据
    const [ selected, setSelected ] = useState({ 
        id: 1   /** 默认使用 id=1 , 即默认情况下加载 root 目录下的所有字典目录 */
    });
    const treeNodeClick = async (_, { node }) => {
        await setSelected ( node.payload )
        if (actionRef.current) {
            actionRef.current.reload();
        }
    }

    // 编辑Modal框的可见性设置
    const [editVisible, setEditVisible] = useState(false);
    const callback = () => {
        setEditVisible(false);
        if (actionRef.current) {
            actionRef.current.reload();
        }
        fetchTreeData();
    }

    // 编辑Modal对应加载的编辑数据
    const [data, setData] = useState({});

    const doDelete = (id) => {
        confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '确认要删除这条数据吗?',
            onOk() {
                return new Promise(async (resolve, reject) => {
                    const response = await remove(id);
                    ResponseHandler.handle(response, () => { /** SUCCESS */
                        message.success('删除成功');
                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                        fetchTreeData();
                        resolve();
                    }, () => {   /** ERROR */

                    })
                })
            },
            onCancel() { },
        });
    }

    const columns = [
        {
            title: '字典类型',
            dataIndex: 'type',
            valueEnum: {
                1: {
                    text: '字典值',
                },
                2: {
                    text: '字典目录',
                }
            },
            hideInSearch: true
        },
        {
            title: '字典名称',
            dataIndex: 'name',
        },
        {
            title: 'Unique',
            dataIndex: 'uniq',
        },
        {
            title: '字典值',
            dataIndex: 'val',
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => (
                <>
                    <a onClick={async () => {
                        await setData(record);
                        setEditVisible(true);
                    }}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() => {
                        doDelete(record.id);
                    }}>删除</a>
                </>
            )
        }
    ]

    return (
        <PageHeaderWrapper>
            <Row>
                <Col span={4}>
                    <Card title='字典结构-Tree' style={{ minHeight: '600px' }}>
                        {treeData.length > 0 &&
                            <Tree
                                style={{ width: '100%' }}
                                treeData={treeData}
                                defaultExpandAll
                                onSelect={treeNodeClick}
                            />
                        }
                    </Card>
                </Col>
                <Col span={20} >
                    <ProTable
                        headerTitle="查询表格"
                        style={{ marginLeft: '10px', marginTop: '2px' }}
                        request={params => query({ pId: selected.id, ...params })}
                        rowKey="id"
                        actionRef={actionRef}
                        toolBarRender={() => {
                            return ([
                                <Button type="primary" onClick={async () => {
                                    await setData(undefined)
                                    await setEditVisible(true)
                                }}>
                                    <PlusOutlined />添加
                                </Button>
                            ])
                        }}
                        columns={columns}
                    >
                    </ProTable>
                </Col>
            </Row>

            <Modal
                title="添加字典"
                visible={editVisible}
                footer={null}
                onCancel={() => {
                    setEditVisible(false)
                }}
                destroyOnClose
            >
                <Edit data={data} selected = { selected } callback={callback} > </Edit>
            </Modal>

        </PageHeaderWrapper>
    )

}

export default DictPage;