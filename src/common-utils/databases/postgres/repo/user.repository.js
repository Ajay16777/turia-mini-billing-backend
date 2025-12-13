import User from '../models/user.model.js';

class UserRepository {
    /**
     * Create a new user
     */
    async create(data, transaction = null) {
        return User.create(data, { transaction });
    }

    /**
     * Update an existing user
     */
    async update(id, data, transaction = null) {
        const user = await User.findByPk(id);
        if (!user) return null;

        return user.update(data, { transaction });
    }

    /**
     * Find a single user by conditions
     */
    async findOne(where = {}, attributes = null) {
        return User.findOne({
            where,
            attributes,
        });
    }

    /**
     * Find a user by primary key
     */
    async findById(id, attributes = null) {
        return User.findByPk(id, { attributes });
    }

    /**
     * Find multiple users with filtering, pagination, sorting
     * @param {Object} options - { filters, limit, offset, order, attributes }
     */
    async findAll(options = {}) {
        const {
            filters = {},
            limit = 10,
            offset = 0,
            order = [['createdAt', 'DESC']],
            attributes = null,
        } = options;

        return User.findAndCountAll({
            where: filters,
            limit,
            offset,
            order,
            attributes,
        });
    }

    /**
     * Soft delete a user
     */
    async delete(id, transaction = null) {
        const user = await User.findByPk(id);
        if (!user) return null;

        return user.destroy({ transaction });
    }
}

export default new UserRepository();
