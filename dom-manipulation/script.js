let quotes = [];

// Function to load quotes from local storage or initialize with default quotes
function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The only way to do great work is to love what you do.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Get busy living or get busy dying.", category: "Inspiration" }
    ];
  }
}

// Function to save the current quotes array to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote from the array
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Clear any existing content inside quoteDisplay
  quoteDisplay.innerHTML = "";

  // Get a random quote
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  
  // Create new elements dynamically
  const quoteTextElement = document.createElement('p');
  quoteTextElement.textContent = `"${randomQuote.text}"`;

  const quoteCategoryElement = document.createElement('span');
  quoteCategoryElement.textContent = ` - Category: ${randomQuote.category}`;

  // Append the new elements to the quoteDisplay
  quoteDisplay.appendChild(quoteTextElement);
  quoteDisplay.appendChild(quoteCategoryElement);

  // Store the last viewed quote in session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Function to create the form and handle adding new quotes dynamically
function createAddQuoteForm() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  // Simple validation to check if both fields are filled
  if (newQuoteText.trim() !== "" && newQuoteCategory.trim() !== "") {
    // Add the new quote to the array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Clear input fields after adding the quote
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";

    // Save updated quotes to local storage
    saveQuotes();

    // Optionally, show a confirmation message
    alert("Quote added successfully!");

    // Display the new quote directly after adding
    showRandomQuote();  // Immediately show the added quote
  } else {
    alert("Please enter both quote and category.");
  }
}

// Function to load the last viewed quote from session storage
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    const quoteDisplay = document.getElementById('quoteDisplay');
    
    // Clear any existing content inside quoteDisplay
    quoteDisplay.innerHTML = "";

    // Create new elements dynamically
    const quoteTextElement = document.createElement('p');
    quoteTextElement.textContent = `"${quote.text}"`;

    const quoteCategoryElement = document.createElement('span');
    quoteCategoryElement.textContent = ` - Category: ${quote.category}`;

    // Append the new elements to the quoteDisplay
    quoteDisplay.appendChild(quoteTextElement);
    quoteDisplay.appendChild(quoteCategoryElement);
  }
}

// Function to export quotes as a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link to trigger the download
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  
  // Trigger the download
  document.body.appendChild(downloadLink);
  downloadLink.click();
  
  // Clean up the temporary link
  document.body.removeChild(downloadLink);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
    showRandomQuote();  // Show an updated random quote after import
  };
  fileReader.readAsText(event.target.files[0]);
}

// Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Load quotes from local storage and display a random quote or the last viewed quote from session storage on page load
window.onload = function() {
  loadQuotes();
  loadLastViewedQuote() || showRandomQuote();
};
