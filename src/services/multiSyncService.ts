import { db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getAccessToken } from '../lib/auth';

/**
 * Service to sync data simultaneously to Firebase Firestore and Google Sheets.
 */
export const multiSyncData = async (
  collectionName: string, 
  documentId: string, 
  data: Record<string, any>,
  spreadsheetId: string,
  sheetName: string
) => {
  const syncPromises: Promise<any>[] = [];

  // 1. Sync to Firebase Firestore
  if (db) {
    const firestorePromise = setDoc(doc(db, collectionName, documentId), {
      ...data,
      updatedAt: new Date().toISOString()
    }).catch(error => {
      console.error("Firebase sync failed:", error);
      throw new Error(`Firebase Sync Error: ${error.message}`);
    });
    syncPromises.push(firestorePromise);
  } else {
    console.warn("Firebase config is missing. Skipping Firestore sync.");
  }

  // 2. Sync to Google Sheets using OAuth REST API
  const token = await getAccessToken();
  if (token && spreadsheetId) {
    // Format data as a row array based on values (requires predictable schema or headers)
    const values = Object.values(data);
    
    // Example using appending rows to a Google Sheet
    const sheetPromise = fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        values: [values]
      })
    })
    .then(async (result) => {
       if (!result.ok) {
         const err = await result.json();
         throw new Error(err.error?.message || "Failed to append to Google Sheets");
       }
       return result.json();
    })
    .catch(error => {
       console.error("Google Sheets sync failed:", error);
       throw new Error(`Google Sheets Sync Error: ${error.message}`);
    });

    syncPromises.push(sheetPromise);
  } else if (!token) {
    console.warn("User access token missing. Skipping Google Sheets sync.");
  }

  // Execute simultaneously
  await Promise.all(syncPromises);
  
  return { success: true };
};
