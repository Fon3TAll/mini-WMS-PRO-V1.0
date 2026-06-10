import { getAccessToken } from '../lib/auth';

const SHEETS_TO_CREATE = [
  { title: 'Departments', headers: ['Header: ID', 'Header: Name', 'Header: Code'] },
  { title: 'Categories', headers: ['Header: ID', 'Header: Name', 'Header: Code', 'Header: Description'] },
  { title: 'Brands', headers: ['Header: ID', 'Header: Name', 'Header: Code'] },
  { title: 'Customers', headers: ['Header: ID', 'Header: Name', 'Header: Code', 'Header: Contact'] },
  { title: 'PDFTemplates', headers: ['Header: ID', 'Header: Name', 'Header: Code', 'Header: Type'] },
  { title: 'IDFormats', headers: ['Header: ID', 'Header: Prefix', 'Header: Suffix', 'Header: Digits'] }
];

export const setupSpreadsheet = async (spreadsheetId: string) => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error("No Google access token found. Please sign in with Google first.");
  }

  // 1. Get existing sheets
  let metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (!metaRes.ok) {
    const err = await metaRes.json();
    throw new Error(err.error?.message || "Failed to access spreadsheet. Check ID and Permissions.");
  }
  
  let meta = await metaRes.json();
  let existingSheets = meta.sheets.map((s: any) => s.properties);
  let existingTitles = existingSheets.map((s: any) => s.title);

  // 2. Create missing sheets
  const addSheetRequests = SHEETS_TO_CREATE
    .filter(sheet => !existingTitles.includes(sheet.title))
    .map(sheet => ({
      addSheet: { properties: { title: sheet.title } }
    }));

  if (addSheetRequests.length > 0) {
    const addRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ requests: addSheetRequests })
    });
    
    if (!addRes.ok) {
      const err = await addRes.json();
      throw new Error(err.error?.message || "Failed to create missing sheets.");
    }
    
    // re-fetch meta to get new sheet IDs
    metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    meta = await metaRes.json();
    existingSheets = meta.sheets.map((s: any) => s.properties);
  }

  // 3. Update headers and formatting
  const formatRequests: any[] = [];
  const headerValueRequests: any[] = [];

  for (const sheetDef of SHEETS_TO_CREATE) {
    const sheetProp = existingSheets.find((s: any) => s.title === sheetDef.title);
    if (!sheetProp) continue;

    const sheetId = sheetProp.sheetId;

    // Freeze top row
    formatRequests.push({
      updateSheetProperties: {
        properties: {
          sheetId: sheetId,
          gridProperties: { frozenRowCount: 1 }
        },
        fields: 'gridProperties.frozenRowCount'
      }
    });

    // Formatting for header row (#d0e0e3)
    formatRequests.push({
      repeatCell: {
        range: {
          sheetId: sheetId,
          startRowIndex: 0,
          endRowIndex: 1,
          startColumnIndex: 0,
          endColumnIndex: sheetDef.headers.length
        },
        cell: {
          userEnteredFormat: {
            backgroundColor: { 
              red: 208 / 255, 
              green: 224 / 255, 
              blue: 227 / 255 
            },
            textFormat: { bold: true },
            horizontalAlignment: "CENTER"
          }
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
      }
    });
    
    // Data values for headers
    // Convert column length to letter (A, B, C...)
    const endColLetter = String.fromCharCode(65 + sheetDef.headers.length - 1);
    
    headerValueRequests.push({
      range: `'${sheetDef.title}'!A1:${endColLetter}1`,
      values: [sheetDef.headers]
    });
  }

  // Execute formatting
  if (formatRequests.length > 0) {
    const formatRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ requests: formatRequests })
    });
    
    if (!formatRes.ok) {
       console.error("Formatting failed", await formatRes.text());
    }
  }

  // Execute values
  if (headerValueRequests.length > 0) {
    const valueRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ 
        valueInputOption: "USER_ENTERED",
        data: headerValueRequests
      })
    });
    
    if (!valueRes.ok) {
       console.error("Header values failed", await valueRes.text());
    }
  }

  return { success: true };
};
