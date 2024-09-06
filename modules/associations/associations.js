// Setup associations in db.js or a dedicated associations file

import EmployeeReports from "../EmployeeReports/model";
import Payout from "../Payouts/model";
import SalesData from "../SaleData/model";
import Employee from "../User/model";

Employee.hasMany(SalesData, { foreignKey: 'EmployeeID' });
SalesData.belongsTo(Employee, { foreignKey: 'EmployeeID' });

Employee.hasMany(Payout, { foreignKey: 'EmployeeID' });
Payout.belongsTo(Employee, { foreignKey: 'EmployeeID' });

Employee.hasMany(EmployeeReports, { foreignKey: 'EmployeeID' });
EmployeeReports.belongsTo(Employee, { foreignKey: 'EmployeeID' });