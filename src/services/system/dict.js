import request from '@/utils/request';
import { adaptParams , adaptResponse } from '@/utils/ProTableDataAdapter';
import { BM_API_BASE } from '@/services/config';
import StandardBMService from '@/services/StandardBMService';

// http://127.0.0.1:8080/system/dict
const DICT_BASE_URI = `${BM_API_BASE}/system/dict`;
const service = new StandardBMService( DICT_BASE_URI );
export const { query , saveOrUpdate , remove } = service;
/**
 * 获取字典目录结构数据
 */
export async function catalog() {
    return request(`${DICT_BASE_URI}/catalog`);
}

export async function checkUniqExists( params ){
    return request( `${DICT_BASE_URI}/checkUniqExists` , { params:params } )
}

export async function checkValExistsInSiblings( params ){
    return request( `${DICT_BASE_URI}/checkValExistsInSiblings` , { params:params } )
}

