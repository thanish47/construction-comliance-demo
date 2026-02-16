// Script to generate sample 1000 projects for the Contruction Compliance demo application

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const projectTypes = [
  'HVAC', 'Infrastructure Upgrade', 'Park Renovation', 'Water Treatment Facility',
  'Library Modernization', 'Emergency Response Center', 'Technology Upgrade',
  'Health Center Construction', 'Housing Initiative', 'Bridge Repair',
  'Street Paving', 'Sewer System Upgrade', 'Community Center',
  'Fire Station Construction', 'Police Station Renovation', 'School Building',
  'Public Transit Expansion', 'Bike Lane Installation', 'Sidewalk Improvement',
  'Storm Drain System', 'Traffic Signal Upgrade', 'Parking Garage',
  'Recreation Facility', 'Cultural Center', 'Museum Expansion',
  'Convention Center', 'Sports Complex', 'Aquatic Center',
  'Senior Center', 'Youth Center', 'Animal Shelter',
  'Environmental Cleanup', 'Green Space Development', 'Urban Renewal'
];

const projectTypeDescriptions = [
  'General', 'Infrastructure', 'Public Works', 'Construction',
  'Renovation', 'Modernization', 'Technology', 'Environmental'
];

const contractorRegulationTypes = [
  'DBE', 'MBE', 'WBE', 'SBE', 'SDVOB', 'General'
];

const fundingAgencies = [
  'Federal Highway Administration',
  'HUD',
  'EPA',
  'Department of Energy',
  'State Transportation Fund',
  'Municipal Bond',
  'Private Investment',
  null
];

const createdByUsers = [
  'Dannielle Thomas', 'Ryan Diliberto', 'Sarah Johnson', 'Michael Chen',
  'Emily Rodriguez', 'David Park', 'Lisa Thompson', 'James Wilson'
];

const locations = [
  'Block Stadium Phase 5', 'Downtown', 'North District', 'South Side', 'East End',
  'West Hills', 'Central', 'Riverside', 'Lakefront', 'Uptown', 'Midtown',
  'Harbor District', 'Industrial Zone', 'Historic District', 'Business Park',
  'University Area', 'Airport District', 'Suburban Area', 'Rural Area'
];

const cities = [
  { name: 'East Chicago', state: 'IN', zipStart: 46312 },
  { name: 'Hammond', state: 'IN', zipStart: 46320 },
  { name: 'Gary', state: 'IN', zipStart: 46401 },
  { name: 'Indianapolis', state: 'IN', zipStart: 46201 },
  { name: 'Fort Wayne', state: 'IN', zipStart: 46801 },
  { name: 'South Bend', state: 'IN', zipStart: 46601 },
  { name: 'Evansville', state: 'IN', zipStart: 47701 },
  { name: 'Bloomington', state: 'IN', zipStart: 47401 },
  { name: 'Muncie', state: 'IN', zipStart: 47302 },
  { name: 'Lafayette', state: 'IN', zipStart: 47901 }
];

const agencies = [
  'Planning and Economic Business Development',
  'Department of Transportation',
  'Parks and Recreation',
  'Public Works',
  'Cultural Affairs',
  'Public Safety',
  'Education Department',
  'Health Services',
  'Housing Authority',
  'Environmental Services',
  'Planning and Development',
  'Water and Sewer',
  'Public Utilities',
  'Emergency Management',
  'Community Development',
  'Economic Development'
];

const officers = [
  'CarlRidle',
  'SarahJohnson',
  'MichaelChen',
  'EmilyRodriguez',
  'DavidPark',
  'LisaThompson',
  'JamesWilson',
  'MariaGarcia',
  'RobertLee',
  'JenniferMartinez',
  'WilliamBrown',
  'AmandaDavis',
  'ChristopherTaylor',
  'JessicaAnderson',
  'DanielThomas',
  'MichelleWhite'
];

const statusMapping = [
  { id: 1, description: 'Planning' },
  { id: 2, description: 'Active' },
  { id: 3, description: 'Completed' },
  { id: 4, description: 'On Hold' }
];

const streetNames = [
  'E. 144th St.', 'Main St.', 'Oak Ave.', 'Park Blvd.', 'Washington St.',
  'Lincoln Ave.', 'Jefferson Rd.', 'Madison Dr.', 'Adams Pkwy.', 'Monroe St.',
  'Jackson Ave.', 'Harrison Blvd.', 'Tyler Rd.', 'Roosevelt Dr.', 'Kennedy St.',
  'Johnson Ave.', 'Wilson Rd.', 'Taylor Blvd.', 'Brown St.', 'Davis Ave.'
];

