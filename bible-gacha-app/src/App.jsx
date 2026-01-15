import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [verses, setVerses] = useState([])
  const [currentVerse, setCurrentVerse] = useState(null)
  const [savedVerses, setSavedVerses] = useState([])
  const [loading, setLoading] = useState(true)

  // Load verses from JSON file on mount
  useEffect(() => {
    fetch('./t_kjv.json')
      .then(response => response.json())
      .then(data => {
        setVerses(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Error loading verses:', error)
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

  // Save current verse
  const saveVerse = () => {
    if (!currentVerse) return

    const today = new Date()
    const dateStr = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`

    const savedVerse = {
      id: currentVerse.id,
      text: currentVerse.t,
      reference: `Book ${currentVerse.b}, Chapter ${currentVerse.c}, Verse ${currentVerse.v}`,
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
                Book {currentVerse.b}, Chapter {currentVerse.c}, Verse {currentVerse.v}
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
      </main>
    </div>
  )
}

export default App
