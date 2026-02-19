// =============================================================================
// CARD LOOKUP - SORCERY API
// =============================================================================

let allCards = [];
let searchTimeout = null;

// Load all cards from API
async function loadCards() {
    try {
        const response = await fetch('https://api.sorcerytcg.com/api/cards');
        const data = await response.json();
        allCards = data.cards || [];
    } catch (error) {
        console.error('Failed to load cards:', error);
    }
}

// Initialize card data
loadCards();

function searchCards() {
    clearTimeout(searchTimeout);
    
    searchTimeout = setTimeout(() => {
        const query = document.getElementById('card-search').value.toLowerCase().trim();
        const resultsContainer = document.getElementById('card-results');
        
        if (!query) {
            resultsContainer.innerHTML = '<div class="browser-loading">Enter a card name to search</div>';
            return;
        }
        
        if (allCards.length === 0) {
            resultsContainer.innerHTML = '<div class="browser-loading">Loading cards...</div>';
            return;
        }
        
        const matches = allCards.filter(card => 
            card.name.toLowerCase().includes(query)
        ).slice(0, 20); // Limit to 20 results
        
        if (matches.length === 0) {
            resultsContainer.innerHTML = '<div class="browser-loading">No cards found</div>';
            return;
        }
        
        resultsContainer.innerHTML = matches.map(card => `
            <div class="avatar-list-item" onclick="showCardDetail('${card.slug}')">
                ${card.name}
            </div>
        `).join('');
    }, 300); // Debounce search
}

function showCardDetail(slug) {
    const card = allCards.find(c => c.slug === slug);
    if (!card) return;
    
    // Hide results, show detail
    document.getElementById('card-results').style.display = 'none';
    document.getElementById('card-detail').style.display = 'flex';
    
    // Set card image
    const cardImage = document.getElementById('card-detail-image');
    cardImage.src = `https://d27a44hjr9gen3.cloudfront.net/bet/sorcery_logo_black.png`; // Placeholder
    cardImage.alt = card.name;
    
    // Try to load actual card image
    if (card.image_uris && card.image_uris.front) {
        cardImage.src = card.image_uris.front;
    }
    
    // Set card text
    const textContainer = document.getElementById('card-detail-text');
    let cardText = `<h4>${card.name}</h4>`;
    if (card.type_line) cardText += `<p><strong>Type:</strong> ${card.type_line}</p>`;
    if (card.oracle_text) cardText += `<p>${card.oracle_text}</p>`;
    if (card.flavor_text) cardText += `<p><em>${card.flavor_text}</em></p>`;
    textContainer.innerHTML = cardText;
    
    // Set FAQ if available
    const faqContainer = document.getElementById('card-detail-faq');
    if (card.faqs && card.faqs.length > 0) {
        faqContainer.innerHTML = '<h4>FAQ</h4>' + card.faqs.map(faq => `
            <div class="card-faq-item">
                <div class="card-faq-question">${faq.question}</div>
                <div class="card-faq-answer">${faq.answer}</div>
            </div>
        `).join('');
    } else {
        faqContainer.innerHTML = '';
    }
}

function backToCardList() {
    document.getElementById('card-results').style.display = 'flex';
    document.getElementById('card-detail').style.display = 'none';
    document.getElementById('card-search').value = '';
    searchCards();
}
