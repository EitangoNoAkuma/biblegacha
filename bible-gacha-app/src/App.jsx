import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import BibleGacha from './pages/BibleGacha'
import './App.css'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="bible-gacha" element={<BibleGacha />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

export default App
