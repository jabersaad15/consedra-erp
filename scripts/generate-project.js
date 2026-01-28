/**
 * Consedra ERP - Project File Generator
 * Generates all source files for the complete ERP platform
 * Run: node scripts/generate-project.js
 */
const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  ✓ ${filePath}`);
}

const ROOT = path.resolve(__dirname, '..');

// ===========================
// SHARED TYPES PACKAGE
// ===========================
console.log('\n📦 Shared Types Package');

writeFile(path.join(ROOT, 'packages/shared/src/enums.ts'), `
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OWNER = 'OWNER',
  HEAD_OF_DEPARTMENT = 'HEAD_OF_DEPARTMENT',
  EMPLOYEE = 'EMPLOYEE',
  OPERATIONS_MANAGER = 'OPERATIONS_MANAGER',
  FACTORY_MANAGER = 'FACTORY_MANAGER',
  PRODUCTION_MANAGER = 'PRODUCTION_MANAGER',
  AREA_MANAGER = 'AREA_MANAGER',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  ASSISTANT_BRANCH_MANAGER = 'ASSISTANT_BRANCH_MANAGER',
  CASHIER = 'CASHIER',
  FINANCE_MANAGER = 'FINANCE_MANAGER',
  HR_MANAGER = 'HR_MANAGER',
  IT_MANAGER = 'IT_MANAGER',
  MARKETING_MANAGER = 'MARKETING_MANAGER',
}

export enum Scope {
  COMPANY = 'COMPANY',
  DEPARTMENT = 'DEPARTMENT',
  REGION = 'REGION',
  BRANCH = 'BRANCH',
  FACTORY = 'FACTORY',
  PROJECT = 'PROJECT',
}

export enum Permission {
  VIEW = 'view',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve',
  EXPORT = 'export',
  MANAGE_USERS = 'manage-users',
  MANAGE_ROLES = 'manage-roles',
  MANAGE_MODULES = 'manage-modules',
  MANAGE_SETTINGS = 'manage-settings',
  ASSIGN = 'assign',
  CLOSE = 'close',
  TRANSFER = 'transfer',
  IMPERSONATE = 'impersonate',
}

export enum ApprovalStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  ESCALATED = 'ESCALATED',
}

export const RTL_LOCALES = ['ar', 'ur', 'fa'];
`.trim());

writeFile(path.join(ROOT, 'packages/shared/src/types.ts'), `
export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
  tenantSlug?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  locale: string;
  tenantId?: string;
  isSuperAdmin: boolean;
  roles: { roleId: string; roleName: string; scopeType: string; scopeId?: string }[];
}
`.trim());

// ===========================
// API - Package & Config
// ===========================
console.log('\n🔧 API Configuration');

writeFile(path.join(ROOT, 'apps/api/package.json'), JSON.stringify({
  name: "@consedra/api",
  version: "1.0.0",
  private: true,
  scripts: {
    dev: "nest start --watch",
    build: "nest build",
    start: "node dist/main",
    "start:prod": "node dist/main",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:studio": "prisma studio",
    "prisma:generate": "prisma generate",
    "prisma:push": "prisma db push",
    clean: "rm -rf dist"
  },
  prisma: {
    seed: "ts-node prisma/seed.ts"
  },
  dependencies: {
    "@nestjs/common": "^10.4.0",
    "@nestjs/core": "^10.4.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.4.0",
    "@nestjs/swagger": "^7.4.0",
    "@nestjs/throttler": "^6.0.0",
    "@nestjs/schedule": "^4.1.0",
    "@prisma/client": "^5.22.0",
    passport: "^0.7.0",
    "passport-jwt": "^4.0.1",
    bcryptjs: "^2.4.3",
    "class-validator": "^0.14.1",
    "class-transformer": "^0.5.1",
    "cookie-parser": "^1.4.7",
    multer: "^1.4.5-lts.1",
    uuid: "^10.0.0",
    exceljs: "^4.4.0",
    pdfkit: "^0.15.0",
    "reflect-metadata": "^0.2.2",
    rxjs: "^7.8.1"
  },
  devDependencies: {
    "@nestjs/cli": "^10.4.0",
    "@nestjs/schematics": "^10.2.0",
    "@types/bcryptjs": "^2.4.6",
    "@types/cookie-parser": "^1.4.7",
    "@types/multer": "^1.4.12",
    "@types/node": "^22.0.0",
    "@types/passport-jwt": "^4.0.1",
    "@types/uuid": "^10.0.0",
    prisma: "^5.22.0",
    "ts-node": "^10.9.2",
    typescript: "^5.7.0"
  }
}, null, 2));

writeFile(path.join(ROOT, 'apps/api/tsconfig.json'), JSON.stringify({
  compilerOptions: {
    module: "commonjs",
    declaration: true,
    removeComments: true,
    emitDecoratorMetadata: true,
    experimentalDecorators: true,
    allowSyntheticDefaultImports: true,
    target: "ES2022",
    sourceMap: true,
    outDir: "./dist",
    baseUrl: "./",
    incremental: true,
    skipLibCheck: true,
    strictNullChecks: true,
    noImplicitAny: true,
    strictBindCallApply: true,
    forceConsistentCasingInFileNames: true,
    noFallthroughCasesInSwitch: true,
    paths: { "@/*": ["./src/*"] }
  }
}, null, 2));

writeFile(path.join(ROOT, 'apps/api/nest-cli.json'), JSON.stringify({
  "$schema": "https://json.schemastore.org/nest-cli",
  collection: "@nestjs/schematics",
  sourceRoot: "src"
}, null, 2));

writeFile(path.join(ROOT, 'apps/api/.env.example'), `DATABASE_URL=postgresql://consedra:consedra_dev_2024@localhost:5432/consedra
JWT_SECRET=consedra-jwt-secret-change-in-production
JWT_REFRESH_SECRET=consedra-refresh-secret-change-in-production
PORT=4000
NODE_ENV=development
STORAGE_PATH=./storage
REDIS_URL=redis://localhost:6379`);

writeFile(path.join(ROOT, 'apps/api/Dockerfile'), `FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile 2>/dev/null || pnpm install

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
WORKDIR /app/apps/api
RUN npx prisma generate
RUN pnpm build

FROM base AS runner
WORKDIR /app
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/node_modules ./node_modules
COPY --from=build /app/apps/api/prisma ./prisma
COPY --from=build /app/apps/api/package.json ./
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]`);

// ===========================
// API - Prisma Schema
// ===========================
console.log('\n🗃️  Prisma Schema');

