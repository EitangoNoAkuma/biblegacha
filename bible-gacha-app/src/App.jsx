import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [verses, setVerses] = useState([])
  const [bookNames, setBookNames] = useState({})
  const [currentVerse, setCurrentVerse] = useState(null)
  const [savedVerses, setSavedVerses] = useState([])
  const [loading, setLoading] = useState(true)

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
    const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')} ${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}:${String(today.getSeconds()).padStart(2, '0')}`

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
    const loadingText = "Loading..."
    return (
      <div className="app">
        <div className="loading">
          {loadingText.split('').map((char, index) => (
            <span
              key={index}
              className="loading-char"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <main className="main-content">
        <h1 className="app-title">Bible Gacha</h1>
        <p className="app-subtitle">King James Version (1611)</p>

        <div className="gacha-section">
          <button className={`gacha-button${currentVerse ? ' redraw' : ''}`} onClick={drawGacha}>
            {currentVerse ? 'Re-draw Gacha' : 'Draw Gacha'}
          </button>

          {currentVerse && (
            <div className="verse-card">
              <p className="verse-text">{currentVerse.t}</p>
              <p className="verse-reference">
                {getBookName(currentVerse.b)} {currentVerse.c}:{currentVerse.v}
              </p>
              <button className="save-button" onClick={saveVerse}>
                Save
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

      </main>
      <footer className="disclaimer">
        <p>This application is provided "as is" without warranty of any kind.</p>
      </footer>
    </div>
  )
}

export default App
