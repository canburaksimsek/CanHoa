// CanHoa v3 Mock Data — Complete Platform

export const COMMUNITY = {
  name:'Oakwood Heights HOA', address:'1200 Oakwood Drive, Austin, TX 78701',
  city:'Austin', state:'Texas', zip:'78701',
  totalUnits:124, occupiedUnits:118, monthlyDues:285, dueDay:1,
  gracePeriod:10, lateFee:35, lateFeeType:'flat', lateFeeRecurring:false,
  founded:'2018-03-01', plan:'Growth', type:'Condominium Association',
  ein:'83-1234567', fiscalYearStart:'January', reserveTarget:301613,
  processingFeePassthrough:false, stripeConnected:true, plaidConnected:true,
  phone:'(512) 555-0100', email:'manager@oakwoodhoa.com',
  website:'oakwoodheights.canhoa.app'
}

export const FINANCIAL_SUMMARY = {
  mtdCollected:28974, mtdExpenses:14230, netMTD:14744,
  reserveBalance:187500, operatingBalance:43200,
  ytdCollected:198450, ytdExpenses:121800,
  collectionRate:93.2, totalUnpaid:4845, delinquentUnits:6,
  bookBalance:43200, bankBalance:42180, reconciliationDiff:1020,
  lastReconciled:'2026-04-01'
}

export const MONTHLY_COLLECTIONS = [
  { month:'Jun', year:2025, collected:31200, target:35340, expenses:14800 },
  { month:'Jul', year:2025, collected:33800, target:35340, expenses:13200 },
  { month:'Aug', year:2025, collected:34100, target:35340, expenses:15600 },
  { month:'Sep', year:2025, collected:29800, target:35340, expenses:12900 },
  { month:'Oct', year:2025, collected:32400, target:35340, expenses:14100 },
  { month:'Nov', year:2025, collected:31900, target:35340, expenses:13500 },
  { month:'Dec', year:2025, collected:33200, target:35340, expenses:16200 },
  { month:'Jan', year:2026, collected:34800, target:35340, expenses:14400 },
  { month:'Feb', year:2026, collected:31100, target:35340, expenses:13800 },
  { month:'Mar', year:2026, collected:33600, target:35340, expenses:14900 },
  { month:'Apr', year:2026, collected:30200, target:35340, expenses:14230 },
  { month:'May', year:2026, collected:28974, target:35340, expenses:0 },
]

export const EXPENSE_CATEGORIES = [
  { name:'Landscaping', amount:4200, budget:4500, color:'#22c55e', ytd:16800, ytdBudget:18000 },
  { name:'Utilities', amount:3180, budget:3500, color:'#3b82f6', ytd:12720, ytdBudget:14000 },
  { name:'Insurance', amount:2400, budget:2400, color:'#f59e0b', ytd:9600, ytdBudget:9600 },
  { name:'Maintenance', amount:1850, budget:2000, color:'#8b5cf6', ytd:7400, ytdBudget:8000 },
  { name:'Management', amount:1500, budget:1500, color:'#ef4444', ytd:6000, ytdBudget:6000 },
  { name:'Reserve Contrib.', amount:1100, budget:1200, color:'#0d9488', ytd:4400, ytdBudget:4800 },
  { name:'Professional Fees', amount:0, budget:800, color:'#6366f1', ytd:2400, ytdBudget:3200 },
  { name:'Pest Control', amount:280, budget:300, color:'#f97316', ytd:840, ytdBudget:1200 },
]

