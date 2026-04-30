"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, FormEvent, ReactNode } from "react";

type Tone = "cyan" | "rose" | "amber" | "emerald" | "indigo" | "gray";

type SidebarGroup = {
  title: string;
  items: string[];
};

type KPI = {
  label: string;
  value: string;
  caption: string;
  tone: Exclude<Tone, "indigo" | "gray">;
};

type TeamUser = {
  id: string;
  name: string;
  role: string;
  activeTasks: number;
  overdueTasks: number;
  revenueAtRisk: string;
  sourceFocus: string;
  nextAction: string;
  recoveredThisMonth: string;
  tone: Tone;
};

type RecoveryThreadMessage = {
  id: string;
  author: string;
  role:
    | "Owner"
    | "Automation"
    | "Operations"
    | "Support"
    | "Recovery Lead"
    | "Order Recovery"
    | "Beauty Specialist"
    | "Post-Purchase"
    | "System";
  message: string;
  time: string;
  outcome?: string;
};

type RecoveryCategory =
  | "Payment Recovery"
  | "Inquiry Follow-up"
  | "Refill/Restock"
  | "Post-Purchase"
  | "Order Risk";

type LeakType =
  | "Inquiry leak"
  | "Follow-up leak"
  | "Payment pending leak"
  | "Repeat purchase leak"
  | "Post-purchase leak"
  | "Reporting leak";

type DueStatus = "Overdue" | "Due today" | "Due soon" | "Monitoring";
type Priority = "Critical" | "High" | "Medium" | "Low";

type RecoveryTask = {
  id: string;
  customer: string;
  image?: string;
  brandContext: string;
  productInterest: string;
  leakType: LeakType;
  category: RecoveryCategory;
  estimatedRevenueAtRisk: string;
  source: string;
  assignedOwner: string;
  dueStatus: DueStatus;
  priority: Priority;
  recommendedNextAction: string;
  messageTemplate: string;
  internalRecoveryThread: RecoveryThreadMessage[];
  automationStatus: string;
  sourceStatus: string;
  lastEvent: string;
  lastContact: string;
  attemptCount: number;
  tone: Tone;
};

type Inquiry = {
  id: string;
  customer: string;
  image?: string;
  inquirySource: string;
  timeSinceInquiry: string;
  firstReplyStatus: "Not replied" | "Reply drafted" | "Replied" | "Needs human review";
  productInterest: string;
  intentLevel: "High" | "Medium" | "Low";
  estimatedValue: string;
  owner: string;
  automationStatus: string;
  recommendedAction: string;
  templatePreview: string;
  sourceStatus: string;
  internalNotes: number;
  recoveryCaseCreated?: boolean;
  templateCopied?: boolean;
  lastAction?: string;
  tone: Tone;
};

type ProductDemandSignal = {
  id: string;
  demandName: string;
  industryType: "Fashion / Apparel" | "Beauty / Skincare";
  demandType:
    | "Restock"
    | "Refill"
    | "Size / Fit"
    | "New Drop"
    | "High Value"
    | "Event"
    | "Bundle"
    | "Routine"
    | "Wholesale";
  totalSignals: number;
  highIntentCount: number;
  estimatedDemandValue: string;
  sourceMix: string[];
  openRecoveryActions: number;
  stockStatus: string;
  owner: string;
  recommendedNextAction: string;
  reviewed?: boolean;
  restockQueue?: boolean;
  recoveryTasksCreated?: boolean;
  lastAction?: string;
  tone: Tone;
};

type SourceLeakRecord = {
  id: string;
  sourceName: string;
  totalCaptured: number;
  highIntentInquiries: number;
  unassignedRecords: number;
  firstRepliesMissing: number;
  overdueFollowUps: number;
  paymentPendingValue: string;
  recoveredValue: string;
  syncIssues: number;
  sourceQualityScore: number;
  sourceQuality: string;
  recommendedFix: string;
  reviewed?: boolean;
  ownersAssigned?: boolean;
  followUpTasksCreated?: boolean;
  relatedCasesOpened?: boolean;
  lastAction?: string;
  tone: Tone;
};

type BuyerLifecycleStatus =
  | "VIP"
  | "Active"
  | "At Risk"
  | "Inactive"
  | "Refill Ready"
  | "Restock Waiting"
  | "Post-Purchase"
  | "High Intent";

type BuyerProfileRecord = {
  id: string;
  buyerName: string;
  image?: string;
  email: string;
  phone: string;
  source: string;
  lifecycleStatus: BuyerLifecycleStatus;
  favoriteCategory: string;
  totalSpend: string;
  purchaseCount: number;
  lastPurchase: string;
  lastContact: string;
  nextFollowUp: string;
  owner: string;
  openRecoveryCases: number;
  revenueAtRisk: string;
  tags: BuyerLifecycleStatus[];
  productPreferences: string;
  purchaseHistorySummary: string;
  refillRestockStatus: string;
  postPurchaseStatus: string;
  internalNotes: string;
  recommendedNextAction: string;
  messageTemplatePreview: string;
  tone: Tone;
};

type RevenueSegmentRecord = {
  id: string;
  segmentName: string;
  segmentType:
    | "VIP"
    | "Refill Due"
    | "Restock Waiting"
    | "Inactive Buyers"
    | "Payment Pending"
    | "Post-Purchase"
    | "High Intent"
    | "Event / Pop-up"
    | "UGC / Referral"
    | "Price-Sensitive"
    | "Out-of-Stock"
    | "Bridal";
  buyerCount: number;
  totalRevenueOpportunity: string;
  recoveredValue: string;
  openRecoveryActions: number;
  averageOrderValue: string;
  lastActivity: string;
  owner: string;
  recommendedAction: string;
  tone: Tone;
};

type BuyerValueRecord = {
  id: string;
  buyerName: string;
  image?: string;
  buyerCategory: string;
  lifetimeValue: string;
  yearToDateSpend: string;
  purchaseCount: number;
  averageOrderValue: string;
  lastPurchaseDate: string;
  predictedNextPurchase: string;
  refillRestockOpportunityValue: string;
  revenueAtRisk: string;
  recoveredValue: string;
  returnExchangeRisk: string;
  nextBestAction: string;
  owner: string;
  valueFlags: string[];
  tone: Tone;
};

type RevenueStage =
  | "New Interest Captured"
  | "First Reply Needed"
  | "Qualified Interest"
  | "Follow-up Needed"
  | "Payment Pending"
  | "Order Confirmed"
  | "Delivered / Post-Purchase"
  | "Repeat Opportunity"
  | "Lost / Inactive";

type RevenueOpportunity = {
  id: string;
  buyerName: string;
  image?: string;
  productContext: string;
  industryType: "Fashion / Apparel" | "Beauty / Skincare";
  source: string;
  currentStage: RevenueStage;
  estimatedValue: string;
  revenueAtRisk: string;
  owner: string;
  priority: Priority;
  lastActivity: string;
  nextAction: string;
  dueStatus: DueStatus | "Lost";
  recommendedMessage: string;
  lastAction?: string;
  tone: Tone;
};

type FollowUpType =
  | "First reply"
  | "Second nudge"
  | "Payment reminder"
  | "Refill reminder"
  | "Restock notification"
  | "Review request"
  | "UGC/referral request"
  | "Order issue follow-up"
  | "Reactivation";

type FollowUpRecoveryItem = {
  id: string;
  buyerName: string;
  image?: string;
  productContext: string;
  followUpType: FollowUpType;
  source: string;
  revenueAtRisk: string;
  owner: string;
  dueStatus: DueStatus | "Snoozed";
  lastContact: string;
  attemptCount: number;
  buyerResponseStatus: "No reply yet" | "Replied" | "Follow-up sent" | "No response" | "Monitoring";
  recommendedNextAction: string;
  messageTemplate: string;
  internalRecoveryNote: string;
  templateCopied?: boolean;
  tone: Tone;
};

type PaymentStatus =
  | "Pending"
  | "Overdue"
  | "Reminder sent"
  | "Partial payment"
  | "Failed payment"
  | "COD confirmation needed"
  | "Recovered"
  | "Cancelled / Lost";

type PaymentRecoveryItem = {
  id: string;
  buyerName: string;
  image?: string;
  productContext: string;
  paymentAmount: string;
  recoveredAmount: string;
  paymentStatus: PaymentStatus;
  source: string;
  paymentMethod: string;
  owner: string;
  dueStatus: DueStatus | "Recovered" | "Lost";
  lastReminder: string;
  reminderCount: number;
  riskLevel: Priority;
  recommendedNextAction: string;
  paymentTemplate: string;
  tone: Tone;
};

type RecoveredRevenueItem = {
  id: string;
  buyerName: string;
  image?: string;
  recoveryType:
    | "Payment recovered"
    | "Follow-up converted"
    | "Repeat purchase recovered"
    | "Refill reorder recovered"
    | "Restock purchase recovered"
    | "Reactivated buyer"
    | "Post-purchase upsell"
    | "Referral/UGC influenced sale";
  recoveredAmount: string;
  originalRevenueAtRisk: string;
  source: string;
  owner: string;
  actionThatRecoveredIt: string;
  dateRecovered: string;
  timeToRecovery: string;
  relatedCase: string;
  notes: string;
  leakType: string;
  tone: Tone;
};

type OrderRiskType =
  | "Payment Issue"
  | "Address Issue"
  | "Delivery Delay"
  | "Return / Exchange Risk"
  | "Complaint"
  | "Unassigned"
  | "Needs Ops Review";

type OrderRiskItem = {
  id: string;
  buyerName: string;
  image?: string;
  orderContext: string;
  industryType: "Fashion / Apparel" | "Beauty / Skincare";
  orderValue: string;
  riskType: OrderRiskType;
  paymentStatus: string;
  deliveryStatus: string;
  source: string;
  owner: string;
  priority: Priority;
  lastUpdate: string;
  dueStatus: DueStatus;
  nextRequiredAction: string;
  internalOrderNote: string;
  suggestedMessage: string;
  resolved?: boolean;
  tone: Tone;
};

type DeliveryStage =
  | "Delivered"
  | "Delivery delayed"
  | "Satisfaction check due"
  | "Issue follow-up needed"
  | "Review request ready"
  | "Second purchase prompt"
  | "Refill timing started"
  | "Restock/new drop follow-up"
  | "Completed";

type DeliveryFollowUpItem = {
  id: string;
  buyerName: string;
  image?: string;
  orderContext: string;
  deliveryStatus: string;
  deliveryTiming: string;
  orderValue: string;
  owner: string;
  source: string;
  postDeliveryStage: DeliveryStage;
  opportunityType: string;
  nextAction: string;
  messageTemplate: string;
  notes: string;
  tone: Tone;
};

type PostPurchaseOpportunity = {
  id: string;
  buyerName: string;
  image?: string;
  orderContext: string;
  opportunityType:
    | "Review request"
    | "Referral request"
    | "UGC request"
    | "Creator-style content ask"
    | "Before/after skincare feedback"
    | "Try-on/photo request"
    | "Styling testimonial"
    | "Second-purchase prompt"
    | "VIP referral prompt";
  orderValue: string;
  buyerStatus: string;
  deliveryDate: string;
  source: string;
  owner: string;
  requestStatus: "Not sent" | "Sent" | "Needs follow-up" | "Completed";
  potentialValue: string;
  recommendedNextAction: string;
  messageTemplate: string;
  industryType: "Fashion / Apparel" | "Beauty / Skincare";
  tone: Tone;
};

type ProductIndustry = "Fashion / Apparel" | "Beauty / Skincare";

type ProductItem = {
  id: string;
  productName: string;
  productType: string;
  industryType: ProductIndustry;
  category: string;
  productFolder: string;
  skuCount: number;
  priceRange: string;
  stockRestockStatus: string;
  refillCycle: string;
  productTags: string[];
  linkedDemandCount: number;
  openRecoveryValue: string;
  recoveredValue: string;
  recommendedProductAction: string;
  active: boolean;
  tone: Tone;
};

type SKUVariant = {
  id: string;
  sku: string;
  productName: string;
  variant: string;
  size: string;
  colorShade: string;
  category: string;
  price: string;
  stockStatus: string;
  restockStatus: string;
  refillCycle: string;
  productFolder: string;
  tags: string;
  linkedDemand: number;
  recoveryValue: string;
  lastUpdated: string;
  industryType: ProductIndustry;
  fitType: string;
  skinConcern: string;
  routineStep: string;
  bundleEligibility: string;
  sensitiveSkinFlag: string;
  active: boolean;
  tone: Tone;
};

type ProductFolder = {
  id: string;
  folderName: string;
  industryType: ProductIndustry | "Mixed";
  productCount: number;
  recoveryUse: string;
  openRecoveryValue: string;
  owner: string;
  tone: Tone;
};

type ProductCategory = {
  id: string;
  categoryName: string;
  productCount: number;
  mappedDemandSignals: number;
  recoveryUse: string;
  tone: Tone;
};

type ProductTag = {
  id: string;
  tagName: string;
  productCount: number;
  recoveryRuleUse: string;
  tone: Tone;
};

type TagSuggestion = {
  id: string;
  condition: string;
  suggestedTags: string[];
  reason: string;
  recoveryUse: string;
  affectedProducts: number;
  tone: Tone;
};

type ImportPreviewRow = {
  id: string;
  rowLabel: string;
  sku: string;
  productName: string;
  category: string;
  price: string;
  tags: string;
  detectedIssue: string;
  importAction: string;
  tone: Tone;
};

type ExportOption = {
  id: string;
  exportName: string;
  description: string;
  format: "CSV" | "XLSX placeholder" | "JSON placeholder";
  recordCount: number;
  recoveryUse: string;
  tone: Tone;
};

type RefillOpportunity = {
  id: string;
  buyerName: string;
  image?: string;
  productName: string;
  productCategory: string;
  lastPurchaseDate: string;
  refillWindow: string;
  predictedReorderDate: string;
  estimatedRefillValue: string;
  owner: string;
  source: string;
  buyerStatus: string;
  reminderStatus: "Not sent" | "Sent" | "Overdue" | "Snoozed" | "Recovered";
  lastReminder: string;
  nextAction: string;
  messageTemplate: string;
  recoveredValue: string;
  tone: Tone;
};

type RestockWaitlistItem = {
  id: string;
  productName: string;
  skuVariant: string;
  sizeShadeColor: string;
  productCategory: string;
  industryType: "Fashion / Apparel" | "Beauty / Cosmetics";
  buyerCount: number;
  highIntentBuyers: number;
  estimatedDemandValue: string;
  recoveredValue: string;
  restockStatus: string;
  sourceMix: string[];
  owner: string;
  notificationStatus: "Notice not sent" | "Notice due" | "Notice sent" | "Recovered";
  linkedRecoveryCases: number;
  recommendedNextAction: string;
  tone: Tone;
};

type InactiveBuyerRecoveryItem = {
  id: string;
  buyerName: string;
  image?: string;
  originalProductInterest: string;
  lastPurchaseDate: string;
  lastContact: string;
  inactiveReason:
    | "No recent purchase"
    | "Missed refill window"
    | "Out of stock"
    | "Price sensitive"
    | "No reply / ghosted"
    | "Bought elsewhere"
    | "Payment abandoned"
    | "Post-purchase not followed up";
  lifecycleStatus: string;
  estimatedRecoveryValue: string;
  recoveredValue: string;
  owner: string;
  source: string;
  lastAction: string;
  recommendedWinbackAction: string;
  messageTemplate: string;
  recoveryStatus: "Open" | "Reactivated" | "Lost" | "Snoozed";
  tone: Tone;
};

type RecoveryOwnerRole =
  | "Owner / Admin"
  | "Recovery Lead"
  | "Sales"
  | "Support"
  | "Operations"
  | "Marketing"
  | "Beauty Specialist"
  | "Order Recovery"
  | "Post-Purchase"
  | "Unassigned";

type AssignedRecoveryAction = {
  id: string;
  actionTitle: string;
  buyerName: string;
  image?: string;
  productContext: string;
  recoveryType:
    | "First reply"
    | "Follow-up nudge"
    | "Payment reminder"
    | "Refill reminder"
    | "Restock notice"
    | "Order issue resolution"
    | "Review request"
    | "Referral request"
    | "UGC request"
    | "Reactivation / winback"
    | "Source sync review"
    | "Assign missing owner";
  revenueAtRisk: string;
  owner: string;
  roleTeam: RecoveryOwnerRole;
  priority: Priority;
  dueStatus: DueStatus | "Completed" | "Snoozed";
  source: string;
  lastActivity: string;
  nextAction: string;
  messageTemplateStatus: string;
  messageTemplate: string;
  relatedRecoveryCase: string;
  internalNotesPreview: string;
  handoffStatus: string;
  completed?: boolean;
  tone: Tone;
};

type RecoveryThread = {
  id: string;
  threadTitle: string;
  linkedBuyer: string;
  image?: string;
  linkedRecoveryCase: string;
  recoveryType:
    | "Inquiry thread"
    | "Payment recovery thread"
    | "Refill/restock thread"
    | "Order risk thread"
    | "Post-purchase thread"
    | "Source sync issue thread"
    | "Handoff thread";
  revenueAtRisk: string;
  currentOwner: string;
  participants: string[];
  lastMessage: string;
  lastUpdated: string;
  threadStatus: "Open" | "Handoff waiting" | "Unassigned" | "Updated today" | "High risk" | "Closed";
  nextAction: string;
  handoffNote: string;
  messages: RecoveryThreadMessage[];
  tone: Tone;
};

type TeamMemberLoad = {
  id: string;
  memberName: string;
  role: RecoveryOwnerRole;
  activeActions: number;
  overdueActions: number;
  revenueAtRiskOwned: string;
  recoveredValueThisMonth: string;
  averageResponseTime: string;
  focusArea: string;
  bottleneckStatus: string;
  openHandoffs: number;
  nextRecommendedWorkloadAction: string;
  completedActionsThisWeek: number;
  tone: Tone;
};

type AutomationSyncStatus = "Healthy" | "Needs Review" | "Failed" | "Partial";

type AutomationHealthRecord = {
  id: string;
  automationName: string;
  thirdPartySource: string;
  sourceCategory: "Forms" | "Ecommerce" | "WhatsApp" | "Instagram" | "CSV Import" | "Email / SMS" | "Middleware";
  eventType: string;
  syncStatus: AutomationSyncStatus;
  lastRunTime: string;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  failedRecords: number;
  missingFields: number;
  duplicateRecords: number;
  relatedRecoveryCases: number;
  impactOnRecovery: string;
  recommendedFix: string;
  reviewOwner: string;
  tone: Tone;
};

type RevenueLeakReportItem = {
  id: string;
  leakType: string;
  openCases: number;
  revenueAtRisk: string;
  recoveredValue: string;
  lostValue: string;
  recoveryRate: string;
  recommendedFix: string;
  tone: Tone;
};

type SourceLeakReportItem = {
  id: string;
  sourceName: string;
  capturedInquiries: number;
  highIntentLeads: number;
  missingFirstReplies: number;
  overdueFollowUps: number;
  paymentPendingValue: string;
  recoveredValue: string;
  syncIssues: number;
  sourceQualityNote: string;
  tone: Tone;
};

type ProductLeakReportItem = {
  id: string;
  productCategory: string;
  demandValue: string;
  openRecoveryCases: number;
  missedRefillRestockValue: string;
  recoveredValue: string;
  missingDataNote: string;
  recommendedAction: string;
  tone: Tone;
};

type TeamOwnershipReportItem = {
  id: string;
  owner: string;
  openActions: number;
  overdueActions: number;
  revenueAtRiskOwned: string;
  recoveredValue: string;
  bottleneckNote: string;
  recommendedWorkloadAction: string;
  tone: Tone;
};

type MonthlySummaryMetric = {
  id: string;
  label: string;
  value: string;
  note: string;
  tone: Tone;
};

type MonthlyRecommendation = {
  id: string;
  recommendation: string;
  reason: string;
  owner: string;
  priority: Priority;
  impact: string;
  tone: Tone;
};

type BrandSettings = {
  brandName: string;
  industryFocus: string;
  brandType: string;
  primaryMarket: string;
  currency: string;
  timezone: string;
  mainSalesChannels: string[];
  ecommercePlatform: string;
  preferredCommunicationChannels: string[];
  defaultOwnerAdmin: string;
};

type RecoveryModuleSetting = {
  id: string;
  moduleName: string;
  status: "Enabled" | "Disabled";
  purpose: string;
  defaultOwner: string;
  tone: Tone;
};

type RecoveryWindowSetting = {
  id: string;
  settingName: string;
  value: string;
  recoveryUse: string;
  defaultOwner: string;
  tone: Tone;
};

type SourceSetupRecord = {
  id: string;
  sourceName: string;
  sourceStatus: "Configured" | "Needs Review" | "Missing Fields";
  defaultOwner: string;
  recoveryRule: string;
  missingFieldWarning: string;
  tone: Tone;
};

type UserRole =
  | "Owner / Admin"
  | "Recovery Lead"
  | "Sales"
  | "Support"
  | "Operations"
  | "Marketing"
  | "Beauty Specialist"
  | "Order Recovery"
  | "Post-Purchase"
  | "Viewer"
  | "Unassigned";

type SetupTeamUser = {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  status: "Active" | "Inactive" | "System Queue";
  assignedRecoveryAreas: string[];
  activeRecoveryActions: number;
  overdueActions: number;
  revenueAtRiskOwned: string;
  recoveredValueThisMonth: string;
  permissionLevel: string;
  tone: Tone;
};

type PermissionRule = {
  id: string;
  permissionName: string;
  ownerAdmin: boolean;
  recoveryLead: boolean;
  specialist: boolean;
  viewer: boolean;
  recoveryUse: string;
  tone: Tone;
};

type OwnershipRule = {
  id: string;
  trigger: string;
  defaultOwnerRole: string;
  fallbackOwner: string;
  recoveryUse: string;
  tone: Tone;
};

type SetupRecoveryStage = {
  id: string;
  stageName: string;
  purpose: string;
  defaultOwnerRole: string;
  timingRule: string;
  nextRecommendedAction: string;
  linkedTemplates: string[];
  tone: Tone;
};

type BuyerTag = {
  id: string;
  tagName: string;
  recordCount: number;
  recoveryUse: string;
  tone: Tone;
};

type SourceTag = {
  id: string;
  tagName: string;
  recordCount: number;
  recoveryUse: string;
  tone: Tone;
};

type SetupSmartTagSuggestion = {
  id: string;
  condition: string;
  suggestedTags: string[];
  reason: string;
  affectedRecords: number;
  tone: Tone;
};

type MessageTemplate = {
  id: string;
  templateName: string;
  recoveryType: string;
  industryFit: "Fashion / Apparel" | "Beauty / Skincare" | "Hybrid";
  channel: "Instagram DM" | "WhatsApp" | "Email" | "SMS placeholder" | "Manual Copy";
  owner: string;
  approvalStatus: "Approved" | "Needs Review" | "Draft";
  lastUpdated: string;
  usageCount: number;
  linkedStageTag: string;
  previewText: string;
  tone: Tone;
};

type ImportJob = {
  id: string;
  activityType: "Import" | "Export";
  dataSet: string;
  rowsProcessed: number;
  issuesFound: number;
  status: "Completed" | "Needs Review" | "Failed" | "Ready";
  owner: string;
  timestamp: string;
  nextAction: string;
  tone: Tone;
};

type ImportValidationIssue = {
  id: string;
  issueType: string;
  affectedRows: number;
  severity: "High" | "Medium" | "Low";
  recommendedFix: string;
  tone: Tone;
};

type SetupExportDataset = {
  id: string;
  datasetName: string;
  records: number;
  formats: string[];
  recoveryUse: string;
  tone: Tone;
};

type RecoveryActivity = {
  id: string;
  category:
    | "Automation"
    | "Team Actions"
    | "Sync Issues"
    | "Payments"
    | "Inquiries"
    | "Repeat Revenue"
    | "Post-Purchase"
    | "Reports";
  title: string;
  description: string;
  impactBadge: string;
  relatedRecord: string;
  owner?: string;
  status: string;
  nextAction: string;
  timestamp: string;
  tone: Tone;
};

type NewRecoveryActivity = Omit<RecoveryActivity, "id" | "timestamp">;

const sidebarGroups: SidebarGroup[] = [
  {
    title: "Command Center",
    items: ["Recovery Overview", "Today's Recovery Queue", "Recovery Activity"],
  },
  {
    title: "Capture",
    items: ["Inquiry Inbox", "Product Demand", "Source Leak Tracking"],
  },
  {
    title: "Product Intelligence",
    items: ["Product Catalog", "SKU / Variant Sheet", "Categories & Tags", "Import / Export"],
  },
  {
    title: "Buyers",
    items: ["Buyer Profiles", "Revenue Segments", "Buyer Value"],
  },
  {
    title: "Revenue Recovery",
    items: ["Revenue Pipeline", "Follow-up Recovery", "Payment Recovery", "Recovered Revenue"],
  },
  {
    title: "Orders & Post-Purchase",
    items: ["Order Risk Monitor", "Delivery Follow-up", "Reviews / Referrals / UGC"],
  },
  {
    title: "Repeat Revenue",
    items: ["Refill Opportunities", "Restock Waitlist", "Inactive Buyer Recovery"],
  },
  {
    title: "Team Workspace",
    items: ["Assigned Recovery Actions", "Recovery Threads", "Team Load"],
  },
  {
    title: "Reports & Automation",
    items: ["Automation Health", "Revenue Leak Reports", "Monthly Summary"],
  },
  {
    title: "Setup",
    items: ["Brand Settings", "Team Users", "Tags & Stages", "Templates", "Import / Export"],
  },
];

const kpis: KPI[] = [
  {
    label: "Revenue at Risk",
    value: "$18.4K",
    caption: "Across open leaks",
    tone: "rose",
  },
  {
    label: "Recovered This Month",
    value: "$42.7K",
    caption: "+18% from last month",
    tone: "emerald",
  },
  {
    label: "Pending Payment Value",
    value: "$6.8K",
    caption: "12 buyers need nudges",
    tone: "amber",
  },
  {
    label: "Overdue Recovery Actions",
    value: "19",
    caption: "Highest risk queue",
    tone: "rose",
  },
  {
    label: "Refill / Restock Opportunities",
    value: "37",
    caption: "Ready for outreach",
    tone: "cyan",
  },
  {
    label: "Automation Sync Issues",
    value: "4",
    caption: "External events need review",
    tone: "amber",
  },
  {
    label: "Open Recovery Tasks",
    value: "63",
    caption: "Active recovery actions across owners",
    tone: "emerald",
  },
];

const teamUsers: TeamUser[] = [
  {
    id: "team-1",
    name: "Amara Shah",
    role: "Recovery owner",
    activeTasks: 18,
    overdueTasks: 4,
    revenueAtRisk: "$5.4K",
    sourceFocus: "Website bridal and Instagram fit inquiries",
    nextAction: "Clear overdue first replies before close of day.",
    recoveredThisMonth: "$15.2K",
    tone: "cyan",
  },
  {
    id: "team-2",
    name: "Mina Cole",
    role: "Beauty specialist",
    activeTasks: 14,
    overdueTasks: 2,
    revenueAtRisk: "$2.1K",
    sourceFocus: "Shopify refill windows and restock forms",
    nextAction: "Send refill and restock messages while inventory is available.",
    recoveredThisMonth: "$9.4K",
    tone: "emerald",
  },
  {
    id: "team-3",
    name: "Tessa Nguyen",
    role: "Order recovery",
    activeTasks: 12,
    overdueTasks: 5,
    revenueAtRisk: "$4.8K",
    sourceFocus: "WhatsApp checkout and order risk events",
    nextAction: "Prioritize pending payments and address holds.",
    recoveredThisMonth: "$8.1K",
    tone: "amber",
  },
  {
    id: "team-4",
    name: "Luis Park",
    role: "Post-purchase",
    activeTasks: 9,
    overdueTasks: 1,
    revenueAtRisk: "$1.6K",
    sourceFocus: "Delivered orders, reviews, referrals, and UGC",
    nextAction: "Send review and referral prompts from positive delivery signals.",
    recoveredThisMonth: "$4.6K",
    tone: "indigo",
  },
];

const recoveryTasks: RecoveryTask[] = [
  {
    id: "RR-1041",
    customer: "Sophia Bennett",
    brandContext: "Atelier Luma bridal capsule",
    productInterest: "Bridal collection inquiry",
    leakType: "Follow-up leak",
    category: "Inquiry Follow-up",
    estimatedRevenueAtRisk: "$1,850",
    source: "Website form",
    assignedOwner: "Amara Shah",
    dueStatus: "Overdue",
    priority: "Critical",
    recommendedNextAction: "Send bridal appointment follow-up and offer two fitting windows today.",
    messageTemplate:
      "Hi Sophia, I wanted to follow up on your bridal collection inquiry. We can still reserve a styling slot this week and pull pieces around your venue, date, and size preferences.",
    automationStatus: "Captured by form workflow; appointment tag synced",
    sourceStatus: "Source verified",
    lastEvent: "No reply sent after initial capture 46 hours ago",
    lastContact: "No outbound reply yet",
    attemptCount: 0,
    tone: "rose",
    internalRecoveryThread: [
      {
        id: "RR-1041-1",
        author: "Automation",
        role: "Automation",
        message: "Inquiry captured with bridal capsule tag and estimated order range.",
        time: "2d ago",
      },
      {
        id: "RR-1041-2",
        author: "Amara Shah",
        role: "Owner",
        message: "Need to confirm wedding date before recommending trunk-show pieces.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "RR-1042",
    customer: "Elena Rodriguez",
    brandContext: "Neroli Lab replenishment window",
    productInterest: "Skincare serum refill",
    leakType: "Repeat purchase leak",
    category: "Refill/Restock",
    estimatedRevenueAtRisk: "$118",
    source: "Shopify order history",
    assignedOwner: "Mina Cole",
    dueStatus: "Due today",
    priority: "Medium",
    recommendedNextAction: "Send refill reminder with sensitive-skin routine note and reorder link.",
    messageTemplate:
      "Hi Elena, based on your last Vitamin C serum order, this is a good time to refill before you run low. Want me to send the reorder link with your saved routine?",
    automationStatus: "Refill timing event received from external workflow",
    sourceStatus: "Order history matched",
    lastEvent: "60-day refill window opened this morning",
    lastContact: "Last purchase 60 days ago",
    attemptCount: 1,
    tone: "emerald",
    internalRecoveryThread: [
      {
        id: "RR-1042-1",
        author: "Automation",
        role: "Automation",
        message: "Customer entered 60-day serum refill segment.",
        time: "3h ago",
      },
      {
        id: "RR-1042-2",
        author: "Mina Cole",
        role: "Owner",
        message: "Include note about using sunscreen with morning application.",
        time: "1h ago",
      },
    ],
  },
  {
    id: "RR-1043",
    customer: "Maya Chen",
    brandContext: "Vela Denim spring capsule",
    productInterest: "Size/fit question",
    leakType: "Inquiry leak",
    category: "Inquiry Follow-up",
    estimatedRevenueAtRisk: "$240",
    source: "Instagram DM",
    assignedOwner: "Amara Shah",
    dueStatus: "Overdue",
    priority: "High",
    recommendedNextAction: "Reply with fit guidance, size exchange reassurance, and product link.",
    messageTemplate:
      "Hi Maya, the cropped jacket runs true to size with a structured shoulder. If you share your usual size, I can suggest the best fit and send the exchange details too.",
    automationStatus: "DM captured; owner assignment succeeded",
    sourceStatus: "Source verified",
    lastEvent: "High-intent fit question left unanswered for 18 hours",
    lastContact: "Instagram DM 18h ago",
    attemptCount: 0,
    tone: "rose",
    internalRecoveryThread: [
      {
        id: "RR-1043-1",
        author: "Automation",
        role: "Automation",
        message: "Instagram DM classified as size/fit question.",
        time: "18h ago",
      },
      {
        id: "RR-1043-2",
        author: "Amara Shah",
        role: "Owner",
        message: "Add exchange reassurance because sizing concern is blocking purchase.",
        time: "35m ago",
      },
    ],
  },
  {
    id: "RR-1044",
    customer: "Nadia Brooks",
    brandContext: "Rue Muse limited knitwear drop",
    productInterest: "New drop waitlist",
    leakType: "Repeat purchase leak",
    category: "Refill/Restock",
    estimatedRevenueAtRisk: "$960",
    source: "Campaign waitlist",
    assignedOwner: "Luis Park",
    dueStatus: "Due today",
    priority: "High",
    recommendedNextAction: "Send early-access note before public launch inventory opens.",
    messageTemplate:
      "Hi Nadia, the knitwear drop you joined the waitlist for is opening early access today. I can hold your preferred color for the next two hours.",
    automationStatus: "Waitlist event synced",
    sourceStatus: "Campaign source attached",
    lastEvent: "Waitlist moved into launch-day recovery queue",
    lastContact: "Campaign click 4h ago",
    attemptCount: 1,
    tone: "cyan",
    internalRecoveryThread: [
      {
        id: "RR-1044-1",
        author: "Automation",
        role: "Automation",
        message: "Customer clicked campaign preview twice in the last 24 hours.",
        time: "4h ago",
      },
      {
        id: "RR-1044-2",
        author: "Luis Park",
        role: "Owner",
        message: "Prioritize before medium sizes sell through.",
        time: "2h ago",
      },
    ],
  },
  {
    id: "RR-1045",
    customer: "Imani Wallace",
    brandContext: "Coco Bloom lip oil restock",
    productInterest: "Restock request",
    leakType: "Repeat purchase leak",
    category: "Refill/Restock",
    estimatedRevenueAtRisk: "$420",
    source: "Back-in-stock form",
    assignedOwner: "Mina Cole",
    dueStatus: "Due soon",
    priority: "Medium",
    recommendedNextAction: "Confirm shade restock and suggest the matching liner bundle.",
    messageTemplate:
      "Hi Imani, your lip oil shade is back. I can send the restock link, and the matching liner bundle is available while inventory lasts.",
    automationStatus: "Shopify tag sync failed",
    sourceStatus: "Needs sync review",
    lastEvent: "Restock email event received but customer tag did not update",
    lastContact: "Restock alert 5h ago",
    attemptCount: 1,
    tone: "amber",
    internalRecoveryThread: [
      {
        id: "RR-1045-1",
        author: "Automation",
        role: "Automation",
        message: "Back-in-stock event received from inventory workflow.",
        time: "5h ago",
      },
      {
        id: "RR-1045-2",
        author: "Mina Cole",
        role: "Owner",
        message: "Manual tag added until external sync catches up.",
        time: "2h ago",
      },
    ],
  },
  {
    id: "RR-1046",
    customer: "Priya Nair",
    brandContext: "Saffron Skin evening routine bundle",
    productInterest: "Pending payment",
    leakType: "Payment pending leak",
    category: "Payment Recovery",
    estimatedRevenueAtRisk: "$670",
    source: "WhatsApp checkout link",
    assignedOwner: "Tessa Nguyen",
    dueStatus: "Overdue",
    priority: "Critical",
    recommendedNextAction: "Send payment reminder and confirm checkout link is still valid.",
    messageTemplate:
      "Hi Priya, your evening routine bundle is reserved but payment has not completed yet. Here is the secure checkout link again; I can help if anything blocked the payment.",
    automationStatus: "Payment pending event synced from checkout",
    sourceStatus: "Source verified",
    lastEvent: "Buyer said yes in WhatsApp, payment still incomplete after 22 hours",
    lastContact: "WhatsApp reply yesterday",
    attemptCount: 2,
    tone: "amber",
    internalRecoveryThread: [
      {
        id: "RR-1046-1",
        author: "Tessa Nguyen",
        role: "Owner",
        message: "Customer confirmed shade selection and asked for payment link.",
        time: "Yesterday",
      },
      {
        id: "RR-1046-2",
        author: "Automation",
        role: "Automation",
        message: "Checkout still unpaid after reminder threshold.",
        time: "30m ago",
      },
    ],
  },
  {
    id: "RR-1047",
    customer: "Grace Miller",
    brandContext: "Harper Row delivered denim order",
    productInterest: "Delivered order review request",
    leakType: "Post-purchase leak",
    category: "Post-Purchase",
    estimatedRevenueAtRisk: "$180",
    source: "Order delivery event",
    assignedOwner: "Luis Park",
    dueStatus: "Due today",
    priority: "Low",
    recommendedNextAction: "Ask for delivery satisfaction, review, and second-purchase preference.",
    messageTemplate:
      "Hi Grace, your denim order shows as delivered. Did everything arrive as expected? A quick review would help, and I can also flag you for the next wash restock.",
    automationStatus: "Delivery event captured",
    sourceStatus: "Order source matched",
    lastEvent: "Delivered yesterday; review request not sent",
    lastContact: "Delivery confirmed yesterday",
    attemptCount: 0,
    tone: "indigo",
    internalRecoveryThread: [
      {
        id: "RR-1047-1",
        author: "Automation",
        role: "Automation",
        message: "Delivery confirmation received from shipping workflow.",
        time: "Yesterday",
      },
      {
        id: "RR-1047-2",
        author: "Luis Park",
        role: "Owner",
        message: "Ask about fit before requesting UGC.",
        time: "45m ago",
      },
    ],
  },
  {
    id: "RR-1048",
    customer: "Talia Monroe",
    brandContext: "Glow Haus creator seed list",
    productInterest: "UGC/referral follow-up",
    leakType: "Post-purchase leak",
    category: "Post-Purchase",
    estimatedRevenueAtRisk: "$300",
    source: "Referral form",
    assignedOwner: "Luis Park",
    dueStatus: "Due soon",
    priority: "Medium",
    recommendedNextAction: "Send UGC prompt and referral code after positive review.",
    messageTemplate:
      "Hi Talia, thank you for the kind review. If you share a short routine clip, we can feature it and send your referral code for friends who ask about the product.",
    automationStatus: "Review event synced",
    sourceStatus: "Referral source attached",
    lastEvent: "Positive review received; UGC ask not assigned",
    lastContact: "Review received 8h ago",
    attemptCount: 0,
    tone: "emerald",
    internalRecoveryThread: [
      {
        id: "RR-1048-1",
        author: "Automation",
        role: "Automation",
        message: "Five-star review detected from post-purchase survey.",
        time: "8h ago",
      },
      {
        id: "RR-1048-2",
        author: "Luis Park",
        role: "Owner",
        message: "Good candidate for creator-style UGC request.",
        time: "1h ago",
      },
    ],
  },
  {
    id: "RR-1049",
    customer: "Arielle Stone",
    brandContext: "Bare Kind calming skincare line",
    productInterest: "Sensitive skin product question",
    leakType: "Inquiry leak",
    category: "Inquiry Follow-up",
    estimatedRevenueAtRisk: "$155",
    source: "Website chat",
    assignedOwner: "Mina Cole",
    dueStatus: "Due today",
    priority: "High",
    recommendedNextAction: "Answer ingredient concern and suggest patch-test routine.",
    messageTemplate:
      "Hi Arielle, the calming cream is fragrance-free and designed for sensitive skin. I can share the ingredient list and a patch-test routine before you order.",
    automationStatus: "Chat event captured",
    sourceStatus: "Source verified",
    lastEvent: "Customer asked ingredient question 4 hours ago",
    lastContact: "Website chat 4h ago",
    attemptCount: 0,
    tone: "cyan",
    internalRecoveryThread: [
      {
        id: "RR-1049-1",
        author: "Automation",
        role: "Automation",
        message: "Website chat classified as high-intent ingredient question.",
        time: "4h ago",
      },
      {
        id: "RR-1049-2",
        author: "Mina Cole",
        role: "Owner",
        message: "Use fragrance-free and patch-test language.",
        time: "20m ago",
      },
    ],
  },
  {
    id: "RR-1050",
    customer: "Camila Torres",
    brandContext: "Soho pop-up styling inquiry",
    productInterest: "Event/pop-up inquiry",
    leakType: "Inquiry leak",
    category: "Inquiry Follow-up",
    estimatedRevenueAtRisk: "$540",
    source: "Event / pop-up",
    assignedOwner: "Unassigned",
    dueStatus: "Overdue",
    priority: "High",
    recommendedNextAction: "Assign owner and send post-event styling recap with cart link.",
    messageTemplate:
      "Hi Camila, it was lovely meeting you at the pop-up. I saved the pieces you liked and can send a styling recap with sizes and checkout links.",
    automationStatus: "CSV imported from event sheet",
    sourceStatus: "Missing source owner",
    lastEvent: "Manual event import completed without owner assignment",
    lastContact: "Pop-up visit 1d ago",
    attemptCount: 0,
    tone: "rose",
    internalRecoveryThread: [
      {
        id: "RR-1050-1",
        author: "Automation",
        role: "Automation",
        message: "CSV import completed with 18 pop-up inquiries.",
        time: "1d ago",
      },
      {
        id: "RR-1050-2",
        author: "Operations",
        role: "Operations",
        message: "Need to assign Soho event inquiries before they go cold.",
        time: "6h ago",
      },
    ],
  },
  {
    id: "RR-1051",
    customer: "Jasmine Reed",
    brandContext: "Velvet Lane order dispatch",
    productInterest: "Address verification before shipment",
    leakType: "Post-purchase leak",
    category: "Order Risk",
    estimatedRevenueAtRisk: "$210",
    source: "Order risk monitor",
    assignedOwner: "Tessa Nguyen",
    dueStatus: "Monitoring",
    priority: "Medium",
    recommendedNextAction: "Confirm apartment number and prevent failed delivery.",
    messageTemplate:
      "Hi Jasmine, we are preparing your order and just need to confirm the apartment number before dispatch so delivery is not delayed.",
    automationStatus: "Order risk event captured",
    sourceStatus: "Address field incomplete",
    lastEvent: "Shipping label blocked by missing apartment number",
    lastContact: "Order risk flagged 2h ago",
    attemptCount: 1,
    tone: "gray",
    internalRecoveryThread: [
      {
        id: "RR-1051-1",
        author: "Automation",
        role: "Automation",
        message: "Address validation flagged incomplete delivery details.",
        time: "2h ago",
      },
      {
        id: "RR-1051-2",
        author: "Tessa Nguyen",
        role: "Owner",
        message: "Hold dispatch until customer confirms apartment number.",
        time: "1h ago",
      },
    ],
  },
];

const inquiries: Inquiry[] = [
  {
    id: "INQ-2201",
    customer: "Arielle Stone",
    inquirySource: "Website chat",
    timeSinceInquiry: "4h",
    firstReplyStatus: "Not replied",
    productInterest: "Sensitive skin product question",
    intentLevel: "High",
    estimatedValue: "$155",
    owner: "Mina Cole",
    automationStatus: "Website chat captured ingredient concern and skin-sensitivity tag",
    recommendedAction: "Reply with ingredient reassurance and patch-test steps.",
    templatePreview:
      "The calming cream is fragrance-free. I can share the full ingredient list and patch-test routine.",
    sourceStatus: "Captured cleanly",
    internalNotes: 1,
    tone: "cyan",
  },
  {
    id: "INQ-2202",
    customer: "Sophia Bennett",
    inquirySource: "Website form",
    timeSinceInquiry: "46h",
    firstReplyStatus: "Reply drafted",
    productInterest: "Bridal collection inquiry",
    intentLevel: "High",
    estimatedValue: "$1,850",
    owner: "Amara Shah",
    automationStatus: "Website form captured bridal date, budget range, and appointment intent",
    recommendedAction: "Send appointment options before the bridal inquiry goes cold.",
    templatePreview:
      "We can reserve a bridal styling slot this week and pull pieces around your venue and date.",
    sourceStatus: "Captured cleanly",
    internalNotes: 2,
    tone: "rose",
  },
  {
    id: "INQ-2203",
    customer: "Maya Chen",
    inquirySource: "Instagram DM",
    timeSinceInquiry: "18h",
    firstReplyStatus: "Not replied",
    productInterest: "Size/fit question",
    intentLevel: "High",
    estimatedValue: "$240",
    owner: "Amara Shah",
    automationStatus: "Instagram DM captured size question and mapped product tag",
    recommendedAction: "Send sizing guidance and exchange reassurance.",
    templatePreview:
      "The cropped jacket runs true to size. Share your usual fit and I will recommend the best size.",
    sourceStatus: "DM captured",
    internalNotes: 1,
    tone: "rose",
  },
  {
    id: "INQ-2204",
    customer: "Camila Torres",
    inquirySource: "Event / pop-up",
    timeSinceInquiry: "1d",
    firstReplyStatus: "Needs human review",
    productInterest: "Event/pop-up inquiry",
    intentLevel: "Medium",
    estimatedValue: "$540",
    owner: "Unassigned",
    automationStatus: "CSV import captured product notes but owner assignment failed",
    recommendedAction: "Assign owner and send post-event recap.",
    templatePreview:
      "I saved the pieces you liked at the pop-up and can send sizes with checkout links.",
    sourceStatus: "Owner missing",
    internalNotes: 0,
    tone: "amber",
  },
  {
    id: "INQ-2205",
    customer: "Nadia Brooks",
    inquirySource: "Campaign waitlist",
    timeSinceInquiry: "8h",
    firstReplyStatus: "Replied",
    productInterest: "New drop waitlist",
    intentLevel: "High",
    estimatedValue: "$960",
    owner: "Luis Park",
    automationStatus: "Campaign click and waitlist source attached",
    recommendedAction: "Send early access while preferred sizes are available.",
    templatePreview:
      "The knitwear drop is opening early access today. I can hold your preferred color briefly.",
    sourceStatus: "Campaign attached",
    internalNotes: 1,
    tone: "emerald",
  },
  {
    id: "INQ-2206",
    customer: "Imani Wallace",
    inquirySource: "Back-in-stock form",
    timeSinceInquiry: "5h",
    firstReplyStatus: "Reply drafted",
    productInterest: "Restock request",
    intentLevel: "Medium",
    estimatedValue: "$420",
    owner: "Mina Cole",
    automationStatus: "Back-in-stock form captured shade request; ecommerce tag sync needs review",
    recommendedAction: "Confirm restock and offer matching bundle.",
    templatePreview:
      "Your lip oil shade is back. I can send the restock link with the matching liner bundle.",
    sourceStatus: "Sync issue",
    internalNotes: 1,
    tone: "amber",
  },
  {
    id: "INQ-2207",
    customer: "Elena Rodriguez",
    inquirySource: "Shopify / Ecommerce",
    timeSinceInquiry: "2h",
    firstReplyStatus: "Not replied",
    productInterest: "Skincare serum question",
    intentLevel: "Medium",
    estimatedValue: "$118",
    owner: "Mina Cole",
    automationStatus: "Ecommerce event captured 60-day serum timing and refill intent",
    recommendedAction: "Send serum routine guidance with the saved reorder link.",
    templatePreview:
      "Your Vitamin C serum timing is right for a refill. I can resend the routine link and reorder option.",
    sourceStatus: "Automation captured",
    internalNotes: 0,
    tone: "emerald",
  },
  {
    id: "INQ-2208",
    customer: "Priya Nair",
    inquirySource: "WhatsApp",
    timeSinceInquiry: "22h",
    firstReplyStatus: "Needs human review",
    productInterest: "WhatsApp product bundle inquiry",
    intentLevel: "High",
    estimatedValue: "$670",
    owner: "Tessa Nguyen",
    automationStatus: "WhatsApp bundle message captured; payment link event is still pending",
    recommendedAction: "Confirm bundle selection and resend the secure payment link.",
    templatePreview:
      "Your evening routine bundle is reserved. Here is the secure checkout link again if payment was blocked.",
    sourceStatus: "Payment pending",
    internalNotes: 2,
    tone: "amber",
  },
  {
    id: "INQ-2209",
    customer: "Talia Monroe",
    inquirySource: "Referral",
    timeSinceInquiry: "9h",
    firstReplyStatus: "Not replied",
    productInterest: "Referral inquiry",
    intentLevel: "Low",
    estimatedValue: "$300",
    owner: "Luis Park",
    automationStatus: "Referral form captured creator-style UGC interest",
    recommendedAction: "Reply with referral code and product match questions.",
    templatePreview:
      "Thanks for the referral note. I can share your code and help match the product your friend asked about.",
    sourceStatus: "Referral source attached",
    internalNotes: 0,
    tone: "indigo",
  },
];

const productDemandSignals: ProductDemandSignal[] = [
  {
    id: "DEM-301",
    demandName: "Bridal capsule interest",
    industryType: "Fashion / Apparel",
    demandType: "High Value",
    totalSignals: 14,
    highIntentCount: 9,
    estimatedDemandValue: "$18,600",
    sourceMix: ["Website Form", "Instagram DM", "Referral"],
    openRecoveryActions: 7,
    stockStatus: "Styling slots available this week",
    owner: "Amara Shah",
    recommendedNextAction: "Create bridal appointment recovery tasks for high-intent inquiries.",
    tone: "rose",
  },
  {
    id: "DEM-302",
    demandName: "Size/fit questions for denim drop",
    industryType: "Fashion / Apparel",
    demandType: "Size / Fit",
    totalSignals: 27,
    highIntentCount: 18,
    estimatedDemandValue: "$6,480",
    sourceMix: ["Instagram DM", "Website chat", "Manual Entry"],
    openRecoveryActions: 11,
    stockStatus: "Core sizes available; medium wash running low",
    owner: "Amara Shah",
    recommendedNextAction: "Send fit guidance and exchange reassurance before sizes sell through.",
    tone: "cyan",
  },
  {
    id: "DEM-303",
    demandName: "New drop waitlist",
    industryType: "Fashion / Apparel",
    demandType: "New Drop",
    totalSignals: 38,
    highIntentCount: 24,
    estimatedDemandValue: "$14,900",
    sourceMix: ["Campaign", "Instagram DM", "Website Form"],
    openRecoveryActions: 16,
    stockStatus: "Early access open today",
    owner: "Luis Park",
    recommendedNextAction: "Trigger early-access recovery tasks for high-intent waitlist buyers.",
    tone: "emerald",
  },
  {
    id: "DEM-304",
    demandName: "Coco Bloom lip oil restock",
    industryType: "Beauty / Skincare",
    demandType: "Restock",
    totalSignals: 31,
    highIntentCount: 19,
    estimatedDemandValue: "$4,340",
    sourceMix: ["Back-in-stock form", "Shopify / Ecommerce", "Campaign"],
    openRecoveryActions: 13,
    stockStatus: "Restocked; ecommerce tag sync issue",
    owner: "Mina Cole",
    recommendedNextAction: "Add captured restock requests to the restock recovery queue.",
    tone: "amber",
  },
  {
    id: "DEM-305",
    demandName: "Soho pop-up product demand",
    industryType: "Fashion / Apparel",
    demandType: "Event",
    totalSignals: 22,
    highIntentCount: 12,
    estimatedDemandValue: "$7,200",
    sourceMix: ["Event / Pop-up", "CSV Import", "Manual Entry"],
    openRecoveryActions: 9,
    stockStatus: "Assortment available; imported owners missing",
    owner: "Unassigned",
    recommendedNextAction: "Assign event demand owner and create post-event follow-up recovery tasks.",
    tone: "rose",
  },
  {
    id: "DEM-306",
    demandName: "VIP early access interest",
    industryType: "Fashion / Apparel",
    demandType: "New Drop",
    totalSignals: 16,
    highIntentCount: 13,
    estimatedDemandValue: "$9,800",
    sourceMix: ["Campaign", "Referral", "Instagram DM"],
    openRecoveryActions: 6,
    stockStatus: "VIP allocation available for 24 hours",
    owner: "Luis Park",
    recommendedNextAction: "Send early-access holds and recover buyers before public launch.",
    tone: "indigo",
  },
  {
    id: "DEM-307",
    demandName: "Wholesale/boutique interest",
    industryType: "Fashion / Apparel",
    demandType: "Wholesale",
    totalSignals: 7,
    highIntentCount: 4,
    estimatedDemandValue: "$12,500",
    sourceMix: ["Website Form", "Event / Pop-up", "Referral"],
    openRecoveryActions: 3,
    stockStatus: "Line sheet ready; owner review needed",
    owner: "Unassigned",
    recommendedNextAction: "Assign owner and send boutique line-sheet follow-up.",
    tone: "amber",
  },
  {
    id: "DEM-308",
    demandName: "Serum refill demand",
    industryType: "Beauty / Skincare",
    demandType: "Refill",
    totalSignals: 44,
    highIntentCount: 29,
    estimatedDemandValue: "$5,192",
    sourceMix: ["Shopify / Ecommerce", "WhatsApp", "Campaign"],
    openRecoveryActions: 18,
    stockStatus: "Inventory healthy; refill window active",
    owner: "Mina Cole",
    recommendedNextAction: "Add eligible buyers to the serum refill recovery queue.",
    tone: "emerald",
  },
  {
    id: "DEM-309",
    demandName: "Sensitive-skin questions",
    industryType: "Beauty / Skincare",
    demandType: "Routine",
    totalSignals: 21,
    highIntentCount: 15,
    estimatedDemandValue: "$3,255",
    sourceMix: ["Website chat", "Instagram DM", "Referral"],
    openRecoveryActions: 10,
    stockStatus: "Core calming products available",
    owner: "Mina Cole",
    recommendedNextAction: "Create ingredient-reassurance follow-ups with patch-test guidance.",
    tone: "cyan",
  },
  {
    id: "DEM-310",
    demandName: "Routine bundle interest",
    industryType: "Beauty / Skincare",
    demandType: "Bundle",
    totalSignals: 18,
    highIntentCount: 12,
    estimatedDemandValue: "$8,040",
    sourceMix: ["WhatsApp", "Website Form", "Manual Entry"],
    openRecoveryActions: 8,
    stockStatus: "Bundles available; payment pending leakage rising",
    owner: "Tessa Nguyen",
    recommendedNextAction: "Create payment and bundle-confirmation recovery tasks.",
    tone: "amber",
  },
  {
    id: "DEM-311",
    demandName: "Shade/product-match requests",
    industryType: "Beauty / Skincare",
    demandType: "Routine",
    totalSignals: 26,
    highIntentCount: 17,
    estimatedDemandValue: "$3,900",
    sourceMix: ["Instagram DM", "Website chat", "Referral"],
    openRecoveryActions: 12,
    stockStatus: "Shade finder responses need owner review",
    owner: "Mina Cole",
    recommendedNextAction: "Reply with product-match guidance and bundle options.",
    tone: "indigo",
  },
  {
    id: "DEM-312",
    demandName: "Reorder timing",
    industryType: "Beauty / Skincare",
    demandType: "Refill",
    totalSignals: 33,
    highIntentCount: 20,
    estimatedDemandValue: "$4,620",
    sourceMix: ["Shopify / Ecommerce", "Campaign", "WhatsApp"],
    openRecoveryActions: 14,
    stockStatus: "Reorder windows open for current buyers",
    owner: "Mina Cole",
    recommendedNextAction: "Send timing-based reorder prompts with saved routine context.",
    tone: "emerald",
  },
];

const sourceLeakRecords: SourceLeakRecord[] = [
  {
    id: "SRC-401",
    sourceName: "Website Form",
    totalCaptured: 56,
    highIntentInquiries: 24,
    unassignedRecords: 3,
    firstRepliesMissing: 8,
    overdueFollowUps: 5,
    paymentPendingValue: "$1,850",
    recoveredValue: "$7,400",
    syncIssues: 1,
    sourceQualityScore: 82,
    sourceQuality: "Strong bridal and wholesale demand with first-reply leakage.",
    recommendedFix: "Assign owner coverage for high-value forms and create follow-up recovery tasks.",
    tone: "cyan",
  },
  {
    id: "SRC-402",
    sourceName: "Instagram DM",
    totalCaptured: 42,
    highIntentInquiries: 18,
    unassignedRecords: 4,
    firstRepliesMissing: 7,
    overdueFollowUps: 3,
    paymentPendingValue: "$2,840",
    recoveredValue: "$1,900",
    syncIssues: 0,
    sourceQualityScore: 76,
    sourceQuality: "Strong demand, high follow-up leakage.",
    recommendedFix: "Assign owner and create follow-up recovery tasks for fit and shade questions.",
    tone: "rose",
  },
  {
    id: "SRC-403",
    sourceName: "WhatsApp",
    totalCaptured: 31,
    highIntentInquiries: 19,
    unassignedRecords: 2,
    firstRepliesMissing: 4,
    overdueFollowUps: 6,
    paymentPendingValue: "$6,120",
    recoveredValue: "$5,760",
    syncIssues: 1,
    sourceQualityScore: 79,
    sourceQuality: "High purchase intent with payment pending leakage.",
    recommendedFix: "Create payment reminders and verify checkout links before the day closes.",
    tone: "amber",
  },
  {
    id: "SRC-404",
    sourceName: "Shopify / Ecommerce",
    totalCaptured: 74,
    highIntentInquiries: 32,
    unassignedRecords: 1,
    firstRepliesMissing: 6,
    overdueFollowUps: 4,
    paymentPendingValue: "$3,440",
    recoveredValue: "$11,880",
    syncIssues: 3,
    sourceQualityScore: 88,
    sourceQuality: "Reliable refill and restock signal volume with sync issues.",
    recommendedFix: "Review failed tags and keep refill/restock actions moving while inventory is available.",
    tone: "emerald",
  },
  {
    id: "SRC-405",
    sourceName: "Event / Pop-up",
    totalCaptured: 28,
    highIntentInquiries: 13,
    unassignedRecords: 9,
    firstRepliesMissing: 11,
    overdueFollowUps: 7,
    paymentPendingValue: "$1,260",
    recoveredValue: "$2,300",
    syncIssues: 0,
    sourceQualityScore: 62,
    sourceQuality: "Healthy product demand, weak owner assignment after capture.",
    recommendedFix: "Assign missing owners and create post-event recap recovery cases.",
    tone: "rose",
  },
  {
    id: "SRC-406",
    sourceName: "Referral",
    totalCaptured: 19,
    highIntentInquiries: 7,
    unassignedRecords: 1,
    firstRepliesMissing: 3,
    overdueFollowUps: 2,
    paymentPendingValue: "$640",
    recoveredValue: "$3,200",
    syncIssues: 0,
    sourceQualityScore: 84,
    sourceQuality: "Quality buyer context with low leakage.",
    recommendedFix: "Keep referral replies fast and route UGC/referral prompts to post-purchase owner.",
    tone: "indigo",
  },
  {
    id: "SRC-407",
    sourceName: "Campaign",
    totalCaptured: 63,
    highIntentInquiries: 29,
    unassignedRecords: 2,
    firstRepliesMissing: 9,
    overdueFollowUps: 5,
    paymentPendingValue: "$2,980",
    recoveredValue: "$9,700",
    syncIssues: 1,
    sourceQualityScore: 86,
    sourceQuality: "Strong drop and waitlist source with follow-up pressure.",
    recommendedFix: "Create early-access recovery tasks before launch inventory opens.",
    tone: "emerald",
  },
  {
    id: "SRC-408",
    sourceName: "CSV Import",
    totalCaptured: 35,
    highIntentInquiries: 14,
    unassignedRecords: 12,
    firstRepliesMissing: 13,
    overdueFollowUps: 8,
    paymentPendingValue: "$940",
    recoveredValue: "$1,120",
    syncIssues: 2,
    sourceQualityScore: 54,
    sourceQuality: "Useful event data with owner and sync leakage.",
    recommendedFix: "Review import mapping, assign owners, and create recovery tasks from the imported rows.",
    tone: "amber",
  },
  {
    id: "SRC-409",
    sourceName: "Manual Entry",
    totalCaptured: 17,
    highIntentInquiries: 6,
    unassignedRecords: 5,
    firstRepliesMissing: 4,
    overdueFollowUps: 3,
    paymentPendingValue: "$420",
    recoveredValue: "$980",
    syncIssues: 0,
    sourceQualityScore: 66,
    sourceQuality: "Good save path for offline interest, but owner follow-through varies.",
    recommendedFix: "Require owner assignment when manual entries are captured.",
    tone: "gray",
  },
];

const buyerProfiles: BuyerProfileRecord[] = [
  {
    id: "BUY-501",
    buyerName: "Sophia Bennett",
    email: "sophia.bennett@example.com",
    phone: "+1 (212) 555-0184",
    source: "Website Form",
    lifecycleStatus: "High Intent",
    favoriteCategory: "Bridal capsule",
    totalSpend: "$2,450",
    purchaseCount: 1,
    lastPurchase: "First appointment pending",
    lastContact: "Website form 46h ago",
    nextFollowUp: "Today before 4 PM",
    owner: "Amara Shah",
    openRecoveryCases: 2,
    revenueAtRisk: "$1,850",
    tags: ["High Intent", "VIP"],
    productPreferences: "High-ticket bridal pieces, ivory satin, structured silhouettes, appointment-led styling.",
    purchaseHistorySummary: "Inquiry captured with venue/date context; appointment revenue is still open.",
    refillRestockStatus: "No refill or restock window.",
    postPurchaseStatus: "Pre-purchase recovery stage.",
    internalNotes: "Confirm wedding date before recommending trunk-show pieces.",
    recommendedNextAction: "Send bridal appointment windows and reserve a styling slot.",
    messageTemplatePreview:
      "We can reserve a bridal styling slot this week and pull pieces around your venue, date, and size preferences.",
    tone: "rose",
  },
  {
    id: "BUY-502",
    buyerName: "Maya Chen",
    email: "maya.chen@example.com",
    phone: "+1 (415) 555-0139",
    source: "Instagram DM",
    lifecycleStatus: "High Intent",
    favoriteCategory: "Denim size/fit",
    totalSpend: "$520",
    purchaseCount: 2,
    lastPurchase: "Vela Denim jeans, 36 days ago",
    lastContact: "Instagram DM 18h ago",
    nextFollowUp: "Today",
    owner: "Amara Shah",
    openRecoveryCases: 1,
    revenueAtRisk: "$240",
    tags: ["High Intent", "Active"],
    productPreferences: "Structured denim, cropped jackets, exchange reassurance before checkout.",
    purchaseHistorySummary: "Two denim orders with one exchange; fit guidance usually converts.",
    refillRestockStatus: "Medium wash jacket size M is running low.",
    postPurchaseStatus: "Fit confidence needed before next order.",
    internalNotes: "Add exchange reassurance because sizing concern is blocking purchase.",
    recommendedNextAction: "Reply with fit guidance, size exchange reassurance, and product link.",
    messageTemplatePreview:
      "The cropped jacket runs true to size with a structured shoulder. Share your usual size and I will suggest the best fit.",
    tone: "cyan",
  },
  {
    id: "BUY-503",
    buyerName: "Nadia Brooks",
    email: "nadia.brooks@example.com",
    phone: "+1 (646) 555-0178",
    source: "Campaign",
    lifecycleStatus: "VIP",
    favoriteCategory: "New drop waitlist",
    totalSpend: "$4,820",
    purchaseCount: 7,
    lastPurchase: "Rue Muse knit set, 22 days ago",
    lastContact: "Campaign click 4h ago",
    nextFollowUp: "Before early access closes",
    owner: "Luis Park",
    openRecoveryCases: 1,
    revenueAtRisk: "$960",
    tags: ["VIP", "High Intent"],
    productPreferences: "Limited knitwear drops, neutral colors, early access holds.",
    purchaseHistorySummary: "Seven purchases across three drops with high repeat conversion.",
    refillRestockStatus: "Preferred colors available for the next two hours.",
    postPurchaseStatus: "Eligible for VIP launch treatment.",
    internalNotes: "Prioritize before medium sizes sell through.",
    recommendedNextAction: "Send early-access hold and preferred color availability.",
    messageTemplatePreview:
      "The knitwear drop you joined is open for early access today. I can hold your preferred color briefly.",
    tone: "emerald",
  },
  {
    id: "BUY-504",
    buyerName: "Imani Wallace",
    email: "imani.wallace@example.com",
    phone: "+1 (305) 555-0161",
    source: "Back-in-stock form",
    lifecycleStatus: "Restock Waiting",
    favoriteCategory: "Lip oil and liner",
    totalSpend: "$690",
    purchaseCount: 4,
    lastPurchase: "Coco Bloom lip duo, 54 days ago",
    lastContact: "Restock alert 5h ago",
    nextFollowUp: "Today while inventory is live",
    owner: "Mina Cole",
    openRecoveryCases: 1,
    revenueAtRisk: "$420",
    tags: ["Restock Waiting", "Active"],
    productPreferences: "Hydrating lip oils, shade-matched liners, restock alerts.",
    purchaseHistorySummary: "Four beauty purchases with strong shade loyalty.",
    refillRestockStatus: "Requested shade is back; Shopify tag sync needs review.",
    postPurchaseStatus: "Ready for bundle cross-sell.",
    internalNotes: "Manual tag added until external sync catches up.",
    recommendedNextAction: "Confirm restock and suggest the matching liner bundle.",
    messageTemplatePreview:
      "Your lip oil shade is back. I can send the restock link, and the matching liner bundle is available.",
    tone: "amber",
  },
  {
    id: "BUY-505",
    buyerName: "Elena Rodriguez",
    email: "elena.rodriguez@example.com",
    phone: "+1 (312) 555-0142",
    source: "Shopify / Ecommerce",
    lifecycleStatus: "Refill Ready",
    favoriteCategory: "Vitamin C serum",
    totalSpend: "$1,180",
    purchaseCount: 8,
    lastPurchase: "Vitamin C serum, 60 days ago",
    lastContact: "Refill event 2h ago",
    nextFollowUp: "Today",
    owner: "Mina Cole",
    openRecoveryCases: 1,
    revenueAtRisk: "$118",
    tags: ["Refill Ready", "Active"],
    productPreferences: "Sensitive-skin routine, serum refills, sunscreen reminders.",
    purchaseHistorySummary: "Eight skincare purchases with predictable 60-day serum reorder window.",
    refillRestockStatus: "Serum refill window is open now.",
    postPurchaseStatus: "Positive repeat buyer, no open delivery issue.",
    internalNotes: "Include sunscreen note with morning application.",
    recommendedNextAction: "Send refill reminder with routine note and saved reorder link.",
    messageTemplatePreview:
      "Based on your last Vitamin C serum order, this is a good time to refill before you run low.",
    tone: "emerald",
  },
  {
    id: "BUY-506",
    buyerName: "Arielle Stone",
    email: "arielle.stone@example.com",
    phone: "+1 (718) 555-0192",
    source: "Website chat",
    lifecycleStatus: "High Intent",
    favoriteCategory: "Sensitive-skin care",
    totalSpend: "$155",
    purchaseCount: 0,
    lastPurchase: "No purchase yet",
    lastContact: "Website chat 4h ago",
    nextFollowUp: "Today",
    owner: "Mina Cole",
    openRecoveryCases: 1,
    revenueAtRisk: "$155",
    tags: ["High Intent", "At Risk"],
    productPreferences: "Fragrance-free formulas, ingredient reassurance, patch-test guidance.",
    purchaseHistorySummary: "High-intent ingredient question; first purchase not yet recovered.",
    refillRestockStatus: "No refill window until first purchase.",
    postPurchaseStatus: "Pre-purchase education stage.",
    internalNotes: "Use fragrance-free and patch-test language.",
    recommendedNextAction: "Answer ingredient concern and suggest patch-test routine.",
    messageTemplatePreview:
      "The calming cream is fragrance-free and designed for sensitive skin. I can share ingredients and patch-test steps.",
    tone: "cyan",
  },
  {
    id: "BUY-507",
    buyerName: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+1 (917) 555-0127",
    source: "WhatsApp",
    lifecycleStatus: "At Risk",
    favoriteCategory: "Routine bundle",
    totalSpend: "$1,340",
    purchaseCount: 3,
    lastPurchase: "Saffron Skin cleanser set, 44 days ago",
    lastContact: "WhatsApp reply yesterday",
    nextFollowUp: "Today before payment link expires",
    owner: "Tessa Nguyen",
    openRecoveryCases: 2,
    revenueAtRisk: "$670",
    tags: ["At Risk", "High Intent"],
    productPreferences: "Evening routine bundles, guided checkout, WhatsApp support.",
    purchaseHistorySummary: "Three prior skincare purchases; current bundle payment is pending.",
    refillRestockStatus: "Bundle reserved but unpaid.",
    postPurchaseStatus: "Payment recovery stage.",
    internalNotes: "Buyer confirmed shade selection and asked for payment link.",
    recommendedNextAction: "Resend secure payment link and confirm checkout is still valid.",
    messageTemplatePreview:
      "Your evening routine bundle is reserved. Here is the secure checkout link again if anything blocked payment.",
    tone: "amber",
  },
  {
    id: "BUY-508",
    buyerName: "Talia Monroe",
    email: "talia.monroe@example.com",
    phone: "+1 (404) 555-0154",
    source: "Referral",
    lifecycleStatus: "Post-Purchase",
    favoriteCategory: "Glow Haus routine",
    totalSpend: "$920",
    purchaseCount: 5,
    lastPurchase: "Glow Haus moisturizer, 12 days ago",
    lastContact: "Positive review 8h ago",
    nextFollowUp: "Today",
    owner: "Luis Park",
    openRecoveryCases: 1,
    revenueAtRisk: "$300",
    tags: ["Post-Purchase", "Active"],
    productPreferences: "Routine content, referral codes, lightweight moisturizers.",
    purchaseHistorySummary: "Five purchases and a positive review; strong UGC/referral candidate.",
    refillRestockStatus: "No immediate refill window.",
    postPurchaseStatus: "Review received; UGC/referral prompt not sent.",
    internalNotes: "Good candidate for creator-style UGC request.",
    recommendedNextAction: "Send UGC prompt and referral code after positive review.",
    messageTemplatePreview:
      "Thank you for the kind review. If you share a short routine clip, we can feature it and send your referral code.",
    tone: "indigo",
  },
  {
    id: "BUY-509",
    buyerName: "Camila Torres",
    email: "camila.torres@example.com",
    phone: "+1 (212) 555-0118",
    source: "Event / Pop-up",
    lifecycleStatus: "At Risk",
    favoriteCategory: "Pop-up styling picks",
    totalSpend: "$0",
    purchaseCount: 0,
    lastPurchase: "No purchase yet",
    lastContact: "Pop-up visit 1d ago",
    nextFollowUp: "Assign owner today",
    owner: "Unassigned",
    openRecoveryCases: 1,
    revenueAtRisk: "$540",
    tags: ["At Risk", "High Intent"],
    productPreferences: "Event styling, saved sizes, checkout links after pop-up.",
    purchaseHistorySummary: "Manual event import created buyer interest without owner assignment.",
    refillRestockStatus: "No refill or restock window.",
    postPurchaseStatus: "Pre-purchase event recovery stage.",
    internalNotes: "Assign owner and send post-event styling recap.",
    recommendedNextAction: "Assign owner and send post-event styling recap with cart link.",
    messageTemplatePreview:
      "It was lovely meeting you at the pop-up. I saved the pieces you liked and can send sizes with checkout links.",
    tone: "rose",
  },
  {
    id: "BUY-510",
    buyerName: "Jasmine Reed",
    email: "jasmine.reed@example.com",
    phone: "+1 (602) 555-0186",
    source: "Order Risk Monitor",
    lifecycleStatus: "At Risk",
    favoriteCategory: "Address-held order",
    totalSpend: "$780",
    purchaseCount: 2,
    lastPurchase: "Address-held order, 2 days ago",
    lastContact: "Validation flag 2h ago",
    nextFollowUp: "Before dispatch window closes",
    owner: "Tessa Nguyen",
    openRecoveryCases: 1,
    revenueAtRisk: "$310",
    tags: ["At Risk", "Post-Purchase"],
    productPreferences: "Fast shipping, address confirmation, order protection.",
    purchaseHistorySummary: "Two orders; current address validation issue can block delivery satisfaction.",
    refillRestockStatus: "No refill window.",
    postPurchaseStatus: "Address confirmation needed before dispatch.",
    internalNotes: "Hold dispatch until apartment number is confirmed.",
    recommendedNextAction: "Confirm apartment number and release the order hold.",
    messageTemplatePreview:
      "Your order is ready, but we need one address detail before dispatch. Can you confirm the apartment number?",
    tone: "amber",
  },
];

const revenueSegments: RevenueSegmentRecord[] = [
  {
    id: "SEG-601",
    segmentName: "VIP buyers",
    segmentType: "VIP",
    buyerCount: 46,
    totalRevenueOpportunity: "$62,400",
    recoveredValue: "$18,900",
    openRecoveryActions: 22,
    averageOrderValue: "$410",
    lastActivity: "Early access clicks today",
    owner: "Luis Park",
    recommendedAction: "Send VIP early-access holds and recover launch-day demand.",
    tone: "emerald",
  },
  {
    id: "SEG-602",
    segmentName: "High-intent leads",
    segmentType: "High Intent",
    buyerCount: 71,
    totalRevenueOpportunity: "$44,800",
    recoveredValue: "$9,600",
    openRecoveryActions: 35,
    averageOrderValue: "$285",
    lastActivity: "New inquiries captured today",
    owner: "Amara Shah",
    recommendedAction: "Prioritize first replies and create follow-up recovery tasks.",
    tone: "rose",
  },
  {
    id: "SEG-603",
    segmentName: "Serum refill due",
    segmentType: "Refill Due",
    buyerCount: 58,
    totalRevenueOpportunity: "$6,844",
    recoveredValue: "$3,220",
    openRecoveryActions: 18,
    averageOrderValue: "$118",
    lastActivity: "60-day reorder window opened",
    owner: "Mina Cole",
    recommendedAction: "Send refill prompts with saved routine context.",
    tone: "emerald",
  },
  {
    id: "SEG-604",
    segmentName: "Restock waiting",
    segmentType: "Restock Waiting",
    buyerCount: 49,
    totalRevenueOpportunity: "$9,780",
    recoveredValue: "$2,840",
    openRecoveryActions: 24,
    averageOrderValue: "$198",
    lastActivity: "Lip oil shade restocked",
    owner: "Mina Cole",
    recommendedAction: "Move captured requests into restock recovery before inventory sells through.",
    tone: "amber",
  },
  {
    id: "SEG-605",
    segmentName: "New drop waitlist",
    segmentType: "High Intent",
    buyerCount: 83,
    totalRevenueOpportunity: "$38,600",
    recoveredValue: "$11,200",
    openRecoveryActions: 28,
    averageOrderValue: "$465",
    lastActivity: "Campaign preview clicks today",
    owner: "Luis Park",
    recommendedAction: "Trigger launch-day recovery tasks for waitlist buyers.",
    tone: "cyan",
  },
  {
    id: "SEG-606",
    segmentName: "Inactive high-value buyers",
    segmentType: "Inactive Buyers",
    buyerCount: 34,
    totalRevenueOpportunity: "$51,300",
    recoveredValue: "$6,700",
    openRecoveryActions: 17,
    averageOrderValue: "$520",
    lastActivity: "No purchase in 120+ days",
    owner: "Amara Shah",
    recommendedAction: "Send personalized inactive buyer recovery offers tied to prior categories.",
    tone: "rose",
  },
  {
    id: "SEG-607",
    segmentName: "Payment pending buyers",
    segmentType: "Payment Pending",
    buyerCount: 19,
    totalRevenueOpportunity: "$11,420",
    recoveredValue: "$4,880",
    openRecoveryActions: 12,
    averageOrderValue: "$601",
    lastActivity: "Checkout links opened today",
    owner: "Tessa Nguyen",
    recommendedAction: "Resend payment links and resolve checkout blockers.",
    tone: "amber",
  },
  {
    id: "SEG-608",
    segmentName: "Post-purchase review candidates",
    segmentType: "Post-Purchase",
    buyerCount: 67,
    totalRevenueOpportunity: "$8,900",
    recoveredValue: "$2,100",
    openRecoveryActions: 31,
    averageOrderValue: "$133",
    lastActivity: "Delivery confirmations yesterday",
    owner: "Luis Park",
    recommendedAction: "Ask for satisfaction, reviews, and next-purchase preferences.",
    tone: "indigo",
  },
  {
    id: "SEG-609",
    segmentName: "Referral / UGC candidates",
    segmentType: "UGC / Referral",
    buyerCount: 26,
    totalRevenueOpportunity: "$7,800",
    recoveredValue: "$1,950",
    openRecoveryActions: 14,
    averageOrderValue: "$300",
    lastActivity: "Positive reviews captured today",
    owner: "Luis Park",
    recommendedAction: "Send referral codes and creator-style UGC prompts.",
    tone: "emerald",
  },
  {
    id: "SEG-610",
    segmentName: "Price-sensitive leads",
    segmentType: "Price-Sensitive",
    buyerCount: 41,
    totalRevenueOpportunity: "$12,900",
    recoveredValue: "$2,420",
    openRecoveryActions: 19,
    averageOrderValue: "$315",
    lastActivity: "Bundle questions this week",
    owner: "Tessa Nguyen",
    recommendedAction: "Use bundle value messaging and limited-time checkout recovery.",
    tone: "gray",
  },
  {
    id: "SEG-611",
    segmentName: "Out-of-stock lost leads",
    segmentType: "Out-of-Stock",
    buyerCount: 37,
    totalRevenueOpportunity: "$10,260",
    recoveredValue: "$2,880",
    openRecoveryActions: 21,
    averageOrderValue: "$277",
    lastActivity: "Back-in-stock forms captured",
    owner: "Mina Cole",
    recommendedAction: "Recover lost demand as soon as restock inventory is available.",
    tone: "amber",
  },
  {
    id: "SEG-612",
    segmentName: "Event / pop-up leads",
    segmentType: "Event / Pop-up",
    buyerCount: 52,
    totalRevenueOpportunity: "$18,700",
    recoveredValue: "$3,600",
    openRecoveryActions: 29,
    averageOrderValue: "$360",
    lastActivity: "CSV import yesterday",
    owner: "Unassigned",
    recommendedAction: "Assign owner coverage and send post-event styling recaps.",
    tone: "rose",
  },
  {
    id: "SEG-613",
    segmentName: "Bridal high-ticket buyers",
    segmentType: "Bridal",
    buyerCount: 18,
    totalRevenueOpportunity: "$48,200",
    recoveredValue: "$12,400",
    openRecoveryActions: 9,
    averageOrderValue: "$1,850",
    lastActivity: "Website appointment forms",
    owner: "Amara Shah",
    recommendedAction: "Book styling appointments and recover high-ticket bridal inquiries.",
    tone: "rose",
  },
  {
    id: "SEG-614",
    segmentName: "Sensitive-skin buyers",
    segmentType: "High Intent",
    buyerCount: 33,
    totalRevenueOpportunity: "$5,115",
    recoveredValue: "$1,640",
    openRecoveryActions: 16,
    averageOrderValue: "$155",
    lastActivity: "Ingredient questions today",
    owner: "Mina Cole",
    recommendedAction: "Send ingredient reassurance and patch-test routines.",
    tone: "cyan",
  },
  {
    id: "SEG-615",
    segmentName: "Bundle opportunity buyers",
    segmentType: "Payment Pending",
    buyerCount: 24,
    totalRevenueOpportunity: "$15,900",
    recoveredValue: "$5,100",
    openRecoveryActions: 13,
    averageOrderValue: "$662",
    lastActivity: "WhatsApp bundle replies",
    owner: "Tessa Nguyen",
    recommendedAction: "Recover bundle payments and confirm product fit before checkout links expire.",
    tone: "amber",
  },
];

const buyerValueRecords: BuyerValueRecord[] = [
  {
    id: "VAL-701",
    buyerName: "Sophia Bennett",
    buyerCategory: "High-ticket bridal buyer",
    lifetimeValue: "$2,450",
    yearToDateSpend: "$0",
    purchaseCount: 1,
    averageOrderValue: "$1,850",
    lastPurchaseDate: "Appointment pending",
    predictedNextPurchase: "This week if appointment is booked",
    refillRestockOpportunityValue: "$0",
    revenueAtRisk: "$1,850",
    recoveredValue: "$0",
    returnExchangeRisk: "Low",
    nextBestAction: "Book bridal appointment and recover open styling revenue.",
    owner: "Amara Shah",
    valueFlags: ["VIP", "At Risk"],
    tone: "rose",
  },
  {
    id: "VAL-702",
    buyerName: "Elena Rodriguez",
    buyerCategory: "Skincare refill buyer",
    lifetimeValue: "$1,180",
    yearToDateSpend: "$354",
    purchaseCount: 8,
    averageOrderValue: "$118",
    lastPurchaseDate: "60 days ago",
    predictedNextPurchase: "Now",
    refillRestockOpportunityValue: "$118",
    revenueAtRisk: "$118",
    recoveredValue: "$472",
    returnExchangeRisk: "Low",
    nextBestAction: "Send serum refill link with routine note.",
    owner: "Mina Cole",
    valueFlags: ["Refill Ready", "Growing"],
    tone: "emerald",
  },
  {
    id: "VAL-703",
    buyerName: "Nadia Brooks",
    buyerCategory: "VIP early access buyer",
    lifetimeValue: "$4,820",
    yearToDateSpend: "$1,620",
    purchaseCount: 7,
    averageOrderValue: "$689",
    lastPurchaseDate: "22 days ago",
    predictedNextPurchase: "Today during early access",
    refillRestockOpportunityValue: "$960",
    revenueAtRisk: "$960",
    recoveredValue: "$2,760",
    returnExchangeRisk: "Low",
    nextBestAction: "Hold preferred new-drop color and send checkout link.",
    owner: "Luis Park",
    valueFlags: ["VIP", "Growing"],
    tone: "emerald",
  },
  {
    id: "VAL-704",
    buyerName: "Priya Nair",
    buyerCategory: "Payment pending bundle buyer",
    lifetimeValue: "$1,340",
    yearToDateSpend: "$670",
    purchaseCount: 3,
    averageOrderValue: "$447",
    lastPurchaseDate: "44 days ago",
    predictedNextPurchase: "Today if payment completes",
    refillRestockOpportunityValue: "$670",
    revenueAtRisk: "$670",
    recoveredValue: "$670",
    returnExchangeRisk: "Medium",
    nextBestAction: "Resend secure payment link and confirm checkout is valid.",
    owner: "Tessa Nguyen",
    valueFlags: ["At Risk", "High Return Risk"],
    tone: "amber",
  },
  {
    id: "VAL-705",
    buyerName: "Talia Monroe",
    buyerCategory: "UGC/referral candidate",
    lifetimeValue: "$920",
    yearToDateSpend: "$420",
    purchaseCount: 5,
    averageOrderValue: "$184",
    lastPurchaseDate: "12 days ago",
    predictedNextPurchase: "After referral prompt",
    refillRestockOpportunityValue: "$300",
    revenueAtRisk: "$300",
    recoveredValue: "$240",
    returnExchangeRisk: "Low",
    nextBestAction: "Send UGC prompt and referral code.",
    owner: "Luis Park",
    valueFlags: ["UGC / Referral Candidate", "Growing"],
    tone: "indigo",
  },
  {
    id: "VAL-706",
    buyerName: "Imani Wallace",
    buyerCategory: "Restock waiting beauty buyer",
    lifetimeValue: "$690",
    yearToDateSpend: "$260",
    purchaseCount: 4,
    averageOrderValue: "$173",
    lastPurchaseDate: "54 days ago",
    predictedNextPurchase: "Today while shade is back",
    refillRestockOpportunityValue: "$420",
    revenueAtRisk: "$420",
    recoveredValue: "$210",
    returnExchangeRisk: "Low",
    nextBestAction: "Send restock link and matching liner bundle.",
    owner: "Mina Cole",
    valueFlags: ["Restock Waiting"],
    tone: "amber",
  },
  {
    id: "VAL-707",
    buyerName: "Maya Chen",
    buyerCategory: "Size/fit question buyer",
    lifetimeValue: "$520",
    yearToDateSpend: "$240",
    purchaseCount: 2,
    averageOrderValue: "$260",
    lastPurchaseDate: "36 days ago",
    predictedNextPurchase: "After fit reassurance",
    refillRestockOpportunityValue: "$240",
    revenueAtRisk: "$240",
    recoveredValue: "$260",
    returnExchangeRisk: "High",
    nextBestAction: "Send fit guidance and exchange reassurance.",
    owner: "Amara Shah",
    valueFlags: ["At Risk", "High Return Risk"],
    tone: "cyan",
  },
  {
    id: "VAL-708",
    buyerName: "Camila Torres",
    buyerCategory: "Event/pop-up buyer",
    lifetimeValue: "$0",
    yearToDateSpend: "$0",
    purchaseCount: 0,
    averageOrderValue: "$540",
    lastPurchaseDate: "No purchase yet",
    predictedNextPurchase: "After owner assignment",
    refillRestockOpportunityValue: "$540",
    revenueAtRisk: "$540",
    recoveredValue: "$0",
    returnExchangeRisk: "Low",
    nextBestAction: "Assign owner and send post-event styling recap.",
    owner: "Unassigned",
    valueFlags: ["At Risk", "Inactive High Value"],
    tone: "rose",
  },
  {
    id: "VAL-709",
    buyerName: "Jasmine Reed",
    buyerCategory: "Order risk buyer",
    lifetimeValue: "$780",
    yearToDateSpend: "$310",
    purchaseCount: 2,
    averageOrderValue: "$390",
    lastPurchaseDate: "2 days ago",
    predictedNextPurchase: "After delivery issue is resolved",
    refillRestockOpportunityValue: "$310",
    revenueAtRisk: "$310",
    recoveredValue: "$390",
    returnExchangeRisk: "High",
    nextBestAction: "Confirm address detail and release order hold.",
    owner: "Tessa Nguyen",
    valueFlags: ["At Risk", "High Return Risk"],
    tone: "amber",
  },
  {
    id: "VAL-710",
    buyerName: "Arielle Stone",
    buyerCategory: "Sensitive-skin product buyer",
    lifetimeValue: "$155",
    yearToDateSpend: "$0",
    purchaseCount: 0,
    averageOrderValue: "$155",
    lastPurchaseDate: "No purchase yet",
    predictedNextPurchase: "After ingredient reassurance",
    refillRestockOpportunityValue: "$155",
    revenueAtRisk: "$155",
    recoveredValue: "$0",
    returnExchangeRisk: "Medium",
    nextBestAction: "Answer ingredient concern and offer patch-test routine.",
    owner: "Mina Cole",
    valueFlags: ["At Risk"],
    tone: "cyan",
  },
];

const revenueOpportunities: RevenueOpportunity[] = [
  {
    id: "OPP-801",
    buyerName: "Sophia Bennett",
    productContext: "Atelier Luma bridal capsule appointment",
    industryType: "Fashion / Apparel",
    source: "Website Form",
    currentStage: "Follow-up Needed",
    estimatedValue: "$1,850",
    revenueAtRisk: "$1,850",
    owner: "Amara Shah",
    priority: "Critical",
    lastActivity: "Bridal form captured 46h ago",
    nextAction: "Confirm appointment window and styling preferences.",
    dueStatus: "Overdue",
    recommendedMessage:
      "We can reserve a bridal styling slot this week and pull pieces around your venue, date, and size preferences.",
    tone: "rose",
  },
  {
    id: "OPP-802",
    buyerName: "Maya Chen",
    productContext: "Vela Denim cropped jacket size/fit question",
    industryType: "Fashion / Apparel",
    source: "Instagram DM",
    currentStage: "First Reply Needed",
    estimatedValue: "$240",
    revenueAtRisk: "$240",
    owner: "Amara Shah",
    priority: "High",
    lastActivity: "Fit DM captured 18h ago",
    nextAction: "Reply with fit guidance and exchange reassurance.",
    dueStatus: "Overdue",
    recommendedMessage:
      "The cropped jacket runs true to size with a structured shoulder. Share your usual size and I will suggest the best fit.",
    tone: "cyan",
  },
  {
    id: "OPP-803",
    buyerName: "Elena Rodriguez",
    productContext: "Neroli Lab Vitamin C serum refill",
    industryType: "Beauty / Skincare",
    source: "Shopify / Ecommerce",
    currentStage: "Repeat Opportunity",
    estimatedValue: "$118",
    revenueAtRisk: "$118",
    owner: "Mina Cole",
    priority: "Medium",
    lastActivity: "60-day refill window opened today",
    nextAction: "Send saved routine and reorder link.",
    dueStatus: "Due today",
    recommendedMessage:
      "Your Vitamin C serum timing is right for a refill. I can resend the routine link and reorder option.",
    tone: "emerald",
  },
  {
    id: "OPP-804",
    buyerName: "Nadia Brooks",
    productContext: "Rue Muse limited knitwear new drop waitlist",
    industryType: "Fashion / Apparel",
    source: "Campaign",
    currentStage: "Qualified Interest",
    estimatedValue: "$960",
    revenueAtRisk: "$960",
    owner: "Luis Park",
    priority: "High",
    lastActivity: "Campaign preview clicked 4h ago",
    nextAction: "Send VIP early-access hold before inventory opens.",
    dueStatus: "Due today",
    recommendedMessage:
      "The knitwear drop you joined is open for early access today. I can hold your preferred color briefly.",
    tone: "emerald",
  },
  {
    id: "OPP-805",
    buyerName: "Priya Nair",
    productContext: "Saffron Skin evening routine bundle",
    industryType: "Beauty / Skincare",
    source: "WhatsApp",
    currentStage: "Payment Pending",
    estimatedValue: "$670",
    revenueAtRisk: "$670",
    owner: "Tessa Nguyen",
    priority: "Critical",
    lastActivity: "Buyer asked for payment link yesterday",
    nextAction: "Resend secure payment link and confirm checkout is valid.",
    dueStatus: "Overdue",
    recommendedMessage:
      "Your evening routine bundle is reserved. Here is the secure checkout link again if anything blocked payment.",
    tone: "amber",
  },
  {
    id: "OPP-806",
    buyerName: "Imani Wallace",
    productContext: "Coco Bloom lip oil shade restock",
    industryType: "Beauty / Skincare",
    source: "Back-in-stock form",
    currentStage: "Repeat Opportunity",
    estimatedValue: "$420",
    revenueAtRisk: "$420",
    owner: "Mina Cole",
    priority: "Medium",
    lastActivity: "Restock alert captured 5h ago",
    nextAction: "Send restock link and matching liner bundle.",
    dueStatus: "Due soon",
    recommendedMessage:
      "Your lip oil shade is back. I can send the restock link with the matching liner bundle while inventory is live.",
    tone: "amber",
  },
  {
    id: "OPP-807",
    buyerName: "Camila Torres",
    productContext: "Soho pop-up styling picks",
    industryType: "Fashion / Apparel",
    source: "Event / Pop-up",
    currentStage: "New Interest Captured",
    estimatedValue: "$540",
    revenueAtRisk: "$540",
    owner: "Unassigned",
    priority: "High",
    lastActivity: "CSV import completed without owner",
    nextAction: "Assign owner and send post-event styling recap.",
    dueStatus: "Overdue",
    recommendedMessage:
      "It was lovely meeting you at the pop-up. I saved the pieces you liked and can send sizes with checkout links.",
    tone: "rose",
  },
  {
    id: "OPP-808",
    buyerName: "Talia Monroe",
    productContext: "Glow Haus review and referral opportunity",
    industryType: "Beauty / Skincare",
    source: "Referral",
    currentStage: "Delivered / Post-Purchase",
    estimatedValue: "$300",
    revenueAtRisk: "$300",
    owner: "Luis Park",
    priority: "Medium",
    lastActivity: "Positive review captured 8h ago",
    nextAction: "Send UGC prompt and referral code.",
    dueStatus: "Due soon",
    recommendedMessage:
      "Thank you for the kind review. If you share a short routine clip, we can feature it and send your referral code.",
    tone: "indigo",
  },
  {
    id: "OPP-809",
    buyerName: "Jasmine Reed",
    productContext: "Order hold before dispatch",
    industryType: "Fashion / Apparel",
    source: "Order Risk Monitor",
    currentStage: "Order Confirmed",
    estimatedValue: "$310",
    revenueAtRisk: "$310",
    owner: "Tessa Nguyen",
    priority: "High",
    lastActivity: "Address validation flagged 2h ago",
    nextAction: "Confirm apartment number and release order hold.",
    dueStatus: "Due today",
    recommendedMessage:
      "Your order is ready, but we need one address detail before dispatch. Can you confirm the apartment number?",
    tone: "amber",
  },
  {
    id: "OPP-810",
    buyerName: "Arielle Stone",
    productContext: "Bare Kind sensitive-skin product question",
    industryType: "Beauty / Skincare",
    source: "Website chat",
    currentStage: "First Reply Needed",
    estimatedValue: "$155",
    revenueAtRisk: "$155",
    owner: "Mina Cole",
    priority: "High",
    lastActivity: "Ingredient question captured 4h ago",
    nextAction: "Answer ingredient concern with patch-test routine.",
    dueStatus: "Due today",
    recommendedMessage:
      "The calming cream is fragrance-free and designed for sensitive skin. I can share ingredients and patch-test steps.",
    tone: "cyan",
  },
];

const followUpRecoveryItems: FollowUpRecoveryItem[] = [
  {
    id: "FUP-901",
    buyerName: "Sophia Bennett",
    productContext: "Atelier Luma bridal appointment",
    followUpType: "Second nudge",
    source: "Website Form",
    revenueAtRisk: "$1,850",
    owner: "Amara Shah",
    dueStatus: "Overdue",
    lastContact: "No outbound reply yet",
    attemptCount: 0,
    buyerResponseStatus: "No reply yet",
    recommendedNextAction: "Send appointment windows and ask for wedding date.",
    messageTemplate:
      "I wanted to follow up on your bridal collection inquiry. We can still reserve a styling slot this week.",
    internalRecoveryNote: "Confirm venue/date before recommending trunk-show pieces.",
    tone: "rose",
  },
  {
    id: "FUP-902",
    buyerName: "Maya Chen",
    productContext: "Vela Denim cropped jacket",
    followUpType: "First reply",
    source: "Instagram DM",
    revenueAtRisk: "$240",
    owner: "Amara Shah",
    dueStatus: "Overdue",
    lastContact: "Instagram DM 18h ago",
    attemptCount: 0,
    buyerResponseStatus: "No reply yet",
    recommendedNextAction: "Reply with fit guidance and exchange reassurance.",
    messageTemplate:
      "The cropped jacket runs true to size. Share your usual fit and I will recommend the best size.",
    internalRecoveryNote: "Sizing concern is blocking purchase.",
    tone: "cyan",
  },
  {
    id: "FUP-903",
    buyerName: "Elena Rodriguez",
    productContext: "Vitamin C serum reorder window",
    followUpType: "Refill reminder",
    source: "Shopify / Ecommerce",
    revenueAtRisk: "$118",
    owner: "Mina Cole",
    dueStatus: "Due today",
    lastContact: "Last purchase 60 days ago",
    attemptCount: 1,
    buyerResponseStatus: "Monitoring",
    recommendedNextAction: "Send refill reminder with saved routine context.",
    messageTemplate:
      "Based on your last serum order, this is a good time to refill before you run low.",
    internalRecoveryNote: "Include sunscreen note for morning application.",
    tone: "emerald",
  },
  {
    id: "FUP-904",
    buyerName: "Nadia Brooks",
    productContext: "Rue Muse early-access knitwear drop",
    followUpType: "Second nudge",
    source: "Campaign",
    revenueAtRisk: "$960",
    owner: "Luis Park",
    dueStatus: "Due today",
    lastContact: "Campaign click 4h ago",
    attemptCount: 1,
    buyerResponseStatus: "Replied",
    recommendedNextAction: "Send early-access reminder before sizes sell through.",
    messageTemplate:
      "Early access is open today. I can hold your preferred color for the next two hours.",
    internalRecoveryNote: "Prioritize before medium sizes sell through.",
    tone: "emerald",
  },
  {
    id: "FUP-905",
    buyerName: "Priya Nair",
    productContext: "Saffron Skin routine bundle",
    followUpType: "Payment reminder",
    source: "WhatsApp",
    revenueAtRisk: "$670",
    owner: "Tessa Nguyen",
    dueStatus: "Overdue",
    lastContact: "WhatsApp reply yesterday",
    attemptCount: 2,
    buyerResponseStatus: "Replied",
    recommendedNextAction: "Resend checkout link and verify payment blocker.",
    messageTemplate:
      "Your evening routine bundle is reserved. Here is the secure checkout link again if payment was blocked.",
    internalRecoveryNote: "Buyer said yes and asked for payment link.",
    tone: "amber",
  },
  {
    id: "FUP-906",
    buyerName: "Camila Torres",
    productContext: "Soho pop-up styling recap",
    followUpType: "First reply",
    source: "Event / Pop-up",
    revenueAtRisk: "$540",
    owner: "Unassigned",
    dueStatus: "Overdue",
    lastContact: "Pop-up visit 1d ago",
    attemptCount: 0,
    buyerResponseStatus: "No reply yet",
    recommendedNextAction: "Assign owner and send saved pieces recap.",
    messageTemplate:
      "It was lovely meeting you at the pop-up. I saved the pieces you liked and can send checkout links.",
    internalRecoveryNote: "CSV import created lead without owner assignment.",
    tone: "rose",
  },
  {
    id: "FUP-907",
    buyerName: "Grace Miller",
    productContext: "Harper Row delivered denim order",
    followUpType: "Review request",
    source: "Order delivery event",
    revenueAtRisk: "$180",
    owner: "Luis Park",
    dueStatus: "Due today",
    lastContact: "Delivery confirmed yesterday",
    attemptCount: 0,
    buyerResponseStatus: "Monitoring",
    recommendedNextAction: "Ask for delivery satisfaction and review.",
    messageTemplate:
      "Your denim order shows as delivered. Did everything arrive as expected? A quick review would help.",
    internalRecoveryNote: "Ask about fit before requesting UGC.",
    tone: "indigo",
  },
  {
    id: "FUP-908",
    buyerName: "Talia Monroe",
    productContext: "Glow Haus referral and UGC opportunity",
    followUpType: "UGC/referral request",
    source: "Referral",
    revenueAtRisk: "$300",
    owner: "Luis Park",
    dueStatus: "Due soon",
    lastContact: "Positive review 8h ago",
    attemptCount: 0,
    buyerResponseStatus: "Monitoring",
    recommendedNextAction: "Send UGC prompt and referral code.",
    messageTemplate:
      "Thank you for the kind review. If you share a short routine clip, we can feature it and send your referral code.",
    internalRecoveryNote: "Good candidate for creator-style UGC request.",
    tone: "emerald",
  },
];

const paymentRecoveryItems: PaymentRecoveryItem[] = [
  {
    id: "PAY-1001",
    buyerName: "Priya Nair",
    productContext: "Saffron Skin evening routine bundle",
    paymentAmount: "$670",
    recoveredAmount: "$0",
    paymentStatus: "Overdue",
    source: "WhatsApp Checkout",
    paymentMethod: "WhatsApp checkout link",
    owner: "Tessa Nguyen",
    dueStatus: "Overdue",
    lastReminder: "30m ago",
    reminderCount: 2,
    riskLevel: "Critical",
    recommendedNextAction: "Resend secure payment link and confirm checkout is still valid.",
    paymentTemplate:
      "Your evening routine bundle is reserved. Here is the secure checkout link again; I can help if anything blocked payment.",
    tone: "amber",
  },
  {
    id: "PAY-1002",
    buyerName: "Sophia Bennett",
    productContext: "Bridal appointment deposit",
    paymentAmount: "$500",
    recoveredAmount: "$0",
    paymentStatus: "Pending",
    source: "Website Form",
    paymentMethod: "Invoice link",
    owner: "Amara Shah",
    dueStatus: "Due today",
    lastReminder: "No reminder yet",
    reminderCount: 0,
    riskLevel: "High",
    recommendedNextAction: "Send deposit link after appointment confirmation.",
    paymentTemplate:
      "Your bridal styling appointment can be reserved with this deposit link. I can help if the link does not open.",
    tone: "rose",
  },
  {
    id: "PAY-1003",
    buyerName: "Nadia Brooks",
    productContext: "New drop knitwear checkout",
    paymentAmount: "$960",
    recoveredAmount: "$0",
    paymentStatus: "Pending",
    source: "Shopify / Ecommerce",
    paymentMethod: "Shopify checkout",
    owner: "Luis Park",
    dueStatus: "Due today",
    lastReminder: "1h ago",
    reminderCount: 1,
    riskLevel: "High",
    recommendedNextAction: "Send checkout reminder before early-access hold expires.",
    paymentTemplate:
      "Your early-access item is still reserved briefly. Here is the checkout link before inventory opens publicly.",
    tone: "emerald",
  },
  {
    id: "PAY-1004",
    buyerName: "Jasmine Reed",
    productContext: "Address-held COD order",
    paymentAmount: "$310",
    recoveredAmount: "$0",
    paymentStatus: "COD confirmation needed",
    source: "Shopify / Ecommerce",
    paymentMethod: "COD confirmation",
    owner: "Tessa Nguyen",
    dueStatus: "Due today",
    lastReminder: "No reminder yet",
    reminderCount: 0,
    riskLevel: "High",
    recommendedNextAction: "Confirm delivery details and COD commitment before dispatch.",
    paymentTemplate:
      "Your order is ready for dispatch. Please confirm the address detail and COD availability so we can release it.",
    tone: "amber",
  },
  {
    id: "PAY-1005",
    buyerName: "Elena Rodriguez",
    productContext: "Vitamin C serum refill payment link",
    paymentAmount: "$118",
    recoveredAmount: "$0",
    paymentStatus: "Reminder sent",
    source: "Shopify / Ecommerce",
    paymentMethod: "Saved reorder link",
    owner: "Mina Cole",
    dueStatus: "Due soon",
    lastReminder: "2h ago",
    reminderCount: 1,
    riskLevel: "Medium",
    recommendedNextAction: "Watch reorder link completion and resend routine context if needed.",
    paymentTemplate:
      "Your serum refill link is ready with your saved routine. I can resend it if the checkout did not complete.",
    tone: "emerald",
  },
  {
    id: "PAY-1006",
    buyerName: "Arielle Stone",
    productContext: "Sensitive-skin starter bundle",
    paymentAmount: "$155",
    recoveredAmount: "$0",
    paymentStatus: "Failed payment",
    source: "Website chat",
    paymentMethod: "Card checkout",
    owner: "Mina Cole",
    dueStatus: "Overdue",
    lastReminder: "Yesterday",
    reminderCount: 1,
    riskLevel: "Medium",
    recommendedNextAction: "Send alternate checkout link and ingredient reassurance.",
    paymentTemplate:
      "It looks like the starter bundle checkout did not complete. I can send a fresh link with the ingredient notes.",
    tone: "rose",
  },
  {
    id: "PAY-1007",
    buyerName: "Camila Torres",
    productContext: "Pop-up saved pieces order",
    paymentAmount: "$540",
    recoveredAmount: "$0",
    paymentStatus: "Pending",
    source: "Event / Pop-up",
    paymentMethod: "Manual invoice",
    owner: "Unassigned",
    dueStatus: "Overdue",
    lastReminder: "No reminder yet",
    reminderCount: 0,
    riskLevel: "High",
    recommendedNextAction: "Assign owner and send unpaid event order link.",
    paymentTemplate:
      "I saved the pieces you liked at the pop-up and can send a secure payment link with sizes.",
    tone: "rose",
  },
  {
    id: "PAY-1008",
    buyerName: "Maya Chen",
    productContext: "Boutique denim pre-order invoice",
    paymentAmount: "$2,400",
    recoveredAmount: "$0",
    paymentStatus: "Partial payment",
    source: "Manual Entry",
    paymentMethod: "Wholesale invoice",
    owner: "Amara Shah",
    dueStatus: "Due soon",
    lastReminder: "Yesterday",
    reminderCount: 2,
    riskLevel: "High",
    recommendedNextAction: "Confirm remaining invoice balance and delivery window.",
    paymentTemplate:
      "Thank you for the partial payment. I can confirm the remaining balance link and delivery window for the denim pre-order.",
    tone: "indigo",
  },
];

const recoveredRevenueItems: RecoveredRevenueItem[] = [
  {
    id: "REV-1101",
    buyerName: "Elena Rodriguez",
    recoveryType: "Refill reorder recovered",
    recoveredAmount: "$118",
    originalRevenueAtRisk: "$118",
    source: "Shopify / Ecommerce",
    owner: "Mina Cole",
    actionThatRecoveredIt: "Serum refill reminder with saved routine link",
    dateRecovered: "Apr 28",
    timeToRecovery: "3h",
    relatedCase: "RR-1042",
    notes: "Buyer reordered after routine reminder.",
    leakType: "Repeat revenue",
    tone: "emerald",
  },
  {
    id: "REV-1102",
    buyerName: "Priya Nair",
    recoveryType: "Payment recovered",
    recoveredAmount: "$670",
    originalRevenueAtRisk: "$670",
    source: "WhatsApp Checkout",
    owner: "Tessa Nguyen",
    actionThatRecoveredIt: "Payment reminder with fresh checkout link",
    dateRecovered: "Apr 27",
    timeToRecovery: "22h",
    relatedCase: "RR-1046",
    notes: "Bundle payment recovered after second reminder.",
    leakType: "Payment pending",
    tone: "amber",
  },
  {
    id: "REV-1103",
    buyerName: "Sophia Bennett",
    recoveryType: "Follow-up converted",
    recoveredAmount: "$1,850",
    originalRevenueAtRisk: "$1,850",
    source: "Website Form",
    owner: "Amara Shah",
    actionThatRecoveredIt: "Bridal consultation follow-up with appointment windows",
    dateRecovered: "Apr 26",
    timeToRecovery: "1d 6h",
    relatedCase: "RR-1041",
    notes: "Consultation booked after second follow-up.",
    leakType: "Follow-up leak",
    tone: "rose",
  },
  {
    id: "REV-1104",
    buyerName: "Nadia Brooks",
    recoveryType: "Repeat purchase recovered",
    recoveredAmount: "$960",
    originalRevenueAtRisk: "$960",
    source: "Campaign",
    owner: "Luis Park",
    actionThatRecoveredIt: "VIP early-access hold before public launch",
    dateRecovered: "Apr 25",
    timeToRecovery: "4h",
    relatedCase: "RR-1044",
    notes: "Waitlist buyer purchased before sizes sold through.",
    leakType: "Repeat revenue",
    tone: "emerald",
  },
  {
    id: "REV-1105",
    buyerName: "Imani Wallace",
    recoveryType: "Restock purchase recovered",
    recoveredAmount: "$420",
    originalRevenueAtRisk: "$420",
    source: "Back-in-stock form",
    owner: "Mina Cole",
    actionThatRecoveredIt: "Restock notification with matching liner bundle",
    dateRecovered: "Apr 24",
    timeToRecovery: "5h",
    relatedCase: "RR-1045",
    notes: "Shade restock converted with bundle suggestion.",
    leakType: "Restock waiting",
    tone: "amber",
  },
  {
    id: "REV-1106",
    buyerName: "Talia Monroe",
    recoveryType: "Referral/UGC influenced sale",
    recoveredAmount: "$300",
    originalRevenueAtRisk: "$300",
    source: "Referral",
    owner: "Luis Park",
    actionThatRecoveredIt: "Review request led to referral code purchase",
    dateRecovered: "Apr 23",
    timeToRecovery: "2d",
    relatedCase: "RR-1048",
    notes: "Referral sale attributed to post-purchase UGC prompt.",
    leakType: "Post-purchase recovery",
    tone: "indigo",
  },
  {
    id: "REV-1107",
    buyerName: "Arielle Stone",
    recoveryType: "Reactivated buyer",
    recoveredAmount: "$155",
    originalRevenueAtRisk: "$155",
    source: "Website chat",
    owner: "Mina Cole",
    actionThatRecoveredIt: "Ingredient reassurance and patch-test routine",
    dateRecovered: "Apr 22",
    timeToRecovery: "7h",
    relatedCase: "RR-1049",
    notes: "Sensitive-skin concern resolved with ingredient guidance.",
    leakType: "First reply needed",
    tone: "cyan",
  },
  {
    id: "REV-1108",
    buyerName: "Grace Miller",
    recoveryType: "Post-purchase upsell",
    recoveredAmount: "$180",
    originalRevenueAtRisk: "$180",
    source: "Order delivery event",
    owner: "Luis Park",
    actionThatRecoveredIt: "Delivery satisfaction check with next-wash restock preference",
    dateRecovered: "Apr 21",
    timeToRecovery: "1d",
    relatedCase: "RR-1047",
    notes: "Review request created second-purchase interest.",
    leakType: "Post-purchase recovery",
    tone: "indigo",
  },
];

const orderRiskItems: OrderRiskItem[] = [
  {
    id: "ORD-1201",
    buyerName: "Sophia Bennett",
    orderContext: "Atelier Luma bridal capsule deposit",
    industryType: "Fashion / Apparel",
    orderValue: "$1,850",
    riskType: "Payment Issue",
    paymentStatus: "Deposit pending",
    deliveryStatus: "Appointment hold not confirmed",
    source: "Website Form",
    owner: "Amara Shah",
    priority: "Critical",
    lastUpdate: "Deposit link not opened after appointment follow-up",
    dueStatus: "Overdue",
    nextRequiredAction: "Confirm deposit intent and preserve the bridal appointment window.",
    internalOrderNote: "High-ticket bridal revenue can leak if appointment is not secured today.",
    suggestedMessage:
      "Your bridal styling window is still available. I can resend the deposit link and hold the appointment today.",
    tone: "rose",
  },
  {
    id: "ORD-1202",
    buyerName: "Maya Chen",
    orderContext: "Vela Denim jacket shipment",
    industryType: "Fashion / Apparel",
    orderValue: "$240",
    riskType: "Address Issue",
    paymentStatus: "Paid",
    deliveryStatus: "Address verification needed",
    source: "Instagram DM",
    owner: "Amara Shah",
    priority: "High",
    lastUpdate: "Carrier flagged incomplete unit number",
    dueStatus: "Due today",
    nextRequiredAction: "Verify address before shipment creates delivery delay.",
    internalOrderNote: "Fit-sensitive buyer; delayed delivery could increase exchange risk.",
    suggestedMessage:
      "Your denim order is ready to ship, but we need one address detail before releasing it.",
    tone: "cyan",
  },
  {
    id: "ORD-1203",
    buyerName: "Priya Nair",
    orderContext: "Saffron Skin routine bundle",
    industryType: "Beauty / Skincare",
    orderValue: "$670",
    riskType: "Payment Issue",
    paymentStatus: "Payment/order mismatch",
    deliveryStatus: "Not released",
    source: "WhatsApp",
    owner: "Tessa Nguyen",
    priority: "Critical",
    lastUpdate: "Buyer selected bundle but payment event did not match order record",
    dueStatus: "Overdue",
    nextRequiredAction: "Match payment link to order and resend checkout if needed.",
    internalOrderNote: "Payment pending leak can block confirmed bundle revenue.",
    suggestedMessage:
      "I am checking the payment link for your routine bundle and can resend a valid checkout now.",
    tone: "amber",
  },
  {
    id: "ORD-1204",
    buyerName: "Elena Rodriguez",
    orderContext: "Neroli Lab Vitamin C serum refill",
    industryType: "Beauty / Skincare",
    orderValue: "$118",
    riskType: "Delivery Delay",
    paymentStatus: "Paid",
    deliveryStatus: "Delayed in transit",
    source: "Shopify / Ecommerce",
    owner: "Mina Cole",
    priority: "Medium",
    lastUpdate: "Carrier delay after refill order shipped",
    dueStatus: "Due today",
    nextRequiredAction: "Send delay reassurance and protect refill experience.",
    internalOrderNote: "Refill timing is sensitive; delay could break routine trust.",
    suggestedMessage:
      "Your serum refill is delayed in transit. I am watching the delivery and can help if it does not move today.",
    tone: "emerald",
  },
  {
    id: "ORD-1205",
    buyerName: "Imani Wallace",
    orderContext: "Coco Bloom lip oil restock shade",
    industryType: "Beauty / Skincare",
    orderValue: "$420",
    riskType: "Needs Ops Review",
    paymentStatus: "Paid",
    deliveryStatus: "Shade confirmation missing",
    source: "Back-in-stock form",
    owner: "Mina Cole",
    priority: "Medium",
    lastUpdate: "Restock order captured without final shade confirmation",
    dueStatus: "Due soon",
    nextRequiredAction: "Confirm shade before fulfillment to prevent return risk.",
    internalOrderNote: "Wrong shade fulfillment could create return/exchange leakage.",
    suggestedMessage:
      "Before we pack your restock order, can you confirm the lip oil shade you want us to send?",
    tone: "amber",
  },
  {
    id: "ORD-1206",
    buyerName: "Camila Torres",
    orderContext: "Soho pop-up saved pieces order",
    industryType: "Fashion / Apparel",
    orderValue: "$540",
    riskType: "Unassigned",
    paymentStatus: "Unpaid",
    deliveryStatus: "Not fulfilled",
    source: "Event / Pop-up",
    owner: "Unassigned",
    priority: "High",
    lastUpdate: "Event order imported without owner",
    dueStatus: "Overdue",
    nextRequiredAction: "Assign owner and send unpaid event order link.",
    internalOrderNote: "Pop-up interest can go cold without same-day recovery.",
    suggestedMessage:
      "I saved the pieces you liked at the pop-up and can send a secure payment link with sizes.",
    tone: "rose",
  },
  {
    id: "ORD-1207",
    buyerName: "Arielle Stone",
    orderContext: "Bare Kind sensitive-skin starter kit",
    industryType: "Beauty / Skincare",
    orderValue: "$155",
    riskType: "Complaint",
    paymentStatus: "Paid",
    deliveryStatus: "Delivered",
    source: "Website chat",
    owner: "Mina Cole",
    priority: "High",
    lastUpdate: "Buyer reported irritation concern after first use",
    dueStatus: "Due today",
    nextRequiredAction: "Follow up with usage guidance and complaint recovery.",
    internalOrderNote: "Sensitive-skin concern needs fast reassurance to avoid refund leakage.",
    suggestedMessage:
      "I saw your note about sensitivity. Can you pause use and share when the reaction started so we can help?",
    tone: "cyan",
  },
  {
    id: "ORD-1208",
    buyerName: "Jasmine Reed",
    orderContext: "Harper Row routine bundle exchange risk",
    industryType: "Fashion / Apparel",
    orderValue: "$310",
    riskType: "Return / Exchange Risk",
    paymentStatus: "Paid",
    deliveryStatus: "Address hold before dispatch",
    source: "Order Risk Monitor",
    owner: "Tessa Nguyen",
    priority: "High",
    lastUpdate: "Address validation flagged incomplete delivery details",
    dueStatus: "Due today",
    nextRequiredAction: "Confirm address and prevent failed delivery or return risk.",
    internalOrderNote: "Hold dispatch until apartment number is confirmed.",
    suggestedMessage:
      "Your order is ready, but we need one address detail before dispatch. Can you confirm the apartment number?",
    tone: "amber",
  },
  {
    id: "ORD-1209",
    buyerName: "Maya Chen",
    orderContext: "Boutique denim pre-order invoice",
    industryType: "Fashion / Apparel",
    orderValue: "$2,400",
    riskType: "Payment Issue",
    paymentStatus: "Invoice confirmation pending",
    deliveryStatus: "Awaiting production release",
    source: "Manual Entry",
    owner: "Amara Shah",
    priority: "High",
    lastUpdate: "Wholesale invoice partially confirmed",
    dueStatus: "Due soon",
    nextRequiredAction: "Confirm invoice balance and delivery window.",
    internalOrderNote: "Boutique order should not move forward until invoice confirmation is clean.",
    suggestedMessage:
      "I can confirm the remaining invoice balance and delivery window for the denim pre-order today.",
    tone: "indigo",
  },
];

const deliveryFollowUpItems: DeliveryFollowUpItem[] = [
  {
    id: "DLV-1301",
    buyerName: "Grace Miller",
    orderContext: "Harper Row denim order",
    deliveryStatus: "Delivered",
    deliveryTiming: "Delivered yesterday",
    orderValue: "$180",
    owner: "Luis Park",
    source: "Order delivery event",
    postDeliveryStage: "Satisfaction check due",
    opportunityType: "Review and second-purchase prompt",
    nextAction: "Ask whether the fit and delivery experience were right.",
    messageTemplate:
      "Your denim order shows as delivered. Did everything arrive and fit as expected?",
    notes: "Ask about fit before requesting UGC.",
    tone: "indigo",
  },
  {
    id: "DLV-1302",
    buyerName: "Sophia Bennett",
    orderContext: "Bridal capsule consultation package",
    deliveryStatus: "Delivered",
    deliveryTiming: "Delivered today",
    orderValue: "$1,850",
    owner: "Amara Shah",
    source: "Website Form",
    postDeliveryStage: "Satisfaction check due",
    opportunityType: "Styling feedback",
    nextAction: "Ask for styling feedback and next appointment preference.",
    messageTemplate:
      "Your bridal consultation package was delivered. Did the styling direction feel aligned with your venue and date?",
    notes: "High-ticket post-purchase touch can protect referral and review value.",
    tone: "rose",
  },
  {
    id: "DLV-1303",
    buyerName: "Elena Rodriguez",
    orderContext: "Vitamin C serum refill",
    deliveryStatus: "Delivered",
    deliveryTiming: "Delivered 2 days ago",
    orderValue: "$118",
    owner: "Mina Cole",
    source: "Shopify / Ecommerce",
    postDeliveryStage: "Refill timing started",
    opportunityType: "Next refill timer",
    nextAction: "Start refill timer and confirm routine continuity.",
    messageTemplate:
      "Your serum refill has arrived. I will keep your refill timing in view so you do not run low.",
    notes: "Repeat revenue timer should start after delivery.",
    tone: "emerald",
  },
  {
    id: "DLV-1304",
    buyerName: "Priya Nair",
    orderContext: "Saffron Skin routine bundle",
    deliveryStatus: "Delivered",
    deliveryTiming: "Delivered today",
    orderValue: "$670",
    owner: "Tessa Nguyen",
    source: "WhatsApp",
    postDeliveryStage: "Issue follow-up needed",
    opportunityType: "Product fit check",
    nextAction: "Check product fit and prevent return/exchange risk.",
    messageTemplate:
      "Your routine bundle was delivered. Does everything match your shade and routine preferences?",
    notes: "Payment recovered buyer; protect experience after delivery.",
    tone: "amber",
  },
  {
    id: "DLV-1305",
    buyerName: "Arielle Stone",
    orderContext: "Sensitive-skin starter kit",
    deliveryStatus: "Delivered",
    deliveryTiming: "Delivered 1 day ago",
    orderValue: "$155",
    owner: "Mina Cole",
    source: "Website chat",
    postDeliveryStage: "Satisfaction check due",
    opportunityType: "Product experience check",
    nextAction: "Ask about reaction and experience before review request.",
    messageTemplate:
      "Your starter kit arrived. How did the first use feel on your skin?",
    notes: "Sensitive-skin buyer needs experience check before social proof ask.",
    tone: "cyan",
  },
  {
    id: "DLV-1306",
    buyerName: "Imani Wallace",
    orderContext: "Coco Bloom lip oil restock",
    deliveryStatus: "Delivered",
    deliveryTiming: "Delivered 3 days ago",
    orderValue: "$420",
    owner: "Mina Cole",
    source: "Back-in-stock form",
    postDeliveryStage: "Review request ready",
    opportunityType: "Review request",
    nextAction: "Ask for shade review and restock experience.",
    messageTemplate:
      "Your lip oil shade arrived. A quick review would help other buyers waiting for this shade.",
    notes: "Restock delivery can produce review and UGC value.",
    tone: "amber",
  },
  {
    id: "DLV-1307",
    buyerName: "Nadia Brooks",
    orderContext: "Rue Muse new drop knitwear",
    deliveryStatus: "Delivered",
    deliveryTiming: "Delivered today",
    orderValue: "$960",
    owner: "Luis Park",
    source: "Campaign",
    postDeliveryStage: "Second purchase prompt",
    opportunityType: "Matching piece offer",
    nextAction: "Offer matching piece while new drop inventory is active.",
    messageTemplate:
      "Your new drop order arrived. I can show the matching piece while inventory is still available.",
    notes: "VIP buyer with strong repeat potential.",
    tone: "emerald",
  },
  {
    id: "DLV-1308",
    buyerName: "Camila Torres",
    orderContext: "Soho pop-up saved pieces order",
    deliveryStatus: "Delivered",
    deliveryTiming: "Delivered 2 days ago",
    orderValue: "$540",
    owner: "Amara Shah",
    source: "Event / Pop-up",
    postDeliveryStage: "Review request ready",
    opportunityType: "Post-event thank-you",
    nextAction: "Send thank-you and ask how the selected pieces worked.",
    messageTemplate:
      "Thank you again for visiting the pop-up. Did the pieces arrive and work for your styling plans?",
    notes: "Event buyers need warm post-delivery follow-up.",
    tone: "rose",
  },
];

const postPurchaseOpportunities: PostPurchaseOpportunity[] = [
  {
    id: "PP-1401",
    buyerName: "Maya Chen",
    orderContext: "Vela Denim cropped jacket",
    opportunityType: "Review request",
    orderValue: "$240",
    buyerStatus: "High-intent denim buyer",
    deliveryDate: "Delivered 4 days ago",
    source: "Instagram DM",
    owner: "Amara Shah",
    requestStatus: "Not sent",
    potentialValue: "$240 social proof",
    recommendedNextAction: "Ask for fit review after exchange reassurance converted.",
    messageTemplate:
      "How did the cropped jacket fit? A quick fit review would help other buyers choosing sizes.",
    industryType: "Fashion / Apparel",
    tone: "cyan",
  },
  {
    id: "PP-1402",
    buyerName: "Sophia Bennett",
    orderContext: "Atelier Luma bridal capsule styling",
    opportunityType: "Styling testimonial",
    orderValue: "$1,850",
    buyerStatus: "VIP bridal buyer",
    deliveryDate: "Consultation delivered today",
    source: "Website Form",
    owner: "Amara Shah",
    requestStatus: "Not sent",
    potentialValue: "$1,850 testimonial value",
    recommendedNextAction: "Ask for bridal styling feedback after appointment satisfaction check.",
    messageTemplate:
      "Would you be open to sharing a short note about the bridal styling experience?",
    industryType: "Fashion / Apparel",
    tone: "rose",
  },
  {
    id: "PP-1403",
    buyerName: "Elena Rodriguez",
    orderContext: "Vitamin C serum refill",
    opportunityType: "Before/after skincare feedback",
    orderValue: "$118",
    buyerStatus: "Refill ready skincare buyer",
    deliveryDate: "Delivered 2 days ago",
    source: "Shopify / Ecommerce",
    owner: "Mina Cole",
    requestStatus: "Needs follow-up",
    potentialValue: "$118 repeat proof",
    recommendedNextAction: "Ask for before/after feedback after routine check.",
    messageTemplate:
      "After you restart the serum, we would love to hear how your routine feels over the next few weeks.",
    industryType: "Beauty / Skincare",
    tone: "emerald",
  },
  {
    id: "PP-1404",
    buyerName: "Priya Nair",
    orderContext: "Saffron Skin evening routine bundle",
    opportunityType: "Review request",
    orderValue: "$670",
    buyerStatus: "Recovered payment buyer",
    deliveryDate: "Delivered today",
    source: "WhatsApp",
    owner: "Tessa Nguyen",
    requestStatus: "Not sent",
    potentialValue: "$670 review value",
    recommendedNextAction: "Check product fit first, then ask for routine review.",
    messageTemplate:
      "Once you have tried the bundle, a short review of the routine would be so helpful.",
    industryType: "Beauty / Skincare",
    tone: "amber",
  },
  {
    id: "PP-1405",
    buyerName: "Imani Wallace",
    orderContext: "Coco Bloom lip oil restock",
    opportunityType: "UGC request",
    orderValue: "$420",
    buyerStatus: "Restock waiting buyer",
    deliveryDate: "Delivered 3 days ago",
    source: "Back-in-stock form",
    owner: "Mina Cole",
    requestStatus: "Not sent",
    potentialValue: "$420 UGC impact",
    recommendedNextAction: "Ask for shade photo and short restock review.",
    messageTemplate:
      "If you share a quick photo of the shade, we can feature it for other buyers waiting on restocks.",
    industryType: "Beauty / Skincare",
    tone: "amber",
  },
  {
    id: "PP-1406",
    buyerName: "Nadia Brooks",
    orderContext: "Rue Muse new drop knitwear",
    opportunityType: "Try-on/photo request",
    orderValue: "$960",
    buyerStatus: "VIP buyer",
    deliveryDate: "Delivered today",
    source: "Campaign",
    owner: "Luis Park",
    requestStatus: "Needs follow-up",
    potentialValue: "$960 social proof",
    recommendedNextAction: "Ask for try-on content after delivery satisfaction check.",
    messageTemplate:
      "If you style the new knitwear this week, we would love to see a try-on photo.",
    industryType: "Fashion / Apparel",
    tone: "emerald",
  },
  {
    id: "PP-1407",
    buyerName: "Talia Monroe",
    orderContext: "Glow Haus routine purchase",
    opportunityType: "Referral request",
    orderValue: "$300",
    buyerStatus: "UGC/referral candidate",
    deliveryDate: "Review received 8h ago",
    source: "Referral",
    owner: "Luis Park",
    requestStatus: "Sent",
    potentialValue: "$300 referral value",
    recommendedNextAction: "Follow up on referral code and UGC prompt.",
    messageTemplate:
      "Here is your referral code for friends who asked about your routine.",
    industryType: "Beauty / Skincare",
    tone: "indigo",
  },
  {
    id: "PP-1408",
    buyerName: "Arielle Stone",
    orderContext: "Sensitive-skin starter kit",
    opportunityType: "Review request",
    orderValue: "$155",
    buyerStatus: "Sensitive-skin buyer",
    deliveryDate: "Delivered 1 day ago",
    source: "Website chat",
    owner: "Mina Cole",
    requestStatus: "Not sent",
    potentialValue: "$155 trust-building value",
    recommendedNextAction: "Ask for product-experience review after reaction check.",
    messageTemplate:
      "If the starter kit is working well for your skin, a short experience review would help similar buyers.",
    industryType: "Beauty / Skincare",
    tone: "cyan",
  },
];

const productItems: ProductItem[] = [
  {
    id: "PROD-1501",
    productName: "Atelier Luma bridal capsule dress",
    productType: "High-ticket fashion",
    industryType: "Fashion / Apparel",
    category: "Bridal Collection",
    productFolder: "Bridal Collection",
    skuCount: 6,
    priceRange: "$1,450 - $2,200",
    stockRestockStatus: "Appointment-led, limited sizes",
    refillCycle: "Not refill-led",
    productTags: ["High Ticket", "Consultation Needed", "Appointment Follow-up"],
    linkedDemandCount: 18,
    openRecoveryValue: "$12,400",
    recoveredValue: "$5,550",
    recommendedProductAction: "Keep bridal follow-up templates tied to size, appointment, and deposit recovery.",
    active: true,
    tone: "rose",
  },
  {
    id: "PROD-1502",
    productName: "Harper Row denim",
    productType: "Apparel core item",
    industryType: "Fashion / Apparel",
    category: "Denim",
    productFolder: "Denim Drop",
    skuCount: 10,
    priceRange: "$180 - $260",
    stockRestockStatus: "Restock interest building",
    refillCycle: "Not refill-led",
    productTags: ["Size / Fit", "Restock Waiting", "Review Opportunity"],
    linkedDemandCount: 26,
    openRecoveryValue: "$6,180",
    recoveredValue: "$2,340",
    recommendedProductAction: "Add fit tags and restock waitlist prompts to denim variants.",
    active: true,
    tone: "cyan",
  },
  {
    id: "PROD-1503",
    productName: "Denim cropped jacket",
    productType: "Limited apparel piece",
    industryType: "Fashion / Apparel",
    category: "Outerwear",
    productFolder: "New Arrivals",
    skuCount: 8,
    priceRange: "$240 - $280",
    stockRestockStatus: "Low stock, size questions active",
    refillCycle: "Not refill-led",
    productTags: ["New Drop", "Size / Fit", "Exchange Guidance"],
    linkedDemandCount: 14,
    openRecoveryValue: "$3,360",
    recoveredValue: "$1,440",
    recommendedProductAction: "Connect size/fit replies to the active cropped jacket SKUs.",
    active: true,
    tone: "amber",
  },
  {
    id: "PROD-1504",
    productName: "Rue Muse knitwear new drop",
    productType: "New collection",
    industryType: "Fashion / Apparel",
    category: "Knitwear",
    productFolder: "VIP Early Access",
    skuCount: 7,
    priceRange: "$320 - $480",
    stockRestockStatus: "VIP early access open",
    refillCycle: "Not refill-led",
    productTags: ["New Drop", "VIP", "Second-Purchase Prompt"],
    linkedDemandCount: 22,
    openRecoveryValue: "$8,900",
    recoveredValue: "$3,840",
    recommendedProductAction: "Tag early-access buyers for launch follow-up and matching-piece prompts.",
    active: true,
    tone: "emerald",
  },
  {
    id: "PROD-1505",
    productName: "Velvet Lane order pieces",
    productType: "Event apparel",
    industryType: "Fashion / Apparel",
    category: "Event / Pop-up",
    productFolder: "Event / Pop-up Products",
    skuCount: 12,
    priceRange: "$220 - $680",
    stockRestockStatus: "Pop-up orders need owner mapping",
    refillCycle: "Not refill-led",
    productTags: ["Event Lead", "Owner Needed", "Post-Event Follow-up"],
    linkedDemandCount: 31,
    openRecoveryValue: "$9,720",
    recoveredValue: "$4,100",
    recommendedProductAction: "Assign event products to owners before CSV import creates unassigned demand.",
    active: true,
    tone: "indigo",
  },
  {
    id: "PROD-1506",
    productName: "Limited restock pieces",
    productType: "Restock apparel",
    industryType: "Fashion / Apparel",
    category: "Restock Interest",
    productFolder: "Restock Waitlist",
    skuCount: 9,
    priceRange: "$120 - $540",
    stockRestockStatus: "Restock waiting",
    refillCycle: "Not refill-led",
    productTags: ["Restock Waiting", "Notify Buyers", "Demand Watch"],
    linkedDemandCount: 37,
    openRecoveryValue: "$11,200",
    recoveredValue: "$6,320",
    recommendedProductAction: "Keep restock notification actions ready by SKU and size.",
    active: true,
    tone: "rose",
  },
  {
    id: "PROD-1507",
    productName: "Vitamin C serum",
    productType: "Skincare refill product",
    industryType: "Beauty / Skincare",
    category: "Serums",
    productFolder: "Serums",
    skuCount: 4,
    priceRange: "$88 - $118",
    stockRestockStatus: "In stock, refill cycle active",
    refillCycle: "60 days",
    productTags: ["Refill Product", "Routine Step", "Repeat Revenue"],
    linkedDemandCount: 42,
    openRecoveryValue: "$4,956",
    recoveredValue: "$7,080",
    recommendedProductAction: "Keep 60-day refill reminders connected to delivered serum orders.",
    active: true,
    tone: "emerald",
  },
  {
    id: "PROD-1508",
    productName: "Sensitive skin starter kit",
    productType: "Skincare bundle",
    industryType: "Beauty / Skincare",
    category: "Sensitive Skin",
    productFolder: "Sensitive Skin",
    skuCount: 5,
    priceRange: "$135 - $175",
    stockRestockStatus: "Active, human review recommended",
    refillCycle: "45 days",
    productTags: ["Sensitive Skin Check", "Routine Step", "Review Opportunity"],
    linkedDemandCount: 19,
    openRecoveryValue: "$3,020",
    recoveredValue: "$2,480",
    recommendedProductAction: "Add human-review tags to sensitive-skin product questions.",
    active: true,
    tone: "cyan",
  },
  {
    id: "PROD-1509",
    productName: "Saffron Skin cleanser set",
    productType: "Skincare routine set",
    industryType: "Beauty / Skincare",
    category: "Cleansers",
    productFolder: "Cleansers",
    skuCount: 6,
    priceRange: "$72 - $148",
    stockRestockStatus: "Bundle demand active",
    refillCycle: "45 days",
    productTags: ["Bundle Product", "Routine Step", "Refill Reminder"],
    linkedDemandCount: 24,
    openRecoveryValue: "$3,780",
    recoveredValue: "$4,360",
    recommendedProductAction: "Link cleanser set variants to bundle payment recovery and refill prompts.",
    active: true,
    tone: "amber",
  },
  {
    id: "PROD-1510",
    productName: "Coco Bloom lip oil shade",
    productType: "Cosmetics shade product",
    industryType: "Beauty / Skincare",
    category: "Lip Products",
    productFolder: "Lip Products",
    skuCount: 9,
    priceRange: "$28 - $42",
    stockRestockStatus: "Shade restock waiting",
    refillCycle: "75 days",
    productTags: ["Shade Match", "Restock Waiting", "UGC Candidate"],
    linkedDemandCount: 44,
    openRecoveryValue: "$5,640",
    recoveredValue: "$4,980",
    recommendedProductAction: "Keep shade-level restock tags mapped to buyers waiting on specific colors.",
    active: true,
    tone: "rose",
  },
  {
    id: "PROD-1511",
    productName: "Routine bundle",
    productType: "Beauty bundle",
    industryType: "Beauty / Skincare",
    category: "Bundle Product",
    productFolder: "Routine Bundles",
    skuCount: 8,
    priceRange: "$260 - $670",
    stockRestockStatus: "Payment recovery active",
    refillCycle: "60 days",
    productTags: ["Bundle Product", "Payment Pending", "Repeat Revenue"],
    linkedDemandCount: 27,
    openRecoveryValue: "$9,450",
    recoveredValue: "$6,030",
    recommendedProductAction: "Keep bundle SKU data clean for WhatsApp payment recovery and refill timing.",
    active: true,
    tone: "indigo",
  },
  {
    id: "PROD-1512",
    productName: "Night repair cream",
    productType: "Skincare refill product",
    industryType: "Beauty / Skincare",
    category: "Moisturizers",
    productFolder: "Refill Products",
    skuCount: 3,
    priceRange: "$96 - $132",
    stockRestockStatus: "Inactive until formula update",
    refillCycle: "90 days",
    productTags: ["Refill Product", "Repeat Revenue"],
    linkedDemandCount: 8,
    openRecoveryValue: "$1,120",
    recoveredValue: "$2,180",
    recommendedProductAction: "Mark inactive until formula note and refill timing are refreshed.",
    active: false,
    tone: "gray",
  },
];

const skuVariants: SKUVariant[] = [
  {
    id: "SKU-1601",
    sku: "BRD-CAP-IVR-04",
    productName: "Atelier Luma bridal capsule dress",
    variant: "Structured gown",
    size: "4",
    colorShade: "Ivory",
    category: "Bridal Collection",
    price: "$1,850",
    stockStatus: "Appointment-led",
    restockStatus: "Consultation needed",
    refillCycle: "N/A",
    productFolder: "Bridal Collection",
    tags: "High Ticket, Consultation Needed, Appointment Follow-up",
    linkedDemand: 6,
    recoveryValue: "$5,550",
    lastUpdated: "Today 9:10 AM",
    industryType: "Fashion / Apparel",
    fitType: "Structured",
    skinConcern: "N/A",
    routineStep: "N/A",
    bundleEligibility: "Styling package",
    sensitiveSkinFlag: "N/A",
    active: true,
    tone: "rose",
  },
  {
    id: "SKU-1602",
    sku: "HRD-JEAN-LT-27",
    productName: "Harper Row denim",
    variant: "Straight leg",
    size: "27",
    colorShade: "Light wash",
    category: "Denim",
    price: "$180",
    stockStatus: "Low stock",
    restockStatus: "Restock waiting",
    refillCycle: "N/A",
    productFolder: "Denim Drop",
    tags: "Size / Fit, Restock Waiting",
    linkedDemand: 9,
    recoveryValue: "$1,620",
    lastUpdated: "Yesterday",
    industryType: "Fashion / Apparel",
    fitType: "Straight",
    skinConcern: "N/A",
    routineStep: "N/A",
    bundleEligibility: "Matching jacket",
    sensitiveSkinFlag: "N/A",
    active: true,
    tone: "cyan",
  },
  {
    id: "SKU-1603",
    sku: "VD-JKT-BLK-M",
    productName: "Denim cropped jacket",
    variant: "Cropped jacket",
    size: "M",
    colorShade: "Black denim",
    category: "Outerwear",
    price: "$240",
    stockStatus: "Active",
    restockStatus: "New drop active",
    refillCycle: "N/A",
    productFolder: "New Arrivals",
    tags: "New Drop, Size / Fit",
    linkedDemand: 7,
    recoveryValue: "$1,680",
    lastUpdated: "Today 11:20 AM",
    industryType: "Fashion / Apparel",
    fitType: "Boxy",
    skinConcern: "N/A",
    routineStep: "N/A",
    bundleEligibility: "Denim set",
    sensitiveSkinFlag: "N/A",
    active: true,
    tone: "amber",
  },
  {
    id: "SKU-1604",
    sku: "RM-KNIT-OAT-S",
    productName: "Rue Muse knitwear new drop",
    variant: "Ribbed cardigan",
    size: "S",
    colorShade: "Oat",
    category: "Knitwear",
    price: "$420",
    stockStatus: "Active",
    restockStatus: "VIP early access",
    refillCycle: "N/A",
    productFolder: "VIP Early Access",
    tags: "New Drop, VIP, Second-Purchase Prompt",
    linkedDemand: 11,
    recoveryValue: "$4,620",
    lastUpdated: "Today 8:40 AM",
    industryType: "Fashion / Apparel",
    fitType: "Relaxed",
    skinConcern: "N/A",
    routineStep: "N/A",
    bundleEligibility: "Matching skirt",
    sensitiveSkinFlag: "N/A",
    active: true,
    tone: "emerald",
  },
  {
    id: "SKU-1605",
    sku: "VLP-POP-MIX-01",
    productName: "Velvet Lane order pieces",
    variant: "Event-selected pieces",
    size: "Mixed",
    colorShade: "Assorted",
    category: "Event / Pop-up",
    price: "$540",
    stockStatus: "Needs owner mapping",
    restockStatus: "Event follow-up",
    refillCycle: "N/A",
    productFolder: "Event / Pop-up Products",
    tags: "Event Lead, Owner Needed",
    linkedDemand: 18,
    recoveryValue: "$7,200",
    lastUpdated: "2 days ago",
    industryType: "Fashion / Apparel",
    fitType: "Mixed",
    skinConcern: "N/A",
    routineStep: "N/A",
    bundleEligibility: "Styling bundle",
    sensitiveSkinFlag: "N/A",
    active: true,
    tone: "indigo",
  },
  {
    id: "SKU-1606",
    sku: "GLO-VITC-30ML",
    productName: "Vitamin C serum",
    variant: "30ml bottle",
    size: "30ml",
    colorShade: "Amber bottle",
    category: "Serums",
    price: "$118",
    stockStatus: "Active",
    restockStatus: "In stock",
    refillCycle: "60 days",
    productFolder: "Serums",
    tags: "Skincare, Refill Product, Routine Step, Repeat Revenue",
    linkedDemand: 24,
    recoveryValue: "$2,832",
    lastUpdated: "Today 7:55 AM",
    industryType: "Beauty / Skincare",
    fitType: "N/A",
    skinConcern: "Dullness",
    routineStep: "Treatment",
    bundleEligibility: "Routine bundle",
    sensitiveSkinFlag: "Check sensitivity",
    active: true,
    tone: "emerald",
  },
  {
    id: "SKU-1607",
    sku: "SSK-STARTER-CALM",
    productName: "Sensitive skin starter kit",
    variant: "Calming kit",
    size: "3-piece",
    colorShade: "N/A",
    category: "Sensitive Skin",
    price: "$155",
    stockStatus: "Active",
    restockStatus: "In stock",
    refillCycle: "45 days",
    productFolder: "Sensitive Skin",
    tags: "Sensitive Skin Check, Routine Step",
    linkedDemand: 12,
    recoveryValue: "$1,860",
    lastUpdated: "Yesterday",
    industryType: "Beauty / Skincare",
    fitType: "N/A",
    skinConcern: "Sensitivity",
    routineStep: "Starter routine",
    bundleEligibility: "Routine bundle",
    sensitiveSkinFlag: "Yes",
    active: true,
    tone: "cyan",
  },
  {
    id: "SKU-1608",
    sku: "SAF-CLEANSE-DUO",
    productName: "Saffron Skin cleanser set",
    variant: "Cleanser duo",
    size: "2-piece",
    colorShade: "N/A",
    category: "Cleansers",
    price: "$148",
    stockStatus: "Active",
    restockStatus: "Bundle demand active",
    refillCycle: "45 days",
    productFolder: "Cleansers",
    tags: "Bundle Product, Routine Step, Refill Reminder",
    linkedDemand: 14,
    recoveryValue: "$2,072",
    lastUpdated: "Today 10:05 AM",
    industryType: "Beauty / Skincare",
    fitType: "N/A",
    skinConcern: "Dryness",
    routineStep: "Cleanse",
    bundleEligibility: "Evening routine",
    sensitiveSkinFlag: "Optional",
    active: true,
    tone: "amber",
  },
  {
    id: "SKU-1609",
    sku: "CB-LIP-ROSE",
    productName: "Coco Bloom lip oil shade",
    variant: "Lip oil",
    size: "8ml",
    colorShade: "Rose glaze",
    category: "Lip Products",
    price: "$36",
    stockStatus: "Out of stock",
    restockStatus: "Restock waiting",
    refillCycle: "75 days",
    productFolder: "Lip Products",
    tags: "Shade Match, Restock Waiting, Notify Buyers",
    linkedDemand: 31,
    recoveryValue: "$1,116",
    lastUpdated: "3 days ago",
    industryType: "Beauty / Skincare",
    fitType: "N/A",
    skinConcern: "N/A",
    routineStep: "Finish",
    bundleEligibility: "Lip trio",
    sensitiveSkinFlag: "N/A",
    active: true,
    tone: "rose",
  },
  {
    id: "SKU-1610",
    sku: "ROU-BNDL-EVE",
    productName: "Routine bundle",
    variant: "Evening routine",
    size: "5-piece",
    colorShade: "N/A",
    category: "Bundle Product",
    price: "$670",
    stockStatus: "Active",
    restockStatus: "Payment recovery active",
    refillCycle: "60 days",
    productFolder: "Routine Bundles",
    tags: "Bundle Product, Payment Pending, Repeat Revenue",
    linkedDemand: 16,
    recoveryValue: "$10,720",
    lastUpdated: "Today 12:15 PM",
    industryType: "Beauty / Skincare",
    fitType: "N/A",
    skinConcern: "Routine building",
    routineStep: "Full routine",
    bundleEligibility: "Core bundle",
    sensitiveSkinFlag: "Check ingredients",
    active: true,
    tone: "indigo",
  },
  {
    id: "SKU-1611",
    sku: "",
    productName: "Night repair cream",
    variant: "Rich cream",
    size: "50ml",
    colorShade: "N/A",
    category: "",
    price: "$132",
    stockStatus: "Inactive",
    restockStatus: "Formula update",
    refillCycle: "90 days",
    productFolder: "Refill Products",
    tags: "Refill Product",
    linkedDemand: 5,
    recoveryValue: "$660",
    lastUpdated: "Last week",
    industryType: "Beauty / Skincare",
    fitType: "N/A",
    skinConcern: "Dryness",
    routineStep: "Moisturize",
    bundleEligibility: "Night routine",
    sensitiveSkinFlag: "Optional",
    active: false,
    tone: "gray",
  },
  {
    id: "SKU-1612",
    sku: "LTD-RESTOCK-M",
    productName: "Limited restock pieces",
    variant: "Restock selection",
    size: "M",
    colorShade: "Black",
    category: "Restock Interest",
    price: "$320",
    stockStatus: "Restock waiting",
    restockStatus: "Notify buyers",
    refillCycle: "N/A",
    productFolder: "Restock Waitlist",
    tags: "",
    linkedDemand: 15,
    recoveryValue: "$4,800",
    lastUpdated: "Yesterday",
    industryType: "Fashion / Apparel",
    fitType: "Relaxed",
    skinConcern: "N/A",
    routineStep: "N/A",
    bundleEligibility: "Matching pieces",
    sensitiveSkinFlag: "N/A",
    active: true,
    tone: "amber",
  },
];

const productFolders: ProductFolder[] = [
  { id: "FLD-1", folderName: "Bridal Collection", industryType: "Fashion / Apparel", productCount: 8, recoveryUse: "Appointment and deposit follow-up", openRecoveryValue: "$12,400", owner: "Amara Shah", tone: "rose" },
  { id: "FLD-2", folderName: "Denim Drop", industryType: "Fashion / Apparel", productCount: 14, recoveryUse: "Size/fit guidance and restock interest", openRecoveryValue: "$7,860", owner: "Luis Park", tone: "cyan" },
  { id: "FLD-3", folderName: "New Arrivals", industryType: "Fashion / Apparel", productCount: 18, recoveryUse: "New drop waitlist follow-up", openRecoveryValue: "$8,900", owner: "Luis Park", tone: "emerald" },
  { id: "FLD-4", folderName: "Restock Waitlist", industryType: "Mixed", productCount: 22, recoveryUse: "Notify buyers when product returns", openRecoveryValue: "$16,840", owner: "Mina Cole", tone: "amber" },
  { id: "FLD-5", folderName: "VIP Early Access", industryType: "Fashion / Apparel", productCount: 9, recoveryUse: "VIP launch and second-purchase prompts", openRecoveryValue: "$8,900", owner: "Luis Park", tone: "indigo" },
  { id: "FLD-6", folderName: "Event / Pop-up Products", industryType: "Fashion / Apparel", productCount: 16, recoveryUse: "Post-event owner assignment", openRecoveryValue: "$9,720", owner: "Unassigned", tone: "rose" },
  { id: "FLD-7", folderName: "Serums", industryType: "Beauty / Skincare", productCount: 7, recoveryUse: "Refill reminders and routine questions", openRecoveryValue: "$4,956", owner: "Mina Cole", tone: "emerald" },
  { id: "FLD-8", folderName: "Sensitive Skin", industryType: "Beauty / Skincare", productCount: 6, recoveryUse: "Human review and complaint recovery", openRecoveryValue: "$3,020", owner: "Mina Cole", tone: "cyan" },
  { id: "FLD-9", folderName: "Routine Bundles", industryType: "Beauty / Skincare", productCount: 10, recoveryUse: "Bundle payment recovery and repeat revenue timing", openRecoveryValue: "$9,450", owner: "Tessa Nguyen", tone: "indigo" },
  { id: "FLD-10", folderName: "Lip Products", industryType: "Beauty / Skincare", productCount: 12, recoveryUse: "Shade restock and UGC prompts", openRecoveryValue: "$5,640", owner: "Mina Cole", tone: "rose" },
];

const productCategories: ProductCategory[] = [
  { id: "CAT-1", categoryName: "Fashion / Apparel", productCount: 74, mappedDemandSignals: 142, recoveryUse: "Size, fit, new drop, restock, and high-ticket follow-up", tone: "cyan" },
  { id: "CAT-2", categoryName: "Beauty", productCount: 38, mappedDemandSignals: 96, recoveryUse: "Routine questions, shade match, and bundle recovery", tone: "rose" },
  { id: "CAT-3", categoryName: "Skincare", productCount: 44, mappedDemandSignals: 118, recoveryUse: "Refill timing, routine steps, and sensitive-skin review", tone: "emerald" },
  { id: "CAT-4", categoryName: "Cosmetics", productCount: 26, mappedDemandSignals: 88, recoveryUse: "Shade restock and UGC/photo requests", tone: "amber" },
  { id: "CAT-5", categoryName: "Restock Interest", productCount: 31, mappedDemandSignals: 121, recoveryUse: "Restock waiting and buyer notification", tone: "rose" },
  { id: "CAT-6", categoryName: "Refill Product", productCount: 28, mappedDemandSignals: 104, recoveryUse: "Repeat revenue and post-purchase timing", tone: "emerald" },
  { id: "CAT-7", categoryName: "Bundle Product", productCount: 18, mappedDemandSignals: 67, recoveryUse: "Payment recovery and routine conversion", tone: "indigo" },
  { id: "CAT-8", categoryName: "High-ticket Product", productCount: 11, mappedDemandSignals: 38, recoveryUse: "Human review, appointment, and deposit recovery", tone: "rose" },
];

const productTags: ProductTag[] = [
  { id: "TAG-1", tagName: "Restock Waiting", productCount: 31, recoveryRuleUse: "Notify buyers and create follow-up actions", tone: "amber" },
  { id: "TAG-2", tagName: "Refill Product", productCount: 28, recoveryRuleUse: "Start refill timing after delivery", tone: "emerald" },
  { id: "TAG-3", tagName: "Size / Fit", productCount: 22, recoveryRuleUse: "Route fit questions to owner reply templates", tone: "cyan" },
  { id: "TAG-4", tagName: "High Ticket", productCount: 11, recoveryRuleUse: "Require human review and appointment follow-up", tone: "rose" },
  { id: "TAG-5", tagName: "Sensitive Skin Check", productCount: 9, recoveryRuleUse: "Flag questions before automated reply", tone: "cyan" },
  { id: "TAG-6", tagName: "Repeat Revenue", productCount: 35, recoveryRuleUse: "Trigger repeat purchase and refill prompts", tone: "emerald" },
  { id: "TAG-7", tagName: "UGC Candidate", productCount: 16, recoveryRuleUse: "Create post-purchase social proof actions", tone: "indigo" },
  { id: "TAG-8", tagName: "Owner Needed", productCount: 7, recoveryRuleUse: "Flag unassigned product demand", tone: "rose" },
];

const tagSuggestions: TagSuggestion[] = [
  {
    id: "SUG-1",
    condition: "Product contains serum",
    suggestedTags: ["Skincare", "Refill Product", "Routine Step", "Repeat Revenue", "Sensitive Skin Check"],
    reason: "Serum demand often needs routine context and timed repeat revenue prompts.",
    recoveryUse: "Start refill reminders and route sensitive-skin questions to review.",
    affectedProducts: 7,
    tone: "emerald",
  },
  {
    id: "SUG-2",
    condition: "Product contains bridal",
    suggestedTags: ["Fashion/Apparel", "High Ticket", "Consultation Needed", "Appointment Follow-up", "VIP"],
    reason: "Bridal demand usually carries appointment, fit, and deposit recovery value.",
    recoveryUse: "Require owner review and appointment follow-up before revenue leaks.",
    affectedProducts: 4,
    tone: "rose",
  },
  {
    id: "SUG-3",
    condition: "Product is out of stock",
    suggestedTags: ["Restock Waiting", "Demand Watch", "Notify Buyers"],
    reason: "Out-of-stock interest should be recoverable when the product returns.",
    recoveryUse: "Create restock notification actions for linked buyers.",
    affectedProducts: 12,
    tone: "amber",
  },
  {
    id: "SUG-4",
    condition: "Product has 60-day refill cycle",
    suggestedTags: ["Refill Reminder", "Repeat Revenue", "Post-Purchase Timing"],
    reason: "A defined refill cycle can power the next purchase window after delivery.",
    recoveryUse: "Trigger refill timing and repeat revenue segments.",
    affectedProducts: 18,
    tone: "cyan",
  },
];

const importPreviewRows: ImportPreviewRow[] = [
  { id: "IMP-1", rowLabel: "Row 2", sku: "GLO-VITC-30ML", productName: "Vitamin C serum", category: "Serums", price: "$118", tags: "Refill Product, Repeat Revenue", detectedIssue: "Clean", importAction: "Ready to import", tone: "emerald" },
  { id: "IMP-2", rowLabel: "Row 3", sku: "", productName: "Night repair cream", category: "Moisturizers", price: "$132", tags: "Refill Product", detectedIssue: "Missing SKU", importAction: "Add SKU before confirm", tone: "rose" },
  { id: "IMP-3", rowLabel: "Row 4", sku: "CB-LIP-ROSE", productName: "Coco Bloom lip oil shade", category: "Lip Products", price: "$36", tags: "Restock Waiting", detectedIssue: "Duplicate SKU", importAction: "Merge or rename SKU", tone: "amber" },
  { id: "IMP-4", rowLabel: "Row 5", sku: "LTD-RESTOCK-M", productName: "Limited restock pieces", category: "", price: "$320", tags: "", detectedIssue: "Missing category and tags", importAction: "Map category and add recovery tags", tone: "rose" },
  { id: "IMP-5", rowLabel: "Row 6", sku: "SAF-CLEANSE-DUO", productName: "Saffron Skin cleanser set", category: "Cleansers", price: "", tags: "Bundle Product", detectedIssue: "Missing price", importAction: "Add price before payment recovery use", tone: "amber" },
  { id: "IMP-6", rowLabel: "Row 7", sku: "RM-KNIT-OAT-S", productName: "Rue Muse knitwear new drop", category: "Knitwear", price: "$420", tags: "New Drop, VIP", detectedIssue: "Clean", importAction: "Ready to import", tone: "emerald" },
];

const exportOptions: ExportOption[] = [
  { id: "EXP-1", exportName: "Product catalog", description: "Products, folders, tags, demand value, and recovered value.", format: "CSV", recordCount: 156, recoveryUse: "Clean catalog review", tone: "cyan" },
  { id: "EXP-2", exportName: "SKU sheet", description: "SKU rows with variants, price, status, refill cycle, and tags.", format: "CSV", recordCount: 482, recoveryUse: "SKU control and CSV cleanup", tone: "emerald" },
  { id: "EXP-3", exportName: "Product demand", description: "Linked demand, restock interest, refill timing, and recovery value.", format: "CSV", recordCount: 74, recoveryUse: "Demand recovery planning", tone: "rose" },
  { id: "EXP-4", exportName: "Restock list", description: "Products and SKUs with restock interest and waiting buyers.", format: "CSV", recordCount: 31, recoveryUse: "Restock notification actions", tone: "amber" },
  { id: "EXP-5", exportName: "Refill products", description: "Refill cycles, routine steps, and repeat revenue timing.", format: "CSV", recordCount: 28, recoveryUse: "Refill reminders", tone: "emerald" },
  { id: "EXP-6", exportName: "Category/tag report", description: "Folders, categories, recovery tags, and suggested rules.", format: "CSV", recordCount: 88, recoveryUse: "Category mapping", tone: "indigo" },
  { id: "EXP-7", exportName: "XLSX product workbook", description: "Spreadsheet-ready product catalog and SKU sheet.", format: "XLSX placeholder", recordCount: 482, recoveryUse: "Team editing handoff", tone: "cyan" },
  { id: "EXP-8", exportName: "JSON product data", description: "Structured product, SKU, folder, category, and tag data.", format: "JSON placeholder", recordCount: 482, recoveryUse: "Future data sync", tone: "gray" },
];

const refillOpportunities: RefillOpportunity[] = [
  {
    id: "REF-1701",
    buyerName: "Elena Rodriguez",
    productName: "Vitamin C serum",
    productCategory: "Serum / Skincare",
    lastPurchaseDate: "60 days ago",
    refillWindow: "60-day refill window active",
    predictedReorderDate: "Today",
    estimatedRefillValue: "$118",
    owner: "Mina Cole",
    source: "Shopify / Ecommerce",
    buyerStatus: "Repeat skincare buyer",
    reminderStatus: "Not sent",
    lastReminder: "No refill reminder sent",
    nextAction: "Send serum refill reminder with routine check-in.",
    messageTemplate:
      "Your Vitamin C serum refill window is here. Want us to set aside your next bottle before your routine runs low?",
    recoveredValue: "$0",
    tone: "emerald",
  },
  {
    id: "REF-1702",
    buyerName: "Priya Nair",
    productName: "Saffron Skin cleanser routine bundle",
    productCategory: "Routine Bundle",
    lastPurchaseDate: "47 days ago",
    refillWindow: "45-day cleanser window overdue",
    predictedReorderDate: "2 days ago",
    estimatedRefillValue: "$148",
    owner: "Tessa Nguyen",
    source: "WhatsApp",
    buyerStatus: "Recovered payment buyer",
    reminderStatus: "Overdue",
    lastReminder: "No reorder reminder sent",
    nextAction: "Send bundle reorder prompt and confirm cleanser fit.",
    messageTemplate:
      "Your cleanser set may be running low. Would you like the same routine bundle again or a lighter refill this time?",
    recoveredValue: "$0",
    tone: "rose",
  },
  {
    id: "REF-1703",
    buyerName: "Arielle Stone",
    productName: "Sensitive-skin starter kit",
    productCategory: "Sensitive Skin",
    lastPurchaseDate: "38 days ago",
    refillWindow: "45-day window approaching",
    predictedReorderDate: "In 7 days",
    estimatedRefillValue: "$155",
    owner: "Mina Cole",
    source: "Website chat",
    buyerStatus: "Needs human review",
    reminderStatus: "Not sent",
    lastReminder: "No reminder sent",
    nextAction: "Check skin response before sending starter-kit refill prompt.",
    messageTemplate:
      "How has your skin responded to the starter kit? If it has been comfortable, we can prepare your refill timing.",
    recoveredValue: "$0",
    tone: "cyan",
  },
  {
    id: "REF-1704",
    buyerName: "Talia Monroe",
    productName: "Glow Haus moisturizer",
    productCategory: "Moisturizer",
    lastPurchaseDate: "58 days ago",
    refillWindow: "60-day window due soon",
    predictedReorderDate: "In 2 days",
    estimatedRefillValue: "$96",
    owner: "Luis Park",
    source: "Referral",
    buyerStatus: "UGC/referral candidate",
    reminderStatus: "Sent",
    lastReminder: "Sent yesterday",
    nextAction: "Follow up with moisturizer refill and referral thank-you.",
    messageTemplate:
      "Your moisturizer refill window is almost here. I can reserve your next jar and include your referral thank-you.",
    recoveredValue: "$0",
    tone: "indigo",
  },
  {
    id: "REF-1705",
    buyerName: "Grace Miller",
    productName: "Coco Bloom lip oil",
    productCategory: "Cosmetics",
    lastPurchaseDate: "75 days ago",
    refillWindow: "75-day lip oil reorder window active",
    predictedReorderDate: "Today",
    estimatedRefillValue: "$42",
    owner: "Mina Cole",
    source: "Back-in-stock form",
    buyerStatus: "Shade restock buyer",
    reminderStatus: "Not sent",
    lastReminder: "No reorder reminder sent",
    nextAction: "Send lip oil reorder prompt with shade confirmation.",
    messageTemplate:
      "Your lip oil shade should be ready for a refresh. Want the same shade again or help matching a new one?",
    recoveredValue: "$0",
    tone: "amber",
  },
  {
    id: "REF-1706",
    buyerName: "Jasmine Reed",
    productName: "Night repair cream",
    productCategory: "Skincare",
    lastPurchaseDate: "92 days ago",
    refillWindow: "90-day reorder window overdue",
    predictedReorderDate: "2 days ago",
    estimatedRefillValue: "$132",
    owner: "Mina Cole",
    source: "Shopify / Ecommerce",
    buyerStatus: "Order issue buyer",
    reminderStatus: "Overdue",
    lastReminder: "No reminder after delivery hold",
    nextAction: "Resolve delivery note before sending night cream reorder.",
    messageTemplate:
      "I saw your last order had a delivery hold. Before we prepare a night cream refill, did everything arrive correctly?",
    recoveredValue: "$0",
    tone: "rose",
  },
  {
    id: "REF-1707",
    buyerName: "Imani Wallace",
    productName: "Coco Bloom lip oil shade",
    productCategory: "Beauty / Cosmetics",
    lastPurchaseDate: "80 days ago",
    refillWindow: "75-day refill window recovered",
    predictedReorderDate: "Recovered today",
    estimatedRefillValue: "$84",
    owner: "Mina Cole",
    source: "Restock form",
    buyerStatus: "Recovered restock buyer",
    reminderStatus: "Recovered",
    lastReminder: "Sent today",
    nextAction: "Add post-purchase review request after reorder delivery.",
    messageTemplate:
      "Your shade reorder is confirmed. After it arrives, we would love to hear if the shade still feels right.",
    recoveredValue: "$84",
    tone: "emerald",
  },
];

const restockWaitlistItems: RestockWaitlistItem[] = [
  {
    id: "RST-1801",
    productName: "Denim cropped jacket",
    skuVariant: "VD-JKT-BLK-M",
    sizeShadeColor: "Size M / black denim",
    productCategory: "Size Waitlist",
    industryType: "Fashion / Apparel",
    buyerCount: 18,
    highIntentBuyers: 9,
    estimatedDemandValue: "$4,320",
    recoveredValue: "$960",
    restockStatus: "Size restock due this week",
    sourceMix: ["Instagram DM", "Website form", "New drop waitlist"],
    owner: "Amara Shah",
    notificationStatus: "Notice due",
    linkedRecoveryCases: 6,
    recommendedNextAction: "Send size-restock notice and fit guidance to high-intent buyers first.",
    tone: "cyan",
  },
  {
    id: "RST-1802",
    productName: "Atelier Luma bridal capsule",
    skuVariant: "BRD-CAP-IVR-04",
    sizeShadeColor: "Ivory / sizes 4-8",
    productCategory: "Bridal restock",
    industryType: "Fashion / Apparel",
    buyerCount: 11,
    highIntentBuyers: 7,
    estimatedDemandValue: "$18,500",
    recoveredValue: "$5,550",
    restockStatus: "Appointment slots reopened",
    sourceMix: ["Website form", "Referral", "Manual entry"],
    owner: "Amara Shah",
    notificationStatus: "Notice not sent",
    linkedRecoveryCases: 5,
    recommendedNextAction: "Notify bridal buyers and offer appointment windows before interest goes cold.",
    tone: "rose",
  },
  {
    id: "RST-1803",
    productName: "Rue Muse knitwear new drop",
    skuVariant: "RM-KNIT-OAT-S",
    sizeShadeColor: "Oat / size S-M",
    productCategory: "New Drop",
    industryType: "Fashion / Apparel",
    buyerCount: 24,
    highIntentBuyers: 14,
    estimatedDemandValue: "$10,080",
    recoveredValue: "$3,840",
    restockStatus: "VIP early access open",
    sourceMix: ["VIP early access", "Instagram DM", "Website form"],
    owner: "Luis Park",
    notificationStatus: "Notice sent",
    linkedRecoveryCases: 8,
    recommendedNextAction: "Follow up with VIP buyers who opened access but did not purchase.",
    tone: "emerald",
  },
  {
    id: "RST-1804",
    productName: "Harper Row denim",
    skuVariant: "HRD-JEAN-LT-27",
    sizeShadeColor: "Size 27 / light wash",
    productCategory: "Size/color waitlist",
    industryType: "Fashion / Apparel",
    buyerCount: 21,
    highIntentBuyers: 12,
    estimatedDemandValue: "$3,780",
    recoveredValue: "$1,080",
    restockStatus: "Color restock waiting",
    sourceMix: ["Website form", "Instagram DM", "Event / Pop-up"],
    owner: "Luis Park",
    notificationStatus: "Notice not sent",
    linkedRecoveryCases: 7,
    recommendedNextAction: "Send color/size waitlist update and offer adjacent fit option.",
    tone: "amber",
  },
  {
    id: "RST-1805",
    productName: "VIP early access collection",
    skuVariant: "VIP-DROP-MIX",
    sizeShadeColor: "Mixed sizes / limited colors",
    productCategory: "New Drop",
    industryType: "Fashion / Apparel",
    buyerCount: 36,
    highIntentBuyers: 22,
    estimatedDemandValue: "$15,900",
    recoveredValue: "$6,720",
    restockStatus: "Drop access live",
    sourceMix: ["VIP early access", "Referral", "Manual entry"],
    owner: "Luis Park",
    notificationStatus: "Notice due",
    linkedRecoveryCases: 11,
    recommendedNextAction: "Prioritize high-value VIP buyers with early access reminder.",
    tone: "indigo",
  },
  {
    id: "RST-1806",
    productName: "Coco Bloom lip oil shade",
    skuVariant: "CB-LIP-ROSE",
    sizeShadeColor: "Rose glaze shade",
    productCategory: "Shade Waitlist",
    industryType: "Beauty / Cosmetics",
    buyerCount: 44,
    highIntentBuyers: 26,
    estimatedDemandValue: "$1,584",
    recoveredValue: "$504",
    restockStatus: "Shade restock arrived",
    sourceMix: ["Back-in-stock form", "Instagram DM", "Website chat"],
    owner: "Mina Cole",
    notificationStatus: "Notice not sent",
    linkedRecoveryCases: 12,
    recommendedNextAction: "Send shade restock notice and reorder prompt to waiting buyers.",
    tone: "rose",
  },
  {
    id: "RST-1807",
    productName: "Sensitive-skin cleanser set",
    skuVariant: "SAF-CLEANSE-DUO",
    sizeShadeColor: "Cleanser duo",
    productCategory: "Beauty restock",
    industryType: "Beauty / Cosmetics",
    buyerCount: 17,
    highIntentBuyers: 8,
    estimatedDemandValue: "$2,516",
    recoveredValue: "$740",
    restockStatus: "Back in stock today",
    sourceMix: ["Website chat", "Shopify / Ecommerce", "Referral"],
    owner: "Mina Cole",
    notificationStatus: "Notice due",
    linkedRecoveryCases: 4,
    recommendedNextAction: "Notify sensitive-skin buyers with ingredient reassurance.",
    tone: "cyan",
  },
  {
    id: "RST-1808",
    productName: "Serum routine bundle",
    skuVariant: "ROU-BNDL-EVE",
    sizeShadeColor: "Evening routine",
    productCategory: "Routine bundle",
    industryType: "Beauty / Cosmetics",
    buyerCount: 19,
    highIntentBuyers: 10,
    estimatedDemandValue: "$12,730",
    recoveredValue: "$6,030",
    restockStatus: "Bundle restocked",
    sourceMix: ["WhatsApp", "Shopify / Ecommerce", "Manual entry"],
    owner: "Tessa Nguyen",
    notificationStatus: "Recovered",
    linkedRecoveryCases: 9,
    recommendedNextAction: "Move recovered buyers into refill timing after bundle delivery.",
    tone: "emerald",
  },
  {
    id: "RST-1809",
    productName: "Shade/product-match waitlist",
    skuVariant: "MATCH-SHADE-MIX",
    sizeShadeColor: "Mixed beauty shades",
    productCategory: "Shade Waitlist",
    industryType: "Beauty / Cosmetics",
    buyerCount: 28,
    highIntentBuyers: 16,
    estimatedDemandValue: "$3,920",
    recoveredValue: "$980",
    restockStatus: "Match guidance needed",
    sourceMix: ["Website chat", "Instagram DM", "Referral"],
    owner: "Mina Cole",
    notificationStatus: "Notice not sent",
    linkedRecoveryCases: 7,
    recommendedNextAction: "Send product-match follow-up before shade demand leaks.",
    tone: "amber",
  },
];

const inactiveBuyerRecoveryItems: InactiveBuyerRecoveryItem[] = [
  {
    id: "INA-1901",
    buyerName: "Sophia Bennett",
    originalProductInterest: "Atelier Luma bridal capsule appointment",
    lastPurchaseDate: "No purchase yet",
    lastContact: "12 days ago",
    inactiveReason: "No reply / ghosted",
    lifecycleStatus: "High-ticket inquiry inactive",
    estimatedRecoveryValue: "$1,850",
    recoveredValue: "$0",
    owner: "Amara Shah",
    source: "Website form",
    lastAction: "Appointment options drafted but not confirmed",
    recommendedWinbackAction: "Send softer bridal appointment check-in with two available windows.",
    messageTemplate:
      "Still thinking about the bridal capsule? I can hold two appointment windows this week if you want to revisit fit and styling.",
    recoveryStatus: "Open",
    tone: "rose",
  },
  {
    id: "INA-1902",
    buyerName: "Camila Torres",
    originalProductInterest: "Soho pop-up saved pieces",
    lastPurchaseDate: "Event order pending",
    lastContact: "9 days ago",
    inactiveReason: "Post-purchase not followed up",
    lifecycleStatus: "Event / Pop-up",
    estimatedRecoveryValue: "$540",
    recoveredValue: "$0",
    owner: "Unassigned",
    source: "Event / Pop-up",
    lastAction: "Imported without owner",
    recommendedWinbackAction: "Assign owner and send post-event saved-pieces recap.",
    messageTemplate:
      "Thanks again for stopping by the pop-up. I can still help with the pieces you saved if you want to complete the order.",
    recoveryStatus: "Open",
    tone: "amber",
  },
  {
    id: "INA-1903",
    buyerName: "Elena Rodriguez",
    originalProductInterest: "Vitamin C serum refill",
    lastPurchaseDate: "74 days ago",
    lastContact: "21 days ago",
    inactiveReason: "Missed refill window",
    lifecycleStatus: "Refill buyer inactive",
    estimatedRecoveryValue: "$118",
    recoveredValue: "$0",
    owner: "Mina Cole",
    source: "Shopify / Ecommerce",
    lastAction: "Refill timing opened but no reminder sent",
    recommendedWinbackAction: "Send missed-refill note and ask if routine changed.",
    messageTemplate:
      "We may have missed your serum refill window. Want the same Vitamin C serum again, or has your routine changed?",
    recoveryStatus: "Open",
    tone: "emerald",
  },
  {
    id: "INA-1904",
    buyerName: "Imani Wallace",
    originalProductInterest: "Coco Bloom lip oil shade restock",
    lastPurchaseDate: "No purchase yet",
    lastContact: "16 days ago",
    inactiveReason: "Out of stock",
    lifecycleStatus: "Restock waiting inactive",
    estimatedRecoveryValue: "$420",
    recoveredValue: "$84",
    owner: "Mina Cole",
    source: "Back-in-stock form",
    lastAction: "Restock tag failed to sync",
    recommendedWinbackAction: "Send shade restock notice and apology for missed notification.",
    messageTemplate:
      "The lip oil shade you wanted is back. I am sorry the restock note did not reach you sooner; want me to set one aside?",
    recoveryStatus: "Reactivated",
    tone: "cyan",
  },
  {
    id: "INA-1905",
    buyerName: "Priya Nair",
    originalProductInterest: "Saffron Skin evening routine bundle",
    lastPurchaseDate: "No completed order",
    lastContact: "6 days ago",
    inactiveReason: "Payment abandoned",
    lifecycleStatus: "Payment pending inactive",
    estimatedRecoveryValue: "$670",
    recoveredValue: "$0",
    owner: "Tessa Nguyen",
    source: "WhatsApp",
    lastAction: "Checkout link opened but payment not completed",
    recommendedWinbackAction: "Send payment recovery note with lighter bundle option.",
    messageTemplate:
      "I noticed the routine bundle payment did not complete. Want me to resend the link or suggest a smaller starter option?",
    recoveryStatus: "Open",
    tone: "rose",
  },
  {
    id: "INA-1906",
    buyerName: "Nadia Brooks",
    originalProductInterest: "Rue Muse VIP knitwear new drop",
    lastPurchaseDate: "Last launch",
    lastContact: "46 days ago",
    inactiveReason: "No recent purchase",
    lifecycleStatus: "VIP Inactive",
    estimatedRecoveryValue: "$960",
    recoveredValue: "$0",
    owner: "Luis Park",
    source: "VIP early access",
    lastAction: "No follow-up after last launch",
    recommendedWinbackAction: "Send VIP new-drop preview and matching-piece prompt.",
    messageTemplate:
      "A new knitwear drop is opening early for VIP buyers. Want first look at the pieces that match your last order?",
    recoveryStatus: "Open",
    tone: "indigo",
  },
  {
    id: "INA-1907",
    buyerName: "Arielle Stone",
    originalProductInterest: "Sensitive-skin starter kit ingredient question",
    lastPurchaseDate: "38 days ago",
    lastContact: "18 days ago",
    inactiveReason: "Post-purchase not followed up",
    lifecycleStatus: "Sensitive-skin buyer",
    estimatedRecoveryValue: "$155",
    recoveredValue: "$0",
    owner: "Mina Cole",
    source: "Website chat",
    lastAction: "Ingredient question not followed up after delivery",
    recommendedWinbackAction: "Ask about skin response before any refill or review prompt.",
    messageTemplate:
      "I wanted to check how your skin responded to the starter kit before suggesting a refill or next routine step.",
    recoveryStatus: "Open",
    tone: "cyan",
  },
  {
    id: "INA-1908",
    buyerName: "Jasmine Reed",
    originalProductInterest: "Night repair cream and delivery hold",
    lastPurchaseDate: "92 days ago",
    lastContact: "30 days ago",
    inactiveReason: "Post-purchase not followed up",
    lifecycleStatus: "Order issue buyer inactive",
    estimatedRecoveryValue: "$132",
    recoveredValue: "$0",
    owner: "Mina Cole",
    source: "Shopify / Ecommerce",
    lastAction: "Delivery hold cleared, no recovery message sent",
    recommendedWinbackAction: "Resolve order experience before offering reorder.",
    messageTemplate:
      "I saw your last order had a delivery hold. Did everything arrive correctly, and would you like help with the next cream refill?",
    recoveryStatus: "Open",
    tone: "amber",
  },
];

const assignedRecoveryActions: AssignedRecoveryAction[] = [
  {
    id: "ACTN-2001",
    actionTitle: "Confirm bridal appointment follow-up",
    buyerName: "Sophia Bennett",
    productContext: "Atelier Luma bridal capsule appointment",
    recoveryType: "Follow-up nudge",
    revenueAtRisk: "$1,850",
    owner: "Amara Shah",
    roleTeam: "Recovery Lead",
    priority: "Critical",
    dueStatus: "Overdue",
    source: "Website form",
    lastActivity: "Appointment options drafted yesterday",
    nextAction: "Send two fitting windows and ask for wedding date.",
    messageTemplateStatus: "Template ready",
    messageTemplate:
      "Hi Sophia, I can still hold two bridal styling windows this week. Would either Thursday afternoon or Saturday morning work?",
    relatedRecoveryCase: "RR-1041",
    internalNotesPreview: "Need wedding date before recommending trunk-show pieces.",
    handoffStatus: "Owned by recovery lead",
    tone: "rose",
  },
  {
    id: "ACTN-2002",
    actionTitle: "Recover routine bundle payment",
    buyerName: "Priya Nair",
    productContext: "Saffron Skin evening routine bundle checkout",
    recoveryType: "Payment reminder",
    revenueAtRisk: "$670",
    owner: "Tessa Nguyen",
    roleTeam: "Order Recovery",
    priority: "High",
    dueStatus: "Due today",
    source: "WhatsApp",
    lastActivity: "Payment link opened, checkout not completed",
    nextAction: "Resend payment link and offer lighter bundle option.",
    messageTemplateStatus: "Payment template ready",
    messageTemplate:
      "I noticed the routine bundle checkout did not complete. Want me to resend the link or adjust the bundle before you pay?",
    relatedRecoveryCase: "PAY-1201",
    internalNotesPreview: "Buyer said she would complete checkout tonight.",
    handoffStatus: "No handoff needed",
    tone: "amber",
  },
  {
    id: "ACTN-2003",
    actionTitle: "Send serum refill reminder",
    buyerName: "Elena Rodriguez",
    productContext: "Vitamin C serum 60-day reorder window",
    recoveryType: "Refill reminder",
    revenueAtRisk: "$118",
    owner: "Mina Cole",
    roleTeam: "Beauty Specialist",
    priority: "Medium",
    dueStatus: "Due today",
    source: "Shopify / Ecommerce",
    lastActivity: "Refill timing opened this morning",
    nextAction: "Send refill reminder with sensitive-skin routine note.",
    messageTemplateStatus: "Template ready",
    messageTemplate:
      "Your Vitamin C serum refill window is active. Want your next bottle with the same saved routine?",
    relatedRecoveryCase: "REF-1701",
    internalNotesPreview: "Use sensitive-skin copy and mention sunscreen pairing.",
    handoffStatus: "Beauty owner has context",
    tone: "emerald",
  },
  {
    id: "ACTN-2004",
    actionTitle: "Send UGC/referral prompt",
    buyerName: "Talia Monroe",
    productContext: "Glow Haus positive review and referral opportunity",
    recoveryType: "UGC request",
    revenueAtRisk: "$300",
    owner: "Luis Park",
    roleTeam: "Post-Purchase",
    priority: "Medium",
    dueStatus: "Due soon",
    source: "Referral",
    lastActivity: "Positive review received 8h ago",
    nextAction: "Send UGC prompt and referral code while review sentiment is fresh.",
    messageTemplateStatus: "UGC prompt ready",
    messageTemplate:
      "Your review was wonderful. Would you be open to sharing a routine photo and referral code with friends who asked?",
    relatedRecoveryCase: "PP-1407",
    internalNotesPreview: "Good UGC/referral candidate after review.",
    handoffStatus: "Post-purchase owner active",
    tone: "indigo",
  },
  {
    id: "ACTN-2005",
    actionTitle: "Resolve address/order risk issue",
    buyerName: "Jasmine Reed",
    productContext: "Night repair cream delivery hold",
    recoveryType: "Order issue resolution",
    revenueAtRisk: "$132",
    owner: "Operations",
    roleTeam: "Operations",
    priority: "High",
    dueStatus: "Overdue",
    source: "Shopify / Ecommerce",
    lastActivity: "Delivery hold cleared without buyer recovery message",
    nextAction: "Confirm address resolution and hand off refill recovery to Mina.",
    messageTemplateStatus: "Ops note needed",
    messageTemplate:
      "I saw your last order had a delivery hold. Did everything arrive correctly, and would you like help with the next refill?",
    relatedRecoveryCase: "INA-1908",
    internalNotesPreview: "Do not send refill offer until order experience is acknowledged.",
    handoffStatus: "Handoff waiting",
    tone: "rose",
  },
  {
    id: "ACTN-2006",
    actionTitle: "Assign pop-up event lead owner",
    buyerName: "Camila Torres",
    productContext: "Soho pop-up saved pieces",
    recoveryType: "Assign missing owner",
    revenueAtRisk: "$540",
    owner: "Unassigned",
    roleTeam: "Unassigned",
    priority: "High",
    dueStatus: "Overdue",
    source: "Event / Pop-up",
    lastActivity: "CSV import created unassigned recovery action",
    nextAction: "Assign owner and send post-event saved-pieces recap.",
    messageTemplateStatus: "Template needs owner",
    messageTemplate:
      "Thanks again for visiting the pop-up. I can help with the pieces you saved if you want to complete the order.",
    relatedRecoveryCase: "INA-1902",
    internalNotesPreview: "Event import missing owner assignment.",
    handoffStatus: "Owner missing",
    tone: "amber",
  },
  {
    id: "ACTN-2007",
    actionTitle: "Send lip oil restock notice",
    buyerName: "Imani Wallace",
    productContext: "Coco Bloom lip oil rose shade restock",
    recoveryType: "Restock notice",
    revenueAtRisk: "$420",
    owner: "Mina Cole",
    roleTeam: "Beauty Specialist",
    priority: "Medium",
    dueStatus: "Due today",
    source: "Back-in-stock form",
    lastActivity: "Restock tag sync failed, shade now available",
    nextAction: "Send shade restock notice and apology for missed notification.",
    messageTemplateStatus: "Restock copy ready",
    messageTemplate:
      "The lip oil shade you wanted is back. Sorry the restock note did not reach you sooner; want me to set one aside?",
    relatedRecoveryCase: "RST-1806",
    internalNotesPreview: "Source sync issue caused missed buyer notice.",
    handoffStatus: "Beauty owner has context",
    tone: "cyan",
  },
  {
    id: "ACTN-2008",
    actionTitle: "Reply to denim size/fit question",
    buyerName: "Maya Chen",
    productContext: "Vela Denim cropped jacket size/fit question",
    recoveryType: "First reply",
    revenueAtRisk: "$240",
    owner: "Amara Shah",
    roleTeam: "Sales",
    priority: "High",
    dueStatus: "Overdue",
    source: "Instagram DM",
    lastActivity: "High-intent fit question left unanswered",
    nextAction: "Reply with fit guidance, exchange reassurance, and product link.",
    messageTemplateStatus: "Fit template ready",
    messageTemplate:
      "The cropped jacket runs true to size with a structured shoulder. Share your usual size and I can recommend the best fit.",
    relatedRecoveryCase: "RR-1043",
    internalNotesPreview: "Exchange reassurance is important before product link.",
    handoffStatus: "Sales owner active",
    tone: "rose",
  },
  {
    id: "ACTN-2009",
    actionTitle: "Review source sync issue",
    buyerName: "Instagram DM Source",
    productContext: "Instagram first-reply leakage and owner assignment",
    recoveryType: "Source sync review",
    revenueAtRisk: "$2,840",
    owner: "Operations",
    roleTeam: "Operations",
    priority: "Medium",
    dueStatus: "Due soon",
    source: "Instagram DM",
    lastActivity: "Seven first replies missing from source review",
    nextAction: "Verify owner mapping and create follow-up recovery actions.",
    messageTemplateStatus: "No buyer template",
    messageTemplate:
      "Internal action: verify source owner mapping and create follow-up recovery actions for missing replies.",
    relatedRecoveryCase: "SRC-Instagram",
    internalNotesPreview: "Strong demand source with follow-up leakage.",
    handoffStatus: "Ops review needed",
    tone: "indigo",
  },
];

const recoveryThreads: RecoveryThread[] = [
  {
    id: "THR-2101",
    threadTitle: "Sophia bridal inquiry handoff",
    linkedBuyer: "Sophia Bennett",
    linkedRecoveryCase: "RR-1041",
    recoveryType: "Inquiry thread",
    revenueAtRisk: "$1,850",
    currentOwner: "Amara Shah",
    participants: ["Automation", "Amara Shah"],
    lastMessage: "Need wedding date before recommending trunk-show pieces.",
    lastUpdated: "Today 9:20 AM",
    threadStatus: "High risk",
    nextAction: "Send appointment follow-up and confirm wedding date.",
    handoffNote: "No handoff; Amara owns next buyer reply.",
    tone: "rose",
    messages: [
      {
        id: "THR-2101-1",
        author: "Automation",
        role: "System",
        time: "2d ago",
        message: "Website form captured bridal capsule inquiry with estimated order range.",
        outcome: "Follow-up recovery case created.",
      },
      {
        id: "THR-2101-2",
        author: "Amara Shah",
        role: "Recovery Lead",
        time: "Yesterday",
        message: "Need to confirm wedding date before recommending trunk-show pieces.",
        outcome: "Waiting on buyer reply.",
      },
    ],
  },
  {
    id: "THR-2102",
    threadTitle: "Priya routine bundle payment recovery",
    linkedBuyer: "Priya Nair",
    linkedRecoveryCase: "PAY-1201",
    recoveryType: "Payment recovery thread",
    revenueAtRisk: "$670",
    currentOwner: "Tessa Nguyen",
    participants: ["Tessa Nguyen", "Automation"],
    lastMessage: "Payment link resent. Buyer said she will complete checkout tonight.",
    lastUpdated: "Today 10:05 AM",
    threadStatus: "Updated today",
    nextAction: "Watch payment completion and send one reminder if needed.",
    handoffNote: "Order Recovery owns payment watch until recovered or lost.",
    tone: "amber",
    messages: [
      {
        id: "THR-2102-1",
        author: "Automation",
        role: "System",
        time: "Yesterday",
        message: "WhatsApp checkout opened but payment did not complete.",
        outcome: "Payment recovery case created.",
      },
      {
        id: "THR-2102-2",
        author: "Tessa Nguyen",
        role: "Order Recovery",
        time: "Today 10:05 AM",
        message: "Payment link resent. Buyer said she will complete checkout tonight.",
        outcome: "Payment reminder scheduled.",
      },
    ],
  },
  {
    id: "THR-2103",
    threadTitle: "Elena serum refill timing",
    linkedBuyer: "Elena Rodriguez",
    linkedRecoveryCase: "REF-1701",
    recoveryType: "Refill/restock thread",
    revenueAtRisk: "$118",
    currentOwner: "Mina Cole",
    participants: ["Automation", "Mina Cole"],
    lastMessage: "Serum refill window is active. Recommend sensitive-skin refill copy.",
    lastUpdated: "Today 8:40 AM",
    threadStatus: "Updated today",
    nextAction: "Send refill reminder before reorder window slips.",
    handoffNote: "Beauty owner has routine context.",
    tone: "emerald",
    messages: [
      {
        id: "THR-2103-1",
        author: "Automation",
        role: "System",
        time: "3h ago",
        message: "60-day serum refill window opened from order history.",
        outcome: "Refill reminder ready.",
      },
      {
        id: "THR-2103-2",
        author: "Mina Cole",
        role: "Beauty Specialist",
        time: "1h ago",
        message: "Serum refill window is active. Recommend sensitive-skin refill copy.",
        outcome: "Refill reminder ready.",
      },
    ],
  },
  {
    id: "THR-2104",
    threadTitle: "Jasmine delivery hold recovery",
    linkedBuyer: "Jasmine Reed",
    linkedRecoveryCase: "INA-1908",
    recoveryType: "Order risk thread",
    revenueAtRisk: "$132",
    currentOwner: "Operations",
    participants: ["Operations", "Mina Cole"],
    lastMessage: "Confirm delivery experience before refill prompt.",
    lastUpdated: "Yesterday",
    threadStatus: "Handoff waiting",
    nextAction: "Operations should confirm delivery outcome, then hand off to Mina for refill recovery.",
    handoffNote: "Handoff waiting from Operations to Beauty Specialist.",
    tone: "rose",
    messages: [
      {
        id: "THR-2104-1",
        author: "Operations",
        role: "Operations",
        time: "Yesterday",
        message: "Address hold cleared, but buyer did not receive recovery note.",
        outcome: "Order risk still open.",
      },
      {
        id: "THR-2104-2",
        author: "Mina Cole",
        role: "Beauty Specialist",
        time: "Yesterday",
        message: "Do not send night cream reorder until delivery experience is confirmed.",
        outcome: "Handoff required.",
      },
    ],
  },
  {
    id: "THR-2105",
    threadTitle: "Talia review to UGC handoff",
    linkedBuyer: "Talia Monroe",
    linkedRecoveryCase: "PP-1407",
    recoveryType: "Post-purchase thread",
    revenueAtRisk: "$300",
    currentOwner: "Luis Park",
    participants: ["Luis Park", "Automation"],
    lastMessage: "Buyer left positive review. Good UGC/referral candidate.",
    lastUpdated: "Today 8:55 AM",
    threadStatus: "Updated today",
    nextAction: "Send UGC prompt and referral code.",
    handoffNote: "Post-purchase owns next social proof action.",
    tone: "indigo",
    messages: [
      {
        id: "THR-2105-1",
        author: "Automation",
        role: "System",
        time: "8h ago",
        message: "Positive review captured from delivered routine order.",
        outcome: "UGC/referral opportunity opened.",
      },
      {
        id: "THR-2105-2",
        author: "Luis Park",
        role: "Post-Purchase",
        time: "Today 8:55 AM",
        message: "Buyer left positive review. Good UGC/referral candidate.",
        outcome: "UGC prompt ready.",
      },
    ],
  },
  {
    id: "THR-2106",
    threadTitle: "Instagram source leakage review",
    linkedBuyer: "Instagram DM Source",
    linkedRecoveryCase: "SRC-Instagram",
    recoveryType: "Source sync issue thread",
    revenueAtRisk: "$2,840",
    currentOwner: "Operations",
    participants: ["Operations", "Amara Shah"],
    lastMessage: "Owner mapping needs review before more DMs go stale.",
    lastUpdated: "2 days ago",
    threadStatus: "Open",
    nextAction: "Verify source owner mapping and create assigned recovery actions.",
    handoffNote: "Operations should hand high-intent fit replies to Amara.",
    tone: "cyan",
    messages: [
      {
        id: "THR-2106-1",
        author: "Automation",
        role: "System",
        time: "2 days ago",
        message: "Instagram DM source shows seven missing first replies and three overdue follow-ups.",
        outcome: "Source sync review opened.",
      },
      {
        id: "THR-2106-2",
        author: "Operations",
        role: "Operations",
        time: "Yesterday",
        message: "Owner mapping needs review before more DMs go stale.",
        outcome: "Handoff to recovery lead needed.",
      },
    ],
  },
  {
    id: "THR-2107",
    threadTitle: "Camila pop-up event owner missing",
    linkedBuyer: "Camila Torres",
    linkedRecoveryCase: "INA-1902",
    recoveryType: "Handoff thread",
    revenueAtRisk: "$540",
    currentOwner: "Unassigned",
    participants: ["Automation", "Operations"],
    lastMessage: "CSV import created recovery action without owner.",
    lastUpdated: "6h ago",
    threadStatus: "Unassigned",
    nextAction: "Assign owner and send post-event saved-pieces recap.",
    handoffNote: "Owner missing; needs handoff before buyer goes cold.",
    tone: "amber",
    messages: [
      {
        id: "THR-2107-1",
        author: "Automation",
        role: "System",
        time: "6h ago",
        message: "Pop-up CSV import created a recovery action without owner assignment.",
        outcome: "Unassigned recovery action opened.",
      },
      {
        id: "THR-2107-2",
        author: "Operations",
        role: "Operations",
        time: "5h ago",
        message: "Need sales owner before post-event recap is sent.",
        outcome: "Handoff waiting.",
      },
    ],
  },
];

const teamMemberLoads: TeamMemberLoad[] = [
  {
    id: "LOAD-2201",
    memberName: "Amara Shah",
    role: "Recovery Lead",
    activeActions: 18,
    overdueActions: 4,
    revenueAtRiskOwned: "$15.2K",
    recoveredValueThisMonth: "$6.4K",
    averageResponseTime: "2h 10m",
    focusArea: "Bridal / high-ticket follow-ups",
    bottleneckStatus: "Overloaded on first replies",
    openHandoffs: 2,
    nextRecommendedWorkloadAction: "Move 3 medium-priority follow-ups to support before end of day.",
    completedActionsThisWeek: 24,
    tone: "rose",
  },
  {
    id: "LOAD-2202",
    memberName: "Mina Cole",
    role: "Beauty Specialist",
    activeActions: 14,
    overdueActions: 2,
    revenueAtRiskOwned: "$5.8K",
    recoveredValueThisMonth: "$9.4K",
    averageResponseTime: "1h 35m",
    focusArea: "Refill/restock and skincare routines",
    bottleneckStatus: "Healthy, refill queue rising",
    openHandoffs: 1,
    nextRecommendedWorkloadAction: "Keep refill reminders moving before reorder windows slip.",
    completedActionsThisWeek: 31,
    tone: "emerald",
  },
  {
    id: "LOAD-2203",
    memberName: "Tessa Nguyen",
    role: "Order Recovery",
    activeActions: 12,
    overdueActions: 5,
    revenueAtRiskOwned: "$8.7K",
    recoveredValueThisMonth: "$8.1K",
    averageResponseTime: "3h 05m",
    focusArea: "Payment pending and order risks",
    bottleneckStatus: "Payment reminders overdue",
    openHandoffs: 3,
    nextRecommendedWorkloadAction: "Prioritize high-value payment reminders before lower-value order notes.",
    completedActionsThisWeek: 18,
    tone: "amber",
  },
  {
    id: "LOAD-2204",
    memberName: "Luis Park",
    role: "Post-Purchase",
    activeActions: 9,
    overdueActions: 1,
    revenueAtRiskOwned: "$3.6K",
    recoveredValueThisMonth: "$4.6K",
    averageResponseTime: "1h 50m",
    focusArea: "Reviews, referrals, and UGC",
    bottleneckStatus: "Stable",
    openHandoffs: 1,
    nextRecommendedWorkloadAction: "Take two post-purchase prompts from Amara after VIP follow-up is clear.",
    completedActionsThisWeek: 22,
    tone: "indigo",
  },
  {
    id: "LOAD-2205",
    memberName: "Operations",
    role: "Operations",
    activeActions: 10,
    overdueActions: 3,
    revenueAtRiskOwned: "$4.9K",
    recoveredValueThisMonth: "$3.2K",
    averageResponseTime: "4h 20m",
    focusArea: "Delivery, address, return/exchange risks",
    bottleneckStatus: "Handoffs waiting",
    openHandoffs: 5,
    nextRecommendedWorkloadAction: "Clear address/order handoffs before refill or review actions continue.",
    completedActionsThisWeek: 15,
    tone: "cyan",
  },
  {
    id: "LOAD-2206",
    memberName: "Unassigned Queue",
    role: "Unassigned",
    activeActions: 7,
    overdueActions: 5,
    revenueAtRiskOwned: "$4.2K",
    recoveredValueThisMonth: "$0",
    averageResponseTime: "No owner",
    focusArea: "Owner missing records",
    bottleneckStatus: "Unassigned recovery action leak",
    openHandoffs: 7,
    nextRecommendedWorkloadAction: "Assign pop-up and source-leak actions before they age another day.",
    completedActionsThisWeek: 0,
    tone: "gray",
  },
];

const automationHealthRecords: AutomationHealthRecord[] = [
  {
    id: "AUTOH-2301",
    automationName: "Shopify order webhook",
    thirdPartySource: "Shopify / Ecommerce",
    sourceCategory: "Ecommerce",
    eventType: "Payment pending detected",
    syncStatus: "Partial",
    lastRunTime: "12m ago",
    recordsProcessed: 42,
    recordsCreated: 9,
    recordsUpdated: 30,
    failedRecords: 3,
    missingFields: 3,
    duplicateRecords: 0,
    relatedRecoveryCases: 3,
    impactOnRecovery: "3 order risk cases need review because SKU values are missing.",
    recommendedFix: "Map SKU field and review failed order records before payment reminders go out.",
    reviewOwner: "Operations",
    tone: "amber",
  },
  {
    id: "AUTOH-2302",
    automationName: "Website inquiry form",
    thirdPartySource: "Website Form",
    sourceCategory: "Forms",
    eventType: "Inquiry captured",
    syncStatus: "Healthy",
    lastRunTime: "8m ago",
    recordsProcessed: 18,
    recordsCreated: 18,
    recordsUpdated: 0,
    failedRecords: 0,
    missingFields: 0,
    duplicateRecords: 1,
    relatedRecoveryCases: 12,
    impactOnRecovery: "Bridal and high-intent form inquiries are creating recovery actions correctly.",
    recommendedFix: "Review duplicate buyer match rules during the next source cleanup.",
    reviewOwner: "Amara Shah",
    tone: "emerald",
  },
  {
    id: "AUTOH-2303",
    automationName: "Instagram DM capture",
    thirdPartySource: "Instagram DM",
    sourceCategory: "Instagram",
    eventType: "Missing owner field",
    syncStatus: "Needs Review",
    lastRunTime: "34m ago",
    recordsProcessed: 42,
    recordsCreated: 35,
    recordsUpdated: 4,
    failedRecords: 3,
    missingFields: 7,
    duplicateRecords: 2,
    relatedRecoveryCases: 10,
    impactOnRecovery: "$2,840 in fit and product questions may leak without owner assignment.",
    recommendedFix: "Review owner mapping and assign high-intent DMs to recovery owners.",
    reviewOwner: "Operations",
    tone: "rose",
  },
  {
    id: "AUTOH-2304",
    automationName: "WhatsApp checkout sync",
    thirdPartySource: "WhatsApp checkout workflow",
    sourceCategory: "WhatsApp",
    eventType: "Payment pending detected",
    syncStatus: "Healthy",
    lastRunTime: "18m ago",
    recordsProcessed: 16,
    recordsCreated: 6,
    recordsUpdated: 10,
    failedRecords: 0,
    missingFields: 0,
    duplicateRecords: 0,
    relatedRecoveryCases: 6,
    impactOnRecovery: "Payment pending records are creating recovery actions for bundle buyers.",
    recommendedFix: "Keep payment reminder copy reviewed for high-value bundle buyers.",
    reviewOwner: "Tessa Nguyen",
    tone: "cyan",
  },
  {
    id: "AUTOH-2305",
    automationName: "Pop-up event CSV import",
    thirdPartySource: "Manual CSV upload",
    sourceCategory: "CSV Import",
    eventType: "Missing owner field",
    syncStatus: "Failed",
    lastRunTime: "6h ago",
    recordsProcessed: 54,
    recordsCreated: 47,
    recordsUpdated: 0,
    failedRecords: 7,
    missingFields: 12,
    duplicateRecords: 4,
    relatedRecoveryCases: 7,
    impactOnRecovery: "$4,200 in pop-up leads is unassigned and aging.",
    recommendedFix: "Add owner column to the import map and assign event leads before follow-up delay grows.",
    reviewOwner: "Unassigned",
    tone: "rose",
  },
  {
    id: "AUTOH-2306",
    automationName: "Klaviyo refill segment import",
    thirdPartySource: "Klaviyo",
    sourceCategory: "Email / SMS",
    eventType: "Refill window opened",
    syncStatus: "Healthy",
    lastRunTime: "1h ago",
    recordsProcessed: 28,
    recordsCreated: 18,
    recordsUpdated: 10,
    failedRecords: 0,
    missingFields: 0,
    duplicateRecords: 1,
    relatedRecoveryCases: 18,
    impactOnRecovery: "Serum and moisturizer buyers are entering refill opportunity queues.",
    recommendedFix: "Review refill copy for sensitive-skin buyers before month-end.",
    reviewOwner: "Mina Cole",
    tone: "emerald",
  },
  {
    id: "AUTOH-2307",
    automationName: "Typeform product quiz",
    thirdPartySource: "Typeform",
    sourceCategory: "Forms",
    eventType: "Product demand signal",
    syncStatus: "Needs Review",
    lastRunTime: "2h ago",
    recordsProcessed: 31,
    recordsCreated: 24,
    recordsUpdated: 5,
    failedRecords: 2,
    missingFields: 5,
    duplicateRecords: 0,
    relatedRecoveryCases: 5,
    impactOnRecovery: "Skin concern and shade-match answers need product tag review.",
    recommendedFix: "Map skin concern and shade fields into product demand records.",
    reviewOwner: "Mina Cole",
    tone: "amber",
  },
  {
    id: "AUTOH-2308",
    automationName: "Custom middleware sync",
    thirdPartySource: "Custom middleware",
    sourceCategory: "Middleware",
    eventType: "Weekly report generated",
    syncStatus: "Healthy",
    lastRunTime: "Today 8:00 AM",
    recordsProcessed: 210,
    recordsCreated: 1,
    recordsUpdated: 74,
    failedRecords: 0,
    missingFields: 0,
    duplicateRecords: 0,
    relatedRecoveryCases: 0,
    impactOnRecovery: "Weekly recovery summary and source quality data synced for owner review.",
    recommendedFix: "Keep source quality report attached to monthly summary.",
    reviewOwner: "Operations",
    tone: "indigo",
  },
];

const revenueLeakReportItems: RevenueLeakReportItem[] = [
  { id: "RLR-1", leakType: "Inquiry leak", openCases: 18, revenueAtRisk: "$7,820", recoveredValue: "$4,460", lostValue: "$1,200", recoveryRate: "57%", recommendedFix: "Reduce first-reply delay on Instagram and website forms.", tone: "rose" },
  { id: "RLR-2", leakType: "Follow-up leak", openCases: 22, revenueAtRisk: "$9,640", recoveredValue: "$6,180", lostValue: "$1,840", recoveryRate: "64%", recommendedFix: "Assign overdue follow-ups by owner and priority.", tone: "amber" },
  { id: "RLR-3", leakType: "Payment pending leak", openCases: 12, revenueAtRisk: "$6,840", recoveredValue: "$8,920", lostValue: "$1,100", recoveryRate: "73%", recommendedFix: "Improve payment reminder cadence for WhatsApp and bundle buyers.", tone: "emerald" },
  { id: "RLR-4", leakType: "Repeat purchase leak", openCases: 16, revenueAtRisk: "$4,956", recoveredValue: "$7,080", lostValue: "$640", recoveryRate: "74%", recommendedFix: "Create refill reminders before reorder windows become overdue.", tone: "cyan" },
  { id: "RLR-4B", leakType: "Refill leak", openCases: 9, revenueAtRisk: "$2,120", recoveredValue: "$3,940", lostValue: "$420", recoveryRate: "65%", recommendedFix: "Send refill reminders before serum and moisturizer reorder windows slip.", tone: "emerald" },
  { id: "RLR-5", leakType: "Restock/new drop leak", openCases: 14, revenueAtRisk: "$12,730", recoveredValue: "$6,030", lostValue: "$2,260", recoveryRate: "47%", recommendedFix: "Notify high-intent waitlist buyers as soon as restock data syncs.", tone: "rose" },
  { id: "RLR-6", leakType: "Post-purchase leak", openCases: 19, revenueAtRisk: "$3,420", recoveredValue: "$4,180", lostValue: "$580", recoveryRate: "55%", recommendedFix: "Send review, referral, and UGC prompts after delivery satisfaction checks.", tone: "indigo" },
  { id: "RLR-7", leakType: "Order risk leak", openCases: 9, revenueAtRisk: "$5,980", recoveredValue: "$2,730", lostValue: "$900", recoveryRate: "46%", recommendedFix: "Clear address, delivery, and payment-order mismatches before post-purchase actions.", tone: "amber" },
  { id: "RLR-8", leakType: "Source sync leak", openCases: 7, revenueAtRisk: "$4,200", recoveredValue: "$1,320", lostValue: "$760", recoveryRate: "31%", recommendedFix: "Review failed syncs, missing fields, and duplicate records weekly.", tone: "rose" },
  { id: "RLR-9", leakType: "Ownership leak", openCases: 11, revenueAtRisk: "$4,740", recoveredValue: "$980", lostValue: "$1,050", recoveryRate: "21%", recommendedFix: "Assign missing owners on imports and source-leak records.", tone: "rose" },
];

const sourceLeakReportItems: SourceLeakReportItem[] = [
  { id: "SLR-1", sourceName: "Instagram DM", capturedInquiries: 42, highIntentLeads: 18, missingFirstReplies: 7, overdueFollowUps: 3, paymentPendingValue: "$2,840", recoveredValue: "$1,900", syncIssues: 2, sourceQualityNote: "Strong demand, high follow-up leakage.", tone: "rose" },
  { id: "SLR-2", sourceName: "Website Form", capturedInquiries: 36, highIntentLeads: 16, missingFirstReplies: 2, overdueFollowUps: 4, paymentPendingValue: "$1,850", recoveredValue: "$5,550", syncIssues: 0, sourceQualityNote: "High-quality bridal and product inquiries.", tone: "emerald" },
  { id: "SLR-3", sourceName: "WhatsApp", capturedInquiries: 28, highIntentLeads: 14, missingFirstReplies: 1, overdueFollowUps: 4, paymentPendingValue: "$6,840", recoveredValue: "$8,920", syncIssues: 0, sourceQualityNote: "Payment reminders recover meaningful bundle value.", tone: "amber" },
  { id: "SLR-4", sourceName: "Shopify / Ecommerce", capturedInquiries: 64, highIntentLeads: 19, missingFirstReplies: 0, overdueFollowUps: 6, paymentPendingValue: "$3,120", recoveredValue: "$7,080", syncIssues: 3, sourceQualityNote: "Refill data works, missing SKU values need cleanup.", tone: "cyan" },
  { id: "SLR-5", sourceName: "Event / Pop-up", capturedInquiries: 54, highIntentLeads: 21, missingFirstReplies: 8, overdueFollowUps: 9, paymentPendingValue: "$4,200", recoveredValue: "$1,360", syncIssues: 4, sourceQualityNote: "Owner assignment is the biggest pop-up leak.", tone: "rose" },
  { id: "SLR-6", sourceName: "Referral", capturedInquiries: 18, highIntentLeads: 10, missingFirstReplies: 1, overdueFollowUps: 2, paymentPendingValue: "$620", recoveredValue: "$2,640", syncIssues: 0, sourceQualityNote: "Referral source has strong recovery quality.", tone: "emerald" },
  { id: "SLR-7", sourceName: "CSV Import", capturedInquiries: 71, highIntentLeads: 24, missingFirstReplies: 10, overdueFollowUps: 7, paymentPendingValue: "$4,980", recoveredValue: "$1,820", syncIssues: 5, sourceQualityNote: "Missing owners and duplicate records create avoidable revenue leakage.", tone: "amber" },
];

const productLeakReportItems: ProductLeakReportItem[] = [
  { id: "PLR-1", productCategory: "Bridal capsule", demandValue: "$18,500", openRecoveryCases: 11, missedRefillRestockValue: "$0", recoveredValue: "$5,550", missingDataNote: "Appointment owner present, size notes inconsistent.", recommendedAction: "Prioritize bridal appointment follow-up and fit context.", tone: "rose" },
  { id: "PLR-2", productCategory: "Denim drop", demandValue: "$8,100", openRecoveryCases: 18, missedRefillRestockValue: "$3,780", recoveredValue: "$2,520", missingDataNote: "Some size variants need fit tags.", recommendedAction: "Clean fit tags and send size waitlist updates.", tone: "cyan" },
  { id: "PLR-3", productCategory: "Lip oil shade restock", demandValue: "$5,640", openRecoveryCases: 12, missedRefillRestockValue: "$1,584", recoveredValue: "$504", missingDataNote: "Shade-level SKU mapping needs review.", recommendedAction: "Map shade SKU and notify restock waitlist.", tone: "amber" },
  { id: "PLR-4", productCategory: "Vitamin C serum refill", demandValue: "$4,956", openRecoveryCases: 18, missedRefillRestockValue: "$1,180", recoveredValue: "$7,080", missingDataNote: "Refill cycle is clean.", recommendedAction: "Keep 60-day refill reminders active.", tone: "emerald" },
  { id: "PLR-5", productCategory: "Routine bundle", demandValue: "$12,730", openRecoveryCases: 9, missedRefillRestockValue: "$2,010", recoveredValue: "$6,030", missingDataNote: "Bundle SKU data is clean, payment timing needs review.", recommendedAction: "Improve payment reminder cadence for bundle buyers.", tone: "indigo" },
  { id: "PLR-6", productCategory: "Sensitive-skin starter kit", demandValue: "$3,020", openRecoveryCases: 7, missedRefillRestockValue: "$620", recoveredValue: "$2,480", missingDataNote: "Human-review tag present.", recommendedAction: "Use sensitive-skin review before refill or UGC prompts.", tone: "cyan" },
  { id: "PLR-7", productCategory: "New drop waitlist", demandValue: "$15,900", openRecoveryCases: 11, missedRefillRestockValue: "$4,200", recoveredValue: "$6,720", missingDataNote: "VIP tags are clean, owner handoff needs review.", recommendedAction: "Prioritize VIP early-access follow-up.", tone: "rose" },
];

const teamOwnershipReportItems: TeamOwnershipReportItem[] = [
  { id: "TOR-1", owner: "Amara Shah", openActions: 18, overdueActions: 4, revenueAtRiskOwned: "$15.2K", recoveredValue: "$6.4K", bottleneckNote: "Overloaded on bridal and first-reply recovery.", recommendedWorkloadAction: "Move medium-priority follow-ups to support.", tone: "rose" },
  { id: "TOR-2", owner: "Mina Cole", openActions: 14, overdueActions: 2, revenueAtRiskOwned: "$5.8K", recoveredValue: "$9.4K", bottleneckNote: "Refill queue rising but recovery rate strong.", recommendedWorkloadAction: "Keep refill windows ahead of overdue status.", tone: "emerald" },
  { id: "TOR-3", owner: "Tessa Nguyen", openActions: 12, overdueActions: 5, revenueAtRiskOwned: "$8.7K", recoveredValue: "$8.1K", bottleneckNote: "Payment reminders and order risk handoffs are late.", recommendedWorkloadAction: "Prioritize high-value payment reminders.", tone: "amber" },
  { id: "TOR-4", owner: "Luis Park", openActions: 9, overdueActions: 1, revenueAtRiskOwned: "$3.6K", recoveredValue: "$4.6K", bottleneckNote: "Post-purchase workload is stable.", recommendedWorkloadAction: "Take two UGC prompts from overloaded owners.", tone: "indigo" },
  { id: "TOR-5", owner: "Operations", openActions: 10, overdueActions: 3, revenueAtRiskOwned: "$4.9K", recoveredValue: "$3.2K", bottleneckNote: "Handoffs waiting on address/order confirmation.", recommendedWorkloadAction: "Clear order-risk handoffs before refill prompts continue.", tone: "cyan" },
  { id: "TOR-6", owner: "Unassigned", openActions: 7, overdueActions: 5, revenueAtRiskOwned: "$4.2K", recoveredValue: "$0", bottleneckNote: "Owner missing on pop-up and CSV records.", recommendedWorkloadAction: "Assign unowned pop-up leads today.", tone: "gray" },
];

const monthlyRecoveredBreakdown: MonthlySummaryMetric[] = [
  { id: "MSM-1", label: "Payment recovered", value: "$8.9K", note: "WhatsApp and checkout reminders", tone: "amber" },
  { id: "MSM-2", label: "Follow-up recovered", value: "$6.2K", note: "First replies and second nudges", tone: "rose" },
  { id: "MSM-3", label: "Refill/reorder recovered", value: "$7.1K", note: "Serum and moisturizer reorder windows", tone: "emerald" },
  { id: "MSM-4", label: "Restock recovered", value: "$6.0K", note: "Shade and new drop waitlist notices", tone: "cyan" },
  { id: "MSM-5", label: "Inactive buyer reactivation", value: "$2.4K", note: "Winback actions and missed refill recovery", tone: "indigo" },
  { id: "MSM-6", label: "Post-purchase influenced", value: "$4.2K", note: "Reviews, referrals, and UGC prompts", tone: "emerald" },
];

const monthlyOpenRiskItems: MonthlySummaryMetric[] = [
  { id: "MOR-1", label: "Instagram DM follow-up delay", value: "$6.2K", note: "18 open cases, Amara Shah", tone: "rose" },
  { id: "MOR-2", label: "Payment pending reminders", value: "$6.8K", note: "12 open cases, Tessa Nguyen", tone: "amber" },
  { id: "MOR-3", label: "Restock waitlist notices", value: "$5.6K", note: "12 open cases, Mina Cole", tone: "cyan" },
  { id: "MOR-4", label: "Pop-up leads missing owner", value: "$4.2K", note: "7 open cases, Unassigned", tone: "rose" },
];

const monthlyAutomationSummary: MonthlySummaryMetric[] = [
  { id: "MAS-1", label: "Connected sources", value: "11", note: "Third-party automation monitored", tone: "cyan" },
  { id: "MAS-2", label: "Successful syncs", value: "187", note: "External workflow syncs this month", tone: "emerald" },
  { id: "MAS-3", label: "Failed syncs", value: "14", note: "Most tied to missing SKU or owner fields", tone: "rose" },
  { id: "MAS-4", label: "Records created", value: "412", note: "Recovery records created from source events", tone: "amber" },
  { id: "MAS-5", label: "Records needing review", value: "31", note: "Missing fields, duplicate records, or owner review", tone: "rose" },
  { id: "MAS-6", label: "Biggest automation issue", value: "SKU map", note: "Shopify SKU field is missing on failed order records", tone: "amber" },
];

const monthlyRecommendations: MonthlyRecommendation[] = [
  { id: "REC-1", recommendation: "Reduce Instagram follow-up delay", reason: "$6.2K remains at risk from delayed first replies.", owner: "Amara Shah", priority: "Critical", impact: "Faster inquiry recovery", tone: "rose" },
  { id: "REC-2", recommendation: "Clean missing SKU fields", reason: "Failed order syncs create order risk cases needing review.", owner: "Operations", priority: "High", impact: "Cleaner order risk and product reports", tone: "amber" },
  { id: "REC-3", recommendation: "Create refill actions for serum buyers", reason: "Serum buyers are entering reorder windows with high recovery rates.", owner: "Mina Cole", priority: "High", impact: "Repeat revenue growth", tone: "emerald" },
  { id: "REC-4", recommendation: "Notify restock waitlist", reason: "Lip oil shade and denim size demand is recoverable now.", owner: "Mina Cole", priority: "Medium", impact: "Restock revenue recovery", tone: "cyan" },
  { id: "REC-5", recommendation: "Prioritize high-value inactive buyers", reason: "Bridal, VIP, and payment-abandoned buyers are cheaper to recover than replace.", owner: "Luis Park", priority: "High", impact: "Reactivation revenue", tone: "indigo" },
  { id: "REC-6", recommendation: "Assign unowned pop-up leads", reason: "$4.2K in event leads is still missing owners.", owner: "Operations", priority: "Critical", impact: "Ownership leak reduction", tone: "rose" },
];

const brandSettings: BrandSettings = {
  brandName: "Altynx Demo Brand",
  industryFocus: "Hybrid Fashion + Beauty",
  brandType: "wholesale + DTC hybrid",
  primaryMarket: "United States",
  currency: "USD",
  timezone: "America/New_York",
  mainSalesChannels: ["Website Form", "Instagram DM", "WhatsApp", "Shopify / Ecommerce", "Event / Pop-up"],
  ecommercePlatform: "Shopify / Ecommerce",
  preferredCommunicationChannels: ["Instagram DM", "WhatsApp", "Email", "Manual Copy"],
  defaultOwnerAdmin: "Amara Shah",
};

const recoveryModuleSettings: RecoveryModuleSetting[] = [
  { id: "MOD-1", moduleName: "Inquiry Recovery", status: "Enabled", purpose: "Capture buyer interest and prevent first-reply leaks.", defaultOwner: "Amara Shah", tone: "cyan" },
  { id: "MOD-2", moduleName: "Follow-up Recovery", status: "Enabled", purpose: "Keep high-intent buyers from aging without a next action.", defaultOwner: "Amara Shah", tone: "rose" },
  { id: "MOD-3", moduleName: "Payment Recovery", status: "Enabled", purpose: "Recover buyers who said yes but have not paid.", defaultOwner: "Tessa Nguyen", tone: "amber" },
  { id: "MOD-4", moduleName: "Refill Opportunities", status: "Enabled", purpose: "Recover beauty and skincare reorder windows.", defaultOwner: "Mina Cole", tone: "emerald" },
  { id: "MOD-5", moduleName: "Restock Waitlist", status: "Enabled", purpose: "Notify buyers waiting on sizes, shades, and new drops.", defaultOwner: "Luis Park", tone: "indigo" },
  { id: "MOD-6", moduleName: "Post-Purchase Recovery", status: "Enabled", purpose: "Turn delivery into issue recovery and next-purchase timing.", defaultOwner: "Luis Park", tone: "cyan" },
  { id: "MOD-7", moduleName: "Reviews / Referrals / UGC", status: "Enabled", purpose: "Recover social proof and referral value after delivery.", defaultOwner: "Luis Park", tone: "emerald" },
  { id: "MOD-8", moduleName: "Inactive Buyer Recovery", status: "Enabled", purpose: "Reactivate buyers who went cold after payment, refill, or restock leaks.", defaultOwner: "Amara Shah", tone: "rose" },
  { id: "MOD-9", moduleName: "Automation Health", status: "Enabled", purpose: "Monitor third-party automation sync health and review needs.", defaultOwner: "Operations", tone: "amber" },
  { id: "MOD-10", moduleName: "Monthly Summary", status: "Enabled", purpose: "Prepare client review proof of recovered value and next month focus.", defaultOwner: "Operations", tone: "cyan" },
];

const recoveryWindowSettings: RecoveryWindowSetting[] = [
  { id: "WIN-1", settingName: "First reply target", value: "2 hours", recoveryUse: "Prevent high-intent inquiry leak.", defaultOwner: "Recovery Lead", tone: "rose" },
  { id: "WIN-2", settingName: "Overdue follow-up threshold", value: "24 hours", recoveryUse: "Flag aging follow-up actions.", defaultOwner: "Recovery Lead", tone: "amber" },
  { id: "WIN-3", settingName: "Payment reminder cadence", value: "24 hours after pending payment", recoveryUse: "Recover payment pending buyers.", defaultOwner: "Order Recovery", tone: "amber" },
  { id: "WIN-4", settingName: "Skincare refill window", value: "45-60 days", recoveryUse: "Open refill opportunity before reorder delay.", defaultOwner: "Beauty Specialist", tone: "emerald" },
  { id: "WIN-5", settingName: "Restock notice timing", value: "Same day as restock signal", recoveryUse: "Notify waitlist before demand cools.", defaultOwner: "Sales / Marketing", tone: "cyan" },
  { id: "WIN-6", settingName: "Delivery follow-up timing", value: "2 days after delivered", recoveryUse: "Protect satisfaction and issue recovery.", defaultOwner: "Post-Purchase", tone: "indigo" },
  { id: "WIN-7", settingName: "Review request timing", value: "5 days after delivered", recoveryUse: "Create review, referral, and UGC opportunities.", defaultOwner: "Post-Purchase", tone: "emerald" },
  { id: "WIN-8", settingName: "Inactive buyer threshold", value: "90 days", recoveryUse: "Open winback action for valuable inactive buyers.", defaultOwner: "Recovery Lead", tone: "rose" },
];

const sourceSetupRecords: SourceSetupRecord[] = [
  { id: "SRCSET-1", sourceName: "Website Form", sourceStatus: "Configured", defaultOwner: "Amara Shah", recoveryRule: "Create inquiry recovery action for high-intent forms.", missingFieldWarning: "None", tone: "emerald" },
  { id: "SRCSET-2", sourceName: "Instagram DM", sourceStatus: "Needs Review", defaultOwner: "Amara Shah", recoveryRule: "Route high-intent leads to Recovery Lead.", missingFieldWarning: "Owner field missing on 7 records", tone: "rose" },
  { id: "SRCSET-3", sourceName: "WhatsApp", sourceStatus: "Configured", defaultOwner: "Tessa Nguyen", recoveryRule: "Create payment recovery action for pending checkout.", missingFieldWarning: "None", tone: "cyan" },
  { id: "SRCSET-4", sourceName: "Shopify / Ecommerce", sourceStatus: "Missing Fields", defaultOwner: "Operations", recoveryRule: "Create order risk and refill opportunity records.", missingFieldWarning: "SKU field missing on failed records", tone: "amber" },
  { id: "SRCSET-5", sourceName: "Event / Pop-up", sourceStatus: "Needs Review", defaultOwner: "Unassigned Queue", recoveryRule: "Assign event leads before post-event follow-up.", missingFieldWarning: "Owner column missing from import", tone: "rose" },
  { id: "SRCSET-6", sourceName: "Referral", sourceStatus: "Configured", defaultOwner: "Luis Park", recoveryRule: "Create referral and UGC follow-up action.", missingFieldWarning: "None", tone: "emerald" },
  { id: "SRCSET-7", sourceName: "Campaign", sourceStatus: "Configured", defaultOwner: "Luis Park", recoveryRule: "Route new drop demand to restock waitlist.", missingFieldWarning: "None", tone: "indigo" },
  { id: "SRCSET-8", sourceName: "CSV Import", sourceStatus: "Needs Review", defaultOwner: "Operations", recoveryRule: "Validate buyer, owner, source, product, and stage fields.", missingFieldWarning: "Duplicate buyer checks enabled", tone: "amber" },
  { id: "SRCSET-9", sourceName: "Manual Entry", sourceStatus: "Configured", defaultOwner: "Amara Shah", recoveryRule: "Require source, owner, product context, and next action.", missingFieldWarning: "None", tone: "cyan" },
];

const setupTeamUsers: SetupTeamUser[] = [
  { id: "SETUSER-1", name: "Amara Shah", role: "Recovery Lead", email: "amara@example.com", status: "Active", assignedRecoveryAreas: ["Inquiry Recovery", "Bridal / High Ticket", "Follow-up Recovery"], activeRecoveryActions: 18, overdueActions: 4, revenueAtRiskOwned: "$15.2K", recoveredValueThisMonth: "$6.4K", permissionLevel: "Manage recovery cases and owners", tone: "rose" },
  { id: "SETUSER-2", name: "Mina Cole", role: "Beauty Specialist", email: "mina@example.com", status: "Active", assignedRecoveryAreas: ["Refill Opportunities", "Restock Waitlist", "Sensitive Skin"], activeRecoveryActions: 14, overdueActions: 2, revenueAtRiskOwned: "$5.8K", recoveredValueThisMonth: "$9.4K", permissionLevel: "Manage beauty recovery actions", tone: "emerald" },
  { id: "SETUSER-3", name: "Tessa Nguyen", role: "Order Recovery", email: "tessa@example.com", status: "Active", assignedRecoveryAreas: ["Payment Recovery", "Order Risk", "COD Confirmation"], activeRecoveryActions: 12, overdueActions: 5, revenueAtRiskOwned: "$8.7K", recoveredValueThisMonth: "$8.1K", permissionLevel: "Manage payment and order risk", tone: "amber" },
  { id: "SETUSER-4", name: "Luis Park", role: "Post-Purchase", email: "luis@example.com", status: "Active", assignedRecoveryAreas: ["Reviews / Referrals / UGC", "Delivery Follow-up", "VIP Early Access"], activeRecoveryActions: 9, overdueActions: 1, revenueAtRiskOwned: "$3.6K", recoveredValueThisMonth: "$4.6K", permissionLevel: "Manage post-purchase actions", tone: "indigo" },
  { id: "SETUSER-5", name: "Operations", role: "Operations", email: "ops@example.com", status: "Active", assignedRecoveryAreas: ["Delivery Issues", "Address Holds", "Source Review"], activeRecoveryActions: 10, overdueActions: 3, revenueAtRiskOwned: "$4.9K", recoveredValueThisMonth: "$3.2K", permissionLevel: "Manage source and order review", tone: "cyan" },
  { id: "SETUSER-6", name: "Unassigned Queue", role: "Unassigned", email: "unassigned@example.com", status: "System Queue", assignedRecoveryAreas: ["Missing owner records"], activeRecoveryActions: 7, overdueActions: 5, revenueAtRiskOwned: "$4.2K", recoveredValueThisMonth: "$0", permissionLevel: "Requires owner assignment", tone: "gray" },
];

const permissionRules: PermissionRule[] = [
  { id: "PERM-1", permissionName: "View all recovery cases", ownerAdmin: true, recoveryLead: true, specialist: true, viewer: true, recoveryUse: "Allow visibility into buyer and revenue context.", tone: "cyan" },
  { id: "PERM-2", permissionName: "Assign owners", ownerAdmin: true, recoveryLead: true, specialist: false, viewer: false, recoveryUse: "Clear unassigned recovery actions.", tone: "rose" },
  { id: "PERM-3", permissionName: "Edit buyer records", ownerAdmin: true, recoveryLead: true, specialist: true, viewer: false, recoveryUse: "Update lifecycle status and recovery notes.", tone: "emerald" },
  { id: "PERM-4", permissionName: "Edit product/SKU data", ownerAdmin: true, recoveryLead: false, specialist: true, viewer: false, recoveryUse: "Clean product tags, refill cycles, and SKU fields.", tone: "amber" },
  { id: "PERM-5", permissionName: "Manage templates", ownerAdmin: true, recoveryLead: true, specialist: false, viewer: false, recoveryUse: "Approve recovery copy before team use.", tone: "indigo" },
  { id: "PERM-6", permissionName: "Import/export data", ownerAdmin: true, recoveryLead: false, specialist: false, viewer: false, recoveryUse: "Move system data through reviewed mappings.", tone: "rose" },
  { id: "PERM-7", permissionName: "View reports", ownerAdmin: true, recoveryLead: true, specialist: true, viewer: true, recoveryUse: "Review leak and recovered value reports.", tone: "cyan" },
  { id: "PERM-8", permissionName: "Manage brand settings", ownerAdmin: true, recoveryLead: false, specialist: false, viewer: false, recoveryUse: "Control brand recovery profile and default rules.", tone: "amber" },
];

const ownershipRules: OwnershipRule[] = [
  { id: "OWN-1", trigger: "Website inquiries", defaultOwnerRole: "Sales", fallbackOwner: "Amara Shah", recoveryUse: "Route buyer interest to first-reply owner.", tone: "cyan" },
  { id: "OWN-2", trigger: "Instagram high-intent leads", defaultOwnerRole: "Recovery Lead", fallbackOwner: "Amara Shah", recoveryUse: "Prevent high-intent DM follow-up leak.", tone: "rose" },
  { id: "OWN-3", trigger: "Payment pending", defaultOwnerRole: "Order Recovery", fallbackOwner: "Tessa Nguyen", recoveryUse: "Recover checkout and payment link leaks.", tone: "amber" },
  { id: "OWN-4", trigger: "Refill opportunities", defaultOwnerRole: "Beauty Specialist", fallbackOwner: "Mina Cole", recoveryUse: "Recover reorder windows for skincare and cosmetics.", tone: "emerald" },
  { id: "OWN-5", trigger: "Restock waitlist", defaultOwnerRole: "Sales / Marketing", fallbackOwner: "Luis Park", recoveryUse: "Notify buyers waiting on size, shade, and new drop demand.", tone: "indigo" },
  { id: "OWN-6", trigger: "Delivery issues", defaultOwnerRole: "Operations", fallbackOwner: "Operations", recoveryUse: "Resolve address, delivery, and return/exchange risk.", tone: "rose" },
  { id: "OWN-7", trigger: "Reviews / UGC", defaultOwnerRole: "Post-Purchase", fallbackOwner: "Luis Park", recoveryUse: "Recover social proof and referral value.", tone: "cyan" },
  { id: "OWN-8", trigger: "Missing owner records", defaultOwnerRole: "Unassigned Queue", fallbackOwner: "Operations", recoveryUse: "Surface records that need owner assignment.", tone: "amber" },
];

const setupRecoveryStages: SetupRecoveryStage[] = [
  { id: "STG-1", stageName: "New Interest Captured", purpose: "Buyer interest was captured from a source.", defaultOwnerRole: "Recovery Lead", timingRule: "Review within 2 hours", nextRecommendedAction: "Classify intent and assign owner.", linkedTemplates: ["First reply", "Product question"], tone: "cyan" },
  { id: "STG-2", stageName: "First Reply Needed", purpose: "Buyer has not received a first reply.", defaultOwnerRole: "Sales", timingRule: "Due within 2 hours", nextRecommendedAction: "Send first reply template.", linkedTemplates: ["First reply", "Size/fit help"], tone: "rose" },
  { id: "STG-3", stageName: "Qualified Interest", purpose: "Buyer intent is strong enough for recovery action.", defaultOwnerRole: "Recovery Lead", timingRule: "Same day", nextRecommendedAction: "Create follow-up or payment action.", linkedTemplates: ["Follow-up nudge"], tone: "amber" },
  { id: "STG-4", stageName: "Follow-up Needed", purpose: "Buyer needs a next touch to prevent leakage.", defaultOwnerRole: "Recovery Lead", timingRule: "24 hours", nextRecommendedAction: "Send follow-up nudge.", linkedTemplates: ["Follow-up nudge"], tone: "rose" },
  { id: "STG-5", stageName: "Payment Pending", purpose: "Buyer said yes but payment is incomplete.", defaultOwnerRole: "Order Recovery", timingRule: "24 hours after pending payment", nextRecommendedAction: "Send payment reminder.", linkedTemplates: ["Payment pending reminder"], tone: "amber" },
  { id: "STG-6", stageName: "Order Confirmed", purpose: "Order is confirmed and post-purchase timing begins.", defaultOwnerRole: "Operations", timingRule: "Monitor until delivered", nextRecommendedAction: "Watch order risk and delivery status.", linkedTemplates: ["Order address verification"], tone: "cyan" },
  { id: "STG-7", stageName: "Delivered / Post-Purchase", purpose: "Delivery creates satisfaction, review, referral, and repeat revenue timing.", defaultOwnerRole: "Post-Purchase", timingRule: "2 days after delivered", nextRecommendedAction: "Send satisfaction check.", linkedTemplates: ["Delivery satisfaction check", "Review request"], tone: "emerald" },
  { id: "STG-8", stageName: "Repeat Opportunity", purpose: "Refill, restock, or second-purchase timing is open.", defaultOwnerRole: "Beauty Specialist", timingRule: "45-60 days or restock signal", nextRecommendedAction: "Send refill or restock reminder.", linkedTemplates: ["Refill reorder reminder", "Restock notice"], tone: "indigo" },
  { id: "STG-9", stageName: "Lost / Inactive", purpose: "Buyer went cold or missed the recovery window.", defaultOwnerRole: "Recovery Lead", timingRule: "90 days inactive", nextRecommendedAction: "Create winback action.", linkedTemplates: ["Inactive buyer winback"], tone: "gray" },
  { id: "STG-10", stageName: "Recovered", purpose: "Revenue was recovered or recovery action completed.", defaultOwnerRole: "Owner / Admin", timingRule: "Mark after confirmed outcome", nextRecommendedAction: "Log recovered value and next lifecycle action.", linkedTemplates: ["Review request", "Referral request"], tone: "emerald" },
];

const setupBuyerTags: BuyerTag[] = [
  { id: "BTAG-1", tagName: "VIP Buyer", recordCount: 24, recoveryUse: "Prioritize high-value recovery actions.", tone: "indigo" },
  { id: "BTAG-2", tagName: "High Intent", recordCount: 68, recoveryUse: "Escalate first replies and follow-ups.", tone: "rose" },
  { id: "BTAG-3", tagName: "Refill Ready", recordCount: 31, recoveryUse: "Open refill opportunity actions.", tone: "emerald" },
  { id: "BTAG-4", tagName: "Restock Waiting", recordCount: 44, recoveryUse: "Notify buyers when sizes or shades return.", tone: "amber" },
  { id: "BTAG-5", tagName: "Inactive Buyer", recordCount: 39, recoveryUse: "Create winback actions.", tone: "gray" },
  { id: "BTAG-6", tagName: "Payment Pending", recordCount: 12, recoveryUse: "Route to payment recovery owner.", tone: "rose" },
  { id: "BTAG-7", tagName: "UGC Candidate", recordCount: 16, recoveryUse: "Create social proof action after delivery.", tone: "cyan" },
  { id: "BTAG-8", tagName: "Sensitive Skin", recordCount: 18, recoveryUse: "Require careful beauty reply context.", tone: "emerald" },
  { id: "BTAG-9", tagName: "Bridal / High Ticket", recordCount: 11, recoveryUse: "Require human review and appointment follow-up.", tone: "rose" },
  { id: "BTAG-10", tagName: "Event / Pop-up Lead", recordCount: 54, recoveryUse: "Route event leads to assigned owner.", tone: "amber" },
];

const setupProductTags: ProductTag[] = [
  { id: "SPTAG-1", tagName: "Refill Product", productCount: 28, recoveryRuleUse: "Start refill reminder windows.", tone: "emerald" },
  { id: "SPTAG-2", tagName: "Restock Product", productCount: 31, recoveryRuleUse: "Create restock waitlist actions.", tone: "amber" },
  { id: "SPTAG-3", tagName: "New Drop", productCount: 18, recoveryRuleUse: "Route launch demand and VIP early access.", tone: "indigo" },
  { id: "SPTAG-4", tagName: "High Ticket", productCount: 11, recoveryRuleUse: "Require owner review and consultation follow-up.", tone: "rose" },
  { id: "SPTAG-5", tagName: "Bundle Product", productCount: 18, recoveryRuleUse: "Support payment recovery and repeat timing.", tone: "cyan" },
  { id: "SPTAG-6", tagName: "Routine Step", productCount: 35, recoveryRuleUse: "Attach skincare context to templates.", tone: "emerald" },
  { id: "SPTAG-7", tagName: "Shade Match", productCount: 26, recoveryRuleUse: "Route product-match questions and shade restocks.", tone: "amber" },
  { id: "SPTAG-8", tagName: "Size / Fit", productCount: 22, recoveryRuleUse: "Trigger fit guidance replies.", tone: "rose" },
  { id: "SPTAG-9", tagName: "VIP Early Access", productCount: 9, recoveryRuleUse: "Route VIP new drop demand.", tone: "indigo" },
];

const setupSourceTags: SourceTag[] = [
  { id: "SOTAG-1", tagName: "Website Form", recordCount: 36, recoveryUse: "Source tag for form-captured inquiry recovery.", tone: "emerald" },
  { id: "SOTAG-2", tagName: "Instagram DM", recordCount: 42, recoveryUse: "Source tag for DM first-reply leakage.", tone: "rose" },
  { id: "SOTAG-3", tagName: "WhatsApp", recordCount: 28, recoveryUse: "Source tag for payment and bundle recovery.", tone: "amber" },
  { id: "SOTAG-4", tagName: "Shopify / Ecommerce", recordCount: 64, recoveryUse: "Source tag for orders, refills, and payment status.", tone: "cyan" },
  { id: "SOTAG-5", tagName: "Event / Pop-up", recordCount: 54, recoveryUse: "Source tag for event lead owner routing.", tone: "rose" },
  { id: "SOTAG-6", tagName: "Referral", recordCount: 18, recoveryUse: "Source tag for referral and UGC actions.", tone: "emerald" },
  { id: "SOTAG-7", tagName: "CSV Import", recordCount: 71, recoveryUse: "Source tag for imported records requiring validation.", tone: "amber" },
  { id: "SOTAG-8", tagName: "Manual Entry", recordCount: 12, recoveryUse: "Source tag for manually entered recovery records.", tone: "gray" },
];

const setupSmartTagSuggestions: SetupSmartTagSuggestion[] = [
  { id: "SSUG-1", condition: "Product contains \"serum\"", suggestedTags: ["Skincare", "Refill Product", "Routine Step"], reason: "Serum products usually need refill timing and routine context.", affectedRecords: 7, tone: "emerald" },
  { id: "SSUG-2", condition: "Product contains \"bridal\"", suggestedTags: ["High Ticket", "Consultation Needed", "VIP"], reason: "Bridal demand should route to human review and appointment follow-up.", affectedRecords: 4, tone: "rose" },
  { id: "SSUG-3", condition: "Source is pop-up event", suggestedTags: ["Event Lead", "Needs Owner", "Post-Event Follow-up"], reason: "Event leads leak quickly without owner routing.", affectedRecords: 54, tone: "amber" },
  { id: "SSUG-4", condition: "Buyer has no purchase in 90 days", suggestedTags: ["Inactive Buyer", "Winback Action"], reason: "Inactive buyers should enter recovery before value is lost.", affectedRecords: 39, tone: "gray" },
  { id: "SSUG-5", condition: "Delivered order with positive note", suggestedTags: ["Review Candidate", "UGC Candidate"], reason: "Positive delivery signals should create post-purchase recovery actions.", affectedRecords: 16, tone: "cyan" },
  { id: "SSUG-6", condition: "Missing SKU", suggestedTags: ["Needs Product Cleanup"], reason: "Missing SKU blocks product demand and order risk reporting.", affectedRecords: 12, tone: "rose" },
];

const messageTemplates: MessageTemplate[] = [
  { id: "TPL-1", templateName: "Bridal consultation follow-up", recoveryType: "First Reply", industryFit: "Fashion / Apparel", channel: "Email", owner: "Amara Shah", approvalStatus: "Approved", lastUpdated: "Today", usageCount: 38, linkedStageTag: "First Reply Needed / Bridal", previewText: "Hi {{buyer_name}}, I can still hold two styling windows for {{product_name}} this week. Would Thursday afternoon or Saturday morning work?", tone: "rose" },
  { id: "TPL-2", templateName: "Size/fit guidance reply", recoveryType: "First Reply", industryFit: "Fashion / Apparel", channel: "Instagram DM", owner: "Amara Shah", approvalStatus: "Approved", lastUpdated: "Yesterday", usageCount: 64, linkedStageTag: "Size / Fit", previewText: "Hi {{buyer_name}}, {{product_name}} runs true to size with a structured fit. Share your usual size and I can suggest the best option.", tone: "cyan" },
  { id: "TPL-3", templateName: "Skincare serum first reply", recoveryType: "First Reply", industryFit: "Beauty / Skincare", channel: "Manual Copy", owner: "Mina Cole", approvalStatus: "Approved", lastUpdated: "2 days ago", usageCount: 52, linkedStageTag: "Serum / Skincare", previewText: "Hi {{buyer_name}}, {{product_name}} works best as a treatment step. Tell me your routine and I can help place it safely.", tone: "emerald" },
  { id: "TPL-4", templateName: "Sensitive-skin product reply", recoveryType: "Order Issue", industryFit: "Beauty / Skincare", channel: "WhatsApp", owner: "Mina Cole", approvalStatus: "Needs Review", lastUpdated: "Last week", usageCount: 21, linkedStageTag: "Sensitive Skin", previewText: "Hi {{buyer_name}}, before recommending {{product_name}}, can you share any known sensitivities or ingredients you avoid?", tone: "amber" },
  { id: "TPL-5", templateName: "Payment pending reminder", recoveryType: "Payment Reminder", industryFit: "Hybrid", channel: "WhatsApp", owner: "Tessa Nguyen", approvalStatus: "Approved", lastUpdated: "Today", usageCount: 89, linkedStageTag: "Payment Pending", previewText: "Hi {{buyer_name}}, your {{product_name}} payment link is still open. I can resend it now or adjust the order if needed.", tone: "rose" },
  { id: "TPL-6", templateName: "Refill reorder reminder", recoveryType: "Refill Reminder", industryFit: "Beauty / Skincare", channel: "Email", owner: "Mina Cole", approvalStatus: "Approved", lastUpdated: "Today", usageCount: 73, linkedStageTag: "Refill Ready", previewText: "Hi {{buyer_name}}, your {{refill_window}} is active for {{product_name}}. Want us to prepare your refill before you run low?", tone: "emerald" },
  { id: "TPL-7", templateName: "Restock back-in-stock notice", recoveryType: "Restock Notice", industryFit: "Hybrid", channel: "SMS placeholder", owner: "Luis Park", approvalStatus: "Approved", lastUpdated: "Yesterday", usageCount: 58, linkedStageTag: "Restock Waiting", previewText: "Good news {{buyer_name}}, {{restock_item}} is back. Want us to hold it before it sells through again?", tone: "amber" },
  { id: "TPL-8", templateName: "Delivery satisfaction check", recoveryType: "Delivery Follow-up", industryFit: "Hybrid", channel: "Email", owner: "Luis Park", approvalStatus: "Approved", lastUpdated: "3 days ago", usageCount: 44, linkedStageTag: "Delivered / Post-Purchase", previewText: "Hi {{buyer_name}}, did everything arrive well with order {{order_number}}? I want to make sure {{product_name}} worked as expected.", tone: "cyan" },
  { id: "TPL-9", templateName: "Review request", recoveryType: "Review Request", industryFit: "Hybrid", channel: "Email", owner: "Luis Park", approvalStatus: "Approved", lastUpdated: "Today", usageCount: 39, linkedStageTag: "Review Candidate", previewText: "Hi {{buyer_name}}, if {{product_name}} worked well for you, a short review would help other buyers choose confidently.", tone: "emerald" },
  { id: "TPL-10", templateName: "Referral request", recoveryType: "Referral Request", industryFit: "Hybrid", channel: "Manual Copy", owner: "Luis Park", approvalStatus: "Draft", lastUpdated: "Last week", usageCount: 12, linkedStageTag: "Referral Candidate", previewText: "Hi {{buyer_name}}, if anyone asked about {{product_name}}, I can send over a referral note from {{owner_name}}.", tone: "indigo" },
  { id: "TPL-11", templateName: "UGC / try-on request", recoveryType: "UGC Request", industryFit: "Fashion / Apparel", channel: "Instagram DM", owner: "Luis Park", approvalStatus: "Approved", lastUpdated: "Yesterday", usageCount: 27, linkedStageTag: "UGC Candidate", previewText: "Hi {{buyer_name}}, if you style {{product_name}}, we would love to see a try-on photo or short note.", tone: "cyan" },
  { id: "TPL-12", templateName: "Inactive buyer winback", recoveryType: "Winback", industryFit: "Hybrid", channel: "Email", owner: "Amara Shah", approvalStatus: "Needs Review", lastUpdated: "Last week", usageCount: 18, linkedStageTag: "Lost / Inactive", previewText: "Hi {{buyer_name}}, we may have missed the timing on {{product_name}}. Want help picking up where we left off?", tone: "rose" },
  { id: "TPL-13", templateName: "Order address verification", recoveryType: "Order Issue", industryFit: "Hybrid", channel: "WhatsApp", owner: "Operations", approvalStatus: "Approved", lastUpdated: "Today", usageCount: 31, linkedStageTag: "Order Risk", previewText: "Hi {{buyer_name}}, can you confirm the address for order {{order_number}} so we can keep the order moving?", tone: "amber" },
  { id: "TPL-14", templateName: "COD confirmation", recoveryType: "Payment Reminder", industryFit: "Hybrid", channel: "Manual Copy", owner: "Tessa Nguyen", approvalStatus: "Approved", lastUpdated: "2 days ago", usageCount: 17, linkedStageTag: "COD Confirmation", previewText: "Hi {{buyer_name}}, please confirm COD for order {{order_number}} so we can keep {{product_name}} reserved.", tone: "indigo" },
];

const setupImportJobs: ImportJob[] = [
  { id: "JOB-1", activityType: "Import", dataSet: "Buyer/customer list", rowsProcessed: 482, issuesFound: 17, status: "Needs Review", owner: "Operations", timestamp: "Today 10:20 AM", nextAction: "Review missing owner and duplicate buyer issues.", tone: "amber" },
  { id: "JOB-2", activityType: "Import", dataSet: "Product/SKU list", rowsProcessed: 156, issuesFound: 12, status: "Needs Review", owner: "Mina Cole", timestamp: "Yesterday", nextAction: "Map missing SKU and category fields.", tone: "rose" },
  { id: "JOB-3", activityType: "Export", dataSet: "Monthly summary", rowsProcessed: 1, issuesFound: 0, status: "Completed", owner: "Operations", timestamp: "Today 8:00 AM", nextAction: "Share client review summary.", tone: "emerald" },
  { id: "JOB-4", activityType: "Export", dataSet: "Revenue leak report", rowsProcessed: 88, issuesFound: 0, status: "Ready", owner: "Amara Shah", timestamp: "Yesterday", nextAction: "Review open recommendations.", tone: "cyan" },
  { id: "JOB-5", activityType: "Import", dataSet: "Event / Pop-up source mapping", rowsProcessed: 54, issuesFound: 9, status: "Failed", owner: "Unassigned", timestamp: "2 days ago", nextAction: "Add owner column and revalidate import.", tone: "rose" },
];

const importValidationIssues: ImportValidationIssue[] = [
  { id: "ISS-1", issueType: "Missing buyer name", affectedRows: 3, severity: "High", recommendedFix: "Add buyer name before creating recovery cases.", tone: "rose" },
  { id: "ISS-2", issueType: "Missing source", affectedRows: 6, severity: "Medium", recommendedFix: "Map each record to source tag for leak reporting.", tone: "amber" },
  { id: "ISS-3", issueType: "Missing owner", affectedRows: 12, severity: "High", recommendedFix: "Assign default owner or route to Unassigned Queue.", tone: "rose" },
  { id: "ISS-4", issueType: "Missing product/SKU", affectedRows: 10, severity: "High", recommendedFix: "Map product and SKU before order risk or demand reporting.", tone: "rose" },
  { id: "ISS-5", issueType: "Duplicate buyer", affectedRows: 8, severity: "Medium", recommendedFix: "Merge duplicate buyers before assigning recovery actions.", tone: "amber" },
  { id: "ISS-6", issueType: "Invalid email/phone", affectedRows: 5, severity: "Low", recommendedFix: "Review contact fields before template use.", tone: "cyan" },
  { id: "ISS-7", issueType: "Missing recovery stage", affectedRows: 7, severity: "Medium", recommendedFix: "Map records to New Interest, Payment Pending, or Repeat Opportunity.", tone: "indigo" },
];

const setupExportDatasets: SetupExportDataset[] = [
  { id: "EXDATA-1", datasetName: "Buyers", records: 1240, formats: ["CSV", "XLSX placeholder", "JSON placeholder"], recoveryUse: "Buyer lifecycle and value context.", tone: "cyan" },
  { id: "EXDATA-2", datasetName: "Recovery cases", records: 312, formats: ["CSV", "XLSX placeholder", "JSON placeholder"], recoveryUse: "Open and recovered case export.", tone: "rose" },
  { id: "EXDATA-3", datasetName: "Revenue leak report", records: 88, formats: ["CSV", "PDF placeholder"], recoveryUse: "Management leak reporting.", tone: "amber" },
  { id: "EXDATA-4", datasetName: "Monthly summary", records: 1, formats: ["PDF placeholder", "CSV"], recoveryUse: "Client review package.", tone: "emerald" },
  { id: "EXDATA-5", datasetName: "Product catalog", records: 156, formats: ["CSV", "XLSX placeholder", "JSON placeholder"], recoveryUse: "Product recovery data movement.", tone: "indigo" },
  { id: "EXDATA-6", datasetName: "Tags/stages", records: 74, formats: ["CSV", "JSON placeholder"], recoveryUse: "Recovery stage and tag setup review.", tone: "cyan" },
  { id: "EXDATA-7", datasetName: "Templates", records: 42, formats: ["CSV", "JSON placeholder"], recoveryUse: "Approved recovery message library.", tone: "emerald" },
  { id: "EXDATA-8", datasetName: "Team workload", records: 18, formats: ["CSV", "PDF placeholder"], recoveryUse: "Owner workload and bottleneck review.", tone: "rose" },
  { id: "EXDATA-9", datasetName: "Automation health log", records: 210, formats: ["CSV", "JSON placeholder"], recoveryUse: "Third-party sync monitoring export.", tone: "amber" },
  { id: "EXDATA-10", datasetName: "Recovered revenue report", records: 96, formats: ["CSV", "PDF placeholder"], recoveryUse: "Proof of recovered value.", tone: "emerald" },
];

const activities: RecoveryActivity[] = [
  {
    id: "ACT-1",
    category: "Inquiries",
    title: "Bridal collection inquiry captured",
    description: "Website form created a recovery action for Sophia Bennett's Atelier Luma bridal capsule inquiry.",
    impactBadge: "$1,850 at risk",
    relatedRecord: "Website form - RR-1041",
    owner: "Amara Shah",
    status: "Action required",
    nextAction: "Send bridal appointment windows.",
    timestamp: "46m ago",
    tone: "rose",
  },
  {
    id: "ACT-2",
    category: "Inquiries",
    title: "Size/fit inquiry flagged",
    description: "Instagram DM about the Vela Denim cropped jacket was classified as a high-intent fit question.",
    impactBadge: "$240 at risk",
    relatedRecord: "Instagram DM - RR-1043",
    owner: "Amara Shah",
    status: "Needs first reply",
    nextAction: "Reply with fit guidance and exchange reassurance.",
    timestamp: "18h ago",
    tone: "rose",
  },
  {
    id: "ACT-3",
    category: "Repeat Revenue",
    title: "Skincare refill window opened",
    description: "Elena Rodriguez entered the 60-day Vitamin C serum refill window from order history.",
    impactBadge: "$118 opportunity",
    relatedRecord: "Shopify order history - RR-1042",
    owner: "Mina Cole",
    status: "Triggered",
    nextAction: "Send serum refill reorder link.",
    timestamp: "3h ago",
    tone: "emerald",
  },
  {
    id: "ACT-4",
    category: "Sync Issues",
    title: "Restock waitlist sync failed",
    description: "Coco Bloom lip oil restock request was captured, but the external buyer tag did not update.",
    impactBadge: "$420 at risk",
    relatedRecord: "Back-in-stock form - RR-1045",
    owner: "Mina Cole",
    status: "Sync issue",
    nextAction: "Fix sync and send restock link manually.",
    timestamp: "5h ago",
    tone: "amber",
  },
  {
    id: "ACT-5",
    category: "Post-Purchase",
    title: "Delivered order review request created",
    description: "Harper Row denim delivery confirmation created a review and second-purchase recovery action.",
    impactBadge: "$180 lifecycle value",
    relatedRecord: "Delivery event - RR-1047",
    owner: "Luis Park",
    status: "Created",
    nextAction: "Send delivery satisfaction and review request.",
    timestamp: "Yesterday",
    tone: "indigo",
  },
  {
    id: "ACT-6",
    category: "Post-Purchase",
    title: "Referral / UGC request scheduled",
    description: "Glow Haus positive review qualified Talia Monroe for creator-style UGC and referral follow-up.",
    impactBadge: "$300 referral value",
    relatedRecord: "Review survey - RR-1048",
    owner: "Luis Park",
    status: "Scheduled",
    nextAction: "Send UGC prompt and referral code.",
    timestamp: "1h ago",
    tone: "emerald",
  },
  {
    id: "ACT-7",
    category: "Payments",
    title: "Payment reminder sent",
    description: "WhatsApp checkout reminder was sent for Priya Nair's Saffron Skin evening routine bundle.",
    impactBadge: "$670 pending",
    relatedRecord: "WhatsApp checkout - RR-1046",
    owner: "Tessa Nguyen",
    status: "Sent",
    nextAction: "Watch payment completion and resend link if needed.",
    timestamp: "30m ago",
    tone: "amber",
  },
  {
    id: "ACT-8",
    category: "Sync Issues",
    title: "Pop-up CSV import missing owners",
    description: "Soho pop-up styling inquiries imported from CSV without assigned recovery owners.",
    impactBadge: "$4,200 unassigned",
    relatedRecord: "Event CSV import - RR-1050",
    status: "Owner missing",
    nextAction: "Assign imported pop-up inquiries.",
    timestamp: "6h ago",
    tone: "rose",
  },
  {
    id: "ACT-9",
    category: "Reports",
    title: "Weekly recovery report generated",
    description: "Owner summary reported recovered revenue, source quality, team load, and automation health.",
    impactBadge: "$42.7K recovered",
    relatedRecord: "Weekly summary - April recovery",
    owner: "Operations",
    status: "Generated",
    nextAction: "Review source quality and team load risks.",
    timestamp: "Today 8:00 AM",
    tone: "cyan",
  },
];

const activitySummary = [
  { label: "Events Today", value: "47", caption: "Captured recovery signals", tone: "cyan" as const },
  { label: "Automation Triggered", value: "31", caption: "External workflow events", tone: "emerald" as const },
  { label: "Sync Issues", value: "4", caption: "Need source cleanup", tone: "amber" as const },
  { label: "Manual Updates", value: "12", caption: "Team recovery notes", tone: "indigo" as const },
  { label: "Action Required", value: "9", caption: "Revenue leaks to clear", tone: "rose" as const },
];

const automationSourceItems = [
  {
    id: "AUTO-1",
    title: "Shopify restock tag sync failed",
    description: "Lip oil restock request captured, but the buyer tag did not update.",
    revenueAtRisk: "$420",
    source: "Back-in-stock form",
    owner: "Mina Cole",
    nextAction: "Review failed Shopify tag and send restock link manually.",
    status: "Needs review",
    tone: "amber" as const,
  },
  {
    id: "AUTO-2",
    title: "Instagram inquiry captured",
    description: "Size/fit DM for the Vela Denim cropped jacket entered recovery follow-up.",
    revenueAtRisk: "$240",
    source: "Instagram DM",
    owner: "Amara Shah",
    nextAction: "Reply with fit guidance and exchange reassurance.",
    status: "Synced",
    tone: "cyan" as const,
  },
  {
    id: "AUTO-3",
    title: "WhatsApp checkout event synced",
    description: "Pending payment event received for the Saffron Skin routine bundle.",
    revenueAtRisk: "$670",
    source: "WhatsApp checkout",
    owner: "Tessa Nguyen",
    nextAction: "Send secure payment reminder and verify link validity.",
    status: "Payment watch",
    tone: "emerald" as const,
  },
  {
    id: "AUTO-4",
    title: "Pop-up CSV import missing owner",
    description: "Soho styling inquiries imported without owner assignment.",
    revenueAtRisk: "$4,200",
    source: "Event CSV import",
    owner: "Unassigned",
    nextAction: "Assign owners before pop-up inquiries go cold.",
    status: "Owner missing",
    tone: "rose" as const,
  },
  {
    id: "AUTO-5",
    title: "Website form created recovery action",
    description: "Bridal collection inquiry created a high-priority follow-up action.",
    revenueAtRisk: "$1,850",
    source: "Website form",
    owner: "Amara Shah",
    nextAction: "Send bridal appointment options with fitting windows.",
    status: "Action created",
    tone: "indigo" as const,
  },
];

const queueTabs = [
  "All",
  "Inquiry Leaks",
  "Follow-up Leaks",
  "Payment Pending",
  "Repeat Revenue",
  "Post-Purchase",
  "Order Risk",
  "Unassigned",
] as const;

type QueueTab = (typeof queueTabs)[number];

const activityFilters = [
  "All",
  "Automation",
  "Team Actions",
  "Sync Issues",
  "Payments",
  "Inquiries",
  "Repeat Revenue",
  "Post-Purchase",
  "Reports",
] as const;

type ActivityFilter = (typeof activityFilters)[number];

const inquiryFilters = [
  "All",
  "High Intent",
  "Medium Intent",
  "Low Intent",
  "Not Replied",
  "Unassigned",
  "Needs Human Review",
] as const;

type InquiryFilter = (typeof inquiryFilters)[number];

const productDemandFilters = [
  "All",
  "Fashion / Apparel",
  "Beauty / Skincare",
  "Restock",
  "Refill",
  "Size / Fit",
  "New Drop",
  "High Value",
] as const;

type ProductDemandFilter = (typeof productDemandFilters)[number];

const productCatalogFilters = [
  "All",
  "Fashion / Apparel",
  "Beauty / Skincare",
  "Restock",
  "Refill",
  "New Drop",
  "High Demand",
  "Missing Tags",
  "Inactive",
] as const;

type ProductCatalogFilter = (typeof productCatalogFilters)[number];

const skuVariantFilters = [
  "All",
  "Missing SKU",
  "Missing Category",
  "Missing Tags",
  "Restock Waiting",
  "Refill Products",
  "Active",
  "Inactive",
] as const;

type SKUVariantFilter = (typeof skuVariantFilters)[number];

const sourceLeakFilters = [
  "All",
  "High Leakage",
  "Missing Owners",
  "First Reply Missing",
  "Payment Pending",
  "Sync Issues",
  "Strong Sources",
] as const;

type SourceLeakFilter = (typeof sourceLeakFilters)[number];

const buyerProfileFilters = [
  "All",
  "VIP",
  "Active",
  "At Risk",
  "Inactive",
  "Refill Ready",
  "Restock Waiting",
  "Post-Purchase",
  "High Intent",
] as const;

type BuyerProfileFilter = (typeof buyerProfileFilters)[number];

const revenueSegmentFilters = [
  "All",
  "VIP",
  "Refill Due",
  "Restock Waiting",
  "Inactive Buyers",
  "Payment Pending",
  "Post-Purchase",
  "High Intent",
  "Event / Pop-up",
  "UGC / Referral",
] as const;

type RevenueSegmentFilter = (typeof revenueSegmentFilters)[number];

const buyerValueFilters = [
  "All",
  "VIP",
  "Growing",
  "At Risk",
  "Inactive High Value",
  "Refill Ready",
  "Restock Waiting",
  "High Return Risk",
  "UGC / Referral Candidate",
] as const;

type BuyerValueFilter = (typeof buyerValueFilters)[number];

const revenuePipelineFilters = [
  "All",
  "New Interest",
  "First Reply Needed",
  "Follow-up Needed",
  "Payment Pending",
  "Repeat Opportunity",
  "At Risk",
  "High Value",
] as const;

type RevenuePipelineFilter = (typeof revenuePipelineFilters)[number];

const followUpRecoveryFilters = [
  "All",
  "Due Today",
  "Overdue",
  "No Reply Yet",
  "High Value",
  "First Reply Needed",
  "Refill / Restock",
  "Post-Purchase",
  "Unassigned",
] as const;

type FollowUpRecoveryFilter = (typeof followUpRecoveryFilters)[number];

const paymentRecoveryFilters = [
  "All",
  "Overdue",
  "Due Today",
  "High Value",
  "WhatsApp Checkout",
  "Shopify / Ecommerce",
  "COD Confirmation",
  "Partial / Failed",
  "Recovered",
] as const;

type PaymentRecoveryFilter = (typeof paymentRecoveryFilters)[number];

const recoveredRevenueFilters = [
  "All",
  "Payments",
  "Follow-ups",
  "Repeat Revenue",
  "Post-Purchase",
  "Reactivation",
  "Source",
  "Owner",
  "This Month",
] as const;

type RecoveredRevenueFilter = (typeof recoveredRevenueFilters)[number];

const orderRiskFilters = [
  "All",
  "Payment Issue",
  "Address Issue",
  "Delivery Delay",
  "Return / Exchange Risk",
  "Complaint",
  "Unassigned",
  "High Value",
  "Needs Ops Review",
] as const;

type OrderRiskFilter = (typeof orderRiskFilters)[number];

const deliveryFollowUpFilters = [
  "All",
  "Delivered",
  "Due Today",
  "Delayed",
  "Satisfaction Check",
  "Issue Follow-up",
  "Second Purchase",
  "Refill / Restock Timing",
  "Unassigned",
] as const;

type DeliveryFollowUpFilter = (typeof deliveryFollowUpFilters)[number];

const postPurchaseFilters = [
  "All",
  "Reviews",
  "Referrals",
  "UGC",
  "High Value",
  "Delivered Recently",
  "VIP Buyers",
  "Beauty / Skincare",
  "Fashion / Apparel",
  "Not Sent",
  "Needs Follow-up",
] as const;

type PostPurchaseFilter = (typeof postPurchaseFilters)[number];

const refillOpportunityFilters = [
  "All",
  "Due Today",
  "Overdue",
  "High Value",
  "Serum / Skincare",
  "Routine Bundle",
  "Reminder Not Sent",
  "Reminder Sent",
  "Recovered",
] as const;

type RefillOpportunityFilter = (typeof refillOpportunityFilters)[number];

const restockWaitlistFilters = [
  "All",
  "Fashion / Apparel",
  "Beauty / Cosmetics",
  "Size Waitlist",
  "Shade Waitlist",
  "New Drop",
  "High Value",
  "Notice Not Sent",
  "Recovered",
] as const;

type RestockWaitlistFilter = (typeof restockWaitlistFilters)[number];

const inactiveBuyerRecoveryFilters = [
  "All",
  "High Value",
  "Missed Refill",
  "Out of Stock",
  "No Reply",
  "Payment Abandoned",
  "Bought Once",
  "VIP Inactive",
  "Event / Pop-up",
] as const;

type InactiveBuyerRecoveryFilter = (typeof inactiveBuyerRecoveryFilters)[number];

const assignedRecoveryActionFilters = [
  "All",
  "My Actions",
  "Overdue",
  "Due Today",
  "High Priority",
  "Unassigned",
  "Payment Recovery",
  "Follow-up Recovery",
  "Refill / Restock",
  "Post-Purchase",
  "Order Risk",
] as const;

type AssignedRecoveryActionFilter = (typeof assignedRecoveryActionFilters)[number];

const recoveryThreadFilters = [
  "All",
  "Payment Recovery",
  "Follow-up Recovery",
  "Order Risk",
  "Refill / Restock",
  "Post-Purchase",
  "Source Issue",
  "Handoff Needed",
  "Unassigned",
  "Updated Today",
] as const;

type RecoveryThreadFilter = (typeof recoveryThreadFilters)[number];

const teamLoadFilters = [
  "All",
  "Sales",
  "Support",
  "Operations",
  "Marketing",
  "Recovery Lead",
  "Overloaded",
  "Overdue",
  "High Revenue Risk",
  "Unassigned Work",
] as const;

type TeamLoadFilter = (typeof teamLoadFilters)[number];

const automationHealthFilters = [
  "All",
  "Successful",
  "Failed",
  "Needs Review",
  "Missing Fields",
  "Duplicate Records",
  "Forms",
  "Ecommerce",
  "WhatsApp",
  "Instagram",
  "CSV Import",
  "Email / SMS",
] as const;

type AutomationHealthFilter = (typeof automationHealthFilters)[number];

const revenueLeakReportFilters = [
  "All",
  "Inquiry Leaks",
  "Follow-up Leaks",
  "Payment Pending",
  "Repeat Revenue",
  "Post-Purchase",
  "Order Risk",
  "Source Leakage",
  "Team Ownership",
  "Product Demand",
] as const;

type RevenueLeakReportFilter = (typeof revenueLeakReportFilters)[number];

const templateFilters = [
  "All",
  "First Reply",
  "Follow-up",
  "Payment Reminder",
  "Refill Reminder",
  "Restock Notice",
  "Delivery Follow-up",
  "Review Request",
  "Referral Request",
  "UGC Request",
  "Winback",
  "Order Issue",
  "Beauty / Skincare",
  "Fashion / Apparel",
] as const;

type TemplateFilter = (typeof templateFilters)[number];

const revenueStages: RevenueStage[] = [
  "New Interest Captured",
  "First Reply Needed",
  "Qualified Interest",
  "Follow-up Needed",
  "Payment Pending",
  "Order Confirmed",
  "Delivered / Post-Purchase",
  "Repeat Opportunity",
  "Lost / Inactive",
];

const pageSubtitles: Record<string, string> = {
  "Recovery Overview":
    "Owner-level visibility into missed revenue, recovery actions, source quality, team workload, and automation-captured events.",
  "Today's Recovery Queue":
    "The team execution screen for overdue leaks, payment nudges, refill prompts, post-purchase asks, and order risks.",
  "Recovery Activity":
    "A live trail of captured recovery events, failed syncs, workflow outcomes, and manual updates.",
  "Inquiry Inbox":
    "New and aging inquiries from website, Instagram, WhatsApp, referrals, campaigns, pop-ups, and imports.",
  "Product Demand":
    "Recoverable demand by product, category, drop, refill window, restock request, and buyer question.",
  "Source Leak Tracking":
    "Source-level visibility into capture volume, first-reply leakage, missing owners, sync issues, and recovered value.",
  "Product Catalog":
    "Products connected to demand, restock interest, refill timing, recovery value, and recovered revenue.",
  "SKU / Variant Sheet":
    "Spreadsheet-style SKU control for product names, variants, categories, pricing, stock status, and recovery tags.",
  "Categories & Tags":
    "Product folders, category mapping, recovery tags, and smart tag suggestions for product-driven workflows.",
  "Import / Export":
    "CSV, XLSX, and JSON-ready product data movement for catalog, SKU, folder, category, and tag cleanup.",
  "Buyer Profiles":
    "Individual buyer lifecycle context for revenue at risk, repeat revenue, preferences, and next best action.",
  "Revenue Segments":
    "Buyer groups organized by follow-up, refill, restock, reactivation, post-purchase, and payment recovery value.",
  "Buyer Value":
    "Buyer value prioritization by LTV, revenue at risk, repeat potential, recovered value, and next best action.",
  "Revenue Pipeline":
    "Open revenue opportunities by recovery stage, owner, value, next action, and revenue at risk.",
  "Follow-up Recovery":
    "Recover buyers who need a first reply, reminder, refill prompt, restock notification, or post-purchase touch.",
  "Payment Recovery":
    "Recover money from buyers who said yes but have not completed payment.",
  "Recovered Revenue":
    "Recovered revenue proof by leak type, source, owner, action, and related recovery case.",
  "Order Risk Monitor":
    "Orders that need attention before they create lost revenue, complaints, returns, or missed follow-up.",
  "Delivery Follow-up":
    "Delivered and recently shipped orders ready for satisfaction checks, issue recovery, and next-purchase timing.",
  "Reviews / Referrals / UGC":
    "Post-purchase review, referral, UGC, and social-proof opportunities before value leaks.",
  "Refill Opportunities":
    "Repeat revenue from beauty, skincare, and cosmetics buyers whose reorder windows are active or approaching.",
  "Restock Waitlist":
    "Restock, shade, size, and new drop demand that needs buyer notification and follow-up.",
  "Inactive Buyer Recovery":
    "Winback actions for buyers who went inactive after refill, restock, payment, order, or follow-up leaks.",
  "Assigned Recovery Actions":
    "Owner-level execution view for assigned recovery action, due status, priority, revenue at risk, and next best action.",
  "Recovery Threads":
    "Case-based internal context attached to buyers, orders, product demand, source issues, and recovery cases.",
  "Team Load":
    "Owner workload, team bottlenecks, unassigned recovery actions, overdue revenue work, and recovered value by owner.",
  "Automation Health":
    "Third-party automation health, sync status, failed records, review needs, and recovery actions created.",
  "Revenue Leak Reports":
    "Revenue leak reporting by leak type, source, product, owner, recovered value, and open recommendations.",
  "Monthly Summary":
    "Client-ready monthly review of recovered revenue, remaining leaks, external workflow monitoring, and next month focus.",
  "Brand Settings":
    "Brand recovery profile, enabled modules, recovery windows, connected sources, and default recovery rules.",
  "Team Users":
    "Recovery ownership setup for users, roles, permissions, default owners, and owner routing.",
  "Tags & Stages":
    "Recovery stages, buyer tags, product tags, source tags, and smart tag suggestions that organize recovery work.",
  "Templates":
    "Approved message templates for first replies, payment reminders, refills, restocks, reviews, UGC, and winback actions.",
};

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <span className="avatar" aria-label={name}>
      <span>{initials}</span>
    </span>
  );
}

function Badge({ children, tone }: { children: ReactNode; tone: Tone }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

function KpiCard({ item, onClick }: { item: KPI; onClick?: () => void }) {
  return (
    <article
      className={`glass-card kpi-card recovery-kpi-card ${item.tone}`}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick || (event.key !== "Enter" && event.key !== " ")) return;
        event.preventDefault();
        onClick();
      }}
      role={onClick ? "button" : undefined}
      style={onClick ? { cursor: "pointer" } : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="kpi-top">
        <span>{item.label}</span>
        <span className={`tiny-dot ${item.tone}`} />
      </div>
      <div className="kpi-main">
        <strong>{item.value}</strong>
      </div>
      <p className={`kpi-caption ${item.tone}`}>{item.caption}</p>
    </article>
  );
}

function matchesQueueTab(task: RecoveryTask, tab: QueueTab) {
  if (tab === "All") return true;
  if (tab === "Inquiry Leaks") return task.leakType === "Inquiry leak";
  if (tab === "Follow-up Leaks") return task.leakType === "Follow-up leak";
  if (tab === "Payment Pending") return task.leakType === "Payment pending leak";
  if (tab === "Repeat Revenue") return task.leakType === "Repeat purchase leak";
  if (tab === "Post-Purchase") return task.category === "Post-Purchase";
  if (tab === "Order Risk") return task.category === "Order Risk";
  return task.assignedOwner === "Unassigned";
}

function getPrimaryRecoveryAction(task: RecoveryTask) {
  if (task.assignedOwner === "Unassigned") return "Assign Owner";
  if (task.category === "Order Risk") return "Mark Resolved";
  if (task.category === "Post-Purchase") return "Mark Sent";
  if (task.leakType === "Payment pending leak" || task.leakType === "Repeat purchase leak") {
    return "Mark Recovered";
  }
  return "Mark Complete";
}

function matchesActivityFilter(activity: RecoveryActivity, filter: ActivityFilter) {
  if (filter === "All") return true;
  if (filter === activity.category) return true;
  if (filter === "Automation") {
    return ["Triggered", "Created", "Action required"].includes(activity.status);
  }
  if (filter === "Team Actions") {
    return ["Sent", "Scheduled", "Generated"].includes(activity.status);
  }
  return false;
}

function moneyToNumber(value: string) {
  return Number(value.replace(/[^0-9.-]/g, "")) || 0;
}

function formatCompactMoney(value: number) {
  if (value >= 1000) return `$${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`;
  return `$${value}`;
}

function getDefaultOwnerForInquiry(inquiry: Inquiry) {
  const product = inquiry.productInterest.toLowerCase();
  if (product.includes("skin") || product.includes("serum") || product.includes("shade")) {
    return "Mina Cole";
  }
  if (product.includes("payment") || product.includes("bundle")) {
    return "Tessa Nguyen";
  }
  if (product.includes("referral") || product.includes("waitlist")) {
    return "Luis Park";
  }
  return "Amara Shah";
}

function getDefaultOwnerForDemand(signal: ProductDemandSignal) {
  if (signal.owner !== "Unassigned") return signal.owner;
  if (signal.industryType === "Beauty / Skincare") return "Mina Cole";
  if (signal.demandType === "Event" || signal.demandType === "Wholesale") return "Amara Shah";
  return "Luis Park";
}

function matchesInquiryFilter(inquiry: Inquiry, filter: InquiryFilter) {
  if (filter === "All") return true;
  if (filter === "High Intent") return inquiry.intentLevel === "High";
  if (filter === "Medium Intent") return inquiry.intentLevel === "Medium";
  if (filter === "Low Intent") return inquiry.intentLevel === "Low";
  if (filter === "Not Replied") return inquiry.firstReplyStatus === "Not replied";
  if (filter === "Unassigned") return inquiry.owner === "Unassigned";
  return inquiry.firstReplyStatus === "Needs human review";
}

function matchesProductDemandFilter(signal: ProductDemandSignal, filter: ProductDemandFilter) {
  if (filter === "All") return true;
  if (filter === "Fashion / Apparel" || filter === "Beauty / Skincare") {
    return signal.industryType === filter;
  }
  if (filter === "High Value") return moneyToNumber(signal.estimatedDemandValue) >= 8000;
  return signal.demandType === filter;
}

function matchesProductCatalogFilter(product: ProductItem, filter: ProductCatalogFilter) {
  if (filter === "All") return true;
  if (filter === "Fashion / Apparel" || filter === "Beauty / Skincare") {
    return product.industryType === filter;
  }
  if (filter === "Restock") {
    return product.stockRestockStatus.toLowerCase().includes("restock") ||
      product.productTags.some((tag) => tag.toLowerCase().includes("restock"));
  }
  if (filter === "Refill") {
    return product.refillCycle !== "Not refill-led" || product.productTags.some((tag) => tag.includes("Refill"));
  }
  if (filter === "New Drop") {
    return product.productTags.some((tag) => tag.includes("New Drop")) ||
      product.productFolder.includes("New");
  }
  if (filter === "High Demand") return product.linkedDemandCount >= 25 || moneyToNumber(product.openRecoveryValue) >= 8000;
  if (filter === "Missing Tags") return product.productTags.length < 2 || !product.category;
  return !product.active;
}

function matchesSKUVariantFilter(row: SKUVariant, filter: SKUVariantFilter) {
  if (filter === "All") return true;
  if (filter === "Missing SKU") return !row.sku;
  if (filter === "Missing Category") return !row.category;
  if (filter === "Missing Tags") return !row.tags;
  if (filter === "Restock Waiting") return row.restockStatus.toLowerCase().includes("restock");
  if (filter === "Refill Products") return row.refillCycle !== "N/A";
  if (filter === "Active") return row.active;
  return !row.active;
}

function matchesSourceLeakFilter(source: SourceLeakRecord, filter: SourceLeakFilter) {
  if (filter === "All") return true;
  if (filter === "High Leakage") {
    return source.firstRepliesMissing + source.overdueFollowUps + source.unassignedRecords >= 12;
  }
  if (filter === "Missing Owners") return source.unassignedRecords > 0;
  if (filter === "First Reply Missing") return source.firstRepliesMissing > 0;
  if (filter === "Payment Pending") return moneyToNumber(source.paymentPendingValue) >= 1000;
  if (filter === "Sync Issues") return source.syncIssues > 0;
  return source.sourceQualityScore >= 80;
}

function matchesBuyerProfileFilter(buyer: BuyerProfileRecord, filter: BuyerProfileFilter) {
  if (filter === "All") return true;
  return buyer.lifecycleStatus === filter || buyer.tags.includes(filter);
}

function matchesRevenueSegmentFilter(segment: RevenueSegmentRecord, filter: RevenueSegmentFilter) {
  if (filter === "All") return true;
  return segment.segmentType === filter;
}

function matchesBuyerValueFilter(record: BuyerValueRecord, filter: BuyerValueFilter) {
  if (filter === "All") return true;
  return record.valueFlags.includes(filter);
}

function matchesRevenuePipelineFilter(opportunity: RevenueOpportunity, filter: RevenuePipelineFilter) {
  if (filter === "All") return true;
  if (filter === "New Interest") return opportunity.currentStage === "New Interest Captured";
  if (filter === "First Reply Needed") return opportunity.currentStage === "First Reply Needed";
  if (filter === "Follow-up Needed") return opportunity.currentStage === "Follow-up Needed";
  if (filter === "Payment Pending") return opportunity.currentStage === "Payment Pending";
  if (filter === "Repeat Opportunity") return opportunity.currentStage === "Repeat Opportunity";
  if (filter === "At Risk") {
    return opportunity.dueStatus === "Overdue" || opportunity.currentStage === "Lost / Inactive";
  }
  return moneyToNumber(opportunity.estimatedValue) >= 800;
}

function matchesFollowUpRecoveryFilter(item: FollowUpRecoveryItem, filter: FollowUpRecoveryFilter) {
  if (filter === "All") return true;
  if (filter === "Due Today") return item.dueStatus === "Due today";
  if (filter === "Overdue") return item.dueStatus === "Overdue";
  if (filter === "No Reply Yet") return item.buyerResponseStatus === "No reply yet";
  if (filter === "High Value") return moneyToNumber(item.revenueAtRisk) >= 500;
  if (filter === "First Reply Needed") return item.followUpType === "First reply";
  if (filter === "Refill / Restock") {
    return item.followUpType === "Refill reminder" || item.followUpType === "Restock notification";
  }
  if (filter === "Post-Purchase") {
    return item.followUpType === "Review request" || item.followUpType === "UGC/referral request";
  }
  return item.owner === "Unassigned";
}

function matchesPaymentRecoveryFilter(item: PaymentRecoveryItem, filter: PaymentRecoveryFilter) {
  if (filter === "All") return true;
  if (filter === "Overdue") return item.dueStatus === "Overdue" || item.paymentStatus === "Overdue";
  if (filter === "Due Today") return item.dueStatus === "Due today";
  if (filter === "High Value") return moneyToNumber(item.paymentAmount) >= 500;
  if (filter === "WhatsApp Checkout") return item.source === "WhatsApp Checkout";
  if (filter === "Shopify / Ecommerce") return item.source === "Shopify / Ecommerce";
  if (filter === "COD Confirmation") return item.paymentStatus === "COD confirmation needed";
  if (filter === "Partial / Failed") {
    return item.paymentStatus === "Partial payment" || item.paymentStatus === "Failed payment";
  }
  return item.paymentStatus === "Recovered";
}

function matchesRecoveredRevenueFilter(item: RecoveredRevenueItem, filter: RecoveredRevenueFilter) {
  if (filter === "All" || filter === "This Month") return true;
  if (filter === "Payments") return item.recoveryType === "Payment recovered";
  if (filter === "Follow-ups") return item.recoveryType === "Follow-up converted";
  if (filter === "Repeat Revenue") {
    return [
      "Repeat purchase recovered",
      "Refill reorder recovered",
      "Restock purchase recovered",
    ].includes(item.recoveryType);
  }
  if (filter === "Post-Purchase") {
    return item.recoveryType === "Post-purchase upsell" || item.recoveryType === "Referral/UGC influenced sale";
  }
  if (filter === "Reactivation") return item.recoveryType === "Reactivated buyer";
  if (filter === "Source") return ["Website Form", "Instagram DM", "WhatsApp Checkout", "Shopify / Ecommerce"].includes(item.source);
  return ["Amara Shah", "Mina Cole", "Tessa Nguyen", "Luis Park"].includes(item.owner);
}

function matchesOrderRiskFilter(item: OrderRiskItem, filter: OrderRiskFilter) {
  if (filter === "All") return true;
  if (filter === "High Value") return moneyToNumber(item.orderValue) >= 500;
  if (filter === "Unassigned") return item.owner === "Unassigned";
  return item.riskType === filter;
}

function matchesDeliveryFollowUpFilter(item: DeliveryFollowUpItem, filter: DeliveryFollowUpFilter) {
  if (filter === "All") return true;
  if (filter === "Delivered") return item.deliveryStatus === "Delivered";
  if (filter === "Due Today") return item.deliveryTiming.toLowerCase().includes("today");
  if (filter === "Delayed") return item.postDeliveryStage === "Delivery delayed";
  if (filter === "Satisfaction Check") return item.postDeliveryStage === "Satisfaction check due";
  if (filter === "Issue Follow-up") return item.postDeliveryStage === "Issue follow-up needed";
  if (filter === "Second Purchase") return item.postDeliveryStage === "Second purchase prompt";
  if (filter === "Refill / Restock Timing") {
    return item.postDeliveryStage === "Refill timing started" || item.postDeliveryStage === "Restock/new drop follow-up";
  }
  return item.owner === "Unassigned";
}

function matchesPostPurchaseFilter(item: PostPurchaseOpportunity, filter: PostPurchaseFilter) {
  if (filter === "All") return true;
  if (filter === "Reviews") return item.opportunityType.includes("Review") || item.opportunityType.includes("feedback");
  if (filter === "Referrals") return item.opportunityType.includes("Referral") || item.opportunityType.includes("referral");
  if (filter === "UGC") return item.opportunityType.includes("UGC") || item.opportunityType.includes("content") || item.opportunityType.includes("photo");
  if (filter === "High Value") return moneyToNumber(item.orderValue) >= 500;
  if (filter === "Delivered Recently") return item.deliveryDate.toLowerCase().includes("today") || item.deliveryDate.includes("1 day") || item.deliveryDate.includes("2 days");
  if (filter === "VIP Buyers") return item.buyerStatus.toLowerCase().includes("vip");
  if (filter === "Beauty / Skincare" || filter === "Fashion / Apparel") return item.industryType === filter;
  if (filter === "Not Sent") return item.requestStatus === "Not sent";
  return item.requestStatus === "Needs follow-up";
}

function matchesRefillOpportunityFilter(item: RefillOpportunity, filter: RefillOpportunityFilter) {
  if (filter === "All") return true;
  if (filter === "Due Today") {
    return item.predictedReorderDate === "Today" || item.refillWindow.toLowerCase().includes("active");
  }
  if (filter === "Overdue") return item.reminderStatus === "Overdue" || item.refillWindow.toLowerCase().includes("overdue");
  if (filter === "High Value") return moneyToNumber(item.estimatedRefillValue) >= 140;
  if (filter === "Serum / Skincare") {
    return item.productCategory.includes("Skincare") ||
      item.productCategory.includes("Serum") ||
      item.productName.toLowerCase().includes("serum");
  }
  if (filter === "Routine Bundle") return item.productCategory === "Routine Bundle" || item.productName.toLowerCase().includes("bundle");
  if (filter === "Reminder Not Sent") return item.reminderStatus === "Not sent" || item.reminderStatus === "Overdue";
  if (filter === "Reminder Sent") return item.reminderStatus === "Sent";
  return item.reminderStatus === "Recovered";
}

function matchesRestockWaitlistFilter(item: RestockWaitlistItem, filter: RestockWaitlistFilter) {
  if (filter === "All") return true;
  if (filter === "Fashion / Apparel" || filter === "Beauty / Cosmetics") return item.industryType === filter;
  if (filter === "Size Waitlist") return item.productCategory.toLowerCase().includes("size");
  if (filter === "Shade Waitlist") {
    return item.productCategory.toLowerCase().includes("shade") ||
      item.sizeShadeColor.toLowerCase().includes("shade");
  }
  if (filter === "New Drop") {
    return item.productCategory === "New Drop" ||
      item.restockStatus.toLowerCase().includes("drop") ||
      item.sourceMix.some((source) => source.toLowerCase().includes("early access"));
  }
  if (filter === "High Value") return moneyToNumber(item.estimatedDemandValue) >= 8000;
  if (filter === "Notice Not Sent") {
    return item.notificationStatus === "Notice not sent" || item.notificationStatus === "Notice due";
  }
  return item.notificationStatus === "Recovered";
}

function matchesInactiveBuyerRecoveryFilter(item: InactiveBuyerRecoveryItem, filter: InactiveBuyerRecoveryFilter) {
  if (filter === "All") return true;
  if (filter === "High Value") return moneyToNumber(item.estimatedRecoveryValue) >= 500;
  if (filter === "Missed Refill") return item.inactiveReason === "Missed refill window";
  if (filter === "Out of Stock") return item.inactiveReason === "Out of stock";
  if (filter === "No Reply") return item.inactiveReason === "No reply / ghosted";
  if (filter === "Payment Abandoned") return item.inactiveReason === "Payment abandoned";
  if (filter === "Bought Once") return item.lastPurchaseDate !== "No purchase yet" && item.recoveryStatus === "Open";
  if (filter === "VIP Inactive") return item.lifecycleStatus.includes("VIP");
  return item.source === "Event / Pop-up";
}

function matchesAssignedRecoveryActionFilter(
  item: AssignedRecoveryAction,
  filter: AssignedRecoveryActionFilter,
) {
  if (filter === "All") return true;
  if (filter === "My Actions") return item.owner === "Amara Shah";
  if (filter === "Overdue") return item.dueStatus === "Overdue";
  if (filter === "Due Today") return item.dueStatus === "Due today";
  if (filter === "High Priority") return item.priority === "Critical" || item.priority === "High";
  if (filter === "Unassigned") return item.owner === "Unassigned";
  if (filter === "Payment Recovery") return item.recoveryType === "Payment reminder";
  if (filter === "Follow-up Recovery") {
    return item.recoveryType === "First reply" || item.recoveryType === "Follow-up nudge";
  }
  if (filter === "Refill / Restock") {
    return item.recoveryType === "Refill reminder" || item.recoveryType === "Restock notice";
  }
  if (filter === "Post-Purchase") {
    return ["Review request", "Referral request", "UGC request"].includes(item.recoveryType);
  }
  return item.recoveryType === "Order issue resolution";
}

function matchesRecoveryThreadFilter(item: RecoveryThread, filter: RecoveryThreadFilter) {
  if (filter === "All") return true;
  if (filter === "Payment Recovery") return item.recoveryType === "Payment recovery thread";
  if (filter === "Follow-up Recovery") return item.recoveryType === "Inquiry thread";
  if (filter === "Order Risk") return item.recoveryType === "Order risk thread";
  if (filter === "Refill / Restock") return item.recoveryType === "Refill/restock thread";
  if (filter === "Post-Purchase") return item.recoveryType === "Post-purchase thread";
  if (filter === "Source Issue") return item.recoveryType === "Source sync issue thread";
  if (filter === "Handoff Needed") return item.threadStatus === "Handoff waiting" || item.handoffNote.toLowerCase().includes("handoff");
  if (filter === "Unassigned") return item.currentOwner === "Unassigned" || item.threadStatus === "Unassigned";
  return item.lastUpdated.toLowerCase().includes("today") || item.threadStatus === "Updated today";
}

function matchesTeamLoadFilter(item: TeamMemberLoad, filter: TeamLoadFilter) {
  if (filter === "All") return true;
  if (filter === "Sales") return item.role === "Sales" || item.memberName === "Amara Shah";
  if (filter === "Support") return item.role === "Support";
  if (filter === "Operations") return item.role === "Operations" || item.role === "Order Recovery";
  if (filter === "Marketing") return item.role === "Marketing" || item.role === "Post-Purchase";
  if (filter === "Recovery Lead") return item.role === "Recovery Lead";
  if (filter === "Overloaded") return item.activeActions >= 14 || item.bottleneckStatus.toLowerCase().includes("overloaded");
  if (filter === "Overdue") return item.overdueActions > 0;
  if (filter === "High Revenue Risk") return moneyToNumber(item.revenueAtRiskOwned) >= 8000;
  return item.role === "Unassigned" || item.memberName === "Unassigned Queue";
}

function matchesAutomationHealthFilter(item: AutomationHealthRecord, filter: AutomationHealthFilter) {
  if (filter === "All") return true;
  if (filter === "Successful") return item.syncStatus === "Healthy";
  if (filter === "Failed") return item.syncStatus === "Failed";
  if (filter === "Needs Review") return item.syncStatus === "Needs Review" || item.syncStatus === "Partial";
  if (filter === "Missing Fields") return item.missingFields > 0;
  if (filter === "Duplicate Records") return item.duplicateRecords > 0;
  if (filter === "Forms") return item.sourceCategory === "Forms";
  if (filter === "Ecommerce") return item.sourceCategory === "Ecommerce";
  if (filter === "WhatsApp") return item.sourceCategory === "WhatsApp";
  if (filter === "Instagram") return item.sourceCategory === "Instagram";
  if (filter === "CSV Import") return item.sourceCategory === "CSV Import";
  return item.sourceCategory === "Email / SMS";
}

function matchesRevenueLeakReportFilter(item: RevenueLeakReportItem, filter: RevenueLeakReportFilter) {
  if (filter === "All") return true;
  if (filter === "Inquiry Leaks") return item.leakType === "Inquiry leak";
  if (filter === "Follow-up Leaks") return item.leakType === "Follow-up leak";
  if (filter === "Payment Pending") return item.leakType === "Payment pending leak";
  if (filter === "Repeat Revenue") {
    return item.leakType === "Repeat purchase leak" ||
      item.leakType === "Refill leak" ||
      item.leakType === "Restock/new drop leak";
  }
  if (filter === "Post-Purchase") return item.leakType === "Post-purchase leak";
  if (filter === "Order Risk") return item.leakType === "Order risk leak";
  if (filter === "Source Leakage") return item.leakType === "Source sync leak";
  if (filter === "Team Ownership") return item.leakType === "Ownership leak";
  return item.leakType === "Restock/new drop leak" || item.leakType === "Refill leak";
}

function matchesTemplateFilter(item: MessageTemplate, filter: TemplateFilter) {
  if (filter === "All") return true;
  if (filter === "Beauty / Skincare" || filter === "Fashion / Apparel") return item.industryFit === filter;
  if (filter === "Follow-up") return item.templateName.toLowerCase().includes("follow-up");
  if (filter === "Winback") return item.recoveryType === "Winback";
  if (filter === "Order Issue") return item.recoveryType === "Order Issue";
  return item.recoveryType === filter;
}

function getNextRevenueStage(stage: RevenueStage) {
  const currentIndex = revenueStages.indexOf(stage);
  if (currentIndex < 0 || currentIndex >= revenueStages.length - 2) return stage;
  return revenueStages[currentIndex + 1];
}

const modalOverlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 100,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 24,
  background: "rgba(17, 17, 17, 0.22)",
};

const modalPanelStyle: CSSProperties = {
  width: "min(720px, 100%)",
  maxHeight: "min(82vh, 860px)",
  overflowY: "auto",
};

const modalWidePanelStyle: CSSProperties = {
  ...modalPanelStyle,
  width: "min(920px, 100%)",
};

const modalGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  gap: 10,
};

const modalStackStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

function ModalShell({
  children,
  footer,
  onClose,
  title,
  wide = false,
}: {
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  title: string;
  wide?: boolean;
}) {
  return (
    <div style={modalOverlayStyle} role="presentation">
      <article
        aria-modal="true"
        className="glass-card panel-card"
        role="dialog"
        style={wide ? modalWidePanelStyle : modalPanelStyle}
      >
        <div className="panel-header">
          <div>
            <h2>{title}</h2>
          </div>
          <button className="secondary-btn" onClick={onClose} type="button">
            Close
          </button>
        </div>
        <div style={modalStackStyle}>{children}</div>
        {footer ? (
          <div className="capture-actions" style={{ marginTop: 18 }}>
            {footer}
          </div>
        ) : null}
      </article>
    </div>
  );
}

function DetailField({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="detail-callout">
      <span>{label}</span>
      <strong>{value ?? "Not assigned"}</strong>
    </div>
  );
}

type OverviewSourceEvent = (typeof automationSourceItems)[number];
type OverviewModalType = "task" | "team" | "source" | "activity" | "revenue" | null;

type RecoveryOverviewProps = {
  activities: RecoveryActivity[];
  onActivity: (activity: NewRecoveryActivity) => void;
  onNavigate: (pageName: string) => void;
};

function RecoveryOverview({ activities, onActivity, onNavigate }: RecoveryOverviewProps) {
  const [selectedTask, setSelectedTask] = useState<RecoveryTask | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamUser | null>(null);
  const [selectedSourceEvent, setSelectedSourceEvent] = useState<OverviewSourceEvent | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<RecoveryActivity | null>(null);
  const [activeModal, setActiveModal] = useState<OverviewModalType>(null);
  const [toastMessage, setToastMessage] = useState("");

  const overviewLeakIds = [
    "RR-1041",
    "RR-1043",
    "RR-1042",
    "RR-1045",
    "RR-1044",
    "RR-1049",
    "RR-1047",
    "RR-1048",
  ];
  const overviewLeaks = overviewLeakIds
    .map((id) => recoveryTasks.find((task) => task.id === id))
    .filter((task): task is RecoveryTask => Boolean(task));
  const issueCount = automationSourceItems.filter((item) =>
    ["Needs review", "Owner missing", "Payment watch"].includes(item.status),
  ).length;

  function closeModal() {
    setActiveModal(null);
  }

  async function copyText(text: string, successMessage = "Copied to clipboard") {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage(successMessage);
    } catch {
      setToastMessage("Copy failed. Please copy manually.");
    }
  }

  function addOverviewActivity(activity: NewRecoveryActivity, message: string) {
    onActivity(activity);
    setToastMessage(message);
  }

  function openTask(task: RecoveryTask) {
    setSelectedTask(task);
    setActiveModal("task");
  }

  function openTeamMember(member: TeamUser) {
    setSelectedTeamMember(member);
    setActiveModal("team");
  }

  function openSourceEvent(item: OverviewSourceEvent) {
    setSelectedSourceEvent(item);
    setActiveModal("source");
  }

  function openActivity(activity: RecoveryActivity) {
    setSelectedActivity(activity);
    setActiveModal("activity");
  }

  function handleKpiClick(label: string) {
    if (label === "Revenue at Risk") {
      setActiveModal("revenue");
      return;
    }
    if (label === "Recovered This Month") onNavigate("Recovered Revenue");
    if (label === "Pending Payment Value") onNavigate("Payment Recovery");
    if (label === "Overdue Recovery Actions") onNavigate("Today's Recovery Queue");
    if (label === "Refill / Restock Opportunities") onNavigate("Refill Opportunities");
    if (label === "Automation Sync Issues") onNavigate("Automation Health");
    if (label === "Open Recovery Tasks") onNavigate("Assigned Recovery Actions");
  }

  function createTaskActivity(task: RecoveryTask, title: string, status: string) {
    addOverviewActivity(
      {
        category: "Team Actions",
        title,
        description: `Reviewed ${task.customer}'s ${task.productInterest}.`,
        impactBadge: task.estimatedRevenueAtRisk,
        relatedRecord: task.id,
        owner: task.assignedOwner,
        status,
        nextAction: task.recommendedNextAction,
        tone: task.tone,
      },
      status === "Created" ? "Follow-up recovery action created" : "Recovery action reviewed",
    );
  }

  function getSourceRelatedRecord(item: OverviewSourceEvent) {
    return `${item.source} - ${item.id}`;
  }

  function createSourceActivity(item: OverviewSourceEvent, title: string, status: string) {
    addOverviewActivity(
      {
        category: "Sync Issues",
        title,
        description: `${item.title}: ${item.description}`,
        impactBadge: item.revenueAtRisk,
        relatedRecord: getSourceRelatedRecord(item),
        owner: item.owner,
        status,
        nextAction: item.nextAction,
        tone: item.tone,
      },
      status === "Created" ? "Source fix task created" : "Source event reviewed",
    );
  }

  const activityTargets: Record<RecoveryActivity["category"], string> = {
    Automation: "Automation Health",
    "Team Actions": "Assigned Recovery Actions",
    "Sync Issues": "Automation Health",
    Payments: "Payment Recovery",
    Inquiries: "Inquiry Inbox",
    "Repeat Revenue": "Refill Opportunities",
    "Post-Purchase": "Reviews / Referrals / UGC",
    Reports: "Revenue Leak Reports",
  };

  return (
    <div className="recovery-page">
      {toastMessage ? (
        <div className="glass-card panel-card" role="status">
          <p>{toastMessage}</p>
        </div>
      ) : null}

      <section className="recovery-kpi-grid">
        {kpis.map((item) => (
          <KpiCard key={item.label} item={item} onClick={() => handleKpiClick(item.label)} />
        ))}
      </section>

      <section className="two-column-grid recovery-overview-grid">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Highest Risk Leaks</h2>
              <p>Buyer moments where a specific recovery action can protect revenue today.</p>
            </div>
            <Badge tone="rose">{overviewLeaks.length} active leaks</Badge>
          </div>

          <div className="recovery-list">
            {overviewLeaks.map((task) => (
              <div
                className="recovery-row leak-action-row"
                key={task.id}
                onClick={() => openTask(task)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  openTask(task);
                }}
                role="button"
                style={{ cursor: "pointer" }}
                tabIndex={0}
              >
                <div className="recovery-row-main">
                  <Avatar name={task.customer} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{task.customer}</h3>
                      <Badge tone={task.tone}>{task.priority}</Badge>
                    </div>
                    <p>{task.brandContext} - {task.productInterest}</p>
                    <div className="recovery-meta">
                      <span>{task.leakType}</span>
                      <span>{task.source}</span>
                      <span>{task.assignedOwner}</span>
                      <span>{task.dueStatus}</span>
                    </div>
                    <small>{task.recommendedNextAction}</small>
                  </div>
                </div>
                <strong>{task.estimatedRevenueAtRisk}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Team Recovery Load</h2>
              <p>Owners with active recovery queues, overdue leakage, and recovered value.</p>
            </div>
            <Badge tone="cyan">Live workload</Badge>
          </div>

          <div className="team-load-grid">
            {teamUsers.map((member) => (
              <div
                className="team-load-card"
                key={member.id}
                onClick={() => openTeamMember(member)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  openTeamMember(member);
                }}
                role="button"
                style={{ cursor: "pointer" }}
                tabIndex={0}
              >
                <div>
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
                <div className="team-load-stats">
                  <Badge tone={member.tone}>{member.revenueAtRisk} at risk</Badge>
                  <span>{member.activeTasks} active</span>
                  <span>{member.overdueTasks} overdue</span>
                  <span>{member.recoveredThisMonth} recovered</span>
                </div>
                <div className="team-load-detail">
                  <span>{member.sourceFocus}</span>
                  <p>{member.nextAction}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="two-column-grid recovery-overview-grid">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Automation & Source Visibility</h2>
              <p>External workflow events, failed syncs, and captured source signals.</p>
            </div>
            <Badge tone="amber">{issueCount} need review</Badge>
          </div>

          <div className="recovery-list">
            {automationSourceItems.map((item) => (
              <div
                className="source-health-row"
                key={item.id}
                onClick={() => openSourceEvent(item)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  openSourceEvent(item);
                }}
                role="button"
                style={{ cursor: "pointer" }}
                tabIndex={0}
              >
                <span className={`tiny-dot ${item.tone}`} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="recovery-meta">
                    <span>{item.revenueAtRisk}</span>
                    <span>{item.source}</span>
                    <span>{item.owner}</span>
                  </div>
                  <p className="source-next-action">{item.nextAction}</p>
                  <small>{item.status}</small>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Recovery Activity</h2>
              <p>Recent captured events and reporting outcomes.</p>
            </div>
            <Badge tone="emerald">Updated now</Badge>
          </div>

          <div className="recovery-activity-list">
            {activities.map((activity) => (
              <div
                className="activity-row"
                key={activity.id}
                onClick={() => openActivity(activity)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  openActivity(activity);
                }}
                role="button"
                style={{ cursor: "pointer" }}
                tabIndex={0}
              >
                <span className={`activity-node ${activity.tone}`} />
                <div>
                  <div className="activity-row-top">
                    <h3>{activity.title}</h3>
                    <span>{activity.timestamp}</span>
                  </div>
                  <p>{activity.description}</p>
                  <div className="recovery-meta">
                    <span>{activity.impactBadge}</span>
                    <span>{activity.relatedRecord}</span>
                    <span>{activity.owner ?? "External automation"}</span>
                  </div>
                  <p className="queue-next-action">{activity.nextAction}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {activeModal === "revenue" ? (
        <ModalShell
          footer={
            <>
              <button className="primary-btn" onClick={() => onNavigate("Today's Recovery Queue")} type="button">
                Open Recovery Queue
              </button>
              <button className="secondary-btn" onClick={closeModal} type="button">
                Close
              </button>
            </>
          }
          onClose={closeModal}
          title="Revenue at Risk Breakdown"
          wide
        >
          <div className="capture-card-list">
            {overviewLeaks.slice(0, 5).map((task) => (
              <article className={`product-card ${task.tone}`} key={`risk-${task.id}`}>
                <div className="recovery-row-title">
                  <h3>{task.customer}</h3>
                  <Badge tone={task.tone}>{task.estimatedRevenueAtRisk}</Badge>
                </div>
                <p>{task.productInterest}</p>
                <div className="recovery-meta">
                  <span>{task.leakType}</span>
                  <span>{task.assignedOwner}</span>
                  <span>{task.dueStatus}</span>
                </div>
              </article>
            ))}
          </div>
        </ModalShell>
      ) : null}

      {activeModal === "task" && selectedTask ? (
        <ModalShell
          footer={
            <>
              <button
                className="primary-btn"
                onClick={() => {
                  void copyText(selectedTask.messageTemplate, "Template copied");
                  onActivity({
                    category: "Team Actions",
                    title: "Recovery template copied",
                    description: `Copied recovery message template for ${selectedTask.customer}.`,
                    impactBadge: selectedTask.estimatedRevenueAtRisk,
                    relatedRecord: selectedTask.id,
                    owner: selectedTask.assignedOwner,
                    status: "Copied",
                    nextAction: selectedTask.recommendedNextAction,
                    tone: selectedTask.tone,
                  });
                }}
                type="button"
              >
                Copy Template
              </button>
              <button className="secondary-btn" onClick={() => onNavigate("Today's Recovery Queue")} type="button">
                Open Recovery Queue
              </button>
              <button
                className="secondary-btn"
                onClick={() => {
                  onNavigate("Follow-up Recovery");
                  createTaskActivity(selectedTask, "Follow-up recovery action created", "Created");
                }}
                type="button"
              >
                Create Follow-up
              </button>
              <button
                className="secondary-btn"
                onClick={() => createTaskActivity(selectedTask, "Recovery leak reviewed", "Reviewed")}
                type="button"
              >
                Mark Reviewed
              </button>
            </>
          }
          onClose={closeModal}
          title={selectedTask.customer}
          wide
        >
          <div style={modalGridStyle}>
            <DetailField label="Brand context" value={selectedTask.brandContext} />
            <DetailField label="Product interest" value={selectedTask.productInterest} />
            <DetailField label="Revenue at risk" value={selectedTask.estimatedRevenueAtRisk} />
            <DetailField label="Leak type" value={selectedTask.leakType} />
            <DetailField label="Category" value={selectedTask.category} />
            <DetailField label="Source" value={selectedTask.source} />
            <DetailField label="Assigned owner" value={selectedTask.assignedOwner} />
            <DetailField label="Due status" value={selectedTask.dueStatus} />
            <DetailField label="Priority" value={selectedTask.priority} />
            <DetailField label="Automation status" value={selectedTask.automationStatus} />
            <DetailField label="Source status" value={selectedTask.sourceStatus} />
            <DetailField label="Last event" value={selectedTask.lastEvent} />
            <DetailField label="Last contact" value={selectedTask.lastContact} />
            <DetailField label="Attempt count" value={selectedTask.attemptCount} />
          </div>
          <div className="detail-callout">
            <span>Recommended next action</span>
            <p>{selectedTask.recommendedNextAction}</p>
          </div>
          <div className="template-box">
            <span>Message template</span>
            <p>{selectedTask.messageTemplate}</p>
          </div>
          <div className="thread-panel">
            <div className="thread-header">
              <h3>Internal Recovery Thread</h3>
              <span>{selectedTask.internalRecoveryThread.length} updates</span>
            </div>
            {selectedTask.internalRecoveryThread.map((message) => (
              <div className="thread-message" key={message.id}>
                <div>
                  <strong>{message.author}</strong>
                  <span>{message.role} - {message.time}</span>
                </div>
                <p>{message.message}</p>
                {message.outcome ? <small>{message.outcome}</small> : null}
              </div>
            ))}
          </div>
        </ModalShell>
      ) : null}

      {activeModal === "team" && selectedTeamMember ? (
        <ModalShell
          footer={
            <>
              <button className="primary-btn" onClick={() => onNavigate("Team Load")} type="button">
                Open Team Load
              </button>
              <button className="secondary-btn" onClick={() => onNavigate("Assigned Recovery Actions")} type="button">
                Open Assigned Actions
              </button>
              <button
                className="secondary-btn"
                onClick={() =>
                  addOverviewActivity(
                    {
                      category: "Team Actions",
                      title: "Team workload reviewed",
                      description: `Reviewed ${selectedTeamMember.name}'s recovery workload.`,
                      impactBadge: selectedTeamMember.revenueAtRisk,
                      relatedRecord: selectedTeamMember.id,
                      owner: selectedTeamMember.name,
                      status: "Reviewed",
                      nextAction: selectedTeamMember.nextAction,
                      tone: selectedTeamMember.tone,
                    },
                    "Team workload reviewed",
                  )
                }
                type="button"
              >
                Mark Workload Reviewed
              </button>
            </>
          }
          onClose={closeModal}
          title={selectedTeamMember.name}
        >
          <div style={modalGridStyle}>
            <DetailField label="Role" value={selectedTeamMember.role} />
            <DetailField label="Active tasks" value={selectedTeamMember.activeTasks} />
            <DetailField label="Overdue tasks" value={selectedTeamMember.overdueTasks} />
            <DetailField label="Revenue at risk" value={selectedTeamMember.revenueAtRisk} />
            <DetailField label="Recovered this month" value={selectedTeamMember.recoveredThisMonth} />
            <DetailField label="Source focus" value={selectedTeamMember.sourceFocus} />
          </div>
          <div className="detail-callout">
            <span>Next action</span>
            <p>{selectedTeamMember.nextAction}</p>
          </div>
        </ModalShell>
      ) : null}

      {activeModal === "source" && selectedSourceEvent ? (
        <ModalShell
          footer={
            <>
              <button className="primary-btn" onClick={() => onNavigate("Automation Health")} type="button">
                Open Automation Health
              </button>
              <button
                className="secondary-btn"
                onClick={() => createSourceActivity(selectedSourceEvent, "Source fix task created", "Created")}
                type="button"
              >
                Create Source Fix Task
              </button>
              <button
                className="secondary-btn"
                onClick={() => createSourceActivity(selectedSourceEvent, "Source event reviewed", "Reviewed")}
                type="button"
              >
                Mark Reviewed
              </button>
            </>
          }
          onClose={closeModal}
          title={selectedSourceEvent.title}
        >
          <p>{selectedSourceEvent.description}</p>
          <div style={modalGridStyle}>
            <DetailField label="Related record" value={getSourceRelatedRecord(selectedSourceEvent)} />
            <DetailField label="Status" value={selectedSourceEvent.status} />
            <DetailField label="Owner" value={selectedSourceEvent.owner} />
            <DetailField label="Revenue at risk" value={selectedSourceEvent.revenueAtRisk} />
            <DetailField label="Source" value={selectedSourceEvent.source} />
            <DetailField label="Tone" value={selectedSourceEvent.tone} />
          </div>
          <div className="detail-callout">
            <span>Next action</span>
            <p>{selectedSourceEvent.nextAction}</p>
          </div>
        </ModalShell>
      ) : null}

      {activeModal === "activity" && selectedActivity ? (
        <ModalShell
          footer={
            <>
              <button
                className="primary-btn"
                onClick={() => onNavigate(activityTargets[selectedActivity.category])}
                type="button"
              >
                Open Related Area
              </button>
              <button
                className="secondary-btn"
                onClick={() =>
                  addOverviewActivity(
                    {
                      category: selectedActivity.category,
                      title: "Activity reviewed",
                      description: `Reviewed activity: ${selectedActivity.title}.`,
                      impactBadge: selectedActivity.impactBadge,
                      relatedRecord: selectedActivity.relatedRecord,
                      owner: selectedActivity.owner,
                      status: "Reviewed",
                      nextAction: selectedActivity.nextAction,
                      tone: selectedActivity.tone,
                    },
                    "Activity reviewed",
                  )
                }
                type="button"
              >
                Mark Reviewed
              </button>
            </>
          }
          onClose={closeModal}
          title={selectedActivity.title}
        >
          <p>{selectedActivity.description}</p>
          <div style={modalGridStyle}>
            <DetailField label="Category" value={selectedActivity.category} />
            <DetailField label="Impact" value={selectedActivity.impactBadge} />
            <DetailField label="Related record" value={selectedActivity.relatedRecord} />
            <DetailField label="Owner" value={selectedActivity.owner ?? "External automation"} />
            <DetailField label="Status" value={selectedActivity.status} />
            <DetailField label="Timestamp" value={selectedActivity.timestamp} />
          </div>
          <div className="detail-callout">
            <span>Next action</span>
            <p>{selectedActivity.nextAction}</p>
          </div>
        </ModalShell>
      ) : null}
    </div>
  );
}

function TodaysRecoveryQueue() {
  const [activeTab, setActiveTab] = useState<QueueTab>("All");
  const [selectedTaskId, setSelectedTaskId] = useState(recoveryTasks[0].id);
  const [detailNotice, setDetailNotice] = useState("Ready for recovery action.");

  const filteredTasks = useMemo(() => {
    return recoveryTasks.filter((task) => matchesQueueTab(task, activeTab));
  }, [activeTab]);

  const selectedTask =
    filteredTasks.find((task) => task.id === selectedTaskId) ?? filteredTasks[0] ?? recoveryTasks[0];
  const primaryActionLabel = getPrimaryRecoveryAction(selectedTask);

  function handleTaskAction(action: string) {
    setDetailNotice(`${action} noted for ${selectedTask.customer}.`);
  }

  return (
    <div className="recovery-page">
      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Recovery queue filters">
          {queueTabs.map((tab) => (
            <button
              className={`queue-tab ${activeTab === tab ? "active" : ""}`}
              key={tab}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredTasks.length} recovery actions</Badge>
      </section>

      <section className="recovery-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Recovery Queue</h2>
              <p>Prioritized buyer actions with revenue at risk, ownership, last recovery touch, and next-best message.</p>
            </div>
            <Badge tone="rose">Actionable today</Badge>
          </div>

          <div className="recovery-list">
            {filteredTasks.map((task) => (
              <button
                className={`recovery-task-card ${task.tone} ${
                  selectedTask.id === task.id ? "selected" : ""
                }`}
                key={task.id}
                onClick={() => {
                  setSelectedTaskId(task.id);
                  setDetailNotice("Ready for recovery action.");
                }}
                type="button"
              >
                <div className="recovery-task-main">
                  <Avatar name={task.customer} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{task.customer}</h3>
                      <Badge tone={task.tone}>{task.priority}</Badge>
                    </div>
                    <p>{task.brandContext} - {task.productInterest}</p>
                    <div className="recovery-meta">
                      <span>{task.leakType}</span>
                      <span>{task.source}</span>
                      <span>{task.assignedOwner}</span>
                      <span>{task.dueStatus}</span>
                      <span>{task.lastContact}</span>
                      <span>{task.attemptCount} attempts</span>
                    </div>
                    <small className="queue-next-action">{task.recommendedNextAction}</small>
                  </div>
                </div>
                <div className="task-money">
                  <strong>{task.estimatedRevenueAtRisk}</strong>
                  <span>{task.priority}</span>
                </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedTask.customer} />
              <div>
                <h2>{selectedTask.customer}</h2>
                <p>{selectedTask.brandContext} - {selectedTask.productInterest}</p>
              </div>
            </div>
            <strong>{selectedTask.estimatedRevenueAtRisk}</strong>
          </div>

          <div className="customer-summary-box">
            <span>Buyer recovery summary</span>
            <p>
              {selectedTask.leakType} from {selectedTask.source}. Last contact:{" "}
              {selectedTask.lastContact}; {selectedTask.attemptCount} recovery attempts logged.
            </p>
          </div>

          <div className="detail-grid">
            <div>
              <span>Leak type</span>
              <strong>{selectedTask.leakType}</strong>
            </div>
            <div>
              <span>Source</span>
              <strong>{selectedTask.source}</strong>
            </div>
            <div>
              <span>Owner</span>
              <strong>{selectedTask.assignedOwner}</strong>
            </div>
            <div>
              <span>Due status</span>
              <strong>{selectedTask.dueStatus}</strong>
            </div>
            <div>
              <span>Priority</span>
              <strong>{selectedTask.priority}</strong>
            </div>
            <div>
              <span>Revenue at risk</span>
              <strong>{selectedTask.estimatedRevenueAtRisk}</strong>
            </div>
          </div>

          <div className="detail-callout">
            <span>Recommended next action</span>
            <p>{selectedTask.recommendedNextAction}</p>
          </div>

          <div className="template-box">
            <div>
              <span>Message template</span>
              <button type="button" onClick={() => handleTaskAction("Template copied")}>
                Copy Template
              </button>
            </div>
            <p>{selectedTask.messageTemplate}</p>
          </div>

          <div className="detail-grid">
            <div>
              <span>Automation status</span>
              <strong>{selectedTask.automationStatus}</strong>
            </div>
            <div>
              <span>Source status</span>
              <strong>{selectedTask.sourceStatus}</strong>
            </div>
          </div>

          <div className="thread-panel">
            <div className="thread-header">
              <h3>Internal Recovery Thread</h3>
              <span>{selectedTask.lastEvent}</span>
            </div>
            {selectedTask.internalRecoveryThread.map((message) => (
              <div className="thread-message" key={message.id}>
                <div>
                  <strong>{message.author}</strong>
                  <span>{message.role}</span>
                </div>
                <p>{message.message}</p>
                <small>{message.time}</small>
              </div>
            ))}
          </div>

          <p className="detail-notice">{detailNotice}</p>

          <div className="detail-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => handleTaskAction(primaryActionLabel)}
            >
              {primaryActionLabel}
            </button>
            <button type="button" className="secondary-btn" onClick={() => handleTaskAction("Snoozed")}>
              Snooze
            </button>
            <button type="button" className="secondary-btn" onClick={() => handleTaskAction("Reassign requested")}>
              Reassign
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function InquiryInbox({ onActivity }: { onActivity: (activity: NewRecoveryActivity) => void }) {
  const [inquiryRecords, setInquiryRecords] = useState<Inquiry[]>(inquiries);
  const [activeInquiryFilter, setActiveInquiryFilter] = useState<InquiryFilter>("All");
  const [selectedInquiryId, setSelectedInquiryId] = useState(inquiries[0].id);
  const [detailNotice, setDetailNotice] = useState("Ready to triage captured buyer interest.");

  const filteredInquiries = inquiryRecords.filter((inquiry) =>
    matchesInquiryFilter(inquiry, activeInquiryFilter),
  );
  const selectedInquiry =
    inquiryRecords.find((inquiry) => inquiry.id === selectedInquiryId) ??
    filteredInquiries[0] ??
    inquiryRecords[0];

  function recordInquiryActivity(
    inquiry: Inquiry,
    title: string,
    status: string,
    nextAction = inquiry.recommendedAction,
    owner = inquiry.owner,
  ) {
    onActivity({
      category: "Inquiries",
      title,
      description: `${inquiry.customer}'s ${inquiry.productInterest.toLowerCase()} was updated from ${inquiry.inquirySource}.`,
      impactBadge: `${inquiry.estimatedValue} at risk`,
      relatedRecord: `${inquiry.inquirySource} - ${inquiry.id}`,
      owner: owner === "Unassigned" ? undefined : owner,
      status,
      nextAction,
      tone: inquiry.tone,
    });
  }

  function handleInquiryAction(action: "assign" | "reply" | "case" | "copy" | "note") {
    const inquiry = selectedInquiry;

    if (action === "assign") {
      const owner = inquiry.owner === "Unassigned" ? getDefaultOwnerForInquiry(inquiry) : inquiry.owner;

      setInquiryRecords((records) =>
        records.map((record) =>
          record.id === inquiry.id
            ? {
                ...record,
                owner,
                sourceStatus: record.sourceStatus === "Owner missing" ? "Owner assigned" : record.sourceStatus,
                lastAction: `Assigned to ${owner}`,
              }
            : record,
        ),
      );
      setDetailNotice(`${inquiry.customer} assigned to ${owner}.`);
      recordInquiryActivity(inquiry, "Inquiry owner assigned", "Owner assigned", inquiry.recommendedAction, owner);
      return;
    }

    if (action === "reply") {
      setInquiryRecords((records) =>
        records.map((record) =>
          record.id === inquiry.id
            ? {
                ...record,
                firstReplyStatus: "Replied",
                lastAction: "First reply marked sent",
              }
            : record,
        ),
      );
      setDetailNotice(`First reply marked sent for ${inquiry.customer}.`);
      recordInquiryActivity(inquiry, "First reply sent", "Sent", "Watch for response and conversion signal.");
      return;
    }

    if (action === "case") {
      setInquiryRecords((records) =>
        records.map((record) =>
          record.id === inquiry.id
            ? {
                ...record,
                recoveryCaseCreated: true,
                lastAction: "Recovery case created",
              }
            : record,
        ),
      );
      setDetailNotice(`Recovery case created for ${inquiry.customer}.`);
      recordInquiryActivity(inquiry, "Recovery case created from inquiry", "Created");
      return;
    }

    if (action === "copy") {
      setInquiryRecords((records) =>
        records.map((record) =>
          record.id === inquiry.id
            ? {
                ...record,
                templateCopied: true,
                lastAction: "Template copied",
              }
            : record,
        ),
      );
      setDetailNotice(`Template copied for ${inquiry.customer}.`);
      recordInquiryActivity(inquiry, "Inquiry template copied", "Template copied");
      return;
    }

    setInquiryRecords((records) =>
      records.map((record) =>
        record.id === inquiry.id
          ? {
              ...record,
              internalNotes: record.internalNotes + 1,
              lastAction: "Internal note added",
            }
          : record,
      ),
    );
    setDetailNotice(`Internal note added for ${inquiry.customer}.`);
    recordInquiryActivity(inquiry, "Internal inquiry note added", "Team note");
  }

  return (
    <div className="recovery-page">
      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Inquiry intent filters">
          {inquiryFilters.map((filter) => (
            <button
              className={`queue-tab ${activeInquiryFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveInquiryFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredInquiries.length} inquiries</Badge>
      </section>

      <section className="recovery-workspace capture-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Inquiry Inbox</h2>
              <p>Captured buyer interest that needs a reply, owner, recovery action, or human review.</p>
            </div>
            <Badge tone="amber">First reply watch</Badge>
          </div>

          <div className="inquiry-list">
            {filteredInquiries.map((inquiry) => (
              <button
                className={`inquiry-card inquiry-button ${inquiry.tone} ${
                  selectedInquiry.id === inquiry.id ? "selected" : ""
                }`}
                key={inquiry.id}
                onClick={() => {
                  setSelectedInquiryId(inquiry.id);
                  setDetailNotice("Ready to triage captured buyer interest.");
                }}
                type="button"
              >
              <div className="inquiry-main">
                <Avatar name={inquiry.customer} />
                <div>
                  <div className="recovery-row-title">
                    <h3>{inquiry.customer}</h3>
                    <Badge tone={inquiry.tone}>{inquiry.intentLevel} intent</Badge>
                  </div>
                  <p>{inquiry.productInterest}</p>
                  <div className="recovery-meta">
                    <span>{inquiry.inquirySource}</span>
                    <span>{inquiry.timeSinceInquiry} ago</span>
                    <span>{inquiry.firstReplyStatus}</span>
                    <span>{inquiry.sourceStatus}</span>
                  </div>
                </div>
              </div>

              <div className="inquiry-value">
                <strong>{inquiry.estimatedValue}</strong>
                <span>{inquiry.owner}</span>
              </div>

              <div className="inquiry-action">
                <span>Recommended action</span>
                <p>{inquiry.recommendedAction}</p>
                <small>{inquiry.automationStatus}</small>
              </div>

              <div className="inquiry-template">
                <span>Template preview</span>
                <p>{inquiry.templatePreview}</p>
                <small>{inquiry.lastAction ?? `${inquiry.internalNotes} internal notes`}</small>
              </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedInquiry.customer} />
              <div>
                <h2>{selectedInquiry.customer}</h2>
                <p>{selectedInquiry.productInterest}</p>
              </div>
            </div>
            <strong>{selectedInquiry.estimatedValue}</strong>
          </div>

          <div className="customer-summary-box">
            <span>Capture summary</span>
            <p>
              {selectedInquiry.intentLevel} intent from {selectedInquiry.inquirySource}. First reply:{" "}
              {selectedInquiry.firstReplyStatus}; owner: {selectedInquiry.owner}.
            </p>
          </div>

          <div className="detail-grid">
            <div>
              <span>Source</span>
              <strong>{selectedInquiry.inquirySource}</strong>
            </div>
            <div>
              <span>Time since inquiry</span>
              <strong>{selectedInquiry.timeSinceInquiry}</strong>
            </div>
            <div>
              <span>First reply</span>
              <strong>{selectedInquiry.firstReplyStatus}</strong>
            </div>
            <div>
              <span>Owner</span>
              <strong>{selectedInquiry.owner}</strong>
            </div>
            <div>
              <span>Capture status</span>
              <strong>{selectedInquiry.sourceStatus}</strong>
            </div>
            <div>
              <span>Recovery case</span>
              <strong>{selectedInquiry.recoveryCaseCreated ? "Created" : "Not created"}</strong>
            </div>
          </div>

          <div className="detail-callout">
            <span>Recommended next action</span>
            <p>{selectedInquiry.recommendedAction}</p>
          </div>

          <div className="template-box">
            <div>
              <span>Message template preview</span>
              <button type="button" onClick={() => handleInquiryAction("copy")}>
                Copy Template
              </button>
            </div>
            <p>{selectedInquiry.templatePreview}</p>
          </div>

          <div className="thread-panel">
            <div className="thread-header">
              <h3>Automation & Source Capture</h3>
              <span>{selectedInquiry.lastAction ?? "No manual update yet"}</span>
            </div>
            <div className="capture-status-line">
              <span>{selectedInquiry.automationStatus}</span>
              <small>{selectedInquiry.internalNotes} internal notes logged</small>
            </div>
          </div>

          <p className="detail-notice">{detailNotice}</p>

          <div className="detail-actions">
            <button type="button" className="primary-btn" onClick={() => handleInquiryAction("assign")}>
              Assign owner
            </button>
            <button type="button" className="secondary-btn" onClick={() => handleInquiryAction("reply")}>
              Mark first reply sent
            </button>
            <button type="button" className="secondary-btn" onClick={() => handleInquiryAction("case")}>
              Create recovery case
            </button>
            <button type="button" className="secondary-btn" onClick={() => handleInquiryAction("note")}>
              Add internal note
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function ProductDemand({ onActivity }: { onActivity: (activity: NewRecoveryActivity) => void }) {
  const [demandSignals, setDemandSignals] = useState<ProductDemandSignal[]>(productDemandSignals);
  const [activeDemandFilter, setActiveDemandFilter] = useState<ProductDemandFilter>("All");
  const [notice, setNotice] = useState("Demand signals are ready for recovery review.");

  const filteredDemand = demandSignals.filter((signal) =>
    matchesProductDemandFilter(signal, activeDemandFilter),
  );

  const demandKpis = useMemo<KPI[]>(() => {
    const demandValue = demandSignals.reduce(
      (total, signal) => total + moneyToNumber(signal.estimatedDemandValue),
      0,
    );
    const highIntentSignals = demandSignals.reduce((total, signal) => total + signal.highIntentCount, 0);
    const restockRefillSignals = demandSignals
      .filter((signal) => signal.demandType === "Restock" || signal.demandType === "Refill")
      .reduce((total, signal) => total + signal.totalSignals, 0);
    const unassignedDemand = demandSignals.filter((signal) => signal.owner === "Unassigned").length;
    const followUpNeeded = demandSignals.filter((signal) => signal.openRecoveryActions > 0).length;

    return [
      {
        label: "Demand Value Open",
        value: formatCompactMoney(demandValue),
        caption: "Across captured demand",
        tone: "rose",
      },
      {
        label: "High-Intent Signals",
        value: `${highIntentSignals}`,
        caption: "Ready for action",
        tone: "cyan",
      },
      {
        label: "Restock / Refill Signals",
        value: `${restockRefillSignals}`,
        caption: "Inventory-timed recovery",
        tone: "emerald",
      },
      {
        label: "Unassigned Demand",
        value: `${unassignedDemand}`,
        caption: "Needs owner coverage",
        tone: "amber",
      },
      {
        label: "Demand Needing Follow-up",
        value: `${followUpNeeded}`,
        caption: "Open recovery action groups",
        tone: "rose",
      },
    ];
  }, [demandSignals]);

  function recordDemandActivity(signal: ProductDemandSignal, title: string, status: string, nextAction = signal.recommendedNextAction) {
    onActivity({
      category: signal.demandType === "Refill" || signal.demandType === "Restock" ? "Repeat Revenue" : "Inquiries",
      title,
      description: `${signal.demandName} demand was updated with ${signal.totalSignals} captured signals.`,
      impactBadge: `${signal.estimatedDemandValue} demand value`,
      relatedRecord: `${signal.industryType} - ${signal.id}`,
      owner: signal.owner === "Unassigned" ? undefined : signal.owner,
      status,
      nextAction,
      tone: signal.tone,
    });
  }

  function handleDemandAction(signal: ProductDemandSignal, action: "tasks" | "assign" | "reviewed" | "queue") {
    if (action === "tasks") {
      setDemandSignals((signals) =>
        signals.map((item) =>
          item.id === signal.id
            ? {
                ...item,
                recoveryTasksCreated: true,
                openRecoveryActions: item.openRecoveryActions + Math.max(1, Math.min(3, item.highIntentCount)),
                lastAction: "Recovery tasks created",
              }
            : item,
        ),
      );
      setNotice(`Recovery tasks created for ${signal.demandName}.`);
      recordDemandActivity(signal, "Demand recovery tasks created", "Created");
      return;
    }

    if (action === "assign") {
      const owner = getDefaultOwnerForDemand(signal);

      setDemandSignals((signals) =>
        signals.map((item) =>
          item.id === signal.id
            ? {
                ...item,
                owner,
                lastAction: `Assigned to ${owner}`,
              }
            : item,
        ),
      );
      setNotice(`${signal.demandName} assigned to ${owner}.`);
      recordDemandActivity({ ...signal, owner }, "Demand owner assigned", "Owner assigned");
      return;
    }

    if (action === "reviewed") {
      setDemandSignals((signals) =>
        signals.map((item) =>
          item.id === signal.id
            ? {
                ...item,
                reviewed: true,
                lastAction: "Marked reviewed",
              }
            : item,
        ),
      );
      setNotice(`${signal.demandName} marked reviewed.`);
      recordDemandActivity(signal, "Demand signal reviewed", "Reviewed");
      return;
    }

    setDemandSignals((signals) =>
      signals.map((item) =>
        item.id === signal.id
          ? {
              ...item,
              restockQueue: true,
              lastAction: "Added to restock/refill queue",
            }
          : item,
      ),
    );
    setNotice(`${signal.demandName} added to the restock/refill queue.`);
    recordDemandActivity(signal, "Demand added to restock/refill queue", "Queued");
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid">
        {demandKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Product demand filters">
          {productDemandFilters.map((filter) => (
            <button
              className={`queue-tab ${activeDemandFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveDemandFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredDemand.length} demand groups</Badge>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Product Demand</h2>
            <p>Recoverable demand by product, category, drop, refill window, restock request, and buyer question.</p>
          </div>
          <Badge tone="emerald">Demand intelligence</Badge>
        </div>

        <div className="capture-card-list">
          {filteredDemand.map((signal) => (
            <article className={`demand-card ${signal.tone}`} key={signal.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{signal.demandName}</h3>
                    <Badge tone={signal.tone}>{signal.demandType}</Badge>
                  </div>
                  <p>{signal.recommendedNextAction}</p>
                  <div className="recovery-meta">
                    <span>{signal.industryType}</span>
                    <span>{signal.sourceMix.join(" + ")}</span>
                    <span>{signal.stockStatus}</span>
                    <span>{signal.owner}</span>
                  </div>
                </div>
                <div className="capture-value-stack">
                  <strong>{signal.estimatedDemandValue}</strong>
                  <span>{signal.lastAction ?? "Open demand"}</span>
                </div>
              </div>

              <div className="capture-stat-grid">
                <div>
                  <span>Total signals</span>
                  <strong>{signal.totalSignals}</strong>
                </div>
                <div>
                  <span>High intent</span>
                  <strong>{signal.highIntentCount}</strong>
                </div>
                <div>
                  <span>Open recovery actions</span>
                  <strong>{signal.openRecoveryActions}</strong>
                </div>
                <div>
                  <span>Status</span>
                  <strong>
                    {signal.restockQueue ? "Queued" : signal.reviewed ? "Reviewed" : "Needs follow-up"}
                  </strong>
                </div>
              </div>

              <div className="capture-actions">
                <button type="button" className="primary-btn" onClick={() => handleDemandAction(signal, "tasks")}>
                  Create recovery tasks
                </button>
                <button type="button" className="secondary-btn" onClick={() => handleDemandAction(signal, "assign")}>
                  Assign demand owner
                </button>
                <button type="button" className="secondary-btn" onClick={() => handleDemandAction(signal, "reviewed")}>
                  Mark reviewed
                </button>
                <button type="button" className="secondary-btn" onClick={() => handleDemandAction(signal, "queue")}>
                  Add to restock/refill queue
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="detail-notice capture-page-notice">{notice}</p>
      </section>
    </div>
  );
}

function SourceLeakTracking({ onActivity }: { onActivity: (activity: NewRecoveryActivity) => void }) {
  const [sourceRecords, setSourceRecords] = useState<SourceLeakRecord[]>(sourceLeakRecords);
  const [activeSourceFilter, setActiveSourceFilter] = useState<SourceLeakFilter>("All");
  const [notice, setNotice] = useState("Source leakage is ready for recovery review.");

  const filteredSources = sourceRecords.filter((source) =>
    matchesSourceLeakFilter(source, activeSourceFilter),
  );

  const sourceKpis = useMemo<KPI[]>(() => {
    const captured = sourceRecords.reduce((total, source) => total + source.totalCaptured, 0);
    const highIntent = sourceRecords.reduce((total, source) => total + source.highIntentInquiries, 0);
    const missingReplies = sourceRecords.reduce((total, source) => total + source.firstRepliesMissing, 0);
    const unassigned = sourceRecords.reduce((total, source) => total + source.unassignedRecords, 0);
    const pending = sourceRecords.reduce((total, source) => total + moneyToNumber(source.paymentPendingValue), 0);
    const syncIssues = sourceRecords.reduce((total, source) => total + source.syncIssues, 0);
    const recovered = sourceRecords.reduce((total, source) => total + moneyToNumber(source.recoveredValue), 0);

    return [
      { label: "Captured Inquiries", value: `${captured}`, caption: "Across all sources", tone: "cyan" },
      { label: "High-Intent Leads", value: `${highIntent}`, caption: "Revenue-ready signals", tone: "emerald" },
      { label: "Missing First Replies", value: `${missingReplies}`, caption: "Reply leakage", tone: "rose" },
      { label: "Unassigned Records", value: `${unassigned}`, caption: "Owner leakage", tone: "amber" },
      { label: "Payment Pending by Source", value: formatCompactMoney(pending), caption: "At-risk value", tone: "rose" },
      { label: "Source Sync Issues", value: `${syncIssues}`, caption: "Needs source cleanup", tone: "amber" },
      { label: "Recovered by Source", value: formatCompactMoney(recovered), caption: "Recovered value", tone: "emerald" },
    ];
  }, [sourceRecords]);

  function recordSourceActivity(source: SourceLeakRecord, title: string, status: string, nextAction = source.recommendedFix) {
    onActivity({
      category: source.syncIssues > 0 ? "Sync Issues" : "Team Actions",
      title,
      description: `${source.sourceName} source leakage was updated for ${source.totalCaptured} captured inquiries.`,
      impactBadge: `${source.paymentPendingValue} pending`,
      relatedRecord: `${source.sourceName} - ${source.id}`,
      status,
      nextAction,
      tone: source.tone,
    });
  }

  function handleSourceAction(
    source: SourceLeakRecord,
    action: "owners" | "tasks" | "reviewed" | "cases",
  ) {
    if (action === "owners") {
      setSourceRecords((records) =>
        records.map((record) =>
          record.id === source.id
            ? {
                ...record,
                ownersAssigned: true,
                unassignedRecords: 0,
                lastAction: "Missing owners assigned",
              }
            : record,
        ),
      );
      setNotice(`Missing owners assigned for ${source.sourceName}.`);
      recordSourceActivity(source, "Missing source owners assigned", "Owner assigned");
      return;
    }

    if (action === "tasks") {
      setSourceRecords((records) =>
        records.map((record) =>
          record.id === source.id
            ? {
                ...record,
                followUpTasksCreated: true,
                overdueFollowUps: Math.max(0, record.overdueFollowUps - 2),
                lastAction: "Follow-up recovery tasks created",
              }
            : record,
        ),
      );
      setNotice(`Follow-up recovery tasks created for ${source.sourceName}.`);
      recordSourceActivity(source, "Source follow-up recovery tasks created", "Created");
      return;
    }

    if (action === "reviewed") {
      setSourceRecords((records) =>
        records.map((record) =>
          record.id === source.id
            ? {
                ...record,
                reviewed: true,
                syncIssues: Math.max(0, record.syncIssues - 1),
                lastAction: "Source issue reviewed",
              }
            : record,
        ),
      );
      setNotice(`${source.sourceName} issue marked reviewed.`);
      recordSourceActivity(source, "Source issue reviewed", "Reviewed");
      return;
    }

    setSourceRecords((records) =>
      records.map((record) =>
        record.id === source.id
          ? {
              ...record,
              relatedCasesOpened: true,
              lastAction: "Related recovery cases opened",
            }
          : record,
      ),
    );
    setNotice(`Related recovery cases opened for ${source.sourceName}.`);
    recordSourceActivity(source, "Related recovery cases opened", "Opened");
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid source-kpi-grid">
        {sourceKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Source leak filters">
          {sourceLeakFilters.map((filter) => (
            <button
              className={`queue-tab ${activeSourceFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveSourceFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredSources.length} sources</Badge>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Source Leak Tracking</h2>
            <p>Source performance, leakage, payment pending value, recovered value, and the fix each source needs.</p>
          </div>
          <Badge tone="rose">Leakage watch</Badge>
        </div>

        <div className="capture-card-list">
          {filteredSources.map((source) => (
            <article className={`source-leak-card ${source.tone}`} key={source.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{source.sourceName}</h3>
                    <Badge tone={source.tone}>{source.sourceQualityScore}/100</Badge>
                  </div>
                  <p>{source.sourceQuality}</p>
                  <div className="recovery-meta">
                    <span>{source.totalCaptured} captured</span>
                    <span>{source.highIntentInquiries} high intent</span>
                    <span>{source.firstRepliesMissing} missing first replies</span>
                    <span>{source.overdueFollowUps} overdue follow-ups</span>
                    <span>{source.syncIssues} sync issues</span>
                  </div>
                </div>
                <div className="capture-value-stack">
                  <strong>{source.paymentPendingValue}</strong>
                  <span>payment pending</span>
                </div>
              </div>

              <div className="capture-stat-grid source-stat-grid">
                <div>
                  <span>Unassigned records</span>
                  <strong>{source.unassignedRecords}</strong>
                </div>
                <div>
                  <span>Recovered value</span>
                  <strong>{source.recoveredValue}</strong>
                </div>
                <div>
                  <span>Source quality</span>
                  <strong>{source.sourceQualityScore}/100</strong>
                </div>
                <div>
                  <span>Latest action</span>
                  <strong>{source.lastAction ?? "Needs review"}</strong>
                </div>
              </div>

              <div className="detail-callout source-fix-callout">
                <span>Recommended fix</span>
                <p>{source.recommendedFix}</p>
              </div>

              <div className="capture-actions">
                <button type="button" className="primary-btn" onClick={() => handleSourceAction(source, "owners")}>
                  Assign missing owners
                </button>
                <button type="button" className="secondary-btn" onClick={() => handleSourceAction(source, "tasks")}>
                  Create follow-up recovery tasks
                </button>
                <button type="button" className="secondary-btn" onClick={() => handleSourceAction(source, "reviewed")}>
                  Mark source issue reviewed
                </button>
                <button type="button" className="secondary-btn" onClick={() => handleSourceAction(source, "cases")}>
                  Open related recovery cases
                </button>
              </div>
            </article>
          ))}
        </div>

        <p className="detail-notice capture-page-notice">{notice}</p>
      </section>
    </div>
  );
}

function ProductCatalog() {
  const [products, setProducts] = useState<ProductItem[]>(productItems);
  const [activeProductFilter, setActiveProductFilter] = useState<ProductCatalogFilter>("All");
  const [selectedProductId, setSelectedProductId] = useState(productItems[0].id);
  const [notice, setNotice] = useState("Product catalog is ready for recovery data cleanup.");

  const filteredProducts = products.filter((product) =>
    matchesProductCatalogFilter(product, activeProductFilter),
  );
  const selectedProduct =
    products.find((product) => product.id === selectedProductId) ?? filteredProducts[0] ?? products[0];

  const catalogKpis = useMemo<KPI[]>(() => {
    const activeSkus = products.filter((product) => product.active).reduce((total, product) => total + product.skuCount, 0);
    const restockProducts = products.filter((product) => matchesProductCatalogFilter(product, "Restock")).length;
    const refillProducts = products.filter((product) => matchesProductCatalogFilter(product, "Refill")).length;
    const demandValue = products.reduce((total, product) => total + moneyToNumber(product.openRecoveryValue), 0);
    const missingTags = products.filter((product) => matchesProductCatalogFilter(product, "Missing Tags")).length;

    return [
      { label: "Products Tracked", value: `${products.length}`, caption: "Catalog recovery records", tone: "cyan" },
      { label: "Active SKUs", value: `${activeSkus}`, caption: "Ready for recovery use", tone: "emerald" },
      { label: "Restock Products", value: `${restockProducts}`, caption: "Restock interest open", tone: "amber" },
      { label: "Refill Products", value: `${refillProducts}`, caption: "Repeat revenue timing", tone: "emerald" },
      { label: "Product Demand Value", value: formatCompactMoney(demandValue), caption: "Linked recovery value", tone: "rose" },
      { label: "Missing Tags / Categories", value: `${missingTags}`, caption: "Needs catalog cleanup", tone: "amber" },
    ];
  }, [products]);

  function updateSelectedProduct(updates: Partial<ProductItem>, message: string) {
    const current = selectedProduct;
    setProducts((items) => items.map((item) => (item.id === current.id ? { ...item, ...updates } : item)));
    setNotice(`${message} for ${current.productName}.`);
  }

  function addRecoveryTag() {
    const nextTags = selectedProduct.productTags.includes("Recovery Tag")
      ? selectedProduct.productTags
      : [...selectedProduct.productTags, "Recovery Tag"];
    updateSelectedProduct({ productTags: nextTags }, "Recovery tag added");
  }

  function addToRestockRefillQueue() {
    const queueTag = selectedProduct.refillCycle === "Not refill-led" ? "Restock Waiting" : "Refill Reminder";
    const nextTags = selectedProduct.productTags.includes(queueTag)
      ? selectedProduct.productTags
      : [...selectedProduct.productTags, queueTag];
    updateSelectedProduct(
      {
        productTags: nextTags,
        stockRestockStatus: selectedProduct.refillCycle === "Not refill-led" ? "Restock queue active" : "Refill queue active",
      },
      "Restock/refill queue updated",
    );
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {catalogKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Product catalog filters">
          {productCatalogFilters.map((filter) => (
            <button
              className={`queue-tab ${activeProductFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveProductFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredProducts.length} products</Badge>
      </section>

      <section className="recovery-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Product Catalog</h2>
              <p>Products connected to demand, restock interest, refill timing, recovery value, and recovered revenue.</p>
            </div>
            <Badge tone="emerald">Product data layer</Badge>
          </div>

          <div className="capture-card-list">
            {filteredProducts.map((product) => (
              <button
                className={`product-card inquiry-button ${product.tone} ${
                  selectedProduct.id === product.id ? "selected" : ""
                }`}
                key={product.id}
                onClick={() => setSelectedProductId(product.id)}
                type="button"
              >
                <div className="capture-card-main buyer-card-main">
                  <div>
                    <div className="recovery-row-title">
                      <h3>{product.productName}</h3>
                      <Badge tone={product.tone}>{product.industryType}</Badge>
                    </div>
                    <p>{product.productType} - {product.category} - {product.productFolder}</p>
                    <div className="recovery-meta">
                      <span>{product.skuCount} SKUs</span>
                      <span>{product.priceRange}</span>
                      <span>{product.stockRestockStatus}</span>
                      <span>{product.refillCycle}</span>
                    </div>
                    <div className="product-tag-list">
                      {product.productTags.slice(0, 4).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="capture-value-stack">
                    <strong>{product.openRecoveryValue}</strong>
                    <span>{product.linkedDemandCount} linked demand</span>
                  </div>
                </div>

                <div className="capture-stat-grid source-stat-grid">
                  <div>
                    <span>Recovered value</span>
                    <strong>{product.recoveredValue}</strong>
                  </div>
                  <div>
                    <span>Stock / restock</span>
                    <strong>{product.stockRestockStatus}</strong>
                  </div>
                  <div>
                    <span>Refill cycle</span>
                    <strong>{product.refillCycle}</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong>{product.active ? "Active" : "Inactive"}</strong>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div>
              <h2>{selectedProduct.productName}</h2>
              <p>{selectedProduct.productType}</p>
            </div>
            <strong>{selectedProduct.openRecoveryValue}</strong>
          </div>

          <div className="detail-grid">
            <div>
              <span>Category</span>
              <strong>{selectedProduct.category}</strong>
            </div>
            <div>
              <span>Product folder</span>
              <strong>{selectedProduct.productFolder}</strong>
            </div>
            <div>
              <span>SKU count</span>
              <strong>{selectedProduct.skuCount}</strong>
            </div>
            <div>
              <span>Price range</span>
              <strong>{selectedProduct.priceRange}</strong>
            </div>
            <div>
              <span>Linked demand</span>
              <strong>{selectedProduct.linkedDemandCount}</strong>
            </div>
            <div>
              <span>Recovered value</span>
              <strong>{selectedProduct.recoveredValue}</strong>
            </div>
          </div>

          <div className="detail-callout">
            <span>Recommended product action</span>
            <p>{selectedProduct.recommendedProductAction}</p>
          </div>

          <div className="product-tag-list detail-tag-list">
            {selectedProduct.productTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>

          <p className="detail-notice">{notice}</p>

          <div className="detail-actions">
            <button type="button" className="primary-btn">Open SKU sheet</button>
            <button type="button" className="secondary-btn">Edit product</button>
            <button type="button" className="secondary-btn" onClick={addRecoveryTag}>Add tag</button>
            <button type="button" className="secondary-btn" onClick={addToRestockRefillQueue}>
              Add to restock/refill queue
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedProduct({ active: false }, "Product marked inactive")}
            >
              Mark inactive
            </button>
            <button type="button" className="secondary-btn">Export product</button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function SKUVariantSheet() {
  const [rows, setRows] = useState<SKUVariant[]>(skuVariants);
  const [activeSkuFilter, setActiveSkuFilter] = useState<SKUVariantFilter>("All");

  const filteredRows = rows.filter((row) => matchesSKUVariantFilter(row, activeSkuFilter));

  const skuKpis = useMemo<KPI[]>(() => {
    const missingData = rows.filter((row) => !row.sku || !row.category || !row.tags).length;
    const variantsNeedingTags = rows.filter((row) => !row.tags).length;
    const restockWaiting = rows.filter((row) => row.restockStatus.toLowerCase().includes("restock")).length;
    const refillSkus = rows.filter((row) => row.refillCycle !== "N/A").length;
    const recentlyUpdated = rows.filter((row) => row.lastUpdated.toLowerCase().includes("today")).length;

    return [
      { label: "Total SKU Rows", value: `${rows.length}`, caption: "Editable SKU control", tone: "cyan" },
      { label: "Missing SKU Data", value: `${missingData}`, caption: "Needs cleanup", tone: "rose" },
      { label: "Variants Needing Tags", value: `${variantsNeedingTags}`, caption: "Recovery tags missing", tone: "amber" },
      { label: "Restock Waiting SKUs", value: `${restockWaiting}`, caption: "Restock interest", tone: "rose" },
      { label: "Refill SKUs", value: `${refillSkus}`, caption: "Repeat revenue timing", tone: "emerald" },
      { label: "Recently Updated", value: `${recentlyUpdated}`, caption: "Changed today", tone: "emerald" },
    ];
  }, [rows]);

  function updateSkuField(
    id: string,
    field: "productName" | "category" | "price" | "stockStatus" | "tags",
    value: string,
  ) {
    setRows((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
              lastUpdated: "Edited now",
            }
          : item,
      ),
    );
  }

  function addSkuRow() {
    setRows((items) => [
      {
        id: `SKU-${1700 + items.length}`,
        sku: "",
        productName: "New product row",
        variant: "New variant",
        size: "",
        colorShade: "",
        category: "",
        price: "",
        stockStatus: "Active",
        restockStatus: "Needs review",
        refillCycle: "N/A",
        productFolder: "New Arrivals",
        tags: "",
        linkedDemand: 0,
        recoveryValue: "$0",
        lastUpdated: "Added now",
        industryType: "Fashion / Apparel",
        fitType: "",
        skinConcern: "",
        routineStep: "",
        bundleEligibility: "",
        sensitiveSkinFlag: "",
        active: true,
        tone: "cyan",
      },
      ...items,
    ]);
  }

  function duplicateSkuRow(row: SKUVariant) {
    setRows((items) => [
      {
        ...row,
        id: `${row.id}-copy-${items.length}`,
        sku: `${row.sku || "NEW-SKU"}-COPY`,
        lastUpdated: "Duplicated now",
      },
      ...items,
    ]);
  }

  function deleteSkuRow(id: string) {
    setRows((items) => items.filter((item) => item.id !== id));
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {skuKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="SKU sheet filters">
          {skuVariantFilters.map((filter) => (
            <button
              className={`queue-tab ${activeSkuFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveSkuFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="capture-actions sheet-actions">
          <button type="button" className="primary-btn" onClick={addSkuRow}>Add row</button>
          <button type="button" className="secondary-btn">Bulk tag</button>
          <button type="button" className="secondary-btn">Save changes</button>
          <button type="button" className="secondary-btn">Export sheet</button>
        </div>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>SKU / Variant Sheet</h2>
            <p>Spreadsheet-like SKU control for product names, variants, categories, pricing, status, and recovery tags.</p>
          </div>
          <Badge tone="cyan">{filteredRows.length} visible rows</Badge>
        </div>

        <div className="sku-sheet-wrap">
          <div className="sku-sheet">
            <div className="sku-sheet-row sku-sheet-head">
              <span>SKU</span>
              <span>Product name</span>
              <span>Variant</span>
              <span>Size</span>
              <span>Color/Shade</span>
              <span>Category</span>
              <span>Price</span>
              <span>Stock status</span>
              <span>Restock status</span>
              <span>Refill cycle</span>
              <span>Product folder</span>
              <span>Tags</span>
              <span>Linked demand</span>
              <span>Recovery value</span>
              <span>Last updated</span>
              <span>Actions</span>
            </div>

            {filteredRows.map((row) => (
              <div className={`sku-sheet-row ${row.tone}`} key={row.id}>
                <span className="sku-readonly">{row.sku || "Missing SKU"}</span>
                <label>
                  <span className="sr-only">Product name</span>
                  <input
                    value={row.productName}
                    onChange={(event) => updateSkuField(row.id, "productName", event.target.value)}
                  />
                </label>
                <span>{row.variant}</span>
                <span>{row.size || "-"}</span>
                <span>{row.colorShade || "-"}</span>
                <label>
                  <span className="sr-only">Category</span>
                  <input
                    value={row.category}
                    onChange={(event) => updateSkuField(row.id, "category", event.target.value)}
                    placeholder="Map category"
                  />
                </label>
                <label>
                  <span className="sr-only">Price</span>
                  <input
                    value={row.price}
                    onChange={(event) => updateSkuField(row.id, "price", event.target.value)}
                    placeholder="$0"
                  />
                </label>
                <label>
                  <span className="sr-only">Stock status</span>
                  <select
                    value={row.stockStatus}
                    onChange={(event) => updateSkuField(row.id, "stockStatus", event.target.value)}
                  >
                    <option>Active</option>
                    <option>Low stock</option>
                    <option>Out of stock</option>
                    <option>Restock waiting</option>
                    <option>Appointment-led</option>
                    <option>Needs owner mapping</option>
                    <option>Inactive</option>
                  </select>
                </label>
                <span>{row.restockStatus}</span>
                <span>{row.refillCycle}</span>
                <span>{row.productFolder}</span>
                <label>
                  <span className="sr-only">Tags</span>
                  <input
                    value={row.tags}
                    onChange={(event) => updateSkuField(row.id, "tags", event.target.value)}
                    placeholder="Add recovery tags"
                  />
                </label>
                <span>{row.linkedDemand}</span>
                <span>{row.recoveryValue}</span>
                <span>{row.lastUpdated}</span>
                <span className="sku-row-actions">
                  <button type="button" onClick={() => duplicateSkuRow(row)}>Duplicate</button>
                  <button type="button" onClick={() => deleteSkuRow(row.id)}>Delete</button>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="sheet-field-summary">
          <div>
            <span>Fashion-specific fields</span>
            <p>Size, color, collection, fit type, restock status, and new drop status stay visible on each apparel row.</p>
          </div>
          <div>
            <span>Beauty-specific fields</span>
            <p>Shade, skin concern, routine step, refill cycle, bundle eligibility, and sensitive-skin flag stay attached to SKU rows.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoriesTags() {
  const taxonomyKpis: KPI[] = [
    { label: "Product Folders", value: `${productFolders.length}`, caption: "Recovery-ready groups", tone: "cyan" },
    { label: "Active Categories", value: `${productCategories.length}`, caption: "Mapped product categories", tone: "emerald" },
    { label: "Product Tags", value: `${productTags.length}`, caption: "Recovery labels", tone: "amber" },
    { label: "Auto Tag Suggestions", value: `${tagSuggestions.length}`, caption: "Smart cleanup ideas", tone: "cyan" },
    { label: "Untagged Products", value: `${skuVariants.filter((row) => !row.tags).length}`, caption: "Needs recovery tags", tone: "rose" },
    { label: "Recovery Rules Using Tags", value: "18", caption: "Tag-driven actions", tone: "emerald" },
  ];

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {taxonomyKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="two-column-grid product-taxonomy-grid">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Product Folders</h2>
              <p>Folders that help product demand, restock interest, refill timing, and post-purchase actions stay organized.</p>
            </div>
            <Badge tone="cyan">{productFolders.length} folders</Badge>
          </div>

          <div className="capture-card-list">
            {productFolders.map((folder) => (
              <article className={`product-card ${folder.tone}`} key={folder.id}>
                <div className="capture-card-main">
                  <div>
                    <div className="recovery-row-title">
                      <h3>{folder.folderName}</h3>
                      <Badge tone={folder.tone}>{folder.industryType}</Badge>
                    </div>
                    <p>{folder.recoveryUse}</p>
                    <div className="recovery-meta">
                      <span>{folder.productCount} products</span>
                      <span>{folder.owner}</span>
                    </div>
                  </div>
                  <div className="capture-value-stack">
                    <strong>{folder.openRecoveryValue}</strong>
                    <span>open recovery value</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="capture-actions">
            <button type="button" className="primary-btn">Create folder</button>
            <button type="button" className="secondary-btn">Assign products to folder</button>
          </div>
        </article>

        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Product Categories</h2>
              <p>Category mapping that keeps recovery actions tied to product demand instead of loose product notes.</p>
            </div>
            <Badge tone="emerald">{productCategories.length} categories</Badge>
          </div>

          <div className="capture-card-list">
            {productCategories.map((category) => (
              <article className={`product-card ${category.tone}`} key={category.id}>
                <div className="capture-card-main">
                  <div>
                    <div className="recovery-row-title">
                      <h3>{category.categoryName}</h3>
                      <Badge tone={category.tone}>{category.mappedDemandSignals} signals</Badge>
                    </div>
                    <p>{category.recoveryUse}</p>
                    <div className="recovery-meta">
                      <span>{category.productCount} products</span>
                      <span>{category.mappedDemandSignals} mapped demand signals</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="capture-actions">
            <button type="button" className="primary-btn">Add category</button>
            <button type="button" className="secondary-btn">Merge duplicate tags</button>
          </div>
        </article>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Smart Tag Suggestions</h2>
            <p>Suggestions based on product name, SKU, category, stock status, refill cycle, and demand signals.</p>
          </div>
          <Badge tone="amber">Recovery tags</Badge>
        </div>

        <div className="tag-suggestion-layout">
          <div className="capture-card-list">
            {tagSuggestions.map((suggestion) => (
              <article className={`product-card tag-suggestion-card ${suggestion.tone}`} key={suggestion.id}>
                <div className="capture-card-main">
                  <div>
                    <div className="recovery-row-title">
                      <h3>{suggestion.condition}</h3>
                      <Badge tone={suggestion.tone}>{suggestion.affectedProducts} products</Badge>
                    </div>
                    <p>{suggestion.reason}</p>
                    <div className="product-tag-list">
                      {suggestion.suggestedTags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="detail-callout source-fix-callout">
                  <span>Recovery use</span>
                  <p>{suggestion.recoveryUse}</p>
                </div>
                <div className="capture-actions">
                  <button type="button" className="primary-btn">Apply suggested tags</button>
                  <button type="button" className="secondary-btn">Create recovery rule from tag</button>
                </div>
              </article>
            ))}
          </div>

          <aside className="summary-breakdown-card product-tag-bank">
            <h3>Product Tags</h3>
            {productTags.map((tag) => (
              <div key={tag.id}>
                <span>{tag.tagName}</span>
                <strong>{tag.productCount}</strong>
              </div>
            ))}
          </aside>
        </div>
      </section>
    </div>
  );
}

function ProductImportExport() {
  const importIssues = importPreviewRows.filter((row) => row.detectedIssue !== "Clean").length;
  const duplicateSkus = importPreviewRows.filter((row) => row.detectedIssue === "Duplicate SKU").length;
  const missingCategories = importPreviewRows.filter((row) => row.detectedIssue.includes("category")).length;
  const cleanRecords = importPreviewRows.filter((row) => row.detectedIssue === "Clean").length;

  const importExportKpis: KPI[] = [
    { label: "Last Import Rows", value: "482", caption: "Most recent product file", tone: "cyan" },
    { label: "Import Issues", value: `${importIssues}`, caption: "Needs cleanup before confirm", tone: "rose" },
    { label: "Duplicate SKUs", value: `${duplicateSkus}`, caption: "Merge or rename", tone: "amber" },
    { label: "Missing Categories", value: `${missingCategories}`, caption: "Category mapping needed", tone: "rose" },
    { label: "Exportable Lists", value: `${exportOptions.length}`, caption: "CSV-ready surfaces", tone: "emerald" },
    { label: "Clean Product Records", value: `${cleanRecords}`, caption: "Preview rows ready", tone: "emerald" },
  ];

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {importExportKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="two-column-grid import-export-grid">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Import Product Data</h2>
              <p>Bring in product, SKU, folder, category, and tag data without rebuilding recovery context manually.</p>
            </div>
            <Badge tone="cyan">CSV ready</Badge>
          </div>

          <div className="import-step-grid">
            <div>
              <span>Upload CSV</span>
              <strong>Product file selected</strong>
            </div>
            <div>
              <span>Upload XLSX placeholder</span>
              <strong>Available next</strong>
            </div>
            <div>
              <span>Map columns</span>
              <strong>SKU, product, category, price, tags</strong>
            </div>
            <div>
              <span>Validate import</span>
              <strong>Detect missing and duplicate data</strong>
            </div>
          </div>

          <div className="capture-actions">
            <button type="button" className="primary-btn">Upload file</button>
            <button type="button" className="secondary-btn">Map columns</button>
            <button type="button" className="secondary-btn">Validate import</button>
            <button type="button" className="secondary-btn">Confirm import</button>
          </div>

          <div className="import-preview-list">
            {importPreviewRows.map((row) => (
              <article className={`import-preview-row ${row.tone}`} key={row.id}>
                <div>
                  <div className="recovery-row-title">
                    <h3>{row.rowLabel} - {row.productName}</h3>
                    <Badge tone={row.tone}>{row.detectedIssue}</Badge>
                  </div>
                  <p>{row.sku || "Missing SKU"} - {row.category || "Missing category"} - {row.price || "Missing price"}</p>
                  <div className="recovery-meta">
                    <span>{row.tags || "Missing tags"}</span>
                    <span>{row.importAction}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Export Product Data</h2>
              <p>Export catalog, SKU, product demand, restock, refill, category, and tag data for cleanup or reporting.</p>
            </div>
            <Badge tone="emerald">CSV / XLSX / JSON</Badge>
          </div>

          <div className="export-option-list">
            {exportOptions.map((option) => (
              <article className={`export-option-card ${option.tone}`} key={option.id}>
                <div>
                  <div className="recovery-row-title">
                    <h3>{option.exportName}</h3>
                    <Badge tone={option.tone}>{option.format}</Badge>
                  </div>
                  <p>{option.description}</p>
                  <div className="recovery-meta">
                    <span>{option.recordCount} records</span>
                    <span>{option.recoveryUse}</span>
                  </div>
                </div>
                <button type="button" className="secondary-btn">Export</button>
              </article>
            ))}
          </div>

          <div className="capture-actions">
            <button type="button" className="primary-btn">Export CSV</button>
            <button type="button" className="secondary-btn">Export XLSX</button>
            <button type="button" className="secondary-btn">Export JSON</button>
          </div>
        </article>
      </section>

      <section className="summary-breakdown-grid">
        <article className="summary-breakdown-card">
          <h3>Import Activity Log</h3>
          <div><span>Preview generated</span><strong>Today 12:20 PM</strong></div>
          <div><span>Column map saved</span><strong>SKU + category</strong></div>
          <div><span>Issues detected</span><strong>{importIssues}</strong></div>
        </article>
        <article className="summary-breakdown-card">
          <h3>Data Checks</h3>
          <div><span>Missing SKU</span><strong>{importPreviewRows.filter((row) => row.detectedIssue === "Missing SKU").length}</strong></div>
          <div><span>Missing price</span><strong>{importPreviewRows.filter((row) => row.detectedIssue === "Missing price").length}</strong></div>
          <div><span>Missing tags</span><strong>{importPreviewRows.filter((row) => row.detectedIssue.includes("tags")).length}</strong></div>
        </article>
        <article className="summary-breakdown-card">
          <h3>Export Readiness</h3>
          <div><span>Product catalog</span><strong>Ready</strong></div>
          <div><span>SKU sheet</span><strong>Ready</strong></div>
          <div><span>Category/tag report</span><strong>Ready</strong></div>
        </article>
      </section>
    </div>
  );
}

function BuyerProfiles() {
  const [activeBuyerFilter, setActiveBuyerFilter] = useState<BuyerProfileFilter>("All");
  const [selectedBuyerId, setSelectedBuyerId] = useState(buyerProfiles[0].id);

  const filteredBuyers = buyerProfiles.filter((buyer) =>
    matchesBuyerProfileFilter(buyer, activeBuyerFilter),
  );
  const selectedBuyer =
    buyerProfiles.find((buyer) => buyer.id === selectedBuyerId) ?? filteredBuyers[0] ?? buyerProfiles[0];

  const buyerKpis = useMemo<KPI[]>(() => {
    const openCases = buyerProfiles.filter((buyer) => buyer.openRecoveryCases > 0).length;
    const repeatBuyers = buyerProfiles.filter((buyer) => buyer.purchaseCount > 1).length;
    const atRisk = buyerProfiles.filter(
      (buyer) => buyer.lifecycleStatus === "At Risk" || buyer.lifecycleStatus === "Inactive",
    ).length;
    const vipBuyers = buyerProfiles.filter(
      (buyer) => buyer.lifecycleStatus === "VIP" || buyer.tags.includes("VIP"),
    ).length;
    const refillRestock = buyerProfiles.filter(
      (buyer) =>
        buyer.lifecycleStatus === "Refill Ready" ||
        buyer.lifecycleStatus === "Restock Waiting" ||
        buyer.tags.includes("Refill Ready") ||
        buyer.tags.includes("Restock Waiting"),
    ).length;

    return [
      { label: "Total Buyers Tracked", value: `${buyerProfiles.length}`, caption: "Lifecycle recovery records", tone: "cyan" },
      { label: "Buyers With Open Recovery Cases", value: `${openCases}`, caption: "Needs owner action", tone: "rose" },
      { label: "Repeat Buyers", value: `${repeatBuyers}`, caption: "Purchase history present", tone: "emerald" },
      { label: "At-Risk Buyers", value: `${atRisk}`, caption: "Revenue can leak", tone: "rose" },
      { label: "VIP / High-Value Buyers", value: `${vipBuyers}`, caption: "Priority recovery context", tone: "amber" },
      { label: "Refill / Restock Ready", value: `${refillRestock}`, caption: "Repeat revenue timing", tone: "emerald" },
    ];
  }, []);

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid buyer-kpi-grid">
        {buyerKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Buyer lifecycle filters">
          {buyerProfileFilters.map((filter) => (
            <button
              className={`queue-tab ${activeBuyerFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveBuyerFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredBuyers.length} buyer profiles</Badge>
      </section>

      <section className="recovery-workspace capture-workspace buyer-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Buyer Profiles</h2>
              <p>Individual buyer lifecycle context for value, risk, preferences, and next best revenue action.</p>
            </div>
            <Badge tone="emerald">Lifecycle recovery</Badge>
          </div>

          <div className="capture-card-list">
            {filteredBuyers.map((buyer) => (
              <button
                className={`buyer-card inquiry-button ${buyer.tone} ${
                  selectedBuyer.id === buyer.id ? "selected" : ""
                }`}
                key={buyer.id}
                onClick={() => setSelectedBuyerId(buyer.id)}
                type="button"
              >
                <div className="capture-card-main buyer-card-main">
                  <div className="buyer-identity">
                    <Avatar name={buyer.buyerName} />
                    <div>
                      <div className="recovery-row-title">
                        <h3>{buyer.buyerName}</h3>
                        <Badge tone={buyer.tone}>{buyer.lifecycleStatus}</Badge>
                      </div>
                      <p>{buyer.favoriteCategory}</p>
                      <div className="recovery-meta">
                        <span>{buyer.source}</span>
                        <span>{buyer.lastPurchase}</span>
                        <span>{buyer.lastContact}</span>
                        <span>{buyer.nextFollowUp}</span>
                        <span>{buyer.owner}</span>
                      </div>
                    </div>
                  </div>
                  <div className="capture-value-stack">
                    <strong>{buyer.totalSpend}</strong>
                    <span>{buyer.purchaseCount} purchases</span>
                  </div>
                </div>

                <div className="capture-stat-grid buyer-stat-grid">
                  <div>
                    <span>Open recovery cases</span>
                    <strong>{buyer.openRecoveryCases}</strong>
                  </div>
                  <div>
                    <span>Revenue at risk</span>
                    <strong>{buyer.revenueAtRisk}</strong>
                  </div>
                  <div>
                    <span>Tags</span>
                    <strong>{buyer.tags.join(" / ")}</strong>
                  </div>
                  <div>
                    <span>Next best action</span>
                    <strong>{buyer.recommendedNextAction}</strong>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedBuyer.buyerName} />
              <div>
                <h2>{selectedBuyer.buyerName}</h2>
                <p>{selectedBuyer.favoriteCategory}</p>
              </div>
            </div>
            <strong>{selectedBuyer.revenueAtRisk}</strong>
          </div>

          <div className="customer-summary-box">
            <span>Buyer lifecycle summary</span>
            <p>
              {selectedBuyer.lifecycleStatus} buyer from {selectedBuyer.source}. Owner: {selectedBuyer.owner}.{" "}
              {selectedBuyer.openRecoveryCases} open recovery cases.
            </p>
          </div>

          <div className="detail-grid">
            <div>
              <span>Email</span>
              <strong>{selectedBuyer.email}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{selectedBuyer.phone}</strong>
            </div>
            <div>
              <span>Source</span>
              <strong>{selectedBuyer.source}</strong>
            </div>
            <div>
              <span>Lifecycle status</span>
              <strong>{selectedBuyer.lifecycleStatus}</strong>
            </div>
            <div>
              <span>Total spend / LTV</span>
              <strong>{selectedBuyer.totalSpend}</strong>
            </div>
            <div>
              <span>Purchase count</span>
              <strong>{selectedBuyer.purchaseCount}</strong>
            </div>
          </div>

          <div className="detail-callout">
            <span>Recommended next action</span>
            <p>{selectedBuyer.recommendedNextAction}</p>
          </div>

          <div className="thread-panel buyer-detail-stack">
            <div>
              <span>Product preferences</span>
              <p>{selectedBuyer.productPreferences}</p>
            </div>
            <div>
              <span>Purchase history summary</span>
              <p>{selectedBuyer.purchaseHistorySummary}</p>
            </div>
            <div>
              <span>Refill/restock status</span>
              <p>{selectedBuyer.refillRestockStatus}</p>
            </div>
            <div>
              <span>Post-purchase status</span>
              <p>{selectedBuyer.postPurchaseStatus}</p>
            </div>
            <div>
              <span>Internal notes</span>
              <p>{selectedBuyer.internalNotes}</p>
            </div>
          </div>

          <div className="template-box">
            <div>
              <span>Message template preview</span>
            </div>
            <p>{selectedBuyer.messageTemplatePreview}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function RevenueSegments() {
  const [activeSegmentFilter, setActiveSegmentFilter] = useState<RevenueSegmentFilter>("All");
  const filteredSegments = revenueSegments.filter((segment) =>
    matchesRevenueSegmentFilter(segment, activeSegmentFilter),
  );

  const segmentKpis = useMemo<KPI[]>(() => {
    const totalOpportunity = revenueSegments.reduce(
      (total, segment) => total + moneyToNumber(segment.totalRevenueOpportunity),
      0,
    );
    const buyersInSegments = revenueSegments.reduce((total, segment) => total + segment.buyerCount, 0);
    const refillRestockValue = revenueSegments
      .filter((segment) => segment.segmentType === "Refill Due" || segment.segmentType === "Restock Waiting")
      .reduce((total, segment) => total + moneyToNumber(segment.totalRevenueOpportunity), 0);
    const inactiveValue = revenueSegments
      .filter((segment) => segment.segmentType === "Inactive Buyers")
      .reduce((total, segment) => total + moneyToNumber(segment.totalRevenueOpportunity), 0);
    const postPurchaseValue = revenueSegments
      .filter((segment) => segment.segmentType === "Post-Purchase" || segment.segmentType === "UGC / Referral")
      .reduce((total, segment) => total + moneyToNumber(segment.totalRevenueOpportunity), 0);
    const highIntentCount = revenueSegments.filter((segment) => segment.segmentType === "High Intent").length;

    return [
      { label: "Segment Revenue Opportunity", value: formatCompactMoney(totalOpportunity), caption: "Recoverable segment value", tone: "rose" },
      { label: "Buyers In Recovery Segments", value: `${buyersInSegments}`, caption: "Grouped by revenue action", tone: "cyan" },
      { label: "Refill / Restock Segment Value", value: formatCompactMoney(refillRestockValue), caption: "Repeat revenue timing", tone: "emerald" },
      { label: "Inactive Buyer Value", value: formatCompactMoney(inactiveValue), caption: "Reactivation opportunity", tone: "amber" },
      { label: "Post-Purchase Opportunity", value: formatCompactMoney(postPurchaseValue), caption: "Review and referral value", tone: "emerald" },
      { label: "High-Intent Segment Count", value: `${highIntentCount}`, caption: "Needs fast follow-up", tone: "rose" },
    ];
  }, []);

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid buyer-kpi-grid">
        {segmentKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Revenue segment filters">
          {revenueSegmentFilters.map((filter) => (
            <button
              className={`queue-tab ${activeSegmentFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveSegmentFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredSegments.length} recovery segments</Badge>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Revenue Segments</h2>
            <p>Buyer groups organized by recoverable revenue, repeat timing, reactivation, and post-purchase value.</p>
          </div>
          <Badge tone="emerald">Segment recovery</Badge>
        </div>

        <div className="capture-card-list">
          {filteredSegments.map((segment) => (
            <article className={`segment-card ${segment.tone}`} key={segment.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{segment.segmentName}</h3>
                    <Badge tone={segment.tone}>{segment.segmentType}</Badge>
                  </div>
                  <p>{segment.recommendedAction}</p>
                  <div className="recovery-meta">
                    <span>{segment.buyerCount} buyers</span>
                    <span>{segment.openRecoveryActions} open recovery actions</span>
                    <span>{segment.averageOrderValue} AOV</span>
                    <span>{segment.lastActivity}</span>
                    <span>{segment.owner}</span>
                  </div>
                </div>
                <div className="capture-value-stack">
                  <strong>{segment.totalRevenueOpportunity}</strong>
                  <span>{segment.recoveredValue} recovered</span>
                </div>
              </div>

              <div className="capture-stat-grid">
                <div>
                  <span>Buyer count</span>
                  <strong>{segment.buyerCount}</strong>
                </div>
                <div>
                  <span>Recovered value</span>
                  <strong>{segment.recoveredValue}</strong>
                </div>
                <div>
                  <span>Open actions</span>
                  <strong>{segment.openRecoveryActions}</strong>
                </div>
                <div>
                  <span>Owner</span>
                  <strong>{segment.owner}</strong>
                </div>
              </div>

              <div className="capture-actions">
                <button type="button" className="primary-btn">Create recovery tasks</button>
                <button type="button" className="secondary-btn">Assign segment owner</button>
                <button type="button" className="secondary-btn">Mark segment reviewed</button>
                <button type="button" className="secondary-btn">Export segment</button>
                <button type="button" className="secondary-btn">Open buyers</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function BuyerValue() {
  const [activeValueFilter, setActiveValueFilter] = useState<BuyerValueFilter>("All");
  const filteredValueRecords = buyerValueRecords.filter((record) =>
    matchesBuyerValueFilter(record, activeValueFilter),
  );

  const valueKpis = useMemo<KPI[]>(() => {
    const totalValue = buyerValueRecords.reduce((total, record) => total + moneyToNumber(record.lifetimeValue), 0);
    const riskValue = buyerValueRecords.reduce((total, record) => total + moneyToNumber(record.revenueAtRisk), 0);
    const repeatRevenue = buyerValueRecords.reduce(
      (total, record) => total + moneyToNumber(record.refillRestockOpportunityValue),
      0,
    );
    const highValueAtRisk = buyerValueRecords.filter(
      (record) => record.valueFlags.includes("At Risk") && moneyToNumber(record.lifetimeValue) >= 1000,
    ).length;
    const recoveredValue = buyerValueRecords.reduce((total, record) => total + moneyToNumber(record.recoveredValue), 0);
    const averageOrderValue =
      buyerValueRecords.reduce((total, record) => total + moneyToNumber(record.averageOrderValue), 0) /
      buyerValueRecords.length;

    return [
      { label: "Tracked Buyer Value", value: formatCompactMoney(totalValue), caption: "Visible buyer LTV", tone: "cyan" },
      { label: "Revenue At Risk", value: formatCompactMoney(riskValue), caption: "Needs next best action", tone: "rose" },
      { label: "Predicted Repeat Revenue", value: formatCompactMoney(repeatRevenue), caption: "Refill/restock potential", tone: "emerald" },
      { label: "High-Value At-Risk Buyers", value: `${highValueAtRisk}`, caption: "Priority recovery", tone: "amber" },
      { label: "Recovered Buyer Value", value: formatCompactMoney(recoveredValue), caption: "Recovered from buyer actions", tone: "emerald" },
      { label: "Average Order Value", value: `$${Math.round(averageOrderValue)}`, caption: "Across visible buyers", tone: "cyan" },
    ];
  }, []);

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid buyer-kpi-grid">
        {valueKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Buyer value filters">
          {buyerValueFilters.map((filter) => (
            <button
              className={`queue-tab ${activeValueFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveValueFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredValueRecords.length} buyer value records</Badge>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Buyer Value</h2>
            <p>Buyer value prioritization by LTV, revenue at risk, repeat potential, recovered value, and next best action.</p>
          </div>
          <Badge tone="rose">Buyer value priority</Badge>
        </div>

        <div className="capture-card-list">
          {filteredValueRecords.map((record) => (
            <article className={`value-card ${record.tone}`} key={record.id}>
              <div className="capture-card-main buyer-card-main">
                <div className="buyer-identity">
                  <Avatar name={record.buyerName} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{record.buyerName}</h3>
                      <Badge tone={record.tone}>{record.buyerCategory}</Badge>
                    </div>
                    <p>{record.nextBestAction}</p>
                    <div className="recovery-meta">
                      <span>{record.lastPurchaseDate}</span>
                      <span>{record.predictedNextPurchase}</span>
                      <span>{record.returnExchangeRisk} return/exchange risk</span>
                      <span>{record.owner}</span>
                    </div>
                  </div>
                </div>
                <div className="capture-value-stack">
                  <strong>{record.lifetimeValue}</strong>
                  <span>{record.revenueAtRisk} at risk</span>
                </div>
              </div>

              <div className="capture-stat-grid source-stat-grid">
                <div>
                  <span>YTD spend</span>
                  <strong>{record.yearToDateSpend}</strong>
                </div>
                <div>
                  <span>Purchase count</span>
                  <strong>{record.purchaseCount}</strong>
                </div>
                <div>
                  <span>Average order value</span>
                  <strong>{record.averageOrderValue}</strong>
                </div>
                <div>
                  <span>Repeat opportunity</span>
                  <strong>{record.refillRestockOpportunityValue}</strong>
                </div>
                <div>
                  <span>Recovered value</span>
                  <strong>{record.recoveredValue}</strong>
                </div>
                <div>
                  <span>Value flags</span>
                  <strong>{record.valueFlags.join(" / ")}</strong>
                </div>
              </div>

              <div className="capture-actions">
                <button type="button" className="primary-btn">Create recovery action</button>
                <button type="button" className="secondary-btn">Assign owner</button>
                <button type="button" className="secondary-btn">Open buyer profile</button>
                <button type="button" className="secondary-btn">Mark reviewed</button>
                <button type="button" className="secondary-btn">Copy next-best-action template</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RevenuePipeline({ onActivity }: { onActivity: (activity: NewRecoveryActivity) => void }) {
  const [opportunities, setOpportunities] = useState<RevenueOpportunity[]>(revenueOpportunities);
  const [activePipelineFilter, setActivePipelineFilter] = useState<RevenuePipelineFilter>("All");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(revenueOpportunities[0].id);
  const [notice, setNotice] = useState("Revenue opportunities are ready for recovery review.");

  const filteredOpportunities = opportunities.filter((opportunity) =>
    matchesRevenuePipelineFilter(opportunity, activePipelineFilter),
  );
  const selectedOpportunity =
    opportunities.find((opportunity) => opportunity.id === selectedOpportunityId) ??
    filteredOpportunities[0] ??
    opportunities[0];

  const pipelineKpis = useMemo<KPI[]>(() => {
    const openValue = opportunities
      .filter((opportunity) => opportunity.currentStage !== "Lost / Inactive")
      .reduce((total, opportunity) => total + moneyToNumber(opportunity.estimatedValue), 0);
    const highIntent = opportunities.filter((opportunity) => opportunity.priority === "High" || opportunity.priority === "Critical").length;
    const pendingValue = opportunities
      .filter((opportunity) => opportunity.currentStage === "Payment Pending")
      .reduce((total, opportunity) => total + moneyToNumber(opportunity.estimatedValue), 0);
    const followUps = opportunities.filter((opportunity) => opportunity.currentStage === "Follow-up Needed").length;
    const repeat = opportunities.filter((opportunity) => opportunity.currentStage === "Repeat Opportunity").length;
    const atRisk = opportunities.filter((opportunity) => opportunity.dueStatus === "Overdue").length;

    return [
      { label: "Open Pipeline Value", value: formatCompactMoney(openValue), caption: "Open recovery value", tone: "rose" },
      { label: "High-Intent Opportunities", value: `${highIntent}`, caption: "Closest to revenue", tone: "cyan" },
      { label: "Payment Pending Value", value: formatCompactMoney(pendingValue), caption: "Needs payment recovery", tone: "amber" },
      { label: "Follow-ups Needed", value: `${followUps}`, caption: "Follow-up leak watch", tone: "rose" },
      { label: "Repeat Opportunities", value: `${repeat}`, caption: "Repeat revenue timing", tone: "emerald" },
      { label: "At-Risk Pipeline", value: `${atRisk}`, caption: "Overdue next actions", tone: "amber" },
    ];
  }, [opportunities]);

  function recordPipelineActivity(opportunity: RevenueOpportunity, title: string, status: string, nextAction = opportunity.nextAction) {
    onActivity({
      category: opportunity.currentStage === "Payment Pending" ? "Payments" : "Inquiries",
      title,
      description: `${opportunity.buyerName}'s ${opportunity.productContext.toLowerCase()} moved inside revenue recovery.`,
      impactBadge: `${opportunity.revenueAtRisk} at risk`,
      relatedRecord: `${opportunity.source} - ${opportunity.id}`,
      owner: opportunity.owner === "Unassigned" ? undefined : opportunity.owner,
      status,
      nextAction,
      tone: opportunity.tone,
    });
  }

  function updateSelectedOpportunity(updates: Partial<RevenueOpportunity>, title: string, status: string) {
    const current = selectedOpportunity;
    const next = { ...current, ...updates };

    setOpportunities((records) =>
      records.map((opportunity) => (opportunity.id === current.id ? next : opportunity)),
    );
    setNotice(`${title} for ${current.buyerName}.`);
    recordPipelineActivity(next, title, status, next.nextAction);
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {pipelineKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Revenue pipeline filters">
          {revenuePipelineFilters.map((filter) => (
            <button
              className={`queue-tab ${activePipelineFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActivePipelineFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredOpportunities.length} opportunities</Badge>
      </section>

      <section className="recovery-workspace capture-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Revenue Pipeline</h2>
              <p>Open revenue opportunities grouped by recovery stage, owner, value, and next best action.</p>
            </div>
            <Badge tone="rose">Open value</Badge>
          </div>

          <div className="revenue-stage-list">
            {revenueStages.map((stage) => {
              const stageItems = filteredOpportunities.filter((opportunity) => opportunity.currentStage === stage);
              if (stageItems.length === 0) return null;

              return (
                <div className="revenue-stage-group" key={stage}>
                  <div className="stage-heading">
                    <h3>{stage}</h3>
                    <span>{stageItems.length} open</span>
                  </div>
                  <div className="capture-card-list">
                    {stageItems.map((opportunity) => (
                      <button
                        className={`pipeline-card inquiry-button ${opportunity.tone} ${
                          selectedOpportunity.id === opportunity.id ? "selected" : ""
                        }`}
                        key={opportunity.id}
                        onClick={() => setSelectedOpportunityId(opportunity.id)}
                        type="button"
                      >
                        <div className="capture-card-main buyer-card-main">
                          <div className="buyer-identity">
                            <Avatar name={opportunity.buyerName} />
                            <div>
                              <div className="recovery-row-title">
                                <h3>{opportunity.buyerName}</h3>
                                <Badge tone={opportunity.tone}>{opportunity.priority}</Badge>
                              </div>
                              <p>{opportunity.productContext}</p>
                              <div className="recovery-meta">
                                <span>{opportunity.industryType}</span>
                                <span>{opportunity.source}</span>
                                <span>{opportunity.owner}</span>
                                <span>{opportunity.dueStatus}</span>
                              </div>
                            </div>
                          </div>
                          <div className="capture-value-stack">
                            <strong>{opportunity.estimatedValue}</strong>
                            <span>{opportunity.revenueAtRisk} at risk</span>
                          </div>
                        </div>
                        <p className="queue-next-action">{opportunity.nextAction}</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedOpportunity.buyerName} />
              <div>
                <h2>{selectedOpportunity.buyerName}</h2>
                <p>{selectedOpportunity.productContext}</p>
              </div>
            </div>
            <strong>{selectedOpportunity.revenueAtRisk}</strong>
          </div>

          <div className="detail-grid">
            <div>
              <span>Current stage</span>
              <strong>{selectedOpportunity.currentStage}</strong>
            </div>
            <div>
              <span>Estimated value</span>
              <strong>{selectedOpportunity.estimatedValue}</strong>
            </div>
            <div>
              <span>Owner</span>
              <strong>{selectedOpportunity.owner}</strong>
            </div>
            <div>
              <span>Due status</span>
              <strong>{selectedOpportunity.dueStatus}</strong>
            </div>
            <div>
              <span>Last activity</span>
              <strong>{selectedOpportunity.lastActivity}</strong>
            </div>
            <div>
              <span>Source</span>
              <strong>{selectedOpportunity.source}</strong>
            </div>
          </div>

          <div className="detail-callout">
            <span>Recommended message/action</span>
            <p>{selectedOpportunity.recommendedMessage}</p>
          </div>

          <p className="detail-notice">{notice}</p>

          <div className="detail-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                updateSelectedOpportunity(
                  {
                    currentStage: getNextRevenueStage(selectedOpportunity.currentStage),
                    lastAction: "Stage moved",
                  },
                  "Stage moved",
                  "Moved",
                )
              }
            >
              Move stage
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedOpportunity(
                  {
                    owner: selectedOpportunity.owner === "Unassigned" ? "Amara Shah" : selectedOpportunity.owner,
                    lastAction: "Owner assigned",
                  },
                  "Owner assigned",
                  "Owner assigned",
                )
              }
            >
              Assign owner
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedOpportunity(
                  {
                    currentStage: "Follow-up Needed",
                    dueStatus: "Due today",
                    lastAction: "Follow-up created",
                  },
                  "Follow-up created",
                  "Created",
                )
              }
            >
              Create follow-up
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedOpportunity(
                  {
                    currentStage: "Payment Pending",
                    dueStatus: "Due today",
                    lastAction: "Payment marked pending",
                  },
                  "Payment marked pending",
                  "Payment pending",
                )
              }
            >
              Mark payment pending
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedOpportunity(
                  {
                    currentStage: "Order Confirmed",
                    revenueAtRisk: "$0",
                    dueStatus: "Monitoring",
                    lastAction: "Marked recovered",
                  },
                  "Marked recovered",
                  "Recovered",
                )
              }
            >
              Mark recovered
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedOpportunity(
                  {
                    currentStage: "Lost / Inactive",
                    dueStatus: "Lost",
                    lastAction: "Marked lost",
                  },
                  "Marked lost",
                  "Lost",
                )
              }
            >
              Mark lost
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function FollowUpRecovery({ onActivity }: { onActivity: (activity: NewRecoveryActivity) => void }) {
  const [followUps, setFollowUps] = useState<FollowUpRecoveryItem[]>(followUpRecoveryItems);
  const [activeFollowUpFilter, setActiveFollowUpFilter] = useState<FollowUpRecoveryFilter>("All");
  const [selectedFollowUpId, setSelectedFollowUpId] = useState(followUpRecoveryItems[0].id);
  const [notice, setNotice] = useState("Select a follow-up leak to review the next recovery touch.");

  const filteredFollowUps = followUps.filter((item) => matchesFollowUpRecoveryFilter(item, activeFollowUpFilter));
  const selectedFollowUp =
    followUps.find((item) => item.id === selectedFollowUpId) ?? filteredFollowUps[0] ?? followUps[0];

  const followUpKpis = useMemo<KPI[]>(() => {
    const dueToday = followUps.filter((item) => item.dueStatus === "Due today").length;
    const overdue = followUps.filter((item) => item.dueStatus === "Overdue").length;
    const highValue = followUps.filter((item) => moneyToNumber(item.revenueAtRisk) >= 500).length;
    const noReply = followUps.filter((item) => item.buyerResponseStatus === "No reply yet").length;
    const unassigned = followUps.filter((item) => item.owner === "Unassigned").length;
    const risk = followUps.reduce((total, item) => total + moneyToNumber(item.revenueAtRisk), 0);

    return [
      { label: "Follow-ups Due Today", value: `${dueToday}`, caption: "Needs next touch", tone: "cyan" },
      { label: "Overdue Follow-ups", value: `${overdue}`, caption: "Follow-up leakage", tone: "rose" },
      { label: "High-Value Follow-ups", value: `${highValue}`, caption: "Priority buyers", tone: "amber" },
      { label: "No Reply Yet", value: `${noReply}`, caption: "First reply watch", tone: "rose" },
      { label: "Unassigned Follow-ups", value: `${unassigned}`, caption: "Owner needed", tone: "amber" },
      { label: "Follow-up Revenue At Risk", value: formatCompactMoney(risk), caption: "Open follow-up value", tone: "rose" },
    ];
  }, [followUps]);

  function recordFollowUpActivity(item: FollowUpRecoveryItem, title: string, status: string) {
    onActivity({
      category: item.followUpType === "Payment reminder" ? "Payments" : "Team Actions",
      title,
      description: `${item.buyerName}'s ${item.followUpType.toLowerCase()} was updated for ${item.productContext}.`,
      impactBadge: `${item.revenueAtRisk} at risk`,
      relatedRecord: `${item.source} - ${item.id}`,
      owner: item.owner === "Unassigned" ? undefined : item.owner,
      status,
      nextAction: item.recommendedNextAction,
      tone: item.tone,
    });
  }

  function updateSelectedFollowUp(updates: Partial<FollowUpRecoveryItem>, title: string, status: string) {
    const current = selectedFollowUp;
    const next = { ...current, ...updates };
    setFollowUps((items) => items.map((item) => (item.id === current.id ? next : item)));
    setNotice(`${title} for ${current.buyerName}.`);
    recordFollowUpActivity(next, title, status);
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {followUpKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Follow-up recovery filters">
          {followUpRecoveryFilters.map((filter) => (
            <button
              className={`queue-tab ${activeFollowUpFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveFollowUpFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredFollowUps.length} follow-ups</Badge>
      </section>

      <section className="recovery-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Follow-up Recovery</h2>
              <p>Buyers who need a reply, reminder, refill prompt, restock notice, or post-purchase touch.</p>
            </div>
            <Badge tone="rose">Follow-up leak</Badge>
          </div>

          <div className="recovery-list">
            {filteredFollowUps.map((item) => (
              <button
                className={`follow-up-card recovery-task-card ${item.tone} ${
                  selectedFollowUp.id === item.id ? "selected" : ""
                }`}
                key={item.id}
                onClick={() => setSelectedFollowUpId(item.id)}
                type="button"
              >
                <div className="recovery-task-main">
                  <Avatar name={item.buyerName} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{item.buyerName}</h3>
                      <Badge tone={item.tone}>{item.followUpType}</Badge>
                    </div>
                    <p>{item.productContext}</p>
                    <div className="recovery-meta">
                      <span>{item.source}</span>
                      <span>{item.owner}</span>
                      <span>{item.dueStatus}</span>
                      <span>{item.lastContact}</span>
                      <span>{item.attemptCount} attempts</span>
                      <span>{item.buyerResponseStatus}</span>
                    </div>
                    <small className="queue-next-action">{item.recommendedNextAction}</small>
                  </div>
                </div>
                <div className="task-money">
                  <strong>{item.revenueAtRisk}</strong>
                  <span>at risk</span>
                </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedFollowUp.buyerName} />
              <div>
                <h2>{selectedFollowUp.buyerName}</h2>
                <p>{selectedFollowUp.productContext}</p>
              </div>
            </div>
            <strong>{selectedFollowUp.revenueAtRisk}</strong>
          </div>

          <div className="detail-grid">
            <div>
              <span>Follow-up type</span>
              <strong>{selectedFollowUp.followUpType}</strong>
            </div>
            <div>
              <span>Owner</span>
              <strong>{selectedFollowUp.owner}</strong>
            </div>
            <div>
              <span>Due status</span>
              <strong>{selectedFollowUp.dueStatus}</strong>
            </div>
            <div>
              <span>Last contact</span>
              <strong>{selectedFollowUp.lastContact}</strong>
            </div>
            <div>
              <span>Attempts</span>
              <strong>{selectedFollowUp.attemptCount}</strong>
            </div>
            <div>
              <span>Buyer response</span>
              <strong>{selectedFollowUp.buyerResponseStatus}</strong>
            </div>
          </div>

          <div className="template-box">
            <div>
              <span>Message template</span>
              <button
                type="button"
                onClick={() =>
                  updateSelectedFollowUp(
                    { templateCopied: true },
                    "Template copied",
                    "Template copied",
                  )
                }
              >
                Copy Template
              </button>
            </div>
            <p>{selectedFollowUp.messageTemplate}</p>
          </div>

          <div className="detail-callout">
            <span>Internal recovery note</span>
            <p>{selectedFollowUp.internalRecoveryNote}</p>
          </div>

          <p className="detail-notice">{notice}</p>

          <div className="detail-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                updateSelectedFollowUp(
                  {
                    buyerResponseStatus: "Follow-up sent",
                    dueStatus: "Monitoring",
                    attemptCount: selectedFollowUp.attemptCount + 1,
                  },
                  "Marked followed up",
                  "Sent",
                )
              }
            >
              Mark followed up
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedFollowUp({ dueStatus: "Snoozed" }, "Snoozed", "Snoozed")}
            >
              Snooze
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedFollowUp(
                  { owner: selectedFollowUp.owner === "Unassigned" ? "Amara Shah" : selectedFollowUp.owner },
                  "Reassigned",
                  "Owner assigned",
                )
              }
            >
              Reassign
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedFollowUp({ buyerResponseStatus: "No response" }, "Marked no response", "No response")}
            >
              Mark no response
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedFollowUp({ followUpType: "Payment reminder" }, "Payment recovery case created", "Created")}
            >
              Create payment recovery case
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function PaymentRecovery({ onActivity }: { onActivity: (activity: NewRecoveryActivity) => void }) {
  const [payments, setPayments] = useState<PaymentRecoveryItem[]>(paymentRecoveryItems);
  const [activePaymentFilter, setActivePaymentFilter] = useState<PaymentRecoveryFilter>("All");
  const [selectedPaymentId, setSelectedPaymentId] = useState(paymentRecoveryItems[0].id);
  const [notice, setNotice] = useState("Select a pending payment to review the recovery action.");

  const filteredPayments = payments.filter((item) => matchesPaymentRecoveryFilter(item, activePaymentFilter));
  const selectedPayment =
    payments.find((item) => item.id === selectedPaymentId) ?? filteredPayments[0] ?? payments[0];

  const paymentKpis = useMemo<KPI[]>(() => {
    const pendingValue = payments
      .filter((item) => item.paymentStatus !== "Recovered" && item.paymentStatus !== "Cancelled / Lost")
      .reduce((total, item) => total + moneyToNumber(item.paymentAmount), 0);
    const pendingBuyers = payments.filter((item) => item.paymentStatus !== "Recovered" && item.paymentStatus !== "Cancelled / Lost").length;
    const overdue = payments.filter((item) => item.dueStatus === "Overdue" || item.paymentStatus === "Overdue").length;
    const remindersDue = payments.filter((item) => item.paymentStatus === "Pending" || item.paymentStatus === "Overdue").length;
    const recovered = payments.reduce((total, item) => total + moneyToNumber(item.recoveredAmount), 0);
    const failedPartial = payments.filter((item) => item.paymentStatus === "Failed payment" || item.paymentStatus === "Partial payment").length;

    return [
      { label: "Pending Payment Value", value: formatCompactMoney(pendingValue), caption: "Unpaid recovery value", tone: "amber" },
      { label: "Buyers Pending Payment", value: `${pendingBuyers}`, caption: "Said yes, not paid", tone: "rose" },
      { label: "Overdue Payments", value: `${overdue}`, caption: "Needs reminder", tone: "rose" },
      { label: "Payment Reminders Due", value: `${remindersDue}`, caption: "Reminder queue", tone: "cyan" },
      { label: "Recovered Payments This Month", value: formatCompactMoney(recovered), caption: "Marked recovered here", tone: "emerald" },
      { label: "Failed / Partial Payments", value: `${failedPartial}`, caption: "Needs payment fix", tone: "amber" },
    ];
  }, [payments]);

  function recordPaymentActivity(item: PaymentRecoveryItem, title: string, status: string) {
    onActivity({
      category: "Payments",
      title,
      description: `${item.buyerName}'s ${item.productContext.toLowerCase()} payment recovery was updated.`,
      impactBadge: `${item.paymentAmount} payment value`,
      relatedRecord: `${item.source} - ${item.id}`,
      owner: item.owner === "Unassigned" ? undefined : item.owner,
      status,
      nextAction: item.recommendedNextAction,
      tone: item.tone,
    });
  }

  function updateSelectedPayment(updates: Partial<PaymentRecoveryItem>, title: string, status: string) {
    const current = selectedPayment;
    const next = { ...current, ...updates };
    setPayments((items) => items.map((item) => (item.id === current.id ? next : item)));
    setNotice(`${title} for ${current.buyerName}.`);
    recordPaymentActivity(next, title, status);
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {paymentKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Payment recovery filters">
          {paymentRecoveryFilters.map((filter) => (
            <button
              className={`queue-tab ${activePaymentFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActivePaymentFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredPayments.length} payment records</Badge>
      </section>

      <section className="recovery-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Payment Recovery</h2>
              <p>Buyers who said yes but have not completed payment, deposit, COD confirmation, or invoice balance.</p>
            </div>
            <Badge tone="amber">Payment pending</Badge>
          </div>

          <div className="recovery-list">
            {filteredPayments.map((item) => (
              <button
                className={`payment-card recovery-task-card ${item.tone} ${
                  selectedPayment.id === item.id ? "selected" : ""
                }`}
                key={item.id}
                onClick={() => setSelectedPaymentId(item.id)}
                type="button"
              >
                <div className="recovery-task-main">
                  <Avatar name={item.buyerName} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{item.buyerName}</h3>
                      <Badge tone={item.tone}>{item.paymentStatus}</Badge>
                    </div>
                    <p>{item.productContext}</p>
                    <div className="recovery-meta">
                      <span>{item.source}</span>
                      <span>{item.paymentMethod}</span>
                      <span>{item.owner}</span>
                      <span>{item.dueStatus}</span>
                      <span>{item.lastReminder}</span>
                      <span>{item.reminderCount} reminders</span>
                    </div>
                    <small className="queue-next-action">{item.recommendedNextAction}</small>
                  </div>
                </div>
                <div className="task-money">
                  <strong>{item.paymentAmount}</strong>
                  <span>{item.riskLevel}</span>
                </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedPayment.buyerName} />
              <div>
                <h2>{selectedPayment.buyerName}</h2>
                <p>{selectedPayment.productContext}</p>
              </div>
            </div>
            <strong>{selectedPayment.paymentAmount}</strong>
          </div>

          <div className="detail-grid">
            <div>
              <span>Payment status</span>
              <strong>{selectedPayment.paymentStatus}</strong>
            </div>
            <div>
              <span>Recovered amount</span>
              <strong>{selectedPayment.recoveredAmount}</strong>
            </div>
            <div>
              <span>Payment method</span>
              <strong>{selectedPayment.paymentMethod}</strong>
            </div>
            <div>
              <span>Owner</span>
              <strong>{selectedPayment.owner}</strong>
            </div>
            <div>
              <span>Last reminder</span>
              <strong>{selectedPayment.lastReminder}</strong>
            </div>
            <div>
              <span>Reminder count</span>
              <strong>{selectedPayment.reminderCount}</strong>
            </div>
          </div>

          <div className="template-box">
            <div>
              <span>Payment reminder template</span>
              <button type="button" onClick={() => setNotice(`Payment template copied for ${selectedPayment.buyerName}.`)}>
                Copy Template
              </button>
            </div>
            <p>{selectedPayment.paymentTemplate}</p>
          </div>

          <p className="detail-notice">{notice}</p>

          <div className="detail-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                updateSelectedPayment(
                  {
                    paymentStatus: "Reminder sent",
                    lastReminder: "Just now",
                    reminderCount: selectedPayment.reminderCount + 1,
                  },
                  "Reminder sent",
                  "Sent",
                )
              }
            >
              Send reminder
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedPayment(
                  {
                    paymentStatus: "Recovered",
                    dueStatus: "Recovered",
                    recoveredAmount: selectedPayment.paymentAmount,
                  },
                  "Marked recovered",
                  "Recovered",
                )
              }
            >
              Mark recovered
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedPayment({ paymentStatus: "Failed payment" }, "Marked failed", "Failed")}
            >
              Mark failed
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedPayment({ dueStatus: "Due soon" }, "Payment reminder snoozed", "Snoozed")}
            >
              Snooze payment reminder
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedPayment(
                  { owner: selectedPayment.owner === "Unassigned" ? "Tessa Nguyen" : selectedPayment.owner },
                  "Owner reassigned",
                  "Owner assigned",
                )
              }
            >
              Reassign owner
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedPayment({ paymentStatus: "Cancelled / Lost", dueStatus: "Lost" }, "Moved to lost", "Lost")}
            >
              Move to lost
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function RecoveredRevenue() {
  const [activeRecoveredFilter, setActiveRecoveredFilter] = useState<RecoveredRevenueFilter>("All");
  const filteredRecovered = recoveredRevenueItems.filter((item) =>
    matchesRecoveredRevenueFilter(item, activeRecoveredFilter),
  );

  const recoveredKpis = useMemo<KPI[]>(() => {
    const recoveredThisMonth = recoveredRevenueItems.reduce((total, item) => total + moneyToNumber(item.recoveredAmount), 0);
    const payments = recoveredRevenueItems
      .filter((item) => item.recoveryType === "Payment recovered")
      .reduce((total, item) => total + moneyToNumber(item.recoveredAmount), 0);
    const followUps = recoveredRevenueItems
      .filter((item) => item.recoveryType === "Follow-up converted")
      .reduce((total, item) => total + moneyToNumber(item.recoveredAmount), 0);
    const repeat = recoveredRevenueItems
      .filter((item) => item.recoveryType.includes("recovered") && item.recoveryType !== "Payment recovered" && item.recoveryType !== "Follow-up converted")
      .reduce((total, item) => total + moneyToNumber(item.recoveredAmount), 0);
    const postPurchase = recoveredRevenueItems
      .filter((item) => item.recoveryType === "Post-purchase upsell" || item.recoveryType === "Referral/UGC influenced sale")
      .reduce((total, item) => total + moneyToNumber(item.recoveredAmount), 0);
    const originalRisk = recoveredRevenueItems.reduce((total, item) => total + moneyToNumber(item.originalRevenueAtRisk), 0);
    const recoveryRate = originalRisk > 0 ? Math.round((recoveredThisMonth / originalRisk) * 100) : 0;

    return [
      { label: "Recovered This Month", value: formatCompactMoney(recoveredThisMonth), caption: "Visible recovered cases", tone: "emerald" },
      { label: "Recovered Payments", value: formatCompactMoney(payments), caption: "Payment leak recovered", tone: "amber" },
      { label: "Recovered Follow-ups", value: formatCompactMoney(followUps), caption: "Follow-up converted", tone: "rose" },
      { label: "Repeat Revenue Recovered", value: formatCompactMoney(repeat), caption: "Refill, restock, repeat", tone: "emerald" },
      { label: "Post-Purchase Revenue", value: formatCompactMoney(postPurchase), caption: "Review and referral value", tone: "cyan" },
      { label: "Recovery Rate", value: `${recoveryRate}%`, caption: "Recovered vs original risk", tone: "cyan" },
    ];
  }, []);

  const bySource = Array.from(
    recoveredRevenueItems.reduce((map, item) => {
      map.set(item.source, (map.get(item.source) ?? 0) + moneyToNumber(item.recoveredAmount));
      return map;
    }, new Map<string, number>()),
  );
  const byOwner = Array.from(
    recoveredRevenueItems.reduce((map, item) => {
      map.set(item.owner, (map.get(item.owner) ?? 0) + moneyToNumber(item.recoveredAmount));
      return map;
    }, new Map<string, number>()),
  );
  const byLeakType = Array.from(
    recoveredRevenueItems.reduce((map, item) => {
      map.set(item.leakType, (map.get(item.leakType) ?? 0) + moneyToNumber(item.recoveredAmount));
      return map;
    }, new Map<string, number>()),
  );

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {recoveredKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Recovered revenue filters">
          {recoveredRevenueFilters.map((filter) => (
            <button
              className={`queue-tab ${activeRecoveredFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveRecoveredFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredRecovered.length} recovered cases</Badge>
      </section>

      <section className="summary-breakdown-grid">
        <article className="summary-breakdown-card">
          <h3>Recovered by Source</h3>
          {bySource.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{formatCompactMoney(value)}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Recovered by Owner</h3>
          {byOwner.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{formatCompactMoney(value)}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Recovered by Leak Type</h3>
          {byLeakType.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{formatCompactMoney(value)}</strong>
            </div>
          ))}
        </article>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Recent Recovered Cases</h2>
            <p>Recovered revenue by leak type, source, owner, action, and related recovery case.</p>
          </div>
          <Badge tone="emerald">Recovered revenue proof</Badge>
        </div>

        <div className="capture-card-list">
          {filteredRecovered.map((item) => (
            <article className={`recovered-card ${item.tone}`} key={item.id}>
              <div className="capture-card-main buyer-card-main">
                <div className="buyer-identity">
                  <Avatar name={item.buyerName} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{item.buyerName}</h3>
                      <Badge tone={item.tone}>{item.recoveryType}</Badge>
                    </div>
                    <p>{item.actionThatRecoveredIt}</p>
                    <div className="recovery-meta">
                      <span>{item.source}</span>
                      <span>{item.owner}</span>
                      <span>{item.dateRecovered}</span>
                      <span>{item.timeToRecovery}</span>
                      <span>{item.relatedCase}</span>
                    </div>
                  </div>
                </div>
                <div className="capture-value-stack">
                  <strong>{item.recoveredAmount}</strong>
                  <span>{item.originalRevenueAtRisk} original risk</span>
                </div>
              </div>

              <div className="detail-callout source-fix-callout">
                <span>Notes</span>
                <p>{item.notes}</p>
              </div>

              <div className="capture-actions">
                <button type="button" className="primary-btn">Open related case</button>
                <button type="button" className="secondary-btn">Export recovered report</button>
                <button type="button" className="secondary-btn">Add recovery note</button>
                <button type="button" className="secondary-btn">Mark reviewed</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function OrderRiskMonitor() {
  const [orderRisks, setOrderRisks] = useState<OrderRiskItem[]>(orderRiskItems);
  const [activeOrderRiskFilter, setActiveOrderRiskFilter] = useState<OrderRiskFilter>("All");
  const [selectedOrderRiskId, setSelectedOrderRiskId] = useState(orderRiskItems[0].id);
  const [notice, setNotice] = useState("Select an order risk to review the next required action.");

  const filteredOrderRisks = orderRisks.filter((item) => matchesOrderRiskFilter(item, activeOrderRiskFilter));
  const selectedOrderRisk =
    orderRisks.find((item) => item.id === selectedOrderRiskId) ?? filteredOrderRisks[0] ?? orderRisks[0];

  const orderRiskKpis = useMemo<KPI[]>(() => {
    const activeRisks = orderRisks.filter((item) => !item.resolved);
    const riskValue = activeRisks.reduce((total, item) => total + moneyToNumber(item.orderValue), 0);
    const addressDelivery = activeRisks.filter((item) => item.riskType === "Address Issue" || item.riskType === "Delivery Delay").length;
    const paymentMismatch = activeRisks.filter((item) => item.riskType === "Payment Issue").length;
    const returnRisk = activeRisks.filter((item) => item.riskType === "Return / Exchange Risk").length;
    const unassigned = activeRisks.filter((item) => item.owner === "Unassigned").length;

    return [
      { label: "Orders At Risk", value: `${activeRisks.length}`, caption: "Needs next required action", tone: "rose" },
      { label: "Revenue In Order Risk", value: formatCompactMoney(riskValue), caption: "Revenue to protect", tone: "amber" },
      { label: "Address / Delivery Issues", value: `${addressDelivery}`, caption: "Delivery leak watch", tone: "cyan" },
      { label: "Payment-Order Mismatches", value: `${paymentMismatch}`, caption: "Payment/order risk", tone: "rose" },
      { label: "Return / Exchange Risk", value: `${returnRisk}`, caption: "Experience recovery", tone: "amber" },
      { label: "Unassigned Order Actions", value: `${unassigned}`, caption: "Owner needed", tone: "rose" },
    ];
  }, [orderRisks]);

  function updateSelectedOrderRisk(updates: Partial<OrderRiskItem>, message: string) {
    const current = selectedOrderRisk;
    setOrderRisks((items) => items.map((item) => (item.id === current.id ? { ...item, ...updates } : item)));
    setNotice(`${message} for ${current.buyerName}.`);
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {orderRiskKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Order risk filters">
          {orderRiskFilters.map((filter) => (
            <button
              className={`queue-tab ${activeOrderRiskFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveOrderRiskFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredOrderRisks.length} order risks</Badge>
      </section>

      <section className="recovery-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Order Risk Monitor</h2>
              <p>Orders that could delay revenue, create complaints, trigger returns, or block post-purchase recovery.</p>
            </div>
            <Badge tone="rose">Order risk</Badge>
          </div>

          <div className="recovery-list">
            {filteredOrderRisks.map((item) => (
              <button
                className={`order-risk-card recovery-task-card ${item.tone} ${
                  selectedOrderRisk.id === item.id ? "selected" : ""
                }`}
                key={item.id}
                onClick={() => setSelectedOrderRiskId(item.id)}
                type="button"
              >
                <div className="recovery-task-main">
                  <Avatar name={item.buyerName} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{item.buyerName}</h3>
                      <Badge tone={item.tone}>{item.riskType}</Badge>
                    </div>
                    <p>{item.orderContext}</p>
                    <div className="recovery-meta">
                      <span>{item.industryType}</span>
                      <span>{item.paymentStatus}</span>
                      <span>{item.deliveryStatus}</span>
                      <span>{item.source}</span>
                      <span>{item.owner}</span>
                      <span>{item.dueStatus}</span>
                    </div>
                    <small className="queue-next-action">{item.nextRequiredAction}</small>
                  </div>
                </div>
                <div className="task-money">
                  <strong>{item.orderValue}</strong>
                  <span>{item.priority}</span>
                </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedOrderRisk.buyerName} />
              <div>
                <h2>{selectedOrderRisk.buyerName}</h2>
                <p>{selectedOrderRisk.orderContext}</p>
              </div>
            </div>
            <strong>{selectedOrderRisk.orderValue}</strong>
          </div>

          <div className="detail-grid">
            <div>
              <span>Payment status</span>
              <strong>{selectedOrderRisk.paymentStatus}</strong>
            </div>
            <div>
              <span>Delivery status</span>
              <strong>{selectedOrderRisk.deliveryStatus}</strong>
            </div>
            <div>
              <span>Risk type</span>
              <strong>{selectedOrderRisk.riskType}</strong>
            </div>
            <div>
              <span>Owner</span>
              <strong>{selectedOrderRisk.owner}</strong>
            </div>
            <div>
              <span>Last update</span>
              <strong>{selectedOrderRisk.lastUpdate}</strong>
            </div>
            <div>
              <span>Due status</span>
              <strong>{selectedOrderRisk.dueStatus}</strong>
            </div>
          </div>

          <div className="detail-callout">
            <span>Next required action</span>
            <p>{selectedOrderRisk.nextRequiredAction}</p>
          </div>

          <div className="template-box">
            <div>
              <span>Suggested buyer message</span>
              <button type="button" onClick={() => setNotice(`Message copied for ${selectedOrderRisk.buyerName}.`)}>
                Copy Message
              </button>
            </div>
            <p>{selectedOrderRisk.suggestedMessage}</p>
          </div>

          <div className="detail-callout">
            <span>Internal order note</span>
            <p>{selectedOrderRisk.internalOrderNote}</p>
          </div>

          <p className="detail-notice">{notice}</p>

          <div className="detail-actions">
            <button type="button" className="primary-btn" onClick={() => updateSelectedOrderRisk({ resolved: true, dueStatus: "Monitoring" }, "Order marked resolved")}>
              Mark order resolved
            </button>
            <button type="button" className="secondary-btn" onClick={() => updateSelectedOrderRisk({ owner: selectedOrderRisk.owner === "Unassigned" ? "Tessa Nguyen" : selectedOrderRisk.owner }, "Owner assigned")}>
              Assign owner
            </button>
            <button type="button" className="secondary-btn">Create follow-up</button>
            <button type="button" className="secondary-btn" onClick={() => updateSelectedOrderRisk({ riskType: "Return / Exchange Risk" }, "Return risk marked")}>
              Mark return risk
            </button>
            <button type="button" className="secondary-btn">Move to post-purchase</button>
            <button type="button" className="secondary-btn">Escalate to operations</button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function DeliveryFollowUp() {
  const [deliveryItems, setDeliveryItems] = useState<DeliveryFollowUpItem[]>(deliveryFollowUpItems);
  const [activeDeliveryFilter, setActiveDeliveryFilter] = useState<DeliveryFollowUpFilter>("All");
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(deliveryFollowUpItems[0].id);
  const [notice, setNotice] = useState("Select a delivery follow-up to review the post-purchase step.");

  const filteredDeliveryItems = deliveryItems.filter((item) =>
    matchesDeliveryFollowUpFilter(item, activeDeliveryFilter),
  );
  const selectedDelivery =
    deliveryItems.find((item) => item.id === selectedDeliveryId) ?? filteredDeliveryItems[0] ?? deliveryItems[0];

  const deliveryKpis = useMemo<KPI[]>(() => {
    const needingFollowUp = deliveryItems.filter((item) => item.postDeliveryStage !== "Completed").length;
    const deliveredToday = deliveryItems.filter((item) => item.deliveryTiming.toLowerCase().includes("today")).length;
    const delayed = deliveryItems.filter((item) => item.postDeliveryStage === "Delivery delayed").length;
    const satisfaction = deliveryItems.filter((item) => item.postDeliveryStage === "Satisfaction check due").length;
    const secondPurchase = deliveryItems.filter((item) => item.postDeliveryStage === "Second purchase prompt").length;
    const protectedValue = deliveryItems.reduce((total, item) => total + moneyToNumber(item.orderValue), 0);

    return [
      { label: "Deliveries Needing Follow-up", value: `${needingFollowUp}`, caption: "Open post-purchase actions", tone: "rose" },
      { label: "Delivered Today", value: `${deliveredToday}`, caption: "Fresh satisfaction checks", tone: "cyan" },
      { label: "Delayed Deliveries", value: `${delayed}`, caption: "Delivery issue recovery", tone: "amber" },
      { label: "Satisfaction Checks Due", value: `${satisfaction}`, caption: "Protect buyer experience", tone: "rose" },
      { label: "Second-Purchase Prompts", value: `${secondPurchase}`, caption: "Repeat revenue timing", tone: "emerald" },
      { label: "Delivery Revenue Protected", value: formatCompactMoney(protectedValue), caption: "Orders under follow-up", tone: "emerald" },
    ];
  }, [deliveryItems]);

  function updateSelectedDelivery(updates: Partial<DeliveryFollowUpItem>, message: string) {
    const current = selectedDelivery;
    setDeliveryItems((items) => items.map((item) => (item.id === current.id ? { ...item, ...updates } : item)));
    setNotice(`${message} for ${current.buyerName}.`);
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {deliveryKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Delivery follow-up filters">
          {deliveryFollowUpFilters.map((filter) => (
            <button
              className={`queue-tab ${activeDeliveryFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveDeliveryFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredDeliveryItems.length} delivery follow-ups</Badge>
      </section>

      <section className="recovery-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Delivery Follow-up</h2>
              <p>Turn delivery into satisfaction, issue recovery, reviews, referrals, UGC, and repeat-purchase timing.</p>
            </div>
            <Badge tone="emerald">Post-purchase recovery</Badge>
          </div>

          <div className="recovery-list">
            {filteredDeliveryItems.map((item) => (
              <button
                className={`delivery-card recovery-task-card ${item.tone} ${
                  selectedDelivery.id === item.id ? "selected" : ""
                }`}
                key={item.id}
                onClick={() => setSelectedDeliveryId(item.id)}
                type="button"
              >
                <div className="recovery-task-main">
                  <Avatar name={item.buyerName} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{item.buyerName}</h3>
                      <Badge tone={item.tone}>{item.postDeliveryStage}</Badge>
                    </div>
                    <p>{item.orderContext}</p>
                    <div className="recovery-meta">
                      <span>{item.deliveryStatus}</span>
                      <span>{item.deliveryTiming}</span>
                      <span>{item.source}</span>
                      <span>{item.owner}</span>
                      <span>{item.opportunityType}</span>
                    </div>
                    <small className="queue-next-action">{item.nextAction}</small>
                  </div>
                </div>
                <div className="task-money">
                  <strong>{item.orderValue}</strong>
                  <span>protected</span>
                </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedDelivery.buyerName} />
              <div>
                <h2>{selectedDelivery.buyerName}</h2>
                <p>{selectedDelivery.orderContext}</p>
              </div>
            </div>
            <strong>{selectedDelivery.orderValue}</strong>
          </div>

          <div className="detail-grid">
            <div>
              <span>Delivery status</span>
              <strong>{selectedDelivery.deliveryStatus}</strong>
            </div>
            <div>
              <span>Delivery timing</span>
              <strong>{selectedDelivery.deliveryTiming}</strong>
            </div>
            <div>
              <span>Post-delivery stage</span>
              <strong>{selectedDelivery.postDeliveryStage}</strong>
            </div>
            <div>
              <span>Owner</span>
              <strong>{selectedDelivery.owner}</strong>
            </div>
            <div>
              <span>Source</span>
              <strong>{selectedDelivery.source}</strong>
            </div>
            <div>
              <span>Opportunity type</span>
              <strong>{selectedDelivery.opportunityType}</strong>
            </div>
          </div>

          <div className="template-box">
            <div>
              <span>Delivery message template</span>
              <button type="button" onClick={() => setNotice(`Delivery message copied for ${selectedDelivery.buyerName}.`)}>
                Copy Message
              </button>
            </div>
            <p>{selectedDelivery.messageTemplate}</p>
          </div>

          <div className="detail-callout">
            <span>Notes</span>
            <p>{selectedDelivery.notes}</p>
          </div>

          <p className="detail-notice">{notice}</p>

          <div className="detail-actions">
            <button type="button" className="primary-btn" onClick={() => updateSelectedDelivery({ postDeliveryStage: "Completed" }, "Follow-up marked sent")}>
              Mark follow-up sent
            </button>
            <button type="button" className="secondary-btn" onClick={() => updateSelectedDelivery({ postDeliveryStage: "Review request ready" }, "Review request created")}>
              Create review request
            </button>
            <button type="button" className="secondary-btn" onClick={() => updateSelectedDelivery({ postDeliveryStage: "Refill timing started" }, "Refill/restock reminder created")}>
              Create refill/restock reminder
            </button>
            <button type="button" className="secondary-btn" onClick={() => updateSelectedDelivery({ postDeliveryStage: "Issue follow-up needed" }, "Issue escalated")}>
              Escalate issue
            </button>
            <button type="button" className="secondary-btn" onClick={() => updateSelectedDelivery({ postDeliveryStage: "Completed" }, "Delivery follow-up completed")}>
              Mark completed
            </button>
            <button type="button" className="secondary-btn" onClick={() => updateSelectedDelivery({ owner: selectedDelivery.owner === "Unassigned" ? "Luis Park" : selectedDelivery.owner }, "Owner reassigned")}>
              Reassign owner
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function ReviewsReferralsUGC() {
  const [activePostPurchaseFilter, setActivePostPurchaseFilter] = useState<PostPurchaseFilter>("All");
  const filteredOpportunities = postPurchaseOpportunities.filter((item) =>
    matchesPostPurchaseFilter(item, activePostPurchaseFilter),
  );

  const postPurchaseKpis = useMemo<KPI[]>(() => {
    const reviewDue = postPurchaseOpportunities.filter((item) => item.opportunityType.includes("Review") || item.opportunityType.includes("feedback")).length;
    const referrals = postPurchaseOpportunities.filter((item) => item.opportunityType.includes("Referral") || item.opportunityType.includes("referral")).length;
    const ugc = postPurchaseOpportunities.filter((item) => item.opportunityType.includes("UGC") || item.opportunityType.includes("content") || item.opportunityType.includes("photo")).length;
    const opportunityValue = postPurchaseOpportunities.reduce((total, item) => total + moneyToNumber(item.orderValue), 0);
    const sent = postPurchaseOpportunities.filter((item) => item.requestStatus === "Sent" || item.requestStatus === "Completed").length;
    const open = postPurchaseOpportunities.filter((item) => item.requestStatus !== "Completed").length;

    return [
      { label: "Review Requests Due", value: `${reviewDue}`, caption: "Social proof ready", tone: "rose" },
      { label: "Referral Opportunities", value: `${referrals}`, caption: "Referral value open", tone: "emerald" },
      { label: "UGC Candidates", value: `${ugc}`, caption: "Content ask ready", tone: "cyan" },
      { label: "Post-Purchase Revenue Opportunity", value: formatCompactMoney(opportunityValue), caption: "Visible order value", tone: "amber" },
      { label: "Requests Sent This Month", value: `${sent}`, caption: "Post-purchase asks sent", tone: "emerald" },
      { label: "Social Proof Actions Open", value: `${open}`, caption: "Needs owner action", tone: "rose" },
    ];
  }, []);

  const reviewCount = postPurchaseOpportunities.filter((item) => item.opportunityType.includes("Review") || item.opportunityType.includes("feedback")).length;
  const referralCount = postPurchaseOpportunities.filter((item) => item.opportunityType.includes("Referral") || item.opportunityType.includes("referral")).length;
  const ugcCount = postPurchaseOpportunities.filter((item) => item.opportunityType.includes("UGC") || item.opportunityType.includes("content") || item.opportunityType.includes("photo")).length;

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {postPurchaseKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Reviews referrals UGC filters">
          {postPurchaseFilters.map((filter) => (
            <button
              className={`queue-tab ${activePostPurchaseFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActivePostPurchaseFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredOpportunities.length} opportunities</Badge>
      </section>

      <section className="summary-breakdown-grid">
        <article className="summary-breakdown-card">
          <h3>Review Pipeline</h3>
          <div><span>Review opportunities</span><strong>{reviewCount}</strong></div>
          <div><span>Not sent</span><strong>{postPurchaseOpportunities.filter((item) => item.requestStatus === "Not sent").length}</strong></div>
        </article>
        <article className="summary-breakdown-card">
          <h3>Referral Pipeline</h3>
          <div><span>Referral opportunities</span><strong>{referralCount}</strong></div>
          <div><span>Needs follow-up</span><strong>{postPurchaseOpportunities.filter((item) => item.requestStatus === "Needs follow-up").length}</strong></div>
        </article>
        <article className="summary-breakdown-card">
          <h3>UGC Pipeline</h3>
          <div><span>UGC candidates</span><strong>{ugcCount}</strong></div>
          <div><span>VIP buyers</span><strong>{postPurchaseOpportunities.filter((item) => item.buyerStatus.toLowerCase().includes("vip")).length}</strong></div>
        </article>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Reviews / Referrals / UGC</h2>
            <p>Post-purchase value opportunities through reviews, referrals, UGC, styling proof, and second-purchase prompts.</p>
          </div>
          <Badge tone="emerald">Social proof recovery</Badge>
        </div>

        <div className="capture-card-list">
          {filteredOpportunities.map((item) => (
            <article className={`post-purchase-card ${item.tone}`} key={item.id}>
              <div className="capture-card-main buyer-card-main">
                <div className="buyer-identity">
                  <Avatar name={item.buyerName} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{item.buyerName}</h3>
                      <Badge tone={item.tone}>{item.opportunityType}</Badge>
                    </div>
                    <p>{item.orderContext}</p>
                    <div className="recovery-meta">
                      <span>{item.buyerStatus}</span>
                      <span>{item.deliveryDate}</span>
                      <span>{item.source}</span>
                      <span>{item.owner}</span>
                      <span>{item.requestStatus}</span>
                      <span>{item.industryType}</span>
                    </div>
                  </div>
                </div>
                <div className="capture-value-stack">
                  <strong>{item.orderValue}</strong>
                  <span>{item.potentialValue}</span>
                </div>
              </div>

              <div className="detail-callout source-fix-callout">
                <span>Recommended next action</span>
                <p>{item.recommendedNextAction}</p>
              </div>

              <div className="template-box source-fix-callout">
                <div>
                  <span>Message template preview</span>
                </div>
                <p>{item.messageTemplate}</p>
              </div>

              <div className="capture-actions">
                <button type="button" className="primary-btn">Send review request</button>
                <button type="button" className="secondary-btn">Send referral request</button>
                <button type="button" className="secondary-btn">Send UGC request</button>
                <button type="button" className="secondary-btn">Copy template</button>
                <button type="button" className="secondary-btn">Mark sent</button>
                <button type="button" className="secondary-btn">Mark completed</button>
                <button type="button" className="secondary-btn">Create second-purchase action</button>
                <button type="button" className="secondary-btn">Add internal note</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RefillOpportunities() {
  const [refills, setRefills] = useState<RefillOpportunity[]>(refillOpportunities);
  const [activeRefillFilter, setActiveRefillFilter] = useState<RefillOpportunityFilter>("All");
  const [selectedRefillId, setSelectedRefillId] = useState(refillOpportunities[0].id);
  const [notice, setNotice] = useState("Select a refill opportunity to review the reorder window.");

  const filteredRefills = refills.filter((item) => matchesRefillOpportunityFilter(item, activeRefillFilter));
  const selectedRefill =
    refills.find((item) => item.id === selectedRefillId) ?? filteredRefills[0] ?? refills[0];

  const refillKpis = useMemo<KPI[]>(() => {
    const openRevenue = refills
      .filter((item) => item.reminderStatus !== "Recovered")
      .reduce((total, item) => total + moneyToNumber(item.estimatedRefillValue), 0);
    const dueBuyers = refills.filter((item) => matchesRefillOpportunityFilter(item, "Due Today")).length;
    const overdue = refills.filter((item) => matchesRefillOpportunityFilter(item, "Overdue")).length;
    const highValue = refills.filter((item) => matchesRefillOpportunityFilter(item, "High Value")).length;
    const sent = refills.filter((item) => item.reminderStatus === "Sent" || item.reminderStatus === "Recovered").length;
    const recovered = refills.reduce((total, item) => total + moneyToNumber(item.recoveredValue), 0);

    return [
      { label: "Refill Revenue Open", value: formatCompactMoney(openRevenue), caption: "Reorder value to recover", tone: "emerald" },
      { label: "Refill Buyers Due", value: `${dueBuyers}`, caption: "Active reorder windows", tone: "cyan" },
      { label: "Overdue Refill Reminders", value: `${overdue}`, caption: "Reminder leakage", tone: "rose" },
      { label: "High-Value Refill Buyers", value: `${highValue}`, caption: "Priority reorder value", tone: "amber" },
      { label: "Refill Reminders Sent", value: `${sent}`, caption: "Reminder actions logged", tone: "cyan" },
      { label: "Recovered Refill Revenue", value: formatCompactMoney(recovered), caption: "Recovered repeat revenue", tone: "emerald" },
    ];
  }, [refills]);

  function updateSelectedRefill(updates: Partial<RefillOpportunity>, message: string) {
    const current = selectedRefill;
    setRefills((items) => items.map((item) => (item.id === current.id ? { ...item, ...updates } : item)));
    setNotice(`${message} for ${current.buyerName}.`);
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {refillKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Refill opportunity filters">
          {refillOpportunityFilters.map((filter) => (
            <button
              className={`queue-tab ${activeRefillFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveRefillFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredRefills.length} refill opportunities</Badge>
      </section>

      <section className="recovery-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Refill Opportunities</h2>
              <p>Beauty, skincare, and cosmetics buyers whose refill or reorder window is active, overdue, or approaching.</p>
            </div>
            <Badge tone="emerald">Repeat revenue</Badge>
          </div>

          <div className="recovery-list">
            {filteredRefills.map((item) => (
              <button
                className={`product-card recovery-task-card ${item.tone} ${
                  selectedRefill.id === item.id ? "selected" : ""
                }`}
                key={item.id}
                onClick={() => setSelectedRefillId(item.id)}
                type="button"
              >
                <div className="recovery-task-main">
                  <Avatar name={item.buyerName} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{item.buyerName}</h3>
                      <Badge tone={item.tone}>{item.reminderStatus}</Badge>
                    </div>
                    <p>{item.productName} - {item.productCategory}</p>
                    <div className="recovery-meta">
                      <span>{item.lastPurchaseDate}</span>
                      <span>{item.refillWindow}</span>
                      <span>{item.predictedReorderDate}</span>
                      <span>{item.owner}</span>
                      <span>{item.source}</span>
                    </div>
                    <small className="queue-next-action">{item.nextAction}</small>
                  </div>
                </div>
                <div className="task-money">
                  <strong>{item.estimatedRefillValue}</strong>
                  <span>refill value</span>
                </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedRefill.buyerName} />
              <div>
                <h2>{selectedRefill.buyerName}</h2>
                <p>{selectedRefill.productName}</p>
              </div>
            </div>
            <strong>{selectedRefill.estimatedRefillValue}</strong>
          </div>

          <div className="detail-grid">
            <div>
              <span>Product category</span>
              <strong>{selectedRefill.productCategory}</strong>
            </div>
            <div>
              <span>Last purchase</span>
              <strong>{selectedRefill.lastPurchaseDate}</strong>
            </div>
            <div>
              <span>Refill window</span>
              <strong>{selectedRefill.refillWindow}</strong>
            </div>
            <div>
              <span>Predicted reorder</span>
              <strong>{selectedRefill.predictedReorderDate}</strong>
            </div>
            <div>
              <span>Buyer status</span>
              <strong>{selectedRefill.buyerStatus}</strong>
            </div>
            <div>
              <span>Last reminder</span>
              <strong>{selectedRefill.lastReminder}</strong>
            </div>
          </div>

          <div className="template-box">
            <div>
              <span>Refill template preview</span>
              <button type="button" onClick={() => setNotice(`Refill template copied for ${selectedRefill.buyerName}.`)}>
                Copy Template
              </button>
            </div>
            <p>{selectedRefill.messageTemplate}</p>
          </div>

          <div className="detail-callout">
            <span>Next action</span>
            <p>{selectedRefill.nextAction}</p>
          </div>

          <p className="detail-notice">{notice}</p>

          <div className="detail-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => updateSelectedRefill({ reminderStatus: "Sent", lastReminder: "Just now" }, "Refill reminder sent")}
            >
              Send refill reminder
            </button>
            <button type="button" className="secondary-btn">Create recovery action</button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedRefill({ reminderStatus: "Snoozed", lastReminder: "Snoozed today" }, "Refill snoozed")}
            >
              Snooze refill
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedRefill(
                  { reminderStatus: "Recovered", recoveredValue: selectedRefill.estimatedRefillValue },
                  "Refill marked recovered",
                )
              }
            >
              Mark recovered
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedRefill({ owner: selectedRefill.owner === "Unassigned" ? "Mina Cole" : selectedRefill.owner }, "Owner assigned")}
            >
              Assign owner
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function RestockWaitlist() {
  const [waitlistItems, setWaitlistItems] = useState<RestockWaitlistItem[]>(restockWaitlistItems);
  const [activeRestockFilter, setActiveRestockFilter] = useState<RestockWaitlistFilter>("All");
  const [notice, setNotice] = useState("Restock waitlist demand is ready for notification review.");

  const filteredWaitlist = waitlistItems.filter((item) => matchesRestockWaitlistFilter(item, activeRestockFilter));

  const restockKpis = useMemo<KPI[]>(() => {
    const demandValue = waitlistItems
      .filter((item) => item.notificationStatus !== "Recovered")
      .reduce((total, item) => total + moneyToNumber(item.estimatedDemandValue), 0);
    const buyerCount = waitlistItems.reduce((total, item) => total + item.buyerCount, 0);
    const highIntent = waitlistItems.reduce((total, item) => total + item.highIntentBuyers, 0);
    const productsAwaiting = waitlistItems.filter((item) => item.notificationStatus !== "Recovered").length;
    const noticesDue = waitlistItems.filter((item) => matchesRestockWaitlistFilter(item, "Notice Not Sent")).length;
    const recovered = waitlistItems.reduce((total, item) => total + moneyToNumber(item.recoveredValue), 0);

    return [
      { label: "Restock Demand Value", value: formatCompactMoney(demandValue), caption: "Waitlisted recovery value", tone: "rose" },
      { label: "Waitlisted Buyers", value: `${buyerCount}`, caption: "Waiting by product or variant", tone: "cyan" },
      { label: "High-Intent Waitlist", value: `${highIntent}`, caption: "Priority restock buyers", tone: "amber" },
      { label: "Products Awaiting Restock", value: `${productsAwaiting}`, caption: "Open restock demand", tone: "rose" },
      { label: "Restock Notices Due", value: `${noticesDue}`, caption: "Notification leakage", tone: "cyan" },
      { label: "Recovered Restock Revenue", value: formatCompactMoney(recovered), caption: "Recovered waitlist value", tone: "emerald" },
    ];
  }, [waitlistItems]);

  function updateWaitlistItem(id: string, updates: Partial<RestockWaitlistItem>, message: string) {
    const current = waitlistItems.find((item) => item.id === id);
    if (!current) return;
    setWaitlistItems((items) => items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
    setNotice(`${message} for ${current.productName}.`);
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {restockKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Restock waitlist filters">
          {restockWaitlistFilters.map((filter) => (
            <button
              className={`queue-tab ${activeRestockFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveRestockFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredWaitlist.length} waitlist records</Badge>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Restock Waitlist</h2>
            <p>Waitlisted demand by product, SKU, size, shade, color, source mix, owner, and recovery cases.</p>
          </div>
          <Badge tone="amber">Restock demand</Badge>
        </div>

        <div className="capture-card-list">
          {filteredWaitlist.map((item) => (
            <article className={`product-card ${item.tone}`} key={item.id}>
              <div className="capture-card-main buyer-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{item.productName}</h3>
                    <Badge tone={item.tone}>{item.notificationStatus}</Badge>
                  </div>
                  <p>{item.skuVariant} - {item.sizeShadeColor} - {item.productCategory}</p>
                  <div className="recovery-meta">
                    <span>{item.industryType}</span>
                    <span>{item.buyerCount} buyers</span>
                    <span>{item.highIntentBuyers} high intent</span>
                    <span>{item.restockStatus}</span>
                    <span>{item.owner}</span>
                    <span>{item.linkedRecoveryCases} recovery cases</span>
                  </div>
                  <div className="product-tag-list">
                    {item.sourceMix.map((source) => (
                      <span key={source}>{source}</span>
                    ))}
                  </div>
                </div>
                <div className="capture-value-stack">
                  <strong>{item.estimatedDemandValue}</strong>
                  <span>{item.recoveredValue} recovered</span>
                </div>
              </div>

              <div className="detail-callout source-fix-callout">
                <span>Recommended next action</span>
                <p>{item.recommendedNextAction}</p>
              </div>

              <div className="capture-actions">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => updateWaitlistItem(item.id, { notificationStatus: "Notice sent" }, "Restock notice sent")}
                >
                  Send restock notice
                </button>
                <button type="button" className="secondary-btn">Create recovery tasks</button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => updateWaitlistItem(item.id, { owner: item.owner === "Unassigned" ? "Luis Park" : item.owner }, "Owner assigned")}
                >
                  Assign owner
                </button>
                <button type="button" className="secondary-btn">Add buyers to waitlist</button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => updateWaitlistItem(item.id, { notificationStatus: "Notice sent" }, "Notice marked sent")}
                >
                  Mark notice sent
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => updateWaitlistItem(item.id, { notificationStatus: "Recovered", recoveredValue: item.estimatedDemandValue }, "Restock demand marked recovered")}
                >
                  Mark recovered
                </button>
                <button type="button" className="secondary-btn">Export waitlist</button>
              </div>
            </article>
          ))}
        </div>

        <p className="detail-notice capture-page-notice">{notice}</p>
      </section>
    </div>
  );
}

function InactiveBuyerRecovery() {
  const [inactiveBuyers, setInactiveBuyers] = useState<InactiveBuyerRecoveryItem[]>(inactiveBuyerRecoveryItems);
  const [activeInactiveFilter, setActiveInactiveFilter] = useState<InactiveBuyerRecoveryFilter>("All");
  const [selectedInactiveId, setSelectedInactiveId] = useState(inactiveBuyerRecoveryItems[0].id);
  const [notice, setNotice] = useState("Select an inactive buyer to review the winback action.");

  const filteredInactiveBuyers = inactiveBuyers.filter((item) =>
    matchesInactiveBuyerRecoveryFilter(item, activeInactiveFilter),
  );
  const selectedInactive =
    inactiveBuyers.find((item) => item.id === selectedInactiveId) ??
    filteredInactiveBuyers[0] ??
    inactiveBuyers[0];

  const inactiveKpis = useMemo<KPI[]>(() => {
    const openItems = inactiveBuyers.filter((item) => item.recoveryStatus !== "Reactivated" && item.recoveryStatus !== "Lost");
    const inactiveValue = openItems.reduce((total, item) => total + moneyToNumber(item.estimatedRecoveryValue), 0);
    const highValue = inactiveBuyers.filter((item) => matchesInactiveBuyerRecoveryFilter(item, "High Value")).length;
    const winbackDue = openItems.length;
    const reactivationOpen = openItems.reduce((total, item) => total + moneyToNumber(item.estimatedRecoveryValue), 0);
    const recovered = inactiveBuyers.reduce((total, item) => total + moneyToNumber(item.recoveredValue), 0);

    return [
      { label: "Inactive Buyer Value", value: formatCompactMoney(inactiveValue), caption: "Recoverable buyer value", tone: "rose" },
      { label: "Inactive Buyers", value: `${openItems.length}`, caption: "Open recovery records", tone: "cyan" },
      { label: "High-Value Inactive Buyers", value: `${highValue}`, caption: "Priority winback", tone: "amber" },
      { label: "Winback Actions Due", value: `${winbackDue}`, caption: "Needs owner action", tone: "rose" },
      { label: "Reactivation Revenue Open", value: formatCompactMoney(reactivationOpen), caption: "Revenue to recover", tone: "emerald" },
      { label: "Recovered Reactivation Revenue", value: formatCompactMoney(recovered), caption: "Recovered winback value", tone: "emerald" },
    ];
  }, [inactiveBuyers]);

  function updateSelectedInactive(updates: Partial<InactiveBuyerRecoveryItem>, message: string) {
    const current = selectedInactive;
    setInactiveBuyers((items) => items.map((item) => (item.id === current.id ? { ...item, ...updates } : item)));
    setNotice(`${message} for ${current.buyerName}.`);
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {inactiveKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Inactive buyer recovery filters">
          {inactiveBuyerRecoveryFilters.map((filter) => (
            <button
              className={`queue-tab ${activeInactiveFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveInactiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredInactiveBuyers.length} inactive buyers</Badge>
      </section>

      <section className="recovery-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Inactive Buyer Recovery</h2>
              <p>Recover buyers who went inactive after refill, restock, payment, order, or follow-up leaks.</p>
            </div>
            <Badge tone="rose">Winback layer</Badge>
          </div>

          <div className="recovery-list">
            {filteredInactiveBuyers.map((item) => (
              <button
                className={`product-card recovery-task-card ${item.tone} ${
                  selectedInactive.id === item.id ? "selected" : ""
                }`}
                key={item.id}
                onClick={() => setSelectedInactiveId(item.id)}
                type="button"
              >
                <div className="recovery-task-main">
                  <Avatar name={item.buyerName} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{item.buyerName}</h3>
                      <Badge tone={item.tone}>{item.inactiveReason}</Badge>
                    </div>
                    <p>{item.originalProductInterest}</p>
                    <div className="recovery-meta">
                      <span>{item.lastPurchaseDate}</span>
                      <span>{item.lastContact}</span>
                      <span>{item.lifecycleStatus}</span>
                      <span>{item.source}</span>
                      <span>{item.owner}</span>
                      <span>{item.recoveryStatus}</span>
                    </div>
                    <small className="queue-next-action">{item.recommendedWinbackAction}</small>
                  </div>
                </div>
                <div className="task-money">
                  <strong>{item.estimatedRecoveryValue}</strong>
                  <span>open value</span>
                </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedInactive.buyerName} />
              <div>
                <h2>{selectedInactive.buyerName}</h2>
                <p>{selectedInactive.originalProductInterest}</p>
              </div>
            </div>
            <strong>{selectedInactive.estimatedRecoveryValue}</strong>
          </div>

          <div className="detail-grid">
            <div>
              <span>Inactive reason</span>
              <strong>{selectedInactive.inactiveReason}</strong>
            </div>
            <div>
              <span>Lifecycle status</span>
              <strong>{selectedInactive.lifecycleStatus}</strong>
            </div>
            <div>
              <span>Last purchase</span>
              <strong>{selectedInactive.lastPurchaseDate}</strong>
            </div>
            <div>
              <span>Last contact</span>
              <strong>{selectedInactive.lastContact}</strong>
            </div>
            <div>
              <span>Owner</span>
              <strong>{selectedInactive.owner}</strong>
            </div>
            <div>
              <span>Recovered value</span>
              <strong>{selectedInactive.recoveredValue}</strong>
            </div>
          </div>

          <div className="detail-callout">
            <span>Last action</span>
            <p>{selectedInactive.lastAction}</p>
          </div>

          <div className="template-box">
            <div>
              <span>Winback template preview</span>
              <button type="button" onClick={() => setNotice(`Winback template copied for ${selectedInactive.buyerName}.`)}>
                Copy Template
              </button>
            </div>
            <p>{selectedInactive.messageTemplate}</p>
          </div>

          <div className="detail-callout">
            <span>Recommended winback action</span>
            <p>{selectedInactive.recommendedWinbackAction}</p>
          </div>

          <p className="detail-notice">{notice}</p>

          <div className="detail-actions">
            <button type="button" className="primary-btn">Create winback action</button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedInactive({ owner: selectedInactive.owner === "Unassigned" ? "Amara Shah" : selectedInactive.owner }, "Owner assigned")}
            >
              Assign owner
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedInactive(
                  { recoveryStatus: "Reactivated", recoveredValue: selectedInactive.estimatedRecoveryValue },
                  "Buyer marked reactivated",
                )
              }
            >
              Mark reactivated
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedInactive({ recoveryStatus: "Lost" }, "Buyer marked lost")}
            >
              Mark lost
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedInactive({ recoveryStatus: "Snoozed" }, "Winback snoozed")}
            >
              Snooze
            </button>
            <button type="button" className="secondary-btn">Add internal note</button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function AssignedRecoveryActions() {
  const [actions, setActions] = useState<AssignedRecoveryAction[]>(assignedRecoveryActions);
  const [activeActionFilter, setActiveActionFilter] = useState<AssignedRecoveryActionFilter>("All");
  const [selectedActionId, setSelectedActionId] = useState(assignedRecoveryActions[0].id);
  const [notice, setNotice] = useState("Select an assigned recovery action to review ownership and next best action.");

  const filteredActions = actions.filter((item) => matchesAssignedRecoveryActionFilter(item, activeActionFilter));
  const selectedAction =
    actions.find((item) => item.id === selectedActionId) ?? filteredActions[0] ?? actions[0];

  const actionKpis = useMemo<KPI[]>(() => {
    const openActions = actions.filter((item) => !item.completed && item.dueStatus !== "Completed");
    const overdue = openActions.filter((item) => item.dueStatus === "Overdue").length;
    const revenueOwned = openActions.reduce((total, item) => total + moneyToNumber(item.revenueAtRisk), 0);
    const unassigned = openActions.filter((item) => item.owner === "Unassigned").length;
    const highPriority = openActions.filter((item) => item.priority === "Critical" || item.priority === "High").length;
    const completedThisWeek = actions.filter((item) => item.completed || item.dueStatus === "Completed").length + 18;

    return [
      { label: "Assigned Actions", value: `${openActions.length}`, caption: "Owned recovery work", tone: "cyan" },
      { label: "Overdue Assigned Actions", value: `${overdue}`, caption: "Overdue revenue work", tone: "rose" },
      { label: "Revenue Owned By Team", value: formatCompactMoney(revenueOwned), caption: "Open owner value", tone: "amber" },
      { label: "Unassigned Recovery Actions", value: `${unassigned}`, caption: "Owner missing", tone: "rose" },
      { label: "High-Priority Actions", value: `${highPriority}`, caption: "Critical and high priority", tone: "cyan" },
      { label: "Completed This Week", value: `${completedThisWeek}`, caption: "Recovered execution done", tone: "emerald" },
    ];
  }, [actions]);

  function updateSelectedAction(updates: Partial<AssignedRecoveryAction>, message: string) {
    const current = selectedAction;
    setActions((items) => items.map((item) => (item.id === current.id ? { ...item, ...updates } : item)));
    setNotice(`${message} for ${current.buyerName}.`);
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {actionKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Assigned recovery action filters">
          {assignedRecoveryActionFilters.map((filter) => (
            <button
              className={`queue-tab ${activeActionFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveActionFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredActions.length} assigned actions</Badge>
      </section>

      <section className="recovery-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Assigned Recovery Actions</h2>
              <p>Every assigned recovery action by owner, due status, priority, revenue at risk, and next best action.</p>
            </div>
            <Badge tone="rose">Owner execution</Badge>
          </div>

          <div className="recovery-list">
            {filteredActions.map((item) => (
              <button
                className={`product-card recovery-task-card ${item.tone} ${
                  selectedAction.id === item.id ? "selected" : ""
                }`}
                key={item.id}
                onClick={() => setSelectedActionId(item.id)}
                type="button"
              >
                <div className="recovery-task-main">
                  <Avatar name={item.buyerName} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{item.actionTitle}</h3>
                      <Badge tone={item.tone}>{item.recoveryType}</Badge>
                    </div>
                    <p>{item.buyerName} - {item.productContext}</p>
                    <div className="recovery-meta">
                      <span>{item.owner}</span>
                      <span>{item.roleTeam}</span>
                      <span>{item.priority}</span>
                      <span>{item.dueStatus}</span>
                      <span>{item.source}</span>
                      <span>{item.relatedRecoveryCase}</span>
                    </div>
                    <small className="queue-next-action">{item.nextAction}</small>
                  </div>
                </div>
                <div className="task-money">
                  <strong>{item.revenueAtRisk}</strong>
                  <span>at risk</span>
                </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedAction.buyerName} />
              <div>
                <h2>{selectedAction.buyerName}</h2>
                <p>{selectedAction.productContext}</p>
              </div>
            </div>
            <strong>{selectedAction.revenueAtRisk}</strong>
          </div>

          <div className="detail-grid">
            <div>
              <span>Recovery type</span>
              <strong>{selectedAction.recoveryType}</strong>
            </div>
            <div>
              <span>Owner</span>
              <strong>{selectedAction.owner}</strong>
            </div>
            <div>
              <span>Role / team</span>
              <strong>{selectedAction.roleTeam}</strong>
            </div>
            <div>
              <span>Due status</span>
              <strong>{selectedAction.dueStatus}</strong>
            </div>
            <div>
              <span>Priority</span>
              <strong>{selectedAction.priority}</strong>
            </div>
            <div>
              <span>Related case</span>
              <strong>{selectedAction.relatedRecoveryCase}</strong>
            </div>
          </div>

          <div className="detail-callout">
            <span>Recommended next action</span>
            <p>{selectedAction.nextAction}</p>
          </div>

          <div className="template-box">
            <div>
              <span>{selectedAction.messageTemplateStatus}</span>
              <button type="button" onClick={() => setNotice(`Template copied for ${selectedAction.buyerName}.`)}>
                Copy Template
              </button>
            </div>
            <p>{selectedAction.messageTemplate}</p>
          </div>

          <div className="detail-callout">
            <span>Internal notes / thread preview</span>
            <p>{selectedAction.internalNotesPreview}</p>
          </div>

          <div className="detail-callout">
            <span>Handoff status</span>
            <p>{selectedAction.handoffStatus}</p>
          </div>

          <p className="detail-notice">{notice}</p>

          <div className="detail-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={() => updateSelectedAction({ dueStatus: "Completed", completed: true }, "Action marked complete")}
            >
              Mark complete
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedAction(
                  {
                    owner: selectedAction.owner === "Unassigned" ? "Amara Shah" : "Mina Cole",
                    roleTeam: selectedAction.owner === "Unassigned" ? "Recovery Lead" : "Beauty Specialist",
                  },
                  "Recovery owner updated",
                )
              }
            >
              Reassign
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedAction({ dueStatus: "Snoozed" }, "Action snoozed")}
            >
              Snooze
            </button>
            <button type="button" className="secondary-btn">Add internal note</button>
            <button type="button" className="secondary-btn">Open related case</button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedAction({ priority: "Critical", handoffStatus: "Escalated for owner review" }, "Action escalated")}
            >
              Escalate
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function RecoveryThreads() {
  const [threads, setThreads] = useState<RecoveryThread[]>(recoveryThreads);
  const [activeThreadFilter, setActiveThreadFilter] = useState<RecoveryThreadFilter>("All");
  const [selectedThreadId, setSelectedThreadId] = useState(recoveryThreads[0].id);
  const [notice, setNotice] = useState("Select a recovery thread to review internal context and handoff status.");

  const filteredThreads = threads.filter((item) => matchesRecoveryThreadFilter(item, activeThreadFilter));
  const selectedThread =
    threads.find((item) => item.id === selectedThreadId) ?? filteredThreads[0] ?? threads[0];

  const threadKpis = useMemo<KPI[]>(() => {
    const active = threads.filter((item) => item.threadStatus !== "Closed").length;
    const openActions = threads.filter((item) => item.nextAction.length > 0 && item.threadStatus !== "Closed").length;
    const handoffs = threads.filter((item) => item.threadStatus === "Handoff waiting" || item.handoffNote.toLowerCase().includes("handoff")).length;
    const unassigned = threads.filter((item) => item.currentOwner === "Unassigned" || item.threadStatus === "Unassigned").length;
    const updatedToday = threads.filter((item) => matchesRecoveryThreadFilter(item, "Updated Today")).length;
    const highRisk = threads.filter((item) => item.threadStatus === "High risk" || moneyToNumber(item.revenueAtRisk) >= 1000).length;

    return [
      { label: "Active Recovery Threads", value: `${active}`, caption: "Case context open", tone: "cyan" },
      { label: "Threads With Open Actions", value: `${openActions}`, caption: "Needs next owner step", tone: "amber" },
      { label: "Handoffs Waiting", value: `${handoffs}`, caption: "Context transfer needed", tone: "rose" },
      { label: "Unassigned Threads", value: `${unassigned}`, caption: "Owner missing", tone: "rose" },
      { label: "Threads Updated Today", value: `${updatedToday}`, caption: "Fresh case context", tone: "emerald" },
      { label: "High-Risk Threads", value: `${highRisk}`, caption: "Revenue risk attached", tone: "amber" },
    ];
  }, [threads]);

  function updateSelectedThread(updates: Partial<RecoveryThread>, message: string) {
    const current = selectedThread;
    setThreads((items) => items.map((item) => (item.id === current.id ? { ...item, ...updates } : item)));
    setNotice(`${message} for ${current.threadTitle}.`);
  }

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {threadKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Recovery thread filters">
          {recoveryThreadFilters.map((filter) => (
            <button
              className={`queue-tab ${activeThreadFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveThreadFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredThreads.length} threads</Badge>
      </section>

      <section className="recovery-workspace">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Recovery Threads</h2>
              <p>Internal case context attached to buyers, orders, source issues, product demand, and recovery cases.</p>
            </div>
            <Badge tone="cyan">Case context</Badge>
          </div>

          <div className="recovery-list">
            {filteredThreads.map((thread) => (
              <button
                className={`product-card recovery-task-card ${thread.tone} ${
                  selectedThread.id === thread.id ? "selected" : ""
                }`}
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                type="button"
              >
                <div className="recovery-task-main">
                  <Avatar name={thread.linkedBuyer} />
                  <div>
                    <div className="recovery-row-title">
                      <h3>{thread.threadTitle}</h3>
                      <Badge tone={thread.tone}>{thread.threadStatus}</Badge>
                    </div>
                    <p>{thread.lastMessage}</p>
                    <div className="recovery-meta">
                      <span>{thread.linkedBuyer}</span>
                      <span>{thread.linkedRecoveryCase}</span>
                      <span>{thread.recoveryType}</span>
                      <span>{thread.currentOwner}</span>
                      <span>{thread.lastUpdated}</span>
                    </div>
                    <small className="queue-next-action">{thread.nextAction}</small>
                  </div>
                </div>
                <div className="task-money">
                  <strong>{thread.revenueAtRisk}</strong>
                  <span>at risk</span>
                </div>
              </button>
            ))}
          </div>
        </article>

        <aside className="glass-card panel-card recovery-detail-panel">
          <div className="detail-heading">
            <div className="detail-person">
              <Avatar name={selectedThread.linkedBuyer} />
              <div>
                <h2>{selectedThread.threadTitle}</h2>
                <p>{selectedThread.linkedBuyer} - {selectedThread.linkedRecoveryCase}</p>
              </div>
            </div>
            <strong>{selectedThread.revenueAtRisk}</strong>
          </div>

          <div className="detail-grid">
            <div>
              <span>Recovery type</span>
              <strong>{selectedThread.recoveryType}</strong>
            </div>
            <div>
              <span>Current owner</span>
              <strong>{selectedThread.currentOwner}</strong>
            </div>
            <div>
              <span>Participants</span>
              <strong>{selectedThread.participants.join(", ")}</strong>
            </div>
            <div>
              <span>Last updated</span>
              <strong>{selectedThread.lastUpdated}</strong>
            </div>
            <div>
              <span>Thread status</span>
              <strong>{selectedThread.threadStatus}</strong>
            </div>
            <div>
              <span>Next action</span>
              <strong>{selectedThread.nextAction}</strong>
            </div>
          </div>

          <div className="detail-callout">
            <span>Handoff note</span>
            <p>{selectedThread.handoffNote}</p>
          </div>

          <div className="thread-message-stack">
            {selectedThread.messages.map((message) => (
              <article className="thread-message" key={message.id}>
                <div>
                  <strong>{message.author}</strong>
                  <span>{message.role}</span>
                  <small>{message.time}</small>
                </div>
                <p>{message.message}</p>
                {message.outcome ? <small>Outcome: {message.outcome}</small> : null}
              </article>
            ))}
          </div>

          <p className="detail-notice">{notice}</p>

          <div className="detail-actions">
            <button type="button" className="primary-btn">Add internal note</button>
            <button type="button" className="secondary-btn">Mention teammate</button>
            <button type="button" className="secondary-btn">Create assigned action</button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedThread({ threadStatus: "Open", handoffNote: "Handoff complete." }, "Handoff marked complete")}
            >
              Mark handoff complete
            </button>
            <button type="button" className="secondary-btn">Open related case</button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                updateSelectedThread(
                  { currentOwner: selectedThread.currentOwner === "Unassigned" ? "Amara Shah" : "Operations" },
                  "Owner reassigned",
                )
              }
            >
              Reassign owner
            </button>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => updateSelectedThread({ threadStatus: "Closed" }, "Thread closed")}
            >
              Close thread
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}

function TeamLoad() {
  const [activeTeamLoadFilter, setActiveTeamLoadFilter] = useState<TeamLoadFilter>("All");
  const filteredLoads = teamMemberLoads.filter((item) => matchesTeamLoadFilter(item, activeTeamLoadFilter));

  const teamLoadKpis = useMemo<KPI[]>(() => {
    const activeMembers = teamMemberLoads.filter((item) => item.role !== "Unassigned").length;
    const openActions = teamMemberLoads.reduce((total, item) => total + item.activeActions, 0);
    const overdue = teamMemberLoads.reduce((total, item) => total + item.overdueActions, 0);
    const risk = teamMemberLoads.reduce((total, item) => total + moneyToNumber(item.revenueAtRiskOwned), 0);
    const unassigned = teamMemberLoads.find((item) => item.role === "Unassigned")?.activeActions ?? 0;
    const completed = teamMemberLoads.reduce((total, item) => total + item.completedActionsThisWeek, 0);

    return [
      { label: "Active Team Members", value: `${activeMembers}`, caption: "Owners with recovery work", tone: "cyan" },
      { label: "Open Recovery Actions", value: `${openActions}`, caption: "Team execution queue", tone: "amber" },
      { label: "Overdue Team Actions", value: `${overdue}`, caption: "Late revenue work", tone: "rose" },
      { label: "Revenue At Risk By Team", value: formatCompactMoney(risk), caption: "Owned and unassigned risk", tone: "rose" },
      { label: "Unassigned Work", value: `${unassigned}`, caption: "Owner missing", tone: "amber" },
      { label: "Completed Actions This Week", value: `${completed}`, caption: "Execution completed", tone: "emerald" },
    ];
  }, []);

  const overloaded = teamMemberLoads.filter((item) => item.activeActions >= 14 || item.overdueActions >= 4);
  const unassignedQueue = teamMemberLoads.filter((item) => item.role === "Unassigned");
  const performanceRows = teamMemberLoads.filter((item) => item.role !== "Unassigned");

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {teamLoadKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Team load filters">
          {teamLoadFilters.map((filter) => (
            <button
              className={`queue-tab ${activeTeamLoadFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveTeamLoadFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredLoads.length} owner rows</Badge>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Team Workload Overview</h2>
            <p>Owner workload, overdue revenue work, open handoffs, bottlenecks, and recovered value by owner.</p>
          </div>
          <Badge tone="amber">Owner workload</Badge>
        </div>

        <div className="team-load-grid team-workload-grid">
          {filteredLoads.map((member) => (
            <article className={`team-load-card ${member.tone}`} key={member.id}>
              <div>
                <div className="recovery-row-title">
                  <h3>{member.memberName}</h3>
                  <Badge tone={member.tone}>{member.role}</Badge>
                </div>
                <p>{member.focusArea}</p>
              </div>
              <div className="capture-value-stack">
                <strong>{member.revenueAtRiskOwned}</strong>
                <span>revenue at risk</span>
              </div>
              <div className="team-load-stats">
                <span>{member.activeActions} active actions</span>
                <span>{member.overdueActions} overdue</span>
                <span>{member.openHandoffs} open handoffs</span>
                <span>{member.averageResponseTime} avg response</span>
                <span>{member.recoveredValueThisMonth} recovered</span>
              </div>
              <div className="team-load-detail">
                <span>{member.bottleneckStatus}</span>
                <p>{member.nextRecommendedWorkloadAction}</p>
              </div>
              <div className="capture-actions">
                <button type="button" className="primary-btn">Open owner queue</button>
                <button type="button" className="secondary-btn">View overdue work</button>
                <button type="button" className="secondary-btn">Mark workload reviewed</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="summary-breakdown-grid">
        <article className="summary-breakdown-card">
          <h3>Bottlenecks</h3>
          {overloaded.map((member) => (
            <div key={member.id}>
              <span>{member.memberName}</span>
              <strong>{member.overdueActions} overdue</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Unassigned Work</h3>
          {unassignedQueue.map((member) => (
            <div key={member.id}>
              <span>{member.nextRecommendedWorkloadAction}</span>
              <strong>{member.revenueAtRiskOwned}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Recovery Performance By Owner</h3>
          {performanceRows.map((member) => (
            <div key={member.id}>
              <span>{member.memberName}</span>
              <strong>{member.recoveredValueThisMonth}</strong>
            </div>
          ))}
        </article>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Workload Actions</h2>
            <p>Rebalance owner workload, assign unassigned recovery actions, and export team recovery performance.</p>
          </div>
          <Badge tone="emerald">Execution control</Badge>
        </div>
        <div className="capture-actions">
          <button type="button" className="primary-btn">Rebalance workload</button>
          <button type="button" className="secondary-btn">Assign unassigned actions</button>
          <button type="button" className="secondary-btn">Export team report</button>
          <button type="button" className="secondary-btn">Mark workload reviewed</button>
        </div>
      </section>
    </div>
  );
}

function AutomationHealth() {
  const [activeAutomationFilter, setActiveAutomationFilter] = useState<AutomationHealthFilter>("All");
  const filteredRecords = automationHealthRecords.filter((item) =>
    matchesAutomationHealthFilter(item, activeAutomationFilter),
  );

  const automationKpis = useMemo<KPI[]>(() => {
    const connectedSources = new Set(automationHealthRecords.map((item) => item.thirdPartySource)).size;
    const eventsCaptured = automationHealthRecords.reduce((total, item) => total + item.recordsProcessed, 0);
    const successfulSyncs = automationHealthRecords.filter((item) => item.syncStatus === "Healthy").length;
    const failedSyncs = automationHealthRecords.reduce((total, item) => total + item.failedRecords, 0);
    const reviewRecords = automationHealthRecords.reduce(
      (total, item) => total + item.failedRecords + item.missingFields + item.duplicateRecords,
      0,
    );
    const recoveryActions = automationHealthRecords.reduce((total, item) => total + item.recordsCreated, 0);

    return [
      { label: "Connected Sources", value: `${connectedSources}`, caption: "Third-party sources monitored", tone: "cyan" },
      { label: "Events Captured Today", value: `${eventsCaptured}`, caption: "External source events", tone: "emerald" },
      { label: "Successful Syncs", value: `${successfulSyncs}`, caption: "Healthy source records", tone: "emerald" },
      { label: "Failed Syncs", value: `${failedSyncs}`, caption: "Failed records", tone: "rose" },
      { label: "Records Needing Review", value: `${reviewRecords}`, caption: "Missing, failed, or duplicate", tone: "amber" },
      { label: "Recovery Actions Created", value: `${recoveryActions}`, caption: "Actions created from syncs", tone: "cyan" },
      { label: "Last Sync Time", value: "8m", caption: "Most recent successful sync", tone: "emerald" },
      { label: "Automation Uptime", value: "98.6%", caption: "External sync availability", tone: "cyan" },
    ];
  }, []);

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {automationKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Automation health filters">
          {automationHealthFilters.map((filter) => (
            <button
              className={`queue-tab ${activeAutomationFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveAutomationFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredRecords.length} sync records</Badge>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Automation Health</h2>
            <p>Third-party automation sync health, failed records, review needs, and recovery actions created.</p>
          </div>
          <Badge tone="emerald">Monitoring only</Badge>
        </div>

        <div className="capture-card-list">
          {filteredRecords.map((record) => (
            <article className={`product-card ${record.tone}`} key={record.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{record.automationName}</h3>
                    <Badge tone={record.tone}>{record.syncStatus}</Badge>
                  </div>
                  <p>{record.thirdPartySource} - {record.eventType} - Last run {record.lastRunTime}</p>
                  <div className="recovery-meta">
                    <span>{record.sourceCategory}</span>
                    <span>{record.recordsProcessed} processed</span>
                    <span>{record.recordsCreated} created</span>
                    <span>{record.recordsUpdated} updated</span>
                    <span>{record.failedRecords} failed</span>
                    <span>{record.reviewOwner}</span>
                  </div>
                </div>
                <div className="capture-value-stack">
                  <strong>{record.relatedRecoveryCases}</strong>
                  <span>related cases</span>
                </div>
              </div>

              <div className="capture-stat-grid source-stat-grid">
                <div>
                  <span>Missing fields</span>
                  <strong>{record.missingFields}</strong>
                </div>
                <div>
                  <span>Duplicate records</span>
                  <strong>{record.duplicateRecords}</strong>
                </div>
                <div>
                  <span>Impact</span>
                  <strong>{record.impactOnRecovery}</strong>
                </div>
                <div>
                  <span>Next action</span>
                  <strong>{record.recommendedFix}</strong>
                </div>
              </div>

              <div className="capture-actions">
                <button type="button" className="primary-btn">Review failed records</button>
                <button type="button" className="secondary-btn">Mark reviewed</button>
                <button type="button" className="secondary-btn">Re-run sync placeholder</button>
                <button type="button" className="secondary-btn">Open related recovery cases</button>
                <button type="button" className="secondary-btn">Assign review owner</button>
                <button type="button" className="secondary-btn">Export sync log</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RevenueLeakReports() {
  const [activeReportFilter, setActiveReportFilter] = useState<RevenueLeakReportFilter>("All");
  const filteredLeakItems = revenueLeakReportItems.filter((item) =>
    matchesRevenueLeakReportFilter(item, activeReportFilter),
  );

  const reportKpis = useMemo<KPI[]>(() => {
    const totalRisk = revenueLeakReportItems.reduce((total, item) => total + moneyToNumber(item.revenueAtRisk), 0);
    const recovered = revenueLeakReportItems.reduce((total, item) => total + moneyToNumber(item.recoveredValue), 0);
    const lost = revenueLeakReportItems.reduce((total, item) => total + moneyToNumber(item.lostValue), 0);
    const openLeak = Math.max(0, totalRisk - recovered);
    const recoveryRate = totalRisk > 0 ? Math.round((recovered / totalRisk) * 100) : 0;
    const overdue = teamOwnershipReportItems.reduce((total, item) => total + item.overdueActions, 0);

    return [
      { label: "Total Revenue At Risk", value: formatCompactMoney(totalRisk), caption: "Across leak reports", tone: "rose" },
      { label: "Revenue Recovered", value: formatCompactMoney(recovered), caption: "Recovered value", tone: "emerald" },
      { label: "Open Leak Value", value: formatCompactMoney(openLeak), caption: "Still needs recovery", tone: "amber" },
      { label: "Lost / Inactive Value", value: formatCompactMoney(lost), caption: "Lost or inactive value", tone: "rose" },
      { label: "Recovery Rate", value: `${recoveryRate}%`, caption: "Recovered vs at risk", tone: "emerald" },
      { label: "Highest Leak Source", value: "Instagram", caption: "DM follow-up delay", tone: "cyan" },
      { label: "Highest Leak Type", value: "Restock", caption: "New drop and restock demand", tone: "amber" },
      { label: "Actions Overdue", value: `${overdue}`, caption: "Owner work late", tone: "rose" },
    ];
  }, []);

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {reportKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Revenue leak report filters">
          {revenueLeakReportFilters.map((filter) => (
            <button
              className={`queue-tab ${activeReportFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveReportFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredLeakItems.length} leak rows</Badge>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Leak Type Breakdown</h2>
            <p>Where revenue leaked, how much was recovered, what remains open, and the fix to prioritize.</p>
          </div>
          <Badge tone="rose">Revenue leak report</Badge>
        </div>

        <div className="capture-card-list">
          {filteredLeakItems.map((item) => (
            <article className={`product-card ${item.tone}`} key={item.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{item.leakType}</h3>
                    <Badge tone={item.tone}>{item.recoveryRate} recovery rate</Badge>
                  </div>
                  <p>{item.recommendedFix}</p>
                  <div className="recovery-meta">
                    <span>{item.openCases} open cases</span>
                    <span>{item.revenueAtRisk} at risk</span>
                    <span>{item.recoveredValue} recovered</span>
                    <span>{item.lostValue} lost value</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="summary-breakdown-grid">
        <article className="summary-breakdown-card">
          <h3>Source Leakage Report</h3>
          {sourceLeakReportItems.slice(0, 6).map((source) => (
            <div key={source.id}>
              <span>{source.sourceName} - {source.sourceQualityNote}</span>
              <strong>{source.paymentPendingValue}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Product / Category Leak Report</h3>
          {productLeakReportItems.slice(0, 6).map((product) => (
            <div key={product.id}>
              <span>{product.productCategory} - {product.openRecoveryCases} cases</span>
              <strong>{product.demandValue}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Team Ownership Report</h3>
          {teamOwnershipReportItems.slice(0, 6).map((owner) => (
            <div key={owner.id}>
              <span>{owner.owner} - {owner.overdueActions} overdue</span>
              <strong>{owner.revenueAtRiskOwned}</strong>
            </div>
          ))}
        </article>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Open Recommendations</h2>
            <p>Management actions that reduce revenue leaks across owners, sources, products, and sync status.</p>
          </div>
          <Badge tone="amber">Next best actions</Badge>
        </div>

        <div className="capture-card-list">
          {monthlyRecommendations.map((item) => (
            <article className={`product-card ${item.tone}`} key={item.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{item.recommendation}</h3>
                    <Badge tone={item.tone}>{item.priority}</Badge>
                  </div>
                  <p>{item.reason}</p>
                  <div className="recovery-meta">
                    <span>{item.owner}</span>
                    <span>{item.impact}</span>
                  </div>
                </div>
              </div>
              <div className="capture-actions">
                <button type="button" className="primary-btn">Open related cases</button>
                <button type="button" className="secondary-btn">Assign report actions</button>
                <button type="button" className="secondary-btn">Mark recommendation reviewed</button>
                <button type="button" className="secondary-btn">Add management note</button>
              </div>
            </article>
          ))}
        </div>

        <div className="capture-actions">
          <button type="button" className="primary-btn">Export report</button>
          <button type="button" className="secondary-btn">Open related cases</button>
        </div>
      </section>
    </div>
  );
}

function MonthlySummary() {
  const monthlyKpis: KPI[] = [
    { label: "Revenue Recovered This Month", value: "$18.4K", caption: "Across recovery actions", tone: "emerald" },
    { label: "Revenue Still At Risk", value: "$22.7K", caption: "Open recovery value", tone: "rose" },
    { label: "Recovery Actions Completed", value: "110", caption: "Completed owner actions", tone: "cyan" },
    { label: "Automations Monitored", value: "11", caption: "Third-party automations monitored", tone: "cyan" },
    { label: "Sync Issues Resolved", value: "17", caption: "Failed sync cleanup", tone: "emerald" },
    { label: "Repeat Revenue Created", value: "$7.1K", caption: "Refill and restock value", tone: "emerald" },
    { label: "Payment Value Recovered", value: "$8.9K", caption: "Payment reminders", tone: "amber" },
    { label: "Post-Purchase Actions Completed", value: "42", caption: "Reviews, referrals, UGC", tone: "cyan" },
  ];

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {monthlyKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Executive Summary</h2>
            <p>Client-ready monthly review for the managed automation layer and revenue recovery service.</p>
          </div>
          <Badge tone="emerald">Monthly summary</Badge>
        </div>
        <div className="detail-callout">
          <span>Management summary</span>
          <p>
            This month, the system recovered $18.4K across payment reminders, refill opportunities,
            restock notices, and follow-up recovery. The largest remaining leak is Instagram DM follow-up
            delay, with $6.2K still at risk. Product data cleanup improved refill timing, while missing SKU
            fields and unassigned pop-up leads remain the highest-priority fixes for next month.
          </p>
        </div>
        <div className="capture-actions">
          <button type="button" className="primary-btn">Copy client summary</button>
          <button type="button" className="secondary-btn">Export monthly PDF placeholder</button>
          <button type="button" className="secondary-btn">Export CSV placeholder</button>
          <button type="button" className="secondary-btn">Mark monthly review complete</button>
        </div>
      </section>

      <section className="summary-breakdown-grid">
        <article className="summary-breakdown-card">
          <h3>Revenue Recovered Breakdown</h3>
          {monthlyRecoveredBreakdown.map((item) => (
            <div key={item.id}>
              <span>{item.label} - {item.note}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Open Revenue At Risk</h3>
          {monthlyOpenRiskItems.map((item) => (
            <div key={item.id}>
              <span>{item.label} - {item.note}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Automation Monitoring Summary</h3>
          {monthlyAutomationSummary.map((item) => (
            <div key={item.id}>
              <span>{item.label} - {item.note}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </article>
      </section>

      <section className="summary-breakdown-grid">
        <article className="summary-breakdown-card">
          <h3>Team Performance Summary</h3>
          {teamOwnershipReportItems.slice(0, 5).map((item) => (
            <div key={item.id}>
              <span>{item.owner} - {item.openActions} open - {item.overdueActions} overdue</span>
              <strong>{item.recoveredValue}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Product / Buyer Insights</h3>
          {productLeakReportItems.slice(0, 5).map((item) => (
            <div key={item.id}>
              <span>{item.productCategory} - {item.recommendedAction}</span>
              <strong>{item.demandValue}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Next Month Focus</h3>
          {monthlyRecommendations.slice(0, 5).map((item) => (
            <div key={item.id}>
              <span>{item.recommendation}</span>
              <strong>{item.priority}</strong>
            </div>
          ))}
        </article>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Priority Recommendations</h2>
            <p>Next month focus items for reducing source leakage, missing fields, repeat revenue leaks, and owner bottlenecks.</p>
          </div>
          <Badge tone="amber">Next month focus</Badge>
        </div>
        <div className="capture-card-list">
          {monthlyRecommendations.map((item) => (
            <article className={`product-card ${item.tone}`} key={item.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{item.recommendation}</h3>
                    <Badge tone={item.tone}>{item.priority}</Badge>
                  </div>
                  <p>{item.reason}</p>
                  <div className="recovery-meta">
                    <span>{item.owner}</span>
                    <span>{item.impact}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="capture-actions">
          <button type="button" className="primary-btn">Open priority cases</button>
          <button type="button" className="secondary-btn">Add recommendation</button>
          <button type="button" className="secondary-btn">Mark monthly review complete</button>
        </div>
      </section>
    </div>
  );
}

function BrandSettingsPage() {
  const brandKpis: KPI[] = [
    { label: "Brand Profile Completion", value: "92%", caption: "Recovery profile fields set", tone: "emerald" },
    { label: "Active Recovery Modules", value: `${recoveryModuleSettings.filter((item) => item.status === "Enabled").length}`, caption: "Enabled recovery modules", tone: "cyan" },
    { label: "Connected Sources Configured", value: `${sourceSetupRecords.filter((item) => item.sourceStatus === "Configured").length}`, caption: "Source rules ready", tone: "emerald" },
    { label: "Default Recovery Rules", value: `${ownershipRules.length}`, caption: "Owner routing rules", tone: "amber" },
    { label: "Product Categories Enabled", value: "5", caption: "Fashion, beauty, skincare, cosmetics, hybrid", tone: "cyan" },
    { label: "Reporting Cadence", value: "Monthly", caption: "Client review rhythm", tone: "rose" },
  ];

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {brandKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Brand Profile</h2>
            <p>Configure the brand recovery profile and operating model around the brand sales process.</p>
          </div>
          <Badge tone="emerald">{brandSettings.industryFocus}</Badge>
        </div>

        <div className="import-step-grid">
          <div><span>Brand name</span><strong>{brandSettings.brandName}</strong></div>
          <div><span>Industry focus</span><strong>{brandSettings.industryFocus}</strong></div>
          <div><span>Brand type</span><strong>{brandSettings.brandType}</strong></div>
          <div><span>Primary market</span><strong>{brandSettings.primaryMarket}</strong></div>
          <div><span>Currency</span><strong>{brandSettings.currency}</strong></div>
          <div><span>Timezone</span><strong>{brandSettings.timezone}</strong></div>
          <div><span>Main sales channels</span><strong>{brandSettings.mainSalesChannels.join(", ")}</strong></div>
          <div><span>Ecommerce platform</span><strong>{brandSettings.ecommercePlatform}</strong></div>
          <div><span>Preferred communication channels</span><strong>{brandSettings.preferredCommunicationChannels.join(", ")}</strong></div>
          <div><span>Default owner/admin</span><strong>{brandSettings.defaultOwnerAdmin}</strong></div>
        </div>

        <div className="capture-actions">
          <button type="button" className="primary-btn">Edit brand profile</button>
          <button type="button" className="secondary-btn">Save settings</button>
        </div>
      </section>

      <section className="summary-breakdown-grid">
        <article className="summary-breakdown-card">
          <h3>Recovery Module Settings</h3>
          {recoveryModuleSettings.slice(0, 6).map((module) => (
            <div key={module.id}>
              <span>{module.moduleName} - {module.defaultOwner}</span>
              <strong>{module.status}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Default Recovery Windows</h3>
          {recoveryWindowSettings.slice(0, 6).map((setting) => (
            <div key={setting.id}>
              <span>{setting.settingName}</span>
              <strong>{setting.value}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Source Configuration Preview</h3>
          {sourceSetupRecords.slice(0, 6).map((source) => (
            <div key={source.id}>
              <span>{source.sourceName} - {source.defaultOwner}</span>
              <strong>{source.sourceStatus}</strong>
            </div>
          ))}
        </article>
      </section>

      <div className="capture-actions">
        <button type="button" className="primary-btn">Enable module</button>
        <button type="button" className="secondary-btn">Update recovery window</button>
        <button type="button" className="secondary-btn">Assign default owner</button>
        <button type="button" className="secondary-btn">Save settings</button>
      </div>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Source Configuration Preview</h2>
            <p>Configured sources, owner routing, recovery rules, and missing field warnings.</p>
          </div>
          <Badge tone="amber">Source rules</Badge>
        </div>
        <div className="capture-card-list">
          {sourceSetupRecords.map((source) => (
            <article className={`product-card ${source.tone}`} key={source.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{source.sourceName}</h3>
                    <Badge tone={source.tone}>{source.sourceStatus}</Badge>
                  </div>
                  <p>{source.recoveryRule}</p>
                  <div className="recovery-meta">
                    <span>{source.defaultOwner}</span>
                    <span>{source.missingFieldWarning}</span>
                  </div>
                </div>
              </div>
              <div className="capture-actions">
                <button type="button" className="primary-btn">Configure source</button>
                <button type="button" className="secondary-btn">Assign default owner</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TeamUsersSetup() {
  const teamKpis: KPI[] = [
    { label: "Active Users", value: `${setupTeamUsers.filter((user) => user.status === "Active").length}`, caption: "Can own recovery work", tone: "cyan" },
    { label: "Recovery Owners", value: `${setupTeamUsers.filter((user) => user.role !== "Viewer" && user.role !== "Unassigned").length}`, caption: "Owner roles configured", tone: "emerald" },
    { label: "Unassigned Work Rules", value: "1", caption: "Fallback queue configured", tone: "amber" },
    { label: "Role Coverage", value: "8", caption: "Recovery roles represented", tone: "cyan" },
    { label: "Users With Overdue Work", value: `${setupTeamUsers.filter((user) => user.overdueActions > 0).length}`, caption: "Needs workload review", tone: "rose" },
    { label: "Default Owners Set", value: `${ownershipRules.length}`, caption: "Owner routing rules", tone: "emerald" },
  ];

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {teamKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Team User List</h2>
            <p>Recovery ownership setup for users, roles, assigned areas, risk owned, and permission level.</p>
          </div>
          <Badge tone="cyan">Recovery owners</Badge>
        </div>
        <div className="team-load-grid team-workload-grid">
          {setupTeamUsers.map((user) => (
            <article className={`team-load-card ${user.tone}`} key={user.id}>
              <div>
                <div className="recovery-row-title">
                  <h3>{user.name}</h3>
                  <Badge tone={user.tone}>{user.role}</Badge>
                </div>
                <p>{user.email} - {user.permissionLevel}</p>
              </div>
              <div className="capture-value-stack">
                <strong>{user.revenueAtRiskOwned}</strong>
                <span>risk owned</span>
              </div>
              <div className="team-load-stats">
                <span>{user.status}</span>
                <span>{user.activeRecoveryActions} active actions</span>
                <span>{user.overdueActions} overdue</span>
                <span>{user.recoveredValueThisMonth} recovered</span>
              </div>
              <div className="team-load-detail">
                <span>Assigned recovery areas</span>
                <p>{user.assignedRecoveryAreas.join(", ")}</p>
              </div>
              <div className="capture-actions">
                <button type="button" className="primary-btn">View owner queue</button>
                <button type="button" className="secondary-btn">Edit role</button>
                <button type="button" className="secondary-btn">Assign recovery area</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="summary-breakdown-grid">
        <article className="summary-breakdown-card">
          <h3>Role Permissions</h3>
          {permissionRules.map((rule) => (
            <div key={rule.id}>
              <span>{rule.permissionName}</span>
              <strong>{rule.ownerAdmin ? "Admin" : "Restricted"}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Ownership Rules</h3>
          {ownershipRules.map((rule) => (
            <div key={rule.id}>
              <span>{rule.trigger}</span>
              <strong>{rule.defaultOwnerRole}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>User Actions</h3>
          <div><span>Add user</span><strong>Visible</strong></div>
          <div><span>Set default owner</span><strong>Visible</strong></div>
          <div><span>Deactivate user</span><strong>Visible</strong></div>
        </article>
      </section>

      <div className="capture-actions">
        <button type="button" className="primary-btn">Add user</button>
        <button type="button" className="secondary-btn">Set default owner</button>
        <button type="button" className="secondary-btn">Deactivate user</button>
      </div>
    </div>
  );
}

function TagsStagesSetup() {
  const tagsKpis: KPI[] = [
    { label: "Active Recovery Stages", value: `${setupRecoveryStages.length}`, caption: "Stage model ready", tone: "cyan" },
    { label: "Buyer Tags", value: `${setupBuyerTags.length}`, caption: "Buyer recovery labels", tone: "emerald" },
    { label: "Product Tags", value: `${setupProductTags.length}`, caption: "Product recovery labels", tone: "amber" },
    { label: "Source Tags", value: `${setupSourceTags.length}`, caption: "Source leakage labels", tone: "cyan" },
    { label: "Untagged Records", value: "31", caption: "Needs recovery labels", tone: "rose" },
    { label: "Smart Tag Suggestions", value: `${setupSmartTagSuggestions.length}`, caption: "Suggested cleanup", tone: "emerald" },
  ];

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {tagsKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Recovery Stages</h2>
            <p>Stages that organize buyer, order, product, and recovery cases into the right next action.</p>
          </div>
          <Badge tone="cyan">Stage setup</Badge>
        </div>
        <div className="capture-card-list">
          {setupRecoveryStages.map((stage) => (
            <article className={`product-card ${stage.tone}`} key={stage.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{stage.stageName}</h3>
                    <Badge tone={stage.tone}>{stage.defaultOwnerRole}</Badge>
                  </div>
                  <p>{stage.purpose}</p>
                  <div className="recovery-meta">
                    <span>{stage.timingRule}</span>
                    <span>{stage.nextRecommendedAction}</span>
                    <span>{stage.linkedTemplates.join(", ")}</span>
                  </div>
                </div>
              </div>
              <div className="capture-actions">
                <button type="button" className="primary-btn">Edit stage</button>
                <button type="button" className="secondary-btn">Create recovery rule from tag</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="summary-breakdown-grid">
        <article className="summary-breakdown-card">
          <h3>Buyer Tags</h3>
          {setupBuyerTags.map((tag) => (
            <div key={tag.id}>
              <span>{tag.tagName}</span>
              <strong>{tag.recordCount}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Product Tags</h3>
          {setupProductTags.map((tag) => (
            <div key={tag.id}>
              <span>{tag.tagName}</span>
              <strong>{tag.productCount}</strong>
            </div>
          ))}
        </article>
        <article className="summary-breakdown-card">
          <h3>Source Tags</h3>
          {setupSourceTags.map((tag) => (
            <div key={tag.id}>
              <span>{tag.tagName}</span>
              <strong>{tag.recordCount}</strong>
            </div>
          ))}
        </article>
      </section>

      <div className="capture-actions">
        <button type="button" className="primary-btn">Add stage</button>
        <button type="button" className="secondary-btn">Add tag</button>
        <button type="button" className="secondary-btn">Merge duplicate tags</button>
      </div>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Smart Tag Suggestions</h2>
            <p>Suggested labels based on product names, sources, buyer activity, delivery notes, and field validation.</p>
          </div>
          <Badge tone="amber">Suggested cleanup</Badge>
        </div>
        <div className="capture-card-list">
          {setupSmartTagSuggestions.map((suggestion) => (
            <article className={`product-card ${suggestion.tone}`} key={suggestion.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{suggestion.condition}</h3>
                    <Badge tone={suggestion.tone}>{suggestion.affectedRecords} records</Badge>
                  </div>
                  <p>{suggestion.reason}</p>
                  <div className="product-tag-list">
                    {suggestion.suggestedTags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="capture-actions">
                <button type="button" className="primary-btn">Apply suggested tags</button>
                <button type="button" className="secondary-btn">Mark records reviewed</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function TemplatesSetup() {
  const [activeTemplateFilter, setActiveTemplateFilter] = useState<TemplateFilter>("All");
  const filteredTemplates = messageTemplates.filter((template) =>
    matchesTemplateFilter(template, activeTemplateFilter),
  );

  const templateKpis: KPI[] = [
    { label: "Active Templates", value: `${messageTemplates.length}`, caption: "Recovery message library", tone: "cyan" },
    { label: "Recovery Types Covered", value: `${new Set(messageTemplates.map((template) => template.recoveryType)).size}`, caption: "Use cases covered", tone: "emerald" },
    { label: "Templates Needing Review", value: `${messageTemplates.filter((template) => template.approvalStatus === "Needs Review").length}`, caption: "Needs approval", tone: "rose" },
    { label: "Most Used Template", value: "Payment", caption: "Payment reminder", tone: "amber" },
    { label: "Approved Templates", value: `${messageTemplates.filter((template) => template.approvalStatus === "Approved").length}`, caption: "Ready for team use", tone: "emerald" },
    { label: "Missing Template Gaps", value: "3", caption: "Needs copy coverage", tone: "rose" },
  ];

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {templateKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Template filters">
          {templateFilters.map((filter) => (
            <button
              className={`queue-tab ${activeTemplateFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveTemplateFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredTemplates.length} templates</Badge>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Templates</h2>
            <p>Approved message templates for each recovery situation and channel.</p>
          </div>
          <Badge tone="emerald">Message template library</Badge>
        </div>
        <div className="capture-card-list">
          {filteredTemplates.map((template) => (
            <article className={`product-card ${template.tone}`} key={template.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{template.templateName}</h3>
                    <Badge tone={template.tone}>{template.approvalStatus}</Badge>
                  </div>
                  <p>{template.previewText}</p>
                  <div className="recovery-meta">
                    <span>{template.recoveryType}</span>
                    <span>{template.industryFit}</span>
                    <span>{template.channel}</span>
                    <span>{template.owner}</span>
                    <span>{template.usageCount} uses</span>
                    <span>{template.linkedStageTag}</span>
                  </div>
                </div>
              </div>
              <div className="capture-actions">
                <button type="button" className="primary-btn">Copy template</button>
                <button type="button" className="secondary-btn">Edit template</button>
                <button type="button" className="secondary-btn">Duplicate template</button>
                <button type="button" className="secondary-btn">Approve template</button>
                <button type="button" className="secondary-btn">Link to stage/tag</button>
                <button type="button" className="secondary-btn">Mark needs review</button>
              </div>
            </article>
          ))}
        </div>
        <div className="capture-actions">
          <button type="button" className="primary-btn">Create template</button>
        </div>
      </section>
    </div>
  );
}

function SetupImportExport() {
  const cleanRecords = setupImportJobs.reduce((total, job) => total + (job.rowsProcessed - job.issuesFound), 0);
  const issues = setupImportJobs.reduce((total, job) => total + job.issuesFound, 0);
  const duplicateRecords = importValidationIssues.find((issue) => issue.issueType === "Duplicate buyer")?.affectedRows ?? 0;
  const missingFields = importValidationIssues
    .filter((issue) => issue.issueType.toLowerCase().includes("missing"))
    .reduce((total, issue) => total + issue.affectedRows, 0);

  const importExportKpis: KPI[] = [
    { label: "Last Import Rows", value: "482", caption: "Latest buyer/customer list", tone: "cyan" },
    { label: "Clean Records", value: `${cleanRecords}`, caption: "Validated rows", tone: "emerald" },
    { label: "Import Issues", value: `${issues}`, caption: "Needs review", tone: "rose" },
    { label: "Duplicate Records", value: `${duplicateRecords}`, caption: "Merge review needed", tone: "amber" },
    { label: "Missing Required Fields", value: `${missingFields}`, caption: "Field validation issues", tone: "rose" },
    { label: "Exportable Data Sets", value: `${setupExportDatasets.length}`, caption: "Ready for movement", tone: "emerald" },
  ];

  return (
    <div className="recovery-page">
      <section className="recovery-kpi-grid capture-kpi-grid revenue-kpi-grid">
        {importExportKpis.map((item) => (
          <KpiCard key={item.label} item={item} />
        ))}
      </section>

      <section className="two-column-grid import-export-grid">
        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Import Center</h2>
              <p>System-wide onboarding and field validation for buyers, orders, products, tags, templates, and recovery cases.</p>
            </div>
            <Badge tone="amber">Import mapping</Badge>
          </div>
          <div className="import-step-grid">
            <div><span>Upload file</span><strong>CSV / XLSX placeholder / JSON placeholder</strong></div>
            <div><span>Choose import type</span><strong>Buyer, inquiry, order, product, case, tag, template, source, team</strong></div>
            <div><span>Map columns</span><strong>Buyer, source, owner, product/SKU, recovery stage</strong></div>
            <div><span>Validate data</span><strong>Missing fields, duplicates, contact format, unmapped columns</strong></div>
          </div>
          <div className="capture-actions">
            <button type="button" className="primary-btn">Upload file</button>
            <button type="button" className="secondary-btn">Map columns</button>
            <button type="button" className="secondary-btn">Validate import</button>
            <button type="button" className="secondary-btn">Confirm import</button>
          </div>
          <div className="capture-card-list source-fix-callout">
            {importValidationIssues.map((issue) => (
              <article className={`product-card ${issue.tone}`} key={issue.id}>
                <div className="capture-card-main">
                  <div>
                    <div className="recovery-row-title">
                      <h3>{issue.issueType}</h3>
                      <Badge tone={issue.tone}>{issue.severity}</Badge>
                    </div>
                    <p>{issue.recommendedFix}</p>
                    <div className="recovery-meta">
                      <span>{issue.affectedRows} affected rows</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="glass-card panel-card">
          <div className="panel-header">
            <div>
              <h2>Export Center</h2>
              <p>Export datasets for buyers, recovery cases, product data, reports, templates, team workload, and sync logs.</p>
            </div>
            <Badge tone="emerald">Export dataset</Badge>
          </div>
          <div className="export-option-list">
            {setupExportDatasets.map((dataset) => (
              <article className={`export-option-card ${dataset.tone}`} key={dataset.id}>
                <div>
                  <div className="recovery-row-title">
                    <h3>{dataset.datasetName}</h3>
                    <Badge tone={dataset.tone}>{dataset.records} records</Badge>
                  </div>
                  <p>{dataset.recoveryUse}</p>
                  <div className="recovery-meta">
                    {dataset.formats.map((format) => (
                      <span key={format}>{format}</span>
                    ))}
                  </div>
                </div>
                <button type="button" className="secondary-btn">Export</button>
              </article>
            ))}
          </div>
          <div className="capture-actions">
            <button type="button" className="primary-btn">Export CSV</button>
            <button type="button" className="secondary-btn">Export XLSX</button>
            <button type="button" className="secondary-btn">Export JSON</button>
            <button type="button" className="secondary-btn">Export PDF</button>
          </div>
        </article>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Recent Import / Export Activity</h2>
            <p>Recent system-wide data movement, validation issues, status, owner, and next action.</p>
          </div>
          <Badge tone="cyan">Activity log</Badge>
        </div>
        <div className="capture-card-list">
          {setupImportJobs.map((job) => (
            <article className={`product-card ${job.tone}`} key={job.id}>
              <div className="capture-card-main">
                <div>
                  <div className="recovery-row-title">
                    <h3>{job.activityType}: {job.dataSet}</h3>
                    <Badge tone={job.tone}>{job.status}</Badge>
                  </div>
                  <p>{job.nextAction}</p>
                  <div className="recovery-meta">
                    <span>{job.rowsProcessed} rows processed</span>
                    <span>{job.issuesFound} issues found</span>
                    <span>{job.owner}</span>
                    <span>{job.timestamp}</span>
                  </div>
                </div>
              </div>
              <div className="capture-actions">
                <button type="button" className="primary-btn">Download issue report</button>
                <button type="button" className="secondary-btn">Review issues</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function RecoveryActivityPage({ activities }: { activities: RecoveryActivity[] }) {
  const [activeActivityFilter, setActiveActivityFilter] = useState<ActivityFilter>("All");
  const filteredActivities = activities.filter((activity) =>
    matchesActivityFilter(activity, activeActivityFilter),
  );

  return (
    <div className="recovery-page">
      <section className="activity-summary-strip">
        {activitySummary.map((item) => (
          <article className="activity-summary-card" key={item.label}>
            <span className={`tiny-dot ${item.tone}`} />
            <div>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
              <small>{item.caption}</small>
            </div>
          </article>
        ))}
      </section>

      <section className="queue-toolbar">
        <div className="queue-tabs" aria-label="Recovery activity filters">
          {activityFilters.map((filter) => (
            <button
              className={`queue-tab ${activeActivityFilter === filter ? "active" : ""}`}
              key={filter}
              onClick={() => setActiveActivityFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>
        <Badge tone="cyan">{filteredActivities.length} visible events</Badge>
      </section>

      <section className="glass-card panel-card">
        <div className="panel-header">
          <div>
            <h2>Recovery Activity</h2>
            <p>External automation events, sync health, reporting signals, and team updates.</p>
          </div>
          <Badge tone="emerald">{activities.length} events today</Badge>
        </div>

        <div className="recovery-activity-list full activity-audit-list">
          {filteredActivities.map((activity) => (
            <div className="activity-row activity-audit-row" key={activity.id}>
              <span className={`activity-node ${activity.tone}`} />
              <div>
                <div className="activity-row-top">
                  <h3>{activity.title}</h3>
                  <span>{activity.timestamp}</span>
                </div>
                <p>{activity.description}</p>
                <div className="recovery-meta">
                  <span>{activity.impactBadge}</span>
                  <span>{activity.relatedRecord}</span>
                  <span>{activity.owner ?? "External automation"}</span>
                  <span>{activity.status}</span>
                </div>
                <p className="queue-next-action">{activity.nextAction}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  const relatedTasks = recoveryTasks.slice(0, 3);

  return (
    <section className="glass-card panel-card placeholder-panel">
      <div className="panel-header">
        <div>
          <h2>{title}</h2>
          <p>This recovery surface will use the same leak, owner, source, and recovered-value model as it is built out.</p>
        </div>
        <Badge tone="cyan">Recovery surface</Badge>
      </div>

      <div className="recovery-list">
        {relatedTasks.map((task) => (
          <div className="recovery-row" key={`${title}-${task.id}`}>
            <div className="recovery-row-main">
              <Avatar name={task.customer} />
              <div>
                <h3>{task.productInterest}</h3>
                <p>{task.recommendedNextAction}</p>
              </div>
            </div>
            <strong>{task.estimatedRevenueAtRisk}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  const [openGroup, setOpenGroup] = useState<string>("Command Center");
  const [activePage, setActivePage] = useState<string>("Recovery Overview");
  const [activityFeed, setActivityFeed] = useState<RecoveryActivity[]>(activities);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMessage, setExportMessage] = useState("");
  const [quickModal, setQuickModal] = useState<"export" | "capture" | null>(null);
  const [quickToast, setQuickToast] = useState("");
  const [captureForm, setCaptureForm] = useState({
    buyerName: "",
    estimatedValue: "",
    owner: "",
    recoveryNote: "",
    source: "",
  });

  const pageSubtitle =
    activePage === "Import / Export" && openGroup === "Setup"
      ? "System-wide import mapping, field validation, export datasets, and recent data movement."
      : activePage === "Import / Export" && openGroup === "Product Intelligence"
        ? pageSubtitles[activePage] ??
          "Product-specific catalog, SKU, category, tag, and product demand data movement."
        : pageSubtitles[activePage] ??
          "A focused revenue recovery workspace for buyer lifecycle opportunities and reporting visibility.";

  function toggleGroup(title: string) {
    setOpenGroup((current) => (current === title ? "" : title));
  }

  function addRecoveryActivity(activity: NewRecoveryActivity) {
    setActivityFeed((current) => [
      {
        ...activity,
        id: `ACT-${Date.now()}`,
        timestamp: "Just now",
      },
      ...current,
    ]);
  }

  async function copyOverviewReportSummary() {
    const summary = [
      "Recovery Overview Report",
      "",
      "Included sections:",
      "- KPIs",
      "- Highest Risk Leaks",
      "- Team Recovery Load",
      "- Automation & Source Visibility",
      "- Recovery Activity",
      "",
      ...kpis.map((item) => `${item.label}: ${item.value} (${item.caption})`),
      `Recent activity events: ${activityFeed.length}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setQuickToast("Report summary copied");
    } catch {
      setQuickToast("Copy failed. Please copy manually.");
    }

    addRecoveryActivity({
      category: "Reports",
      title: "Recovery overview report prepared",
      description: "Copied a frontend-only Recovery Overview report summary.",
      impactBadge: kpis[1]?.value ?? "$42.7K recovered",
      relatedRecord: "Recovery Overview",
      owner: "Operations",
      status: "Prepared",
      nextAction: "Share report summary with the recovery owner team.",
      tone: "cyan",
    });
  }

  function handleCaptureSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const buyerName = captureForm.buyerName.trim() || "New buyer";
    const source = captureForm.source.trim() || "Manual capture";
    const estimatedValue = captureForm.estimatedValue.trim() || "Value pending";
    const owner = captureForm.owner.trim() || "Unassigned";
    const note = captureForm.recoveryNote.trim() || "Review inquiry and assign the next recovery action.";

    addRecoveryActivity({
      category: "Inquiries",
      title: "Missed inquiry captured",
      description: `${buyerName} was captured from ${source}.`,
      impactBadge: estimatedValue,
      relatedRecord: "Manual capture - Recovery Overview",
      owner,
      status: "Captured",
      nextAction: note,
      tone: "cyan",
    });

    setQuickToast("Missed inquiry captured locally");
    setCaptureForm({
      buyerName: "",
      estimatedValue: "",
      owner: "",
      recoveryNote: "",
      source: "",
    });
    setQuickModal(null);
  }
const overviewReportTaskIds = [
  "RR-1041",
  "RR-1043",
  "RR-1042",
  "RR-1045",
  "RR-1044",
];

const overviewReportTasks = overviewReportTaskIds
  .map((id) => recoveryTasks.find((task) => task.id === id))
  .filter((task): task is RecoveryTask => Boolean(task));

function buildRecoveryOverviewReport() {
  return [
    "ALTYNX RECOVERY OVERVIEW REPORT",
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "KPIs",
    ...kpis.map((item) => `- ${item.label}: ${item.value} (${item.caption})`),
    "",
    "Highest Risk Leaks",
    ...overviewReportTasks.map(
      (task) =>
        `- ${task.customer}: ${task.estimatedRevenueAtRisk} at risk | ${task.leakType} | Owner: ${task.assignedOwner} | Next: ${task.recommendedNextAction}`,
    ),
    "",
    "Team Recovery Load",
    ...teamUsers.map(
      (user) =>
        `- ${user.name}: ${user.activeTasks} active, ${user.overdueTasks} overdue, ${user.revenueAtRisk} at risk, ${user.recoveredThisMonth} recovered`,
    ),
    "",
    "Recent Recovery Activity",
    ...activityFeed.slice(0, 6).map(
      (activity) =>
        `- ${activity.title}: ${activity.description} | ${activity.impactBadge} | ${activity.status}`,
    ),
  ].join("\n");
}

function openExportReport() {
  setExportMessage("");
  setIsExportModalOpen(true);
}

async function copyRecoveryOverviewReport() {
  const report = buildRecoveryOverviewReport();

  try {
    await navigator.clipboard.writeText(report);
    setExportMessage("Report summary copied to clipboard.");

    addRecoveryActivity({
      category: "Reports",
      title: "Recovery overview report copied",
      description: "Owner-level recovery overview summary was prepared and copied.",
      impactBadge: "$18.4K at risk",
      relatedRecord: "Recovery Overview",
      owner: "Operations",
      status: "Copied",
      nextAction: "Share report summary with the brand owner or internal recovery lead.",
      tone: "emerald",
    });
  } catch {
    setExportMessage("Copy failed. Please select and copy the report manually.");
  }
}

function closeExportReport() {
  setIsExportModalOpen(false);
  setExportMessage("");
}

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <img
            className="brand-logo"
            src="https://res.cloudinary.com/dojm1aiw2/image/upload/v1777510190/LOGO_Altynx_for_Developers_Black_cwc31f.png"
            alt="Altynx"
          />
        </div>

        <nav className="sidebar-menu" aria-label="Altynx navigation">
          {sidebarGroups.map((group) => {
            const isOpen = openGroup === group.title;

            return (
              <div className={`side-group ${isOpen ? "is-open" : ""}`} key={group.title}>
                <button
                  type="button"
                  className="side-group-trigger"
                  onClick={() => toggleGroup(group.title)}
                  aria-expanded={isOpen}
                >
                  <span className="side-title">
                    <span className="side-dot" />
                    <span>{group.title}</span>
                  </span>

                  <span className="side-arrow" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M5 7.5L10 12.5L15 7.5"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </span>
                </button>

                <div className="side-submenu">
                  <div className="side-submenu-inner">
                    {group.items.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setActivePage(item)}
                        className={`side-subitem ${activePage === item ? "is-active" : ""}`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      <section className="content">
        <header className="dashboard-header">
          <div className="header-copy">
            <div className="title-row">
              <h1>{activePage}</h1>
              <span className="status-chip">
                <span className="status-dot" />
                Sync visible
              </span>
            </div>
            <p>{pageSubtitle}</p>
          </div>

          <div className="header-actions">
            <button className="secondary-btn" onClick={openExportReport} type="button">
              Export report
            </button>
            <button
              className="secondary-btn"
              onClick={() => setActivePage("Today's Recovery Queue")}
              type="button"
            >
              Open Recovery Queue
            </button>
            <button className="primary-btn" onClick={() => setQuickModal("capture")} type="button">
              Capture Missed Inquiry
            </button>
          </div>
        </header>

        {quickToast ? (
          <div className="glass-card panel-card" role="status">
            <p>{quickToast}</p>
          </div>
        ) : null}
{isExportModalOpen ? (
  <div
    aria-modal="true"
    role="dialog"
    onClick={closeExportReport}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "stretch",
      background: "rgba(17, 17, 17, 0.22)",
      padding: 20,
    }}
  >
    <div
      className="glass-card panel-card"
      onClick={(event) => event.stopPropagation()}
      style={{
        width: "min(560px, 100%)",
        maxHeight: "100%",
        overflowY: "auto",
        background: "#ffffff",
        border: "1px solid #e8e8e5",
        boxShadow: "0 24px 70px rgba(17, 17, 17, 0.18)",
      }}
    >
      <div className="panel-header">
        <div>
          <h2>Export Recovery Overview Report</h2>
          <p>
            Frontend-only report summary for KPIs, highest-risk leaks, team load,
            source visibility, and recovery activity.
          </p>
        </div>
        <Badge tone="amber">Preview</Badge>
      </div>

      <div className="summary-breakdown-grid" style={{ gridTemplateColumns: "1fr" }}>
        <article className="summary-breakdown-card">
          <h3>Included sections</h3>
          <div>
            <span>KPIs</span>
            <strong>{kpis.length} metrics</strong>
          </div>
          <div>
            <span>Highest Risk Leaks</span>
            <strong>{overviewReportTasks.length} records</strong>
          </div>
          <div>
            <span>Team Recovery Load</span>
            <strong>{teamUsers.length} owners</strong>
          </div>
          <div>
            <span>Recovery Activity</span>
            <strong>{activityFeed.length} events</strong>
          </div>
        </article>

        <article className="summary-breakdown-card">
          <h3>Report preview</h3>
          {kpis.map((item) => (
            <div key={`export-${item.label}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </article>

        <article className="summary-breakdown-card">
          <h3>Top recovery leaks</h3>
          {overviewReportTasks.slice(0, 4).map((task) => (
            <div key={`export-task-${task.id}`}>
              <span>{task.customer}</span>
              <strong>{task.estimatedRevenueAtRisk}</strong>
            </div>
          ))}
        </article>
      </div>

      {exportMessage ? (
        <p
          style={{
            margin: "16px 0 0",
            color: "#111111",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {exportMessage}
        </p>
      ) : null}

      <div className="capture-actions" style={{ marginTop: 18 }}>
        <button className="primary-btn" onClick={copyRecoveryOverviewReport} type="button">
          Copy report summary
        </button>
        <button className="secondary-btn" onClick={closeExportReport} type="button">
          Close
        </button>
      </div>
    </div>
  </div>
) : null}

        {activePage === "Recovery Overview" ? (
          <RecoveryOverview
            activities={activityFeed}
            onActivity={addRecoveryActivity}
            onNavigate={setActivePage}
          />
        ) : activePage === "Today's Recovery Queue" ? (
          <TodaysRecoveryQueue />
        ) : activePage === "Inquiry Inbox" ? (
          <InquiryInbox onActivity={addRecoveryActivity} />
        ) : activePage === "Product Demand" ? (
          <ProductDemand onActivity={addRecoveryActivity} />
        ) : activePage === "Source Leak Tracking" ? (
          <SourceLeakTracking onActivity={addRecoveryActivity} />
        ) : activePage === "Product Catalog" ? (
          <ProductCatalog />
        ) : activePage === "SKU / Variant Sheet" ? (
          <SKUVariantSheet />
        ) : activePage === "Categories & Tags" ? (
          <CategoriesTags />
        ) : activePage === "Import / Export" && openGroup === "Product Intelligence" ? (
          <ProductImportExport />
        ) : activePage === "Brand Settings" ? (
          <BrandSettingsPage />
        ) : activePage === "Team Users" ? (
          <TeamUsersSetup />
        ) : activePage === "Tags & Stages" ? (
          <TagsStagesSetup />
        ) : activePage === "Templates" ? (
          <TemplatesSetup />
        ) : activePage === "Import / Export" && openGroup === "Setup" ? (
          <SetupImportExport />
        ) : activePage === "Buyer Profiles" ? (
          <BuyerProfiles />
        ) : activePage === "Revenue Segments" ? (
          <RevenueSegments />
        ) : activePage === "Buyer Value" ? (
          <BuyerValue />
        ) : activePage === "Revenue Pipeline" ? (
          <RevenuePipeline onActivity={addRecoveryActivity} />
        ) : activePage === "Follow-up Recovery" ? (
          <FollowUpRecovery onActivity={addRecoveryActivity} />
        ) : activePage === "Payment Recovery" ? (
          <PaymentRecovery onActivity={addRecoveryActivity} />
        ) : activePage === "Recovered Revenue" ? (
          <RecoveredRevenue />
        ) : activePage === "Order Risk Monitor" ? (
          <OrderRiskMonitor />
        ) : activePage === "Delivery Follow-up" ? (
          <DeliveryFollowUp />
        ) : activePage === "Reviews / Referrals / UGC" ? (
          <ReviewsReferralsUGC />
        ) : activePage === "Refill Opportunities" ? (
          <RefillOpportunities />
        ) : activePage === "Restock Waitlist" ? (
          <RestockWaitlist />
        ) : activePage === "Inactive Buyer Recovery" ? (
          <InactiveBuyerRecovery />
        ) : activePage === "Assigned Recovery Actions" ? (
          <AssignedRecoveryActions />
        ) : activePage === "Recovery Threads" ? (
          <RecoveryThreads />
        ) : activePage === "Team Load" ? (
          <TeamLoad />
        ) : activePage === "Automation Health" ? (
          <AutomationHealth />
        ) : activePage === "Revenue Leak Reports" ? (
          <RevenueLeakReports />
        ) : activePage === "Monthly Summary" ? (
          <MonthlySummary />
        ) : activePage === "Recovery Activity" ? (
          <RecoveryActivityPage activities={activityFeed} />
        ) : (
          <PlaceholderPage title={activePage} />
        )}

        {quickModal === "export" ? (
          <ModalShell
            footer={
              <>
                <button className="primary-btn" onClick={copyOverviewReportSummary} type="button">
                  Copy report summary
                </button>
                <button className="secondary-btn" onClick={() => setQuickModal(null)} type="button">
                  Close
                </button>
              </>
            }
            onClose={() => setQuickModal(null)}
            title="Export Recovery Overview Report"
          >
            <div style={modalGridStyle}>
              <DetailField label="Report type" value="Recovery Overview" />
              <DetailField label="Format" value="Clipboard summary" />
            </div>
            <div className="detail-callout">
              <span>Included sections</span>
              <div className="recovery-meta">
                <span>KPIs</span>
                <span>Highest Risk Leaks</span>
                <span>Team Recovery Load</span>
                <span>Automation & Source Visibility</span>
                <span>Recovery Activity</span>
              </div>
            </div>
          </ModalShell>
        ) : null}

        {quickModal === "capture" ? (
          <div style={modalOverlayStyle} role="presentation">
            <article aria-modal="true" className="capture-modal-shell" role="dialog">
              <div className="capture-modal-header">
                <div>
                  <h2>Capture Missed Inquiry</h2>
                </div>
                <button className="secondary-btn" onClick={() => setQuickModal(null)} type="button">
                  Close
                </button>
              </div>
              <div className="capture-modal-body">
                <form onSubmit={handleCaptureSubmit}>
                  <div className="capture-modal-grid">
                    <div className="capture-field">
                      <label htmlFor="capture-buyer-name">Buyer name</label>
                      <input
                        id="capture-buyer-name"
                        onChange={(event) => setCaptureForm((current) => ({ ...current, buyerName: event.target.value }))}
                        placeholder="Sophia Bennett"
                        type="text"
                        value={captureForm.buyerName}
                      />
                    </div>
                    <div className="capture-field">
                      <label htmlFor="capture-source">Source</label>
                      <input
                        id="capture-source"
                        onChange={(event) => setCaptureForm((current) => ({ ...current, source: event.target.value }))}
                        placeholder="Instagram DM"
                        type="text"
                        value={captureForm.source}
                      />
                    </div>
                    <div className="capture-field">
                      <label htmlFor="capture-estimated-value">Estimated value</label>
                      <input
                        id="capture-estimated-value"
                        onChange={(event) => setCaptureForm((current) => ({ ...current, estimatedValue: event.target.value }))}
                        placeholder="$850"
                        type="text"
                        value={captureForm.estimatedValue}
                      />
                    </div>
                    <div className="capture-field">
                      <label htmlFor="capture-owner">Owner</label>
                      <input
                        id="capture-owner"
                        onChange={(event) => setCaptureForm((current) => ({ ...current, owner: event.target.value }))}
                        placeholder="Amara Shah"
                        type="text"
                        value={captureForm.owner}
                      />
                    </div>
                    <div className="capture-field capture-field-full">
                      <label htmlFor="capture-recovery-note">Recovery note</label>
                      <textarea
                        id="capture-recovery-note"
                        onChange={(event) => setCaptureForm((current) => ({ ...current, recoveryNote: event.target.value }))}
                        placeholder="Add context, next action, or message reminder."
                        value={captureForm.recoveryNote}
                      />
                    </div>
                  </div>
                  <div className="capture-modal-actions">
                    <button className="primary-btn" type="submit">
                      Capture inquiry
                    </button>
                    <button className="secondary-btn" onClick={() => setQuickModal(null)} type="button">
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </article>
          </div>
        ) : null}
      </section>
    </main>
  );
}
