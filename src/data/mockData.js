// CanHoa Mock Data — Full Platform Demo Data

export const COMMUNITY = {
  name: 'Oakwood Heights HOA',
  address: '1200 Oakwood Drive, Austin, TX 78701',
  totalUnits: 124,
  occupiedUnits: 118,
  monthlyDues: 285,
  dueDay: 1,
  gracePeriod: 10,
  lateFee: 35,
  founded: '2018-03-01',
  plan: 'Growth',
  state: 'Texas',
  type: 'Condominium Association',
  ein: '83-1234567'
}

export const FINANCIAL_SUMMARY = {
  mtdCollected: 28974,
  mtdExpenses: 14230,
  netMTD: 14744,
  reserveBalance: 187500,
  operatingBalance: 43200,
  ytdCollected: 198450,
  ytdExpenses: 121800,
  collectionRate: 93.2,
  totalUnpaid: 4845,
  delinquentUnits: 6
}

export const MONTHLY_COLLECTIONS = [
  { month: 'Jun', collected: 31200, target: 35340 },
  { month: 'Jul', collected: 33800, target: 35340 },
  { month: 'Aug', collected: 34100, target: 35340 },
  { month: 'Sep', collected: 29800, target: 35340 },
  { month: 'Oct', collected: 32400, target: 35340 },
  { month: 'Nov', collected: 31900, target: 35340 },
  { month: 'Dec', collected: 33200, target: 35340 },
  { month: 'Jan', collected: 34800, target: 35340 },
  { month: 'Feb', collected: 31100, target: 35340 },
  { month: 'Mar', collected: 33600, target: 35340 },
  { month: 'Apr', collected: 30200, target: 35340 },
  { month: 'May', collected: 28974, target: 35340 },
]

export const EXPENSE_CATEGORIES = [
  { name: 'Landscaping', amount: 4200, budget: 4500, color: '#22c55e' },
  { name: 'Utilities', amount: 3180, budget: 3500, color: '#3b82f6' },
  { name: 'Insurance', amount: 2400, budget: 2400, color: '#f59e0b' },
  { name: 'Maintenance', amount: 1850, budget: 2000, color: '#8b5cf6' },
  { name: 'Management', amount: 1500, budget: 1500, color: '#ef4444' },
  { name: 'Reserve', amount: 1100, budget: 1200, color: '#0d9488' },
]

export const RESIDENTS = [
  { id: 'r1', name: 'James Chen', unit: '4B', email: 'j.chen@email.com', phone: '(512) 555-0101', moveIn: '2022-06-01', balance: 285, status: 'current', autopay: true, avatar: 'JC' },
  { id: 'r2', name: 'Maria Rodriguez', unit: '2A', email: 'm.rodriguez@email.com', phone: '(512) 555-0102', moveIn: '2021-03-15', balance: 855, status: 'delinquent', autopay: false, avatar: 'MR', daysOverdue: 45 },
  { id: 'r3', name: 'David Thompson', unit: '7C', email: 'd.thompson@email.com', phone: '(512) 555-0103', moveIn: '2023-01-10', balance: 0, status: 'current', autopay: true, avatar: 'DT' },
  { id: 'r4', name: 'Lisa Park', unit: '1D', email: 'l.park@email.com', phone: '(512) 555-0104', moveIn: '2020-09-01', balance: 0, status: 'current', autopay: false, avatar: 'LP' },
  { id: 'r5', name: 'Robert Johnson', unit: '9A', email: 'r.johnson@email.com', phone: '(512) 555-0105', moveIn: '2022-11-20', balance: 570, status: 'delinquent', autopay: false, avatar: 'RJ', daysOverdue: 30 },
  { id: 'r6', name: 'Emily Watson', unit: '3B', email: 'e.watson@email.com', phone: '(512) 555-0106', moveIn: '2021-07-14', balance: 285, status: 'current', autopay: true, avatar: 'EW' },
  { id: 'r7', name: 'Michael Brown', unit: '6C', email: 'm.brown@email.com', phone: '(512) 555-0107', moveIn: '2023-04-01', balance: 0, status: 'current', autopay: true, avatar: 'MB' },
  { id: 'r8', name: 'Jennifer Lee', unit: '8D', email: 'j.lee@email.com', phone: '(512) 555-0108', moveIn: '2020-02-28', balance: 1140, status: 'delinquent', autopay: false, avatar: 'JL', daysOverdue: 67 },
  { id: 'r9', name: 'Carlos Mendez', unit: '5A', email: 'c.mendez@email.com', phone: '(512) 555-0109', moveIn: '2022-08-15', balance: 285, status: 'current', autopay: false, avatar: 'CM' },
  { id: 'r10', name: 'Amanda Foster', unit: '11B', email: 'a.foster@email.com', phone: '(512) 555-0110', moveIn: '2021-12-01', balance: 0, status: 'current', autopay: true, avatar: 'AF' },
]

