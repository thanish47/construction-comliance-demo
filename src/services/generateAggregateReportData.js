import contractsData from '../data/contracts.json';
import projectsData from '../data/projects.json';
import reportTemplate from '../data/ProjectExecutiveSummaryExtendedAggregate.json';

const summaryTemplate = reportTemplate.summary;
const subcontractorTemplate = reportTemplate.subcontractors;
const SUBCONTRACTOR_MIN_ROWS = 20;

const toNumber = (value, fallback = 0) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
};

const randomCurrency = (base, variance = 0.25, minimum = 0) => {
  const baseValue = toNumber(base, minimum || toNumber(summaryTemplate.originalContractAmount));
  const delta = baseValue * variance;
  const value = baseValue + (Math.random() * 2 - 1) * delta;
  return Number(Math.max(minimum, value).toFixed(2));
};

const randomPercent = (base, variance = 0.25) => {
  const baseValue = toNumber(base, 5);
  const delta = baseValue * variance || 5;
  const value = baseValue + (Math.random() * 2 - 1) * delta;
  return Number(Math.min(100, Math.max(0, value)).toFixed(1));
};

const buildContractScope = (contract, index) => {
  if (contract) {
    const name = contract.ContractName?.trim() || summaryTemplate.contractScope;
    return `${contract.ContractNumber || `Contract ${index + 1}`} — ${name}`;
  }
  return `${summaryTemplate.contractScope} #${index + 1}`;
};

const buildProjectScope = (contract, project, index) => {
  if (project) {
    return `${project.ProjectNumber || `PR-${index + 1}`} — ${project.ProjectName || summaryTemplate.projectScope}`;
  }
  if (contract?.ProjectNumber || contract?.ProjectName) {
    return `${contract.ProjectNumber || `PR-${index + 1}`} — ${contract.ProjectName || summaryTemplate.projectScope}`;
  }
  return `${summaryTemplate.projectScope} #${index + 1}`;
};

const buildContractorInfo = (contract) => {
  const parts = [];
  if (contract?.PrimeContractorName) {
    parts.push(contract.PrimeContractorName.trim());
  }
  if (contract?.City) {
    parts.push(contract.City);
  }
  if (contract?.State) {
    parts.push(contract.State);
  }
  if (parts.length === 0) {
    return summaryTemplate.contractor;
  }
  return `${parts.join(', ')}`;
};

const generateSubcontractorsForContract = (contract, summaryRowId) => {
  const rows = [];
  const templateLength = subcontractorTemplate.length || 1;
  const requiredRows = Math.max(SUBCONTRACTOR_MIN_ROWS, templateLength);

  for (let index = 0; index < requiredRows; index += 1) {
    const templateRow = subcontractorTemplate[index % templateLength];
    const [name, ...locationParts] = (templateRow.subContractor || 'Supplier, Ward 00, Cook, IL').split(',');
    const location = locationParts.join(',') || 'Ward 01, Cook, IL';
    const suffix = contract?.ContractNumber ? ` (${contract.ContractNumber}-${index + 1})` : ` (#${index + 1})`;

    const buildCurrencyField = (fieldName, variance = 0.3) =>
      randomCurrency(templateRow[fieldName], variance, 0);
    const buildPercentField = (fieldName, variance = 0.4) =>
      randomPercent(templateRow[fieldName], variance);

    rows.push({
      id: `${summaryRowId}-sub-${index + 1}`,
      subContractor: `${name.trim()}${suffix},${location}`.replace(/,+/g, ',').replace(/,\s*$/, ''),
      certificationAgency: templateRow.certificationAgency || 'City of Chicago',
      lbeAdjusted: buildCurrencyField('lbeAdjusted'),
      lbeAdjustedPercent: buildPercentField('lbeAdjustedPercent'),
      mbeAdjusted: buildCurrencyField('mbeAdjusted'),
      mbeAdjustedPercent: buildPercentField('mbeAdjustedPercent'),
      wbeAdjusted: buildCurrencyField('wbeAdjusted'),
      wbeAdjustedPercent: buildPercentField('wbeAdjustedPercent'),
      sbeAdjusted: buildCurrencyField('sbeAdjusted'),
      sbeAdjustedPercent: buildPercentField('sbeAdjustedPercent'),
      vbeAdjusted: buildCurrencyField('vbeAdjusted'),
      vbeAdjustedPercent: buildPercentField('vbeAdjustedPercent'),
      lbePaidToDate: buildCurrencyField('lbePaidToDate'),
      lbePaidToDatePercent: buildPercentField('lbePaidToDatePercent'),
      mbePaidToDate: buildCurrencyField('mbePaidToDate'),
      mbePaidToDatePercent: buildPercentField('mbePaidToDatePercent'),
      wbePaidToDate: buildCurrencyField('wbePaidToDate'),
      wbePaidToDatePercent: buildPercentField('wbePaidToDatePercent'),
      sbePaidToDate: buildCurrencyField('sbePaidToDate'),
      sbePaidToDatePercent: buildPercentField('sbePaidToDatePercent'),
      vbePaidToDate: buildCurrencyField('vbePaidToDate'),
      vbePaidToDatePercent: buildPercentField('vbePaidToDatePercent')
    });
  }

  return rows;
};

