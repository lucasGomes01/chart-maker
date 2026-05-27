import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

export function Navbar() {
  const { user, signOut, loading } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Usuário'

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">📊</span>
          <span className="navbar-logo-text">Chart<span>Maker</span></span>
        </Link>

        {!loading && user && (
          <nav className="navbar-links">
            <Link to="/charts" className="nav-link">Meus Gráficos</Link>
            <Link to="/charts/new" className="nav-link">Criar Gráfico</Link>
          </nav>
        )}

        <div className="navbar-actions">
          <button
            className="btn-icon"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            title={theme === 'dark' ? 'Mudar para claro' : 'Mudar para escuro'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {!loading && (
            user ? (
              <div className="navbar-user">
                <span className="navbar-user-name">{displayName}</span>
                <button className="btn btn-ghost btn-sm" onClick={handleSignOut}>Sair</button>
              </div>
            ) : (
              <div className="navbar-auth">
                <Link to="/login" className="btn btn-ghost btn-sm">Entrar</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Cadastrar</Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  )
}
