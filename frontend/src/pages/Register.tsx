import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GoogleLogo } from '../components/ui/GoogleLogo'

export default function Register() {
  const { signUpWithEmail, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isLongEnough = password.length >= 6
  const isMatch = password === confirm && password.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) { setError('Informe seu nome completo.'); return }
    if (!isLongEnough) { setError('A senha precisa ter pelo menos 6 caracteres.'); return }
    if (!isMatch) { setError('As senhas não coincidem.'); return }

    setLoading(true)
    try {
      await signUpWithEmail(name, email, password)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta. Tente novamente.')
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

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card card">
          <div className="auth-card-header">
            <div className="auth-logo">✅</div>
            <h1 className="auth-title">Conta criada!</h1>
            <p className="auth-subtitle">
              Enviamos um link de confirmação para <strong>{email}</strong>.
              Confirme seu email e depois faça login.
            </p>
          </div>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/login')}>
            Ir para o Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <div className="auth-card-header">
          <div className="auth-logo">📊</div>
          <h1 className="auth-title">Criar conta</h1>
          <p className="auth-subtitle">Grátis para sempre. Sem cartão de crédito.</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-field">
            <label className="form-label" htmlFor="reg-name">Nome completo</label>
            <input
              id="reg-name"
              type="text"
              className="form-input"
              placeholder="João Silva"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
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
            <label className="form-label" htmlFor="reg-password">Senha</label>
            <input
              id="reg-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
            {password && (
              <ul className="validation-list">
                <li className={isLongEnough ? 'valid' : ''}>
                  <span className="check-icon">{isLongEnough ? '✓' : '○'}</span>
                  Mínimo de 6 caracteres
                </li>
              </ul>
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="reg-confirm">Confirmar senha</label>
            <input
              id="reg-confirm"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
            {confirm && (
              <ul className="validation-list">
                <li className={isMatch ? 'valid' : ''}>
                  <span className="check-icon">{isMatch ? '✓' : '○'}</span>
                  As senhas coincidem
                </li>
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading || !isLongEnough || !isMatch}
          >
            {loading ? <><span className="spinner" /> Criando conta...</> : 'Criar conta'}
          </button>
        </form>

        <div className="auth-divider"><span>ou</span></div>

        <button type="button" onClick={handleGoogle} className="btn btn-google btn-full" disabled={loading}>
          <GoogleLogo size={20} />
          Continuar com Google
        </button>

        <p className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
