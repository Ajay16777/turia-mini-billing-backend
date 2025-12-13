import bcrypt from 'bcrypt';
import commonUtils from '../../common-utils/index.js';
import { validateLogin } from './auth.validation.js';
import errorMessages from '../errorMessages.js';
import { generateAccessToken } from './auth.helper.js';

const { errorUtils, postgreModels, commonHelper } = commonUtils;
const { UnauthorizedError } = errorUtils;
const { userRepo } = postgreModels;

/**
 * Login user
 * @param {Object} payload
 * @returns {Object} user info + JWT token
 */
const login = async (payload) => {
    // 1️⃣ Validate input (throws ValidationError automatically)
    const { email, password } = validateLogin(payload);

    // 2️⃣ Find user
    const filters = { email }
    const attributes = ['id', 'name', 'email', 'phone', 'role', 'password']
    let user = await userRepo.findAll({ filters, attributes });

    if (!commonHelper.isNonEmptyArray(user)) {
        throw new UnauthorizedError(errorMessages.AUTH.INVALID_CREDENTIALS);
    }

    user = user[0];

    // 3️⃣ Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new UnauthorizedError(errorMessages.AUTH.INVALID_CREDENTIALS);
    }

    // 4️⃣ Generate JWT
    const token = generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
    });

    // 5️⃣ Return response
    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
        accessToken: token,
    };
};

export { login };
