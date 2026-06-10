export const GAS_URL = "https://script.google.com/macros/s/AKfycbz1Z_u10a8qS5dO5_Oa_C8T_r1Z9aO7vR-T9O5lQ_q32-15i_G/exec"; // Placeholder

export const runSetupGoogleSheet = async (spreadsheetId: string) => {
  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'formatSheet',
        spreadsheetId: spreadsheetId
      })
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error setting up Google Sheet:", error);
    throw error;
  }
};
