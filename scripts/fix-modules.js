const fs = require('fs');
const path = require('path');

const fixes = [
  {
    dir: 'apps/api/src/core/forms-builder',
    oldPrefix: 'Forms-builder',
    newPrefix: 'FormsBuilder'
  },
  {
    dir: 'apps/api/src/core/integration-hub',
    oldPrefix: 'Integration-hub',
    newPrefix: 'IntegrationHub'
  },
  {
    dir: 'apps/api/src/core/module-manager',
    oldPrefix: 'Module-manager',
    newPrefix: 'ModuleManager'
  },
  {
    dir: 'apps/api/src/core/org-structure',
    oldPrefix: 'Org-structure',
    newPrefix: 'OrgStructure'
  },
  {
    dir: 'apps/api/src/modules/it-helpdesk',
    oldPrefix: 'It-helpdesk',
    newPrefix: 'ItHelpdesk'
  }
];

const root = path.join(__dirname, '..');

for (const fix of fixes) {
  const dir = path.join(root, fix.dir);
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (!file.endsWith('.ts')) continue;
    const fp = path.join(dir, file);
    let content = fs.readFileSync(fp, 'utf-8');

    content = content.replace(new RegExp(fix.oldPrefix, 'g'), fix.newPrefix);

    fs.writeFileSync(fp, content, 'utf-8');
    console.log('Fixed:', fp);
  }
}

console.log('Done!');