export const RESIDENTS = [
  { id:'r1', name:'James Chen', unit:'4B', email:'j.chen@email.com', phone:'(512) 555-0101', moveIn:'2022-06-01', balance:285, status:'current', autopay:true, avatar:'JC', parking:'P-12', pets:[], vehicles:[{make:'Toyota',model:'Camry',plate:'TX-4821-KZ',color:'Silver'}], isOwner:true, emergencyContact:'Sarah Chen (512) 555-9901' },
  { id:'r2', name:'Maria Rodriguez', unit:'2A', email:'m.rodriguez@email.com', phone:'(512) 555-0102', moveIn:'2021-03-15', balance:855, status:'delinquent', autopay:false, avatar:'MR', daysOverdue:45, parking:'P-5', pets:[{name:'Bella',breed:'Labrador',weight:'65 lbs',vaccinated:true}], vehicles:[], isOwner:true },
  { id:'r3', name:'David Thompson', unit:'7C', email:'d.thompson@email.com', phone:'(512) 555-0103', moveIn:'2023-01-10', balance:0, status:'current', autopay:true, avatar:'DT', parking:'P-18', pets:[], vehicles:[{make:'Honda',model:'Civic',plate:'TX-2233-AB',color:'Blue'}], isOwner:false, ownerName:'Patricia Lowe', ownerEmail:'p.lowe@email.com' },
  { id:'r4', name:'Lisa Park', unit:'1D', email:'l.park@email.com', phone:'(512) 555-0104', moveIn:'2020-09-01', balance:0, status:'current', autopay:false, avatar:'LP', parking:'P-3', pets:[{name:'Max',breed:'Beagle',weight:'25 lbs',vaccinated:true}], vehicles:[], isOwner:true },
  { id:'r5', name:'Robert Johnson', unit:'9A', email:'r.johnson@email.com', phone:'(512) 555-0105', moveIn:'2022-11-20', balance:570, status:'delinquent', autopay:false, avatar:'RJ', daysOverdue:30, parking:'P-22', pets:[], vehicles:[], isOwner:true },
  { id:'r6', name:'Emily Watson', unit:'3B', email:'e.watson@email.com', phone:'(512) 555-0106', moveIn:'2021-07-14', balance:285, status:'current', autopay:true, avatar:'EW', parking:'P-8', pets:[], vehicles:[{make:'Ford',model:'Explorer',plate:'TX-8811-ZZ',color:'White'}], isOwner:true },
  { id:'r7', name:'Michael Brown', unit:'6C', email:'m.brown@email.com', phone:'(512) 555-0107', moveIn:'2023-04-01', balance:0, status:'current', autopay:true, avatar:'MB', parking:'P-14', pets:[], vehicles:[], isOwner:true },
  { id:'r8', name:'Jennifer Lee', unit:'8D', email:'j.lee@email.com', phone:'(512) 555-0108', moveIn:'2020-02-28', balance:1140, status:'delinquent', autopay:false, avatar:'JL', daysOverdue:67, parking:'P-1', pets:[], vehicles:[], isOwner:true },
  { id:'r9', name:'Carlos Mendez', unit:'5A', email:'c.mendez@email.com', phone:'(512) 555-0109', moveIn:'2022-08-15', balance:285, status:'current', autopay:false, avatar:'CM', parking:'P-19', pets:[{name:'Luna',breed:'Chihuahua',weight:'6 lbs',vaccinated:true}], vehicles:[], isOwner:true },
  { id:'r10', name:'Amanda Foster', unit:'11B', email:'a.foster@email.com', phone:'(512) 555-0110', moveIn:'2021-12-01', balance:0, status:'current', autopay:true, avatar:'AF', parking:'P-24', pets:[], vehicles:[{make:'Tesla',model:'Model 3',plate:'TX-0099-EV',color:'Red'}], isOwner:true },
]

