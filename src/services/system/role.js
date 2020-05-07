import request from '@/utils/request';
import { BM_API_BASE } from '@/services/config';
import StandardBMService from '@/services/StandardBMService';

const ROLE_BASE_URI = `${BM_API_BASE}/system/role`;
const service = new StandardBMService( ROLE_BASE_URI );

export const { query , saveOrUpdate , remove } = service;

export async function getAssignedPermissionList( id ){
    return request( `${ROLE_BASE_URI}/getAssignedPermissionList` , { params:{ id : id } });
}

export async function assignPermission( id , permissionIds ){
    return request( `${ROLE_BASE_URI}/assignPermission` , {
        data:{ id:id , permissionIds:permissionIds } , 
        method: 'POST' , 
        requestType: 'form'
    });
}