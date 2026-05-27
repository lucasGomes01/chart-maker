import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Pie, Radar } from 'react-chartjs-2'
import type { ChartItem } from '../../lib/api'
import { useTheme } from '../../context/ThemeContext'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
)

const PALETTE = [
  'rgba(99,102,241,0.75)',
  'rgba(168,85,247,0.75)',
  'rgba(236,72,153,0.75)',
  'rgba(249,115,22,0.75)',
  'rgba(16,185,129,0.75)',
  'rgba(59,130,246,0.75)',
  'rgba(245,158,11,0.75)',
  'rgba(239,68,68,0.75)',
]

const BORDER = PALETTE.map(c => c.replace('0.75', '1'))

// Removidas configurações estáticas para serem criadas dentro do componente com as cores do tema
function detectChartType(description: string): 'bar' | 'line' | 'pie' | 'radar' {
  const lower = description.toLowerCase()
  if (lower.includes('"type":"line"') || lower.includes("'type':'line'")) return 'line'
  if (lower.includes('"type":"pie"') || lower.includes("'type':'pie'")) return 'pie'
  if (lower.includes('"type":"radar"') || lower.includes("'type':'radar'")) return 'radar'
  return 'bar'
}

function buildChartData(item: ChartItem) {
  // 1) Tenta parsear JSON do campo description (retorno da IA)
  try {
    const raw = item.description
    const jsonStart = raw.indexOf('{')
    const jsonEnd = raw.lastIndexOf('}')
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1))
      if (parsed.labels && parsed.datasets) return { parsed, type: detectChartType(raw) as string }
    }
  } catch (_) { /* ignora */ }

  // 2) Fallback: usa os ChartData do banco (label + value)
  const labels = item.data.map(d => d.label)
  const values = item.data.map(d => parseFloat(d.value) || 0)

  return {
    parsed: {
      labels,
      datasets: [{
        label: item.title,
        data: values,
        backgroundColor: PALETTE.slice(0, values.length),
        borderColor: BORDER.slice(0, values.length),
        borderWidth: 2,
        borderRadius: 6,
        tension: 0.35,
      }],
    },
    type: 'bar',
  }
}

interface ChartCardProps {
  item: ChartItem
  /** Se true, exibe em tamanho maior (página de detalhes) */
  expanded?: boolean
  /** Força a exibição de um tipo de gráfico específico */
  forceType?: 'bar' | 'line' | 'pie' | 'radar'
}

export function ChartCard({ item, expanded = false, forceType }: ChartCardProps) {
  const { theme } = useTheme()
  const dataParsed = buildChartData(item)
  const type = forceType || dataParsed.type
  const parsed = dataParsed.parsed
  const height = expanded ? 400 : 240

  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280'
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#e5e7eb'

  const BASE_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: textColor, font: { family: 'Inter', size: 11 } },
      },
      title: { display: false },
    },
  }

  const AXIS_OPTIONS = {
    ...BASE_OPTIONS,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 } },
      },
    },
  }

  const RADAR_OPTIONS = {
    ...BASE_OPTIONS,
    scales: {
      r: {
        grid: { color: gridColor },
        angleLines: { color: gridColor },
        ticks: { color: textColor, backdropColor: 'transparent' },
        pointLabels: { color: textColor, font: { size: 11 } },
      }
    }
  }

  const renderChart = () => {
    switch (type) {
      case 'line':  return <Line data={parsed} options={AXIS_OPTIONS} />
      case 'pie':   return <Pie data={parsed} options={BASE_OPTIONS} />
      case 'radar': return <Radar data={parsed} options={RADAR_OPTIONS} />
      default:      return <Bar data={parsed} options={AXIS_OPTIONS} />
    }
  }

  return (
    <div className={`chart-card ${expanded ? 'chart-card-expanded' : ''}`}>
      <div className="chart-card-header">
        <div>
          <h3 className="chart-card-title">{item.title}</h3>
          <time className="chart-card-date" dateTime={item.createdAt}>
            {new Date(item.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </time>
        </div>
        <span className="chart-type-badge">{type}</span>
      </div>
      <div className="chart-canvas-wrapper" style={{ height }}>
        {renderChart()}
      </div>
    </div>
  )
}