export const MAINTENANCE_REQUESTS = [
  { id:'maint-001', unit:'4B', resident:'James Chen', category:'Plumbing', title:'Kitchen faucet leaking', description:'The kitchen faucet has been dripping constantly for 3 days.', priority:'High', status:'In Progress', created:'2026-04-10', assignedTo:"Mike's Plumbing", cost:0, photos:2, slaHours:24, satisfactionRating:null, internalNotes:['Called plumber - arriving Thursday'], resolutionDate:null },
  { id:'maint-002', unit:'Common', resident:'Building Mgmt', category:'Electrical', title:'Lobby lights flickering', description:'Main lobby ceiling lights flickering intermittently. Fire hazard risk.', priority:'Emergency', status:'Assigned', created:'2026-04-12', assignedTo:'TechElectric Pro', cost:0, photos:1, slaHours:4, satisfactionRating:null, internalNotes:[], resolutionDate:null },
  { id:'maint-003', unit:'7C', resident:'David Thompson', category:'HVAC', title:'AC not cooling properly', description:'Unit AC runs but room stays warm above 78°F.', priority:'Normal', status:'New', created:'2026-04-13', assignedTo:null, cost:0, photos:0, slaHours:72, satisfactionRating:null, internalNotes:[], resolutionDate:null },
  { id:'maint-004', unit:'9A', resident:'Robert Johnson', category:'Landscaping', title:'Tree branch over balcony', description:'Large branch creating safety hazard over balcony.', priority:'High', status:'Resolved', created:'2026-04-05', assignedTo:'GreenScape Austin', cost:180, photos:3, slaHours:24, satisfactionRating:5, internalNotes:[], resolutionDate:'2026-04-07' },
  { id:'maint-005', unit:'2A', resident:'Maria Rodriguez', category:'Appliance', title:'Dryer vent blocked', description:'Dryer takes 3+ cycles. Vent likely clogged.', priority:'Normal', status:'Pending Approval', created:'2026-04-08', assignedTo:'CleanVent Services', cost:95, photos:0, slaHours:72, satisfactionRating:null, internalNotes:['Quoted $95'], resolutionDate:null },
  { id:'maint-006', unit:'Common', resident:'Building Mgmt', category:'Safety', title:'Fire extinguisher inspection', description:'Annual inspection due for all floors — required by TX Fire Code.', priority:'High', status:'Scheduled', created:'2026-04-01', assignedTo:'SafetyFirst Inc', cost:320, photos:0, slaHours:24, satisfactionRating:null, internalNotes:[], resolutionDate:null },
]

export const VIOLATIONS = [
  { id:'vio-001', unit:'3B', resident:'Emily Watson', type:'Parking', description:'Vehicle parked in fire lane 48+ hours. Plate TX-4821-KZ.', status:'Open', fine:75, created:'2026-04-08', dueDate:'2026-04-22', noticesSent:1, escalationLevel:1, photos:1, hearingRequested:false },
  { id:'vio-002', unit:'9A', resident:'Robert Johnson', type:'Noise', description:'Excessive noise after 11pm on 3 consecutive nights.', status:'Hearing Scheduled', fine:100, created:'2026-03-28', dueDate:'2026-04-11', noticesSent:2, escalationLevel:2, photos:0, hearingRequested:true, hearingDate:'2026-04-20' },
  { id:'vio-003', unit:'6C', resident:'Michael Brown', type:'Modification', description:'Satellite dish installed without ARC approval per CC&Rs Section 5.3.', status:'Resolved', fine:0, created:'2026-03-15', dueDate:'2026-03-29', noticesSent:1, escalationLevel:1, photos:2, hearingRequested:false, resolvedDate:'2026-03-27' },
  { id:'vio-004', unit:'1D', resident:'Lisa Park', type:'Landscaping', description:'Potted plants exceed balcony railing height per CC&R Section 4.2.1.', status:'Open', fine:50, created:'2026-04-11', dueDate:'2026-04-25', noticesSent:1, escalationLevel:1, photos:1, hearingRequested:false },
]

export const ANNOUNCEMENTS = [
  { id:'ann-001', title:'Pool Opening — Memorial Day Weekend', body:'The community pool will officially open Saturday, May 23rd at 10:00 AM. Hours: 8 AM - 10 PM daily through Labor Day.', type:'Community', channels:['Email','SMS','Portal'], sent:'2026-04-10', openRate:78, clickRate:34, author:'Sarah Mitchell', recipients:118 },
  { id:'ann-002', title:'April Board Meeting — Agenda Posted', body:'Board meeting Wednesday, April 23rd at 7:00 PM in the Clubhouse. Agenda: Q1 financial review, reserve fund update, pool renovation vote.', type:'Meeting', channels:['Email','Portal'], sent:'2026-04-09', openRate:62, clickRate:28, author:'Patricia Williams', recipients:118 },
  { id:'ann-003', title:'🚨 Emergency: Water Shut-Off Tuesday 8 AM - 2 PM', body:'IMPORTANT: Austin Water scheduled emergency water main repair. Service shut off ALL units Tuesday April 15, 8 AM - 2 PM. Please store water in advance.', type:'Emergency', channels:['Email','SMS','Phone','Portal'], sent:'2026-04-12', openRate:94, clickRate:45, author:'Sarah Mitchell', recipients:118 },
  { id:'ann-004', title:'Parking Lot Resurfacing — April 28-30', body:'Parking lot resurfaced April 28-30. Vehicles must be removed by 7 AM April 28. Temp parking on Oak Street. Remaining vehicles may be towed at owner expense.', type:'Maintenance', channels:['Email','SMS'], sent:'2026-04-07', openRate:71, clickRate:22, author:'Sarah Mitchell', recipients:118 },
]

