// Initialize the variables to store the matched record and the current tab's URL
let matchedRecord = null;
let currentTabUrl = '';

// Get the URL of the active tab in the current window
chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  currentTabUrl = tabs[0].url;
  // Now you can use the currentTabUrl variable in other functions or operations.
});

// Function to extract the domain name from a given URL
function getDomain(currentTabUrl) {
  const domain = new URL(currentTabUrl).hostname;
  console.log(domain)
  // Remove "www." if it's present in the domain name
  return domain.startsWith("www.") ? domain.substring(4) : domain;
}

// Function to check if a given domain name is present in the Airtable database
async function checkAirtableForDomain(domain) {
  // Replace with your Airtable API key and base ID
  const apiKey = "patBbYAg5Zg7PTxmi.b391bcc6f30a444bcc90041b79601c2fa5065ea4ff386fbb8f129351870e11bb";
  const baseId = "appBUKPhtwQNDepbl";
  const tableName = "perks";

  // Set up the request options for the Airtable API call
  const requestOptions = {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  };

  // Build the API URL to query the Airtable database
  const apiUrl = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=({Domain}='${domain}')`;

  // Fetch the data from the Airtable API and check if the domain is present
  const response = await fetch(apiUrl, requestOptions);
  if (!response.ok) {
    throw new Error(`Error fetching data from Airtable: ${response.statusText}`);
  }
  const data = await response.json();

  // If a matching record is found, store it in the matchedRecord variable and return true
  if (data.records.length > 0) {
    matchedRecord = data.records[0];
    return true;
  } else {
    // If no match is found, set matchedRecord to null and return false
    matchedRecord = null;
    return false;
  }
}

// When a new tab is active, check if the domain matches a record in the Airtable database
chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) {
  currentTabUrl = tabs[0].url;
  const currentDomain = getDomain(currentTabUrl);
  const matchFound = await checkAirtableForDomain(currentDomain);

  // If a match is found, change the extension icon
  if (matchFound) {
    chrome.browserAction.setIcon({ path: "match/icon-match-48.png", tabId: tabs[0].id });
  }
});

// Listen for messages from the popup script and respond accordingly
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // If the request is to get the matched record, return the matched record as the response
  if (request.type === "getMatchedRecord") {
    sendResponse({ record: matchedRecord });
  } else if (request.type === "getRecommendedRecords") {
    // If the request is to get recommended records, fetch the records and return them as the response
    getRecommendedRecords().then(records => {
      sendResponse({ records });
    });
    return true; // Indicate that the response will be sent asynchronously
  }
});
