import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createChart, getCharts } from '../lib/api'
import type { ChartItem } from '../lib/api'
import { ChartCard } from '../components/charts/ChartCard'
import { useAuth } from '../context/AuthContext'

export default function NewChart() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Formulário
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // Resultado recém-gerado
  const [latestChart, setLatestChart] = useState<ChartItem | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('Informe um título para o gráfico.')
      return
    }

    const formData = new FormData()
    formData.append('Title', title)
    formData.append('Description', description)
    if (file) formData.append('ExcelFile', file)

    setLoading(true)
    try {
      const created = await createChart(formData)
      // Define o novo gráfico como resultado
      setLatestChart(created)
      setTitle('')
      setDescription('')
      setFile(null)
    } catch {
      setError('Erro ao criar gráfico. Verifique se a API está rodando.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-chart-page">
      {/* ── Coluna Esquerda: Formulário ── */}
      <aside className="new-chart-form-col">
        <div className="new-chart-form-header">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate('/charts')}
          >
            ← Voltar
          </button>
          <h1 className="page-title" style={{ marginTop: '0.75rem' }}>Novo Gráfico</h1>
          {user && (
            <p className="page-subtitle">
              Criando como <strong>{user.user_metadata?.full_name || user.email}</strong>
            </p>
          )}
        </div>

        <form className="create-form card" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Título */}
          <div className="form-field">
            <label className="form-label" htmlFor="chart-title">
              Título <span className="required">*</span>
            </label>
            <input
              id="chart-title"
              type="text"
              className="form-input"
              placeholder="Ex: Vendas por Mês — 2024"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Contexto */}
          <div className="form-field">
            <label className="form-label" htmlFor="chart-desc">
              Contexto / Instruções para a IA
            </label>
            <textarea
              id="chart-desc"
              className="form-textarea"
              placeholder="Ex: Mostre a evolução mensal. Destaque o pico de vendas de calças em junho..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
            />
            <span className="form-hint">
              Descreva o que analisar. Você pode usar somente texto, somente arquivo, ou os dois juntos.
            </span>
          </div>

          {/* Upload */}
          <div className="form-field">
            <label className="form-label">
              Planilha <span className="form-hint-inline">(.xlsx, .xls ou .csv)</span>
            </label>
            <div
              className={`file-drop ${file ? 'file-drop-active' : ''}`}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="file-hidden"
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <div className="file-selected">
                  <span className="file-icon">📄</span>
                  <div>
                    <strong>{file.name}</strong>
                    <span>{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button
                    type="button"
                    className="file-remove"
                    onClick={e => { e.stopPropagation(); setFile(null) }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="file-placeholder">
                  <span className="file-icon">📁</span>
                  <span>Clique para selecionar ou arraste aqui</span>
                  <span className="form-hint">Opcional — pode usar só texto</span>
                </div>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading
                ? <><span className="spinner" /> Gerando...</>
                : 'Gerar Gráficos'}
            </button>
          </div>
        </form>
      </aside>

      {/* ── Coluna Direita: Múltiplas Visões ── */}
      <section className="new-chart-gallery-col">
        <div className="gallery-header">
          <h2 className="section-title">Variações geradas</h2>
          {latestChart && <span className="gallery-count">4 opções</span>}
        </div>

        {!latestChart ? (
          <div className="gallery-empty">
            <span>📊</span>
            <p>Seus gráficos aparecerão aqui.<br/>Preencha o formulário e clique em gerar.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            <ChartCard item={latestChart} forceType="bar" />
            <ChartCard item={latestChart} forceType="line" />
            <ChartCard item={latestChart} forceType="pie" />
            <ChartCard item={latestChart} forceType="radar" />
          </div>
        )}
      </section>
    </div>
  )
}
