class NewsAggregator {
    constructor() {
        this.currentUser = null;
        this.bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        this.currentView = 'grid';
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.loadNews();
    }

    // Authentication Functions
    checkAuthStatus() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.updateUserDisplay();
        } else {
            this.showAuthModal();
        }
    }

    showAuthModal() {
        document.getElementById('authModal').classList.remove('hidden');
    }

    hideAuthModal() {
        document.getElementById('authModal').classList.add('hidden');
    }

    login() {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        axios.post('/api/auth/login', { email, password })
            .then(response => {
                this.currentUser = response.data.user;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.updateUserDisplay();
                this.hideAuthModal();
                this.loadNews();
            })
            .catch(error => {
                alert('Login failed: ' + (error.response?.data?.message || error.message));
            });
    }

    register() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        axios.post('/api/auth/register', { name, email, password })
            .then(response => {
                this.currentUser = response.data.user;
                localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.updateUserDisplay();
                this.hideAuthModal();
                this.loadNews();
            })
            .catch(error => {
                alert('Registration failed: ' + (error.response?.data?.message || error.message));
            });
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showAuthModal();
        document.getElementById('userNameDisplay').textContent = 'Guest';
    }

    updateUserDisplay() {
        if (this.currentUser) {
            document.getElementById('userNameDisplay').textContent = this.currentUser.name;
            this.loadProfile();
        }
    }

    // News Loading Functions
    async loadNews() {
        try {
            const response = await axios.get('/api/news', {
                params: { page: 1, pageSize: 12 }
            });
            this.displayNews(response.data.articles);
        } catch (error) {
            console.error('Error loading news:', error);
            this.displayError('Failed to load news articles');
        }
    }

    async loadCategoryNews(category) {
        try {
            const response = await axios.get('/api/news', {
                params: { category, page: 1, pageSize: 12 }
            });
            this.displayCategoryNews(response.data.articles, category);
        } catch (error) {
            console.error('Error loading category news:', error);
            this.displayError('Failed to load category news');
        }
    }

    async searchNews(query = null) {
        const searchQuery = query || document.getElementById('searchInput').value;

        if (!searchQuery) {
            alert('Please enter a search query');
            return;
        }

        try {
            const response = await axios.get('/api/news/search', {
                params: { q: searchQuery, page: 1, pageSize: 20 }
            });
            this.displaySearchResults(response.data.articles, searchQuery);
        } catch (error) {
            console.error('Error searching news:', error);
            this.displayError('Failed to search news');
        }
    }

    // Display Functions
    displayNews(articles) {
        const container = document.getElementById('newsContainer');
        container.innerHTML = '';

        articles.forEach(article => {
            const articleElement = this.createArticleElement(article);
            container.appendChild(articleElement);
        });
    }

    displayCategoryNews(articles, category) {
        const container = document.getElementById('categoryNews');
        const titleElement = document.getElementById('categoryTitle');
        const categoryContainer = document.getElementById('categoryNewsContainer');

        titleElement.textContent = category.charAt(0).toUpperCase() + category.slice(1) + ' News';
        categoryContainer.classList.remove('hidden');

        container.innerHTML = '';
        articles.forEach(article => {
            const articleElement = this.createArticleElement(article);
            container.appendChild(articleElement);
        });
    }

    displaySearchResults(articles, query) {
        const container = document.getElementById('searchResultsContainer');
        const resultsSection = document.getElementById('searchResults');

        resultsSection.classList.remove('hidden');
        container.innerHTML = '';

        if (articles.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8">No results found for your search.</p>';
            return;
        }

        articles.forEach(article => {
            const articleElement = this.createSearchResultElement(article);
            container.appendChild(articleElement);
        });
    }

    createArticleElement(article) {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow';

        const isBookmarked = this.bookmarks.some(b => b.id === article.id);
        const bookmarkClass = isBookmarked ? 'text-red-500' : 'text-gray-400';

        div.innerHTML = `
            <img src="${article.urlToImage}" alt="${article.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex items-center justify-between mb-3">
                    <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">${article.category}</span>
                    <button onclick="newsApp.toggleBookmark(${article.id})" class="bookmark-btn ${bookmarkClass} hover:text-red-500">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
                        </svg>
                    </button>
                </div>
                <h3 class="text-lg font-serif font-semibold text-gray-900 mb-3">${article.title}</h3>
                <p class="text-gray-600 mb-4">${article.description}</p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-2">
                        <span class="text-sm text-gray-500">${article.source}</span>
                        <span class="text-sm text-gray-500">•</span>
                        <span class="text-sm text-gray-500">${article.publishedAt}</span>
                    </div>
                    <button onclick="newsApp.readArticle(${article.id})" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Read More</button>
                </div>
            </div>
        `;
        return div;
    }

    createSearchResultElement(article) {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow';

        const isBookmarked = this.bookmarks.some(b => b.id === article.id);
        const bookmarkClass = isBookmarked ? 'text-red-500' : 'text-gray-400';

        div.innerHTML = `
            <div class="flex space-x-4">
                <img src="${article.urlToImage}" alt="${article.title}" class="w-24 h-24 object-cover rounded-lg">
                <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                        <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">${article.category}</span>
                        <button onclick="newsApp.toggleBookmark(${article.id})" class="bookmark-btn ${bookmarkClass} hover:text-red-500">
                            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
                            </svg>
                        </button>
                    </div>
                    <h3 class="text-lg font-serif font-semibold text-gray-900 mb-2">${article.title}</h3>
                    <p class="text-gray-600 mb-3">${article.description}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm text-gray-500">${article.source}</span>
                            <span class="text-sm text-gray-500">•</span>
                            <span class="text-sm text-gray-500">${article.publishedAt}</span>
                        </div>
                        <button onclick="newsApp.readArticle(${article.id})" class="text-blue-600 hover:text-blue-800 text-sm font-medium">Read More</button>
                    </div>
                </div>
            </div>
        `;
        return div;
    }

    toggleBookmark(articleId) {
        const isBookmarked = this.bookmarks.some(b => b.id === articleId);

        if (isBookmarked) {
            this.bookmarks = this.bookmarks.filter(b => b.id !== articleId);
        } else {
            // You should fetch the article details if needed
            alert('Fetching article details for bookmarking is not implemented yet.');
        }

        localStorage.setItem('bookmarks', JSON.stringify(this.bookmarks));
        this.updateBookmarkButtons();

        if (document.getElementById('bookmarksSection').classList.contains('hidden') === false) {
            this.loadBookmarks();
        }
    }

    updateBookmarkButtons() {
        const bookmarkButtons = document.querySelectorAll('.bookmark-btn');
        bookmarkButtons.forEach(button => {
            const articleId = parseInt(button.getAttribute('onclick').match(/\d+/)[0]);
            const isBookmarked = this.bookmarks.some(b => b.id === articleId);
            button.className = `bookmark-btn ${isBookmarked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`;
        });
    }

    loadBookmarks() {
        const container = document.getElementById('bookmarksContainer');
        container.innerHTML = '';

        if (this.bookmarks.length === 0) {
            container.innerHTML = '<p class="text-gray-500 text-center py-8 col-span-full">No bookmarked articles yet.</p>';
            return;
        }

        this.bookmarks.forEach(article => {
            const articleElement = this.createArticleElement(article);
            container.appendChild(articleElement);
        });
    }

    loadProfile() {
        if (!this.currentUser) return;

        document.getElementById('profileName').value = this.currentUser.name;
        document.getElementById('profileEmail').value = this.currentUser.email;
    }

    saveProfile() {
        if (!this.currentUser) return;

        this.currentUser.name = document.getElementById('profileName').value;
        this.currentUser.email = document.getElementById('profileEmail').value;

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.updateUserDisplay();
        alert('Profile updated successfully!');
    }

    changeView() {
        const viewSelect = document.getElementById('viewToggle');
        this.currentView = viewSelect.value;

        const container = document.getElementById('newsContainer');
        container.className = this.getViewClass();

        this.loadNews();
    }

    getViewClass() {
        switch (this.currentView) {
            case 'list':
                return 'space-y-4';
            case 'magazine':
                return 'grid grid-cols-1 lg:grid-cols-2 gap-8';
            default:
                return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
        }
    }

    readArticle(articleId) {
        alert('Opening article ' + articleId + '. This would normally open the full article.');
    }

    displayError(message) {
        const container = document.getElementById('newsContainer');
        container.innerHTML = `<div class="col-span-full text-center py-8 text-red-500">${message}</div>`;
    }

    setupEventListeners() {
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.toggle('hidden');
        });

        document.getElementById('userMenuBtn').addEventListener('click', () => {
            document.getElementById('userMenu').classList.toggle('hidden');
        });

        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchNews();
            }
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('#userMenuBtn')) {
                document.getElementById('userMenu').classList.add('hidden');
            }
        });
    }
}
