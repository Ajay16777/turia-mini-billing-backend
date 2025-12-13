import commonUtils from '../../common-utils/index.js';

const { tokenConfig } = commonUtils;

/**
* Generate JWT access token
*/
const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        tokenConfig.JWT_SECRET,
        {
            expiresIn: tokenConfig.JWT_EXPIRES_IN || '1d',
        }
    );
}

export {
    generateAccessToken
}
