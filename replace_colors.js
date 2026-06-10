const fs = require('fs');

const THEME = {
  bgMain: '#f3f3f1',
  primary: '#212c46',
  primaryLight: '#4d87a8',
  accent: '#a94228',
  gold: '#b58c4f',
  brightGold: '#b7a159',
  success: '#657f4d',
  danger: '#932c2e',
  skyBlue: '#3f809e',
  dustyBlue: '#7a8b95',
  indigo: '#414757',
  softPurple: '#ab7d82',
  deepPurple: '#2d2c4a',
  pinkAccent: '#a54f6b',
  mutedSlate: '#606a5f',
  darkSlate: '#2f2926',
  silver: '#d7d7d7'
};

function processCode(code) {
  let newCode = code;

  // Backgrounds & Globals
  newCode = newCode.replace(/#F8F9FA/gi, 'transparent'); // remove double background
  newCode = newCode.replace(/#1F2937/gi, THEME.primary);
  newCode = newCode.replace(/#2C3F70/gi, THEME.primary);
  newCode = newCode.replace(/#A5231C/gi, THEME.danger);
  newCode = newCode.replace(/#B45309/gi, THEME.accent);
  newCode = newCode.replace(/#059669/gi, THEME.success);
  newCode = newCode.replace(/#E8EBED/gi, 'transparent');
  newCode = newCode.replace(/#53728A/gi, THEME.dustyBlue);
  newCode = newCode.replace(/#7691AD/gi, THEME.dustyBlue);
  newCode = newCode.replace(/#D1D9E0/gi, THEME.silver);
  newCode = newCode.replace(/#B2CADE/gi, THEME.silver);
  newCode = newCode.replace(/#F2B03F/gi, THEME.gold);
  newCode = newCode.replace(/#CBD5E1/gi, THEME.dustyBlue);
  newCode = newCode.replace(/#111827/gi, THEME.darkSlate);
  // Recharts pie/bar chart colors
  newCode = newCode.replace(/\{ name: 'PRODUCTION', count: 2, fill: '[^']+' \}/g, `{ name: 'PRODUCTION', count: 2, fill: '${THEME.danger}' }`);
  newCode = newCode.replace(/fill: '#2C3F70'/gi, `fill: '${THEME.primary}'`);
  newCode = newCode.replace(/fill: '#A5231C'/gi, `fill: '${THEME.danger}'`);
  
  return newCode;
}

const distributionCode = fs.readFileSync('dist_src.txt', 'utf8');
const processedDist = processCode(distributionCode);
fs.mkdirSync('src/pages/DocumentDistribution/Pending', { recursive: true });
fs.writeFileSync('src/pages/DocumentDistribution/Pending/index.tsx', processedDist);

const formCode = fs.readFileSync('form_src.txt', 'utf8');
const processedForm = processCode(formCode);
fs.mkdirSync('src/pages/DocumentRequest/Form', { recursive: true });
fs.writeFileSync('src/pages/DocumentRequest/Form/index.tsx', processedForm);
