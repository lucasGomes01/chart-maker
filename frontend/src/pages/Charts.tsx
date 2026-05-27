import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCharts, deleteChart } from '../lib/api'
import type { ChartItem } from '../lib/api'

export default function Charts() {
  const navigate = useNavigate()
  const [charts, setCharts] = useState<ChartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    getCharts()
      .then(setCharts)
      .catch(() => setError('Não foi possível carregar os gráficos.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir este gráfico?')) return
    setDeletingId(id)
    try {
      await deleteChart(id)
      setCharts(prev => prev.filter(c => c.id !== id))
    } catch {
      alert('Erro ao excluir. Tente novamente.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page">
      {/* Cabeçalho da seção */}
      <div className="charts-page-header">
        <div>
          <h1 className="page-title">Meus Gráficos</h1>
          <p className="page-subtitle">
            {loading
              ? 'Carregando…'
              : `${charts.length} gráfico${charts.length !== 1 ? 's' : ''} criado${charts.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/charts/new')}
        >
          + Adicionar
        </button>
      </div>

      {/* Erros */}
      {error && (
        <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Skeletons */}
      {loading && (
        <div className="charts-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="chart-card skeleton-card" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && charts.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3>Nenhum gráfico ainda</h3>
          <p>Crie seu primeiro gráfico enviando uma planilha ou descrevendo seus dados.</p>
          <button className="btn btn-primary" onClick={() => navigate('/charts/new')}>
            Criar primeiro gráfico
          </button>
        </div>
      )}

      {/* Lista de gráficos */}
      {!loading && !error && charts.length > 0 && (
        <div className="charts-list">
          {charts.map(chart => (
            <div 
              key={chart.id} 
              className="chart-list-item card"
              onClick={() => navigate(`/charts/${chart.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div className="chart-list-info">
                <h3>{chart.title}</h3>
                <span className="text-muted">
                  Criado em {new Date(chart.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(chart.id);
                }}
                disabled={deletingId === chart.id}
                title="Excluir gráfico"
              >
                {deletingId === chart.id ? 'Excluindo...' : '✕ Excluir'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
