import { Form } from 'antd';
import React, { useState } from 'react';

export default AsyncFormItemInput = ( props ) => {

    const [ async , setAsync ] = useState( false );
    const [ validateStatus , setValidateStatus ] = useState( 'validating' );

    return (
        <Form.Item hasFeedback validateTrigger='onBlur' validateStatus={validateStatus}>

            

        </Form.Item>
    )

}