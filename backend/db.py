import sqlite3
from datetime import datetime

DB_FILE = 'notes.db'
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT,
            tags TEXT,
            created_at TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def insert_note(title, content, tags):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO notes (title, content, tags, created_at) VALUES (?,?,?,?)
    ''', (title, content, tags, datetime.now()))
    conn.commit()
    note_id = cursor.lastrowid
    conn.close()
    return note_id

def get_all_notes():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT * FROM notes ORDER BY created_at DESC;
    ''')
    rows = cursor.fetchall()
    conn.close()
    return rows

def get_note_by_id(note_id):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM notes WHERE id = ?', (note_id,))
    row = cursor.fetchone()
    conn.close()
    return row

def update_note_by_id(title, content, note_id, tags):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
            'UPDATE notes SET title = ?, content = ?, created_at = ?, tags = ?  WHERE id = ?',
            (title, content, datetime.now(), tags, note_id)
        )
    conn.commit()
    res = cursor.rowcount
    conn.close()
    return res

def delete_note_by_id(note_id):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(
        'DELETE FROM notes WHERE id = ?', (note_id,)
    )
    conn.commit()
    conn.close()
    