export const DOCUMENTS = [
  { id:'doc-001', name:"CC&Rs — Oakwood Heights HOA", folder:'Governing Documents', type:'PDF', size:'2.4 MB', uploaded:'2024-01-15', access:'Residents', version:3, expiresAt:null, downloads:47 },
  { id:'doc-002', name:'Bylaws (Amended 2024)', folder:'Governing Documents', type:'PDF', size:'1.8 MB', uploaded:'2024-03-20', access:'Residents', version:5, expiresAt:null, downloads:32 },
  { id:'doc-003', name:'Rules & Regulations 2026', folder:'Governing Documents', type:'PDF', size:'890 KB', uploaded:'2026-01-10', access:'Residents', version:2, expiresAt:null, downloads:61 },
  { id:'doc-004', name:'April 2026 Board Meeting Minutes', folder:'Meeting Minutes', type:'PDF', size:'340 KB', uploaded:'2026-04-02', access:'Residents', version:1, expiresAt:null, downloads:18 },
  { id:'doc-005', name:'Q1 2026 Financial Report', folder:'Financial Records', type:'PDF', size:'1.2 MB', uploaded:'2026-04-05', access:'Board', version:1, expiresAt:null, downloads:8 },
  { id:'doc-006', name:'2026 Annual Budget', folder:'Financial Records', type:'Excel', size:'456 KB', uploaded:'2025-12-20', access:'Board', version:2, expiresAt:null, downloads:12 },
  { id:'doc-007', name:'Master Insurance Policy 2026', folder:'Insurance', type:'PDF', size:'3.1 MB', uploaded:'2026-01-01', access:'Board', expiresAt:'2027-01-01', version:1, downloads:5 },
  { id:'doc-008', name:'Landscaping Contract — GreenScape', folder:'Vendor Contracts', type:'PDF', size:'780 KB', uploaded:'2026-02-15', access:'Admin', expiresAt:'2026-12-31', version:1, downloads:3 },
  { id:'doc-009', name:'ARC Application Form', folder:'Forms & Templates', type:'PDF', size:'120 KB', uploaded:'2025-06-01', access:'Residents', version:2, expiresAt:null, downloads:94 },
  { id:'doc-010', name:'Welcome Letter Template', folder:'Forms & Templates', type:'Word', size:'85 KB', uploaded:'2024-09-15', access:'Admin', version:1, expiresAt:null, downloads:7 },
]

export const VOTES = [
  { id:'vote-001', title:'Pool Hours Extension — Summer 2026', description:'Proposal to extend pool hours on weekends from 10 PM to 11 PM during June, July, and August 2026.', type:'Resolution', status:'Active', yesVotes:47, noVotes:18, abstain:5, eligible:118, deadline:'2026-04-25', quorum:30, quorumMet:true, anonymous:false, proxyVotes:3 },
  { id:'vote-002', title:'2026-2027 Board of Directors Election', description:'Annual election for 3 open board seats. Candidates: Patricia Williams, James Kim, Sandra Torres, Robert Nash, Laura Chen.', type:'Election', status:'Active', yesVotes:0, noVotes:0, abstain:0, eligible:124, deadline:'2026-04-30', quorum:25, quorumMet:false, anonymous:true, proxyVotes:0 },
  { id:'vote-003', title:'Special Assessment — Lobby Renovation', description:'One-time $450/unit special assessment for complete lobby renovation.', type:'Assessment', status:'Closed', yesVotes:68, noVotes:24, abstain:12, eligible:118, deadline:'2026-03-31', quorum:30, quorumMet:true, passed:true, anonymous:false, proxyVotes:8, certifiedDate:'2026-04-01' },
]

