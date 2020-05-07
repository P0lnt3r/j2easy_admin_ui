export default {
    handle( response , success , error ){
        if ( response.code === '0'  /** success */ ){
            if ( success ){
                success( response );
            }
        }else{
            if ( error ){
                error( response )
            }
        }
    }
}