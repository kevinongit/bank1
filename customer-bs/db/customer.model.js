module.exports = (sequelize, DataTypes) => {
    const Customer = sequelize.define('customer', {
        userId: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },
    })

    return Customer
}