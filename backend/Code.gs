/**
 * ฟังก์ชันสำหรับตั้งค่า Sheet และหัวตารางเบื้องต้น (รันแค่ครั้งเดียวตอนเริ่มโปรเจกต์)
 * ไปที่เมนู Run > setupDatabase
 */

const GLOBAL_SHEETS_CONFIG = {
    // SYSTEM & ADMINISTRATION
    'Users': ['id', 'employeeId', 'name', 'role', 'permissions', 'email', 'avatar', 'isDev', 'status', 'createdAt', 'updatedAt'],
    'SystemLogs': ['id', 'userId', 'action', 'details', 'ipAddress', 'createdAt'],
    'SystemConfig': ['id', 'category', 'key', 'value', 'description', 'updatedAt'],
    'AccessLogs': ['id', 'timestamp', 'action', 'details', 'userId'],
    
    // SALES & PROCUREMENT (AP/AR BRIDGE)
    'SaleOrders': ['id', 'soNumber', 'customer', 'branch', 'orderDate', 'deliveryDate', 'status', 'totalAmount', 'items', 'createdAt'],
    'VendorPOs': ['id', 'poNumber', 'vendor', 'orderDate', 'expectedDate', 'status', 'totalAmount', 'items', 'createdAt'],
    'AR_Invoice': ['id', 'invoiceNo', 'soNumber', 'customer', 'amount', 'dueDate', 'status', 'paidDate', 'createdAt'],
    'AP_Ledger': ['id', 'ledgerNo', 'poNumber', 'vendor', 'amount', 'dueDate', 'status', 'paidDate', 'createdAt'],

    // FINISHED GOODS (FG)
    'FG_Inventory': ['id', 'sku', 'name', 'category', 'soh', 'unitPrice', 'status', 'zone', 'lastMove', 'minStock', 'planIn', 'planInDetails', 'planOut', 'planOutDetails', 'createdAt', 'updatedAt'],
    'FG_Inbound': ['id', 'receiptNo', 'poNumber', 'sku', 'qty', 'unit', 'lot', 'mfgDate', 'expDate', 'receivedBy', 'receivedDate', 'status'],
    'FG_Outbound': ['id', 'dispatchNo', 'soNumber', 'sku', 'qty', 'unit', 'lot', 'dispatchedBy', 'dispatchDate', 'status'],
    'FG_CycleCount': ['id', 'countNo', 'zone', 'sku', 'systemQty', 'actualQty', 'variance', 'countedBy', 'countDate', 'status'],
    'FG_ZoneConfigs': ['id', 'zoneId', 'name', 'safetyStockFloor', 'activeAllocation', 'isConfidential', 'description'],

    // RAW MATERIALS & SPARES (RM)
    'RM_Inventory': ['id', 'sku', 'name', 'category', 'soh', 'unitPrice', 'status', 'zone', 'lastMove', 'minStock', 'planIn', 'planInDetails', 'planOut', 'planOutDetails', 'createdAt', 'updatedAt'],
    'RM_Inbound': ['id', 'receiptNo', 'poNumber', 'sku', 'qty', 'unit', 'lot', 'mfgDate', 'expDate', 'receivedBy', 'receivedDate', 'status'],
    'RM_Outbound': ['id', 'dispatchNo', 'woNumber', 'sku', 'qty', 'unit', 'lot', 'dispatchedBy', 'dispatchDate', 'status'],
    'RM_CycleCount': ['id', 'countNo', 'zone', 'sku', 'systemQty', 'actualQty', 'variance', 'countedBy', 'countDate', 'status'],
    'RM_ZoneConfigs': ['id', 'zoneId', 'name', 'safetyStockFloor', 'activeAllocation', 'isConfidential', 'description'],

    // WAREHOUSE OPERATIONS (COMMON)
    'WavePlanning': ['id', 'waveNo', 'type', 'orders', 'status', 'assignedTo', 'createdAt'],
    'SmartPutaway': ['id', 'putawayNo', 'receiptNo', 'sku', 'qty', 'suggestedZone', 'actualZone', 'status', 'completedBy', 'completedAt'],
    'OrderPicking': ['id', 'pickNo', 'waveNo', 'sku', 'qtyRequired', 'qtyPicked', 'zone', 'status', 'pickedBy', 'pickedAt'],
    'QualityInspection': ['id', 'qcNo', 'receiptNo', 'sku', 'qtyPassed', 'qtyRejected', 'reason', 'inspector', 'inspectedAt', 'status'],

    // LOGISTICS & BACK OFFICE
    'RouteOptimization': ['id', 'routeNo', 'date', 'vehicleId', 'stops', 'status'],
    'ElectronicPOD': ['id', 'podNo', 'deliveryNo', 'customerSignature', 'photos', 'status', 'deliveryTime'],
    
    // MASTER DATA
    'SKUMaster': ['id', 'sku', 'name', 'category', 'type', 'uom', 'weight', 'dimensions', 'barcode', 'status'],
    'LocationsMap': ['id', 'locationId', 'zoneType', 'rack', 'level', 'position', 'capacity', 'currentUsage', 'status'],
    'VendorsBranches': ['id', 'code', 'type', 'name', 'contact', 'address', 'status'],
    'VehicleMaster': ['id', 'plateNumber', 'type', 'capacity', 'driver', 'status', 'lastInspection']
};

