const maxResults = 5;
        const favorites = new Set();

        async function searchBooks() {
            const query = document.getElementById('query').value.trim();
            if (!query) return;
            const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                displayResults(data.items);
            } catch (error) {
                document.getElementById('results').innerText = error.message;
            }
        }

        function displayResults(items) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';
            if (!items || items.length === 0) {
                resultsDiv.innerText = 'Nenhum resultado encontrado.';
                return;
            }
            items.forEach(item => {
                const volumeInfo = item.volumeInfo;
                const title = volumeInfo.title || 'Título não disponível';
                const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor desconhecido';
                const publishedDate = volumeInfo.publishedDate || 'Data desconhecida';
                const link = volumeInfo.infoLink || '#';
                const bookId = item.id;

                const bookDiv = document.createElement('div');
                bookDiv.innerHTML = `
                    <p><strong>Título:</strong> ${title}<br>
                    <strong>Autores:</strong> ${authors}<br>
                    <strong>Data de Publicação:</strong> ${publishedDate}<br>
                    <a href="${link}" target="_blank">Mais informações</a></p>
                    <button onclick="toggleFavorite('${bookId}', this)" aria-label="${favorites.has(bookId) ? 'Desfavoritar' : 'Favoritar'}">
                        ${favorites.has(bookId) ? 'Desfavoritar' : 'Favoritar'}
                    </button>
                `;
                resultsDiv.appendChild(bookDiv);
            });
        }

        function toggleFavorite(bookId, button) {
            if (favorites.has(bookId)) {
                favorites.delete(bookId);
                button.innerText = 'Favoritar';
                button.setAttribute('aria-label', 'Favoritar');
            } else {
                favorites.add(bookId);
                button.innerText = 'Desfavoritar';
                button.setAttribute('aria-label', 'Desfavoritar');
            }
        }