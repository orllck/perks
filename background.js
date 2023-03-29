// Your Airtable API key and base ID
const AIRTABLE_API_KEY = "patBbYAg5Zg7PTxmi.b391bcc6f30a444bcc90041b79601c2fa5065ea4ff386fbb8f129351870e11bb";
const AIRTABLE_BASE_ID = "appBUKPhtwQNDepbl";
const AIRTABLE_TABLE_NAME = "perks";

// Get the domain from the URL
function getDomain(url) {
  const domain = new URL(url).hostname;
  return domain.startsWith("www.") ? domain.substring(4) : domain;
}

// Check if the domain is present in the Airtable database
async function checkAirtableForDomain(domain) {
  const response = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?filterByFormula=({Domain}='${domain}')`,
    {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  const records = data.records;

  if (records.length > 0) {
    matchedRecord = records[0];
    return true;
  } else {
    return false;
  }
}

// Listen for a click on the extension's icon
chrome.action.onClicked.addListener(async (tab) => {
  const currentTabUrl = tab.url;
  const currentDomain = getDomain(currentTabUrl);
  const matchFound = await checkAirtableForDomain(currentDomain);

  if (matchFound) {
    chrome.extension.getBackgroundPage().matchedRecord = matchedRecord;
  } else {
    chrome.extension.getBackgroundPage().matchedRecord = null;
  }
});

// Add a listener for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "getMatchedRecord") {
    if (matchedRecord) {
      sendResponse({ matchedRecord: matchedRecord });
    } else {
      sendResponse({ matchedRecord: null });
    }
  }
});
