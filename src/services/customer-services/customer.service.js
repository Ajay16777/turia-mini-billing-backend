import bcrypt from 'bcrypt';
import commonUtils from '../../common-utils/index.js';
import { validateCreateUser, validateFetchUsers } from './customer.validation.js';
import errorMessages from '../errorMessages.js';

const { errorUtils, postgreModels, constants } = commonUtils;
const { ValidationError } = errorUtils;
const { userRepo } = postgreModels;


/**
 * Create a new customer
 * @param {Object} payload
 * @returns {Object} created customer
 */
const createCustomer = async (payload) => {
    // 1️⃣ Validate input
    const userData = validateCreateUser(payload);

    const existingUser = await userRepo.findByEmailOrPhone(userData.email, userData.phone);


    if (existingUser) {
        throw new ValidationError(errorMessages.USER.ALREADY_EXISTS);
    }

    // 3️⃣ Hash password
    const saltRounds = 10;
    userData.password = await bcrypt.hash(userData.password, saltRounds);

    // 4️⃣ Set default role
    userData.role = constants.ROLES.CUSTOMER;

    // 5️⃣ Create user
    const newUser = await userRepo.create(userData);

    return newUser;
};

/**
 * Fetch all customers
 * @param {Object} queryParams
 * @returns {Array} list of customers
 */
const fetchCustomers = async (payload) => {
    // 1️⃣ Validate query params
    const filters = validateFetchUsers(payload);

    // 2️⃣ Fetch customers
    filters.role = constants.ROLES.CUSTOMER;
    const attributes = ['id', 'name', 'email', 'phone']
    const customers = await userRepo.findAll({ filters, attributes });

    return customers;
};

/**
 * Fetch single customer by ID
 * @param {String|Number} customerId
 * @returns {Object} customer info
 */
const fetchSingleCustomer = async (payload) => {
    if (!payload || !payload.currentUser || !payload.currentUser.userId) {
        throw new ValidationError(errorMessages.USER.INVALID_ID);
    }

    const customer = await userRepo.findById(payload.currentUser.userId);

    if (!customer) {
        throw new ValidationError(errorMessages.USER.NOT_FOUND);
    }

    return customer;
};

export {
    createCustomer,
    fetchCustomers,
    fetchSingleCustomer,
};
