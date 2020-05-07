import request from '@/utils/request';
import { adaptParams , adaptResponse } from '@/utils/ProTableDataAdapter';

/**
 * 封装了针对后台接口的标准 增删改查(结合 ProTable 组件)的基本访问操作
 * 
 * 就是设置一个基础的URI,比如 http://localhost/api/system/account
 * 那么对应后台接口的几个操作就固定为:
 *                      GET ->  http://localhost/api/system/account/query
 *                      POST -> http://localhost/api/system/account/saveOrUpdate
 *                      POST -> http://localhost/api/system/account/remove
 * 
 */

export default function( MODULE_URI ){

    return {
        query: async ( params )=>{
            const response = await request( `${MODULE_URI}/query` , {
                params: adaptParams( params )
            } ) ;
            return adaptResponse( response );
        } , 
        saveOrUpdate: async ( data ) => {
            return request( `${MODULE_URI}/saveOrUpdate`  , {
                method: 'POST' , 
                requestType: 'form',
                data: data
            }  )
        } , 
        remove: async ( id ) => {
            return request( `${MODULE_URI}/remove` , {
                method: 'POST' , 
                requestType: 'form',
                data: {
                    id:id
                }
            } )
        }
    }
}