function setupDatabase() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetsConfig = GLOBAL_SHEETS_CONFIG;

  for (let name in sheetsConfig) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    // ตั้งค่าหัวตาราง (Headers)
    const headers = sheetsConfig[name];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers])
      .setFontWeight("bold")
      .setBackground("#e8ecef")
      .setFontColor("black");
    
    // Freeze แถวแรก
    sheet.setFrozenRows(1);
    
    // Auto-resize คอลัมน์
    sheet.autoResizeColumns(1, headers.length);
  }

  // สร้าง User ตัวอย่างสำหรับ Admin (ถ้ายังไม่มี)
  const userSheet = ss.getSheetByName("Users");
  if (userSheet.getLastRow() === 1) {
    userSheet.appendRow(['1', 'ADMIN001', '1234', 'System Admin', 'Admin', '{"canCreate":true,"canEdit":true,"canApprove":true,"canVerify":true}', 'Director', 'admin@hrsystem.com', '', 'true', 'Active']);
  }

  Logger.log("Database Setup Complete!");
}

function doOptions(e) {
  return ContentService.createTextOutput('');
}

function doPost(e) {
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;
    const sheetName = params.sheet;
    const data = params.data;
    const apiKey = params.apiKey;
    
    // Basic Security: Check API Key
    const EXPECTED_API_KEY = "your_secret_key_here"; 
    // const EXPECTED_API_KEY = PropertiesService.getScriptProperties().getProperty('API_KEY');
    
    // if (apiKey !== EXPECTED_API_KEY && action !== 'login') {
      // return createResponse("error", "Unauthorized: Invalid API Key", null, headers);
    // }
    
    const ss = getSpreadsheet();
    
    if (!ss) {
      return createResponse("error", "Spreadsheet connection failed. Please ensure SPREADSHEET_ID is set in Script Properties or the script is bound to a Spreadsheet.", null, headers);
    }
    
    // Auto-Provisioning: Create sheet and headers if they don't exist
    // Try to find sheet by name (case-insensitive)
    let sheet = findSheetCaseInsensitive(ss, sheetName);
    
    if (!sheet && sheetName) {
      sheet = ss.insertSheet(sheetName);
      let columns = GLOBAL_SHEETS_CONFIG[sheetName];
      
      if (!columns) {
        if (data && Array.isArray(data) && data.length > 0) {
          columns = Object.keys(data[0]);
        } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          columns = Object.keys(data);
        }
      }

      if (columns && columns.length > 0) {
        sheet.getRange(1, 1, 1, columns.length).setValues([columns])
          .setFontWeight("bold")
          .setBackground("#e8ecef")
          .setFontColor("black");
      }
    }
    
    if (!sheet && action !== 'login') {
      return createResponse("error", "Sheet not found and could not be created: " + sheetName, null, headers);
    }

    let result;
    switch (action) {
      case 'read':
        result = readData(sheet, params, headers);
        break;
      case 'lookup':
        result = lookupData(sheet, params, headers); 
        break;
      case 'login':
        result = handleLogin(ss, data, headers);
        break;
      case 'write':
      case 'update':
      case 'delete':
        const lock = LockService.getScriptLock();
        if (!lock.tryLock(30000)) {
          return createResponse("error", "Lock timeout: Server is busy, please try again.", null, headers);
        }
        try {
          if (action === 'write') result = writeData(sheet, data, headers);
          else if (action === 'update') result = updateData(sheet, data, headers);
          else if (action === 'delete') result = deleteData(sheet, data, headers);
        } finally {
          lock.releaseLock();
        }
        break;
      default:
        result = createResponse("error", "Unknown action: " + action, null, headers);
    }
    return result;
  } catch (err) {
    return createResponse("error", err.toString(), null, headers);
  }
}

function doGet(e) {
  var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };
  return createResponse("success", "HR Master API is active. Please use POST for data operations.", null, headers);
}

// --- Action Handlers ---

