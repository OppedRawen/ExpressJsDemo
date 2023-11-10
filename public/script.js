document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('quoteForm');
    const quotesList = document.getElementById('quotesList');

    // Function to fetch and display quotes
    const loadQuotes = async () => {
        try {
            const response = await fetch('/api/quotes');
            const quotes = await response.json();
            quotesList.innerHTML = quotes.map(quote => `<li>${quote.text} - ${quote.author} (${quote.date})</li>`).join('');
        } catch (error) {
            console.error('Failed to load quotes:', error);
        }
    };

    // Event listener for form submission
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const text = document.getElementById('quoteText').value;
        const author = document.getElementById('quoteAuthor').value;

        try {
            await fetch('/api/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, author }),
            });
            loadQuotes(); // Reload the quotes after adding
            form.reset(); // Reset the form fields
        } catch (error) {
            console.error('Failed to add quote:', error);
        }
    });

    // Initial loading of quotes
    loadQuotes();
});