export const AMENITIES = [
  { id:'am-001', name:'Community Pool', type:'Pool', capacity:40, maxBookingHours:4, advanceBookingDays:14, requiresDeposit:false, available:true, hours:'8 AM - 10 PM' },
  { id:'am-002', name:'Fitness Center', type:'Gym', capacity:15, maxBookingHours:2, advanceBookingDays:7, requiresDeposit:false, available:true, hours:'5 AM - 11 PM' },
  { id:'am-003', name:'Clubhouse — Main Hall', type:'Event Space', capacity:80, maxBookingHours:6, advanceBookingDays:60, requiresDeposit:true, depositAmount:250, available:true, hours:'8 AM - 10 PM' },
  { id:'am-004', name:'Tennis Court', type:'Sports', capacity:4, maxBookingHours:2, advanceBookingDays:7, requiresDeposit:false, available:true, hours:'7 AM - 9 PM' },
  { id:'am-005', name:'BBQ Pavilion', type:'Outdoor', capacity:20, maxBookingHours:4, advanceBookingDays:30, requiresDeposit:false, available:false, hours:'8 AM - 8 PM', unavailableReason:'Under maintenance until May 1, 2026' },
]

export const PAYMENT_HISTORY = [
  { id:'pay-001', unit:'4B', resident:'James Chen', amount:285, method:'ACH', date:'2026-04-01', status:'Completed', type:'Monthly Dues', receipt:'RCP-2026-0401' },
  { id:'pay-002', unit:'7C', resident:'David Thompson', amount:285, method:'Card', date:'2026-04-01', status:'Completed', type:'Monthly Dues', receipt:'RCP-2026-0402' },
  { id:'pay-003', unit:'11B', resident:'Amanda Foster', amount:285, method:'ACH', date:'2026-04-02', status:'Completed', type:'Monthly Dues', receipt:'RCP-2026-0403' },
  { id:'pay-004', unit:'9A', resident:'Robert Johnson', amount:285, method:'ACH', date:'2026-04-03', status:'Failed', type:'Monthly Dues', receipt:null, failReason:'Insufficient funds' },
  { id:'pay-005', unit:'5A', resident:'Carlos Mendez', amount:285, method:'Card', date:'2026-04-05', status:'Completed', type:'Monthly Dues', receipt:'RCP-2026-0405' },
  { id:'pay-006', unit:'3B', resident:'Emily Watson', amount:285, method:'ACH', date:'2026-04-07', status:'Completed', type:'Monthly Dues', receipt:'RCP-2026-0406' },
  { id:'pay-007', unit:'6C', resident:'Michael Brown', amount:285, method:'ACH', date:'2026-04-01', status:'Completed', type:'Monthly Dues', receipt:'RCP-2026-0407' },
  { id:'pay-008', unit:'1D', resident:'Lisa Park', amount:285, method:'Card', date:'2026-04-10', status:'Completed', type:'Monthly Dues', receipt:'RCP-2026-0408' },
  { id:'pay-009', unit:'8D', resident:'Jennifer Lee', amount:35, method:'Manual', date:'2026-04-11', status:'Completed', type:'Late Fee', receipt:'RCP-2026-0410' },
  { id:'pay-010', unit:'9A', resident:'Robert Johnson', amount:35, method:'Manual', date:'2026-04-12', status:'Completed', type:'NSF Fee', receipt:'RCP-2026-0411' },
]