export const MAINTENANCE_REQUESTS = [
  { id: 'maint-001', unit: '4B', resident: 'James Chen', category: 'Plumbing', title: 'Kitchen faucet leaking', description: 'The kitchen faucet has been dripping constantly for 3 days.', priority: 'High', status: 'In Progress', created: '2026-04-10', assignedTo: 'Mike\'s Plumbing', cost: 0, photos: 2 },
  { id: 'maint-002', unit: 'Common', resident: 'Building Mgmt', category: 'Electrical', title: 'Lobby lights flickering', description: 'Main lobby ceiling lights are flickering intermittently.', priority: 'Emergency', status: 'Assigned', created: '2026-04-12', assignedTo: 'TechElectric Pro', cost: 0, photos: 1 },
  { id: 'maint-003', unit: '7C', resident: 'David Thompson', category: 'HVAC', title: 'AC not cooling properly', description: 'Unit AC runs but room stays warm above 78°F.', priority: 'Normal', status: 'New', created: '2026-04-13', assignedTo: null, cost: 0, photos: 0 },
  { id: 'maint-004', unit: '9A', resident: 'Robert Johnson', category: 'Landscaping', title: 'Tree branch over balcony', description: 'Large branch from community tree is hanging over balcony creating hazard.', priority: 'High', status: 'Resolved', created: '2026-04-05', assignedTo: 'GreenScape Austin', cost: 180, photos: 3 },
  { id: 'maint-005', unit: '2A', resident: 'Maria Rodriguez', category: 'Appliance', title: 'Dryer vent blocked', description: 'Dryer takes 3+ cycles to dry clothes. Vent likely clogged.', priority: 'Normal', status: 'Pending Approval', created: '2026-04-08', assignedTo: 'CleanVent Services', cost: 95, photos: 0 },
  { id: 'maint-006', unit: 'Common', resident: 'Building Mgmt', category: 'Safety', title: 'Fire extinguisher inspection', description: 'Annual fire extinguisher inspection due for all floors.', priority: 'High', status: 'Scheduled', created: '2026-04-01', assignedTo: 'SafetyFirst Inc', cost: 320, photos: 0 },
]

export const VIOLATIONS = [
  { id: 'vio-001', unit: '3B', resident: 'Emily Watson', type: 'Parking', description: 'Vehicle parked in fire lane for 48+ hours. License plate TX-4821-KZ.', status: 'Open', fine: 75, created: '2026-04-08', dueDate: '2026-04-22', noticesSent: 1 },
  { id: 'vio-002', unit: '9A', resident: 'Robert Johnson', type: 'Noise', description: 'Excessive noise complaints from neighbors on 3 consecutive nights after 11pm.', status: 'Hearing Scheduled', fine: 100, created: '2026-03-28', dueDate: '2026-04-11', noticesSent: 2 },
  { id: 'vio-003', unit: '6C', resident: 'Michael Brown', type: 'Modification', description: 'Installed satellite dish on balcony railing without ARB approval.', status: 'Resolved', fine: 0, created: '2026-03-15', dueDate: '2026-03-29', noticesSent: 1, resolvedDate: '2026-03-27' },
  { id: 'vio-004', unit: '1D', resident: 'Lisa Park', type: 'Landscaping', description: 'Potted plants exceed balcony railing height per CC&R Section 4.2.1.', status: 'Open', fine: 50, created: '2026-04-11', dueDate: '2026-04-25', noticesSent: 1 },
]

