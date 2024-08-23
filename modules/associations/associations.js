// Setup associations in db.js or a dedicated associations file

import EarlyPayments from "../EarlyPayment/model";
import RefundPayments from "../RefundPayment/model";
import SalesData from "../SaleData/model";
import Upload from "../upload/model";
import Employee from "../user/model";

Employee.hasMany(SalesData, { foreignKey: 'EmployeeID' });
SalesData.belongsTo(Employee, { foreignKey: 'EmployeeID' });

Employee.hasMany(EarlyPayments, { foreignKey: 'EmployeeID' });
EarlyPayments.belongsTo(Employee, { foreignKey: 'EmployeeID' });

Employee.hasMany(RefundPayments, { foreignKey: 'EmployeeID' });
RefundPayments.belongsTo(Employee, { foreignKey: 'EmployeeID' });

Upload.belongsTo(SalesData, { foreignKey: 'TransactionID' });
SalesData.hasOne(Upload, { foreignKey: 'TransactionID' });
