import { NavLink, Outlet } from 'react-router-dom'
import './Layout.css'

function Layout() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <NavLink to="/" className="site-title">
            Eitango no Akuma
          </NavLink>
        </div>
        <nav className="sidebar-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/bible-gacha"
                className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
              >
                Bible Gacha
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="main-area">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
