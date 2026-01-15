import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [verses, setVerses] = useState([])
  const [bookNames, setBookNames] = useState({})
  const [currentVerse, setCurrentVerse] = useState(null)
  const [savedVerses, setSavedVerses] = useState([])
  const [loading, setLoading] = useState(true)
  const [accessCount, setAccessCount] = useState(0)
  const [bbsPosts, setBbsPosts] = useState([])
  const [bbsName, setBbsName] = useState('')
  const [bbsMessage, setBbsMessage] = useState('')

  // Load verses and book names from JSON files on mount
  useEffect(() => {
    Promise.all([
      fetch('./t_kjv.json').then(res => res.json()),
      fetch('./key_english.json').then(res => res.json())
    ])
      .then(([versesData, bookData]) => {
        setVerses(versesData)
        // Create a mapping from book number to book name
        const nameMap = {}
        bookData.resultset.keys.forEach(book => {
          nameMap[book.b] = book.n
        })
        setBookNames(nameMap)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading data:', error)
        setLoading(false)
      })
  }, [])

  // Load saved verses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('bible-gacha-saved-verses')
    if (saved) {
      setSavedVerses(JSON.parse(saved))
    }
  }, [])

  // Access counter - increment on mount
  useEffect(() => {
    const count = parseInt(localStorage.getItem('bible-gacha-access-count') || '0', 10)
    const newCount = count + 1
    localStorage.setItem('bible-gacha-access-count', String(newCount))
    setAccessCount(newCount)
  }, [])

  // Load BBS posts from localStorage on mount
  useEffect(() => {
    const posts = localStorage.getItem('bible-gacha-bbs-posts')
    if (posts) {
      setBbsPosts(JSON.parse(posts))
    }
  }, [])

  // Submit BBS post
  const submitBbsPost = () => {
    if (!bbsMessage.trim()) return

    const now = new Date()
    const dateStr = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const newPost = {
      id: Date.now(),
      name: bbsName.trim() || '名無しさん',
      message: bbsMessage.trim(),
      date: dateStr
    }

    const newPosts = [newPost, ...bbsPosts].slice(0, 50) // Keep latest 50 posts
    setBbsPosts(newPosts)
    localStorage.setItem('bible-gacha-bbs-posts', JSON.stringify(newPosts))
    setBbsMessage('')
  }

  // Draw random verse
  const drawGacha = () => {
    if (verses.length === 0) return
    const randomIndex = Math.floor(Math.random() * verses.length)
    setCurrentVerse(verses[randomIndex])
  }

  // Get book name from book number
  const getBookName = (bookNumber) => {
    return bookNames[bookNumber] || `Book ${bookNumber}`
  }

  // Save current verse
  const saveVerse = () => {
    if (!currentVerse) return

    const today = new Date()
    const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`

    const savedVerse = {
      id: currentVerse.id,
      text: currentVerse.t,
      reference: `${getBookName(currentVerse.b)} ${currentVerse.c}:${currentVerse.v}`,
      savedDate: dateStr,
      timestamp: Date.now()
    }

    const newSavedVerses = [savedVerse, ...savedVerses]
    setSavedVerses(newSavedVerses)
    localStorage.setItem('bible-gacha-saved-verses', JSON.stringify(newSavedVerses))
  }

  // Delete saved verse
  const deleteVerse = (timestamp) => {
    const newSavedVerses = savedVerses.filter(v => v.timestamp !== timestamp)
    setSavedVerses(newSavedVerses)
    localStorage.setItem('bible-gacha-saved-verses', JSON.stringify(newSavedVerses))
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="access-counter">
        <span className="counter-label">COUNTER</span>
        <span className="counter-value">{String(accessCount).padStart(6, '0')}</span>
      </div>
      <main className="main-content">
        <h1 className="app-title">Bible Gacha</h1>

        <div className="gacha-section">
          <button className="gacha-button" onClick={drawGacha}>
            Draw Gacha
          </button>

          {currentVerse && (
            <div className="verse-card">
              <p className="verse-text">{currentVerse.t}</p>
              <p className="verse-reference">
                {getBookName(currentVerse.b)} {currentVerse.c}:{currentVerse.v}
              </p>
              <button className="save-button" onClick={saveVerse}>
                Save Verse
              </button>
            </div>
          )}
        </div>

        {savedVerses.length > 0 && (
          <div className="saved-section">
            <h2 className="saved-title">Saved Verses</h2>
            <ul className="saved-list">
              {savedVerses.map((verse) => (
                <li key={verse.timestamp} className="saved-item">
                  <div className="saved-content">
                    <p className="saved-text">{verse.text}</p>
                    <p className="saved-reference">{verse.reference}</p>
                    <p className="saved-date">Saved: {verse.savedDate}</p>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => deleteVerse(verse.timestamp)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bbs-section">
          <h2 className="bbs-title">Bulletin Board</h2>
          <div className="bbs-form">
            <input
              type="text"
              className="bbs-input bbs-name-input"
              placeholder="Name (optional)"
              value={bbsName}
              onChange={(e) => setBbsName(e.target.value)}
            />
            <textarea
              className="bbs-input bbs-message-input"
              placeholder="Write your message..."
              value={bbsMessage}
              onChange={(e) => setBbsMessage(e.target.value)}
              rows={3}
            />
            <button className="bbs-submit-button" onClick={submitBbsPost}>
              Post
            </button>
          </div>
          {bbsPosts.length > 0 && (
            <ul className="bbs-list">
              {bbsPosts.map((post) => (
                <li key={post.id} className="bbs-post">
                  <div className="bbs-post-header">
                    <span className="bbs-post-name">{post.name}</span>
                    <span className="bbs-post-date">{post.date}</span>
                  </div>
                  <p className="bbs-post-message">{post.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
