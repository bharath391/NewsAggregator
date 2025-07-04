// News Aggregator JavaScript
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

        // Mock authentication - Replace with actual API call
        /*
        axios.post('/api/auth/login', {
            email: email,
            password: password
        }).then(response => {
            this.currentUser = response.data.user;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUserDisplay();
            this.hideAuthModal();
        }).catch(error => {
            alert('Login failed: ' + error.message);
        });
        */

        // Mock successful login
        this.currentUser = {
            id: 1,
            name: email.split('@')[0],
            email: email,
            preferences: {
                categories: ['technology', 'politics'],
                sources: ['bbc', 'cnn']
            }
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.updateUserDisplay();
        this.hideAuthModal();
        this.loadNews();
    }

    register() {
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // Mock registration - Replace with actual API call
        /*
        axios.post('/api/auth/register', {
            name: name,
            email: email,
            password: password
        }).then(response => {
            this.currentUser = response.data.user;
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
            this.updateUserDisplay();
            this.hideAuthModal();
        }).catch(error => {
            alert('Registration failed: ' + error.message);
        });
        */

        // Mock successful registration
        this.currentUser = {
            id: Date.now(),
            name: name,
            email: email,
            preferences: {
                categories: [],
                sources: []
            }
        };
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.updateUserDisplay();
        this.hideAuthModal();
        this.loadNews();
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
            // Mock API call - Replace with actual API
            /*
            const response = await axios.get('/api/news', {
                params: {
                    category: 'general',
                    page: 1,
                    pageSize: 12
                }
            });
            this.displayNews(response.data.articles);
            */

            // Mock news data
            const mockNews = this.generateMockNews();
            this.displayNews(mockNews);
        } catch (error) {
            console.error('Error loading news:', error);
            this.displayError('Failed to load news articles');
        }
    }

    async loadCategoryNews(category) {
        try {
            // Mock API call - Replace with actual API
            /*
            const response = await axios.get('/api/news', {
                params: {
                    category: category,
                    page: 1,
                    pageSize: 12
                }
            });
            this.displayCategoryNews(response.data.articles, category);
            */

            // Mock category news data
            const mockNews = this.generateMockNews(category);
            this.displayCategoryNews(mockNews, category);
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
            // Mock API call - Replace with actual API
            /*
            const response = await axios.get('/api/news/search', {
                params: {
                    q: searchQuery,
                    page: 1,
                    pageSize: 20
                }
            });
            this.displaySearchResults(response.data.articles, searchQuery);
            */

            // Mock search results
            const mockResults = this.generateMockNews('search', searchQuery);
            this.displaySearchResults(mockResults, searchQuery);
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
            <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
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
                <img src="${article.image}" alt="${article.title}" class="w-24 h-24 object-cover rounded-lg">
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

    // Bookmark Functions
    toggleBookmark(articleId) {
        const isBookmarked = this.bookmarks.some(b => b.id === articleId);
        
        if (isBookmarked) {
            this.bookmarks = this.bookmarks.filter(b => b.id !== articleId);
        } else {
            // Find the article and add to bookmarks
            const article = this.findArticleById(articleId);
            if (article) {
                this.bookmarks.push(article);
            }
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

    // Profile Functions
    loadProfile() {
        if (!this.currentUser) return;

        document.getElementById('profileName').value = this.currentUser.name;
        document.getElementById('profileEmail').value = this.currentUser.email;

        // Load category preferences
        const categoryPrefs = document.querySelectorAll('.category-pref');
        categoryPrefs.forEach(checkbox => {
            checkbox.checked = this.currentUser.preferences.categories.includes(checkbox.value);
        });

        // Load source preferences
        const sourceSelect = document.getElementById('preferredSources');
        Array.from(sourceSelect.options).forEach(option => {
            option.selected = this.currentUser.preferences.sources.includes(option.value);
        });
    }

    saveProfile() {
        if (!this.currentUser) return;

        this.currentUser.name = document.getElementById('profileName').value;
        this.currentUser.email = document.getElementById('profileEmail').value;

        // Save category preferences
        const categoryPrefs = document.querySelectorAll('.category-pref:checked');
        this.currentUser.preferences.categories = Array.from(categoryPrefs).map(cb => cb.value);

        // Save source preferences
        const sourceSelect = document.getElementById('preferredSources');
        this.currentUser.preferences.sources = Array.from(sourceSelect.selectedOptions).map(option => option.value);

        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.updateUserDisplay();
        alert('Profile updated successfully!');
    }

    // View Functions
    changeView() {
        const viewSelect = document.getElementById('viewToggle');
        this.currentView = viewSelect.value;
        
        const container = document.getElementById('newsContainer');
        container.className = this.getViewClass();
        
        // Reload news with new view
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

    // Utility Functions
    findArticleById(id) {
        // This would normally search through the current articles
        // For mock purposes, we'll create a dummy article
        return {
            id: id,
            title: 'Sample Article',
            description: 'This is a sample article description',
            image: 'https://via.placeholder.com/400x300',
            category: 'General',
            source: 'News Source',
            publishedAt: new Date().toLocaleDateString(),
            url: '#'
        };
    }

    readArticle(articleId) {
        // This would normally open the full article
        // For now, we'll just show an alert
        alert('Opening article ' + articleId + '. This would normally open the full article.');
    }

    displayError(message) {
        const container = document.getElementById('newsContainer');
        container.innerHTML = `<div class="col-span-full text-center py-8 text-red-500">${message}</div>`;
    }

    // Mock Data Generator
    generateMockNews(category = 'general', query = null) {
        const categories = ['Technology', 'Politics', 'Sports', 'Business', 'Entertainment', 'Health', 'Science', 'World'];
        const sources = ['BBC News', 'CNN', 'Reuters', 'Associated Press', 'The Guardian', 'NPR', 'Bloomberg', 'TechCrunch'];
        
        const mockTitles = {
            technology: [
                'Revolutionary AI Breakthrough Changes Everything',
                'New Smartphone Features Unveiled',
                'Quantum Computing Reaches New Milestone',
                'Cybersecurity Threats on the Rise',
                'Green Technology Innovations'
            ],
            politics: [
                'Global Summit Reaches Historic Agreement',
                'Election Results Shake Political Landscape',
                'New Policy Changes Announced',
                'International Relations Update',
                'Government Reform Proposals'
            ],
            sports: [
                'Championship Finals Set for This Weekend',
                'Olympic Records Broken in Recent Games',
                'Trade Deals Reshape Team Dynamics',
                'Rising Star Athletes to Watch',
                'Season Highlights and Statistics'
            ],
            business: [
                'Market Volatility Continues This Week',
                'Major Merger Announced Between Giants',
                'Economic Indicators Show Growth',
                'Startup Raises Record Funding',
                'Global Trade Patterns Shift'
            ],
            entertainment: [
                'Award Season Nominations Announced',
                'Blockbuster Movie Breaks Box Office',
                'Music Industry Trends for 2025',
                'Celebrity News and Updates',
                'Streaming Platform Wars Continue'
            ],
            health: [
                'Medical Breakthrough Offers New Hope',
                'Public Health Campaign Launches',
                'Fitness Trends for the New Year',
                'Mental Health Awareness Grows',
                'Nutrition Studies Reveal Insights'
            ],
            science: [
                'Space Exploration Reaches New Heights',
                'Climate Change Research Updates',
                'Archaeological Discovery Rewrites History',
                'Marine Biology Findings Surprise Scientists',
                'Renewable Energy Efficiency Improves'
            ],
            world: [
                'International Crisis Requires Attention',
                'Cultural Exchange Programs Expand',
                'Global Environmental Initiative',
                'Humanitarian Aid Efforts Continue',
                'Peace Negotiations Make Progress'
            ]
        };

        const articles = [];
        const titleArray = mockTitles[category] || [
            'Breaking News Story Develops',
            'Important Updates from Around the World',
            'Local Community Events Make Headlines',
            'Weather Patterns Affect Regional Activities',
            'Educational Initiatives Show Promise'
        ];

        for (let i = 0; i < 12; i++) {
            const randomCategory = category === 'general' ? categories[Math.floor(Math.random() * categories.length)] : category.charAt(0).toUpperCase() + category.slice(1);
            const randomSource = sources[Math.floor(Math.random() * sources.length)];
            const randomTitle = titleArray[Math.floor(Math.random() * titleArray.length)];
            
            articles.push({
                id: Date.now() + i,
                title: query ? `${randomTitle} - ${query}` : randomTitle,
                description: `This is a detailed description of the ${randomCategory.toLowerCase()} news article. It provides comprehensive coverage of the latest developments and their potential impact on various stakeholders.`,
                image: `https://picsum.photos/400/300?random=${Date.now() + i}`,
                category: randomCategory,
                source: randomSource,
                publishedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toLocaleDateString(),
                url: '#'
            });
        }

        return articles;
    }

    // Event Listeners
    setupEventListeners() {
        // Mobile menu toggle
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.toggle('hidden');
        });

        // User menu toggle
        document.getElementById('userMenuBtn').addEventListener('click', () => {
            document.getElementById('userMenu').classList.toggle('hidden');
        });

        // Search input enter key
        document.getElementById('searchInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchNews();
            }
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#userMenuBtn')) {
                document.getElementById('userMenu').classList.add('hidden');
            }
        });
    }
}

// Global Functions for HTML onclick events
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });

    // Show selected section
    document.getElementById(sectionName + 'Section').classList.remove('hidden');

    // Load section-specific content
    switch (sectionName) {
        case 'bookmarks':
            newsApp.loadBookmarks();
            break;
        case 'profile':
            newsApp.loadProfile();
            break;
    }

    // Close mobile menu
    document.getElementById('mobileMenu').classList.add('hidden');
}

function showLoginForm() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

function login() {
    newsApp.login();
}

function register() {
    newsApp.register();
}

function logout() {
    newsApp.logout();
}

function loadCategoryNews(category) {
    newsApp.loadCategoryNews(category);
}

function hideCategoryNews() {
    document.getElementById('categoryNewsContainer').classList.add('hidden');
}

function searchNews() {
    newsApp.searchNews();
}

function searchPopular(query) {
    document.getElementById('searchInput').value = query;
    newsApp.searchNews(query);
}

function changeView() {
    newsApp.changeView();
}

function saveProfile() {
    newsApp.saveProfile();
}

// Initialize the app
const newsApp = new NewsAggregator();

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
