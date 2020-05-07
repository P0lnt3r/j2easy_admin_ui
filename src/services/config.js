// [ dev , test , prod ]
/**
 * dev:  开发环境
 * test: 测试环境
 * prod: 生产环境
 */
const ENV = 'dev';

const config = {
    dev:{
        bm_api_base: 'http://127.0.0.1:8080/api/bm',        
    },
    test:{
        bm_api_base: 'http://127.0.0.1:8080'
    },
    prod:{
        bm_api_base: 'http://127.0.0.1:8080'
    }
}

export const BM_API_BASE = config[ ENV ].bm_api_base;

