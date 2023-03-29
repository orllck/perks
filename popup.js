// Add a listener for when the document (popup window) has finished loading
document.addEventListener("DOMContentLoaded", function () {
    // Send a message to the background script requesting the matched record
    chrome.runtime.sendMessage({ type: "getMatchedRecord" }, function (response) {
      // If a matched record is found, display it; otherwise, display the "no match" message
      if (response.record) {
        displayMatchedRecord(response.record);
      } else {
        displayNoMatch();
      }
    });
  });
  
  // Function to display the matched record in the popup window
  function displayMatchedRecord(record) {
    // Get the HTML elements for the matched record container and the record itself
    const container = document.getElementById("matched-record-container");
    const recordDiv = document.getElementById("matched-record");
  
    // Fill the matched record element with the record's information (name, deal description, value, and link)
    recordDiv.innerHTML = `
      <h3>${record.fields.Name}</h3>
      <p>${record.fields["Deal description"]}</p>
      <p>Value: ${record.fields.Value}</p>
      <a href="${record.fields["Link to activation"]}" target="_blank">Activate Deal</a>
    `;
  
    // Make the matched record container visible
    container.classList.remove("hidden");
  }
  
  // Function to display the "no match" message in the popup window
  function displayNoMatch() {
    // Get the HTML element for the "no match" container
    const container = document.getElementById("no-match-container");
  
    // Make the "no match" container visible
    container.classList.remove("hidden");
  
    // Add a click event listener to the "Propose as perk" button
    const proposePerkBtn = document.getElementById("propose-perk-btn");
    proposePerkBtn.addEventListener("click", function () {
      // Replace the URL below with the URL to the page where users can propose perks
      const proposePerkUrl = "https://example.com/propose-perk";
  
      // Open the propose perk URL in a new window
      window.open(proposePerkUrl);
    });
  }
  