export const ANNOUNCEMENTS = [
  { id: 'ann-001', title: 'Pool Opening — Memorial Day Weekend', body: 'The community pool will officially open for the 2026 season on Saturday, May 23rd at 10:00 AM. Pool hours will be 8 AM to 10 PM daily through Labor Day. Please review the updated pool rules posted at the gate.', type: 'Community', channels: ['Email', 'SMS', 'Portal'], sent: '2026-04-10', openRate: 78, author: 'Sarah Mitchell' },
  { id: 'ann-002', title: 'April Board Meeting — Agenda Posted', body: 'The April Board of Directors meeting is scheduled for Wednesday, April 23rd at 7:00 PM in the Clubhouse. The agenda has been posted to the document library. All homeowners are welcome to attend. Virtual attendance available via Zoom.', type: 'Meeting', channels: ['Email', 'Portal'], sent: '2026-04-09', openRate: 62, author: 'Patricia Williams' },
  { id: 'ann-003', title: '🚨 Emergency: Water Shut-Off Tuesday 8 AM - 2 PM', body: 'IMPORTANT: Austin Water has scheduled an emergency water main repair on Oakwood Drive Tuesday, April 15. Water will be shut off to all units from 8:00 AM to approximately 2:00 PM. Please plan accordingly and store water in advance.', type: 'Emergency', channels: ['Email', 'SMS', 'Phone', 'Portal'], sent: '2026-04-12', openRate: 94, author: 'Sarah Mitchell' },
  { id: 'ann-004', title: 'Parking Lot Resurfacing — April 28-30', body: 'The main parking lot will be resurfaced April 28-30. Vehicles must be removed by 7 AM on April 28. Temporary parking will be available on Oak Street. Please contact management if you need assistance making arrangements.', type: 'Maintenance', channels: ['Email', 'SMS'], sent: '2026-04-07', openRate: 71, author: 'Sarah Mitchell' },
]

export const DOCUMENTS = [
  { id: 'doc-001', name: 'CC&Rs — Oakwood Heights HOA', folder: 'Governing Documents', type: 'PDF', size: '2.4 MB', uploaded: '2024-01-15', access: 'Residents', version: 3 },
  { id: 'doc-002', name: 'Bylaws (Amended 2024)', folder: 'Governing Documents', type: 'PDF', size: '1.8 MB', uploaded: '2024-03-20', access: 'Residents', version: 5 },
  { id: 'doc-003', name: 'Rules & Regulations 2026', folder: 'Governing Documents', type: 'PDF', size: '890 KB', uploaded: '2026-01-10', access: 'Residents', version: 2 },
  { id: 'doc-004', name: 'April 2026 Board Meeting Minutes', folder: 'Meeting Minutes', type: 'PDF', size: '340 KB', uploaded: '2026-04-02', access: 'Residents', version: 1 },
  { id: 'doc-005', name: 'Q1 2026 Financial Report', folder: 'Financial Records', type: 'PDF', size: '1.2 MB', uploaded: '2026-04-05', access: 'Board', version: 1 },
  { id: 'doc-006', name: '2026 Annual Budget', folder: 'Financial Records', type: 'Excel', size: '456 KB', uploaded: '2025-12-20', access: 'Board', version: 2 },
  { id: 'doc-007', name: 'Master Insurance Policy 2026', folder: 'Insurance', type: 'PDF', size: '3.1 MB', uploaded: '2026-01-01', access: 'Board', expires: '2027-01-01' },
  { id: 'doc-008', name: 'Landscaping Contract — GreenScape', folder: 'Vendor Contracts', type: 'PDF', size: '780 KB', uploaded: '2026-02-15', access: 'Admin', expires: '2026-12-31' },
]

