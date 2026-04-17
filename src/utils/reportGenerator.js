// CanHoa v3 Report Generator — Full PDF + Excel with Date Range Support
import {
  COMMUNITY, FINANCIAL_SUMMARY, MONTHLY_COLLECTIONS,
  EXPENSE_CATEGORIES, DELINQUENCY_AGING, RESIDENTS,
  PAYMENT_HISTORY, MAINTENANCE_REQUESTS, VIOLATIONS,
  VENDORS, JOURNAL_ENTRIES, CHART_OF_ACCOUNTS
} from '../data/mockData.js'

// ── HELPERS ──────────────────────────────────────────
const fmt = (n) => `$${(n||0).toLocaleString()}`
const pct = (n, d) => d > 0 ? `${Math.round((n/d)*100)}%` : '0%'
const ds = () => new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
const yr = () => new Date().getFullYear()

function filterByDateRange(items, dateField, from, to) {
  if (!from && !to) return items
  return items.filter(item => {
    const d = new Date(item[dateField])
    if (from && d < new Date(from)) return false
    if (to && d > new Date(to)) return false
    return true
  })
}

function filteredCollections(from, to) {
  return MONTHLY_COLLECTIONS.filter(m => {
    if (!from && !to) return true
    const d = new Date(`${m.year}-${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m.month)+1}-01`)
    if (from && d < new Date(from)) return false
    if (to && d > new Date(to)) return false
    return true
  })
}

