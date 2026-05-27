export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export interface ChartDataPoint {
  id: number
  chartId: number
  label: string
  value: string
}

export interface ChartItem {
  id: number
  title: string
  description: string
  createdAt: string
  data: ChartDataPoint[]
}

export async function getCharts(): Promise<ChartItem[]> {
  const res = await fetch(`${API_URL}/api/chart`)
  if (!res.ok) throw new Error('Erro ao buscar gráficos')
  return res.json()
}

export async function getChartById(id: number): Promise<ChartItem> {
  const res = await fetch(`${API_URL}/api/chart/${id}`)
  if (!res.ok) throw new Error(`Gráfico ${id} não encontrado`)
  return res.json()
}

export async function createChart(formData: FormData): Promise<ChartItem> {
  const res = await fetch(`${API_URL}/api/chart`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error('Erro ao criar gráfico')
  return res.json()
}

export async function deleteChart(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/api/chart/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Erro ao excluir gráfico ${id}`)
}
