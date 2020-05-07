export function adaptParams( params ){
    return {
        page: params.current , 
        size: params.pageSize ,
        ...params
    }
}

export function adaptResponse( response ){
    return new Promise( ( resolve , reject ) => {
        const data = response.data;
        resolve( {
            data: data.records  ,
            total: data.total   , 
            pageSize: data.size ,
            current: data.page
        } );
    } )
}