export const BOARD_MEMBERS = [
  { id:'bm-001', name:'Patricia Williams', role:'President', email:'p.williams@oakwoodhoa.com', termStart:'2024-01-01', termEnd:'2027-12-31', phone:'(512) 555-0201', avatar:'PW', committee:'Finance' },
  { id:'bm-002', name:'Marcus Reynolds', role:'Vice President', email:'m.reynolds@oakwoodhoa.com', termStart:'2024-01-01', termEnd:'2027-12-31', phone:'(512) 555-0202', avatar:'MR', committee:'Maintenance' },
  { id:'bm-003', name:'Sandra Torres', role:'Treasurer', email:'s.torres@oakwoodhoa.com', termStart:'2023-01-01', termEnd:'2026-12-31', phone:'(512) 555-0203', avatar:'ST', committee:'Finance' },
  { id:'bm-004', name:'Kevin Park', role:'Secretary', email:'k.park@oakwoodhoa.com', termStart:'2023-01-01', termEnd:'2026-12-31', phone:'(512) 555-0204', avatar:'KP', committee:'Communications' },
  { id:'bm-005', name:'Rachel Adams', role:'Member at Large', email:'r.adams@oakwoodhoa.com', termStart:'2024-01-01', termEnd:'2027-12-31', phone:'(512) 555-0205', avatar:'RA', committee:'ARC' },
]

export const VENDORS = [
  { id:'ven-001', name:'GreenScape Austin', category:'Landscaping', contact:'Tom Green', phone:'(512) 555-0301', email:'info@greenscape.com', rating:4.8, contractEnd:'2026-12-31', insured:true, licensed:true, insuranceExpiry:'2027-01-01', ytdPaid:4200 },
  { id:'ven-002', name:"Mike's Plumbing", category:'Plumbing', contact:'Mike Johnson', phone:'(512) 555-0302', email:'mike@mikesplumbing.com', rating:4.6, contractEnd:null, insured:true, licensed:true, insuranceExpiry:'2026-11-15', ytdPaid:1850 },
  { id:'ven-003', name:'TechElectric Pro', category:'Electrical', contact:'Sarah Tech', phone:'(512) 555-0303', email:'service@techelectric.com', rating:4.9, contractEnd:'2026-06-30', insured:true, licensed:true, insuranceExpiry:'2026-12-01', ytdPaid:3180 },
  { id:'ven-004', name:'CleanVent Services', category:'HVAC', contact:'Dan Clean', phone:'(512) 555-0304', email:'dan@cleanvent.com', rating:4.5, contractEnd:null, insured:true, licensed:false, insuranceExpiry:'2026-08-20', ytdPaid:560 },
  { id:'ven-005', name:'SafetyFirst Inc', category:'Fire Safety', contact:'Lisa Safe', phone:'(512) 555-0305', email:'lisa@safetyfirst.com', rating:5.0, contractEnd:'2026-12-31', insured:true, licensed:true, insuranceExpiry:'2027-02-01', ytdPaid:320 },
]

export const DELINQUENCY_AGING = [
  { bucket:'Current', units:112, amount:31920, pct:90.3 },
  { bucket:'1-30 days', units:4, amount:1140, pct:3.2 },
  { bucket:'31-60 days', units:3, amount:1710, pct:2.4 },
  { bucket:'61-90 days', units:2, amount:1140, pct:1.6 },
  { bucket:'90+ days', units:3, amount:1995, pct:2.4 },
]

export const ACTIVITY_FEED = [
  { id:1, type:'payment', text:'James Chen (4B) paid $285.00 via ACH', time:'2 min ago', icon:'payment' },
  { id:2, type:'request', text:'New maintenance request: "AC not cooling" from Unit 7C', time:'18 min ago', icon:'request' },
  { id:3, type:'vote', text:'47 residents have voted on Pool Hours Extension', time:'1 hour ago', icon:'vote' },
  { id:4, type:'violation', text:'Violation notice sent to Unit 3B for parking infraction', time:'2 hours ago', icon:'violation' },
  { id:5, type:'document', text:'Q1 2026 Financial Report uploaded to Document Library', time:'5 hours ago', icon:'document' },
  { id:6, type:'announcement', text:'Emergency water shut-off announcement sent to 118 residents', time:'1 day ago', icon:'announcement' },
  { id:7, type:'alert', text:'Robert Johnson (9A) autopay failed — NSF returned', time:'1 day ago', icon:'alert' },
  { id:8, type:'move', text:'New resident onboarded: Amanda Foster moved into Unit 11B', time:'3 days ago', icon:'move' },
]

