const CommissionSplit = require('../modules/CommissionSplit/model');
const advisorDetail = require('../modules/Payouts/advisorDetail');
const SalesData = require('../modules/SaleData/model');

const findSaleDataById = async id => {
  const existingSaleData = await SalesData.findByPk(id);
  if (!existingSaleData) {
    throw new Error('Sale data not found');
  }
  return existingSaleData;
};
const handlePercentagePayableUpdate = async (existingSaleData, data) => {
  const commissionRecord = await CommissionSplit.findOne({
    where: { transactionID: existingSaleData.transactionID },
  });
  const PayoutRecord = await advisorDetail.findOne({
    where: { transactionID: existingSaleData.transactionID },
  });
  if (
    typeof data.grossFCI !== 'undefined' &&
    data.grossFCI !== existingSaleData.grossFCI
  ) {
    console.log('Payout Record::' + JSON.stringify(PayoutRecord));

    if (data.grossFCI == 0) {
      await handleZeroGrossFCI(
        existingSaleData,
        commissionRecord,
        PayoutRecord
      );
    } else {
      await handleNonZeroGrossFCI(
        existingSaleData,
        commissionRecord,
        PayoutRecord,
        data
      );
    }
  }
  if (
    typeof data.percentagePayable !== 'undefined' &&
    data.percentagePayable !== existingSaleData.percentagePayable
  ) {
    console.log('Payout Record::' + JSON.stringify(PayoutRecord));

    if (data.percentagePayable == 0) {
      await handleZeroPercentagePayable(
        existingSaleData,
        commissionRecord,
        PayoutRecord
      );
    } else {
      await handleNonZeroPercentagePayable(
        existingSaleData,
        commissionRecord,
        PayoutRecord,
        data
      );
    }
  }
};
const handleZeroPercentagePayable = async (
  existingSaleData,
  commissionRecord,
  PayoutRecord
) => {
  existingSaleData.percentagePayable = 0;
  existingSaleData.FCIRecognition = 0;
  existingSaleData.payable = 0;
  commissionRecord.splitPercentage = 100;
  PayoutRecord.advisorSplitPercentage = 100;
  const grossValue = existingSaleData.grossFCI || 0;
  commissionRecord.splitAmount = grossValue;
  PayoutRecord.advisorSplitAmount = grossValue;
  commissionRecord.FCIRecognition = 0;
  PayoutRecord.FCIRecognition = 0;
  await commissionRecord.save();
  await existingSaleData.save();
  await PayoutRecord.save();
};
const handleZeroGrossFCI = async (
  existingSaleData,
  commissionRecord,
  PayoutRecord
) => {
  existingSaleData.percentagePayable = 0;
  existingSaleData.FCIRecognition = 0;
  existingSaleData.payable = 0;
  commissionRecord.splitPercentage = 0;
  (PayoutRecord.grossFCI = 0),
    (PayoutRecord.advisorSplitAmount = 0),
    (PayoutRecord.advisorSplitPercentage = 0),
    (commissionRecord.splitAmount = 0);
  commissionRecord.FCIRecognition = 0;
  await existingSaleData.save();
  await commissionRecord.save();
  await PayoutRecord.save();
};
const handleNonZeroPercentagePayable = async (
  existingSaleData,
  commissionRecord,
  PayoutRecord,
  data
) => {
  const grossFCI = existingSaleData.grossFCI || 0;
  existingSaleData.percentagePayable = parseFloat(
    data.percentagePayable
  );
  existingSaleData.FCIRecognition = calculateFCIRecognition(
    grossFCI,
    data.percentagePayable
  );
  existingSaleData.payable = calculatePayable(grossFCI, data.percentagePayable);
  const splitPercentage = 100 - data?.percentagePayable;
  commissionRecord.splitPercentage = splitPercentage;
  PayoutRecord.advisorSplitPercentage = splitPercentage;
  const newSplitAmount = calculateSplitAmount(grossFCI, splitPercentage);
  console.log('PayoutRecord', commissionRecord?.splitAmount, newSplitAmount);
  commissionRecord.splitAmount = newSplitAmount;
  PayoutRecord.advisorSplitAmount = newSplitAmount;
  commissionRecord.FCIRecognition = calculateFCIRecognition(
    grossFCI,
    data.percentagePayable
  );
  PayoutRecord.FCIRecognition = calculateFCIRecognition(
    grossFCI,
    data.percentagePayable
  );
  await PayoutRecord.save();
  await commissionRecord.save();
};
const handleNonZeroGrossFCI = async (
  existingSaleData,
  commissionRecord,
  PayoutRecord,
  data
) => {
  const grossFCI = data.grossFCI || 0;
  existingSaleData.FCIRecognition = calculateFCIRecognition(
    grossFCI,
    existingSaleData.percentagePayable
  );
  existingSaleData.payable = calculatePayable(
    grossFCI,
    existingSaleData.percentagePayable
  );
  const splitPercentage = 100 - existingSaleData?.percentagePayable;
  commissionRecord.splitPercentage = splitPercentage;
  PayoutRecord.advisorSplitPercentage = splitPercentage;
  const newSplitAmount = calculateSplitAmount(grossFCI, splitPercentage);
  commissionRecord.splitAmount = newSplitAmount;
  PayoutRecord.advisorSplitAmount = newSplitAmount;
  PayoutRecord.FCIRecognition = calculateFCIRecognition(
    grossFCI,
    existingSaleData.percentagePayable
  );
  commissionRecord.grossFCI = grossFCI;
  PayoutRecord.grossFCI = grossFCI;
  commissionRecord.FCIRecognition = calculateFCIRecognition(
    grossFCI,
    existingSaleData.percentagePayable
  );
  await existingSaleData.save();
  await PayoutRecord.save();
  await commissionRecord.save();
};

const calculateFCIRecognition = (grossFCI, percentagePayable) => {
  return Math.round(((grossFCI * percentagePayable) / 100) * 100) / 100;
};

const calculatePayable = (grossFCI, percentagePayable) => {
  return Math.round(((grossFCI * percentagePayable) / 100) * 100) / 100;
};

const calculateSplitAmount = (grossFCI, splitPercentage) => {
  return Math.round(((grossFCI * splitPercentage) / 100) * 100) / 100;
};

const updateSaleDataFields = (existingSaleData, data) => {
  Object.keys(data).forEach(key => {
    if (key !== 'percentagePayable') {
      existingSaleData[key] = data[key];
    }
  });
};

const saveSaleData = async existingSaleData => {
  return await existingSaleData.save();
};
module.exports = {
  handleZeroPercentagePayable,
  saveSaleData,
  updateSaleDataFields,
  handlePercentagePayableUpdate,
  findSaleDataById,
  calculateFCIRecognition,
  calculatePayable,
  calculateSplitAmount,
};
