import {
  ArrowDownRight, ArrowUpRight, Banknote, BarChart3, ChevronRight, CircleAlert,
  Ellipsis, PackageCheck, Plus, ReceiptText, ShoppingBag, ShoppingCart, Sparkles,
  TrendingUp, Truck, Wallet, X
} from 'lucide-react'

const kpis = [
  { label: "Today's sales", value: '$24,680', change: '+12.8%', trend: 'up', icon: ShoppingCart, tone: 'teal', detail: 'vs. $21,890 yesterday' },
  { label: "Today's purchases", value: '$8,420', change: '+4.2%', trend: 'up', icon: ShoppingBag, tone: 'blue', detail: 'vs. $8,080 yesterday' },
  { label: 'Receivables', value: '$184,260', change: '-2.4%', trend: 'down', icon: Wallet, tone: 'amber', detail: 'from 128 customers' },
  { label: 'Payables', value: '$96,840', change: '+6.1%', trend: 'up', icon: Banknote, tone: 'violet', detail: 'to 42 suppliers' },
]

const transactions = [
  { id: 'SAL-00241', type: 'Sale', party: 'Atlas Trading Co.', date: 'Today, 11:42 AM', amount: '$4,280.00', status: 'Posted', tone: 'success', icon: ShoppingCart },
  { id: 'PUR-00119', type: 'Purchase', party: 'Global Foods Ltd.', date: 'Today, 10:16 AM', amount: '$2,650.00', status: 'Pending', tone: 'warning', icon: ShoppingBag },
  { id: 'RCT-00482', type: 'Receipt', party: 'Metro Wholesale', date: 'Today, 09:48 AM', amount: '$8,900.00', status: 'Posted', tone: 'success', icon: ReceiptText },
  { id: 'TRF-00076', type: 'Transfer', party: 'North Warehouse', date: 'Yesterday, 04:32 PM', amount: '1,240 units', status: 'In transit', tone: 'info', icon: Truck },
  { id: 'PAY-00318', type: 'Payment', party: 'Rapid Logistics', date: 'Yesterday, 02:15 PM', amount: '$1,240.00', status: 'Posted', tone: 'success', icon: Banknote },
]