writeFile(path.join(ROOT, 'apps/api/prisma/schema.prisma'), `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============ PLATFORM ============

model Tenant {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  logoUrl   String?
  isActive  Boolean  @default(true)
  ownerId   String?
  settings  Json?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  owner              User?               @relation("TenantOwner", fields: [ownerId], references: [id])
  users              User[]              @relation("TenantUsers")
  regions            Region[]
  branches           Branch[]
  departments        Department[]
  positions          Position[]
  roles              RoleDefinition[]
  enabledModules     TenantModule[]
  workflows          Workflow[]
  formDefinitions    FormDefinition[]
  reportDefinitions  ReportDefinition[]
  projects           Project[]
  tasks              Task[]
  documents          Document[]
  notifications      Notification[]
  auditLogs          AuditLog[]
  connectors         Connector[]
  checklists         Checklist[]
  inspections        Inspection[]
  issues             Issue[]
  employees          Employee[]
  leaveRequests      LeaveRequest[]
  expenses           Expense[]
  costCenters        CostCenter[]
  journalEntries     JournalEntry[]
  suppliers          Supplier[]
  purchaseRequisitions PurchaseRequisition[]
  purchaseOrders     PurchaseOrder[]
  inventoryItems     InventoryItem[]
  warehouses         Warehouse[]
  stockLevels        StockLevel[]
  stockTransfers     StockTransfer[]
  salesSummaries     SalesSummary[]
  crmTickets         CrmTicket[]
  campaigns          Campaign[]
  coupons            Coupon[]
  supportTickets     SupportTicket[]
  itAssets           ITAsset[]
  qualityChecklists  QualityChecklist[]
  nonconformances    Nonconformance[]
  recipes            Recipe[]
  productionOrders   ProductionOrder[]
  approvalRequests   ApprovalRequest[]
  formSubmissions    FormSubmission[]
  ownershipTransfers OwnershipTransfer[]

  @@map("tenants")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String
  firstName     String
  lastName      String
  avatarUrl     String?
  locale        String    @default("en")
  isSuperAdmin  Boolean   @default(false)
  isActive      Boolean   @default(true)
  tenantId      String?
  lastLoginAt   DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  tenant            Tenant?          @relation("TenantUsers", fields: [tenantId], references: [id])
  ownedTenants      Tenant[]         @relation("TenantOwner")
  roleAssignments   UserRole[]
  refreshTokens     RefreshToken[]
  auditLogs         AuditLog[]       @relation("AuditActor")
  notifications     Notification[]
  documents         Document[]       @relation("DocumentUploader")

  @@map("users")
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  revokedAt DateTime?
  createdAt DateTime @default(now())
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@map("refresh_tokens")
}

model OwnershipTransfer {
  id           String    @id @default(uuid())
  tenantId     String
  fromUserId   String
  toUserEmail  String
  token        String    @unique
  reason       String
  status       String    @default("PENDING")
  expiresAt    DateTime
  confirmedAt  DateTime?
  createdAt    DateTime  @default(now())
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@map("ownership_transfers")
}

// ============ RBAC ============

model RoleDefinition {
  id          String   @id @default(uuid())
  name        String
  key         String
  description String?
  isSystem    Boolean  @default(false)
  tenantId    String?
  createdAt   DateTime @default(now())
  tenant      Tenant?          @relation(fields: [tenantId], references: [id])
  permissions RolePermission[]
  userRoles   UserRole[]
  @@unique([key, tenantId])
  @@map("role_definitions")
}

model PermissionDefinition {
  id          String   @id @default(uuid())
  key         String   @unique
  name        String
  category    String
  description String?
  rolePermissions RolePermission[]
  @@map("permission_definitions")
}

model RolePermission {
  id           String @id @default(uuid())
  roleId       String
  permissionId String
  role       RoleDefinition       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission PermissionDefinition @relation(fields: [permissionId], references: [id], onDelete: Cascade)
  @@unique([roleId, permissionId])
  @@map("role_permissions")
}

model UserRole {
  id        String  @id @default(uuid())
  userId    String
  roleId    String
  scopeType String  @default("COMPANY")
  scopeId   String? @default("")
  user User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  role RoleDefinition @relation(fields: [roleId], references: [id], onDelete: Cascade)
  @@unique([userId, roleId, scopeType, scopeId])
  @@map("user_roles")
}

// ============ ORG STRUCTURE ============

model Region {
  id       String @id @default(uuid())
  name     String
  code     String
  tenantId String
  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  branches Branch[]
  @@unique([code, tenantId])
  @@map("regions")
}

model Branch {
  id        String  @id @default(uuid())
  name      String
  code      String
  type      String  @default("BRANCH")
  regionId  String
  tenantId  String
  address   String?
  phone     String?
  managerId String?
  isActive  Boolean @default(true)
  tenant     Tenant  @relation(fields: [tenantId], references: [id])
  region     Region  @relation(fields: [regionId], references: [id])
  warehouses Warehouse[]
  @@unique([code, tenantId])
  @@map("branches")
}

model Department {
  id       String  @id @default(uuid())
  name     String
  code     String
  tenantId String
  headId   String?
  tenant    Tenant     @relation(fields: [tenantId], references: [id])
  positions Position[]
  @@unique([code, tenantId])
  @@map("departments")
}

model Position {
  id           String @id @default(uuid())
  title        String
  departmentId String
  tenantId     String
  tenant     Tenant     @relation(fields: [tenantId], references: [id])
  department Department @relation(fields: [departmentId], references: [id])
  @@map("positions")
}

// ============ MODULE MANAGER ============

model TenantModule {
  id        String  @id @default(uuid())
  tenantId  String
  moduleKey String
  isEnabled Boolean @default(true)
  order     Int     @default(0)
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@unique([tenantId, moduleKey])
  @@map("tenant_modules")
}

// ============ WORKFLOW & APPROVALS ============

model Workflow {
  id        String @id @default(uuid())
  name      String
  moduleKey String
  tenantId  String
  isActive  Boolean @default(true)
  tenant Tenant         @relation(fields: [tenantId], references: [id])
  steps  WorkflowStep[]
  approvalRequests ApprovalRequest[]
  @@map("workflows")
}

model WorkflowStep {
  id             String @id @default(uuid())
  workflowId     String
  stepOrder      Int
  approverRoleKey String
  description    String?
  workflow Workflow @relation(fields: [workflowId], references: [id], onDelete: Cascade)
  @@map("workflow_steps")
}

model ApprovalRequest {
  id          String   @id @default(uuid())
  workflowId  String
  entityType  String
  entityId    String
  status      String   @default("DRAFT")
  currentStep Int      @default(0)
  requesterId String
  tenantId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  workflow  Workflow           @relation(fields: [workflowId], references: [id])
  tenant    Tenant             @relation(fields: [tenantId], references: [id])
  comments  ApprovalComment[]
  @@map("approval_requests")
}

model ApprovalComment {
  id         String   @id @default(uuid())
  requestId  String
  authorId   String
  authorName String
  text       String
  action     String?
  createdAt  DateTime @default(now())
  request ApprovalRequest @relation(fields: [requestId], references: [id], onDelete: Cascade)
  @@map("approval_comments")
}

// ============ FORMS BUILDER ============

model FormDefinition {
  id         String @id @default(uuid())
  name       String
  moduleKey  String
  fields     Json
  workflowId String?
  tenantId   String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  tenant      Tenant           @relation(fields: [tenantId], references: [id])
  submissions FormSubmission[]
  @@map("form_definitions")
}

model FormSubmission {
  id           String   @id @default(uuid())
  formId       String
  data         Json
  submittedById String
  approvalId   String?
  tenantId     String
  createdAt    DateTime @default(now())
  form   FormDefinition @relation(fields: [formId], references: [id])
  tenant Tenant         @relation(fields: [tenantId], references: [id])
  @@map("form_submissions")
}

// ============ REPORTS ============

model ReportDefinition {
  id       String @id @default(uuid())
  name     String
  moduleKey String
  entity   String
  filters  Json
  columns  Json
  groupBy  String?
  tenantId String
  createdAt DateTime @default(now())
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@map("report_definitions")
}

// ============ PROJECTS & TASKS ============

model Project {
  id          String    @id @default(uuid())
  name        String
  description String?
  status      String    @default("PLANNING")
  startDate   DateTime?
  endDate     DateTime?
  managerId   String?
  tenantId    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  tenant Tenant @relation(fields: [tenantId], references: [id])
  tasks  Task[]
  @@map("projects")
}

model Task {
  id          String    @id @default(uuid())
  title       String
  description String?
  status      String    @default("TODO")
  priority    String    @default("MEDIUM")
  assigneeId  String?
  projectId   String?
  dueDate     DateTime?
  branchId    String?
  moduleKey   String?
  tenantId    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  tenant  Tenant   @relation(fields: [tenantId], references: [id])
  project Project? @relation(fields: [projectId], references: [id])
  @@map("tasks")
}

// ============ NOTIFICATIONS ============

model Notification {
  id        String   @id @default(uuid())
  userId    String
  title     String
  body      String
  type      String   @default("INFO")
  isRead    Boolean  @default(false)
  link      String?
  tenantId  String?
  createdAt DateTime @default(now())
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  tenant Tenant? @relation(fields: [tenantId], references: [id])
  @@map("notifications")
}

// ============ DOCUMENTS ============

model Document {
  id           String   @id @default(uuid())
  name         String
  mimeType     String
  size         Int
  path         String
  entityType   String?
  entityId     String?
  uploadedById String
  tenantId     String
  tags         Json     @default("[]")
  version      Int      @default(1)
  createdAt    DateTime @default(now())
  uploadedBy User   @relation("DocumentUploader", fields: [uploadedById], references: [id])
  tenant     Tenant @relation(fields: [tenantId], references: [id])
  @@map("documents")
}

// ============ AUDIT LOG ============

model AuditLog {
  id         String   @id @default(uuid())
  action     String
  entityType String
  entityId   String?
  actorId    String
  actorEmail String
  tenantId   String?
  metadata   Json?
  ipAddress  String?
  createdAt  DateTime @default(now())
  actor  User    @relation("AuditActor", fields: [actorId], references: [id])
  tenant Tenant? @relation(fields: [tenantId], references: [id])
  @@index([tenantId, createdAt])
  @@index([actorId])
  @@index([entityType, entityId])
  @@map("audit_logs")
}

// ============ INTEGRATION HUB ============

model Connector {
  id       String  @id @default(uuid())
  name     String
  type     String
  config   Json
  mappings Json    @default("[]")
  isActive Boolean @default(true)
  tenantId String
  lastRunAt DateTime?
  tenant Tenant           @relation(fields: [tenantId], references: [id])
  logs   IntegrationLog[]
  @@map("connectors")
}

model IntegrationLog {
  id          String   @id @default(uuid())
  connectorId String
  direction   String
  status      String
  payload     Json?
  response    Json?
  error       String?
  retryCount  Int      @default(0)
  createdAt   DateTime @default(now())
  connector Connector @relation(fields: [connectorId], references: [id])
  @@index([connectorId, createdAt])
  @@map("integration_logs")
}

// ============ OPERATIONS ============

model Checklist {
  id          String    @id @default(uuid())
  title       String
  branchId    String
  assigneeId  String?
  frequency   String    @default("DAILY")
  items       Json      @default("[]")
  completedAt DateTime?
  tenantId    String
  createdAt   DateTime  @default(now())
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@map("checklists")
}

model Inspection {
  id          String   @id @default(uuid())
  branchId    String
  inspectorId String
  type        String
  findings    String?
  score       Float?
  tenantId    String
  createdAt   DateTime @default(now())
  tenant Tenant  @relation(fields: [tenantId], references: [id])
  issues Issue[]
  @@map("inspections")
}

model Issue {
  id           String    @id @default(uuid())
  title        String
  description  String?
  severity     String    @default("MEDIUM")
  status       String    @default("OPEN")
  branchId     String
  assigneeId   String?
  inspectionId String?
  closedAt     DateTime?
  tenantId     String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  tenant     Tenant      @relation(fields: [tenantId], references: [id])
  inspection Inspection? @relation(fields: [inspectionId], references: [id])
  @@map("issues")
}

// ============ HR ============

model Employee {
  id             String    @id @default(uuid())
  userId         String?
  employeeNumber String
  firstName      String
  lastName       String
  email          String
  phone          String?
  departmentId   String?
  positionId     String?
  branchId       String?
  hireDate       DateTime
  contractUrl    String?
  tenantId       String
  isActive       Boolean   @default(true)
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  deletedAt      DateTime?
  tenant Tenant         @relation(fields: [tenantId], references: [id])
  leaves LeaveRequest[]
  @@unique([employeeNumber, tenantId])
  @@map("employees")
}

model LeaveRequest {
  id         String   @id @default(uuid())
  employeeId String
  type       String
  startDate  DateTime
  endDate    DateTime
  status     String   @default("PENDING")
  reason     String?
  approvalId String?
  tenantId   String
  createdAt  DateTime @default(now())
  employee Employee @relation(fields: [employeeId], references: [id])
  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  @@map("leave_requests")
}

// ============ FINANCE ============

model Expense {
  id           String   @id @default(uuid())
  description  String
  amount       Float
  currency     String   @default("SAR")
  categoryId   String?
  costCenterId String?
  branchId     String?
  submittedById String
  status       String   @default("DRAFT")
  receiptUrl   String?
  approvalId   String?
  tenantId     String
  date         DateTime
  createdAt    DateTime @default(now())
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@map("expenses")
}

model CostCenter {
  id       String @id @default(uuid())
  name     String
  code     String
  tenantId String
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@unique([code, tenantId])
  @@map("cost_centers")
}

model JournalEntry {
  id          String   @id @default(uuid())
  date        DateTime
  description String
  lines       Json
  tenantId    String
  createdAt   DateTime @default(now())
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@map("journal_entries")
}

// ============ PURCHASING ============

model Supplier {
  id            String  @id @default(uuid())
  name          String
  contactPerson String?
  email         String?
  phone         String?
  address       String?
  tenantId      String
  isActive      Boolean @default(true)
  createdAt     DateTime @default(now())
  tenant         Tenant          @relation(fields: [tenantId], references: [id])
  purchaseOrders PurchaseOrder[]
  @@map("suppliers")
}

model PurchaseRequisition {
  id          String   @id @default(uuid())
  number      String
  requesterId String
  branchId    String?
  status      String   @default("DRAFT")
  items       Json
  approvalId  String?
  tenantId    String
  createdAt   DateTime @default(now())
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@unique([number, tenantId])
  @@map("purchase_requisitions")
}

model PurchaseOrder {
  id          String   @id @default(uuid())
  number      String
  supplierId  String
  status      String   @default("DRAFT")
  items       Json
  totalAmount Float    @default(0)
  currency    String   @default("SAR")
  approvalId  String?
  tenantId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tenant   Tenant   @relation(fields: [tenantId], references: [id])
  supplier Supplier @relation(fields: [supplierId], references: [id])
  @@unique([number, tenantId])
  @@map("purchase_orders")
}

// ============ INVENTORY ============

model InventoryItem {
  id         String  @id @default(uuid())
  name       String
  sku        String
  unit       String  @default("EA")
  categoryId String?
  minStock   Float?
  tenantId   String
  isActive   Boolean @default(true)
  createdAt  DateTime @default(now())
  tenant      Tenant       @relation(fields: [tenantId], references: [id])
  stockLevels StockLevel[]
  @@unique([sku, tenantId])
  @@map("inventory_items")
}

model Warehouse {
  id       String @id @default(uuid())
  name     String
  branchId String?
  type     String @default("BRANCH")
  tenantId String
  tenant      Tenant       @relation(fields: [tenantId], references: [id])
  branch      Branch?      @relation(fields: [branchId], references: [id])
  stockLevels StockLevel[]
  @@map("warehouses")
}

model StockLevel {
  id          String   @id @default(uuid())
  itemId      String
  warehouseId String
  quantity    Float    @default(0)
  tenantId    String
  lastUpdated DateTime @default(now())
  item      InventoryItem @relation(fields: [itemId], references: [id])
  warehouse Warehouse     @relation(fields: [warehouseId], references: [id])
  tenant    Tenant        @relation(fields: [tenantId], references: [id])
  @@unique([itemId, warehouseId])
  @@map("stock_levels")
}

model StockTransfer {
  id              String   @id @default(uuid())
  fromWarehouseId String
  toWarehouseId   String
  items           Json
  status          String   @default("PENDING")
  tenantId        String
  createdAt       DateTime @default(now())
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@map("stock_transfers")
}

// ============ SALES ============

model SalesSummary {
  id               String   @id @default(uuid())
  branchId         String
  date             DateTime
  totalSales       Float    @default(0)
  totalOrders      Int      @default(0)
  paymentBreakdown Json     @default("{}")
  source           String   @default("MANUAL")
  tenantId         String
  createdAt        DateTime @default(now())
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@unique([branchId, date, source])
  @@map("sales_summaries")
}

// ============ CRM ============

model CrmTicket {
  id            String    @id @default(uuid())
  number        String
  customerName  String
  customerPhone String?
  customerEmail String?
  subject       String
  description   String?
  category      String
  status        String    @default("OPEN")
  priority      String    @default("MEDIUM")
  branchId      String?
  assigneeId    String?
  slaDeadline   DateTime?
  resolvedAt    DateTime?
  tenantId      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@unique([number, tenantId])
  @@map("crm_tickets")
}

// ============ MARKETING ============

model Campaign {
  id        String    @id @default(uuid())
  name      String
  type      String    @default("PROMOTION")
  status    String    @default("DRAFT")
  startDate DateTime
  endDate   DateTime?
  budget    Float?
  notes     String?
  tenantId  String
  createdAt DateTime  @default(now())
  tenant  Tenant   @relation(fields: [tenantId], references: [id])
  coupons Coupon[]
  @@map("campaigns")
}

model Coupon {
  id            String    @id @default(uuid())
  code          String
  campaignId    String?
  discountType  String    @default("PERCENTAGE")
  discountValue Float
  maxUses       Int?
  usedCount     Int       @default(0)
  expiresAt     DateTime?
  tenantId      String
  createdAt     DateTime  @default(now())
  campaign Campaign? @relation(fields: [campaignId], references: [id])
  tenant   Tenant    @relation(fields: [tenantId], references: [id])
  @@unique([code, tenantId])
  @@map("coupons")
}

// ============ IT HELPDESK ============

model SupportTicket {
  id          String   @id @default(uuid())
  number      String
  title       String
  description String?
  category    String
  status      String   @default("OPEN")
  priority    String   @default("MEDIUM")
  requesterId String
  assigneeId  String?
  assetId     String?
  tenantId    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@unique([number, tenantId])
  @@map("support_tickets")
}

model ITAsset {
  id           String  @id @default(uuid())
  name         String
  type         String  @default("OTHER")
  serialNumber String?
  assignedToId String?
  branchId     String?
  status       String  @default("ACTIVE")
  tenantId     String
  createdAt    DateTime @default(now())
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@map("it_assets")
}

// ============ QUALITY ============

model QualityChecklist {
  id        String   @id @default(uuid())
  title     String
  branchId  String
  type      String   @default("CUSTOM")
  items     Json     @default("[]")
  score     Float?
  auditorId String
  tenantId  String
  createdAt DateTime @default(now())
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@map("quality_checklists")
}

model Nonconformance {
  id          String    @id @default(uuid())
  title       String
  description String?
  branchId    String
  category    String
  severity    String    @default("MINOR")
  status      String    @default("OPEN")
  assigneeId  String?
  capaId      String?
  tenantId    String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  closedAt    DateTime?
  tenant Tenant @relation(fields: [tenantId], references: [id])
  @@map("nonconformances")
}

// ============ PRODUCTION ============

model Recipe {
  id             String @id @default(uuid())
  name           String
  code           String
  outputItemId   String
  outputQuantity Float
  outputUnit     String @default("EA")
  materials      Json
  instructions   String?
  tenantId       String
  createdAt      DateTime @default(now())
  tenant           Tenant            @relation(fields: [tenantId], references: [id])
  productionOrders ProductionOrder[]
  @@unique([code, tenantId])
  @@map("recipes")
}

model ProductionOrder {
  id             String    @id @default(uuid())
  number         String
  recipeId       String
  quantity        Float
  status         String    @default("PLANNED")
  batchNumber    String?
  yieldQuantity  Float?
  wasteQuantity  Float?
  startDate      DateTime?
  completedDate  DateTime?
  tenantId       String
  createdAt      DateTime  @default(now())
  tenant Tenant @relation(fields: [tenantId], references: [id])
  recipe Recipe @relation(fields: [recipeId], references: [id])
  @@unique([number, tenantId])
  @@map("production_orders")
}`);

