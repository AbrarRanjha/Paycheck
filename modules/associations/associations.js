// Setup associations in db.js or a dedicated associations file

import CommissionSplit from "../CommissionSplit/model";
import EarlyPayments from "../EarlyPayment/model";
import EmployeeReports from "../EmployeeReports/model";
import Payout from "../Payouts/model";
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

SalesData.hasOne(Upload, { foreignKey: 'TransactionID' });
Upload.belongsTo(SalesData, { foreignKey: 'TransactionID' });

Employee.hasMany(Payout, { foreignKey: 'EmployeeID' });
Payout.belongsTo(Employee, { foreignKey: 'EmployeeID' });

Employee.hasMany(CommissionSplit, { foreignKey: 'EmployeeID' });
CommissionSplit.belongsTo(Employee, { foreignKey: 'EmployeeID' });

Employee.hasMany(EmployeeReports, { foreignKey: 'EmployeeID' });
EmployeeReports.belongsTo(Employee, { foreignKey: 'EmployeeID' });