import { Form, Input, Button, Checkbox, Modal, Divider, Select, message, Row, Col } from 'antd';
import React, { useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { query } from '@/services/system/role';
import { getAssignedRoleList , assignRole } from '@/services/system/account'
import { useEffect } from 'react';
import ResponseHandler from '@/utils/ResponseHandler';

/**
 * 账户分配角色页
 */
export default (props) => {
    const { data , callback } = props; // 选中的 Account 数据
    const { realm } = data;

    // 加载账户对应的角色列表
    const [assignedRoleId, setAssignRoleId] = useState( undefined );
    const fetchAccountAssignedRole = async function () {
        const response = await getAssignedRoleList(data.id);
        const roleIdList = response.data.map(role => role.id);
        setAssignRoleId( roleIdList )
    }
    useEffect(() => {
        fetchAccountAssignedRole();
    }, []);

    const columns = [
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
        }
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            if ( selectedRowKeys.length > 0 ){
                setAssignRoleId(selectedRowKeys)
            }
        },
        getCheckboxProps: record => ({
            disabled: record.state === '2',
            name: record.name,
        }),
        selectedRowKeys: assignedRoleId
    };

    const submit = async () => {
        const response = await assignRole( {
            id: data.id ,
            roleIds: assignedRoleId
        } )
        ResponseHandler.handle( response , () => {
            message.success('角色分配成功');
            callback();
        } )
    }

    return (
        <div>
            {  assignedRoleId && 
                <ProTable columns={columns}
                    search={false}
                    options={false}
                    toolBarRender={false}
                    tableAlertRender={false}
                    request={(params) => query({ realm: realm, ...params })}
                    rowSelection={{
                        type: 'radio',
                        ...rowSelection,
                    }}
                    rowKey='id'>
                </ProTable>
            }
            <Divider />
            <Row>
                <Col offset={22} >
                    <Button type='primary' onClick={submit}>确定</Button>
                </Col>
            </Row>
        </div>

    )

}