const bars = [42, 56, 48, 68, 54, 75, 63, 82, 71, 88, 78, 94]

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div><p className="eyebrow">Wednesday, October 2, 2026</p><h1>Good morning, Alex</h1><p className="page-subtitle">Here&apos;s what&apos;s happening across Main Branch today.</p></div>
        <div className="page-actions"><button className="button button-secondary"><BarChart3 data-icon="inline-start" /> View reports</button><button className="button button-primary"><Plus data-icon="inline-start" /> New transaction <ChevronRight data-icon="inline-end" /></button></div>
      </div>

      <section className="kpi-grid" aria-label="Key business metrics">
        {kpis.map(kpi => { const Icon = kpi.icon; return <article className="kpi-card" key={kpi.label}><div className="kpi-top"><div className={`metric-icon metric-${kpi.tone}`}><Icon data-icon="inline-start" /></div><button className="more-button" aria-label={`More options for ${kpi.label}`}><Ellipsis data-icon="inline-start" /></button></div><div className="kpi-label">{kpi.label}</div><div className="kpi-value">{kpi.value}</div><div className="kpi-foot"><span className={`trend trend-${kpi.trend}`}>{kpi.trend === 'up' ? <ArrowUpRight data-icon="inline-start" /> : <ArrowDownRight data-icon="inline-start" />}{kpi.change}</span><span>{kpi.detail}</span></div></article> })}
      </section>

      <div className="dashboard-grid">
        <section className="panel sales-panel"><div className="panel-header"><div><h2>Sales overview</h2><p>Revenue performance for the last 12 months</p></div><div className="panel-controls"><button className="select-button">Last 12 months <ChevronRight data-icon="inline-end" /></button></div></div><div className="chart-legend"><span><i className="legend-dot legend-teal" /> Revenue</span><span><i className="legend-dot legend-slate" /> Expenses</span></div><div className="bar-chart" aria-label="Sales revenue chart">{bars.map((height, index) => <div className="bar-column" key={index}><div className="bar-group"><span className="bar revenue-bar" style={{ height: `${height}%` }} /><span className="bar expense-bar" style={{ height: `${Math.max(24, height - 30)}%` }} /></div><span className="bar-label">{['Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct'][index]}</span></div>)}</div><div className="chart-summary"><div><span>Total revenue</span><strong>$284,640.00</strong></div><div><span>Average monthly</span><strong>$23,720.00</strong></div><div><span>Growth rate</span><strong className="positive-text">+18.4%</strong></div></div></section>
        <section className="panel alerts-panel"><div className="panel-header"><div><h2>Business alerts</h2><p>Items that need your attention</p></div><button className="text-button">View all <ChevronRight data-icon="inline-end" /></button></div><div className="alerts-list"><Alert icon={CircleAlert} tone="danger" title="Low stock alert" description="12 products are below reorder level" action="Review stock" /><Alert icon={ReceiptText} tone="warning" title="5 payments due" description="Supplier payments due this week" action="View payables" /><Alert icon={Truck} tone="info" title="3 shipments in transit" description="Expected delivery by October 4" action="Track shipments" /></div><div className="alert-footer"><Sparkles data-icon="inline-start" /> <span>Everything else looks good</span><X data-icon="inline-end" /></div></section>
      </div>

      <section className="panel quick-actions-panel"><div className="panel-header"><div><h2>Quick actions</h2><p>Common tasks to keep business moving</p></div></div><div className="quick-actions">{[[Plus,'New sale','Create a sales order','teal'],[ShoppingBag,'New purchase','Record incoming stock','blue'],[ReceiptText,'Receive payment','Record a customer receipt','amber'],[Wallet,'Make payment','Pay a supplier or expense','violet'],[PackageCheck,'Stock transfer','Move items between warehouses','slate']].map(([Icon,title,description,tone]) => <button className="quick-action" key={title}><span className={`quick-icon metric-${tone}`}><Icon data-icon="inline-start" /></span><span><strong>{title}</strong><small>{description}</small></span><ChevronRight className="quick-arrow" data-icon="inline-end" /></button>)}</div></section>

      <section className="panel transactions-panel"><div className="panel-header"><div><h2>Recent transactions</h2><p>Latest activity across your business</p></div><button className="text-button">View all transactions <ChevronRight data-icon="inline-end" /></button></div><div className="table-wrap"><table><thead><tr><th>Reference</th><th>Type</th><th>Party</th><th>Date</th><th>Amount</th><th>Status</th><th aria-label="Actions" /></tr></thead><tbody>{transactions.map(transaction => { const Icon = transaction.icon; return <tr key={transaction.id}><td><div className="reference-cell"><span className="table-icon"><Icon data-icon="inline-start" /></span><strong>{transaction.id}</strong></div></td><td>{transaction.type}</td><td className="party-cell">{transaction.party}</td><td className="muted-cell">{transaction.date}</td><td className="amount-cell">{transaction.amount}</td><td><span className={`status-badge status-${transaction.tone}`}><i />{transaction.status}</span></td><td><button className="more-button" aria-label={`More options for ${transaction.id}`}><Ellipsis data-icon="inline-start" /></button></td></tr> })}</tbody></table></div></section>
    </div>
  )
}

function Alert({ icon: Icon, tone, title, description, action }) { return <div className="alert-item"><span className={`alert-icon alert-${tone}`}><Icon data-icon="inline-start" /></span><div className="alert-content"><strong>{title}</strong><span>{description}</span></div><button className="alert-action">{action}<ChevronRight data-icon="inline-end" /></button></div> }
