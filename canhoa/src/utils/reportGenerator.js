// CanHoa v2 Report Generator — PDF (jsPDF) & Excel (SheetJS)
import {
  COMMUNITY, FINANCIAL_SUMMARY, MONTHLY_COLLECTIONS,
  EXPENSE_CATEGORIES, DELINQUENCY_AGING, RESIDENTS,
  PAYMENT_HISTORY, MAINTENANCE_REQUESTS, VIOLATIONS
} from '../data/mockData.js'

const now = () => new Date()
const dateStr = () => now().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
const year = () => now().getFullYear()

// ── PDF ──────────────────────────────────────────────
export async function generatePDF(reportType) {
  try {
    const { jsPDF } = await import('jspdf')
    const { default: autoTable } = await import('jspdf-autotable')
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' })
    const W = doc.internal.pageSize.getWidth()
    const H = doc.internal.pageSize.getHeight()
    const ds = dateStr()
    const yr = year()

    const drawHeader = (title, sub = '') => {
      doc.setFillColor(22, 101, 52); doc.rect(0, 0, W, 30, 'F')
      doc.setFillColor(16, 163, 74); doc.rect(0, 28, W, 2, 'F')
      doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.setTextColor(255,255,255)
      doc.text('CanHoa', 14, 13)
      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(134,239,172)
      doc.text('HOA Management Platform', 14, 19)
      doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.setTextColor(255,255,255)
      doc.text(title, W-14, 12, { align:'right' })
      doc.setFontSize(8); doc.setFont('helvetica', 'normal'); doc.setTextColor(187,247,208)
      doc.text(sub || ds, W-14, 19, { align:'right' })
      doc.setFillColor(240,253,244); doc.rect(0,30,W,12,'F')
      doc.setFontSize(8.5); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text(COMMUNITY.name, 14, 38)
      doc.setFont('helvetica','normal'); doc.setTextColor(75,122,94)
      doc.text(`${COMMUNITY.address} | ${COMMUNITY.totalUnits} Units | EIN: ${COMMUNITY.ein}`, 14, 43)
      return 50
    }

    const drawFooter = () => {
      doc.setFillColor(248,255,254); doc.rect(0,H-12,W,12,'F')
      doc.setFillColor(22,163,74); doc.rect(0,H-12,W,0.5,'F')
      doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(75,122,94)
      doc.text(`CanHoa — ${COMMUNITY.name} | Generated ${ds} | CONFIDENTIAL`, 14, H-4)
      doc.text(`Page 1`, W-14, H-4, { align:'right' })
    }

    const drawKPIs = (y, items) => {
      const bw = (W - 28 - (items.length-1)*4) / items.length
      items.forEach((it,i) => {
        const x = 14 + i*(bw+4)
        doc.setFillColor(240,253,244); doc.roundedRect(x,y,bw,20,2,2,'F')
        doc.setDrawColor(187,247,208); doc.roundedRect(x,y,bw,20,2,2,'S')
        doc.setFontSize(13); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
        doc.text(it.value, x+bw/2, y+9, {align:'center'})
        doc.setFontSize(7); doc.setFont('helvetica','normal'); doc.setTextColor(75,122,94)
        doc.text(it.label, x+bw/2, y+16, {align:'center'})
      })
      return y+25
    }

    const TS = {
      theme:'grid',
      headStyles:{ fillColor:[22,101,52], textColor:255, fontStyle:'bold', fontSize:8.5 },
      bodyStyles:{ fontSize:8, textColor:[15,31,20] },
      alternateRowStyles:{ fillColor:[240,253,244] },
      footStyles:{ fillColor:[22,101,52], textColor:255, fontStyle:'bold', fontSize:8.5 },
      margin:{ left:14, right:14 },
      styles:{ cellPadding:2.8 }
    }

    let y, fn

    if (reportType === 'income') {
      y = drawHeader('Income Statement (P&L)', `Fiscal Year ${yr}`)
      y = drawKPIs(y, [
        { value:`$${FINANCIAL_SUMMARY.ytdCollected.toLocaleString()}`, label:'Total Income YTD' },
        { value:`$${FINANCIAL_SUMMARY.ytdExpenses.toLocaleString()}`, label:'Total Expenses YTD' },
        { value:`$${(FINANCIAL_SUMMARY.ytdCollected-FINANCIAL_SUMMARY.ytdExpenses).toLocaleString()}`, label:'Net Income YTD' },
        { value:`${Math.round(((FINANCIAL_SUMMARY.ytdCollected-FINANCIAL_SUMMARY.ytdExpenses)/FINANCIAL_SUMMARY.ytdCollected)*100)}%`, label:'Net Margin' },
      ])
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Monthly Revenue Summary', 14, y); y+=3
      autoTable(doc, { ...TS, startY:y,
        head:[['Month','Collected','Target','Variance','Collection %']],
        body: MONTHLY_COLLECTIONS.map(m=>[m.month,`$${m.collected.toLocaleString()}`,`$${m.target.toLocaleString()}`,`${m.collected>=m.target?'+':''}$${(m.collected-m.target).toLocaleString()}`,`${Math.round((m.collected/m.target)*100)}%`]),
        foot:[['TOTAL',`$${MONTHLY_COLLECTIONS.reduce((s,m)=>s+m.collected,0).toLocaleString()}`,`$${MONTHLY_COLLECTIONS.reduce((s,m)=>s+m.target,0).toLocaleString()}`,'','']]
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Expense Breakdown by Category', 14, y); y+=3
      autoTable(doc, { ...TS, startY:y,
        head:[['Category','Budget','Actual','Variance','% Used']],
        body: EXPENSE_CATEGORIES.map(c=>[c.name,`$${c.budget.toLocaleString()}`,`$${c.amount.toLocaleString()}`,`$${(c.budget-c.amount).toLocaleString()}`,`${Math.round((c.amount/c.budget)*100)}%`]),
        foot:[['TOTAL',`$${EXPENSE_CATEGORIES.reduce((s,c)=>s+c.budget,0).toLocaleString()}`,`$${EXPENSE_CATEGORIES.reduce((s,c)=>s+c.amount,0).toLocaleString()}`,`$${EXPENSE_CATEGORIES.reduce((s,c)=>s+(c.budget-c.amount),0).toLocaleString()}`,'']]
      })
      fn = `CanHoa_Income_Statement_${yr}.pdf`
    }

    else if (reportType === 'balance') {
      y = drawHeader('Balance Sheet', `As of ${ds}`)
      y = drawKPIs(y, [
        { value:`$${(FINANCIAL_SUMMARY.operatingBalance+FINANCIAL_SUMMARY.reserveBalance).toLocaleString()}`, label:'Total Assets' },
        { value:`$${FINANCIAL_SUMMARY.operatingBalance.toLocaleString()}`, label:'Operating Fund' },
        { value:`$${FINANCIAL_SUMMARY.reserveBalance.toLocaleString()}`, label:'Reserve Fund' },
        { value:'62%', label:'Reserve Funded %' },
      ])
      autoTable(doc, { ...TS, startY:y,
        head:[['Account','Description','Balance']],
        body:[
          ['Operating Fund','Day-to-day operations',`$${FINANCIAL_SUMMARY.operatingBalance.toLocaleString()}`],
          ['Reserve Fund','Long-term capital reserve',`$${FINANCIAL_SUMMARY.reserveBalance.toLocaleString()}`],
          ['Accounts Receivable','Outstanding dues & fees',`$${FINANCIAL_SUMMARY.totalUnpaid.toLocaleString()}`],
          ['Prepaid Expenses','Insurance & contracts','$3,200'],
          ['TOTAL ASSETS','',`$${(FINANCIAL_SUMMARY.operatingBalance+FINANCIAL_SUMMARY.reserveBalance+FINANCIAL_SUMMARY.totalUnpaid+3200).toLocaleString()}`],
        ],
        foot:[['NET FUND BALANCE','',`$${(FINANCIAL_SUMMARY.operatingBalance+FINANCIAL_SUMMARY.reserveBalance).toLocaleString()}`]]
      })
      fn = `CanHoa_Balance_Sheet_${yr}.pdf`
    }

    else if (reportType === 'cashflow') {
      y = drawHeader('Cash Flow Statement', `Year to Date ${yr}`)
      y = drawKPIs(y, [
        { value:`$${FINANCIAL_SUMMARY.ytdCollected.toLocaleString()}`, label:'Total Inflows' },
        { value:`$${FINANCIAL_SUMMARY.ytdExpenses.toLocaleString()}`, label:'Total Outflows' },
        { value:`$${(FINANCIAL_SUMMARY.ytdCollected-FINANCIAL_SUMMARY.ytdExpenses).toLocaleString()}`, label:'Net Cash Flow' },
        { value:`$${FINANCIAL_SUMMARY.operatingBalance.toLocaleString()}`, label:'Ending Balance' },
      ])
      let cumulative = 0
      autoTable(doc, { ...TS, startY:y,
        head:[['Month','Inflows','Outflows','Net Cash Flow','Cumulative Balance']],
        body: MONTHLY_COLLECTIONS.map(m=>{
          const out=Math.round(m.collected*0.42); const net=m.collected-out; cumulative+=net
          return [m.month,`$${m.collected.toLocaleString()}`,`$${out.toLocaleString()}`,`$${net.toLocaleString()}`,`$${cumulative.toLocaleString()}`]
        }),
        foot:[['TOTAL',`$${MONTHLY_COLLECTIONS.reduce((s,m)=>s+m.collected,0).toLocaleString()}`,`$${Math.round(MONTHLY_COLLECTIONS.reduce((s,m)=>s+m.collected,0)*0.42).toLocaleString()}`,`$${Math.round(MONTHLY_COLLECTIONS.reduce((s,m)=>s+m.collected,0)*0.58).toLocaleString()}`,'']]
      })
      fn = `CanHoa_Cash_Flow_${yr}.pdf`
    }

    else if (reportType === 'aging') {
      y = drawHeader('Accounts Receivable Aging', ds)
      y = drawKPIs(y, [
        { value:`$${FINANCIAL_SUMMARY.totalUnpaid.toLocaleString()}`, label:'Total Overdue' },
        { value:`${FINANCIAL_SUMMARY.delinquentUnits}`, label:'Delinquent Units' },
        { value:`${FINANCIAL_SUMMARY.collectionRate}%`, label:'Collection Rate' },
        { value:`$${COMMUNITY.monthlyDues}/mo`, label:'Monthly Dues' },
      ])
      autoTable(doc, { ...TS, startY:y,
        head:[['Aging Bucket','Units','Amount','% of Total','Risk Level']],
        body: DELINQUENCY_AGING.map(r=>[r.bucket,r.units,`$${r.amount.toLocaleString()}`,`${r.pct}%`,r.bucket==='Current'?'Low':r.bucket==='1-30 days'?'Medium':'High']),
        foot:[['TOTAL',DELINQUENCY_AGING.reduce((s,r)=>s+r.units,0),`$${DELINQUENCY_AGING.reduce((s,r)=>s+r.amount,0).toLocaleString()}`,'100%','']]
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Delinquent Account Detail', 14, y); y+=3
      autoTable(doc, { ...TS, startY:y,
        head:[['Unit','Resident','Balance','Days Overdue','Action']],
        body: RESIDENTS.filter(r=>r.status==='delinquent').map(r=>[r.unit,r.name,`$${r.balance.toFixed(2)}`,`${r.daysOverdue||0}`,(r.daysOverdue||0)>60?'Consider Lien':'Send Notice'])
      })
      fn = `CanHoa_AR_Aging_${yr}.pdf`
    }

    else if (reportType === 'delinquency') {
      y = drawHeader('Delinquency Report', ds)
      y = drawKPIs(y, [
        { value:`${RESIDENTS.filter(r=>r.status==='delinquent').length}`, label:'Delinquent Units' },
        { value:`$${FINANCIAL_SUMMARY.totalUnpaid.toLocaleString()}`, label:'Total Overdue' },
        { value:`${FINANCIAL_SUMMARY.collectionRate}%`, label:'Collection Rate' },
        { value:`${RESIDENTS.filter(r=>r.autopay).length}`, label:'On Autopay' },
      ])
      autoTable(doc, { ...TS, startY:y,
        head:[['Unit','Resident','Email','Balance','Days Overdue','Autopay','Action Required']],
        body: RESIDENTS.filter(r=>r.status==='delinquent').map(r=>[
          r.unit,r.name,r.email,`$${r.balance.toFixed(2)}`,`${r.daysOverdue||0}`,
          r.autopay?'Yes':'No',
          (r.daysOverdue||0)>90?'Lien Filing':(r.daysOverdue||0)>60?'Collections':(r.daysOverdue||0)>30?'2nd Notice':'1st Notice'
        ])
      })
      fn = `CanHoa_Delinquency_${yr}.pdf`
    }

    else if (reportType === 'budget') {
      y = drawHeader('Budget vs. Actual Report', `Fiscal Year ${yr}`)
      const tb=EXPENSE_CATEGORIES.reduce((s,c)=>s+c.budget,0)
      const ta=EXPENSE_CATEGORIES.reduce((s,c)=>s+c.amount,0)
      y = drawKPIs(y, [
        { value:`$${tb.toLocaleString()}`, label:'Annual Budget' },
        { value:`$${ta.toLocaleString()}`, label:'YTD Actual' },
        { value:`$${(tb-ta).toLocaleString()}`, label:'Remaining' },
        { value:`${Math.round((ta/tb)*100)}%`, label:'Budget Used' },
      ])
      autoTable(doc, { ...TS, startY:y,
        head:[['Category','Annual Budget','YTD Actual','Variance $','Variance %','Status']],
        body: EXPENSE_CATEGORIES.map(c=>[c.name,`$${c.budget.toLocaleString()}`,`$${c.amount.toLocaleString()}`,`${c.amount>c.budget?'-':'+'}$${Math.abs(c.budget-c.amount).toLocaleString()}`,`${Math.round((c.amount/c.budget)*100)}%`,c.amount>c.budget?'Over Budget':'On Track']),
        foot:[['TOTAL',`$${tb.toLocaleString()}`,`$${ta.toLocaleString()}`,`$${(tb-ta).toLocaleString()}`,`${Math.round((ta/tb)*100)}%`,'']]
      })
      fn = `CanHoa_Budget_vs_Actual_${yr}.pdf`
    }

    else if (reportType === 'reserve') {
      y = drawHeader('Reserve Fund Analysis', `Fiscal Year ${yr}`)
      y = drawKPIs(y, [
        { value:`$${FINANCIAL_SUMMARY.reserveBalance.toLocaleString()}`, label:'Current Balance' },
        { value:'62%', label:'Funded %' },
        { value:'$301,613', label:'Full Funding Target' },
        { value:'$1,100/mo', label:'Monthly Contribution' },
      ])
      autoTable(doc, { ...TS, startY:y,
        head:[['Component','Useful Life','Remaining','Replacement Cost','Reserve Required','Status']],
        body:[
          ['Roofing','25 yrs','8 yrs','$180,000','$57,600','Funded'],
          ['HVAC Systems','15 yrs','4 yrs','$45,000','$12,000','Underfunded'],
          ['Pool Equipment','10 yrs','3 yrs','$28,000','$8,400','Funded'],
          ['Parking Lot','20 yrs','12 yrs','$65,000','$39,000','Funded'],
          ['Elevator','25 yrs','15 yrs','$85,000','$51,000','Funded'],
          ['Landscaping Equip.','8 yrs','2 yrs','$12,000','$3,000','Funded'],
          ['Common Area','10 yrs','5 yrs','$22,000','$11,000','On Track'],
        ],
        foot:[['TOTAL COMPONENTS','','','$437,000','$182,000','']]
      })
      fn = `CanHoa_Reserve_Fund_${yr}.pdf`
    }

    else if (reportType === 'maintenance') {
      y = drawHeader('Maintenance & Work Orders', ds)
      y = drawKPIs(y, [
        { value:`${MAINTENANCE_REQUESTS.length}`, label:'Total Requests' },
        { value:`${MAINTENANCE_REQUESTS.filter(r=>r.status==='New').length}`, label:'Open / New' },
        { value:`${MAINTENANCE_REQUESTS.filter(r=>['Assigned','In Progress','Scheduled'].includes(r.status)).length}`, label:'In Progress' },
        { value:`${MAINTENANCE_REQUESTS.filter(r=>r.status==='Resolved').length}`, label:'Resolved' },
      ])
      autoTable(doc, { ...TS, startY:y,
        head:[['ID','Unit','Category','Title','Priority','Status','Assigned To','Date']],
        body: MAINTENANCE_REQUESTS.map(r=>[r.id,r.unit,r.category,r.title.slice(0,28),r.priority,r.status,r.assignedTo||'Unassigned',r.created])
      })
      fn = `CanHoa_Maintenance_${yr}.pdf`
    }

    else if (reportType === 'violations') {
      y = drawHeader('Violation Compliance Report', ds)
      y = drawKPIs(y, [
        { value:`${VIOLATIONS.length}`, label:'Total Violations' },
        { value:`${VIOLATIONS.filter(v=>v.status==='Open').length}`, label:'Open Cases' },
        { value:`$${VIOLATIONS.reduce((s,v)=>s+v.fine,0)}`, label:'Fines Assessed' },
        { value:`${VIOLATIONS.filter(v=>v.status==='Resolved').length}`, label:'Resolved' },
      ])
      autoTable(doc, { ...TS, startY:y,
        head:[['Unit','Resident','Type','Status','Fine','Notices','Created','Due Date']],
        body: VIOLATIONS.map(v=>[v.unit,v.resident,v.type,v.status,`$${v.fine}`,`${v.noticesSent}`,v.created,v.dueDate])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFillColor(254,252,232); doc.setDrawColor(253,224,71)
      doc.roundedRect(14,y,W-28,14,2,2,'FD')
      doc.setFontSize(7.5); doc.setFont('helvetica','bold'); doc.setTextColor(133,77,14)
      doc.text('Fair Housing Act Notice: ', 18, y+6)
      doc.setFont('helvetica','normal')
      doc.text('All enforcement is applied consistently regardless of protected class status. Internal compliance use only.', 18, y+11)
      fn = `CanHoa_Violations_${yr}.pdf`
    }

    else if (reportType === 'annual') {
      // Page 1
      y = drawHeader('Annual Community Report', `Fiscal Year ${yr}`)
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('EXECUTIVE SUMMARY', 14, y); y+=4
      doc.setFont('helvetica','normal'); doc.setTextColor(75,122,94); doc.setFontSize(8.5)
      const txt = `This Annual Report presents the financial performance and operational highlights for ${COMMUNITY.name} for fiscal year ${yr}. The association manages ${COMMUNITY.totalUnits} residential units at ${COMMUNITY.address}.`
      const lines = doc.splitTextToSize(txt, W-28)
      doc.text(lines, 14, y); y += lines.length*4.2+4
      y = drawKPIs(y, [
        { value:`$${FINANCIAL_SUMMARY.ytdCollected.toLocaleString()}`, label:'Total Collections' },
        { value:`${FINANCIAL_SUMMARY.collectionRate}%`, label:'Collection Rate' },
        { value:`$${FINANCIAL_SUMMARY.reserveBalance.toLocaleString()}`, label:'Reserve Balance' },
        { value:`${COMMUNITY.totalUnits}`, label:'Total Units' },
      ])
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Annual Financial Summary', 14, y); y+=3
      autoTable(doc, { ...TS, startY:y,
        head:[['Category','Budget','Actual','Variance']],
        body:[
          ['Assessment Income','$424,080',`$${FINANCIAL_SUMMARY.ytdCollected.toLocaleString()}`,`+$${(FINANCIAL_SUMMARY.ytdCollected-424080).toLocaleString()}`],
          ['Operating Expenses','$146,160',`$${FINANCIAL_SUMMARY.ytdExpenses.toLocaleString()}`,`$${(146160-FINANCIAL_SUMMARY.ytdExpenses).toLocaleString()}`],
          ['Reserve Contributions','$13,200','$13,200','$0'],
        ],
        foot:[['NET INCOME','',`$${(FINANCIAL_SUMMARY.ytdCollected-FINANCIAL_SUMMARY.ytdExpenses).toLocaleString()}`,'']]
      })
      // Page 2
      doc.addPage()
      y = drawHeader('Annual Report — Operations', `Fiscal Year ${yr}`)
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Expense Breakdown', 14, y); y+=3
      autoTable(doc, { ...TS, startY:y,
        head:[['Category','Budget','Actual','%']],
        body: EXPENSE_CATEGORIES.map(c=>[c.name,`$${c.budget.toLocaleString()}`,`$${c.amount.toLocaleString()}`,`${Math.round((c.amount/c.budget)*100)}%`])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Maintenance Summary', 14, y); y+=3
      autoTable(doc, { ...TS, startY:y,
        head:[['Category','Requests','Avg Resolution','Total Cost']],
        body:[['Plumbing','12','2.3 days','$4,200'],['Electrical','5','1.1 days','$3,800'],['HVAC','8','3.2 days','$6,100'],['Landscaping','22','1.0 days','$8,400'],['Other','20','2.5 days','$6,800']],
        foot:[['TOTAL','67','1.9 days avg','$29,300']]
      })
      fn = `CanHoa_Annual_Report_${yr}.pdf`
    }

    else if (reportType === 'board_packet') {
      y = drawHeader('Board Meeting Packet', ds)
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('FINANCIAL DASHBOARD', 14, y); y+=3
      y = drawKPIs(y, [
        { value:`$${FINANCIAL_SUMMARY.mtdCollected.toLocaleString()}`, label:'MTD Collections' },
        { value:`${FINANCIAL_SUMMARY.collectionRate}%`, label:'Collection Rate' },
        { value:`$${FINANCIAL_SUMMARY.reserveBalance.toLocaleString()}`, label:'Reserve Fund' },
        { value:`${FINANCIAL_SUMMARY.delinquentUnits}`, label:'Delinquent Units' },
      ])
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Monthly Collections (Last 4 Months)', 14, y); y+=3
      autoTable(doc, { ...TS, startY:y,
        head:[['Month','Collected','Target','Rate']],
        body: MONTHLY_COLLECTIONS.slice(-4).map(m=>[m.month,`$${m.collected.toLocaleString()}`,`$${m.target.toLocaleString()}`,`${Math.round((m.collected/m.target)*100)}%`])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Budget vs. Actual Summary', 14, y); y+=3
      autoTable(doc, { ...TS, startY:y,
        head:[['Category','Budget','Actual','Status']],
        body: EXPENSE_CATEGORIES.map(c=>[c.name,`$${c.budget.toLocaleString()}`,`$${c.amount.toLocaleString()}`,c.amount>c.budget?'Over Budget':'On Track'])
      })
      y = doc.lastAutoTable.finalY+6
      doc.setFontSize(9); doc.setFont('helvetica','bold'); doc.setTextColor(22,101,52)
      doc.text('Delinquency Aging', 14, y); y+=3
      autoTable(doc, { ...TS, startY:y,
        head:[['Bucket','Units','Amount']],
        body: DELINQUENCY_AGING.map(r=>[r.bucket,r.units,`$${r.amount.toLocaleString()}`])
      })
      fn = `CanHoa_Board_Packet_${ds.replace(/,/g,'').replace(/ /g,'_')}.pdf`
    }

    drawFooter()
    doc.save(fn || `CanHoa_Report_${year()}.pdf`)
    return true
  } catch (err) {
    console.error('PDF generation error:', err)
    throw err
  }
}

// ── EXCEL ────────────────────────────────────────────
export async function generateExcel(reportType) {
  try {
    const XLSX = await import('xlsx')
    const wb = XLSX.utils.book_new()
    const ds = dateStr()
    const yr = year()

    const addSheet = (name, data) => {
      const ws = XLSX.utils.aoa_to_sheet(data)
      XLSX.utils.book_append_sheet(wb, ws, name)
      return ws
    }

    if (reportType === 'income' || reportType === 'annual') {
      const ws = addSheet('Income Statement', [
        [`CanHoa — Income Statement FY${yr}`,'','','',''],
        [`Community: ${COMMUNITY.name}`,'','',`Generated: ${ds}`,''],
        ['','','','',''],
        ['MONTHLY REVENUE','','','',''],
        ['Month','Collected ($)','Target ($)','Variance ($)','Collection %'],
        ...MONTHLY_COLLECTIONS.map(m=>[m.month,m.collected,m.target,m.collected-m.target,`${Math.round((m.collected/m.target)*100)}%`]),
        ['TOTAL',MONTHLY_COLLECTIONS.reduce((s,m)=>s+m.collected,0),MONTHLY_COLLECTIONS.reduce((s,m)=>s+m.target,0),'',''],
        ['','','','',''],
        ['EXPENSE BREAKDOWN','','','',''],
        ['Category','Budget ($)','Actual ($)','Variance ($)','% Used'],
        ...EXPENSE_CATEGORIES.map(c=>[c.name,c.budget,c.amount,c.budget-c.amount,`${Math.round((c.amount/c.budget)*100)}%`]),
        ['TOTAL',EXPENSE_CATEGORIES.reduce((s,c)=>s+c.budget,0),EXPENSE_CATEGORIES.reduce((s,c)=>s+c.amount,0),'',''],
        ['','','','',''],
        ['NET INCOME','',FINANCIAL_SUMMARY.ytdCollected-FINANCIAL_SUMMARY.ytdExpenses,'',''],
      ])
      ws['!cols'] = [{wch:18},{wch:16},{wch:14},{wch:14},{wch:13}]
    }

    if (reportType === 'budget' || reportType === 'annual') {
      const ws = addSheet('Budget vs Actual', [
        [`CanHoa — Budget vs. Actual FY${yr}`,'','','','',''],
        [`${COMMUNITY.name}`,'','','',`Generated: ${ds}`,''],
        ['','','','','',''],
        ['Category','Annual Budget ($)','YTD Actual ($)','Variance ($)','Variance %','Status'],
        ...EXPENSE_CATEGORIES.map(c=>[c.name,c.budget,c.amount,c.budget-c.amount,`${Math.round((c.amount/c.budget)*100)}%`,c.amount>c.budget?'Over Budget':'On Track']),
        ['TOTAL',EXPENSE_CATEGORIES.reduce((s,c)=>s+c.budget,0),EXPENSE_CATEGORIES.reduce((s,c)=>s+c.amount,0),EXPENSE_CATEGORIES.reduce((s,c)=>s+(c.budget-c.amount),0),'',''],
      ])
      ws['!cols'] = [{wch:22},{wch:18},{wch:14},{wch:14},{wch:13},{wch:14}]
    }

    if (reportType === 'aging' || reportType === 'delinquency' || reportType === 'annual') {
      const ws = addSheet('AR Aging', [
        [`CanHoa — AR Aging Report`,'','','','',''],
        [`${COMMUNITY.name}`,'','','',`Generated: ${ds}`,''],
        ['','','','','',''],
        ['AGING SUMMARY','','','','',''],
        ['Bucket','Units','Amount ($)','% of Total','Risk Level',''],
        ...DELINQUENCY_AGING.map(r=>[r.bucket,r.units,r.amount,`${r.pct}%`,r.bucket==='Current'?'Low':r.bucket==='1-30 days'?'Medium':'High','']),
        ['','','','','',''],
        ['DELINQUENT ACCOUNTS DETAIL','','','','',''],
        ['Unit','Resident','Email','Phone','Balance Due ($)','Days Overdue'],
        ...RESIDENTS.filter(r=>r.status==='delinquent').map(r=>[r.unit,r.name,r.email,r.phone,r.balance,r.daysOverdue||0]),
      ])
      ws['!cols'] = [{wch:12},{wch:22},{wch:28},{wch:17},{wch:15},{wch:14}]
    }

    // Always add Transactions & Residents
    const ws3 = addSheet('Transactions', [
      [`CanHoa — Payment Transactions`,'','','','','',''],
      [`${COMMUNITY.name}`,'','','','',`Generated: ${ds}`,''],
      ['','','','','','',''],
      ['Date','Unit','Resident','Type','Method','Amount ($)','Status'],
      ...PAYMENT_HISTORY.map(p=>[p.date,p.unit,p.resident,p.type,p.method,p.amount,p.status]),
      ['TOTAL','','','','',PAYMENT_HISTORY.reduce((s,p)=>s+p.amount,0),''],
    ])
    ws3['!cols'] = [{wch:12},{wch:8},{wch:20},{wch:18},{wch:10},{wch:12},{wch:12}]

    const ws4 = addSheet('Residents', [
      [`CanHoa — Resident Directory`,'','','','','',''],
      [`${COMMUNITY.name}`,'','','','',`Generated: ${ds}`,''],
      ['','','','','','',''],
      ['Unit','Name','Email','Phone','Balance ($)','Status','Autopay','Move-In'],
      ...RESIDENTS.map(r=>[r.unit,r.name,r.email,r.phone,r.balance,r.status,r.autopay?'Yes':'No',r.moveIn]),
    ])
    ws4['!cols'] = [{wch:8},{wch:20},{wch:26},{wch:17},{wch:12},{wch:12},{wch:9},{wch:12}]

    const fn = reportType === 'annual'
      ? `CanHoa_Annual_Report_${yr}.xlsx`
      : `CanHoa_${reportType.charAt(0).toUpperCase()+reportType.slice(1)}_Report_${yr}.xlsx`

    XLSX.writeFile(wb, fn)
    return true
  } catch (err) {
    console.error('Excel generation error:', err)
    throw err
  }
}
