import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Consedra ERP...');
  const adminHash = await bcrypt.hash('Admin123!', 12);
  const ownerHash = await bcrypt.hash('Owner123!', 12);
  const userHash = await bcrypt.hash('User123!', 12);

  // 1. SuperAdmin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@consedra.local' },
    update: {},
    create: { email: 'admin@consedra.local', passwordHash: adminHash, firstName: 'Super', lastName: 'Admin', isSuperAdmin: true, locale: 'en' },
  });
  console.log('SuperAdmin created:', superAdmin.email);

  // 2. Tenant + Owner
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'consedra' },
    update: {},
    create: { name: 'Consedra Group', slug: 'consedra' },
  });
  const owner = await prisma.user.upsert({
    where: { email: 'owner@consedra.local' },
    update: {},
    create: { email: 'owner@consedra.local', passwordHash: ownerHash, firstName: 'Mohammed', lastName: 'Al-Rashid', tenantId: tenant.id, locale: 'ar' },
  });
  await prisma.tenant.update({ where: { id: tenant.id }, data: { ownerId: owner.id } });
  console.log('Tenant + Owner created');

  // 3. Permissions
  const permDefs = [
    { key: 'view', name: 'View', category: 'general' },
    { key: 'create', name: 'Create', category: 'general' },
    { key: 'update', name: 'Update', category: 'general' },
    { key: 'delete', name: 'Delete', category: 'general' },
    { key: 'approve', name: 'Approve', category: 'workflow' },
    { key: 'export', name: 'Export', category: 'reports' },
    { key: 'manage-users', name: 'Manage Users', category: 'admin' },
    { key: 'manage-roles', name: 'Manage Roles', category: 'admin' },
    { key: 'manage-modules', name: 'Manage Modules', category: 'admin' },
    { key: 'manage-settings', name: 'Manage Settings', category: 'admin' },
    { key: 'assign', name: 'Assign', category: 'workflow' },
    { key: 'close', name: 'Close', category: 'workflow' },
    { key: 'transfer', name: 'Transfer', category: 'admin' },
    { key: 'impersonate', name: 'Impersonate', category: 'admin' },
  ];
  const perms: Record<string, string> = {};
  for (const p of permDefs) {
    const perm = await prisma.permissionDefinition.upsert({
      where: { key: p.key },
      update: {},
      create: { key: p.key, name: p.name, category: p.category },
    });
    perms[p.key] = perm.id;
  }
  console.log('14 permissions created');

  // 4. Roles
  const roleDefs = [
    { name: 'SuperAdmin', key: 'superadmin', permKeys: Object.keys(perms) },
    { name: 'Owner', key: 'owner', permKeys: Object.keys(perms).filter(k => k !== 'impersonate') },
    { name: 'General Manager', key: 'general-manager', permKeys: ['view', 'create', 'update', 'delete', 'approve', 'export', 'manage-users', 'manage-roles', 'assign', 'close'] },
    { name: 'Regional Manager', key: 'regional-manager', permKeys: ['view', 'create', 'update', 'approve', 'export', 'assign', 'close'] },
    { name: 'Branch Manager', key: 'branch-manager', permKeys: ['view', 'create', 'update', 'approve', 'export', 'assign', 'close'] },
    { name: 'Dept Head', key: 'dept-head', permKeys: ['view', 'create', 'update', 'approve', 'export', 'assign'] },
    { name: 'Supervisor', key: 'supervisor', permKeys: ['view', 'create', 'update', 'assign'] },
    { name: 'Employee', key: 'employee', permKeys: ['view'] },
    { name: 'HR', key: 'hr', permKeys: ['view', 'create', 'update', 'export', 'manage-users'] },
    { name: 'Finance', key: 'finance', permKeys: ['view', 'create', 'update', 'export', 'approve'] },
    { name: 'Warehouse', key: 'warehouse', permKeys: ['view', 'create', 'update', 'export'] },
    { name: 'QA', key: 'qa', permKeys: ['view', 'create', 'update', 'export', 'approve'] },
    { name: 'IT', key: 'it', permKeys: ['view', 'create', 'update', 'manage-settings'] },
    { name: 'Read Only', key: 'read-only', permKeys: ['view'] },
  ];
  const roles: Record<string, string> = {};
  for (const r of roleDefs) {
    const existing = await prisma.roleDefinition.findFirst({ where: { key: r.key, tenantId: tenant.id } });
    const role = existing || await prisma.roleDefinition.create({
      data: { name: r.name, key: r.key, tenantId: tenant.id },
    });
    roles[r.key] = role.id;
    for (const pk of r.permKeys) {
      if (perms[pk]) {
        const existingRP = await prisma.rolePermission.findFirst({ where: { roleId: role.id, permissionId: perms[pk] } });
        if (!existingRP) {
          await prisma.rolePermission.create({ data: { roleId: role.id, permissionId: perms[pk] } });
        }
      }
    }
  }
  console.log('14 roles created with permissions');

  // Assign Owner role to owner user
  const existingUR = await prisma.userRole.findFirst({ where: { userId: owner.id, roleId: roles['owner'] } });
  if (!existingUR) {
    await prisma.userRole.create({ data: { userId: owner.id, roleId: roles['owner'] } });
  }

  // 5. Regions
  const region1 = await prisma.region.upsert({
    where: { code_tenantId: { code: 'RYD', tenantId: tenant.id } },
    update: {},
    create: { name: 'Riyadh Region', code: 'RYD', tenantId: tenant.id },
  });
  const region2 = await prisma.region.upsert({
    where: { code_tenantId: { code: 'JED', tenantId: tenant.id } },
    update: {},
    create: { name: 'Jeddah Region', code: 'JED', tenantId: tenant.id },
  });
  console.log('2 regions created');

  // 6. Departments
  const deptData = [
    { name: 'Operations', code: 'OPS' },
    { name: 'Finance', code: 'FIN' },
    { name: 'HR', code: 'HR' },
    { name: 'IT', code: 'IT' },
    { name: 'Marketing', code: 'MKT' },
    { name: 'Quality', code: 'QA' },
    { name: 'Warehouse', code: 'WH' },
    { name: 'Production', code: 'PRD' },
  ];
  const departments: any[] = [];
  for (const d of deptData) {
    const dept = await prisma.department.upsert({
      where: { code_tenantId: { code: d.code, tenantId: tenant.id } },
      update: {},
      create: { name: d.name, code: d.code, tenantId: tenant.id },
    });
    departments.push(dept);
  }
  console.log('8 departments created');

  // 7. Branches
  const branchData = [
    { name: 'Olaya Branch', code: 'BR-OLY', regionId: region1.id, type: 'BRANCH' },
    { name: 'Malaz Branch', code: 'BR-MLZ', regionId: region1.id, type: 'BRANCH' },
    { name: 'Sulaimaniya Branch', code: 'BR-SLM', regionId: region1.id, type: 'BRANCH' },
    { name: 'Tahlia Branch', code: 'BR-THL', regionId: region2.id, type: 'BRANCH' },
    { name: 'Corniche Branch', code: 'BR-CRN', regionId: region2.id, type: 'BRANCH' },
    { name: 'Al-Hamra Branch', code: 'BR-HMR', regionId: region2.id, type: 'BRANCH' },
    { name: 'Central Kitchen', code: 'BR-CK', regionId: region1.id, type: 'FACTORY' },
  ];
  const branches: any[] = [];
  for (const b of branchData) {
    const branch = await prisma.branch.upsert({
      where: { code_tenantId: { code: b.code, tenantId: tenant.id } },
      update: {},
      create: { ...b, tenantId: tenant.id },
    });
    branches.push(branch);
  }
  console.log('7 branches created');

  // 8. Positions
  const posNames = ['Chef', 'Sous Chef', 'Line Cook', 'Cashier', 'Waiter', 'Manager', 'Supervisor', 'Accountant'];
  const positions: any[] = [];
  for (let i = 0; i < posNames.length; i++) {
    const pos = await prisma.position.create({
      data: { title: posNames[i], departmentId: departments[i % departments.length].id, tenantId: tenant.id },
    });
    positions.push(pos);
  }

  // 9. Employees (60)
  const firstNames = ['Ahmed', 'Khalid', 'Omar', 'Faisal', 'Saud', 'Nasser', 'Ali', 'Hassan', 'Ibrahim', 'Youssef', 'Tariq', 'Saleh', 'Majid', 'Rashed', 'Hamad', 'Fahad', 'Waleed', 'Saeed', 'Bandar', 'Turki', 'Nora', 'Fatima', 'Aisha', 'Sara', 'Maha', 'Layla', 'Huda', 'Reem', 'Dana', 'Lina', 'Mansour', 'Zayed', 'Sultan', 'Badr', 'Nawaf', 'Mishal', 'Abdulaziz', 'Abdulrahman', 'Abdallah', 'Mazen', 'Younis', 'Jamal', 'Karim', 'Hamed', 'Salim', 'Rashid', 'Mubarak', 'Thamer', 'Naif', 'Mohannad', 'Basem', 'Anas', 'Wael', 'Ammar', 'Ziyad', 'Hatem', 'Osama', 'Adel', 'Samer', 'Tamer'];
  const lastNames = ['Al-Saud', 'Al-Rashid', 'Al-Fahad', 'Al-Qahtani', 'Al-Dosari', 'Al-Shehri', 'Al-Ghamdi', 'Al-Otaibi', 'Al-Harbi', 'Al-Mutairi'];
  const empRoles = ['employee', 'supervisor', 'branch-manager', 'dept-head', 'hr', 'finance', 'warehouse', 'qa', 'it'];

  for (let i = 0; i < 60; i++) {
    const fn = firstNames[i];
    const ln = lastNames[i % lastNames.length];
    const email = `${fn.toLowerCase()}.${ln.toLowerCase().replace('al-', '')}@consedra.local`;
    const branch = branches[i % branches.length];
    const dept = departments[i % departments.length];
    const pos = positions[i % positions.length];
    const roleKey = empRoles[i % empRoles.length];
    const empNum = `EMP-${String(i + 1).padStart(3, '0')}`;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash: userHash, firstName: fn, lastName: ln, tenantId: tenant.id, locale: i % 3 === 0 ? 'en' : 'ar' },
    });

    const existingEmp = await prisma.employee.findFirst({ where: { employeeNumber: empNum, tenantId: tenant.id } });
    if (!existingEmp) {
      await prisma.employee.create({
        data: {
          employeeNumber: empNum,
          firstName: fn,
          lastName: ln,
          email,
          userId: user.id,
          branchId: branch.id,
          departmentId: dept.id,
          positionId: pos.id,
          tenantId: tenant.id,
          hireDate: new Date(2023, i % 12, (i % 28) + 1),
        },
      });
    }

    if (roles[roleKey]) {
      const existingRole = await prisma.userRole.findFirst({ where: { userId: user.id, roleId: roles[roleKey] } });
      if (!existingRole) {
        await prisma.userRole.create({ data: { userId: user.id, roleId: roles[roleKey] } });
      }
    }
  }
  console.log('60 employees created');

  // 10. Tenant Modules
  const moduleNames = ['hr', 'finance', 'inventory', 'purchasing', 'crm', 'projects', 'quality', 'production', 'it-support', 'operations', 'sales'];
  for (const m of moduleNames) {
    const existing = await prisma.tenantModule.findFirst({ where: { tenantId: tenant.id, moduleKey: m } });
    if (!existing) {
      await prisma.tenantModule.create({ data: { tenantId: tenant.id, moduleKey: m, isEnabled: true } });
    }
  }
  console.log('11 modules enabled');

  // 11. Warehouses
  for (let i = 0; i < branches.length; i++) {
    const b = branches[i];
    await prisma.warehouse.create({ data: { name: `${b.name} Store`, branchId: b.id, tenantId: tenant.id } });
  }
  const warehouses = await prisma.warehouse.findMany({ where: { tenantId: tenant.id } });
  console.log('7 warehouses created');

  // 12. Inventory Items (20)
  const itemData = [
    { name: 'Chicken Breast', sku: 'RAW-001', unit: 'kg' },
    { name: 'Beef Tenderloin', sku: 'RAW-002', unit: 'kg' },
    { name: 'Rice Basmati', sku: 'RAW-003', unit: 'kg' },
    { name: 'Olive Oil', sku: 'RAW-004', unit: 'liter' },
    { name: 'Flour', sku: 'RAW-005', unit: 'kg' },
    { name: 'Tomato Sauce', sku: 'RAW-006', unit: 'liter' },
    { name: 'Mozzarella Cheese', sku: 'RAW-007', unit: 'kg' },
    { name: 'Lettuce', sku: 'RAW-008', unit: 'kg' },
    { name: 'Onions', sku: 'RAW-009', unit: 'kg' },
    { name: 'Garlic', sku: 'RAW-010', unit: 'kg' },
    { name: 'Paper Cups', sku: 'PKG-001', unit: 'piece' },
    { name: 'Takeaway Boxes', sku: 'PKG-002', unit: 'piece' },
    { name: 'Napkins', sku: 'PKG-003', unit: 'pack' },
    { name: 'Cleaning Solution', sku: 'CLN-001', unit: 'liter' },
    { name: 'Dish Soap', sku: 'CLN-002', unit: 'liter' },
    { name: 'Gloves Box', sku: 'SAF-001', unit: 'box' },
    { name: 'Aprons', sku: 'SAF-002', unit: 'piece' },
    { name: 'Grilled Chicken Meal', sku: 'FIN-001', unit: 'piece' },
    { name: 'Kabsa Plate', sku: 'FIN-002', unit: 'piece' },
    { name: 'Mixed Grill Platter', sku: 'FIN-003', unit: 'piece' },
  ];
  const items: any[] = [];
  for (const it of itemData) {
    const item = await prisma.inventoryItem.upsert({
      where: { sku_tenantId: { sku: it.sku, tenantId: tenant.id } },
      update: {},
      create: { ...it, tenantId: tenant.id },
    });
    items.push(item);
  }
  console.log('20 inventory items created');

  // 13. Stock Levels (50)
  for (let i = 0; i < 50; i++) {
    const itemId = items[i % items.length].id;
    const warehouseId = warehouses[i % warehouses.length].id;
    const existing = await prisma.stockLevel.findFirst({ where: { itemId, warehouseId } });
    if (!existing) {
      await prisma.stockLevel.create({
        data: { itemId, warehouseId, quantity: Math.floor(Math.random() * 500) + 10, tenantId: tenant.id },
      });
    }
  }
  console.log('50 stock levels created');

  // 14. Suppliers
  const supplierNames = ['Gulf Foods Co', 'Al-Marai Supplies', 'Savola Group', 'Panda Wholesale', 'BinDawood Trading'];
  const suppliers: any[] = [];
  for (const s of supplierNames) {
    const sup = await prisma.supplier.create({
      data: { name: s, email: `info@${s.toLowerCase().replace(/[^a-z]/g, '')}.com`, tenantId: tenant.id },
    });
    suppliers.push(sup);
  }

  // 15. Purchase Orders (30)
  const poStatuses = ['DRAFT', 'SUBMITTED', 'APPROVED', 'RECEIVED', 'CANCELLED'];
  for (let i = 0; i < 30; i++) {
    const poNum = `PO-${String(i + 1).padStart(4, '0')}`;
    const existing = await prisma.purchaseOrder.findFirst({ where: { number: poNum, tenantId: tenant.id } });
    if (!existing) {
      await prisma.purchaseOrder.create({
        data: {
          number: poNum,
          supplierId: suppliers[i % suppliers.length].id,
          status: poStatuses[i % poStatuses.length],
          items: JSON.stringify([{ sku: items[i % items.length].sku, qty: 10 }]),
          totalAmount: Math.floor(Math.random() * 50000) + 1000,
          tenantId: tenant.id,
        },
      });
    }
  }
  console.log('30 purchase orders created');

  // 16. Cost Centers
  const ccData = [
    { name: 'Operations', code: 'CC-OPS' },
    { name: 'Marketing', code: 'CC-MKT' },
    { name: 'Admin', code: 'CC-ADM' },
    { name: 'Logistics', code: 'CC-LOG' },
    { name: 'R&D', code: 'CC-RND' },
    { name: 'HR', code: 'CC-HR' },
    { name: 'IT', code: 'CC-IT' },
  ];
  const costCenters: any[] = [];
  for (const c of ccData) {
    const cc = await prisma.costCenter.upsert({
      where: { code_tenantId: { code: c.code, tenantId: tenant.id } },
      update: {},
      create: { name: c.name, code: c.code, tenantId: tenant.id },
    });
    costCenters.push(cc);
  }

  // 17. Expenses (40)
  for (let i = 0; i < 40; i++) {
    await prisma.expense.create({
      data: {
        description: `Expense ${i + 1}`,
        amount: Math.floor(Math.random() * 10000) + 100,
        status: i % 3 === 0 ? 'PENDING' : 'APPROVED',
        costCenterId: costCenters[i % costCenters.length].id,
        submittedById: owner.id,
        tenantId: tenant.id,
        date: new Date(2024, i % 12, (i % 28) + 1),
      },
    });
  }
  console.log('40 expenses created');

  // 18. Sales Summaries (30)
  for (let i = 0; i < 30; i++) {
    const branchId = branches[i % branches.length].id;
    const date = new Date(2024, i % 12, (i % 28) + 1);
    const existing = await prisma.salesSummary.findFirst({ where: { branchId, date, source: 'MANUAL' } });
    if (!existing) {
      await prisma.salesSummary.create({
        data: {
          branchId,
          date,
          totalSales: Math.floor(Math.random() * 30000) + 5000,
          totalOrders: Math.floor(Math.random() * 200) + 50,
          tenantId: tenant.id,
        },
      });
    }
  }
  console.log('30 sales summaries created');

  // 19. CRM Tickets (80)
  const crmStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  const crmPriorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  for (let i = 0; i < 80; i++) {
    const ticketNum = `CRM-${String(i + 1).padStart(4, '0')}`;
    const existing = await prisma.crmTicket.findFirst({ where: { number: ticketNum, tenantId: tenant.id } });
    if (!existing) {
      await prisma.crmTicket.create({
        data: {
          number: ticketNum,
          customerName: `Customer ${i + 1}`,
          subject: `Customer Issue #${i + 1}`,
          category: 'COMPLAINT',
          status: crmStatuses[i % crmStatuses.length],
          priority: crmPriorities[i % crmPriorities.length],
          tenantId: tenant.id,
        },
      });
    }
  }
  console.log('80 CRM tickets created');

  // 20. Campaigns (15) + Coupons
  for (let i = 0; i < 15; i++) {
    const campaign = await prisma.campaign.create({
      data: {
        name: `Campaign ${i + 1}`,
        type: i % 2 === 0 ? 'DISCOUNT' : 'PROMOTION',
        status: i < 10 ? 'ACTIVE' : 'ENDED',
        startDate: new Date(2024, i % 12, 1),
        endDate: new Date(2024, (i % 12) + 1, 28),
        tenantId: tenant.id,
      },
    });
    const couponCode = `COUP${String(i + 1).padStart(3, '0')}`;
    const existingCoupon = await prisma.coupon.findFirst({ where: { code: couponCode, tenantId: tenant.id } });
    if (!existingCoupon) {
      await prisma.coupon.create({
        data: {
          code: couponCode,
          discountValue: (i + 1) * 5,
          campaignId: campaign.id,
          maxUses: 100,
          usedCount: Math.floor(Math.random() * 50),
          tenantId: tenant.id,
        },
      });
    }
  }
  console.log('15 campaigns + coupons created');

  // 21. Support Tickets (40)
  for (let i = 0; i < 40; i++) {
    const ticketNum = `IT-${String(i + 1).padStart(4, '0')}`;
    const existing = await prisma.supportTicket.findFirst({ where: { number: ticketNum, tenantId: tenant.id } });
    if (!existing) {
      await prisma.supportTicket.create({
        data: {
          number: ticketNum,
          title: `IT Issue #${i + 1}`,
          category: 'HARDWARE',
          status: crmStatuses[i % crmStatuses.length],
          priority: crmPriorities[i % crmPriorities.length],
          requesterId: owner.id,
          tenantId: tenant.id,
        },
      });
    }
  }

  // 22. IT Assets (20)
  const assetTypes = ['LAPTOP', 'DESKTOP', 'PRINTER', 'ROUTER', 'POS', 'TABLET'];
  for (let i = 0; i < 20; i++) {
    await prisma.iTAsset.create({
      data: {
        name: `${assetTypes[i % assetTypes.length]} #${i + 1}`,
        type: assetTypes[i % assetTypes.length],
        status: i < 17 ? 'ACTIVE' : 'MAINTENANCE',
        branchId: branches[i % branches.length].id,
        tenantId: tenant.id,
      },
    });
  }
  console.log('40 IT tickets + 20 IT assets created');

  // 23. Projects + Tasks (100)
  const projects: any[] = [];
  const projNames = ['Kitchen Renovation', 'POS Upgrade', 'Menu Redesign', 'Staff Training', 'Marketing Q1'];
  for (const pn of projNames) {
    const proj = await prisma.project.create({ data: { name: pn, status: 'ACTIVE', tenantId: tenant.id } });
    projects.push(proj);
  }
  const taskStatuses = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
  const taskPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  for (let i = 0; i < 100; i++) {
    await prisma.task.create({
      data: {
        title: `Task ${i + 1}`,
        description: `Task description ${i + 1}`,
        status: taskStatuses[i % taskStatuses.length],
        priority: taskPriorities[i % taskPriorities.length],
        projectId: projects[i % projects.length].id,
        tenantId: tenant.id,
      },
    });
  }
  console.log('5 projects + 100 tasks created');

  // 24. Workflow + Approvals
  const workflow = await prisma.workflow.create({
    data: { name: 'Purchase Approval', moduleKey: 'purchasing', tenantId: tenant.id },
  });
  const stepNames = ['Manager Review', 'Finance Approval', 'Final Sign-off'];
  for (let i = 0; i < stepNames.length; i++) {
    await prisma.workflowStep.create({
      data: { workflowId: workflow.id, stepOrder: i + 1, approverRoleKey: 'branch-manager', description: stepNames[i] },
    });
  }
  const approvalStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];
  for (let i = 0; i < 40; i++) {
    await prisma.approvalRequest.create({
      data: {
        workflowId: workflow.id,
        entityType: 'PurchaseOrder',
        entityId: `entity-${i + 1}`,
        status: approvalStatuses[i % approvalStatuses.length],
        requesterId: owner.id,
        tenantId: tenant.id,
      },
    });
  }
  console.log('1 workflow + 40 approvals created');

  // 25. Leave Requests (20)
  const leaveTypes = ['ANNUAL', 'SICK', 'PERSONAL', 'MATERNITY'];
  const employees = await prisma.employee.findMany({ where: { tenantId: tenant.id }, take: 20 });
  for (let i = 0; i < 20; i++) {
    await prisma.leaveRequest.create({
      data: {
        employeeId: employees[i % employees.length].id,
        type: leaveTypes[i % leaveTypes.length],
        startDate: new Date(2024, i % 12, (i % 28) + 1),
        endDate: new Date(2024, i % 12, (i % 28) + 3),
        status: i < 15 ? 'APPROVED' : 'PENDING',
        tenantId: tenant.id,
      },
    });
  }
  console.log('20 leave requests created');

  // 26. Checklists (20)
  for (let i = 0; i < 20; i++) {
    await prisma.checklist.create({
      data: {
        title: `Checklist ${i + 1}`,
        branchId: branches[i % branches.length].id,
        tenantId: tenant.id,
      },
    });
  }

  // 27. Quality Checklists (10) + Nonconformances (8)
  for (let i = 0; i < 10; i++) {
    await prisma.qualityChecklist.create({
      data: {
        title: `Quality Check ${i + 1}`,
        branchId: branches[i % branches.length].id,
        score: Math.floor(Math.random() * 30) + 70,
        auditorId: owner.id,
        tenantId: tenant.id,
      },
    });
  }
  for (let i = 0; i < 8; i++) {
    await prisma.nonconformance.create({
      data: {
        title: `NC-${String(i + 1).padStart(3, '0')}`,
        description: `Non-conformance issue ${i + 1}`,
        category: 'FOOD_SAFETY',
        severity: i % 2 === 0 ? 'MAJOR' : 'MINOR',
        status: i < 5 ? 'CLOSED' : 'OPEN',
        branchId: branches[i % branches.length].id,
        tenantId: tenant.id,
      },
    });
  }
  console.log('10 quality checklists + 8 nonconformances created');

  // 28. Recipes (5) + Production Orders (15)
  const recipes: any[] = [];
  const recipeData = [
    { name: 'Grilled Chicken', code: 'RCP-001' },
    { name: 'Kabsa', code: 'RCP-002' },
    { name: 'Mixed Grill', code: 'RCP-003' },
    { name: 'Hummus', code: 'RCP-004' },
    { name: 'Fattoush', code: 'RCP-005' },
  ];
  for (const r of recipeData) {
    const recipe = await prisma.recipe.upsert({
      where: { code_tenantId: { code: r.code, tenantId: tenant.id } },
      update: {},
      create: {
        name: r.name,
        code: r.code,
        outputItemId: items[0].id,
        outputQuantity: 1,
        materials: JSON.stringify([{ itemId: items[0].id, qty: 0.5 }]),
        tenantId: tenant.id,
      },
    });
    recipes.push(recipe);
  }
  for (let i = 0; i < 15; i++) {
    const prdNum = `PRD-${String(i + 1).padStart(4, '0')}`;
    const existing = await prisma.productionOrder.findFirst({ where: { number: prdNum, tenantId: tenant.id } });
    if (!existing) {
      await prisma.productionOrder.create({
        data: {
          number: prdNum,
          recipeId: recipes[i % recipes.length].id,
          quantity: Math.floor(Math.random() * 100) + 10,
          status: i < 10 ? 'COMPLETED' : 'IN_PROGRESS',
          tenantId: tenant.id,
        },
      });
    }
  }
  console.log('5 recipes + 15 production orders created');

  // 29. Connector
  await prisma.connector.create({
    data: {
      name: 'Foodics POS',
      type: 'REST_API',
      config: { baseUrl: 'https://api.foodics.com/v5', auth: 'bearer' },
      isActive: true,
      tenantId: tenant.id,
    },
  });

  // 30. Form Definitions
  await prisma.formDefinition.create({
    data: {
      name: 'Leave Request Form',
      moduleKey: 'hr',
      fields: {
        sections: [
          { title: 'Leave Details', fields: [
            { name: 'type', type: 'select', options: ['annual', 'sick', 'personal'] },
            { name: 'startDate', type: 'date' },
            { name: 'endDate', type: 'date' },
            { name: 'reason', type: 'textarea' },
          ] },
        ],
      },
      tenantId: tenant.id,
    },
  });
  await prisma.formDefinition.create({
    data: {
      name: 'Expense Claim Form',
      moduleKey: 'finance',
      fields: {
        sections: [
          { title: 'Expense Details', fields: [
            { name: 'amount', type: 'number' },
            { name: 'category', type: 'select', options: ['travel', 'supplies', 'meals'] },
            { name: 'receipt', type: 'file' },
            { name: 'notes', type: 'textarea' },
          ] },
        ],
      },
      tenantId: tenant.id,
    },
  });

  // 31. Report Definition
  await prisma.reportDefinition.create({
    data: {
      name: 'Monthly Sales Report',
      moduleKey: 'sales',
      entity: 'SalesSummary',
      filters: { branch: true, dateRange: true },
      columns: ['branch', 'date', 'totalSales', 'totalOrders'],
      tenantId: tenant.id,
    },
  });

  // 32. Audit Logs (20)
  for (let i = 0; i < 20; i++) {
    await prisma.auditLog.create({
      data: {
        action: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN'][i % 4],
        entityType: ['User', 'Employee', 'PurchaseOrder', 'Task'][i % 4],
        entityId: `entity-${i}`,
        actorId: owner.id,
        actorEmail: owner.email,
        tenantId: tenant.id,
      },
    });
  }

  // 33. Notifications (10)
  for (let i = 0; i < 10; i++) {
    await prisma.notification.create({
      data: {
        title: `Notification ${i + 1}`,
        body: `Notification body ${i + 1}`,
        userId: owner.id,
        isRead: i < 5,
        tenantId: tenant.id,
      },
    });
  }

  console.log('Seed completed! 600+ records created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