// ── PDF GENERATION ────────────────────────────────────
export async function generatePDF(reportType, dateRange = {}) {
  try {
    const { jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'letter' })
    const W = doc.internal.pageSize.getWidth()
    const H = doc.internal.pageSize.getHeight()
    const { from, to } = dateRange
    const periodLabel = from && to ? `${from} to ${to}` : `FY ${yr()}`

    const drawHeader = (title, sub='') => {
      doc.setFillColor(22,101,52); doc.rect(0,0,W,30,'F')
      doc.setFillColor(16,163,74); doc.rect(0,28,W,2,'F')
      doc.setFont('helvetica','bold'); doc.setFontSize(16); doc.setTextColor(255,255,255)
      doc.text('CanHoa', 14, 13)
      doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(134,239,172)
      doc.text('HOA Management Platform', 14, 19)
      doc.setFontSize(12); doc.setFont('helvetica','bold'); doc.setTextColor(255,255,255)
      doc.text(title, W-14, 12, {align:'right'})
      doc.setFontSize(8); doc.setFont('helvetica','normal'); doc.setTextColor(187,247,208)
      doc.text(sub || periodLabel, W-14, 19, {align:'right'})
      doc.setFillColor(240,253,244); doc.rect(0,30,W,12,'F')
      doc.setFontSize(8.5); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text(COMMUNITY.name, 14, 38)
      doc.setFont('helvetica','normal'); doc.setTextColor(75,122,94)
      doc.text(`${COMMUNITY.address} | ${COMMUNITY.totalUnits} Units | EIN: ${COMMUNITY.ein}`, 14, 43)
      return 52
    }

    const drawFooter = (page, total) => {
      doc.setFillColor(248,255,254); doc.rect(0,H-12,W,12,'F')
      doc.setFillColor(22,163,74); doc.rect(0,H-12,W,0.5,'F')
      doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(75,122,94)
      doc.text(`CanHoa Confidential | ${COMMUNITY.name} | Generated ${ds()}`, 14, H-4)
      doc.text(`Page ${page} of ${total}`, W-14, H-4, {align:'right'})
    }

    const drawKPIs = (y, items) => {
      const bw = (W-28-(items.length-1)*4)/items.length
      items.forEach((it,i)=>{
        const x = 14+i*(bw+4)
        doc.setFillColor(240,253,244); doc.roundedRect(x,y,bw,20,2,2,'F')
        doc.setDrawColor(187,247,208); doc.roundedRect(x,y,bw,20,2,2,'S')
        doc.setFontSize(13); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
        doc.text(String(it.value), x+bw/2, y+9, {align:'center'})
        doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(75,122,94)
        doc.text(it.label, x+bw/2, y+16, {align:'center'})
      })
      return y+25
    }

    const TS = {
      theme:'grid',
      headStyles:{fillColor:[22,101,52],textColor:255,fontStyle:'bold',fontSize:8.5},
      bodyStyles:{fontSize:8,textColor:[15,31,20]},
      alternateRowStyles:{fillColor:[240,253,244]},
      footStyles:{fillColor:[22,101,52],textColor:255,fontStyle:'bold',fontSize:8.5},
      margin:{left:14,right:14},
      styles:{cellPadding:2.8}
    }

    let y, fn

    const cols = filteredCollections(from, to)
    const totalIncome = cols.reduce((s,m)=>s+m.collected,0)
    const totalExpenses = cols.reduce((s,m)=>s+m.expenses,0)
    const netIncome = totalIncome - totalExpenses
    const payments = filterByDateRange(PAYMENT_HISTORY, 'date', from, to)
    const maint = filterByDateRange(MAINTENANCE_REQUESTS, 'created', from, to)
    const viols = filterByDateRange(VIOLATIONS, 'created', from, to)

    // ── INCOME STATEMENT ──
    if (reportType === 'income') {
      y = drawHeader('Income Statement (P&L)', periodLabel)
      y = drawKPIs(y, [
        {value:fmt(totalIncome), label:'Total Income'},
        {value:fmt(totalExpenses), label:'Total Expenses'},
        {value:fmt(netIncome), label:'Net Income'},
        {value:pct(netIncome,totalIncome), label:'Net Margin'},
      ])
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Monthly Revenue Summary', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Month','Year','Collected','Target','Variance','Rate']],
        body:cols.map(m=>[m.month,m.year,fmt(m.collected),fmt(m.target),
          `${m.collected>=m.target?'+':''}${fmt(m.collected-m.target)}`,
          pct(m.collected,m.target)]),
        foot:[['TOTAL','',fmt(totalIncome),fmt(cols.reduce((s,m)=>s+m.target,0)),'',
          pct(totalIncome,cols.reduce((s,m)=>s+m.target,0))]]
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Expense Breakdown by Category', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Category','Monthly Budget','MTD Actual','YTD Budget','YTD Actual','Status']],
        body:EXPENSE_CATEGORIES.map(c=>[c.name,fmt(c.budget),fmt(c.amount),fmt(c.ytdBudget),fmt(c.ytd),
          c.ytd>c.ytdBudget?'OVER':'On Track']),
        foot:[['TOTAL',
          fmt(EXPENSE_CATEGORIES.reduce((s,c)=>s+c.budget,0)),
          fmt(EXPENSE_CATEGORIES.reduce((s,c)=>s+c.amount,0)),
          fmt(EXPENSE_CATEGORIES.reduce((s,c)=>s+c.ytdBudget,0)),
          fmt(EXPENSE_CATEGORIES.reduce((s,c)=>s+c.ytd,0)),'']]
      })
      drawFooter(1,1)
      fn = `CanHoa_Income_Statement_${periodLabel.replace(/\s/g,'_')}.pdf`
    }

    // ── BALANCE SHEET ──
    else if (reportType === 'balance') {
      y = drawHeader('Balance Sheet', `As of ${ds()}`)
      y = drawKPIs(y, [
        {value:fmt(FINANCIAL_SUMMARY.operatingBalance+FINANCIAL_SUMMARY.reserveBalance+FINANCIAL_SUMMARY.totalUnpaid+3200), label:'Total Assets'},
        {value:fmt(FINANCIAL_SUMMARY.operatingBalance), label:'Operating Fund'},
        {value:fmt(FINANCIAL_SUMMARY.reserveBalance), label:'Reserve Fund'},
        {value:'62%', label:'Reserve Funded'},
      ])
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('ASSETS', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Account Code','Account Name','Type','Balance']],
        body:CHART_OF_ACCOUNTS.filter(a=>a.type==='Asset').map(a=>[a.code,a.name,a.type,fmt(a.balance)]),
        foot:[['','TOTAL ASSETS','',fmt(CHART_OF_ACCOUNTS.filter(a=>a.type==='Asset').reduce((s,a)=>s+a.balance,0))]]
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('LIABILITIES & EQUITY', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Account Code','Account Name','Type','Balance']],
        body:CHART_OF_ACCOUNTS.filter(a=>['Liability','Equity'].includes(a.type)).map(a=>[a.code,a.name,a.type,fmt(a.balance)]),
        foot:[['','TOTAL LIABILITIES & EQUITY','',fmt(CHART_OF_ACCOUNTS.filter(a=>['Liability','Equity'].includes(a.type)).reduce((s,a)=>s+a.balance,0))]]
      })
      drawFooter(1,1)
      fn = `CanHoa_Balance_Sheet_${yr()}.pdf`
    }

    // ── CASH FLOW ──
    else if (reportType === 'cashflow') {
      y = drawHeader('Cash Flow Statement', periodLabel)
      y = drawKPIs(y, [
        {value:fmt(totalIncome), label:'Total Inflows'},
        {value:fmt(totalExpenses), label:'Total Outflows'},
        {value:fmt(netIncome), label:'Net Cash Flow'},
        {value:fmt(FINANCIAL_SUMMARY.operatingBalance), label:'Ending Balance'},
      ])
      let cumulative = 0
      autoTable(doc, {...TS, startY:y,
        head:[['Month','Inflows','Outflows','Net Flow','Cumulative']],
        body:cols.map(m=>{
          const net=m.collected-m.expenses; cumulative+=net
          return [m.month+' '+m.year, fmt(m.collected), fmt(m.expenses), fmt(net), fmt(cumulative)]
        }),
        foot:[['TOTAL',fmt(totalIncome),fmt(totalExpenses),fmt(netIncome),'']]
      })
      drawFooter(1,1)
      fn = `CanHoa_Cash_Flow_${periodLabel.replace(/\s/g,'_')}.pdf`
    }

    // ── AR AGING ──
    else if (reportType === 'aging') {
      y = drawHeader('Accounts Receivable Aging', ds())
      y = drawKPIs(y, [
        {value:fmt(FINANCIAL_SUMMARY.totalUnpaid), label:'Total Overdue'},
        {value:`${FINANCIAL_SUMMARY.delinquentUnits}`, label:'Delinquent Units'},
        {value:`${FINANCIAL_SUMMARY.collectionRate}%`, label:'Collection Rate'},
        {value:fmt(COMMUNITY.monthlyDues), label:'Monthly Dues'},
      ])
      autoTable(doc, {...TS, startY:y,
        head:[['Aging Bucket','Units','Amount','% of Total','Risk Level']],
        body:DELINQUENCY_AGING.map(r=>[r.bucket,r.units,fmt(r.amount),`${r.pct}%`,
          r.bucket==='Current'?'Low':r.bucket==='1-30 days'?'Medium':'HIGH']),
        foot:[['TOTAL',DELINQUENCY_AGING.reduce((s,r)=>s+r.units,0),
          fmt(DELINQUENCY_AGING.reduce((s,r)=>s+r.amount,0)),'100%','']]
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Delinquent Account Detail — Recommended Actions', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Unit','Resident','Balance','Days Overdue','Autopay','Action Required']],
        body:RESIDENTS.filter(r=>r.status==='delinquent').map(r=>[
          r.unit,r.name,fmt(r.balance),`${r.daysOverdue||0}`,r.autopay?'Yes':'No',
          (r.daysOverdue||0)>90?'Lien Filing':(r.daysOverdue||0)>60?'Collections Agency':(r.daysOverdue||0)>30?'2nd Certified Notice':'1st Notice'
        ])
      })
      // FDCPA Notice
      y = doc.lastAutoTable.finalY+6
      doc.setFillColor(254,252,232); doc.setDrawColor(253,224,71)
      doc.roundedRect(14,y,W-28,14,2,2,'FD')
      doc.setFontSize(7.5); doc.setFont('helvetica','bold'); doc.setTextColor(133,77,14)
      doc.text('FDCPA Notice (15 U.S.C. § 1692): ', 18, y+6)
      doc.setFont('helvetica','normal')
      doc.text('All collection actions must comply with the Fair Debt Collection Practices Act. This report is for internal management use only.', 18, y+11)
      drawFooter(1,1)
      fn = `CanHoa_AR_Aging_${yr()}.pdf`
    }

    // ── DELINQUENCY ──
    else if (reportType === 'delinquency') {
      y = drawHeader('Delinquency Report', ds())
      y = drawKPIs(y, [
        {value:`${RESIDENTS.filter(r=>r.status==='delinquent').length}`, label:'Delinquent Units'},
        {value:fmt(FINANCIAL_SUMMARY.totalUnpaid), label:'Total Overdue'},
        {value:`${FINANCIAL_SUMMARY.collectionRate}%`, label:'Collection Rate'},
        {value:`${RESIDENTS.filter(r=>r.autopay).length}`, label:'On Autopay'},
      ])
      autoTable(doc, {...TS, startY:y,
        head:[['Unit','Resident','Email','Phone','Balance','Days Overdue','Autopay','Next Step']],
        body:RESIDENTS.filter(r=>r.status==='delinquent').map(r=>[
          r.unit,r.name,r.email,r.phone,fmt(r.balance),`${r.daysOverdue||0}`,r.autopay?'Yes':'No',
          (r.daysOverdue||0)>90?'Lien':(r.daysOverdue||0)>60?'Collections':(r.daysOverdue||0)>30?'Certified Mail':'Email Notice'
        ])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFillColor(254,242,242); doc.setDrawColor(252,165,165)
      doc.roundedRect(14,y,W-28,18,2,2,'FD')
      doc.setFontSize(7.5); doc.setFont('helvetica','bold'); doc.setTextColor(153,27,27)
      doc.text('Legal Compliance Notice:', 18, y+6)
      doc.setFont('helvetica','normal')
      doc.text('Fair Housing Act (42 U.S.C. § 3601): Enforcement must be applied consistently without regard to race, color, national origin,', 18, y+11)
      doc.text('religion, sex, familial status, or disability. FDCPA compliance required for all collection communications.', 18, y+15)
      drawFooter(1,1)
      fn = `CanHoa_Delinquency_${yr()}.pdf`
    }

    // ── BUDGET vs ACTUAL ──
    else if (reportType === 'budget') {
      y = drawHeader('Budget vs. Actual Report', periodLabel)
      const tb=EXPENSE_CATEGORIES.reduce((s,c)=>s+c.ytdBudget,0)
      const ta=EXPENSE_CATEGORIES.reduce((s,c)=>s+c.ytd,0)
      y = drawKPIs(y, [
        {value:fmt(tb), label:'YTD Budget'},
        {value:fmt(ta), label:'YTD Actual'},
        {value:fmt(tb-ta), label:'Remaining'},
        {value:pct(ta,tb), label:'Budget Used'},
      ])
      autoTable(doc, {...TS, startY:y,
        head:[['Category','Monthly Budget','MTD Actual','YTD Budget','YTD Actual','Variance','Status']],
        body:EXPENSE_CATEGORIES.map(c=>[
          c.name,fmt(c.budget),fmt(c.amount),fmt(c.ytdBudget),fmt(c.ytd),
          `${c.ytd>c.ytdBudget?'-':'+'}${fmt(Math.abs(c.ytdBudget-c.ytd))}`,
          c.ytd>c.ytdBudget?'OVER BUDGET':'On Track'
        ]),
        foot:[['TOTAL',fmt(EXPENSE_CATEGORIES.reduce((s,c)=>s+c.budget,0)),
          fmt(EXPENSE_CATEGORIES.reduce((s,c)=>s+c.amount,0)),
          fmt(tb),fmt(ta),fmt(tb-ta),pct(ta,tb)]]
      })
      drawFooter(1,1)
      fn = `CanHoa_Budget_vs_Actual_${periodLabel.replace(/\s/g,'_')}.pdf`
    }

    // ── RESERVE FUND ──
    else if (reportType === 'reserve') {
      y = drawHeader('Reserve Fund Analysis', `As of ${ds()}`)
      y = drawKPIs(y, [
        {value:fmt(FINANCIAL_SUMMARY.reserveBalance), label:'Current Balance'},
        {value:'62%', label:'Funded %'},
        {value:fmt(COMMUNITY.reserveTarget), label:'Full Funding Target'},
        {value:'$1,100/mo', label:'Monthly Contribution'},
      ])
      autoTable(doc, {...TS, startY:y,
        head:[['Component','Useful Life','Remaining Life','Replacement Cost','Reserve Required','% Funded','Status']],
        body:[
          ['Roofing','25 yrs','8 yrs','$180,000','$57,600','62%','Funded'],
          ['HVAC Systems','15 yrs','4 yrs','$45,000','$12,000','38%','UNDERFUNDED'],
          ['Pool Equipment','10 yrs','3 yrs','$28,000','$8,400','75%','Funded'],
          ['Parking Lot','20 yrs','12 yrs','$65,000','$39,000','82%','Funded'],
          ['Elevator','25 yrs','15 yrs','$85,000','$51,000','70%','Funded'],
          ['Landscaping Equip.','8 yrs','2 yrs','$12,000','$3,000','55%','On Track'],
          ['Common Area Fixtures','10 yrs','5 yrs','$22,000','$11,000','68%','Funded'],
        ],
        foot:[['TOTAL COMPONENTS','','','$437,000','$182,000','62%','']]
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFillColor(240,253,244); doc.setDrawColor(187,247,208)
      doc.roundedRect(14,y,W-28,14,2,2,'FD')
      doc.setFontSize(7.5); doc.setFont('helvetica','normal'); doc.setTextColor(22,101,52)
      doc.text('Reserve Study Note: Texas Property Code § 209.006 requires HOAs to maintain adequate reserves. A professional reserve study', 18, y+6)
      doc.text(`is recommended every 3 years. Next recommended study: ${yr()+1}. Current funding shortfall: ${fmt(COMMUNITY.reserveTarget - FINANCIAL_SUMMARY.reserveBalance)}.`, 18, y+11)
      drawFooter(1,1)
      fn = `CanHoa_Reserve_Fund_${yr()}.pdf`
    }

    // ── GENERAL LEDGER ──
    else if (reportType === 'ledger') {
      y = drawHeader('General Ledger', periodLabel)
      y = drawKPIs(y, [
        {value:fmt(FINANCIAL_SUMMARY.operatingBalance), label:'Operating Balance'},
        {value:fmt(FINANCIAL_SUMMARY.reserveBalance), label:'Reserve Balance'},
        {value:fmt(FINANCIAL_SUMMARY.ytdCollected), label:'YTD Income'},
        {value:fmt(FINANCIAL_SUMMARY.ytdExpenses), label:'YTD Expenses'},
      ])
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Chart of Accounts — All Account Balances', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Code','Account Name','Type','Balance']],
        body:CHART_OF_ACCOUNTS.map(a=>[a.code,a.name,a.type,fmt(a.balance)])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Journal Entries', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Date','Memo','Debit Account','Credit Account','Amount','Posted By','Status']],
        body:JOURNAL_ENTRIES.map(je=>[je.date,je.memo,je.debit,je.credit,fmt(je.amount),je.createdBy,je.status])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Recent Payment Transactions', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Date','Unit','Resident','Type','Method','Amount','Status']],
        body:payments.slice(0,10).map(p=>[p.date,p.unit,p.resident,p.type,p.method,fmt(p.amount),p.status])
      })
      drawFooter(1,1)
      fn = `CanHoa_General_Ledger_${periodLabel.replace(/\s/g,'_')}.pdf`
    }

    // ── MAINTENANCE ──
    else if (reportType === 'maintenance') {
      y = drawHeader('Maintenance & Work Orders', periodLabel)
      y = drawKPIs(y, [
        {value:`${maint.length}`, label:'Total Requests'},
        {value:`${maint.filter(r=>r.status==='New').length}`, label:'Open / New'},
        {value:`${maint.filter(r=>['Assigned','In Progress','Scheduled'].includes(r.status)).length}`, label:'In Progress'},
        {value:`${maint.filter(r=>r.status==='Resolved').length}`, label:'Resolved'},
      ])
      autoTable(doc, {...TS, startY:y,
        head:[['ID','Unit','Category','Title','Priority','Status','Vendor','Cost','Date']],
        body:maint.map(r=>[r.id,r.unit,r.category,r.title.slice(0,25),r.priority,r.status,r.assignedTo||'Unassigned',r.cost>0?fmt(r.cost):'TBD',r.created])
      })
      y = doc.lastAutoTable.finalY+6
      const totalCost = maint.reduce((s,r)=>s+r.cost,0)
      doc.setFillColor(240,253,244); doc.setDrawColor(187,247,208)
      doc.roundedRect(14,y,W-28,10,2,2,'FD')
      doc.setFontSize(8); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text(`Total Maintenance Cost (period): ${fmt(totalCost)} | Avg per Request: ${fmt(Math.round(totalCost/(maint.length||1)))} | Emergency Response SLA: 4 hours`, 18, y+6)
      drawFooter(1,1)
      fn = `CanHoa_Maintenance_${periodLabel.replace(/\s/g,'_')}.pdf`
    }

    // ── VIOLATIONS ──
    else if (reportType === 'violations') {
      y = drawHeader('Violation Compliance Report', periodLabel)
      y = drawKPIs(y, [
        {value:`${viols.length}`, label:'Total Violations'},
        {value:`${viols.filter(v=>v.status==='Open').length}`, label:'Open Cases'},
        {value:fmt(viols.reduce((s,v)=>s+v.fine,0)), label:'Fines Assessed'},
        {value:`${viols.filter(v=>v.status==='Resolved').length}`, label:'Resolved'},
      ])
      autoTable(doc, {...TS, startY:y,
        head:[['Unit','Resident','Type','Status','Fine','Notices Sent','Created','Due Date']],
        body:viols.map(v=>[v.unit,v.resident,v.type,v.status,fmt(v.fine),`${v.noticesSent}`,v.created,v.dueDate])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFillColor(254,252,232); doc.setDrawColor(253,224,71)
      doc.roundedRect(14,y,W-28,18,2,2,'FD')
      doc.setFontSize(7.5); doc.setFont('helvetica','bold'); doc.setTextColor(133,77,14)
      doc.text('Fair Housing Act Compliance Notice (42 U.S.C. § 3604):', 18, y+6)
      doc.setFont('helvetica','normal')
      doc.text('All CC&R enforcement must be applied consistently and without discrimination based on race, color, national origin, religion,', 18, y+11)
      doc.text('sex, familial status, or disability. This report is for internal compliance review. Retain for 7 years per record retention policy.', 18, y+15)
      drawFooter(1,1)
      fn = `CanHoa_Violations_${periodLabel.replace(/\s/g,'_')}.pdf`
    }

    // ── VENDOR / 1099 ──
    else if (reportType === 'vendor') {
      y = drawHeader('Vendor Expense & 1099 Report', `Tax Year ${yr()}`)
      y = drawKPIs(y, [
        {value:`${VENDORS.length}`, label:'Active Vendors'},
        {value:fmt(VENDORS.reduce((s,v)=>s+v.ytdPaid,0)), label:'Total YTD Paid'},
        {value:`${VENDORS.filter(v=>v.ytdPaid>=600).length}`, label:'Require 1099'},
        {value:`${VENDORS.filter(v=>!v.licensed).length}`, label:'License Issues'},
      ])
      autoTable(doc, {...TS, startY:y,
        head:[['Vendor','Category','Contact','YTD Paid','1099 Required','Licensed','Insured','Insurance Exp.']],
        body:VENDORS.map(v=>[v.name,v.category,v.contact,fmt(v.ytdPaid),v.ytdPaid>=600?'YES':'No',v.licensed?'Yes':'NO',v.insured?'Yes':'NO',v.insuranceExpiry])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFillColor(240,253,244); doc.setDrawColor(187,247,208)
      doc.roundedRect(14,y,W-28,14,2,2,'FD')
      doc.setFontSize(7.5); doc.setFont('helvetica','normal'); doc.setTextColor(22,101,52)
      doc.text('IRS 1099-NEC Requirement: Vendors paid $600 or more in a tax year must receive Form 1099-NEC by January 31 of the following year.', 18, y+6)
      doc.text('Failure to file may result in penalties of $50-$290 per form (IRC § 6721). Consult your CPA for e-filing via Tax1099 or similar service.', 18, y+11)
      drawFooter(1,1)
      fn = `CanHoa_Vendor_1099_Report_${yr()}.pdf`
    }

    // ── BANK RECONCILIATION ──
    else if (reportType === 'reconciliation') {
      y = drawHeader('Bank Reconciliation Report', `As of ${ds()}`)
      y = drawKPIs(y, [
        {value:fmt(FINANCIAL_SUMMARY.bookBalance), label:'Book Balance'},
        {value:fmt(FINANCIAL_SUMMARY.bankBalance), label:'Bank Balance'},
        {value:fmt(FINANCIAL_SUMMARY.reconciliationDiff), label:'Difference'},
        {value:FINANCIAL_SUMMARY.lastReconciled, label:'Last Reconciled'},
      ])
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Reconciliation Summary', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Item','Amount'],],
        body:[
          ['Ending Bank Balance (per statement)', fmt(FINANCIAL_SUMMARY.bankBalance)],
          ['Add: Outstanding Deposits (in-transit)', fmt(1240)],
          ['Less: Outstanding Checks', fmt(-420)],
          ['Adjusted Bank Balance', fmt(FINANCIAL_SUMMARY.bankBalance+1240-420)],
          ['',''],
          ['Book Balance (CanHoa ledger)', fmt(FINANCIAL_SUMMARY.bookBalance)],
          ['Add: Interest Earned', fmt(180)],
          ['Less: Bank Fees', fmt(-160)],
          ['Adjusted Book Balance', fmt(FINANCIAL_SUMMARY.bookBalance+180-160)],
          ['',''],
          ['Reconciliation Difference', fmt(FINANCIAL_SUMMARY.reconciliationDiff)],
        ]
      })
      drawFooter(1,1)
      fn = `CanHoa_Bank_Reconciliation_${yr()}.pdf`
    }

    // ── COLLECTION RATE ──
    else if (reportType === 'collection') {
      y = drawHeader('Collection Rate Report', periodLabel)
      y = drawKPIs(y, [
        {value:`${FINANCIAL_SUMMARY.collectionRate}%`, label:'Avg Collection Rate'},
        {value:`${FINANCIAL_SUMMARY.delinquentUnits}`, label:'Delinquent Units'},
        {value:fmt(FINANCIAL_SUMMARY.totalUnpaid), label:'Outstanding Balance'},
        {value:`${RESIDENTS.filter(r=>r.autopay).length}`, label:'On Autopay'},
      ])
      autoTable(doc, {...TS, startY:y,
        head:[['Month','Year','Collected','Target','Collection Rate','YoY Change']],
        body:cols.map((m,i)=>[m.month,m.year,fmt(m.collected),fmt(m.target),pct(m.collected,m.target),i>0?`${((m.collected/cols[i-1].collected-1)*100).toFixed(1)}%`:'—']),
        foot:[['AVG','',fmt(Math.round(totalIncome/cols.length)),fmt(Math.round(cols.reduce((s,m)=>s+m.target,0)/cols.length)),
          pct(totalIncome,cols.reduce((s,m)=>s+m.target,0)),'']]
      })
      drawFooter(1,1)
      fn = `CanHoa_Collection_Rate_${periodLabel.replace(/\s/g,'_')}.pdf`
    }

    // ── ANNUAL REPORT ──
    else if (reportType === 'annual') {
      y = drawHeader('Annual Community Report', `Fiscal Year ${yr()}`)
      const execText = `This Annual Report summarizes the financial performance and operational highlights of ${COMMUNITY.name} for fiscal year ${yr()}. The association manages ${COMMUNITY.totalUnits} residential units at ${COMMUNITY.address}.`
      const execLines = doc.splitTextToSize(execText, W-28)
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Executive Summary', 14, y); y+=4
      doc.setFont('helvetica','normal'); doc.setTextColor(75,122,94); doc.setFontSize(8.5)
      doc.text(execLines, 14, y); y += execLines.length*4.2+4
      y = drawKPIs(y, [
        {value:fmt(FINANCIAL_SUMMARY.ytdCollected), label:'Total Collections'},
        {value:`${FINANCIAL_SUMMARY.collectionRate}%`, label:'Collection Rate'},
        {value:fmt(FINANCIAL_SUMMARY.reserveBalance), label:'Reserve Balance'},
        {value:`${COMMUNITY.totalUnits}`, label:'Total Units'},
      ])
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Annual Financial Summary', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Category','Budget','Actual','Variance']],
        body:[
          ['Total Assessment Income',fmt(424080),fmt(FINANCIAL_SUMMARY.ytdCollected),`+${fmt(FINANCIAL_SUMMARY.ytdCollected-424080)}`],
          ['Total Operating Expenses',fmt(146160),fmt(FINANCIAL_SUMMARY.ytdExpenses),fmt(146160-FINANCIAL_SUMMARY.ytdExpenses)],
          ['Reserve Contributions',fmt(13200),fmt(13200),'$0'],
          ['Special Assessments',fmt(56700),fmt(56700),'$0'],
        ],
        foot:[['NET INCOME','',fmt(FINANCIAL_SUMMARY.ytdCollected-FINANCIAL_SUMMARY.ytdExpenses),'']]
      })
      doc.addPage()
      y = drawHeader('Annual Report — Operations & Compliance', `Fiscal Year ${yr()}`)
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Maintenance Summary by Category', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Category','Requests','Resolved','Avg Resolution','Total Cost']],
        body:[['Plumbing','12','11','2.3 days',fmt(4200)],['Electrical','5','5','1.1 days',fmt(3800)],['HVAC','8','6','3.2 days',fmt(6100)],['Landscaping','22','22','1.0 days',fmt(8400)],['Safety','4','4','0.5 days',fmt(1200)],['Other','16','13','2.8 days',fmt(5600)]],
        foot:[['TOTAL','67','61','1.9 days avg',fmt(29300)]]
      })
      y = doc.lastAutoTable.finalY+6
      autoTable(doc, {...TS, startY:y,
        head:[['Violation Type','Incidents','Resolved','Fines Collected']],
        body:[['Parking','18','16',fmt(1350)],['Noise','7','6',fmt(700)],['Landscaping','12','11',fmt(600)],['Modifications','5','5','$0'],['Other','8','7',fmt(400)]],
        foot:[['TOTAL','50','45',fmt(3050)]]
      })
      drawFooter(1,2); doc.setPage(1); drawFooter(1,2)
      fn = `CanHoa_Annual_Report_${yr()}.pdf`
    }

    // ── BOARD PACKET ──
    else if (reportType === 'board_packet') {
      y = drawHeader('Board Meeting Packet', ds())
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('FINANCIAL DASHBOARD', 14, y); y+=3
      y = drawKPIs(y, [
        {value:fmt(FINANCIAL_SUMMARY.mtdCollected), label:'MTD Collections'},
        {value:`${FINANCIAL_SUMMARY.collectionRate}%`, label:'Collection Rate'},
        {value:fmt(FINANCIAL_SUMMARY.reserveBalance), label:'Reserve Fund'},
        {value:`${FINANCIAL_SUMMARY.delinquentUnits}`, label:'Delinquent Units'},
      ])
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Monthly Collections (Last 4 Months)', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Month','Collected','Target','Rate']],
        body:MONTHLY_COLLECTIONS.slice(-4).map(m=>[m.month+' '+m.year,fmt(m.collected),fmt(m.target),pct(m.collected,m.target)])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Budget vs. Actual — Current Month', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Category','Budget','Actual','Status']],
        body:EXPENSE_CATEGORIES.map(c=>[c.name,fmt(c.budget),fmt(c.amount),c.amount>c.budget?'OVER':'OK'])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Delinquency Aging Summary', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['Bucket','Units','Amount']],
        body:DELINQUENCY_AGING.map(r=>[r.bucket,r.units,fmt(r.amount)])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Open Maintenance Requests (Action Required)', 14, y); y+=3
      autoTable(doc, {...TS, startY:y,
        head:[['ID','Unit','Title','Priority','Status']],
        body:MAINTENANCE_REQUESTS.filter(r=>r.status!=='Resolved').map(r=>[r.id,r.unit,r.title.slice(0,30),r.priority,r.status])
      })
      drawFooter(1,1)
      fn = `CanHoa_Board_Packet_${ds().replace(/,/g,'').replace(/ /g,'_')}.pdf`
    }

    doc.save(fn || `CanHoa_Report_${yr()}.pdf`)
    return true
  } catch(err) {
    console.error('PDF error:', err)
    throw err
  }
}

