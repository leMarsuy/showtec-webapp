export interface AccountTitle {
  name: string;
  category: string;
}

export const ACCOUNT_TITLES: Array<AccountTitle> = [
  { name: 'Rent', category: 'Housing Expenses' },
  { name: 'Mortgage Payments', category: 'Housing Expenses' },
  { name: 'Property Taxes', category: 'Housing Expenses' },
  { name: 'Home Insurance', category: 'Housing Expenses' },
  {
    name: 'Utilities (Electricity, Gas, Water)',
    category: 'Housing Expenses',
  },

  { name: 'Fuel', category: 'Transportation Expenses' },
  {
    name: 'Vehicle Maintenance',
    category: 'Transportation Expenses',
  },
  {
    name: 'Car Loan Payments',
    category: 'Transportation Expenses',
  },
  {
    name: 'Public Transportation Costs',
    category: 'Transportation Expenses',
  },
  { name: 'Parking Fees', category: 'Transportation Expenses' },

  { name: 'Groceries', category: 'Food and Groceries' },
  { name: 'Dining Out', category: 'Food and Groceries' },
  {
    name: 'Snacks and Beverages',
    category: 'Food and Groceries',
  },

  {
    name: 'Health Insurance Premiums',
    category: 'Health and Medical Expenses',
  },
  {
    name: 'Doctor Visits',
    category: 'Health and Medical Expenses',
  },
  {
    name: 'Prescription Medications',
    category: 'Health and Medical Expenses',
  },
  {
    name: 'Dental Care',
    category: 'Health and Medical Expenses',
  },
  {
    name: 'Vision Care',
    category: 'Health and Medical Expenses',
  },

  {
    name: 'Movies, Concerts, and Events',
    category: 'Entertainment and Recreation',
  },
  {
    name: 'Subscriptions (Streaming, Magazines)',
    category: 'Entertainment and Recreation',
  },
  { name: 'Hobbies', category: 'Entertainment and Recreation' },
  {
    name: 'Vacations and Travel',
    category: 'Entertainment and Recreation',
  },

  { name: 'Tuition Fees', category: 'Education and Learning' },
  {
    name: 'Books and Supplies',
    category: 'Education and Learning',
  },
  { name: 'Online Courses', category: 'Education and Learning' },
  {
    name: 'Seminars or Workshops',
    category: 'Education and Learning',
  },

  { name: 'Health Insurance', category: 'Insurance' },
  { name: 'Life Insurance', category: 'Insurance' },
  { name: 'Vehicle Insurance', category: 'Insurance' },

  { name: 'Credit Card Payments', category: 'Debt Payments' },
  { name: 'Personal Loans', category: 'Debt Payments' },
  { name: 'Student Loan Payments', category: 'Debt Payments' },

  {
    name: 'Clothing Purchases',
    category: 'Clothing and Personal Care',
  },
  {
    name: 'Laundry and Dry Cleaning',
    category: 'Clothing and Personal Care',
  },
  {
    name: 'Haircuts and Grooming',
    category: 'Clothing and Personal Care',
  },
  {
    name: 'Skincare Products',
    category: 'Clothing and Personal Care',
  },

  {
    name: 'Donations to Charities',
    category: 'Charitable Contributions',
  },
  {
    name: 'Church Tithes',
    category: 'Charitable Contributions',
  },

  { name: 'Gifts', category: 'Miscellaneous' },
  { name: 'Pet Care', category: 'Miscellaneous' },
  { name: 'Household Supplies', category: 'Miscellaneous' },

  {
    name: 'Rent (for office space, warehouses, etc.)',
    category: 'Operating Expenses',
  },
  {
    name: 'Utilities (electricity, water, internet)',
    category: 'Operating Expenses',
  },
  {
    name: 'Office Supplies (stationery, printing, etc.)',
    category: 'Operating Expenses',
  },
  {
    name: 'Telephone and Internet Expenses',
    category: 'Operating Expenses',
  },
  {
    name: 'Maintenance and Repairs (building, equipment)',
    category: 'Operating Expenses',
  },
  {
    name: 'Insurance (business insurance, property insurance)',
    category: 'Operating Expenses',
  },

  {
    name: 'Salaries and Wages',
    category: 'Employee-Related Expenses',
  },
  {
    name: 'Employee Benefits (health insurance, retirement contributions)',
    category: 'Employee-Related Expenses',
  },
  {
    name: 'Payroll Taxes',
    category: 'Employee-Related Expenses',
  },
  {
    name: 'Training and Development (seminars, workshops)',
    category: 'Employee-Related Expenses',
  },
  {
    name: 'Employee Travel and Lodging',
    category: 'Employee-Related Expenses',
  },
  {
    name: 'Employee Meals',
    category: 'Employee-Related Expenses',
  },

  {
    name: 'Advertising Expenses (digital, print, TV ads)',
    category: 'Marketing and Advertising',
  },
  {
    name: 'Promotional Expenses (events, giveaways, sponsorships)',
    category: 'Marketing and Advertising',
  },
  {
    name: 'Social Media and Online Marketing (SEO, Google Ads, social media ads)',
    category: 'Marketing and Advertising',
  },
  {
    name: 'Website Maintenance',
    category: 'Marketing and Advertising',
  },
  {
    name: 'Public Relations Costs',
    category: 'Marketing and Advertising',
  },

  { name: 'Legal Fees', category: 'Professional Services' },
  { name: 'Consulting Fees', category: 'Professional Services' },
  {
    name: 'Accounting and Bookkeeping Services',
    category: 'Professional Services',
  },
  {
    name: 'Tax Preparation Fees',
    category: 'Professional Services',
  },
  { name: 'Audit Fees', category: 'Professional Services' },

  {
    name: 'Software Subscriptions (SaaS tools, CRM, ERP systems)',
    category: 'Technology and Software',
  },
  {
    name: 'Cloud Services (Amazon Web Services, Microsoft Azure)',
    category: 'Technology and Software',
  },
  {
    name: 'IT Support and Maintenance',
    category: 'Technology and Software',
  },
  {
    name: 'Licensing Fees (software licenses)',
    category: 'Technology and Software',
  },

  {
    name: 'Raw Materials',
    category: 'Cost of Goods Sold (COGS)',
  },
  {
    name: 'Direct Labor Costs',
    category: 'Cost of Goods Sold (COGS)',
  },
  {
    name: 'Manufacturing Supplies',
    category: 'Cost of Goods Sold (COGS)',
  },
  {
    name: 'Freight and Shipping',
    category: 'Cost of Goods Sold (COGS)',
  },
  {
    name: 'Packaging Costs',
    category: 'Cost of Goods Sold (COGS)',
  },

  {
    name: 'Depreciation Expense (for equipment, vehicles, buildings)',
    category: 'Depreciation and Amortization',
  },
  {
    name: 'Amortization Expense (for intangible assets like patents)',
    category: 'Depreciation and Amortization',
  },

  {
    name: 'Interest on Loans',
    category: 'Interest and Financing Expenses',
  },
  {
    name: 'Bank Fees',
    category: 'Interest and Financing Expenses',
  },
  {
    name: 'Credit Card Processing Fees',
    category: 'Interest and Financing Expenses',
  },
  {
    name: 'Loan Origination Fees',
    category: 'Interest and Financing Expenses',
  },

  { name: 'Income Taxes', category: 'Taxes' },
  { name: 'Sales Taxes', category: 'Taxes' },
  { name: 'Property Taxes', category: 'Taxes' },
  { name: 'Payroll Taxes', category: 'Taxes' },

  {
    name: 'Business Travel (airfare, lodging)',
    category: 'Travel and Entertainment',
  },
  {
    name: 'Business Meals',
    category: 'Travel and Entertainment',
  },
  {
    name: 'Conferences and Events',
    category: 'Travel and Entertainment',
  },
  {
    name: 'Client Entertainment',
    category: 'Travel and Entertainment',
  },

  {
    name: 'Product Development Costs',
    category: 'Research and Development (R&D)',
  },
  {
    name: 'Testing and Prototyping',
    category: 'Research and Development (R&D)',
  },
  {
    name: 'Innovation and Research Costs',
    category: 'Research and Development (R&D)',
  },

  {
    name: 'Charitable Contributions',
    category: 'Miscellaneous Expenses',
  },
  { name: 'Donations', category: 'Miscellaneous Expenses' },
  {
    name: 'Licensing and Permits',
    category: 'Miscellaneous Expenses',
  },
  {
    name: 'Fines and Penalties',
    category: 'Miscellaneous Expenses',
  },
  {
    name: 'Office Furniture and Equipment',
    category: 'Miscellaneous Expenses',
  },
];
