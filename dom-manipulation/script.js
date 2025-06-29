const quoteDisplay = document.getElementById('quoteDisplay');
const button = document.getElementById('newQuote');
const categoryFilter = document.getElementById('categoryFilter');

let quotes = [];

function loadQuotes() {
  const storedQuotes = localStorage.getItem('quotes');
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
      { text: "Success is not in what you have, but who you are.", category: "Motivation" },
      { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
    ];
    saveQuotes();
  }

  populateCategories();
  restoreLastSelectedCategory();
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  let filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>— ${randomQuote.category}</small>
  `;
}

function createAddQuoteForm() {
  const form = document.createElement('form');

  const quoteInput = document.createElement('input');
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';
  quoteInput.required = true;

  const categoryInput = document.createElement('input');
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';
  categoryInput.required = true;

  const addButton = document.createElement('button');
  addButton.type = 'submit';
  addButton.textContent = 'Add Quote';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const newQuote = quoteInput.value.trim();
    const newCategory = categoryInput.value.trim();

    if (newQuote && newCategory) {
      quotes.push({ text: newQuote, category: newCategory });
      saveQuotes();
      quoteInput.value = '';
      categoryInput.value = '';
      alert('Quote added!');
      populateCategories(); // update filter dropdown if new category
    } else {
      alert('Please fill both fields.');
    }
  });

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addButton);
  document.body.appendChild(form);
}

function createExportButton() {
  const exportButton = document.getElementById('exportBtn');
  exportButton.addEventListener('click', function () {
    const jsonData = JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
    populateCategories();
  };
  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

function filterQuotes() {
  showRandomQuote();
  localStorage.setItem('selectedCategory', categoryFilter.value);
}

function restoreLastSelectedCategory() {
  const last = localStorage.getItem('selectedCategory');
  if (last) {
    categoryFilter.value = last;
    filterQuotes();
  }
}

// Initial Setup
loadQuotes();
createAddQuoteForm();
createExportButton();
button.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', filterQuotes);
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
    const serverData = await response.json();

    // Simulate quotes from server (transform fake API to quote format)
    const serverQuotes = serverData.map(item => ({
      text: item.title,
      category: "Server"
    }));

    // Conflict resolution: server takes precedence
    const updatedQuotes = [...serverQuotes];
    localStorage.setItem('quotes', JSON.stringify(updatedQuotes));
    quotes = updatedQuotes;

    alert('Quotes synced from server and conflicts resolved.');
    populateCategories();
    showRandomQuote();

  } catch (error) {
    console.error("Failed to fetch from server:", error);
    alert("Error syncing with server.");
  }
}
async function postQuoteToServer(quoteObj) {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quoteObj)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Quote synced to server:', data);
    } else {
      console.warn('Server did not accept the quote.');
    }
  } catch (error) {
    console.error('Error posting quote to server:', error);
  }
}

