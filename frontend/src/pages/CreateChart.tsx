import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createChart } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function CreateChart() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

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
      await createChart(formData)
      navigate('/')
    } catch (err) {
      setError('Erro ao criar gráfico. Verifique se a API está rodando e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page page-narrow">
      <div className="create-header">
        <h1 className="page-title">Novo Gráfico</h1>
        <p className="page-subtitle">
          {user
            ? `Criando como ${user.user_metadata?.full_name || user.email}`
            : 'Você está criando como visitante'}
        </p>
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
            Título do Gráfico <span className="required">*</span>
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

        {/* Contexto em texto */}
        <div className="form-field">
          <label className="form-label" htmlFor="chart-desc">
            Contexto / Instruções para a IA
          </label>
          <textarea
            id="chart-desc"
            className="form-textarea"
            placeholder="Ex: Mostre a evolução de vendas mensais de cada produto. Foque em crescimento percentual e destaque o melhor mês..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={5}
          />
          <span className="form-hint">
            Descreva o que a IA deve analisar e como exibir os dados. Quanto mais detalhe, melhor o resultado.
          </span>
        </div>

        {/* Upload Excel */}
        <div className="form-field">
          <label className="form-label">
            Planilha de Dados <span className="form-hint-inline">(opcional se usar apenas texto)</span>
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
                <span>Clique para selecionar ou arraste o arquivo aqui</span>
                <span className="form-hint">.xlsx, .xls ou .csv</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate('/')}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Gerando...</>
            ) : (
              'Gerar Gráficos'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