export const VOTES = [
  { id: 'vote-001', title: 'Pool Hours Extension — Summer 2026', description: 'Proposal to extend pool hours on weekends from 10 PM to 11 PM during June, July, and August.', type: 'Resolution', status: 'Active', yesVotes: 47, noVotes: 18, abstain: 5, eligible: 118, deadline: '2026-04-25', quorum: 30, quorumMet: true, anonymous: false },
  { id: 'vote-002', title: '2026-2027 Board of Directors Election', description: 'Annual election for 3 open board seats. Candidates: Patricia Williams, James Kim, Sandra Torres, Robert Nash, Laura Chen.', type: 'Election', status: 'Active', yesVotes: 0, noVotes: 0, abstain: 0, eligible: 124, deadline: '2026-04-30', quorum: 25, quorumMet: false, anonymous: true },
  { id: 'vote-003', title: 'Special Assessment — Lobby Renovation', description: 'One-time special assessment of $450 per unit to fund complete lobby renovation including new flooring, lighting, and security system.', type: 'Assessment', status: 'Closed', yesVotes: 68, noVotes: 24, abstain: 12, eligible: 118, deadline: '2026-03-31', quorum: 30, quorumMet: true, passed: true, anonymous: false },
]

export const AMENITIES = [
  { id: 'am-001', name: 'Community Pool', type: 'Pool', capacity: 40, maxBookingHours: 4, advanceBookingDays: 14, requiresDeposit: false, available: true, hours: '8 AM - 10 PM' },
  { id: 'am-002', name: 'Fitness Center', type: 'Gym', capacity: 15, maxBookingHours: 2, advanceBookingDays: 7, requiresDeposit: false, available: true, hours: '5 AM - 11 PM' },
  { id: 'am-003', name: 'Clubhouse — Main Hall', type: 'Event Space', capacity: 80, maxBookingHours: 6, advanceBookingDays: 60, requiresDeposit: true, depositAmount: 250, available: true, hours: '8 AM - 10 PM' },
  { id: 'am-004', name: 'Tennis Court', type: 'Sports', capacity: 4, maxBookingHours: 2, advanceBookingDays: 7, requiresDeposit: false, available: true, hours: '7 AM - 9 PM' },
  { id: 'am-005', name: 'BBQ Pavilion', type: 'Outdoor', capacity: 20, maxBookingHours: 4, advanceBookingDays: 30, requiresDeposit: false, available: false, hours: '8 AM - 8 PM', unavailableReason: 'Under maintenance until May 1' },
]

export const PAYMENT_HISTORY = [
  { id: 'pay-001', unit: '4B', resident: 'James Chen', amount: 285, method: 'ACH', date: '2026-04-01', status: 'Completed', type: 'Monthly Dues', receipt: 'RCP-2026-0401' },
  { id: 'pay-002', unit: '7C', resident: 'David Thompson', amount: 285, method: 'Card', date: '2026-04-01', status: 'Completed', type: 'Monthly Dues', receipt: 'RCP-2026-0402' },
  { id: 'pay-003', unit: '11B', resident: 'Amanda Foster', amount: 285, method: 'ACH', date: '2026-04-02', status: 'Completed', type: 'Monthly Dues', receipt: 'RCP-2026-0403' },
  { id: 'pay-004', unit: '9A', resident: 'Robert Johnson', amount: 285, method: 'ACH', date: '2026-04-03', status: 'Failed', type: 'Monthly Dues', receipt: null, failReason: 'Insufficient funds' },
  { id: 'pay-005', unit: '5A', resident: 'Carlos Mendez', amount: 285, method: 'Card', date: '2026-04-05', status: 'Completed', type: 'Monthly Dues', receipt: 'RCP-2026-0405' },
  { id: 'pay-006', unit: '3B', resident: 'Emily Watson', amount: 285, method: 'ACH', date: '2026-04-07', status: 'Completed', type: 'Monthly Dues', receipt: 'RCP-2026-0406' },
  { id: 'pay-007', unit: '6C', resident: 'Michael Brown', amount: 285, method: 'ACH', date: '2026-04-01', status: 'Completed', type: 'Monthly Dues', receipt: 'RCP-2026-0407' },
  { id: 'pay-008', unit: '1D', resident: 'Lisa Park', amount: 285, method: 'Card', date: '2026-04-10', status: 'Completed', type: 'Monthly Dues', receipt: 'RCP-2026-0408' },
  { id: 'pay-009', unit: 'Various', resident: 'Multiple', amount: 56700, method: 'ACH', date: '2026-04-01', status: 'Completed', type: 'Bulk Assessment', receipt: 'RCP-2026-SPEC-001' },
  { id: 'pay-010', unit: '8D', resident: 'Jennifer Lee', amount: 35, method: 'Manual', date: '2026-04-11', status: 'Completed', type: 'Late Fee', receipt: 'RCP-2026-0410' },
]