// ── EXCEL GENERATION ──────────────────────────────────
export async function generateExcel(reportType, dateRange = {}) {
  try {
    const XLSX = await import('xlsx')
    const wb = XLSX.utils.book_new()
    const { from, to } = dateRange
    const periodLabel = from && to ? `${from} to ${to}` : `FY ${yr()}`
    const cols = filteredCollections(from, to)
    const payments = filterByDateRange(PAYMENT_HISTORY, 'date', from, to)
    const maint = filterByDateRange(MAINTENANCE_REQUESTS, 'created', from, to)
    const viols = filterByDateRange(VIOLATIONS, 'created', from, to)
    const totalIncome = cols.reduce((s,m)=>s+m.collected,0)
    const totalExpenses = cols.reduce((s,m)=>s+m.expenses,0)

    const addSheet = (name, data, colWidths) => {
      const ws = XLSX.utils.aoa_to_sheet(data)
      if (colWidths) ws['!cols'] = colWidths.map(w=>({wch:w}))
      XLSX.utils.book_append_sheet(wb, ws, name)
      return ws
    }

    // Income Statement
    if (['income','annual','all'].includes(reportType)) {
      addSheet('Income Statement', [
        [`CanHoa — Income Statement | ${periodLabel}`,'','','',''],
        [`${COMMUNITY.name} | EIN: ${COMMUNITY.ein}`,'','',`Generated: ${ds()}`,''],
        ['','','','',''],
        ['MONTHLY REVENUE','','','',''],
        ['Month','Year','Collected ($)','Target ($)','Variance ($)','Collection %'],
        ...cols.map(m=>[m.month,m.year,m.collected,m.target,m.collected-m.target,`${Math.round((m.collected/m.target)*100)}%`]),
        ['TOTAL','',totalIncome,cols.reduce((s,m)=>s+m.target,0),'',''],
        ['','','','',''],
        ['EXPENSE BREAKDOWN BY CATEGORY','','','',''],
        ['Category','Monthly Budget ($)','MTD Actual ($)','YTD Budget ($)','YTD Actual ($)','Variance','Status'],
        ...EXPENSE_CATEGORIES.map(c=>[c.name,c.budget,c.amount,c.ytdBudget,c.ytd,c.ytdBudget-c.ytd,c.ytd>c.ytdBudget?'OVER':'On Track']),
        ['TOTAL',EXPENSE_CATEGORIES.reduce((s,c)=>s+c.budget,0),EXPENSE_CATEGORIES.reduce((s,c)=>s+c.amount,0),EXPENSE_CATEGORIES.reduce((s,c)=>s+c.ytdBudget,0),EXPENSE_CATEGORIES.reduce((s,c)=>s+c.ytd,0),'',''],
        ['','','','',''],
        ['NET INCOME','',totalIncome-totalExpenses,'','',''],
      ], [16,8,14,14,14,14])
    }

    // Balance Sheet
    if (['balance','annual','all'].includes(reportType)) {
      addSheet('Balance Sheet', [
        [`CanHoa — Balance Sheet | As of ${ds()}`,'',''],
        [`${COMMUNITY.name}`,'',`EIN: ${COMMUNITY.ein}`],
        ['','',''],
        ['Code','Account Name','Type','Balance ($)'],
        ...CHART_OF_ACCOUNTS.map(a=>[a.code,a.name,a.type,a.balance]),
        ['','','',''],
        ['TOTAL ASSETS','','',CHART_OF_ACCOUNTS.filter(a=>a.type==='Asset').reduce((s,a)=>s+a.balance,0)],
        ['TOTAL LIABILITIES + EQUITY','','',CHART_OF_ACCOUNTS.filter(a=>['Liability','Equity'].includes(a.type)).reduce((s,a)=>s+a.balance,0)],
      ], [8,24,12,14])
    }

    // Budget vs Actual
    if (['budget','annual','all'].includes(reportType)) {
      addSheet('Budget vs Actual', [
        [`CanHoa — Budget vs. Actual | ${periodLabel}`,'','','','',''],
        [`${COMMUNITY.name}`,'','','',`Generated: ${ds()}`,''],
        ['','','','','',''],
        ['Category','Monthly Budget ($)','MTD Actual ($)','YTD Budget ($)','YTD Actual ($)','Variance ($)','Status'],
        ...EXPENSE_CATEGORIES.map(c=>[c.name,c.budget,c.amount,c.ytdBudget,c.ytd,c.ytdBudget-c.ytd,c.ytd>c.ytdBudget?'OVER':'On Track']),
        ['TOTAL',EXPENSE_CATEGORIES.reduce((s,c)=>s+c.budget,0),EXPENSE_CATEGORIES.reduce((s,c)=>s+c.amount,0),EXPENSE_CATEGORIES.reduce((s,c)=>s+c.ytdBudget,0),EXPENSE_CATEGORIES.reduce((s,c)=>s+c.ytd,0),'',''],
      ], [22,16,14,14,14,14,14])
    }

    // AR Aging + Delinquency
    if (['aging','delinquency','annual','all'].includes(reportType)) {
      addSheet('AR Aging', [
        [`CanHoa — AR Aging | ${ds()}`,'','','',''],
        [`${COMMUNITY.name}`,'','',`Generated: ${ds()}`,''],
        ['','','','',''],
        ['Bucket','Units','Amount ($)','% of Total','Risk Level'],
        ...DELINQUENCY_AGING.map(r=>[r.bucket,r.units,r.amount,`${r.pct}%`,r.bucket==='Current'?'Low':r.bucket==='1-30 days'?'Medium':'HIGH']),
        ['','','','',''],
        ['DELINQUENT ACCOUNT DETAIL','','','',''],
        ['Unit','Resident Name','Email','Phone','Balance Due ($)','Days Overdue','Autopay','Recommended Action'],
        ...RESIDENTS.filter(r=>r.status==='delinquent').map(r=>[r.unit,r.name,r.email,r.phone,r.balance,r.daysOverdue||0,r.autopay?'Yes':'No',(r.daysOverdue||0)>90?'Lien Filing':(r.daysOverdue||0)>60?'Collections Agency':'Send Notice']),
      ], [14,22,28,16,14,14])
    }

    // Cash Flow
    if (['cashflow','annual','all'].includes(reportType)) {
      let cum = 0
      addSheet('Cash Flow', [
        [`CanHoa — Cash Flow | ${periodLabel}`,'','',''],
        [`${COMMUNITY.name}`,'',`Generated: ${ds()}`,''],
        ['','','',''],
        ['Month','Year','Inflows ($)','Outflows ($)','Net Flow ($)','Cumulative ($)'],
        ...cols.map(m=>{const net=m.collected-m.expenses; cum+=net; return [m.month,m.year,m.collected,m.expenses,net,cum]}),
        ['TOTAL','',totalIncome,totalExpenses,totalIncome-totalExpenses,''],
      ], [10,8,14,14,14,16])
    }

    // Transactions
    if (['transactions','annual','all'].includes(reportType)) {
      addSheet('Transactions', [
        [`CanHoa — Payment Transactions | ${periodLabel}`,'','','','','',''],
        [`${COMMUNITY.name}`,'','','','',`Generated: ${ds()}`,''],
        ['','','','','','',''],
        ['Date','Unit','Resident','Type','Method','Amount ($)','Status','Receipt #'],
        ...payments.map(p=>[p.date,p.unit,p.resident,p.type,p.method,p.amount,p.status,p.receipt||'']),
        ['TOTAL','','','','',payments.filter(p=>p.status==='Completed').reduce((s,p)=>s+p.amount,0),'',''],
      ], [12,8,20,18,10,12,12,18])
    }

    // Residents Directory
    if (['residents','annual','all'].includes(reportType)) {
      addSheet('Residents', [
        [`CanHoa — Resident Directory`,'','','','','',''],
        [`${COMMUNITY.name} | CONFIDENTIAL — CCPA Protected`,'','','','',`Generated: ${ds()}`,''],
        ['','','','','','',''],
        ['Unit','Name','Email','Phone','Balance ($)','Status','Autopay','Move-In','Owner?'],
        ...RESIDENTS.map(r=>[r.unit,r.name,r.email,r.phone,r.balance,r.status,r.autopay?'Yes':'No',r.moveIn,r.isOwner?'Owner':'Tenant']),
      ], [8,20,26,16,12,12,9,12,8])
    }

    // Vendors
    if (['vendor','annual','all'].includes(reportType)) {
      addSheet('Vendors & 1099', [
        [`CanHoa — Vendor Report | Tax Year ${yr()}`,'','','','',''],
        [`${COMMUNITY.name}`,'','','',`Generated: ${ds()}`,''],
        ['','','','','',''],
        ['Vendor Name','Category','Contact','YTD Paid ($)','1099 Required','Licensed','Insured','Insurance Exp.'],
        ...VENDORS.map(v=>[v.name,v.category,v.contact,v.ytdPaid,v.ytdPaid>=600?'YES':'No',v.licensed?'Yes':'NO',v.insured?'Yes':'NO',v.insuranceExpiry]),
        ['TOTAL YTD PAID','','',VENDORS.reduce((s,v)=>s+v.ytdPaid,0),'','','',''],
      ], [22,14,18,14,14,10,10,14])
    }

    // Maintenance
    if (['maintenance','annual','all'].includes(reportType)) {
      addSheet('Maintenance', [
        [`CanHoa — Maintenance Report | ${periodLabel}`,'','','',''],
        [`${COMMUNITY.name}`,'','',`Generated: ${ds()}`,''],
        ['','','','',''],
        ['ID','Unit','Resident','Category','Title','Priority','Status','Vendor','Cost ($)','Created','Resolved'],
        ...maint.map(r=>[r.id,r.unit,r.resident,r.category,r.title,r.priority,r.status,r.assignedTo||'Unassigned',r.cost,r.created,r.resolutionDate||'']),
        ['TOTAL','','','','','','','',maint.reduce((s,r)=>s+r.cost,0),'',''],
      ], [12,8,18,12,28,10,14,18,10,12,12])
    }

    // Violations
    if (['violations','all'].includes(reportType)) {
      addSheet('Violations', [
        [`CanHoa — Violations Report | ${periodLabel}`,'','',''],
        [`${COMMUNITY.name} | Fair Housing Act Compliant`,'','',`Generated: ${ds()}`],
        ['','','',''],
        ['Unit','Resident','Type','Status','Fine ($)','Notices Sent','Created','Due Date'],
        ...viols.map(v=>[v.unit,v.resident,v.type,v.status,v.fine,v.noticesSent,v.created,v.dueDate]),
        ['TOTAL FINES','','','',viols.reduce((s,v)=>s+v.fine,0),'','',''],
      ], [8,20,14,16,10,12,12,12])
    }

    // Journal Entries
    if (['ledger','all'].includes(reportType)) {
      addSheet('Journal Entries', [
        [`CanHoa — General Ledger & Journal Entries`,'','','',''],
        [`${COMMUNITY.name}`,'','',`Generated: ${ds()}`,''],
        ['','','','',''],
        ['Date','Memo','Debit Account','Credit Account','Amount ($)','Posted By','Status'],
        ...JOURNAL_ENTRIES.map(je=>[je.date,je.memo,je.debit,je.credit,je.amount,je.createdBy,je.status]),
      ], [12,30,20,20,12,16,10])
    }

    const fn = reportType === 'all'
      ? `CanHoa_Full_Package_${periodLabel.replace(/\s/g,'_')}.xlsx`
      : reportType === 'annual'
      ? `CanHoa_Annual_Report_${yr()}.xlsx`
      : `CanHoa_${reportType.charAt(0).toUpperCase()+reportType.slice(1)}_${periodLabel.replace(/\s/g,'_')}.xlsx`

    XLSX.writeFile(wb, fn)
    return true
  } catch(err) {
    console.error('Excel error:', err)
    throw err
  }
}
