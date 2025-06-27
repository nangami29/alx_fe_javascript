const quote=document.getElementById('quoteDisplay');
const button=document.getElementById('newQuote')

// functions  to display a random quote
let quotes=[
     { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
  { text: "Success is not in what you have, but who you are.", category: "Motivation" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];
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