const buildSummaryRow = (contract, project, index) => {
  const summaryRowId = `summary-${index + 1}`;
  const originalContractAmount = randomCurrency(
    contract?.BaseContractAmount ?? summaryTemplate.originalContractAmount,
    0.2,
    50000
  );
  const changeOrders = randomCurrency(
    summaryTemplate.changeOrders || contract?.AdjustedContractAmount || originalContractAmount * 0.2,
    0.35,
    0
  );
  const adjustedContractAmount = Math.max(
    originalContractAmount + changeOrders,
    randomCurrency(contract?.AdjustedContractAmount ?? summaryTemplate.adjustedContractAmount, 0.2, originalContractAmount)
  );
  const paidToDateAmount = Math.min(
    adjustedContractAmount,
    randomCurrency(contract?.PaidToDateAmount ?? summaryTemplate.paidToDateAmount, 0.25, 10000)
  );
  const paidToDatePercent = Number(
    Math.min(100, (paidToDateAmount / adjustedContractAmount) * 100).toFixed(1)
  );

  return {
    id: summaryRowId,
    contractScope: buildContractScope(contract, index),
    projectScope: buildProjectScope(contract, project, index),
    contractor: buildContractorInfo(contract),
    originalContractAmount,
    changeOrders,
    adjustedContractAmount,
    paidToDateAmount,
    paidToDatePercent,
    subcontractors: generateSubcontractorsForContract(contract, summaryRowId)
  };
};

export const generateAggregateReportData = ({
  selectedProjectNumbers = [],
  selectedContractNumbers = []
}) => {
  const normalizedContractNumbers = selectedContractNumbers.length
    ? Array.from(new Set(selectedContractNumbers.map((value) => String(value))))
    : [];

  const summaryRows = normalizedContractNumbers.map((contractNumber, index) => {
    const contract = contractsData.find(
      (item) => String(item.ContractNumber) === contractNumber
    );
    const project =
      projectsData.find(
        (item) => String(item.ProjectNumber) === String(contract?.ProjectNumber)
      ) ||
      projectsData.find(
        (item) => selectedProjectNumbers.includes(String(item.ProjectNumber))
      );

    return buildSummaryRow(contract, project, index);
  });

  const mergedRows = summaryRows.flatMap((row) => {
    const { subcontractors, ...summaryFields } = row;

    const summaryEntry = {
      ...summaryFields,
      rowType: 'summary',
      parentSummaryId: row.id
    };

    const subcontractorEntries = subcontractors.map((subRow) => ({
      ...subRow,
      projectScope: summaryFields.projectScope,
      contractScope: summaryFields.contractScope,
      parentSummaryId: row.id,
      rowType: 'subcontractor'
    }));

    return [summaryEntry, ...subcontractorEntries];
  });

  return mergedRows;
};
