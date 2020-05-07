import request from '@/utils/request';
import { BM_API_BASE } from '@/services/config';
import StandardBMService from '@/services/StandardBMService';

const PERMISSION_BASE_URI = `${BM_API_BASE}/system/permission`;
const service = new StandardBMService(PERMISSION_BASE_URI);
export const { query , saveOrUpdate , remove } = service;

/**
 * 获取权限菜单树形结构数据
 */
export async function catalog( path ) {
    return request(`${PERMISSION_BASE_URI}/catalog` , {
        params:{ prefix:path }
    });
}

export async function permissionTree( path ){
    return request(`${PERMISSION_BASE_URI}/permissionTree` , {
        params:{ prefix:path }
    });
}


export async function update( data ){
    return request( `${PERMISSION_BASE_URI}/update` , {
        method: 'POST' , 
        requestType: 'form',
        data: data
    } )
}

export async function getRealms(){
    const response = await request(`${PERMISSION_BASE_URI}/realms`);
    const realms = response.data;
    return new Promise( ( resolve , reject )=>{
        Promise.all(  
            response.data.map( realm => {
                return new Promise( async ( resolve , reject )=>{
                    const _response = await catalog( realm.path );
                    resolve( { [realm.path]:_response.data || [] }  );
                } );
            } )
        ).then( (values) => {
            values.forEach( value => {
                realms.forEach( realm => {
                    if ( value[ realm.path ] ){
                        realm.treeData = value[realm.path];
                    }
                } );
            } );
            resolve( realms );
        } )
    } );
}
