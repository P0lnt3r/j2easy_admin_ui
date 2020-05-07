
import { JSEncrypt } from 'jsencrypt';

const PUBLIC_KEY = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCuEbk7R3iHljy+wqlnIjKWo3hcWKiSL9YCY1Ax8MwZHxnY7oJ9l4APK4sAiWpXZV/rq+MhBFLfMfS9S2/+Q137AEZ8gQXHVRfqWzlT4/x7iLFpkhcdgdZMWHtvBBFIYdBRi59ufrvlYCxHW560Cy2Z7NUMsVa6hyw9qwqu+GcW7wIDAQAB';
const encrypt = new JSEncrypt();
encrypt.setPublicKey( PUBLIC_KEY );

export default {
    encrypt: ( data )=> {
        return encrypt.encrypt(data);
    }
}