// ===========================
// API - Source Code
// ===========================
console.log('\n🚀 NestJS API Source');

writeFile(path.join(ROOT, 'apps/api/src/main.ts'), `import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Consedra ERP API')
    .setDescription('Multi-tenant SaaS ERP Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey({ type: 'apiKey', name: 'X-Tenant-Slug', in: 'header' }, 'tenant')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(\`Consedra API: http://localhost:\${port}\`);
  console.log(\`Swagger docs: http://localhost:\${port}/api/docs\`);
}
bootstrap();`);

// Prisma Module
writeFile(path.join(ROOT, 'apps/api/src/prisma/prisma.module.ts'), `import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({ providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}`);

writeFile(path.join(ROOT, 'apps/api/src/prisma/prisma.service.ts'), `import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({ log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'] });
  }
  async onModuleInit() { await this.$connect(); }
  async onModuleDestroy() { await this.$disconnect(); }
}`);

// Common decorators/guards
writeFile(path.join(ROOT, 'apps/api/src/common/decorators/current-user.decorator.ts'), `import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  return data ? req.user?.[data] : req.user;
});`);

writeFile(path.join(ROOT, 'apps/api/src/common/decorators/tenant.decorator.ts'), `import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const CurrentTenant = createParamDecorator((_: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest().tenantId;
});`);

