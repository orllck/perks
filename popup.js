// Display the matched record's information
function displayMatchedRecord(record) {
  const container = document.getElementById("matched-record-container");
  const recordDiv = document.getElementById("matched-record");

  recordDiv.innerHTML = `
    <h3>${record.fields.Name}</h3>
    <p>${record.fields.Deal}</p>
    <p>Value: ${record.fields.Value}</p>
    <a href="${record.fields.Activation}" target="_blank">Activate Deal</a>
  `;

  container.classList.remove("hidden");
}

// Display the "no match" state
function displayNoMatch() {
  const container = document.getElementById("no-match-container");
  container.classList.remove("hidden");

  const proposePerkBtn = document.getElementById("propose-perk-btn");
  proposePerkBtn.addEventListener("click", function () {
    // Replace with the URL to the page where users can propose perks
    const proposePerkUrl = "https://google.com";
    window.open(proposePerkUrl);
  });
}

// Add an event listener for when the DOM (Document Object Model) is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Send a message to the background script to request the matched record
  chrome.runtime.sendMessage({ type: "getMatchedRecord" }, function (response) {
    if (response.matchedRecord) {
      // If there's a matched record, display its information
      displayMatchedRecord(response.matchedRecord);
    } else {
      // If there's no matched record, display the "no match" state
      displayNoMatch();
    }
  });
});