function readData(sheet, params, headersObj) {
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) {
    return createResponse("success", "Data retrieved", { items: [], totalCount: 0, limit: params.limit || null, offset: params.offset || 0 }, headersObj);
  }

  const sheetName = params.sheet;
  const sheetHeaders = values[0];
  const canonicalHeaders = GLOBAL_SHEETS_CONFIG[sheetName] || [];

  const headerMap = {};
  sheetHeaders.forEach((h, i) => {
    const rawH = String(h).trim();
    const cleanHeader = rawH.toLowerCase().replace(/\s/g, '');
    let mapped = rawH; 
    
    for (const canon of canonicalHeaders) {
      if (canon.toLowerCase().replace(/\s/g, '') === cleanHeader) {
        mapped = canon;
        break;
      }
    }
    headerMap[i] = mapped;
  });

  let data = values.slice(1).map(row => {
    const obj = {};
    sheetHeaders.forEach((_, i) => {
      const key = headerMap[i];
      let val = row[i];
      if ((key === 'groups' || key === 'history' || key === 'permissions' || key === 'items') && typeof val === 'string') {
        const trimmed = val.trim();
        if (trimmed.startsWith('[')) {
          try { val = JSON.parse(trimmed); } catch(e) { val = []; }
        } else if (trimmed.startsWith('{')) {
          try { val = JSON.parse(trimmed); } catch(e) { val = {}; }
        } else if (trimmed.includes('java.lang.Object')) {
          val = ["Format Error"];
        } else if (trimmed !== '') {
          val = trimmed.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          val = [];
        }
      }
      obj[key] = val;
    });
    return obj;
  });

  const limit = params.limit || null;
  const offset = params.offset || 0;
  
  const totalCount = data.length;
  if (limit !== null) {
    data = data.slice(offset, offset + limit);
  }

  return createResponse("success", "Data retrieved", {
    items: data,
    totalCount: totalCount,
    limit: limit,
    offset: offset
  }, headersObj);
}

function writeData(sheet, data, headersObj) {
  if (!Array.isArray(data)) data = [data];
  if (data.length === 0) return createResponse("success", "No data to write", null, headersObj);

  var sheetHeaders = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
  if (!sheetHeaders || sheetHeaders.length === 0 || sheetHeaders[0] === "") {
    sheetHeaders = Object.keys(data[0]);
    sheet.getRange(1, 1, 1, sheetHeaders.length).setValues([sheetHeaders])
      .setFontWeight("bold")
      .setBackground("#e8ecef")
      .setFontColor("black");
  }
  
  const rows = data.map(item => {
    return sheetHeaders.map(h => {
      var val = item[h];
      if (Array.isArray(val) || (typeof val === 'object' && val !== null)) return JSON.stringify(val);
      return val != null ? val : "";
    });
  });
  
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow + 1, 1, rows.length, sheetHeaders.length).setValues(rows);
  
  const maxRows = sheet.getMaxRows();
  const currentTotalRows = lastRow + rows.length;
  if (maxRows > currentTotalRows + 1) {
    sheet.deleteRows(currentTotalRows + 1, maxRows - currentTotalRows - 1);
  }
  
  return createResponse("success", "Data saved successfully (" + rows.length + " rows)", null, headersObj);
}

function updateData(sheet, data, headersObj) {
  if (!Array.isArray(data)) data = [data];
  if (data.length === 0) return createResponse("error", "No data provided for update", null, headersObj);

  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  if (idIndex === -1) return createResponse("error", "'id' column not found for update", null, headersObj);

  let updatedCount = 0;
  const updatesMap = {};
  data.forEach(item => {
    if (item.id != null) updatesMap[String(item.id)] = item;
  });

  for (let i = 1; i < values.length; i++) {
    const rowId = String(values[i][idIndex]);
    if (updatesMap[rowId]) {
      const updateItem = updatesMap[rowId];
      headers.forEach((header, colIdx) => {
        if (updateItem.hasOwnProperty(header)) {
          var val = updateItem[header];
          if (Array.isArray(val) || (typeof val === 'object' && val !== null)) val = JSON.stringify(val);
          values[i][colIdx] = val != null ? val : "";
        }
      });
      updatedCount++;
    }
  }

  if (updatedCount > 0) {
    range.setValues(values);
  }

  return createResponse("success", `Updated ${updatedCount} rows`, null, headersObj);
}

function deleteData(sheet, data, headersObj) {
  if (!Array.isArray(data)) data = [data];
  if (data.length === 0) return createResponse("error", "No data provided for delete", null, headersObj);

  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0];
  const idIndex = headers.indexOf('id');
  if (idIndex === -1) return createResponse("error", "'id' column not found for delete", null, headersObj);

  const idsToDelete = new Set(data.map(item => String(item.id)));
  const newValues = [headers];
  let deletedCount = 0;

  for (let i = 1; i < values.length; i++) {
    if (!idsToDelete.has(String(values[i][idIndex]))) {
      newValues.push(values[i]);
    } else {
      deletedCount++;
    }
  }

  if (deletedCount > 0) {
    sheet.clearContents();
    sheet.getRange(1, 1, newValues.length, headers.length).setValues(newValues);
  }

  return createResponse("success", `Deleted ${deletedCount} rows`, null, headersObj);
}

