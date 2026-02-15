const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Create topics table
  db.run(`
    CREATE TABLE topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT UNIQUE NOT NULL,
      entry_count INTEGER DEFAULT 0,
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create entries table
  db.run(`
    CREATE TABLE entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topic_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (topic_id) REFERENCES topics(id)
    )
  `);
});

// Get all topics sorted by last updated (most recent first)
app.get('/api/topics', (req, res) => {
  db.all(
    'SELECT * FROM topics ORDER BY last_updated DESC',
    [],
    (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

// Get a specific topic with its entries
app.get('/api/topics/:id', (req, res) => {
  const topicId = req.params.id;
  
  db.get('SELECT * FROM topics WHERE id = ?', [topicId], (err, topic) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!topic) {
      res.status(404).json({ error: 'Topic not found' });
      return;
    }

    db.all(
      'SELECT * FROM entries WHERE topic_id = ? ORDER BY created_at ASC',
      [topicId],
      (err, entries) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ topic, entries });
      }
    );
  });
});

// Create a new entry
app.post('/api/entries', (req, res) => {
  const { topicTitle, content, author } = req.body;

  if (!topicTitle || !content || !author) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // First, ensure the topic exists (create if it doesn't)
  db.run(
    'INSERT OR IGNORE INTO topics (title, entry_count, last_updated) VALUES (?, 0, datetime("now"))',
    [topicTitle],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Get the topic id
      db.get('SELECT id FROM topics WHERE title = ?', [topicTitle], (err, topic) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }

        // Insert the entry
        db.run(
          'INSERT INTO entries (topic_id, content, author, created_at) VALUES (?, ?, ?, datetime("now"))',
          [topic.id, content, author],
          function(err) {
            if (err) {
              res.status(500).json({ error: err.message });
              return;
            }

            // Update topic's entry count and last_updated
            db.run(
              'UPDATE topics SET entry_count = entry_count + 1, last_updated = datetime("now") WHERE id = ?',
              [topic.id],
              (err) => {
                if (err) {
                  res.status(500).json({ error: err.message });
                  return;
                }

                res.json({
                  success: true,
                  entryId: this.lastID,
                  topicId: topic.id
                });
              }
            );
          }
        );
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