writeFile(path.join(ROOT, 'apps/api/src/common/decorators/permissions.decorator.ts'), `import { SetMetadata } from '@nestjs/common';
export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...perms: string[]) => SetMetadata(PERMISSIONS_KEY, perms);
export const PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(PUBLIC_KEY, true);`);

writeFile(path.join(ROOT, 'apps/api/src/common/guards/jwt-auth.guard.ts'), `import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); }
  canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (isPublic) return true;
    return super.canActivate(ctx);
  }
  handleRequest(err: any, user: any) {
    if (err || !user) throw new UnauthorizedException('Invalid or expired token');
    return user;
  }
}`);

writeFile(path.join(ROOT, 'apps/api/src/common/guards/tenant.guard.ts'), `import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PUBLIC_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (isPublic) return true;
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;
    if (user?.isSuperAdmin) {
      const slug = req.headers['x-tenant-slug'];
      if (slug) {
        const t = await this.prisma.tenant.findUnique({ where: { slug } });
        if (t) req.tenantId = t.id;
      }
      return true;
    }
    const host = req.headers.host || '';
    const slug = req.headers['x-tenant-slug'] || host.split('.')[0];
    if (!slug || slug === 'localhost' || slug === '127') throw new ForbiddenException('Tenant not resolved');
    const tenant = await this.prisma.tenant.findUnique({ where: { slug } });
    if (!tenant || !tenant.isActive) throw new ForbiddenException('Tenant not found or inactive');
    if (user?.tenantId && user.tenantId !== tenant.id) throw new ForbiddenException('Tenant mismatch');
    req.tenantId = tenant.id;
    return true;
  }
}`);

writeFile(path.join(ROOT, 'apps/api/src/common/guards/permissions.guard.ts'), `import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, PUBLIC_KEY } from '../decorators/permissions.decorator';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (isPublic) return true;
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [ctx.getHandler(), ctx.getClass()]);
    if (!required?.length) return true;
    const user = ctx.switchToHttp().getRequest().user;
    if (!user) throw new ForbiddenException('Not authenticated');
    if (user.isSuperAdmin) return true;
    const userRoles = await this.prisma.userRole.findMany({
      where: { userId: user.id },
      include: { role: { include: { permissions: { include: { permission: true } } } } },
    });
    const perms = new Set<string>();
    for (const ur of userRoles) for (const rp of ur.role.permissions) perms.add(rp.permission.key);
    if (!required.every(p => perms.has(p))) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}`);

writeFile(path.join(ROOT, 'apps/api/src/common/utils/pagination.ts'), `export interface PaginationParams {
  page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: 'asc' | 'desc';
}
export function buildPagination(p: PaginationParams) {
  const page = Math.max(1, p.page || 1);
  const limit = Math.min(100, Math.max(1, p.limit || 20));
  const skip = (page - 1) * limit;
  const orderBy: Record<string, string> = {};
  if (p.sortBy) orderBy[p.sortBy] = p.sortOrder || 'asc';
  else orderBy['createdAt'] = 'desc';
  return { page, limit, skip, orderBy };
}
export function paginatedResponse<T>(data: T[], total: number, page: number, limit: number) {
  return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
}`);

// Auth Module
writeFile(path.join(ROOT, 'apps/api/src/core/auth/auth.module.ts'), `import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: process.env.JWT_SECRET || 'consedra-jwt-secret-change-in-production', signOptions: { expiresIn: '15m' } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}`);

writeFile(path.join(ROOT, 'apps/api/src/core/auth/jwt.strategy.ts'), `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req: any) => req?.cookies?.access_token,
      ]),
      secretOrKey: process.env.JWT_SECRET || 'consedra-jwt-secret-change-in-production',
    });
  }
  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, firstName: true, lastName: true, isSuperAdmin: true, tenantId: true, isActive: true, locale: true },
    });
    if (!user || !user.isActive) throw new UnauthorizedException();
    return user;
  }
}`);

writeFile(path.join(ROOT, 'apps/api/src/core/auth/auth.service.ts'), `import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    return this.generateTokens(user.id, user.email);
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) throw new UnauthorizedException('Invalid refresh token');
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    const user = await this.prisma.user.findUnique({ where: { id: stored.userId } });
    if (!user || !user.isActive) throw new UnauthorizedException();
    return this.generateTokens(user.id, user.email);
  }

  async logout(refreshToken: string) {
    await this.prisma.refreshToken.updateMany({ where: { token: refreshToken }, data: { revokedAt: new Date() } });
  }

  private async generateTokens(userId: string, email: string) {
    const accessToken = this.jwtService.sign({ sub: userId, email });
    const refreshToken = uuid();
    await this.prisma.refreshToken.create({ data: { token: refreshToken, userId, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } });
    return { accessToken, refreshToken };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, firstName: true, lastName: true, avatarUrl: true, locale: true, tenantId: true, isSuperAdmin: true } });
    if (!user) throw new UnauthorizedException();
    const roles = await this.prisma.userRole.findMany({ where: { userId }, include: { role: true } });
    return { ...user, roles: roles.map(r => ({ roleId: r.roleId, roleName: r.role.name, scopeType: r.scopeType, scopeId: r.scopeId })) };
  }
}`);

writeFile(path.join(ROOT, 'apps/api/src/core/auth/auth.controller.ts'), `import { Controller, Post, Body, Res, Req, Get, UseGuards, HttpCode } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

class LoginDto { @IsEmail() email: string; @IsString() @MinLength(6) password: string; @IsString() @IsOptional() tenantSlug?: string; }
class RefreshDto { @IsString() refreshToken: string; }

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public() @Post('login') @HttpCode(200) @ApiOperation({ summary: 'Login' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.auth.login(dto.email, dto.password);
    res.cookie('access_token', tokens.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 60 * 60 * 1000 });
    return tokens;
  }

  @Public() @Post('refresh') @HttpCode(200) @ApiOperation({ summary: 'Refresh tokens' })
  async refresh(@Body() dto: RefreshDto, @Req() req: Request) {
    return this.auth.refresh(dto.refreshToken || (req.cookies?.refresh_token as string));
  }

  @Post('logout') @UseGuards(JwtAuthGuard) @ApiBearerAuth() @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (req.cookies?.refresh_token) await this.auth.logout(req.cookies.refresh_token);
    res.clearCookie('access_token'); res.clearCookie('refresh_token');
    return { message: 'Logged out' };
  }

  @Get('profile') @UseGuards(JwtAuthGuard) @ApiBearerAuth() @ApiOperation({ summary: 'Get profile' })
  profile(@CurrentUser() user: any) { return this.auth.getProfile(user.id); }
}`);

