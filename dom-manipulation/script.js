let quotes = [];
let categories = [];

// Mock API endpoint for simulating server interactions
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

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
  populateCategories();  // Populate categories after loading quotes
}

// Function to save the current quotes array to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to simulate fetching data from a server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Simulating server quotes as an array of objects with text and category
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      category: 'Server Category'
    }));

    resolveConflicts(serverQuotes);  // Resolve any conflicts with local quotes
  } catch (error) {
    console.error('Error fetching data from server:', error);
  }
}

// Function to resolve conflicts between local and server data
function resolveConflicts(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const localQuoteIndex = quotes.findIndex(quote => quote.text === serverQuote.text);
    if (localQuoteIndex === -1) {
      quotes.push(serverQuote);  // Add new quote from server
      updated = true;
    } else {
      // Conflict resolution: server data takes precedence
      quotes[localQuoteIndex] = serverQuote;  
      updated = true;
    }
  });

  if (updated) {
    saveQuotes();  // Save updated quotes to local storage
    alert('Quotes updated from server!');
    populateCategories();  // Refresh categories
  }
}

// Function to display a random quote from the array
function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();  // Get quotes based on filter
  if (filteredQuotes.length === 0) {
    alert("No quotes available for this category.");
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `"${randomQuote.text}" - Category: ${randomQuote.category}`;

  // Store the last viewed quote in session storage
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
}

// Function to create the form and handle adding new quotes dynamically
function createAddQuoteForm() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText.trim() !== "" && newQuoteCategory.trim() !== "") {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();  // Update categories with any new ones
    showRandomQuote();
    postQuoteToServer(newQuote);  // POST new quote to the server
    document.getElementById('newQuoteText').value = "";
    document.getElementById('newQuoteCategory').value = "";
  } else {
    alert("Please enter both quote and category.");
  }
}

// Function to post new quotes to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST', // Use POST method to send data
      headers: {
        'Content-Type': 'application/json', // Specify the content type
      },
      body: JSON.stringify(quote), // Send the quote as JSON
    });

    if (response.ok) {
      const serverResponse = await response.json();
      console.log('Quote posted to server:', serverResponse);
    } else {
      console.error('Failed to post quote to server:', response.status);
    }
  } catch (error) {
    console.error('Error posting quote to server:', error);
  }
}

// Function to load the last viewed quote from session storage
function loadLastViewedQuote() {
  const lastQuote = sessionStorage.getItem('lastViewedQuote');
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `"${quote.text}" - Category: ${quote.category}`;
  }
}

// Function to export quotes as a JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'quotes.json';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
    showRandomQuote();
  };
}

// Function to dynamically populate categories in the dropdown
function populateCategories() {
  categories = [...new Set(quotes.map(quote => quote.category))];  // Using map to extract unique categories
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;  // Reset options
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  const lastSelectedCategory = localStorage.getItem('selectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);  // Save selected category to local storage
  showRandomQuote();  // Display quote based on current filter
}

// Function to get quotes based on the current category filter
function getFilteredQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  if (selectedCategory === "all") {
    return quotes;  // Show all quotes if 'all' is selected
  } else {
    return quotes.filter(quote => quote.category === selectedCategory);
  }
}

// Function to sync quotes between local storage and server
async function syncQuotes() {
  try {
    const storedQuotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const response = await fetch(apiUrl);
    const serverData = await response.json();
    
    // Check for any discrepancies between local and server quotes
    const serverQuotes = serverData.map(item => ({
      text: item.title,
      category: 'Server Category'
    }));

    // Update local storage with server data, prioritize server over local
    serverQuotes.forEach(serverQuote => {
      const localQuoteIndex = storedQuotes.findIndex(quote => quote.text === serverQuote.text);
      if (localQuoteIndex === -1) {
        storedQuotes.push(serverQuote); // Add new quote from server
      } else {
        // Conflict resolution: server data takes precedence
        storedQuotes[localQuoteIndex] = serverQuote;  
      }
    });

    localStorage.setItem('quotes', JSON.stringify(storedQuotes)); // Save updated quotes to local storage
    quotes = storedQuotes;  // Update the quotes array in memory
    alert('Quotes synced with server!');
    populateCategories();  // Refresh categories
  } catch (error) {
    console.error('Error syncing quotes:', error);
  }
}

// Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Load quotes from local storage and display the last viewed quote or a random quote
window.onload = function() {
  loadQuotes();
  loadLastViewedQuote() || showRandomQuote();
  fetchQuotesFromServer();  // Initial fetch from server on load

  // Periodically sync quotes with the server every 30 seconds
  setInterval(syncQuotes, 30000);
};
