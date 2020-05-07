import { Form, Input, Button, Checkbox, Modal, Divider, Select, message, Row, Col, Tabs , Tree } from 'antd';
import React, { useState } from 'react';
import { permissionTree } from '@/services/system/permission';
import { getAssignedPermissionList , assignPermission } from '@/services/system/role';
import { useEffect } from 'react';
import ResponseHandler from '@/utils/ResponseHandler';

const { TabPane } = Tabs;

/**
 * 角色分配权限页
 */
export default (props) => {

    const { data , callback} = props;
    const { id , realm } = data;
    const getPath = ( realm ) => {
        switch (realm) {
            case '2':
                return '/api/apps'
            case '3':
                return '/api/publics'
            default:
                return '/api/bm'
        }
    }
    const path = getPath( realm );

    // ReactTreeNode < Permission > , 符合 ReactTreeNode 设计的 PermissionVO 数据.
    const [modules, setModules] = useState([]);

    // 用来页面中被选择的 Permission-Ids
    /*
     * {
          "/api/bm/system":[ checkedKeys ]
       }
       类似这种结构,记录一个域下每个模块中被勾选的 Permission.
     */
    const [checkedKeys, setCheckedKeys] = useState({});

    /**
     * 加载权限数据,最终渲染出树结构出来.
     */
    const fetchAssignedPermission = async () => {
        const response = await permissionTree(path);
        // 过滤掉默认存在于指定域包下，没有模块分类的 Controller , 比如 LoginController 对应的
        const modules = response.data.filter(treenode => treenode.payload.type === '1');
        const getAssigendRole = await getAssignedPermissionList(id);
        const data = getAssigendRole.data;
        modules.forEach( module => {
            const { value , path } = module.payload;
            checkedKeys[ value ] = data.filter( perm => perm.path.startsWith( path ) && perm.type==='2' ).map( perm => perm.id + "" )
        } )
        setCheckedKeys( checkedKeys );
        setModules(modules);
    }
    useEffect(() => {
        fetchAssignedPermission();
    }, []);

    // 用于存储各个Module下的那种半选择的Permission.ID
    const [ half , setHalf ] = useState( {} );

    const submit = async () => {
        const permissionIds = new Set([]);
        for( let p in checkedKeys ){
            checkedKeys[p].forEach( key => permissionIds.add(key) );
        }
        for( let p in half ){
            half[p].forEach( key => permissionIds.add(key) );
        }
        const response = await assignPermission( id , Array.from( permissionIds ) );
        ResponseHandler.handle( response , () => {
            message.success('授权成功');
            callback();
        } ) ;
    }

    return (
        <div>
            <Tabs defaultActiveKey="1" type="card" >
                { modules.length > 0 && checkedKeys &&
                    modules.map(module => {
                        const perm = module.payload;
                        const { name, path, value } = perm;
                        const treeData = modules.filter( _m => _m.key === module.key )
                        return (
                            <TabPane tab={name} key={path} >
                                <Tree
                                    checkable
                                    style={{ width: '100%' }}
                                    treeData={ treeData }
                                    defaultExpandedKeys = { [ treeData[0].key ] }
                                    checkedKeys = { checkedKeys[ value ] }
                                    onCheck = { ( _checkedKeys , { halfCheckedKeys } ) => {
                                        checkedKeys[ value ] = _checkedKeys;
                                        half[ value ] = halfCheckedKeys;
                                        setHalf( { ...half } );
                                        setCheckedKeys( { ...checkedKeys } );
                                    } }
                                />
                            </TabPane>
                        )
                    })
                }
            </Tabs>
            <Divider />
            <Row>
                <Col offset={20} >
                    <Button type='primary' onClick = {submit} >
                        确定
                    </Button>
                </Col>
            </Row>
        </div>

    )

}