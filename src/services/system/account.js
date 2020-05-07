import request from '@/utils/request';
import { adaptParams , adaptResponse } from '@/utils/ProTableDataAdapter';
import { BM_API_BASE } from '@/services/config';
import StandardBMService from '@/services/StandardBMService';


// http://127.0.0.1:8080/system/account
const ACCOUNT_BASE_URI = `${BM_API_BASE}/system/account`;
const service = new StandardBMService( ACCOUNT_BASE_URI );

export const { query , saveOrUpdate , remove } = service;

export async function checkUsernameExists( username ){
    return request(  `${ACCOUNT_BASE_URI}/checkUsernameExists` , { params : { username:username } } )
}

export async function getAssignedRoleList( id ){
    return request(  `${ACCOUNT_BASE_URI}/getAssignedRoleList` , { params : { id:id } } )
}

export async function assignRole( data ){
    return request( `${ACCOUNT_BASE_URI}/assignRole` , 
        {
            method: 'POST' , 
            requestType: 'form',
            data: data
        }
    )
}

