const express = require('express'); // Importing Express.js module
const app = express(); // Creating an Express application
const fs = require('fs'); // Filesystem module to read and write files
const path = require('path'); // Path module to work with file paths

// Middleware to parse JSON bodies. This is necessary to process incoming JSON data from POST requests.
app.use(express.json());

// Serving static files from 'public' directory. This is where our HTML and CSS files are.
app.use(express.static('public'));

// GET route to send back the list of quotes.
// Async is used here to indicate that this function can perform asynchronous operations.
app.get('/api/quotes', async (req, res) => {
  try {
    // Reading the quotes file and sending it as a response.
    const data = fs.readFileSync(path.join(__dirname, 'data/quotes.json'));
    const quotes = JSON.parse(data);
    res.json(quotes);
  } catch (error) {
    // Error handling, if file reading fails or JSON is invalid.
    res.status(500).json({ message: 'Error reading quotes file.' });
  }
});

// POST route to add a new quote.
app.post('/api/quotes', async (req, res) => {
  try {
    const { text, author } = req.body; // Extracting text and author from the request body.
    const data = fs.readFileSync(path.join(__dirname, 'data/quotes.json'));
    const quotes = JSON.parse(data);

    // Creating a new quote object.
    const newQuote = {
      id: quotes.length + 1, // Simple incrementing ID logic for demonstration purposes.
      text,
      author,
      date: new Date().toISOString()
    };

    // Adding the new quote to our array and saving back to the file.
    quotes.push(newQuote);
    fs.writeFileSync(path.join(__dirname, 'data/quotes.json'), JSON.stringify(quotes, null, 2));

    res.status(201).json(newQuote); // Sending back the newly created quote with a 201 status code.
  } catch (error) {
    // Error handling for issues during the POST operation.
    res.status(500).json({ message: 'Error adding new quote.' });
  }
});

// DELETE route to delete a quote by ID.
app.delete('/api/quotes/:id', async (req, res) => {
  try {
    const { id } = req.params; // Extracting the ID from the request parameters.
    const data = fs.readFileSync(path.join(__dirname, 'data/quotes.json'));
    let quotes = JSON.parse(data);

    // Filtering out the quote with the given ID.
    quotes = quotes.filter(quote => quote.id !== parseInt(id));

    // Saving the updated quotes array back to the file.
    fs.writeFileSync(path.join(__dirname, 'data/quotes.json'), JSON.stringify(quotes, null, 2));

    res.status(200).json({ message: 'Quote deleted successfully.' });
  } catch (error) {
    // Error handling for issues during the DELETE operation.
    res.status(500).json({ message: 'Error deleting quote.' });
  }
});

// Starting the server on port 3000.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
