const db = require("./database");
console.log(db);
const Customer = db.customer;
const Op = db.Sequelize.Op;

exports.create = async (newCustomer) => {
  return await Customer.create(newCustomer);
};

exports.findOne = async (userId) => {
  return await Customer.findOne({ where: { userId } });
};

// exports.create = async (newCustomer) => {
//     try {
//         if (await Customer.findOne({ where : { userId: newCustomer.userId }})) {
//             return {
//                 status: false,
//                 reason: `${newCustomer.userId} is alrealy in use.`
//             }
//         }

//         const customer = await Customer.create(newCustomer)
//         return {
//             status: true,
//             customer,
//         }
//     } catch (error) {
//         console.log(error)
//         return {
//             status: false,
//             reason: error.message || `Unknown DB Error occurred.`
//         }
//     }
// }

// exports.findOne = async (userId) => {
//     try {
//         const customer = await Customer.findOne({ where : {userId} })
//         if (customer) {
//             return {
//                 status: true,
//                 customer,
//             }
//         } else {
//             return {
//                 status: false,
//                 reason: `can't find ${userId}.`
//             }
//         }
//     } catch (error) {
//         console.log(error)
//         return {
//             status: false,
//             reason: error.message || `Unknown DB Error occurred.`
//         }
//     }
// }
