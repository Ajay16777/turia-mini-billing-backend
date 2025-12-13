import { DataTypes, Model } from 'sequelize';
import sequelize from '../connection.js';

class InvoiceItem extends Model {
    static associate(models) {
        // InvoiceItem belongs to Invoice
        InvoiceItem.belongsTo(models.Invoice, {
            foreignKey: 'invoice_id',
            as: 'invoice',
        });
    }
}

InvoiceItem.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },

        invoice_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
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
        modelName: 'InvoiceItem',
        tableName: 'invoice_items',
        timestamps: false, // handled manually like other models
    }
);

export default InvoiceItem;