// Helper to generate CRUD modules
function generateModule(basePath, moduleName, entityName, apiPath, fields) {
  const capitalName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  const serviceName = capitalName + 'Service';
  const controllerName = capitalName + 'Controller';
  const moduleClassName = capitalName + 'Module';

  writeFile(path.join(basePath, `${moduleName}.module.ts`), `import { Module } from '@nestjs/common';
import { ${serviceName} } from './${moduleName}.service';
import { ${controllerName} } from './${moduleName}.controller';

@Module({
  controllers: [${controllerName}],
  providers: [${serviceName}],
  exports: [${serviceName}],
})
export class ${moduleClassName} {}`);

  const findManyEntity = entityName.charAt(0).toLowerCase() + entityName.slice(1);

  writeFile(path.join(basePath, `${moduleName}.service.ts`), `import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@Injectable()
export class ${serviceName} {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, params: any) {
    const { page, limit, skip, orderBy } = buildPagination(params);
    const where: any = { tenantId };
    if (params.search) {
      where.OR = [${fields.filter(f => f.searchable).map(f => `{ ${f.name}: { contains: params.search, mode: 'insensitive' } }`).join(', ')}];
    }${fields.filter(f => f.filterable).map(f => `
    if (params.${f.name}) where.${f.name} = params.${f.name};`).join('')}
    const [data, total] = await Promise.all([
      this.prisma.${findManyEntity}.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.${findManyEntity}.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    return this.prisma.${findManyEntity}.findUnique({ where: { id } });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.${findManyEntity}.create({ data: { ...data, tenantId } });
  }

  async update(id: string, data: any) {
    return this.prisma.${findManyEntity}.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.${findManyEntity}.delete({ where: { id } });
  }
}`);

  writeFile(path.join(basePath, `${moduleName}.controller.ts`), `import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ${serviceName} } from './${moduleName}.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';

@ApiTags('${capitalName}')
@Controller('api/${apiPath}')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ${controllerName} {
  constructor(private svc: ${serviceName}) {}

  @Get() @RequirePermissions('view') @ApiOperation({ summary: 'List ${apiPath}' })
  findAll(@CurrentTenant() tenantId: string, @Query() query: any) { return this.svc.findAll(tenantId, query); }

  @Get(':id') @RequirePermissions('view')
  findOne(@Param('id') id: string) { return this.svc.findOne(id); }

  @Post() @RequirePermissions('create') @ApiOperation({ summary: 'Create' })
  create(@CurrentTenant() tenantId: string, @Body() body: any) { return this.svc.create(tenantId, body); }

  @Put(':id') @RequirePermissions('update')
  update(@Param('id') id: string, @Body() body: any) { return this.svc.update(id, body); }

  @Delete(':id') @RequirePermissions('delete')
  remove(@Param('id') id: string) { return this.svc.remove(id); }
}`);
}

// Generate all core modules
const coreModules = [
  { name: 'users', entity: 'User', api: 'users', path: 'core/users', fields: [{ name: 'email', searchable: true }, { name: 'firstName', searchable: true }, { name: 'lastName', searchable: true }] },
  { name: 'roles', entity: 'RoleDefinition', api: 'roles', path: 'core/roles', fields: [{ name: 'name', searchable: true }, { name: 'key', searchable: true }] },
  { name: 'audit', entity: 'AuditLog', api: 'audit-logs', path: 'core/audit', fields: [{ name: 'action', searchable: true }, { name: 'entityType', searchable: true, filterable: true }, { name: 'actorEmail', searchable: true }] },
  { name: 'org-structure', entity: 'Region', api: 'org/regions', path: 'core/org-structure', fields: [{ name: 'name', searchable: true }, { name: 'code', searchable: true }] },
  { name: 'module-manager', entity: 'TenantModule', api: 'modules', path: 'core/module-manager', fields: [{ name: 'moduleKey', searchable: true }] },
  { name: 'workflow', entity: 'ApprovalRequest', api: 'approvals', path: 'core/workflow', fields: [{ name: 'entityType', searchable: true, filterable: true }, { name: 'status', filterable: true }] },
  { name: 'forms-builder', entity: 'FormDefinition', api: 'forms', path: 'core/forms-builder', fields: [{ name: 'name', searchable: true }, { name: 'moduleKey', filterable: true }] },
  { name: 'reports', entity: 'ReportDefinition', api: 'reports', path: 'core/reports', fields: [{ name: 'name', searchable: true }, { name: 'moduleKey', filterable: true }] },
  { name: 'projects', entity: 'Project', api: 'projects', path: 'core/projects', fields: [{ name: 'name', searchable: true }, { name: 'status', filterable: true }] },
  { name: 'notifications', entity: 'Notification', api: 'notifications', path: 'core/notifications', fields: [{ name: 'title', searchable: true }] },
  { name: 'documents', entity: 'Document', api: 'documents', path: 'core/documents', fields: [{ name: 'name', searchable: true }, { name: 'entityType', filterable: true }] },
  { name: 'integration-hub', entity: 'Connector', api: 'integrations', path: 'core/integration-hub', fields: [{ name: 'name', searchable: true }, { name: 'type', filterable: true }] },
];

const businessModules = [
  { name: 'operations', entity: 'Checklist', api: 'operations/checklists', path: 'modules/operations', fields: [{ name: 'title', searchable: true }, { name: 'branchId', filterable: true }, { name: 'frequency', filterable: true }] },
  { name: 'hr', entity: 'Employee', api: 'hr/employees', path: 'modules/hr', fields: [{ name: 'firstName', searchable: true }, { name: 'lastName', searchable: true }, { name: 'email', searchable: true }, { name: 'departmentId', filterable: true }, { name: 'branchId', filterable: true }] },
  { name: 'finance', entity: 'Expense', api: 'finance/expenses', path: 'modules/finance', fields: [{ name: 'description', searchable: true }, { name: 'status', filterable: true }, { name: 'branchId', filterable: true }] },
  { name: 'purchasing', entity: 'PurchaseOrder', api: 'purchasing/orders', path: 'modules/purchasing', fields: [{ name: 'number', searchable: true }, { name: 'status', filterable: true }] },
  { name: 'inventory', entity: 'InventoryItem', api: 'inventory/items', path: 'modules/inventory', fields: [{ name: 'name', searchable: true }, { name: 'sku', searchable: true }] },
  { name: 'sales', entity: 'SalesSummary', api: 'sales/summaries', path: 'modules/sales', fields: [{ name: 'branchId', filterable: true }] },
  { name: 'crm', entity: 'CrmTicket', api: 'crm/tickets', path: 'modules/crm', fields: [{ name: 'number', searchable: true }, { name: 'customerName', searchable: true }, { name: 'subject', searchable: true }, { name: 'status', filterable: true }, { name: 'priority', filterable: true }, { name: 'category', filterable: true }] },
  { name: 'marketing', entity: 'Campaign', api: 'marketing/campaigns', path: 'modules/marketing', fields: [{ name: 'name', searchable: true }, { name: 'status', filterable: true }] },
  { name: 'it-helpdesk', entity: 'SupportTicket', api: 'it/tickets', path: 'modules/it-helpdesk', fields: [{ name: 'number', searchable: true }, { name: 'title', searchable: true }, { name: 'status', filterable: true }, { name: 'category', filterable: true }] },
  { name: 'quality', entity: 'QualityChecklist', api: 'quality/checklists', path: 'modules/quality', fields: [{ name: 'title', searchable: true }, { name: 'branchId', filterable: true }, { name: 'type', filterable: true }] },
  { name: 'production', entity: 'ProductionOrder', api: 'production/orders', path: 'modules/production', fields: [{ name: 'number', searchable: true }, { name: 'status', filterable: true }] },
];

[...coreModules, ...businessModules].forEach(m => {
  generateModule(path.join(ROOT, 'apps/api/src', m.path), m.name, m.entity, m.api, m.fields);
});

// Additional controllers for sub-entities
// Tasks controller
writeFile(path.join(ROOT, 'apps/api/src/core/projects/tasks.controller.ts'), `import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentTenant } from '../../common/decorators/tenant.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { buildPagination, paginatedResponse } from '../../common/utils/pagination';

@ApiTags('Tasks')
@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@CurrentTenant() tenantId: string, @Query() q: any) {
    const { page, limit, skip, orderBy } = buildPagination(q);
    const where: any = { tenantId };
    if (q.status) where.status = q.status;
    if (q.assigneeId) where.assigneeId = q.assigneeId;
    const [data, total] = await Promise.all([
      this.prisma.task.findMany({ where, skip, take: limit, orderBy }),
      this.prisma.task.count({ where }),
    ]);
    return paginatedResponse(data, total, page, limit);
  }

  @Post()
  create(@CurrentTenant() tenantId: string, @Body() body: any) {
    return this.prisma.task.create({ data: { ...body, tenantId } });
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.prisma.task.update({ where: { id }, data: body });
  }
}`);

// Tenant controller
writeFile(path.join(ROOT, 'apps/api/src/core/tenant/tenant.module.ts'), `import { Module } from '@nestjs/common';
import { TenantService } from './tenant.service';
import { TenantController } from './tenant.controller';
@Module({ controllers: [TenantController], providers: [TenantService], exports: [TenantService] })
export class TenantModule {}`);

writeFile(path.join(ROOT, 'apps/api/src/core/tenant/tenant.service.ts'), `import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class TenantService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.tenant.findMany({ orderBy: { createdAt: 'desc' } }); }
  findBySlug(slug: string) { return this.prisma.tenant.findUnique({ where: { slug } }); }

  async create(data: { name: string; slug: string; ownerEmail: string; ownerFirstName: string; ownerLastName: string; ownerPassword: string }) {
    const existing = await this.prisma.tenant.findUnique({ where: { slug: data.slug } });
    if (existing) throw new BadRequestException('Slug exists');
    const hash = await bcrypt.hash(data.ownerPassword, 12);
    return this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({ data: { name: data.name, slug: data.slug } });
      const owner = await tx.user.create({ data: { email: data.ownerEmail, passwordHash: hash, firstName: data.ownerFirstName, lastName: data.ownerLastName, tenantId: tenant.id } });
      await tx.tenant.update({ where: { id: tenant.id }, data: { ownerId: owner.id } });
      return { tenant, owner };
    });
  }

  async initiateTransfer(tenantId: string, newOwnerEmail: string, reason: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException();
    return this.prisma.ownershipTransfer.create({ data: { tenantId, fromUserId: tenant.ownerId!, toUserEmail: newOwnerEmail, token: uuid(), reason, expiresAt: new Date(Date.now() + 15 * 60 * 1000) } });
  }

  async confirmTransfer(token: string) {
    const t = await this.prisma.ownershipTransfer.findUnique({ where: { token } });
    if (!t || t.status !== 'PENDING') throw new BadRequestException('Invalid');
    if (t.expiresAt < new Date()) { await this.prisma.ownershipTransfer.update({ where: { id: t.id }, data: { status: 'EXPIRED' } }); throw new BadRequestException('Expired'); }
    const newOwner = await this.prisma.user.findFirst({ where: { email: t.toUserEmail } });
    if (!newOwner) throw new NotFoundException('User not found');
    await this.prisma.$transaction([
      this.prisma.tenant.update({ where: { id: t.tenantId }, data: { ownerId: newOwner.id } }),
      this.prisma.ownershipTransfer.update({ where: { id: t.id }, data: { status: 'CONFIRMED', confirmedAt: new Date() } }),
    ]);
    return { message: 'Transferred' };
  }
}`);

