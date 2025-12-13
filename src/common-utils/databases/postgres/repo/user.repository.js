import User from '../models/user.model.js';
import { DatabaseError } from '../../../errorHandler.js';

class UserRepository {
    /**
     * Create a new user
     */
    async create(data, transaction = null) {
        try {
            return await User.create(data, { transaction });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Update an existing user
     */
    async update(id, data, transaction = null) {
        try {
            const user = await User.findByPk(id);
            if (!user) return null;

            return await user.update(data, { transaction });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Find a single user by conditions
     */
    async findOne(where = {}, attributes = null) {
        try {
            return await User.findOne({ where, attributes });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Find a user by primary key
     */
    async findById(id, attributes = null) {
        try {
            return await User.findByPk(id, { attributes });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Find multiple users with filtering, pagination, sorting
     */
    async findAll(options = {}) {
        const { filters = {}, limit = 10, offset = 0, order = [['created_at', 'DESC']], attributes = null } = options;
        try {
            return await User.findAll({
                where: filters,
                limit,
                offset,
                order,
                attributes,
            });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }

    /**
     * Soft delete a user
     */
    async delete(id, transaction = null) {
        try {
            const user = await User.findByPk(id);
            if (!user) return null;

            return await user.destroy({ transaction });
        } catch (error) {
            throw new DatabaseError(error);
        }
    }
}

export default new UserRepository();
