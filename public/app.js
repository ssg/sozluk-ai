// State
let currentTopicId = null;

// Load topics on page load
document.addEventListener('DOMContentLoaded', () => {
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
async function loadTopics() {
    try {
        const response = await fetch('/api/topics');
        const topics = await response.json();
        
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
    } catch (error) {
        console.error('Error loading topics:', error);
    }
}

// Load a specific topic with its entries
async function loadTopic(topicId) {
    try {
        const response = await fetch(`/api/topics/${topicId}`);
        const data = await response.json();
        
        currentTopicId = topicId;
        
        const entriesContainer = document.getElementById('entriesContainer');
        
        entriesContainer.innerHTML = `
            <div class="topic-header">
                <h2>${escapeHtml(data.topic.title)}</h2>
            </div>
            ${data.entries.map(entry => `
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
        document.getElementById('topicInput').value = data.topic.title;
        
    } catch (error) {
        console.error('Error loading topic:', error);
    }
}

// Submit a new entry
async function submitEntry() {
    const topicTitle = document.getElementById('topicInput').value.trim();
    const content = document.getElementById('contentInput').value.trim();
    const author = document.getElementById('authorInput').value.trim();
    
    if (!topicTitle || !content || !author) {
        alert('Lütfen tüm alanları doldurun');
        return;
    }
    
    try {
        const response = await fetch('/api/entries', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topicTitle,
                content,
                author
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Clear content and author fields
            document.getElementById('contentInput').value = '';
            document.getElementById('authorInput').value = '';
            
            // Reload topics list
            await loadTopics();
            
            // Load the topic that was just updated
            await loadTopic(result.topicId);
        } else {
            alert('Bir hata oluştu: ' + result.error);
        }
    } catch (error) {
        console.error('Error submitting entry:', error);
        alert('Bir hata oluştu');
    }
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