function generateUUID() {
  return crypto.randomUUID();
}

function generateStreetAddress() {
  const streetNumber = Math.floor(Math.random() * 9000) + 1000;
  const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
  return `${streetNumber} ${streetName}`;
}

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function formatDateTime(date) {
  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

function generateProjects(count) {
  const projects = [];
  const startId = 1141;

  for (let i = 0; i < count; i++) {
    const projectNumber = String(11321 + i);
    const location = locations[Math.floor(Math.random() * locations.length)];
    const projectType = projectTypes[Math.floor(Math.random() * projectTypes.length)];
    const projectName = ` ${location} ${projectType}`;

    const city = cities[Math.floor(Math.random() * cities.length)];
    const clientName = `City of ${city.name}, ${agencies[Math.floor(Math.random() * agencies.length)]}`;
    const primaryAgencyName = `City of ${city.name}`;

    const complianceOfficerUsername = officers[Math.floor(Math.random() * officers.length)];
    const status = statusMapping[Math.floor(Math.random() * statusMapping.length)];

    const baseCost = Math.floor(Math.random() * 5000000) + 50000; // Between $50k and $5M
    const projectTypeId = Math.floor(Math.random() * 10) + 1;
    const clientId = Math.floor(Math.random() * 200) + 1;
    const primaryAgencyId = Math.floor(Math.random() * 50) + 1;
    const activeContractsExist = Math.random() > 0.3; // 70% have active contracts

    const projectTypeDescription = projectTypeDescriptions[Math.floor(Math.random() * projectTypeDescriptions.length)];
    const contractorRegulationType = Math.random() > 0.3 ? contractorRegulationTypes[Math.floor(Math.random() * contractorRegulationTypes.length)] : null;
    const fundingAgency = fundingAgencies[Math.floor(Math.random() * fundingAgencies.length)];
    const otherPrimaryAgency = Math.random() > 0.7 ? `City of ${cities[Math.floor(Math.random() * cities.length)].name}` : null;
    const otherFundingAgency = Math.random() > 0.8 ? fundingAgencies[Math.floor(Math.random() * fundingAgencies.length)] : null;

    const createdBy = createdByUsers[Math.floor(Math.random() * createdByUsers.length)];
    const modifiedBy = createdByUsers[Math.floor(Math.random() * createdByUsers.length)];

    const createdDate = generateRandomDate(new Date(2020, 0, 1), new Date(2023, 0, 1));
    const modifiedDate = generateRandomDate(createdDate, new Date());

    const localeLookupUrl = Math.random() > 0.5 ? `https://maps.example.com/locale/${projectNumber}` : null;

    projects.push({
      MasterProjectId: startId + i,
      ProjectName: projectName,
      ProjectNumber: projectNumber,
      ClientId: clientId,
      ClientName: clientName,
      ComplianceOfficerId: null,
      ComplianceOfficer: null,
      ComplianceOfficerIdGptsUsers: generateUUID(),
      ComplianceOfficerGptsUsers: complianceOfficerUsername,
      ComplianceOfficerDisplay: complianceOfficerUsername,
      ProjectStatusId: status.id,
      ProjectStatusDescription: status.description,
      Delete: false,
      ProjectTypeId: projectTypeId,
      ProjectTypeDescription: projectTypeDescription,
      ProjectRegulationTypeId: null,
      ProjectTypes: null,
      ProjectRegulationTypes: null,
      Clients: null,
      States: null,
      ActiveContractsExist: activeContractsExist,
      PrimaryAgencyId: primaryAgencyId,
      PrimaryAgencyName: primaryAgencyName,
      OtherPrimaryAgency: otherPrimaryAgency,
      FundingAgency: fundingAgency,
      OtherFundingAgency: otherFundingAgency,
      ContractorRegulationType: contractorRegulationType,
      LocaleLookupUrl: localeLookupUrl,
      Address1: generateStreetAddress(),
      City: city.name,
      State: city.state,
      PostalCode: String(city.zipStart + Math.floor(Math.random() * 50)),
      ProjectBaseCost: baseCost,
      ProjectBaseCostDisplay: `${baseCost.toFixed(4)}`,
      CreatedBy: createdBy,
      CreatedDate: formatDateTime(createdDate),
      ModifiedBy: modifiedBy,
      ModifiedDate: formatDateTime(modifiedDate)
    });
  }

  return projects;
}

// Generate 1000 projects
const projects = generateProjects(1000);

// Write to JSON file
const outputPath = path.join(__dirname, 'projects.json');
fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2));

console.log(`Successfully generated ${projects.length} projects and saved to ${outputPath}`);
