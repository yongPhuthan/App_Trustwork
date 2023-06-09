export type Contract = {
  id: string;
  signAddress: string;
  signDate: string;
  signDateStamp: number;
  quotation: Quotation[];
  servayDate: string;
  servayDateStamp: number;
  quotationPageQty: number;
  workCheckDay: number;
  workCheckEnd: number;
  warantyTimeWork: number;
  workAfterGetDeposit: number;
  prepareDay: number;
  installingDay: number;
  finishedDay: number;
  adjustPerDay: number;
  warantyYear: number;
  deposit: number;
  offerContract: SelectedContractData[];
  offerCheck: string[];
  projectName: string;
  companyUser: CompanyUser | null;
  sellerId: string;
};

export type Quotation = {
  id: string;
  services: Service[];
  vat7: number;
  taxName: string;
  taxValue: number;
  summary: number;
  projectName: string;
  summaryAfterDiscount: number;
  discountName: string;
  discountValue: number;
  allTotal: number;
  dateOffer: string;
  dateEnd: string;
  docNumber: string;
  FCMToken: string;
  sellerSignature: string;
  customerSignature: string;
  customerDateSign: string;
  status: string;
  emailCustomerApproved: string;
  customerPosition: string;
  customerNameSign: string;
  dateApproved: string;
  skillWarantyYear: number;
  productWarantyYear: number;
  companyUser: CompanyUser | null;
  sellerId: string;
  customer: Customer | null;
  customerId: string | null;
  contract: Contract | null;
  contractId: string | null;
  walletTransaction: WalletTransaction | null;
  walletTransactionId: string | null;
  periodPercent: any[]; // You can replace 'any' with a more specific type based on your requirements
  periodTHB: any[]; // You can replace 'any' with a more specific type based on your requirements
  created: Date;
  updated: Date;
};

export type Service = {
  id: string;
  title: string;
  description: string;
  unitPrice: number;
  qty: number;
  unit: string;
  total: number;
  quotations: Quotation | null;
  quotationId: string | null;
  company: CompanyUser | null;
  companyId: string | null;
  audits: SelectedAuditData[];
};

export type SelectedContractData = {
  contract: Contract | null;
  contractId: string;
  ContractData: ContractData;
  ContractDataId: number;
};

export type SelectedAuditData = {
  service: Service | null;
  serviceId: string;
  AuditData: AuditData;
  AuditDataId: number;
};

export type CompanyUser = {
  id: string;
  bizName: string;
  userName: string;
  userLastName: string;
  address: string;
  officeTel: string;
  mobileTel: string;
  userPosition: string;
  bizType: string;
  logo: string;
  signature: string;
  companyNumber: string;
  user: User | null;
  userEmail: string | null;
  wallet: Wallet;
  walletId: string;
  rules: string[];
  quotation: Quotation[];
  bankaccount: any; // You can replace 'any' with a more specific type based on your requirements
  customers: Customer[];
  services: Service[];
  contracts: Contract[];
};

export type Customer = {
  id: string;
  name: string;
  address: string;
  mobilePhone: string;
  officePhone: string;
  companyId: String;
  quotation: Quotation[];
  customerType: string;
};

export type WalletTransaction = {
  id: string;
  amount: number;
  status: string;
  user: User | null;
  wallet: Wallet | null;
};

export type User = {
  id: string;
  email: string;
  name: string;
  image: string;
};

export type Wallet = {
  id: string;
  balance: number;
  user: User | null;
  transactions: WalletTransaction[];
};

export type ContractData = {
  id: number;
  image: string;
  name: string;
};

export type AuditData = {
  id: number;
  number: string;
  image: string;
  title: string;
  content: string;
  createdAt: Date;
  auditShowTitle: string;
};
export type PeriodPercent = {
  amount: number;
  details: string;
  percentage: number;
  installment: number;
};
export type PeriodPercentType = {
  amount: number;
  details: string;
  installment: number;
  percentage: number;
};
