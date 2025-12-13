import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';
import constants from '../../../constants.js';

const {
    PENDING,
    PAID,
    CANCELLED,
    OVERDUE,
} = constants.INVOICE_STATUS;

class Invoice extends Model {
    static associate(models) {
        // Invoice belongs to User (Customer)
        Invoice.belongsTo(models.User, {
            foreignKey: 'customer_id',
            as: 'customer',
        });
    }
}

Invoice.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },

        customer_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        invoice_no: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },

        subtotal: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        gst_percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
        },

        gst_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        status: {
            type: DataTypes.ENUM(
                PENDING,
                PAID,
                CANCELLED,
                OVERDUE
            ),
            allowNull: false,
            defaultValue: PENDING,
        },

        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },

        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'Invoice',
        tableName: 'invoices',
        timestamps: false, // handled manually like User
    }
);

export default Invoice;
