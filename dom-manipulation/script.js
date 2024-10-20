// Array to store quotes and their categories
let quotes = [
  { text: "The only way to do great work is to love what you do.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Get busy living or get busy dying.", category: "Inspiration" }
];

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

    // Optionally, show a confirmation message
    alert("Quote added successfully!");

    // Display the new quote directly after adding
    showRandomQuote();  // Immediately show the added quote
  } else {
    alert("Please enter both quote and category.");
  }
}

// Event listener for "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Initialize with a random quote on page load
window.onload = showRandomQuote;