export const BOARD_MEMBERS = [
  { id: 'bm-001', name: 'Patricia Williams', role: 'President', email: 'p.williams@oakwood.com', term: '2025-2027', phone: '(512) 555-0201', avatar: 'PW' },
  { id: 'bm-002', name: 'Marcus Reynolds', role: 'Vice President', email: 'm.reynolds@oakwood.com', term: '2025-2027', phone: '(512) 555-0202', avatar: 'MR' },
  { id: 'bm-003', name: 'Sandra Torres', role: 'Treasurer', email: 's.torres@oakwood.com', term: '2024-2026', phone: '(512) 555-0203', avatar: 'ST' },
  { id: 'bm-004', name: 'Kevin Park', role: 'Secretary', email: 'k.park@oakwood.com', term: '2024-2026', phone: '(512) 555-0204', avatar: 'KP' },
  { id: 'bm-005', name: 'Rachel Adams', role: 'Member at Large', email: 'r.adams@oakwood.com', term: '2025-2027', phone: '(512) 555-0205', avatar: 'RA' },
]

export const VENDORS = [
  { id: 'ven-001', name: 'GreenScape Austin', category: 'Landscaping', contact: 'Tom Green', phone: '(512) 555-0301', email: 'info@greenscape.com', rating: 4.8, contractEnd: '2026-12-31', insured: true, licensed: true },
  { id: 'ven-002', name: "Mike's Plumbing", category: 'Plumbing', contact: 'Mike Johnson', phone: '(512) 555-0302', email: 'mike@mikesplumbing.com', rating: 4.6, contractEnd: null, insured: true, licensed: true },
  { id: 'ven-003', name: 'TechElectric Pro', category: 'Electrical', contact: 'Sarah Tech', phone: '(512) 555-0303', email: 'service@techelectric.com', rating: 4.9, contractEnd: '2026-06-30', insured: true, licensed: true },
  { id: 'ven-004', name: 'CleanVent Services', category: 'HVAC', contact: 'Dan Clean', phone: '(512) 555-0304', email: 'dan@cleanvent.com', rating: 4.5, contractEnd: null, insured: true, licensed: false },
  { id: 'ven-005', name: 'SafetyFirst Inc', category: 'Fire Safety', contact: 'Lisa Safe', phone: '(512) 555-0305', email: 'lisa@safetyfirst.com', rating: 5.0, contractEnd: '2026-12-31', insured: true, licensed: true },
]

export const DELINQUENCY_AGING = [
  { bucket: 'Current', units: 112, amount: 31920, pct: 90.3 },
  { bucket: '1-30 days', units: 4, amount: 1140, pct: 3.2 },
  { bucket: '31-60 days', units: 3, amount: 1710, pct: 2.4 },
  { bucket: '61-90 days', units: 2, amount: 1140, pct: 1.6 },
  { bucket: '90+ days', units: 3, amount: 1995, pct: 2.4 },
]

export const ACTIVITY_FEED = [
  { id: 1, type: 'payment', text: 'James Chen (4B) paid $285.00 via ACH', time: '2 min ago', icon: 'payment' },
  { id: 2, type: 'request', text: 'New maintenance request: "AC not cooling" from Unit 7C', time: '18 min ago', icon: 'request' },
  { id: 3, type: 'vote', text: '47 residents have voted on Pool Hours Extension', time: '1 hour ago', icon: 'vote' },
  { id: 4, type: 'violation', text: 'Violation notice sent to Unit 3B for parking infraction', time: '2 hours ago', icon: 'violation' },
  { id: 5, type: 'document', text: 'Q1 2026 Financial Report uploaded to Document Library', time: '5 hours ago', icon: 'document' },
  { id: 6, type: 'announcement', text: 'Emergency water shut-off announcement sent to 118 residents', time: '1 day ago', icon: 'announcement' },
  { id: 7, type: 'payment', text: 'Robert Johnson (9A) autopay failed — NSF returned', time: '1 day ago', icon: 'alert' },
  { id: 8, type: 'move', text: 'New resident onboarded: Amanda Foster moved into Unit 11B', time: '3 days ago', icon: 'move' },
]