export const PENDING_APPROVALS = [
  { id:'pa-001', type:'ARC Request', title:'Solar panel installation — Unit 4B', submittedBy:'James Chen', unit:'4B', date:'2026-04-10', status:'Pending Committee', priority:'Normal' },
  { id:'pa-002', type:'Vendor Payment', title:'GreenScape April Invoice — $4,200', submittedBy:'Sarah Mitchell', vendor:'GreenScape Austin', date:'2026-04-12', status:'Pending Board', priority:'High' },
  { id:'pa-003', type:'Maintenance Approval', title:'Dryer vent cleaning — $95', submittedBy:'System', unit:'2A', date:'2026-04-08', status:'Pending Manager', priority:'Normal' },
]

export const COMMUNITY_EVENTS = [
  { id:'ev-001', title:'Board Meeting — April 2026', date:'2026-04-23', time:'7:00 PM', location:'Clubhouse', type:'Meeting', rsvpCount:28, capacity:80, description:'Monthly board meeting. All homeowners welcome.' },
  { id:'ev-002', title:'Pool Opening Party', date:'2026-05-23', time:'10:00 AM', location:'Community Pool', type:'Social', rsvpCount:45, capacity:80, description:'Celebrate pool season with food and fun.' },
  { id:'ev-003', title:'Annual HOA Meeting', date:'2026-06-15', time:'6:00 PM', location:'Clubhouse', type:'Meeting', rsvpCount:62, capacity:120, description:'Annual meeting includes board elections and budget vote.' },
]

export const JOURNAL_ENTRIES = [
  { id:'je-001', date:'2026-04-01', memo:'Reserve fund monthly contribution', debit:'Reserve Fund', credit:'Operating Checking', amount:1100, createdBy:'Sandra Torres', status:'Posted' },
  { id:'je-002', date:'2026-03-31', memo:'Q1 insurance premium prepayment', debit:'Prepaid Insurance', credit:'Operating Checking', amount:2400, createdBy:'Sarah Mitchell', status:'Posted' },
  { id:'je-003', date:'2026-04-10', memo:'Lobby renovation deposit — escrow', debit:'Escrow Account', credit:'Reserve Fund', amount:15000, createdBy:'Sandra Torres', status:'Posted' },
]

export const CHART_OF_ACCOUNTS = [
  { id:'acc-001', code:'1000', name:'Operating Checking', type:'Asset', balance:43200 },
  { id:'acc-002', code:'1100', name:'Reserve Fund', type:'Asset', balance:187500 },
  { id:'acc-003', code:'1200', name:'Accounts Receivable', type:'Asset', balance:4845 },
  { id:'acc-004', code:'1300', name:'Prepaid Insurance', type:'Asset', balance:3200 },
  { id:'acc-005', code:'2000', name:'Accounts Payable', type:'Liability', balance:2400 },
  { id:'acc-006', code:'3000', name:'Fund Balance', type:'Equity', balance:236345 },
  { id:'acc-007', code:'4000', name:'Assessment Income', type:'Income', balance:198450 },
  { id:'acc-008', code:'4100', name:'Late Fee Income', type:'Income', balance:3150 },
  { id:'acc-009', code:'5000', name:'Landscaping', type:'Expense', balance:16800 },
  { id:'acc-010', code:'5100', name:'Utilities', type:'Expense', balance:12720 },
  { id:'acc-011', code:'5200', name:'Insurance', type:'Expense', balance:9600 },
  { id:'acc-012', code:'5300', name:'Maintenance & Repairs', type:'Expense', balance:7400 },
  { id:'acc-013', code:'5400', name:'Management Fee', type:'Expense', balance:6000 },
  { id:'acc-014', code:'5500', name:'Reserve Contribution', type:'Expense', balance:4400 },
  { id:'acc-015', code:'5600', name:'Professional Fees', type:'Expense', balance:2400 },
]
