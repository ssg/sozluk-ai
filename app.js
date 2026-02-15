// State
let currentTopicId = null;
let nextTopicId = 1;
let nextEntryId = 1;

// Initialize storage
function initStorage() {
    if (!localStorage.getItem('sozluk_topics')) {
        localStorage.setItem('sozluk_topics', JSON.stringify([]));
    }
    if (!localStorage.getItem('sozluk_entries')) {
        localStorage.setItem('sozluk_entries', JSON.stringify([]));
    }
    if (!localStorage.getItem('sozluk_nextTopicId')) {
        localStorage.setItem('sozluk_nextTopicId', '1');
    }
    if (!localStorage.getItem('sozluk_nextEntryId')) {
        localStorage.setItem('sozluk_nextEntryId', '1');
    }
    
    nextTopicId = parseInt(localStorage.getItem('sozluk_nextTopicId')) || 1;
    nextEntryId = parseInt(localStorage.getItem('sozluk_nextEntryId')) || 1;
}

// Get all topics
function getTopics() {
    try {
        return JSON.parse(localStorage.getItem('sozluk_topics') || '[]');
    } catch (e) {
        console.error('Error parsing topics from localStorage:', e);
        return [];
    }
}

// Save topics
function saveTopics(topics) {
    localStorage.setItem('sozluk_topics', JSON.stringify(topics));
}

// Get all entries
function getEntries() {
    try {
        return JSON.parse(localStorage.getItem('sozluk_entries') || '[]');
    } catch (e) {
        console.error('Error parsing entries from localStorage:', e);
        return [];
    }
}

// Save entries
function saveEntries(entries) {
    localStorage.setItem('sozluk_entries', JSON.stringify(entries));
}

// Get topic by id
function getTopicById(id) {
    const topics = getTopics();
    return topics.find(t => t.id === id);
}

// Get topic by title
function getTopicByTitle(title) {
    const topics = getTopics();
    return topics.find(t => t.title === title);
}

// Get entries for a topic
function getEntriesForTopic(topicId) {
    const entries = getEntries();
    return entries.filter(e => e.topic_id === topicId).sort((a, b) => 
        new Date(a.created_at) - new Date(b.created_at)
    );
}

// Create or update topic
function createOrUpdateTopic(title) {
    let topics = getTopics();
    let topic = topics.find(t => t.title === title);
    
    if (!topic) {
        topic = {
            id: nextTopicId++,
            title: title,
            entry_count: 0,
            last_updated: new Date().toISOString()
        };
        topics.push(topic);
        localStorage.setItem('sozluk_nextTopicId', nextTopicId.toString());
    }
    
    saveTopics(topics);
    return topic;
}

// Update topic
function updateTopic(topicId) {
    let topics = getTopics();
    const topic = topics.find(t => t.id === topicId);
    
    if (topic) {
        topic.entry_count++;
        topic.last_updated = new Date().toISOString();
        saveTopics(topics);
    }
}

// Create entry
function createEntry(topicId, content, author) {
    const entries = getEntries();
    const entry = {
        id: nextEntryId++,
        topic_id: topicId,
        content: content,
        author: author,
        created_at: new Date().toISOString()
    };
    
    entries.push(entry);
    saveEntries(entries);
    localStorage.setItem('sozluk_nextEntryId', nextEntryId.toString());
    
    return entry;
}

// Load topics on page load
document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    loadTopics();
    
    // Submit new entry
    document.getElementById('submitBtn').addEventListener('click', submitEntry);
    
    // Allow Enter in topic/author inputs to submit
    document.getElementById('topicInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('contentInput').focus();
        }
    });
    
    document.getElementById('authorInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitEntry();
        }
    });
});

// Load all topics
function loadTopics() {
    const topics = getTopics().sort((a, b) => 
        new Date(b.last_updated) - new Date(a.last_updated)
    );
    
    const topicsList = document.getElementById('topicsList');
    
    if (topics.length === 0) {
        topicsList.innerHTML = '<div style="padding: 20px; text-align: center; color: #999;">henüz başlık yok</div>';
        return;
    }
    
    topicsList.innerHTML = topics.map(topic => `
        <div class="topic-item ${topic.id === currentTopicId ? 'active' : ''}" onclick="loadTopic(${topic.id})">
            <div class="topic-title">${escapeHtml(topic.title)}</div>
            <div class="topic-meta">${topic.entry_count} entry</div>
        </div>
    `).join('');
}

// Load a specific topic with its entries
function loadTopic(topicId) {
    const topic = getTopicById(topicId);
    if (!topic) return;
    
    const entries = getEntriesForTopic(topicId);
    
    currentTopicId = topicId;
    
    const entriesContainer = document.getElementById('entriesContainer');
    
    entriesContainer.innerHTML = `
        <div class="topic-header">
            <h2>${escapeHtml(topic.title)}</h2>
        </div>
        ${entries.map(entry => `
            <div class="entry">
                <div class="entry-content">${escapeHtml(entry.content)}</div>
                <div class="entry-footer">
                    <span class="entry-author">${escapeHtml(entry.author)}</span>
                    <span class="entry-date">${formatDate(entry.created_at)}</span>
                </div>
            </div>
        `).join('')}
    `;
    
    // Update active state in topics list
    document.querySelectorAll('.topic-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[onclick="loadTopic(${topicId})"]`)?.classList.add('active');
    
    // Auto-fill topic input
    document.getElementById('topicInput').value = topic.title;
}

// Submit a new entry
function submitEntry() {
    const topicTitle = document.getElementById('topicInput').value.trim();
    const content = document.getElementById('contentInput').value.trim();
    const author = document.getElementById('authorInput').value.trim();
    
    if (!topicTitle || !content || !author) {
        alert('Lütfen tüm alanları doldurun');
        return;
    }
    
    // Create or get topic
    const topic = createOrUpdateTopic(topicTitle);
    
    // Create entry
    createEntry(topic.id, content, author);
    
    // Update topic
    updateTopic(topic.id);
    
    // Clear content and author fields
    document.getElementById('contentInput').value = '';
    document.getElementById('authorInput').value = '';
    
    // Reload topics list
    loadTopics();
    
    // Load the topic that was just updated
    loadTopic(topic.id);
}

// Format date to Turkish format
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
