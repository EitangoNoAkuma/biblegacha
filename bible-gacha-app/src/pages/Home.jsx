import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">Eitango no Akuma</h1>
        <p className="home-subtitle">Welcome to the personal site of Eitango no Akuma</p>
      </header>

      <section className="home-content">
        <div className="content-card">
          <h2 className="card-title">Bible Gacha</h2>
          <p className="card-description">
            Draw random verses from the King James Version Bible.
            Save your favorites and build your collection.
          </p>
          <Link to="/bible-gacha" className="card-link">
            Try Bible Gacha
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <p>This application is provided "as is" without warranty of any kind.</p>
      </footer>
    </div>
  )
}

export default Home
