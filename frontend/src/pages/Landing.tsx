import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">Powered by GPT-4o-mini</div>
          <h1 className="landing-title">
            Transforme dados em<br />
            <span className="gradient-text">gráficos inteligentes</span>
          </h1>
          <p className="landing-subtitle">
            Faça upload de uma planilha Excel ou descreva seus dados em texto.
            Nossa IA analisa, interpreta e gera visualizações interativas em segundos.
          </p>
          <div className="landing-cta">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/charts')}
            >
              Ver meus gráficos →
            </button>
            <button
              className="btn btn-ghost btn-lg"
              onClick={() => navigate('/charts/new')}
            >
              Criar agora
            </button>
          </div>
        </div>
        <div className="landing-visual" aria-hidden>
          <div className="visual-card">
            <div className="visual-bar-group">
              {[65, 82, 55, 90, 70, 95, 60].map((h, i) => (
                <div
                  key={i}
                  className="visual-bar"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <div className="visual-labels">
              {['Jan','Fev','Mar','Abr','Mai','Jun','Jul'].map(l => (
                <span key={l}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="landing-features">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📁</div>
            <h3>Upload de Excel</h3>
            <p>Suporte a .xlsx, .xls e .csv. A IA lê e interpreta automaticamente sua planilha.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Contexto em texto</h3>
            <p>Descreva o que quer visualizar. A IA entende e escolhe o tipo de gráfico ideal.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Múltiplos tipos</h3>
            <p>Barras, linhas, pizza, radar — a IA escolhe o melhor para seus dados.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌙</div>
            <h3>Dark &amp; Light mode</h3>
            <p>Interface adaptável ao seu ambiente de trabalho, com persistência automática.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