writeFile(path.join(ROOT, 'apps/api/src/core/tenant/tenant.controller.ts'), `import { Controller, Get, Post, Body, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TenantService } from './tenant.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/permissions.decorator';

@ApiTags('Tenants')
@Controller('api/tenants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TenantController {
  constructor(private svc: TenantService) {}

  @Get()
  findAll(@CurrentUser() user: any) { if (!user.isSuperAdmin) throw new ForbiddenException(); return this.svc.findAll(); }

  @Post()
  create(@Body() dto: any, @CurrentUser() user: any) { if (!user.isSuperAdmin) throw new ForbiddenException(); return this.svc.create(dto); }

  @Post(':id/transfer')
  transfer(@Param('id') id: string, @Body() dto: any) { return this.svc.initiateTransfer(id, dto.newOwnerEmail, dto.reason); }

  @Public() @Post('transfer/confirm')
  confirm(@Body() dto: any) { return this.svc.confirmTransfer(dto.token); }
}`);

// App module - imports everything
const coreImports = ['Auth', 'Tenant', 'Users', 'Roles', 'Audit', 'OrgStructure', 'ModuleManager', 'Workflow', 'FormsBuilder', 'Reports', 'Projects', 'Notifications', 'Documents', 'IntegrationHub'];
const businessImports = ['Operations', 'Hr', 'Finance', 'Purchasing', 'Inventory', 'Sales', 'Crm', 'Marketing', 'ItHelpdesk', 'Quality', 'Production'];

const coreModuleNames = ['auth', 'tenant', 'users', 'roles', 'audit', 'org-structure', 'module-manager', 'workflow', 'forms-builder', 'reports', 'projects', 'notifications', 'documents', 'integration-hub'];
const businessModuleNames = ['operations', 'hr', 'finance', 'purchasing', 'inventory', 'sales', 'crm', 'marketing', 'it-helpdesk', 'quality', 'production'];

const allClassNames = [...coreImports, ...businessImports];
const allPaths = [...coreModuleNames.map(n => `core/${n}`), ...businessModuleNames.map(n => `modules/${n}`)];

const importStatements = allClassNames.map((name, i) => {
  const modName = name + 'Module';
  return `import { ${modName} } from './${allPaths[i]}/${allPaths[i].split('/').pop()}.module';`;
}).join('\n');

const moduleList = allClassNames.map(n => n + 'Module').join(',\n    ');

writeFile(path.join(ROOT, 'apps/api/src/app.module.ts'), `import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { TasksController } from './core/projects/tasks.controller';
${importStatements}

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ScheduleModule.forRoot(),
    PrismaModule,
    ${moduleList},
  ],
  controllers: [TasksController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}`);

// ===========================
// SEED DATA
// ===========================
console.log('\n🌱 Seed Data');
// The seed file is very large - write it as a separate file
// (Content from the specs agent prompt, adapted)

