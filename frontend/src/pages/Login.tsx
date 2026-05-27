import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GoogleLogo } from '../components/ui/GoogleLogo'

export default function Login() {
  const { signInWithEmail, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmail(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Credenciais inválidas. Verifique e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar com Google.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-card-header">
          <div className="auth-logo">📊</div>
          <h1 className="auth-title">Bem-vindo de volta</h1>
          <p className="auth-subtitle">Entre na sua conta ChartMaker</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="seu@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="login-password">Senha</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <><span className="spinner" /> Entrando...</> : 'Entrar'}
          </button>
        </form>

        <div className="auth-divider"><span>ou</span></div>

        <button type="button" onClick={handleGoogle} className="btn btn-google btn-full" disabled={loading}>
          <GoogleLogo size={20} />
          Continuar com Google
        </button>

        <p className="auth-footer">
          Não tem conta?{' '}
          <Link to="/register">Cadastre-se grátis</Link>
        </p>
      </div>
    </div>
  )
}
