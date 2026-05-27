import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCharts } from '../lib/api'
import type { ChartItem } from '../lib/api'
import { ChartCard } from '../components/charts/ChartCard'

export default function Home() {
  const [charts, setCharts] = useState<ChartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCharts()
      .then(setCharts)
      .catch(() => setError('Não foi possível carregar os gráficos. Verifique se a API está rodando.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="page">
      {/* Hero */}
      <section className="home-hero">
        <h1 className="home-hero-title">
          Seus dados,<br />
          <span className="gradient-text">visualizados com IA</span>
        </h1>
        <p className="home-hero-sub">
          Faça upload de uma planilha Excel ou descreva seus dados em texto.<br />
          A IA converte tudo em gráficos interativos em segundos.
        </p>
        <Link to="/create" className="btn btn-primary btn-lg">
          Criar novo gráfico →
        </Link>
      </section>

      {/* Grid de Gráficos */}
      <section className="charts-section">
        <div className="charts-section-header">
          <h2 className="section-title">Gráficos criados</h2>
          <Link to="/create" className="btn btn-ghost btn-sm">+ Adicionar</Link>
        </div>

        {loading && (
          <div className="charts-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="chart-card skeleton-card" />
            ))}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <span>⚠️</span> {error}
          </div>
        )}

        {!loading && !error && charts.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>Nenhum gráfico criado ainda</h3>
            <p>Crie seu primeiro gráfico enviando uma planilha Excel ou descrevendo seus dados.</p>
            <Link to="/create" className="btn btn-primary">Criar primeiro gráfico</Link>
          </div>
        )}

        {!loading && !error && charts.length > 0 && (
          <div className="charts-grid">
            {charts.map(chart => (
              <ChartCard key={chart.id} item={chart} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