writeFile(path.join(ROOT, 'apps/api/prisma/seed.ts'), `import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Consedra ERP...');
  const adminHash = await bcrypt.hash('Admin123!', 12);
  const ownerHash = await bcrypt.hash('Owner123!', 12);
  const userHash = await bcrypt.hash('User123!', 12);

  // SuperAdmin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@consedra.local' },
    update: {},
    create: { email: 'admin@consedra.local', passwordHash: adminHash, firstName: 'Super', lastName: 'Admin', isSuperAdmin: true, locale: 'en' },
  });

  // Tenant
  let tenant = await prisma.tenant.findUnique({ where: { slug: 'consedra' } });
  if (!tenant) tenant = await prisma.tenant.create({ data: { name: 'Consedra Group', slug: 'consedra' } });

  // Owner
  const owner = await prisma.user.upsert({
    where: { email: 'owner@consedra.local' },
    update: {},
    create: { email: 'owner@consedra.local', passwordHash: ownerHash, firstName: 'Mohammed', lastName: 'Al-Rashid', tenantId: tenant.id, locale: 'ar' },
  });
  await prisma.tenant.update({ where: { id: tenant.id }, data: { ownerId: owner.id } });

  // Permissions
  const permKeys = ['view','create','update','delete','approve','export','manage-users','manage-roles','manage-modules','manage-settings','assign','close','transfer','impersonate'];
  const permMap: Record<string, string> = {};
  for (const key of permKeys) {
    const p = await prisma.permissionDefinition.upsert({ where: { key }, update: {}, create: { key, name: key, category: 'general' } });
    permMap[key] = p.id;
  }

  // Roles
  const roleData: [string, string, string[]][] = [
    ['OWNER', 'Owner', ['view','create','update','delete','approve','export','manage-users','manage-roles','manage-modules','manage-settings','assign','close','transfer']],
    ['HEAD_OF_DEPARTMENT', 'Head of Department', ['view','create','update','approve','export','assign','close']],
    ['EMPLOYEE', 'Employee', ['view','create']],
    ['OPERATIONS_MANAGER', 'Operations Manager', ['view','create','update','approve','export','assign','close']],
    ['FACTORY_MANAGER', 'Factory Manager', ['view','create','update','approve','export','assign','close']],
    ['PRODUCTION_MANAGER', 'Production Manager', ['view','create','update','approve','export','assign']],
    ['AREA_MANAGER', 'Area Manager', ['view','create','update','approve','export','assign']],
    ['BRANCH_MANAGER', 'Branch Manager', ['view','create','update','approve','assign','close']],
    ['ASSISTANT_BRANCH_MANAGER', 'Asst. Branch Manager', ['view','create','update','assign']],
    ['CASHIER', 'Cashier', ['view','create']],
    ['FINANCE_MANAGER', 'Finance Manager', ['view','create','update','approve','export']],
    ['HR_MANAGER', 'HR Manager', ['view','create','update','approve','export','manage-users']],
    ['IT_MANAGER', 'IT Manager', ['view','create','update','approve','assign','close']],
    ['MARKETING_MANAGER', 'Marketing Manager', ['view','create','update','export']],
  ];
  const roleMap: Record<string, string> = {};
  for (const [key, name, perms] of roleData) {
    const role = await prisma.roleDefinition.upsert({ where: { key_tenantId: { key, tenantId: tenant.id } }, update: {}, create: { key, name, isSystem: true, tenantId: tenant.id } });
    roleMap[key] = role.id;
    for (const pk of perms) {
      await prisma.rolePermission.upsert({ where: { roleId_permissionId: { roleId: role.id, permissionId: permMap[pk] } }, update: {}, create: { roleId: role.id, permissionId: permMap[pk] } });
    }
  }
  await prisma.userRole.upsert({ where: { userId_roleId_scopeType_scopeId: { userId: owner.id, roleId: roleMap['OWNER'], scopeType: 'COMPANY', scopeId: '' } }, update: {}, create: { userId: owner.id, roleId: roleMap['OWNER'], scopeType: 'COMPANY', scopeId: '' } });

  // Regions
  const r1 = await prisma.region.upsert({ where: { code_tenantId: { code: 'CENTRAL', tenantId: tenant.id } }, update: {}, create: { name: 'Central Region', code: 'CENTRAL', tenantId: tenant.id } });
  const r2 = await prisma.region.upsert({ where: { code_tenantId: { code: 'WESTERN', tenantId: tenant.id } }, update: {}, create: { name: 'Western Region', code: 'WESTERN', tenantId: tenant.id } });

  // Branches
  const branchData = [
    { name: 'Downtown Branch', code: 'BR-001', type: 'BRANCH', regionId: r1.id },
    { name: 'Mall Branch', code: 'BR-002', type: 'BRANCH', regionId: r1.id },
    { name: 'Airport Branch', code: 'BR-003', type: 'BRANCH', regionId: r1.id },
    { name: 'West Mall Branch', code: 'BR-004', type: 'BRANCH', regionId: r2.id },
    { name: 'Corniche Branch', code: 'BR-005', type: 'BRANCH', regionId: r2.id },
    { name: 'University Branch', code: 'BR-006', type: 'BRANCH', regionId: r2.id },
    { name: 'Central Factory', code: 'FAC-001', type: 'FACTORY', regionId: r1.id },
  ];
  const branches: any[] = [];
  for (const b of branchData) {
    branches.push(await prisma.branch.upsert({ where: { code_tenantId: { code: b.code, tenantId: tenant.id } }, update: {}, create: { ...b, tenantId: tenant.id } }));
  }

  // Departments
  const deptNames = ['Finance', 'HR', 'Operations', 'IT', 'Marketing', 'Procurement', 'Quality', 'Production'];
  const deptCodes = ['FIN', 'HR', 'OPS', 'IT', 'MKT', 'PROC', 'QA', 'PROD'];
  const depts: any[] = [];
  for (let i = 0; i < deptNames.length; i++) {
    depts.push(await prisma.department.upsert({ where: { code_tenantId: { code: deptCodes[i], tenantId: tenant.id } }, update: {}, create: { name: deptNames[i], code: deptCodes[i], tenantId: tenant.id } }));
  }

  // Modules
  const mods = ['dashboard','operations','hr','finance','purchasing','inventory','sales','crm','marketing','it-helpdesk','quality','production','projects','approvals','forms','reports','documents','integrations'];
  for (let i = 0; i < mods.length; i++) {
    await prisma.tenantModule.upsert({ where: { tenantId_moduleKey: { tenantId: tenant.id, moduleKey: mods[i] } }, update: {}, create: { tenantId: tenant.id, moduleKey: mods[i], isEnabled: true, order: i } });
  }

  // Employees (60)
  const fNames = ['Ahmad','Sara','Khalid','Fatima','Omar','Layla','Yusuf','Nora','Hassan','Aisha','Ali','Mona','Ibrahim','Rania','Tariq','Huda','Faisal','Dina','Samir','Jana','Bilal','Salma','Nasser','Lina','Ziad','Mariam','Rami','Sana','Walid','Yasmin','Adel','Ghada','Majid','Noura','Hamza','Eman','Sami','Rana','Karim','Hala','Murad','Dalal','Rashid','Asma','Nabil','Lubna','Ihab','Suha','Mazen','Afaf','Jamal','Wafa','Hazem','Reem','Amr','Hayat','Osama','Nisreen','Tamer','Sawsan'];
  const lNames = ['Al-Ahmad','Al-Farsi','Al-Hamad','Al-Rashidi','Al-Qahtani','Al-Dosari','Al-Shamsi','Al-Harbi','Al-Sulaiman','Al-Otaibi'];
  const rKeys = ['EMPLOYEE','BRANCH_MANAGER','OPERATIONS_MANAGER','FINANCE_MANAGER','HR_MANAGER','IT_MANAGER','MARKETING_MANAGER','PRODUCTION_MANAGER','AREA_MANAGER','CASHIER'];
  const employees: any[] = [];
  for (let i = 0; i < 60; i++) {
    const fn = fNames[i], ln = lNames[i%10];
    const email = fn.toLowerCase()+'.'+ln.toLowerCase().replace(/[^a-z]/g,'')+'@consedra.local';
    const u = await prisma.user.upsert({ where: { email }, update: {}, create: { email, passwordHash: userHash, firstName: fn, lastName: ln, tenantId: tenant.id, locale: i%3===0?'ar':'en' } });
    try { await prisma.userRole.create({ data: { userId: u.id, roleId: roleMap[rKeys[i%10]], scopeType: i<10?'COMPANY':'BRANCH', scopeId: i<10?'':branches[i%7].id } }); } catch {}
    employees.push(await prisma.employee.upsert({ where: { employeeNumber_tenantId: { employeeNumber: 'EMP-'+String(i+1).padStart(3,'0'), tenantId: tenant.id } }, update: {}, create: { userId: u.id, employeeNumber: 'EMP-'+String(i+1).padStart(3,'0'), firstName: fn, lastName: ln, email, departmentId: depts[i%8].id, branchId: branches[i%7].id, hireDate: new Date(2022, i%12, (i%28)+1), tenantId: tenant.id } }));
  }
  console.log('60 employees');

  // Warehouses
  const whs: any[] = [];
  for (const b of branches) whs.push(await prisma.warehouse.create({ data: { name: b.name+' Store', branchId: b.id, type: b.type==='FACTORY'?'FACTORY':'BRANCH', tenantId: tenant.id } }));

  // Inventory Items
  const itemNames = ['Flour 50kg','Sugar 25kg','Salt 1kg','Olive Oil 5L','Chicken Breast','Beef Mince','Tomato Paste','Cheese Block','Butter 500g','Rice 10kg','Bread Rolls','Lettuce','Onions 5kg','Garlic 1kg','Milk 1L','Cream 500ml','Eggs tray','Napkins box','Cups sleeve','Packaging Boxes'];
  const items: any[] = [];
  for (let i = 0; i < 20; i++) {
    items.push(await prisma.inventoryItem.upsert({ where: { sku_tenantId: { sku: 'SKU-'+String(i+1).padStart(3,'0'), tenantId: tenant.id } }, update: {}, create: { name: itemNames[i], sku: 'SKU-'+String(i+1).padStart(3,'0'), unit: i<15?'KG':'EA', minStock: 10+i*5, tenantId: tenant.id } }));
  }

  // Stock Levels
  for (let i = 0; i < 50; i++) {
    await prisma.stockLevel.upsert({ where: { itemId_warehouseId: { itemId: items[i%20].id, warehouseId: whs[i%7].id } }, update: { quantity: Math.floor(Math.random()*500)+10 }, create: { itemId: items[i%20].id, warehouseId: whs[i%7].id, quantity: Math.floor(Math.random()*500)+10, tenantId: tenant.id } });
  }

  // Suppliers + POs (30)
  const supNames = ['Fresh Farms','Global Foods','Al-Madina Supplies','Quick Pack','Eastern Spices'];
  const sups: any[] = [];
  for (const n of supNames) sups.push(await prisma.supplier.create({ data: { name: n, tenantId: tenant.id } }));
  const poStatuses = ['DRAFT','PENDING_APPROVAL','APPROVED','ORDERED','RECEIVED','CANCELLED'];
  for (let i = 0; i < 30; i++) {
    await prisma.purchaseOrder.upsert({ where: { number_tenantId: { number: 'PO-'+String(i+1).padStart(4,'0'), tenantId: tenant.id } }, update: {}, create: { number: 'PO-'+String(i+1).padStart(4,'0'), supplierId: sups[i%5].id, status: poStatuses[i%6], items: JSON.stringify([{itemName: items[i%20].name, quantity: (i+1)*10, unitPrice: 15+i*2}]), totalAmount: (i+1)*10*(15+i*2), tenantId: tenant.id } });
  }
  console.log('30 POs');

  // Cost Centers + Expenses
  const ccs: any[] = [];
  for (const b of branches) ccs.push(await prisma.costCenter.upsert({ where: { code_tenantId: { code: 'CC-'+b.code, tenantId: tenant.id } }, update: {}, create: { name: b.name+' CC', code: 'CC-'+b.code, tenantId: tenant.id } }));
  const expCats = ['Food Cost','Labor','Utilities','Rent','Maintenance','Marketing','Transport','Supplies'];
  for (let i = 0; i < 40; i++) {
    await prisma.expense.create({ data: { description: expCats[i%8]+' - '+branches[i%7].name, amount: 500+Math.floor(Math.random()*10000), branchId: branches[i%7].id, costCenterId: ccs[i%7].id, submittedById: owner.id, status: ['APPROVED','PENDING','DRAFT'][i%3], date: new Date(2024,11,(i%28)+1), tenantId: tenant.id } });
  }

  // Sales Summaries
  for (let i = 0; i < 30; i++) {
    const d = new Date(2024,11,(i%28)+1);
    await prisma.salesSummary.upsert({ where: { branchId_date_source: { branchId: branches[i%6].id, date: d, source: 'SEED' } }, update: {}, create: { branchId: branches[i%6].id, date: d, totalSales: 5000+Math.floor(Math.random()*45000), totalOrders: 50+Math.floor(Math.random()*200), paymentBreakdown: JSON.stringify({cash:40,card:35,online:25}), source: 'SEED', tenantId: tenant.id } });
  }

  // CRM Tickets (80)
  const crmCats = ['Complaint','Inquiry','Feedback','Return','Billing','Other'];
  const statuses = ['OPEN','IN_PROGRESS','RESOLVED','CLOSED','ESCALATED'];
  const prios = ['LOW','MEDIUM','HIGH','URGENT'];
  for (let i = 0; i < 80; i++) {
    await prisma.crmTicket.upsert({ where: { number_tenantId: { number: 'CRM-'+String(i+1).padStart(3,'0'), tenantId: tenant.id } }, update: {}, create: { number: 'CRM-'+String(i+1).padStart(3,'0'), customerName: 'Customer '+(i+1), subject: 'Issue #'+(i+100), category: crmCats[i%6], status: statuses[i%5], priority: prios[i%4], branchId: branches[i%6].id, tenantId: tenant.id } });
  }
  console.log('80 CRM tickets');

  // Campaigns (15) + Coupons
  for (let i = 0; i < 15; i++) {
    const names = ['Ramadan Special','Summer Deals','Loyalty Boost','New Menu','Weekend Promo','Student Discount','Family Pack','Holiday Special','Flash Sale','Anniversary','National Day','Winter Warmup','Breakfast Club','Late Night','VIP Members'];
    const c = await prisma.campaign.create({ data: { name: names[i], type: ['DISCOUNT','PROMOTION','EVENT','SOCIAL_MEDIA','OTHER'][i%5], status: ['DRAFT','ACTIVE','PAUSED','COMPLETED'][i%4], startDate: new Date(2024,i%12,1), budget: 5000+i*2000, tenantId: tenant.id } });
    await prisma.coupon.upsert({ where: { code_tenantId: { code: 'PROMO'+String(i+1).padStart(2,'0'), tenantId: tenant.id } }, update: {}, create: { code: 'PROMO'+String(i+1).padStart(2,'0'), campaignId: c.id, discountType: i%2===0?'PERCENTAGE':'FIXED', discountValue: i%2===0?10+i:20+i*5, maxUses: 100+i*50, usedCount: Math.floor(Math.random()*50), tenantId: tenant.id } });
  }

  // IT Tickets (40) + Assets
  const itCats = ['Hardware','Software','Network','Email','Printer','Access','VPN','Other'];
  for (let i = 0; i < 40; i++) {
    await prisma.supportTicket.upsert({ where: { number_tenantId: { number: 'IT-'+String(i+1).padStart(3,'0'), tenantId: tenant.id } }, update: {}, create: { number: 'IT-'+String(i+1).padStart(3,'0'), title: itCats[i%8]+' issue', category: itCats[i%8], status: statuses[i%5], priority: prios[i%4], requesterId: owner.id, tenantId: tenant.id } });
  }
  for (let i = 0; i < 20; i++) {
    await prisma.iTAsset.create({ data: { name: ['LAPTOP','DESKTOP','PHONE','TABLET','PRINTER','NETWORK'][i%6]+' #'+(i+1), type: ['LAPTOP','DESKTOP','PHONE','TABLET','PRINTER','NETWORK'][i%6], serialNumber: 'SN-'+Date.now()+'-'+i, branchId: branches[i%7].id, status: i%5===0?'MAINTENANCE':'ACTIVE', tenantId: tenant.id } });
  }
  console.log('40 IT tickets + 20 assets');

  // Tasks (100)
  const taskTitles = ['Review report','Update inventory','Follow up customer','Prepare presentation','Conduct inspection','Fix issue','Order supplies','Train staff','Update system','Clean workspace'];
  for (let i = 0; i < 100; i++) {
    await prisma.task.create({ data: { title: 'Task '+(i+1)+': '+taskTitles[i%10], status: ['TODO','IN_PROGRESS','REVIEW','DONE'][i%4], priority: prios[i%4], branchId: branches[i%7].id, moduleKey: mods[i%mods.length], dueDate: new Date(2025,0,(i%28)+1), tenantId: tenant.id } });
  }
  console.log('100 tasks');

  // Workflow + Approvals (40)
  const wf = await prisma.workflow.create({ data: { name: 'Standard Approval', moduleKey: 'general', tenantId: tenant.id, steps: { create: [{ stepOrder: 1, approverRoleKey: 'BRANCH_MANAGER' }, { stepOrder: 2, approverRoleKey: 'AREA_MANAGER' }, { stepOrder: 3, approverRoleKey: 'FINANCE_MANAGER' }] } } });
  for (let i = 0; i < 40; i++) {
    await prisma.approvalRequest.create({ data: { workflowId: wf.id, entityType: ['EXPENSE','LEAVE','PO','TASK'][i%4], entityId: 'e-'+i, status: ['SUBMITTED','APPROVED','REJECTED','SUBMITTED','SUBMITTED'][i%5], currentStep: i%3, requesterId: owner.id, tenantId: tenant.id } });
  }
  console.log('40 approvals');

  // Checklists, Inspections, Issues, Leave Requests, Quality, Production
  for (let i = 0; i < 20; i++) await prisma.checklist.create({ data: { title: ['Daily Opening','Daily Closing','Weekly Deep Clean','Monthly Safety'][i%4]+' - '+branches[i%7].name, branchId: branches[i%7].id, frequency: ['DAILY','DAILY','WEEKLY','MONTHLY'][i%4], items: JSON.stringify([{id:'ci-'+i,text:'Check equipment',isCompleted:true}]), completedAt: i%3===0?new Date():null, tenantId: tenant.id } });
  for (let i = 0; i < 20; i++) await prisma.leaveRequest.create({ data: { employeeId: employees[i%60].id, type: ['ANNUAL','SICK','PERSONAL','MATERNITY','OTHER'][i%5], startDate: new Date(2025,0,i*2+1), endDate: new Date(2025,0,i*2+3), status: ['PENDING','APPROVED','REJECTED','PENDING'][i%4], tenantId: tenant.id } });
  for (let i = 0; i < 10; i++) await prisma.qualityChecklist.create({ data: { title: ['Food Safety','Hygiene Check','Compliance','HACCP'][i%4]+' - '+branches[i%7].name, branchId: branches[i%7].id, type: ['FOOD_SAFETY','HYGIENE','COMPLIANCE','CUSTOM'][i%4], items: JSON.stringify([{id:'q'+i,text:'Check temp',passed:true}]), score: 75+Math.floor(Math.random()*25), auditorId: owner.id, tenantId: tenant.id } });
  for (let i = 0; i < 8; i++) await prisma.nonconformance.create({ data: { title: 'NCR-'+String(i+1).padStart(3,'0'), branchId: branches[i%7].id, category: ['FOOD_SAFETY','HYGIENE','LABELING','PROCESS'][i%4], severity: ['MINOR','MAJOR','CRITICAL'][i%3], status: ['OPEN','INVESTIGATING','CORRECTIVE_ACTION','CLOSED'][i%4], tenantId: tenant.id } });

  // Recipes + Production Orders
  const recipeData = [{name:'Chicken Shawarma',code:'RCP-001'},{name:'Beef Burger Patty',code:'RCP-002'},{name:'Falafel Mix',code:'RCP-003'},{name:'Hummus Base',code:'RCP-004'},{name:'Pizza Dough',code:'RCP-005'}];
  const recipes: any[] = [];
  for (const r of recipeData) {
    recipes.push(await prisma.recipe.upsert({ where: { code_tenantId: { code: r.code, tenantId: tenant.id } }, update: {}, create: { name: r.name, code: r.code, outputItemId: items[0].id, outputQuantity: 100, outputUnit: 'KG', materials: JSON.stringify([{itemId:items[0].id,itemName:items[0].name,quantity:50,unit:'KG'}]), tenantId: tenant.id } }));
  }
  for (let i = 0; i < 15; i++) {
    await prisma.productionOrder.upsert({ where: { number_tenantId: { number: 'PRD-'+String(i+1).padStart(3,'0'), tenantId: tenant.id } }, update: {}, create: { number: 'PRD-'+String(i+1).padStart(3,'0'), recipeId: recipes[i%5].id, quantity: 50+i*20, status: ['PLANNED','IN_PROGRESS','COMPLETED','CANCELLED'][i%4], batchNumber: 'B-'+String(i+1).padStart(3,'0'), yieldQuantity: i%4===2?45+i*18:null, wasteQuantity: i%4===2?5+i*2:null, tenantId: tenant.id } });
  }

  // Connector + Forms + Reports
  await prisma.connector.create({ data: { name: 'Foodics POS (Demo)', type: 'POLLING', config: JSON.stringify({apiUrl:'https://api.foodics.com/v5',pollInterval:15}), isActive: false, tenantId: tenant.id } });
  await prisma.formDefinition.create({ data: { name: 'Leave Request Form', moduleKey: 'hr', fields: JSON.stringify([{key:'type',label:'Type',type:'select',options:['ANNUAL','SICK'],order:1},{key:'startDate',label:'Start',type:'date',order:2}]), tenantId: tenant.id } });
  await prisma.reportDefinition.create({ data: { name: 'Employee Directory', moduleKey: 'hr', entity: 'employee', filters: JSON.stringify([]), columns: JSON.stringify(['employeeNumber','firstName','lastName','email']), tenantId: tenant.id } });

  // Audit Logs + Notifications
  for (let i = 0; i < 20; i++) await prisma.auditLog.create({ data: { action: ['CREATE','UPDATE','DELETE','LOGIN','APPROVE'][i%5], entityType: ['User','PO','Employee','Expense','Task'][i%5], entityId: 'e-'+i, actorId: owner.id, actorEmail: owner.email, tenantId: tenant.id, metadata: {detail:'Action #'+(i+1)} } });
  for (let i = 0; i < 10; i++) await prisma.notification.create({ data: { userId: owner.id, title: ['New approval','Task overdue','Low stock','Inspection due','New ticket'][i%5], body: 'Notification #'+(i+1), type: ['APPROVAL','TASK','INVENTORY','OPS','CRM'][i%5], isRead: i<5, tenantId: tenant.id } });

  console.log('\\n✅ SEED COMPLETE');
  console.log('SuperAdmin: admin@consedra.local / Admin123!');
  console.log('Owner: owner@consedra.local / Owner123!');
  console.log('Tenant: consedra');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
`);

console.log('\n✅ All API files generated!');
console.log('Total files written. Run: node scripts/generate-project.js');
