import { PrismaClient } from @prisma/client;
import * as bcrypt from bcryptjs;

const prisma = new PrismaClient();

async function main() {
  console.log(Seeding Consedra ERP...);
  const adminHash = await bcrypt.hash(Admin123!, 12);
  const ownerHash = await bcrypt.hash(Owner123!, 12);
  const userHash = await bcrypt.hash(User123!, 12);

  // 1. SuperAdmin
  const superAdmin = await prisma.user.upsert({ where: { email: admin@consedra.local }, update: {}, create: { email: admin@consedra.local, passwordHash: adminHash, firstName: Super, lastName: Admin, isSuperAdmin: true, locale: en } });
  console.log(SuperAdmin created:, superAdmin.email);
  // 2. Tenant
  const tenant = await prisma.tenant.upsert({ where: { slug: consedra }, update: {}, create: { name: Consedra Group, slug: consedra } });
  const owner = await prisma.user.upsert({ where: { email: owner@consedra.local }, update: {}, create: { email: owner@consedra.local, passwordHash: ownerHash, firstName: Mohammed, lastName: Al-Rashid, tenantId: tenant.id, locale: ar } });
  await prisma.tenant.update({ where: { id: tenant.id }, data: { ownerId: owner.id } });
  console.log(Tenant + Owner created);

  // 4. Permissions
  const permissionKeys = [
    { key: view, name: View, category: general }, { key: create, name: Create, category: general },
    { key: update, name: Update, category: general }, { key: delete, name: Delete, category: general },
    { key: approve, name: Approve, category: workflow }, { key: export, name: Export, category: reports },
    { key: manage-users, name: Manage Users, category: admin }, { key: manage-roles, name: Manage Roles, category: admin },
    { key: manage-modules, name: Manage Modules, category: admin }, { key: manage-settings, name: Manage Settings, category: admin },
    { key: assign, name: Assign, category: workflow }, { key: close, name: Close, category: workflow },
    { key: transfer, name: Transfer, category: admin }, { key: impersonate, name: Impersonate, category: admin },
  ];
  const permMap: Record<string, string> = {};
  for (const p of permissionKeys) { const perm = await prisma.permissionDefinition.upsert({ where: { key: p.key }, update: {}, create: p }); permMap[p.key] = perm.id; }
  // 5. Roles
  const roleData = [
    { key: OWNER, name: Owner, perms: [view,create,update,delete,approve,export,manage-users,manage-roles,manage-modules,manage-settings,assign,close,transfer] },
    { key: HEAD_OF_DEPARTMENT, name: Head of Department, perms: [view,create,update,approve,export,assign,close] },
    { key: EMPLOYEE, name: Employee, perms: [view,create] },
    { key: OPERATIONS_MANAGER, name: Operations Manager, perms: [view,create,update,approve,export,assign,close] },
    { key: FACTORY_MANAGER, name: Factory Manager, perms: [view,create,update,approve,export,assign,close] },
    { key: PRODUCTION_MANAGER, name: Production Manager, perms: [view,create,update,approve,export,assign] },
    { key: AREA_MANAGER, name: Area Manager, perms: [view,create,update,approve,export,assign] },
    { key: BRANCH_MANAGER, name: Branch Manager, perms: [view,create,update,approve,assign,close] },
    { key: ASSISTANT_BRANCH_MANAGER, name: Asst. Branch Manager, perms: [view,create,update,assign] },
    { key: CASHIER, name: Cashier, perms: [view,create] },
    { key: FINANCE_MANAGER, name: Finance Manager, perms: [view,create,update,approve,export] },
    { key: HR_MANAGER, name: HR Manager, perms: [view,create,update,approve,export,manage-users] },
    { key: IT_MANAGER, name: IT Manager, perms: [view,create,update,approve,assign,close] },
    { key: MARKETING_MANAGER, name: Marketing Manager, perms: [view,create,update,export] },
  ];
  const roleMap: Record<string, string> = {};
  for (const r of roleData) { const role = await prisma.roleDefinition.upsert({ where: { key_tenantId: { key: r.key, tenantId: tenant.id } }, update: {}, create: { key: r.key, name: r.name, isSystem: true, tenantId: tenant.id } }); roleMap[r.key] = role.id; for (const pKey of r.perms) { await prisma.rolePermission.upsert({ where: { roleId_permissionId: { roleId: role.id, permissionId: permMap[pKey] } }, update: {}, create: { roleId: role.id, permissionId: permMap[pKey] } }); } }
  console.log(Roles + Permissions created);
  await prisma.userRole.upsert({ where: { userId_roleId_scopeType_scopeId: { userId: owner.id, roleId: roleMap[OWNER], scopeType: COMPANY, scopeId:  } }, update: {}, create: { userId: owner.id, roleId: roleMap[OWNER], scopeType: COMPANY, scopeId:  } });
  // 6-10. Regions, Branches, Depts, Positions, Modules
  const region1 = await prisma.region.upsert({ where: { code_tenantId: { code: CENTRAL, tenantId: tenant.id } }, update: {}, create: { name: Central Region, code: CENTRAL, tenantId: tenant.id } });
  const region2 = await prisma.region.upsert({ where: { code_tenantId: { code: WESTERN, tenantId: tenant.id } }, update: {}, create: { name: Western Region, code: WESTERN, tenantId: tenant.id } });
  const branchData = [{name:Downtown Branch,code:BR-001,type:BRANCH,regionId:region1.id},{name:Mall Branch,code:BR-002,type:BRANCH,regionId:region1.id},{name:Airport Branch,code:BR-003,type:BRANCH,regionId:region1.id},{name:West Mall Branch,code:BR-004,type:BRANCH,regionId:region2.id},{name:Corniche Branch,code:BR-005,type:BRANCH,regionId:region2.id},{name:University Branch,code:BR-006,type:BRANCH,regionId:region2.id},{name:Central Factory,code:FAC-001,type:FACTORY,regionId:region1.id}];
  const branches: any[] = [];
  for (const b of branchData) { branches.push(await prisma.branch.upsert({ where: { code_tenantId: { code: b.code, tenantId: tenant.id } }, update: {}, create: { ...b, tenantId: tenant.id } })); }
  console.log(Regions + Branches created);
  const deptNames = [Finance,HR,Operations,IT,Marketing,Procurement,Quality,Production];
  const deptCodes = [FIN,HR,OPS,IT,MKT,PROC,QA,PROD];
  const departments: any[] = [];
  for (let i = 0; i < deptNames.length; i++) { departments.push(await prisma.department.upsert({ where: { code_tenantId: { code: deptCodes[i], tenantId: tenant.id } }, update: {}, create: { name: deptNames[i], code: deptCodes[i], tenantId: tenant.id } })); }
  const positions: any[] = [];
  for (const dept of departments) { for (const t of [Manager,Senior Specialist,Specialist]) { positions.push(await prisma.position.create({ data: { title: ` - `, departmentId: dept.id, tenantId: tenant.id } })); } }
  const moduleKeys = [dashboard,operations,hr,finance,purchasing,inventory,sales,crm,marketing,it-helpdesk,quality,production,projects,approvals,forms,reports,documents,integrations];
  for (let i = 0; i < moduleKeys.length; i++) { await prisma.tenantModule.upsert({ where: { tenantId_moduleKey: { tenantId: tenant.id, moduleKey: moduleKeys[i] } }, update: {}, create: { tenantId: tenant.id, moduleKey: moduleKeys[i], isEnabled: true, order: i } }); }
  // 11. Employees (60)
  const firstNames = [Ahmad,Sara,Khalid,Fatima,Omar,Layla,Yusuf,Nora,Hassan,Aisha,Ali,Mona,Ibrahim,Rania,Tariq,Huda,Faisal,Dina,Samir,Jana,Bilal,Salma,Nasser,Lina,Ziad,Mariam,Rami,Sana,Walid,Yasmin,Adel,Ghada,Majid,Noura,Hamza,Eman,Sami,Rana,Karim,Hala,Murad,Dalal,Rashid,Asma,Nabil,Lubna,Ihab,Suha,Mazen,Afaf,Jamal,Wafa,Hazem,Reem,Amr,Hayat,Osama,Nisreen,Tamer,Sawsan];
  const lastNames = [Al-Ahmad,Al-Farsi,Al-Hamad,Al-Rashidi,Al-Qahtani,Al-Dosari,Al-Shamsi,Al-Harbi,Al-Sulaiman,Al-Otaibi];
  const roleAssignments = [EMPLOYEE,BRANCH_MANAGER,OPERATIONS_MANAGER,FINANCE_MANAGER,HR_MANAGER,IT_MANAGER,MARKETING_MANAGER,PRODUCTION_MANAGER,AREA_MANAGER,CASHIER];
  const employees: any[] = [];
  for (let i = 0; i < 60; i++) {
    const fn = firstNames[i]; const ln = lastNames[i % lastNames.length];
    const email = `.`.concat(@consedra.local);
    const dept = departments[i % departments.length]; const branch = branches[i % branches.length];
    const user = await prisma.user.upsert({ where: { email }, update: {}, create: { email, passwordHash: userHash, firstName: fn, lastName: ln, tenantId: tenant.id, locale: i % 3 === 0 ? ar : en } });
    const roleKey = roleAssignments[i % roleAssignments.length];
    await prisma.userRole.create({ data: { userId: user.id, roleId: roleMap[roleKey], scopeType: i < 10 ? COMPANY : BRANCH, scopeId: i < 10 ?  : branch.id } }).catch(() => {});
    const emp = await prisma.employee.upsert({ where: { employeeNumber_tenantId: { employeeNumber: `EMP-`, tenantId: tenant.id } }, update: {}, create: { userId: user.id, employeeNumber: `EMP-`, firstName: fn, lastName: ln, email, departmentId: dept.id, branchId: branch.id, hireDate: new Date(2022, i % 12, (i % 28) + 1), tenantId: tenant.id } });
    employees.push(emp);
  }
  console.log(60 Employees created);
  // 12-16. Warehouses, Items, Stock, Suppliers, POs
  const warehouses: any[] = [];
  for (const b of branches) { warehouses.push(await prisma.warehouse.create({ data: { name: ` Store`, branchId: b.id, type: b.type === FACTORY ? FACTORY : BRANCH, tenantId: tenant.id } })); }
  const itemNames = [Flour (50kg),Sugar (25kg),Salt (1kg),Olive Oil (5L),Chicken Breast (1kg),Beef Mince (1kg),Tomato Paste (2kg),Cheese Block (2kg),Butter (500g),Rice (10kg),Bread Rolls (pack),Lettuce (head),Onions (5kg),Garlic (1kg),Milk (1L),Cream (500ml),Eggs (tray),Napkins (box),Cups (sleeve),Packaging Boxes];
  const items: any[] = [];
  for (let i = 0; i < itemNames.length; i++) { items.push(await prisma.inventoryItem.upsert({ where: { sku_tenantId: { sku: `SKU-`, tenantId: tenant.id } }, update: {}, create: { name: itemNames[i], sku: `SKU-`, unit: i < 15 ? KG : EA, minStock: 10 + i * 5, tenantId: tenant.id } })); }
  for (let i = 0; i < 50; i++) { await prisma.stockLevel.upsert({ where: { itemId_warehouseId: { itemId: items[i%items.length].id, warehouseId: warehouses[i%warehouses.length].id } }, update: { quantity: Math.floor(Math.random()*500)+10 }, create: { itemId: items[i%items.length].id, warehouseId: warehouses[i%warehouses.length].id, quantity: Math.floor(Math.random()*500)+10, tenantId: tenant.id } }); }
  const supplierNames = [Fresh Farms Co.,Global Foods Trading,Al-Madina Supplies,Quick Pack Ltd.,Eastern Spices Inc.];
  const suppliers: any[] = [];
  for (const name of supplierNames) { suppliers.push(await prisma.supplier.create({ data: { name, email: `info@.com`, tenantId: tenant.id } })); }
  const poStatuses = [DRAFT,PENDING_APPROVAL,APPROVED,ORDERED,RECEIVED,CANCELLED];
  for (let i = 0; i < 30; i++) { await prisma.purchaseOrder.upsert({ where: { number_tenantId: { number: `PO-`, tenantId: tenant.id } }, update: {}, create: { number: `PO-`, supplierId: suppliers[i%suppliers.length].id, status: poStatuses[i%poStatuses.length], items: JSON.stringify([{itemId:items[i%items.length].id,itemName:items[i%items.length].name,quantity:(i+1)*10,unit:KG,unitPrice:15+i*2,receivedQuantity:0}]), totalAmount: (i+1)*10*(15+i*2), tenantId: tenant.id } }); }
  console.log(30 POs created);
  // 17-21. Cost Centers, Expenses, Sales, Journals, CRM
  const costCenters: any[] = [];
  for (const b of branches) { costCenters.push(await prisma.costCenter.upsert({ where: { code_tenantId: { code: `CC-`, tenantId: tenant.id } }, update: {}, create: { name: ` Cost Center`, code: `CC-`, tenantId: tenant.id } })); }
  const expCats = [Food Cost,Labor,Utilities,Rent,Maintenance,Marketing,Transport,Supplies];
  for (let i = 0; i < 40; i++) { await prisma.expense.create({ data: { description: ` - `, amount: 500+Math.floor(Math.random()*10000), branchId: branches[i%branches.length].id, costCenterId: costCenters[i%costCenters.length].id, submittedById: owner.id, status: i%3===0?APPROVED:i%3===1?PENDING:DRAFT, date: new Date(2024,11,(i%28)+1), tenantId: tenant.id } }); }
  for (let i = 0; i < 30; i++) { const branch=branches[i%6]; const d=new Date(2024,11,(i%28)+1); await prisma.salesSummary.upsert({ where: { branchId_date_source: { branchId: branch.id, date: d, source: SEED } }, update: {}, create: { branchId: branch.id, date: d, totalSales: 5000+Math.floor(Math.random()*45000), totalOrders: 50+Math.floor(Math.random()*200), paymentBreakdown: JSON.stringify({cash:40,card:35,online:25}), source: SEED, tenantId: tenant.id } }); }
  for (let i = 0; i < 10; i++) { await prisma.journalEntry.create({ data: { date: new Date(2024,11,(i*3)+1), description: `Monthly accrual entry #`, lines: JSON.stringify([{accountCode:4000,accountName:Revenue,debit:0,credit:10000+i*1000},{accountCode:5000,accountName:COGS,debit:4000+i*400,credit:0},{accountCode:1000,accountName:Cash,debit:6000+i*600,credit:0}]), tenantId: tenant.id } }); }
  const crmCats=[Complaint,Inquiry,Feedback,Return,Billing,Other]; const crmStats=[OPEN,IN_PROGRESS,RESOLVED,CLOSED,ESCALATED]; const prios=[LOW,MEDIUM,HIGH,URGENT];
  for (let i = 0; i < 80; i++) { await prisma.crmTicket.upsert({ where: { number_tenantId: { number: `CRM-`, tenantId: tenant.id } }, update: {}, create: { number: `CRM-`, customerName: `Customer `, customerPhone: `+966`, subject: `Issue regarding  #`, description: Customer reported an issue that needs attention., category: crmCats[i%crmCats.length], status: crmStats[i%crmStats.length], priority: prios[i%prios.length], branchId: branches[i%6].id, tenantId: tenant.id, createdAt: new Date(2024,11,(i%28)+1) } }); }
  console.log(80 CRM tickets created);
  // 22-27. Campaigns, IT, Tasks, Workflows, Checklists, Leave
  const campaigns: any[] = [];
  const campNames=[Ramadan Special,Summer Deals,Loyalty Boost,New Menu Launch,Weekend Promo,Student Discount,Family Pack,Holiday Special,Flash Sale,Anniversary,National Day,Winter Warmup,Breakfast Club,Late Night,VIP Members];
  for (let i = 0; i < 15; i++) { const camp=await prisma.campaign.create({ data: { name: `Campaign `, type:[DISCOUNT,PROMOTION,EVENT,SOCIAL_MEDIA,OTHER][i%5], status:[DRAFT,ACTIVE,PAUSED,COMPLETED][i%4], startDate:new Date(2024,i%12,1), endDate:new Date(2024,i%12,28), budget:5000+i*2000, tenantId:tenant.id } }); campaigns.push(camp); await prisma.coupon.upsert({ where:{code_tenantId:{code:`PROMO`,tenantId:tenant.id}}, update:{}, create:{code:`PROMO`,campaignId:camp.id,discountType:i%2===0?PERCENTAGE:FIXED,discountValue:i%2===0?10+i:20+i*5,maxUses:100+i*50,usedCount:Math.floor(Math.random()*50),expiresAt:new Date(2025,i%12,28),tenantId:tenant.id} }); }
  console.log(15 Campaigns + Coupons created);
  const itCats=[Hardware,Software,Network,Email,Printer,Access Request,VPN,Other];
  for (let i = 0; i < 40; i++) { await prisma.supportTicket.upsert({ where:{number_tenantId:{number:`IT-`,tenantId:tenant.id}}, update:{}, create:{number:`IT-`,title:` issue at `,description:Technical support needed.,category:itCats[i%itCats.length],status:crmStats[i%crmStats.length],priority:prios[i%prios.length],requesterId:owner.id,tenantId:tenant.id} }); }
  const assetTypes=[LAPTOP,DESKTOP,PHONE,TABLET,PRINTER,NETWORK];
  for (let i = 0; i < 20; i++) { await prisma.iTAsset.create({ data:{name:` #`,type:assetTypes[i%assetTypes.length],serialNumber:`SN--`,branchId:branches[i%branches.length].id,status:i%5===0?MAINTENANCE:ACTIVE,tenantId:tenant.id} }); }
  console.log(40 IT tickets + 20 Assets created);
  const taskStats=[TODO,IN_PROGRESS,REVIEW,DONE];
  const taskTitles=[Review report,Update inventory,Follow up customer,Prepare presentation,Conduct inspection,Fix issue,Order supplies,Train staff,Update system,Clean workspace];
  for (let i = 0; i < 100; i++) { await prisma.task.create({ data:{title:`Task : `,status:taskStats[i%taskStats.length],priority:prios[i%prios.length],branchId:branches[i%branches.length].id,moduleKey:moduleKeys[i%moduleKeys.length],dueDate:new Date(2025,0,(i%28)+1),tenantId:tenant.id} }); }
  console.log(100 Tasks created);
  // 26-37. Workflows, Approvals, Checklists, Leave, Quality, Production, Transfers, Notifications, Audit, Connectors, Forms, Reports, Projects, PRs
  const workflow = await prisma.workflow.create({ data: { name: Standard Approval, moduleKey: general, tenantId: tenant.id, steps: { create: [{stepOrder:1,approverRoleKey:BRANCH_MANAGER,description:Branch Manager Review},{stepOrder:2,approverRoleKey:AREA_MANAGER,description:Area Manager Approval},{stepOrder:3,approverRoleKey:FINANCE_MANAGER,description:Finance Final Approval}] } } });
  const appStats = [SUBMITTED,APPROVED,REJECTED,SUBMITTED,SUBMITTED];
  for (let i = 0; i < 40; i++) { await prisma.approvalRequest.create({ data: { workflowId:workflow.id, entityType:[EXPENSE,LEAVE_REQUEST,PURCHASE_ORDER,TASK][i%4], entityId:`entity-`, status:appStats[i%appStats.length], currentStep:i%3, requesterId:owner.id, tenantId:tenant.id } }); }
  console.log(40 Approvals created);
  for (let i = 0; i < 20; i++) { await prisma.checklist.create({ data: { title:` - `, branchId:branches[i%branches.length].id, frequency:[DAILY,DAILY,WEEKLY,MONTHLY][i%4], items:JSON.stringify([{id:`ci--1`,text:Check equipment,isCompleted:true},{id:`ci--2`,text:Verify stock,isCompleted:i%2===0},{id:`ci--3`,text:Clean workspace,isCompleted:false}]), completedAt:i%3===0?new Date():null, tenantId:tenant.id } }); }
  for (let i = 0; i < 10; i++) { const insp=await prisma.inspection.create({ data:{branchId:branches[i%branches.length].id,inspectorId:owner.id,type:[Routine,Surprise,Follow-up][i%3],findings:`Inspection findings for visit #`,score:70+Math.floor(Math.random()*30),tenantId:tenant.id} }); if(i%2===0){await prisma.issue.create({data:{title:`Issue found during inspection #`,description:Requires corrective action.,severity:[LOW,MEDIUM,HIGH,CRITICAL][i%4],status:[OPEN,IN_PROGRESS,RESOLVED,CLOSED][i%4],branchId:branches[i%branches.length].id,inspectionId:insp.id,tenantId:tenant.id}});} }
  for (let i = 0; i < 20; i++) { await prisma.leaveRequest.create({ data:{employeeId:employees[i%employees.length].id,type:[ANNUAL,SICK,PERSONAL,MATERNITY,OTHER][i%5],startDate:new Date(2025,0,(i*2)+1),endDate:new Date(2025,0,(i*2)+3),status:[PENDING,APPROVED,REJECTED,PENDING][i%4],reason:`Leave reason #`,tenantId:tenant.id} }); }
  for (let i = 0; i < 10; i++) { await prisma.qualityChecklist.create({ data:{title:` - `,branchId:branches[i%branches.length].id,type:[FOOD_SAFETY,HYGIENE,COMPLIANCE,CUSTOM][i%4],items:JSON.stringify([{id:`qi--1`,text:Temperature logs maintained,passed:true},{id:`qi--2`,text:Handwashing stations stocked,passed:i%2===0},{id:`qi--3`,text:Pest control records current,passed:true}]),score:75+Math.floor(Math.random()*25),auditorId:owner.id,tenantId:tenant.id} }); }
  for (let i = 0; i < 8; i++) { await prisma.nonconformance.create({ data:{title:`NCR-: `,branchId:branches[i%branches.length].id,category:[FOOD_SAFETY,HYGIENE,LABELING,PROCESS][i%4],severity:[MINOR,MAJOR,CRITICAL][i%3],status:[OPEN,INVESTIGATING,CORRECTIVE_ACTION,CLOSED][i%4],tenantId:tenant.id} }); }
  // 30-37. Recipes, Production, Transfers, Notifications, Audit, Connectors, Forms, Reports, Projects, PRs
  const recipes: any[] = [];
  const recipeData = [{name:Chicken Shawarma,code:RCP-001},{name:Beef Burger Patty,code:RCP-002},{name:Falafel Mix,code:RCP-003},{name:Hummus Base,code:RCP-004},{name:Pizza Dough,code:RCP-005}];
  for (const r of recipeData) { recipes.push(await prisma.recipe.upsert({ where:{code_tenantId:{code:r.code,tenantId:tenant.id}}, update:{}, create:{name:r.name,code:r.code,outputItemId:items[0].id,outputQuantity:100,outputUnit:KG,materials:JSON.stringify([{itemId:items[0].id,itemName:items[0].name,quantity:50,unit:KG},{itemId:items[1].id,itemName:items[1].name,quantity:10,unit:KG}]),instructions:`Preparation instructions for `,tenantId:tenant.id} })); }
  for (let i = 0; i < 15; i++) { await prisma.productionOrder.upsert({ where:{number_tenantId:{number:`PRD-`,tenantId:tenant.id}}, update:{}, create:{number:`PRD-`,recipeId:recipes[i%recipes.length].id,quantity:50+i*20,status:[PLANNED,IN_PROGRESS,COMPLETED,CANCELLED][i%4],batchNumber:`B-`,yieldQuantity:i%4===2?45+i*18:null,wasteQuantity:i%4===2?5+i*2:null,tenantId:tenant.id} }); }
  console.log(Recipes + Production orders created);
  for (let i = 0; i < 10; i++) { await prisma.stockTransfer.create({ data:{fromWarehouseId:warehouses[warehouses.length-1].id,toWarehouseId:warehouses[i%(warehouses.length-1)].id,items:JSON.stringify([{itemId:items[i%items.length].id,quantity:50+i*10}]),status:[PENDING,IN_TRANSIT,RECEIVED,CANCELLED][i%4],tenantId:tenant.id} }); }
  for (let i = 0; i < 10; i++) { await prisma.notification.create({ data:{userId:owner.id,title:[New approval request,Task overdue,Low stock alert,Inspection scheduled,New CRM ticket][i%5],body:`Notification body # with details about the event.`,type:[APPROVAL,TASK,INVENTORY,OPERATIONS,CRM][i%5],isRead:i<5,link:/approvals,tenantId:tenant.id} }); }
  for (let i = 0; i < 20; i++) { await prisma.auditLog.create({ data:{action:[CREATE,UPDATE,DELETE,LOGIN,APPROVE][i%5],entityType:[User,PurchaseOrder,Employee,Expense,Task][i%5],entityId:`entity-`,actorId:owner.id,actorEmail:owner.email,tenantId:tenant.id,metadata:{detail:`Action #`}} }); }
  await prisma.connector.create({ data:{name:Foodics POS (Demo),type:POLLING,config:JSON.stringify({apiUrl:https://api.foodics.com/v5,apiKey:demo-key,pollInterval:15}),mappings:JSON.stringify([{externalField:orders.total,internalEntity:salesSummary,internalField:totalSales},{externalField:orders.count,internalEntity:salesSummary,internalField:totalOrders}]),isActive:false,tenantId:tenant.id} });
  await prisma.formDefinition.create({ data:{name:Leave Request Form,moduleKey:hr,fields:JSON.stringify([{key:type,label:Leave Type,type:select,required:true,options:[ANNUAL,SICK,PERSONAL],order:1},{key:startDate,label:Start Date,type:date,required:true,order:2},{key:endDate,label:End Date,type:date,required:true,order:3},{key:reason,label:Reason,type:textarea,required:false,order:4}]),tenantId:tenant.id} });
  await prisma.formDefinition.create({ data:{name:Expense Claim Form,moduleKey:finance,fields:JSON.stringify([{key:description,label:Description,type:text,required:true,order:1},{key:amount,label:Amount,type:number,required:true,order:2},{key:date,label:Date,type:date,required:true,order:3},{key:receipt,label:Receipt,type:file,required:false,order:4}]),tenantId:tenant.id} });
  await prisma.reportDefinition.create({ data:{name:Employee Directory,moduleKey:hr,entity:employee,filters:JSON.stringify([]),columns:JSON.stringify([employeeNumber,firstName,lastName,email,departmentId]),tenantId:tenant.id} });
  await prisma.reportDefinition.create({ data:{name:Expense Summary,moduleKey:finance,entity:expense,filters:JSON.stringify([]),columns:JSON.stringify([description,amount,status,date]),groupBy:costCenterId,tenantId:tenant.id} });
  await prisma.project.create({ data:{name:Q1 2025 Expansion Plan,description:Opening new branches in Western region,status:ACTIVE,startDate:new Date(2025,0,1),endDate:new Date(2025,3,30),managerId:owner.id,tenantId:tenant.id} });
  for (let i = 0; i < 10; i++) { await prisma.purchaseRequisition.upsert({ where:{number_tenantId:{number:`PR-`,tenantId:tenant.id}}, update:{}, create:{number:`PR-`,requesterId:owner.id,branchId:branches[i%branches.length].id,status:[DRAFT,PENDING_APPROVAL,APPROVED][i%3],items:JSON.stringify([{itemId:items[i%items.length].id,itemName:items[i%items.length].name,quantity:20+i*5,unit:KG,estimatedPrice:100+i*50}]),tenantId:tenant.id} }); }
  console.log(\n=== SEED COMPLETE ===);
  console.log(SuperAdmin: admin@consedra.local / Admin123!);
  console.log(Owner: owner@consedra.local / Owner123!);
  console.log(Tenant slug: consedra);
  console.log(========================\n);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());