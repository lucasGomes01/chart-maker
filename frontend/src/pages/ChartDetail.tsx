import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getChartById } from '../lib/api'
import type { ChartItem } from '../lib/api'
import { ChartCard } from '../components/charts/ChartCard'

export default function ChartDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chart, setChart] = useState<ChartItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getChartById(Number(id))
      .then(setChart)
      .catch(() => setError('Não foi possível carregar o gráfico.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: '3rem' }}>
        <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }} />
        <p>Carregando gráfico...</p>
      </div>
    )
  }

  if (error || !chart) {
    return (
      <div className="page">
        <div className="alert alert-error">
          <span>⚠️</span> {error || 'Gráfico não encontrado'}
        </div>
        <button className="btn btn-ghost" onClick={() => navigate('/charts')} style={{ marginTop: '1rem' }}>
          ← Voltar para Meus Gráficos
        </button>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="charts-page-header" style={{ alignItems: 'flex-start' }}>
        <div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/charts')}
            style={{ marginBottom: '0.5rem', padding: '0.25rem 0.5rem', height: 'auto', marginLeft: '-0.5rem' }}
          >
            ← Voltar
          </button>
          <h1 className="page-title">{chart.title}</h1>
        </div>
      </div>

      <section className="new-chart-gallery-col" style={{ flex: 'none', padding: 0, marginTop: '2rem' }}>
        <div className="gallery-header">
          <h2 className="section-title">Variações geradas</h2>
          <span className="gallery-count">4 opções</span>
        </div>

        <div className="gallery-grid">
          <ChartCard item={chart} forceType="bar" />
          <ChartCard item={chart} forceType="line" />
          <ChartCard item={chart} forceType="pie" />
          <ChartCard item={chart} forceType="radar" />
        </div>
      </section>
    </div>
  )
}