function lookupData(sheet, params, headersObj) {
  const dataList = params.data;
  const matchType = params.matchType || 'exact'; 
  
  if (!dataList || dataList.length === 0) return createResponse("error", "Lookup requires 'data' array containing search object", null, headersObj);
  var criteria = dataList[0]; 
  var criteriaKeys = Object.keys(criteria);
  
  var rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return createResponse("success", "No data found", { items: [] }, headersObj);
  var sheetHeaders = rows[0];
  var result = [];
  
  for (var i = 1; i < rows.length; i++) {
      var match = true;
      for (var c = 0; c < criteriaKeys.length; c++) {
          var key = criteriaKeys[c];
          var colIndex = sheetHeaders.indexOf(key);
          
          if (colIndex === -1) {
             match = false;
             break;
          }

          var rowValue = rows[i][colIndex].toString().toLowerCase();
          var criteriaValue = criteria[key].toString().toLowerCase();

          if (matchType === 'includes') {
             if (!rowValue.includes(criteriaValue)) {
                 match = false;
                 break;
             }
          } else { 
             if (rowValue !== criteriaValue) {
                 match = false;
                 break;
             }
          }
      }
      
      if (match) {
          var obj = {};
          for (var j = 0; j < sheetHeaders.length; j++) {
              obj[sheetHeaders[j]] = rows[i][j];
          }
          result.push(obj);
      }
  }

  const limit = params.limit || null;
  const offset = params.offset || 0;
  let finalData = result;
  if (limit !== null) {
      finalData = result.slice(offset, offset + limit);
  }

  return createResponse("success", "Lookup successful", { 
      items: finalData,
      totalCount: result.length,
      limit: limit,
      offset: offset 
  }, headersObj);
}

function handleLogin(ss, credentials, headersObj) {
  const userSheet = ss.getSheetByName("Users");
  if (!userSheet) return createResponse("error", "Users sheet not found", null, headersObj);

  const values = userSheet.getDataRange().getValues();
  if (values.length <= 1) return createResponse("error", "No users found", null, headersObj);

  const columns = values[0];
  const users = values.slice(1).map(row => {
    const obj = {};
    columns.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });

  const user = users.find(u => 
    String(u.employeeId) === String(credentials.employeeId) && 
    String(u.idCard) === String(credentials.idCard)
  );

  if (user) {
    let perms = {};
    if (typeof user.permissions === 'string' && user.permissions.startsWith('{')) {
      try { perms = JSON.parse(user.permissions); } catch(e) {}
    } else if (typeof user.permissions === 'object') {
      perms = user.permissions;
    }
    
    // Default fallback if parsing fails or returns empty
    if (!perms.hasOwnProperty('canCreate')) {
      perms = {
        canCreate: user.role === 'Admin' || user.role === 'Editor',
        canEdit: user.role === 'Admin' || user.role === 'Editor',
        canApprove: user.role === 'Admin',
        canVerify: user.role === 'Admin' || user.role === 'Editor'
      };
    }

    const userData = {
      id: user.id || user.employeeId,
      employeeId: user.employeeId,
      name: user.name,
      role: user.role,
      avatar: user.avatar || "",
      permissions: perms,
      isDev: user.isDev === 'true' || user.isDev === true
    };
    return createResponse("success", "Login successful", userData, headersObj);
  } else {
    return createResponse("error", "Invalid Staff Code or ID Card Number", null, headersObj);
  }
}

// --- Helpers ---

function createResponse(status, message, data, headersObj) {
  const result = { status: status, message: message, data: data };
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSpreadsheet() {
  try {
    const props = PropertiesService.getScriptProperties();
    const sid = props.getProperty('SPREADSHEET_ID');
    if (sid) {
      return SpreadsheetApp.openById(sid);
    }
  } catch(e) {
    Logger.log("Error reading SPREADSHEET_ID: " + e.toString());
  }
  
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch(e) {
    Logger.log("Error getting active spreadsheet: " + e.toString());
    return null;
  }
}

function findSheetCaseInsensitive(ss, name) {
  if (!name) return null;
  const sheets = ss.getSheets();
  const lowerName = name.toLowerCase().replace(/\s/g, '');
  
  for (let i = 0; i < sheets.length; i++) {
    const sheetName = sheets[i].getName();
    if (sheetName.toLowerCase().replace(/\s/g, '') === lowerName) {
      return sheets[i];
    }
  }
  return null;
}
