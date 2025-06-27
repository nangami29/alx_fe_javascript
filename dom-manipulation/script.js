const quote=document.getElementById('quoteDisplay');
const button=document.getElementById('newQuote')

// functions  to display a random quote
let quotes=[];

// load quotes from local storage
function loadQuotes(){
    const storedquotes =localStorage.getItem('quotes');
    if(storedQuotes){
        quotes = JSON.parse(storedquotes);
    }else{
       quotes=[  { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Success is not in what you have, but who you are.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
       ]
       saveQuotes();
    };
};

// sae quotes to local storage

function saveQuotes(){
    localStorage.setItem('quotes', JSON.stringify(quotes));

}
function showRandomQuote(){
    if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
}

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>— ${randomQuote.category}</small>
  `;
};
function createAddQuoteForm(){
   const form =document.createElement('form');
   //quote input
   const quoteInput=document.createElement('input');
   quoteInput.type='text';
   quoteInput.placeholder='Enter a new quote';
   quoteInput.required=true;

   //category input
   const categoryInput=document.createElement('input');
   categoryInput.type='text';
   categoryInput.placeholder='Enter quote category';
   categoryInput.required='true';

   //submit button
   const addButton=document.createElement('button');
   addButton.type='submit';
   addButton.textContent='Add Quote';

   //form submit
  
  // When the form is submitted
  form.addEventListener('submit', function (e) {
    e.preventDefault(); // stop page refresh

    const newQuote = quoteInput.value.trim();
    const newCategory = categoryInput.value.trim();

    // Add quote to the list
    if (newQuote && newCategory) {
      quotes.push({ text: newQuote, category: newCategory });
      alert('Quote added!');
      quoteInput.value = '';
      categoryInput.value = '';
    } else {
      alert('Please fill both fields.');
    }
  });
   form.appendChild(quoteInput);
form.appendChild(categoryInput);
form.appendChild(addButton);
document.body.appendChild(form);

};

button.addEventListener('click', showRandomQuote);

createAddQuoteForm();

// provide a button
function createExportButton(){
   const exportbutton=document.createElement('button');
exportbutton.type='submit';
exportbutton.textContent='Export Quote'

exportbutton.addEventListener('click', function(){
    const jsonData=JSON.stringify(quotes, null, 2);
    const blob = new Blob([jsonData], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href=url;
    a.download='quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
});

document.body.appendChild(exportbutton);
}
 function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

loadQuotes();
createAddQuoteForm();
createExportButton();
button.addEventListener('click', showRandomQuote);