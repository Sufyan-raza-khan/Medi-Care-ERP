(function () {
  'use strict';
  const DB_KEY = 'mediCareErpHtml_v1';
  const TAX_RATE = 0.05;
  const $ = (id) => document.getElementById(id);
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
  const uid = (prefix) => `${prefix}-${Date.now().toString().slice(-7)}${Math.floor(Math.random() * 90 + 10)}`;
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const money = (value) => `Rs. ${Number(value || 0).toLocaleString('en-PK', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  const niceDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString('en-PK', {day:'2-digit',month:'short',year:'numeric'}) : '—';
  const niceTime = (value) => value ? new Date(value).toLocaleString('en-PK', {day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}) : '—';
  const nowIso = () => new Date().toISOString();
  const durationHours = (start, end) => Math.max(0, (new Date(end || Date.now()) - new Date(start)) / 3600000);
  const initials = (value) => String(value || '?').trim().charAt(0).toUpperCase();

  // 216 additional catalogue entries used as editable demo stock records.
  // Prices, batches, quantities, expiry dates and supplier assignments are sample data.
  function expandedMedicineCatalog(offsetDate) {
    const companies = [
      'GSK Pakistan', 'Getz Pharma', 'Martin Dow', 'The Searle Company',
      'Highnoon Laboratories', 'Abbott Laboratories Pakistan', 'AGP Limited',
      'Sami Pharmaceuticals', 'Hilton Pharma', 'Ferozsons Laboratories',
      'Atco Laboratories', 'Shaigan Pharmaceuticals'
    ];
    const groups = [
      ['Ibuprofen','Analgesic',8,['200mg Tablet','400mg Tablet','600mg Tablet']],
      ['Diclofenac','Analgesic',9,['25mg Tablet','50mg Tablet','75mg Tablet']],
      ['Naproxen','Analgesic',11,['250mg Tablet','500mg Tablet','550mg Tablet']],
      ['Mefenamic Acid','Analgesic',10,['250mg Capsule','500mg Capsule','100mg/5ml Suspension']],
      ['Aspirin','Analgesic',5,['75mg Tablet','300mg Tablet','500mg Tablet']],
      ['Ketoprofen','Analgesic',14,['50mg Capsule','100mg Capsule','200mg Capsule']],
      ['Amoxicillin','Antibiotic',16,['250mg Capsule','500mg Capsule','125mg/5ml Suspension']],
      ['Azithromycin','Antibiotic',28,['250mg Tablet','500mg Tablet','200mg/5ml Suspension']],
      ['Cefixime','Antibiotic',25,['200mg Tablet','400mg Tablet','100mg/5ml Suspension']],
      ['Cefuroxime','Antibiotic',26,['250mg Tablet','500mg Tablet','125mg/5ml Suspension']],
      ['Ciprofloxacin','Antibiotic',14,['250mg Tablet','500mg Tablet','750mg Tablet']],
      ['Metronidazole','Antibiotic',8,['200mg Tablet','400mg Tablet','500mg Tablet']],
      ['Doxycycline','Antibiotic',13,['100mg Capsule','200mg Capsule','100mg Dispersible Tablet']],
      ['Clarithromycin','Antibiotic',32,['250mg Tablet','500mg Tablet','125mg/5ml Suspension']],
      ['Flucloxacillin','Antibiotic',15,['250mg Capsule','500mg Capsule','125mg/5ml Suspension']],
      ['Co-amoxiclav','Antibiotic',35,['375mg Tablet','625mg Tablet','1g Tablet']],
      ['Pantoprazole','Gastro',17,['20mg Tablet','40mg Tablet','40mg Injection']],
      ['Omeprazole','Gastro',12,['10mg Capsule','20mg Capsule','40mg Capsule']],
      ['Esomeprazole','Gastro',21,['20mg Tablet','40mg Tablet','40mg Injection']],
      ['Famotidine','Gastro',8,['20mg Tablet','40mg Tablet','40mg/5ml Suspension']],
      ['Domperidone','Gastro',9,['10mg Tablet','1mg/ml Suspension','10mg Dispersible Tablet']],
      ['Ondansetron','Gastro',12,['4mg Tablet','8mg Tablet','4mg ODT']],
      ['Loperamide','Gastro',8,['2mg Capsule','2mg Tablet','1mg/5ml Oral Solution']],
      ['Lactulose','Gastro',45,['3.35g/5ml Syrup','10g/15ml Solution','15ml Sachet']],
      ['Cetirizine','Antihistamine',7,['5mg Tablet','10mg Tablet','5mg/5ml Syrup']],
      ['Loratadine','Antihistamine',9,['5mg Tablet','10mg Tablet','5mg/5ml Syrup']],
      ['Fexofenadine','Antihistamine',15,['60mg Tablet','120mg Tablet','180mg Tablet']],
      ['Levocetirizine','Antihistamine',10,['2.5mg Tablet','5mg Tablet','2.5mg/5ml Syrup']],
      ['Chlorpheniramine','Antihistamine',6,['4mg Tablet','2mg/5ml Syrup','10mg/ml Injection']],
      ['Montelukast','Respiratory',17,['4mg Chewable Tablet','5mg Chewable Tablet','10mg Tablet']],
      ['Salbutamol','Respiratory',16,['2mg Tablet','4mg Tablet','2mg/5ml Syrup']],
      ['Ambroxol','Respiratory',13,['30mg Tablet','15mg/5ml Syrup','7.5mg/ml Drops']],
      ['Bromhexine','Respiratory',11,['8mg Tablet','4mg/5ml Syrup','4mg/ml Drops']],
      ['Dextromethorphan','Respiratory',18,['10mg Tablet','15mg Tablet','7.5mg/5ml Syrup']],
      ['Metformin','Diabetes',7,['500mg Tablet','850mg Tablet','1000mg Tablet']],
      ['Glimepiride','Diabetes',8,['1mg Tablet','2mg Tablet','4mg Tablet']],
      ['Gliclazide','Diabetes',11,['30mg MR Tablet','60mg MR Tablet','80mg Tablet']],
      ['Sitagliptin','Diabetes',42,['25mg Tablet','50mg Tablet','100mg Tablet']],
      ['Amlodipine','Cardiovascular',7,['2.5mg Tablet','5mg Tablet','10mg Tablet']],
      ['Atenolol','Cardiovascular',6,['25mg Tablet','50mg Tablet','100mg Tablet']],
      ['Losartan','Cardiovascular',9,['25mg Tablet','50mg Tablet','100mg Tablet']],
      ['Telmisartan','Cardiovascular',14,['20mg Tablet','40mg Tablet','80mg Tablet']],
      ['Bisoprolol','Cardiovascular',10,['2.5mg Tablet','5mg Tablet','10mg Tablet']],
      ['Ramipril','Cardiovascular',8,['1.25mg Capsule','2.5mg Capsule','5mg Capsule']],
      ['Atorvastatin','Cardiovascular',11,['10mg Tablet','20mg Tablet','40mg Tablet']],
      ['Rosuvastatin','Cardiovascular',14,['5mg Tablet','10mg Tablet','20mg Tablet']],
      ['Clopidogrel','Cardiovascular',13,['75mg Tablet','150mg Tablet','300mg Tablet']],
      ['Furosemide','Cardiovascular',6,['20mg Tablet','40mg Tablet','80mg Tablet']],
      ['Spironolactone','Cardiovascular',8,['25mg Tablet','50mg Tablet','100mg Tablet']],
      ['Levothyroxine','Endocrine',7,['25mcg Tablet','50mcg Tablet','100mcg Tablet']],
      ['Vitamin C','Supplement',7,['250mg Tablet','500mg Tablet','1000mg Tablet']],
      ['Vitamin D3','Supplement',12,['1000 IU Tablet','2000 IU Capsule','5000 IU Capsule']],
      ['Calcium Carbonate','Supplement',9,['500mg Tablet','600mg Tablet','1250mg Tablet']],
      ['Ferrous Sulfate','Supplement',6,['200mg Tablet','300mg Tablet','325mg Tablet']],
      ['Folic Acid','Supplement',5,['1mg Tablet','5mg Tablet','10mg Tablet']],
      ['Zinc Sulfate','Supplement',7,['10mg Tablet','20mg Tablet','50mg Tablet']],
      ['Multivitamin','Supplement',15,['Multivitamin Tablet','Multivitamin Capsule','Multivitamin Syrup']],
      ['Vitamin B Complex','Supplement',8,['B-Complex Tablet','B-Complex Syrup','B-Complex Injection']],
      ['Oral Rehydration Salts','Hydration',18,['20.5g Sachet','10.5g Sachet','4.1g Sachet']],
      ['Clotrimazole','Dermatology',20,['1% Cream','100mg Vaginal Tablet','500mg Vaginal Tablet']],
      ['Miconazole','Dermatology',22,['2% Cream','2% Powder','2% Oral Gel']],
      ['Hydrocortisone','Dermatology',15,['1% Cream','10mg Tablet','100mg Injection']],
      ['Betamethasone','Dermatology',18,['0.1% Cream','0.5mg Tablet','4mg/ml Injection']],
      ['Permethrin','Dermatology',25,['5% Cream','1% Lotion','1% Shampoo']],
      ['Povidone Iodine','Antiseptic',25,['10% Solution','5% Gargle','10% Ointment']],
      ['Chlorhexidine','Antiseptic',20,['0.2% Mouthwash','4% Solution','1% Surgical Scrub']],
      ['Artificial Tears','Ophthalmic',35,['0.5% Eye Drops','1% Eye Drops','Lubricant Eye Gel']],
      ['Timolol','Ophthalmic',32,['0.25% Eye Drops','0.5% Eye Drops','0.5% Eye Gel']],
      ['Ciprofloxacin','Ophthalmic',28,['0.3% Eye Drops','0.3% Eye Ointment','0.3% Ear Drops']],
      ['Diclofenac','Topical',30,['1% Gel','2% Gel','1.16% Spray']],
      ['Lidocaine','Local Anaesthetic',35,['2% Gel','1% Injection','5% Ointment']],
      ['Normal Saline','IV Fluid',70,['0.9% 100ml Infusion','0.9% 500ml Infusion','0.9% 1000ml Infusion']]
    ];
    const result = [];
    let index = 0;
    groups.forEach(([generic, category, baseCost, variants], groupIndex) => {
      variants.forEach((variant, variantIndex) => {
        index += 1;
        const cost = Number((baseCost * (1 + variantIndex * 0.42) + (groupIndex % 5)).toFixed(2));
        const stock = index % 47 === 0 ? 0 : index % 17 === 0 ? 5 + (index % 7) : 28 + ((index * 37) % 260);
        result.push({
          id: `CAT-${String(index).padStart(4,'0')}`,
          name: `${generic} ${variant}`,
          category,
          batch: `MC-${String(26000 + index)}`,
          company: companies[(index + groupIndex) % companies.length],
          expiry: offsetDate(180 + ((index * 29) % 700)),
          cost,
          price: Number((cost * 1.35 + 2).toFixed(2)),
          stock,
          minStock: 15 + ((index % 6) * 5)
        });
      });
    });
    return result;
  }

  function seedData() {
    const d = new Date();
    const offsetDate = (n) => { const x = new Date(d); x.setDate(x.getDate() + n); return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`; };
    return {
      users: [
        {id:'U-001',name:'Administrator',username:'admin',password:'MediCare@2026!',role:'Admin',active:true,joined:offsetDate(-90)},
        {id:'U-002',name:'Sara Ahmed',username:'sara',password:'Sara@12345',role:'Pharmacist',active:true,joined:offsetDate(-50)},
        {id:'U-003',name:'Usman Ali',username:'usman',password:'Usman@12345',role:'Cashier',active:true,joined:offsetDate(-25)}
      ],
      medicines: [
        {id:'MED-1001',name:'Panadol 500mg',category:'Analgesic',batch:'PND-24A',company:'GSK Pakistan',expiry:offsetDate(420),cost:12,price:18,stock:145,minStock:30},
        {id:'MED-1002',name:'Augmentin 625mg',category:'Antibiotic',batch:'AUG-11B',company:'GSK Pakistan',expiry:offsetDate(300),cost:85,price:110,stock:8,minStock:15},
        {id:'MED-1003',name:'Disprin 300mg',category:'Analgesic',batch:'DSP-77C',company:'Reckitt',expiry:offsetDate(550),cost:7,price:12,stock:220,minStock:40},
        {id:'MED-1004',name:'Rigix 10mg',category:'Antihistamine',batch:'RGX-09D',company:'Getz Pharma',expiry:offsetDate(230),cost:9,price:15,stock:0,minStock:20},
        {id:'MED-1005',name:'Calpol Syrup',category:'Pediatric',batch:'CAL-61F',company:'GSK Pakistan',expiry:offsetDate(180),cost:95,price:125,stock:42,minStock:12},
        {id:'MED-1006',name:'ORS Sachet',category:'Hydration',batch:'ORS-33H',company:'Searle',expiry:offsetDate(700),cost:18,price:25,stock:73,minStock:20},
        {id:'MED-1007',name:'Omeprazole 20mg',category:'Gastro',batch:'OMP-14K',company:'Getz Pharma',expiry:offsetDate(365),cost:22,price:32,stock:58,minStock:15},
        {id:'MED-1008',name:'Vitamin C 500mg',category:'Supplement',batch:'VTC-08A',company:'Sami Pharma',expiry:offsetDate(600),cost:14,price:22,stock:18,minStock:20},
        ...expandedMedicineCatalog(offsetDate)
      ],
      purchaseOrders: [
        {id:'PO-24001',supplier:'GSK Pakistan',items:[{medicineId:'MED-1002',name:'Augmentin 625mg',qty:50,unitCost:85}],date:offsetDate(-2),expected:offsetDate(3),status:'In transit'},
        {id:'PO-24002',supplier:'Getz Pharma',items:[{medicineId:'MED-1004',name:'Rigix 10mg',qty:100,unitCost:9}],date:offsetDate(-1),expected:offsetDate(5),status:'Ordered'},
        {id:'PO-24003',supplier:'Searle',items:[{medicineId:'MED-1006',name:'ORS Sachet',qty:60,unitCost:18}],date:offsetDate(-12),expected:offsetDate(-7),status:'Received'}
      ],
      sales: [], attendance: [], activity: [], session: null, currentUserId: null
    };
  }

  let db;
  try {
    const stored = localStorage.getItem(DB_KEY);
    db = stored ? JSON.parse(stored) : seedData();
    if (!db || !Array.isArray(db.users) || !Array.isArray(db.medicines)) db = seedData();
  } catch (error) {
    db = seedData();
    console.warn('Medi-Care local storage unavailable; using in-memory demo data.', error);
  }
  function migrateExpandedCatalog() {
    if (!Array.isArray(db.medicines)) db.medicines = [];
    const existingIds = new Set(db.medicines.map((medicine) => String(medicine.id)));
    const catalogue = seedData().medicines.filter((medicine) => String(medicine.id).startsWith('CAT-'));
    let added = 0;
    catalogue.forEach((medicine) => {
      if (!existingIds.has(String(medicine.id))) {
        db.medicines.push(medicine);
        existingIds.add(String(medicine.id));
        added += 1;
      }
    });
    if (added) {
      db.catalogVersion = 2;
      try { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
      catch (error) { console.warn('Could not save expanded catalogue to local storage.', error); }
    }
  }
  migrateExpandedCatalog();
  function save() {
    try { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
    catch (error) { console.warn('Could not persist Medi-Care data in local storage.', error); toast('Browser storage is unavailable. Changes may not persist after closing this tab.'); }
  }
  function currentUser() { return db.users.find((u) => u.id === db.currentUserId) || null; }
  function logActivity(action, details = '') {
    db.activity.unshift({id:uid('LOG'),at:nowIso(),user:currentUser()?.name || 'System',action,details});
    db.activity = db.activity.slice(0, 500);
    save();
  }
  function toast(message) {
    const host = $('toastHost'); if (!host) return;
    const item = document.createElement('div'); item.className = 'toast-msg'; item.textContent = message; host.appendChild(item);
    setTimeout(() => item.remove(), 3200);
  }
  function stockState(m) { return m.stock <= 0 ? 'out' : m.stock <= m.minStock ? 'low' : 'ok'; }
  function statusBadge(value) {
    const map = {'Out of stock':'out','Low stock':'low','In stock':'ok','Received':'received','In transit':'in-transit','Ordered':'ordered','Cancelled':'cancelled','Active':'active','Inactive':'inactive','Open':'low'};
    return `<span class="status status-${map[value] || 'ok'}">${esc(value)}</span>`;
  }
  function allSalesTotal(sales = db.sales) { return sales.reduce((sum, s) => sum + Number(s.total || 0), 0); }
  function todaySales() { return db.sales.filter((s) => s.date === today()); }
  function cogs(sale) { return (sale.items || []).reduce((sum, it) => sum + (Number(it.cost) * Number(it.qty)), 0); }
  function profit(sale) { return Number(sale.subtotal || 0) - cogs(sale); }
  function nav(page) {
    const target = $(`page-${page}`);
    if (!target) return;
    document.querySelectorAll('.page-section').forEach((el) => el.classList.add('d-none'));
    target.classList.remove('d-none');
    document.querySelectorAll('.side-nav .nav-link').forEach((el) => el.classList.toggle('active', el.dataset.page === page));
    const active = document.querySelector(`.side-nav .nav-link[data-page="${page}"]`);
    $('pageHeading').textContent = active ? active.textContent.trim().replace(/\s+\d+$/, '') : 'Dashboard';
    $('sidebar').classList.remove('open');
    renderPage(page);
  }
  function renderPage(page) {
    const renderers = {dashboard:renderDashboard,inventory:renderInventory,purchases:renderPurchases,pos:renderPos,reports:renderReports,attendance:renderAttendance,users:renderUsers,activity:renderActivity};
    (renderers[page] || renderDashboard)();
  }
  function renderHeader() {
    const user = currentUser(); if (!user) return;
    $('topUserName').textContent = user.name; $('topUserRole').textContent = user.role;
    $('topAvatar').textContent = initials(user.name); $('welcomeName').textContent = user.name.split(' ')[0];
    $('currentDate').textContent = new Date().toLocaleDateString('en-PK',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
    $('footerYear').textContent = new Date().getFullYear();
    $('navLowStock').textContent = db.medicines.filter((m) => stockState(m) !== 'ok').length;
  }
  function renderDashboard() {
    const salesToday = todaySales(); const inventory = db.medicines;
    $('metricTodaySales').textContent = money(allSalesTotal(salesToday));
    $('metricSalesCount').textContent = `${salesToday.length} transaction${salesToday.length === 1 ? '' : 's'} today`;
    $('metricRevenue').textContent = money(allSalesTotal());
    $('metricProfit').textContent = money(db.sales.reduce((sum,s) => sum + profit(s),0));
    $('metricProducts').textContent = inventory.reduce((sum,m) => sum + Number(m.stock || 0),0).toLocaleString('en-PK');
    $('metricStockFoot').textContent = `${inventory.length} medicine records`;
    const alertItems = inventory.filter((m) => stockState(m) !== 'ok').sort((a,b) => a.stock - b.stock);
    $('dashboardLowStock').innerHTML = alertItems.length ? alertItems.slice(0,5).map((m) => `<div class="alert-item"><div><div class="alert-name">${esc(m.name)}</div><div class="alert-detail">${esc(m.company)} · Reorder at ${m.minStock}</div></div><span class="stock-pill">${m.stock <= 0 ? 'Out of stock' : `${m.stock} left`}</span></div>`).join('') : '<div class="empty-state">All medicine stock levels look healthy.</div>';
    const days = Array.from({length:7},(_,i) => {const dt = new Date();dt.setDate(dt.getDate() - (6-i));return dt;});
    const totals = days.map((d) => {const key=d.toISOString().slice(0,10);return db.sales.filter(s=>s.date===key).reduce((a,s)=>a+s.total,0);});
    const max = Math.max(...totals, 1);
    $('salesChart').innerHTML = days.map((d,i) => `<div class="chart-column"><div class="chart-bar ${i===6?'today':''}" style="height:${Math.max(3,totals[i]/max*145)}px" data-value="${esc(money(totals[i]))}"></div><span class="chart-label">${d.toLocaleDateString('en-PK',{weekday:'short'})}</span></div>`).join('');
    $('recentSalesTable').innerHTML = db.sales.slice(0,5).map((s) => `<tr><td><strong>${esc(s.id)}</strong></td><td>${niceTime(s.at)}</td><td>${esc(s.cashier)}</td><td>${esc(s.payment)}</td><td class="text-end"><strong>${money(s.total)}</strong></td></tr>`).join('') || '<tr><td colspan="5"><div class="empty-state">No completed sales yet. Go to Billing / POS to create your first sale.</div></td></tr>';
    renderHeader();
  }
  function renderInventory() {
    const query = ($('inventorySearch').value || '').toLowerCase(); const filter = $('inventoryFilter').value;
    const rows = db.medicines.filter((m) => `${m.name} ${m.company} ${m.batch} ${m.category}`.toLowerCase().includes(query)).filter((m) => filter === 'all' || (filter === 'low' && stockState(m)==='low') || (filter === 'out' && stockState(m)==='out') || (filter === 'ok' && stockState(m)==='ok'));
    $('inventoryCount').textContent = `${rows.length} record${rows.length===1?'':'s'}`;
    $('inventoryTable').innerHTML = rows.map((m) => `<tr><td><div class="medicine-cell"><div class="med-avatar">${initials(m.name)}</div><div><strong>${esc(m.name)}</strong><span class="sub-cell">${esc(m.category)}</span></div></div></td><td>${esc(m.batch)}<span class="sub-cell">${esc(m.company)}</span></td><td>${niceDate(m.expiry)}</td><td>${money(m.cost)}</td><td><strong>${money(m.price)}</strong></td><td><strong>${m.stock}</strong><span class="sub-cell">Min. ${m.minStock}</span></td><td>${statusBadge(stockState(m)==='out'?'Out of stock':stockState(m)==='low'?'Low stock':'In stock')}</td><td class="text-end"><button class="action-btn" data-action="edit-medicine" data-id="${esc(m.id)}">Edit</button><button class="action-btn" data-action="delete-medicine" data-id="${esc(m.id)}">Delete</button></td></tr>`).join('') || '<tr><td colspan="8"><div class="empty-state">No medicines match your search.</div></td></tr>';
    $('navLowStock').textContent = db.medicines.filter((m) => stockState(m)!=='ok').length;
  }
  function renderPurchases() {
    const status = $('poFilter').value;
    const orders = db.purchaseOrders.filter((p) => status==='all' || p.status===status);
    $('poOpenCount').textContent = db.purchaseOrders.filter(p=>p.status==='Ordered').length;
    $('poTransitCount').textContent = db.purchaseOrders.filter(p=>p.status==='In transit').length;
    $('poReceivedCount').textContent = db.purchaseOrders.filter(p=>p.status==='Received').length;
    const pending = db.purchaseOrders.filter(p=>['Ordered','In transit'].includes(p.status)).reduce((a,p)=>a+p.items.reduce((x,i)=>x+i.qty*i.unitCost,0),0);
    $('poPendingValue').textContent = money(pending);
    $('purchaseTable').innerHTML = orders.map((p) => {const value=p.items.reduce((a,i)=>a+i.qty*i.unitCost,0);return `<tr><td><strong>${esc(p.id)}</strong></td><td>${esc(p.supplier)}</td><td>${p.items.reduce((a,i)=>a+i.qty,0)} units<span class="sub-cell">${esc(p.items.map(i=>i.name).join(', '))}</span></td><td>${niceDate(p.date)}</td><td>${niceDate(p.expected)}</td><td><strong>${money(value)}</strong></td><td>${statusBadge(p.status)}</td><td>${p.status==='Received'||p.status==='Cancelled'?'—':`<button class="action-btn" data-action="receive-po" data-id="${esc(p.id)}">Receive</button><button class="action-btn" data-action="po-status" data-id="${esc(p.id)}">Status</button>`}</td></tr>`;}).join('') || '<tr><td colspan="8"><div class="empty-state">No purchase orders found.</div></td></tr>';
  }
  let cart = [];
  function renderPos() {
    const query = ($('posSearch').value || '').toLowerCase();
    const available = db.medicines.filter((m) => m.stock > 0 && `${m.name} ${m.company}`.toLowerCase().includes(query));
    $('posProducts').innerHTML = available.map((m) => `<div class="product-option"><div class="med-avatar">${initials(m.name)}</div><div class="product-option-info"><strong>${esc(m.name)}</strong><small>${m.stock} in stock · ${esc(m.company)}</small><div class="product-price">${money(m.price)}</div></div><button class="add-cart" title="Add to bill" data-action="cart-add" data-id="${esc(m.id)}">＋</button></div>`).join('') || '<div class="empty-state">No available medicine found.</div>';
    renderCart();
  }
  function cartTotals() {
    const subtotal=cart.reduce((a,i)=>a+i.price*i.qty,0); const tax=subtotal*TAX_RATE; return {subtotal,tax,total:subtotal+tax};
  }
  function renderCart() {
    const count=cart.reduce((a,i)=>a+i.qty,0); const t=cartTotals();
    $('cartItemCount').textContent=`${count} item${count===1?'':'s'} in basket`;
    $('cartItems').innerHTML = cart.length ? cart.map((i)=>`<div class="cart-line"><div><strong>${esc(i.name)}</strong><small>${money(i.price)} each</small><div class="qty-control"><button data-action="cart-qty" data-id="${esc(i.id)}" data-delta="-1">−</button><span>${i.qty}</span><button data-action="cart-qty" data-id="${esc(i.id)}" data-delta="1">＋</button></div></div><div class="cart-price">${money(i.price*i.qty)}</div></div>`).join('') : '<div class="empty-state">Your basket is empty.<br><span>Select a medicine to begin.</span></div>';
    $('cartSubtotal').textContent=money(t.subtotal); $('cartTax').textContent=money(t.tax); $('cartTotal').textContent=money(t.total); $('checkoutBtn').disabled=!cart.length;
  }
  function addToCart(id) {
    const m=db.medicines.find(x=>x.id===id); if(!m||m.stock<=0){toast('This medicine is out of stock.');return;}
    const item=cart.find(x=>x.id===id); if(item){if(item.qty>=m.stock){toast('Not enough stock available.');return;}item.qty++;}else cart.push({id:m.id,name:m.name,price:Number(m.price),cost:Number(m.cost),qty:1});
    renderCart();
  }
  function changeCartQty(id, delta) {
    const item=cart.find(x=>x.id===id); if(!item)return; const m=db.medicines.find(x=>x.id===id);
    if(delta>0 && item.qty>=m.stock){toast('Not enough stock available.');return;}
    item.qty+=delta; if(item.qty<=0)cart=cart.filter(x=>x.id!==id); renderCart();
  }
  function renderReports() {
    const revenue=allSalesTotal(); const totalCogs=db.sales.reduce((a,s)=>a+cogs(s),0); const totalProfit=db.sales.reduce((a,s)=>a+profit(s),0);
    $('reportRevenue').textContent=money(revenue); $('reportCogs').textContent=money(totalCogs); $('reportMargin').textContent=money(totalProfit); $('reportTransactions').textContent=db.sales.length;
    const q=($('reportSearch').value||'').toLowerCase();
    $('reportSalesTable').innerHTML=db.sales.filter(s=>`${s.id} ${s.cashier}`.toLowerCase().includes(q)).map(s=>`<tr><td><strong>${esc(s.id)}</strong></td><td>${niceTime(s.at)}</td><td>${esc(s.cashier)}</td><td>${s.items.reduce((a,i)=>a+i.qty,0)} units</td><td>${esc(s.payment)}</td><td>${money(s.subtotal)}</td><td>${money(s.tax)}</td><td class="text-end"><strong>${money(s.total)}</strong></td><td><button class="action-btn" data-action="reprint" data-id="${esc(s.id)}">Receipt</button></td></tr>`).join('') || '<tr><td colspan="9"><div class="empty-state">No transactions found.</div></td></tr>';
  }
  function renderAttendance() {
    const date=$('attendanceDate').value||today(); const rows=db.attendance.filter(a=>a.date===date).sort((a,b)=>b.loginAt.localeCompare(a.loginAt));
    const hours=rows.reduce((sum,a)=>sum+durationHours(a.loginAt,a.logoutAt),0);
    $('attendanceSessions').textContent=rows.length; $('attendanceHours').textContent=`${hours.toFixed(1)}h`; $('attendanceStaff').textContent=db.users.filter(u=>u.active).length;
    $('attendanceActive').textContent=rows.filter(a=>!a.logoutAt).length;
    $('sessionDuration').textContent=db.session?`${durationHours(db.session.loginAt).toFixed(2)}h`:'No active session';
    $('attendanceTable').innerHTML=rows.map(a=>`<tr><td><strong>${esc(a.name)}</strong></td><td>${esc(a.role)}</td><td>${niceTime(a.loginAt)}</td><td>${a.logoutAt?niceTime(a.logoutAt):'—'}</td><td><strong>${durationHours(a.loginAt,a.logoutAt).toFixed(2)} h</strong></td><td>${statusBadge(a.logoutAt?'Completed':'Active')}</td></tr>`).join('') || '<tr><td colspan="6"><div class="empty-state">No attendance sessions for this date.</div></td></tr>';
  }
  function renderUsers() {
    $('usersTable').innerHTML=db.users.map(u=>`<tr><td><div class="medicine-cell"><div class="med-avatar">${initials(u.name)}</div><div><strong>${esc(u.name)}</strong><span class="sub-cell">${esc(u.id)}</span></div></div></td><td>${esc(u.username)}</td><td>${esc(u.role)}</td><td>${statusBadge(u.active?'Active':'Inactive')}</td><td>${niceDate(u.joined)}</td><td class="text-end">${u.id==='U-001'?'Protected':`<button class="action-btn" data-action="toggle-user" data-id="${esc(u.id)}">${u.active?'Deactivate':'Activate'}</button>`}</td></tr>`).join('');
  }
  function renderActivity() {
    $('activityTable').innerHTML=db.activity.slice(0,150).map(a=>`<tr><td>${niceTime(a.at)}</td><td><strong>${esc(a.user)}</strong></td><td>${esc(a.action)}</td><td>${esc(a.details||'—')}</td></tr>`).join('') || '<tr><td colspan="4"><div class="empty-state">No activity recorded yet.</div></td></tr>';
  }
  function openDialog(title, body, eyebrow='MEDI-CARE') {
    $('dialogTitle').textContent=title; $('dialogEyebrow').textContent=eyebrow; $('dialogBody').innerHTML=body;
    const dialog=$('appDialog'); if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');
  }
  function closeDialog() { const dialog=$('appDialog'); if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open'); }
  function medicineForm(m={}) {
    const isEdit=!!m.id;
    openDialog(isEdit?'Edit medicine':'Add medicine', `<form id="medicineForm" class="dialog-form"><input type="hidden" name="id" value="${esc(m.id||'')}"><div class="form-grid">
      <div class="form-field full"><label class="form-label">Medicine name *</label><input class="form-control" name="name" required value="${esc(m.name||'')}" placeholder="e.g. Paracetamol 500mg"></div>
      <div class="form-field"><label class="form-label">Category</label><input class="form-control" name="category" value="${esc(m.category||'')}" placeholder="Analgesic"></div>
      <div class="form-field"><label class="form-label">Company</label><input class="form-control" name="company" value="${esc(m.company||'')}" placeholder="Manufacturer"></div>
      <div class="form-field"><label class="form-label">Batch number</label><input class="form-control" name="batch" value="${esc(m.batch||'')}" placeholder="Batch"></div>
      <div class="form-field"><label class="form-label">Expiry date</label><input class="form-control" type="date" name="expiry" value="${esc(m.expiry||'')}"></div>
      <div class="form-field"><label class="form-label">Purchase cost (Rs.) *</label><input class="form-control" type="number" min="0" step="0.01" name="cost" required value="${esc(m.cost??'')}"></div>
      <div class="form-field"><label class="form-label">Sale price (Rs.) *</label><input class="form-control" type="number" min="0" step="0.01" name="price" required value="${esc(m.price??'')}"></div>
      <div class="form-field"><label class="form-label">Current stock *</label><input class="form-control" type="number" min="0" step="1" name="stock" required value="${esc(m.stock??0)}"></div>
      <div class="form-field"><label class="form-label">Reorder level *</label><input class="form-control" type="number" min="0" step="1" name="minStock" required value="${esc(m.minStock??10)}"></div>
      </div><div class="dialog-actions"><button type="button" class="btn btn-outline-red" data-action="close-dialog">Cancel</button><button class="btn btn-red" type="submit">${isEdit?'Save changes':'Add medicine'}</button></div></form>`);
  }
  function purchaseForm() {
    const options=db.medicines.map(m=>`<option value="${esc(m.id)}">${esc(m.name)} (${esc(m.company)})</option>`).join('');
    openDialog('Create purchase order', `<form id="purchaseForm" class="dialog-form"><div class="form-grid"><div class="form-field full"><label class="form-label">Supplier / company *</label><input class="form-control" name="supplier" required placeholder="Supplier name"></div><div class="form-field full"><label class="form-label">Medicine *</label><select name="medicineId" class="form-select" required>${options}</select></div><div class="form-field"><label class="form-label">Quantity *</label><input name="qty" class="form-control" type="number" min="1" required value="50"></div><div class="form-field"><label class="form-label">Unit purchase cost (Rs.) *</label><input name="unitCost" class="form-control" type="number" min="0" step="0.01" required value="0"></div><div class="form-field"><label class="form-label">Order date *</label><input name="date" class="form-control" type="date" required value="${today()}"></div><div class="form-field"><label class="form-label">Expected delivery *</label><input name="expected" class="form-control" type="date" required value="${today()}"></div></div><div class="dialog-actions"><button type="button" class="btn btn-outline-red" data-action="close-dialog">Cancel</button><button class="btn btn-red" type="submit">Create order</button></div></form>`);
  }
  function userForm() {
    openDialog('Add staff member', `<form id="userForm" class="dialog-form"><div class="form-grid"><div class="form-field full"><label class="form-label">Full name *</label><input class="form-control" name="name" required></div><div class="form-field"><label class="form-label">Username *</label><input class="form-control" name="username" required minlength="3"></div><div class="form-field"><label class="form-label">Temporary password *</label><input class="form-control" name="password" type="password" required minlength="8"></div><div class="form-field full"><label class="form-label">Role *</label><select class="form-select" name="role"><option>Pharmacist</option><option>Cashier</option><option>Admin</option></select></div></div><div class="dialog-actions"><button type="button" class="btn btn-outline-red" data-action="close-dialog">Cancel</button><button class="btn btn-red" type="submit">Create account</button></div></form>`);
  }
  function checkout() {
    if (!cart.length) return;
    for (const item of cart) { const m=db.medicines.find(x=>x.id===item.id); if(!m||m.stock<item.qty){toast(`Insufficient stock for ${item.name}.`);return;} }
    const totals=cartTotals(); const sale={id:uid('MC'),at:nowIso(),date:today(),cashier:currentUser()?.name||'Unknown',payment:$('paymentMethod').value,items:cart.map(i=>({...i})),subtotal:totals.subtotal,tax:totals.tax,total:totals.total};
    cart.forEach(i=>{const m=db.medicines.find(x=>x.id===i.id);m.stock-=i.qty;});
    db.sales.unshift(sale); logActivity('Sale completed',`${sale.id} · ${sale.payment} · ${money(sale.total)}`); cart=[]; save(); renderHeader(); renderCart(); renderDashboard(); renderInventory(); printReceipt(sale); toast('Checkout completed. Receipt is ready to print.');
  }
  function printReceipt(sale) {
    $('receiptPrintArea').innerHTML=`<div class="receipt"><h2>Medi-Care</h2><div class="receipt-sub">MEDICAL STORE · SALES RECEIPT</div><hr><div>Receipt: ${esc(sale.id)}</div><div>Date: ${esc(niceTime(sale.at))}</div><div>Cashier: ${esc(sale.cashier)}</div><div>Payment: ${esc(sale.payment)}</div><hr><table><thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Amount</th></tr></thead><tbody>${sale.items.map(i=>`<tr><td>${esc(i.name)}</td><td class="r">${i.qty}</td><td class="r">${money(i.price*i.qty)}</td></tr>`).join('')}</tbody></table><hr><table><tr><td>Subtotal</td><td class="r">${money(sale.subtotal)}</td></tr><tr><td>Tax (5%)</td><td class="r">${money(sale.tax)}</td></tr><tr class="receipt-total"><td>Total</td><td class="r">${money(sale.total)}</td></tr></table><hr><div class="receipt-foot">Thank you for shopping with Medi-Care.<br>Keep this receipt for your records.</div></div>`;
    // Printing is initiated after a user-triggered checkout or receipt action.
    window.setTimeout(()=>window.print(),150);
  }
  function exportCsv(filename, rows) {
    if(!rows.length){toast('There is no data to export.');return;}
    const csv=rows.map(row=>row.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\r\n');
    const blob=new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;a.click();URL.revokeObjectURL(url);
  }
  function onClick(event) {
    const pageBtn=event.target.closest('[data-page]'); if(pageBtn){nav(pageBtn.dataset.page);return;}
    const btn=event.target.closest('[data-action]'); if(!btn)return;
    const {action,id}=btn.dataset;
    switch(action){
      case 'logout': logout(); break;
      case 'add-medicine': medicineForm(); break;
      case 'edit-medicine': {const m=db.medicines.find(x=>x.id===id);if(m)medicineForm(m);break;}
      case 'delete-medicine': {const m=db.medicines.find(x=>x.id===id);if(m&&confirm(`Delete ${m.name}? Historical sale lines will remain in sales records.`)){db.medicines=db.medicines.filter(x=>x.id!==id);save();logActivity('Medicine deleted',m.name);renderInventory();toast('Medicine deleted.');}break;}
      case 'add-purchase': purchaseForm(); break;
      case 'receive-po': {const p=db.purchaseOrders.find(x=>x.id===id);if(p&&confirm(`Mark ${p.id} as received and add quantities to inventory?`)){p.items.forEach(i=>{const m=db.medicines.find(x=>x.id===i.medicineId);if(m)m.stock+=Number(i.qty);});p.status='Received';p.receivedAt=nowIso();save();logActivity('Purchase order received',p.id);renderPurchases();renderDashboard();renderInventory();renderPos();toast('Stock updated from received shipment.');}break;}
      case 'po-status': {const p=db.purchaseOrders.find(x=>x.id===id);if(!p)break;const next=p.status==='Ordered'?'In transit':'Ordered';p.status=next;save();logActivity('Purchase order status changed',`${p.id}: ${next}`);renderPurchases();toast(`Order status changed to ${next}.`);break;}
      case 'cart-add': addToCart(id); break;
      case 'cart-qty': changeCartQty(id,Number(btn.dataset.delta)); break;
      case 'clear-cart': cart=[];renderCart();break;
      case 'checkout': checkout();break;
      case 'reprint': {const sale=db.sales.find(s=>s.id===id);if(sale)printReceipt(sale);break;}
      case 'export-sales': exportCsv('medi-care-sales.csv',[['Receipt','Timestamp','Cashier','Payment','Items','Subtotal','Tax','Total'],...db.sales.map(s=>[s.id,s.at,s.cashier,s.payment,s.items.map(i=>`${i.name} x${i.qty}`).join('; '),s.subtotal,s.tax,s.total])]);break;
      case 'export-activity': exportCsv('medi-care-activity.csv',[['Timestamp','User','Activity','Details'],...db.activity.map(a=>[a.at,a.user,a.action,a.details])]);break;
      case 'add-user': if(currentUser()?.role!=='Admin'){toast('Only administrators can add staff.');break;}userForm();break;
      case 'toggle-user': {if(currentUser()?.role!=='Admin'){toast('Only administrators can manage staff.');break;}const u=db.users.find(x=>x.id===id);if(u){u.active=!u.active;save();logActivity('Staff account updated',`${u.username}: ${u.active?'activated':'deactivated'}`);renderUsers();toast('Staff account updated.');}break;}
      case 'close-dialog': closeDialog(); break;
    }
  }
  function onSubmit(event) {
    const form=event.target;
    if(form.id==='loginForm'){event.preventDefault();login();return;}
    if(form.id==='medicineForm'){
      event.preventDefault();
      const fd = new FormData(form);
      const id = String(fd.get('id') || '').trim();
      const existingIndex = id ? db.medicines.findIndex((medicine) => String(medicine.id) === id) : -1;
      const old = existingIndex >= 0 ? db.medicines[existingIndex] : null;
      const stockValue = Number(fd.get('stock'));
      const minimumValue = Number(fd.get('minStock'));
      const costValue = Number(fd.get('cost'));
      const priceValue = Number(fd.get('price'));
      if (!Number.isFinite(stockValue) || stockValue < 0 || !Number.isInteger(stockValue)) {
        toast('Current stock must be a valid whole number (0 or more).');
        return;
      }
      if (!Number.isFinite(minimumValue) || minimumValue < 0 || !Number.isInteger(minimumValue)) {
        toast('Reorder level must be a valid whole number (0 or more).');
        return;
      }
      if (!Number.isFinite(costValue) || costValue < 0 || !Number.isFinite(priceValue) || priceValue < 0) {
        toast('Purchase cost and sale price must be valid amounts.');
        return;
      }
      const item = {
        ...(old || {}),
        id: old ? old.id : uid('MED'),
        name: String(fd.get('name') || '').trim(),
        category: String(fd.get('category') || '').trim(),
        company: String(fd.get('company') || '').trim(),
        batch: String(fd.get('batch') || '').trim(),
        expiry: String(fd.get('expiry') || ''),
        cost: costValue,
        price: priceValue,
        stock: stockValue,
        minStock: minimumValue
      };
      if (item.price < item.cost && !confirm('Sale price is below purchase cost. Save anyway?')) return;
      if (old) db.medicines.splice(existingIndex, 1, item);
      else db.medicines.unshift(item);
      save();
      logActivity(old ? 'Medicine updated' : 'Medicine created', `${item.name} · Stock: ${item.stock}`);
      closeDialog();
      // Show the edited row even if the new quantity changes its previous stock filter.
      $('inventoryFilter').value = 'all';
      renderInventory();
      renderDashboard();
      renderPos();
      toast(old ? `Medicine updated. New stock quantity: ${item.stock}.` : 'Medicine added to inventory.');
      return;
    }
    if(form.id==='purchaseForm'){
      event.preventDefault();const fd=new FormData(form);const m=db.medicines.find(x=>x.id===fd.get('medicineId'));if(!m)return;
      const p={id:uid('PO'),supplier:fd.get('supplier').trim(),items:[{medicineId:m.id,name:m.name,qty:Number(fd.get('qty')),unitCost:Number(fd.get('unitCost'))}],date:fd.get('date'),expected:fd.get('expected'),status:'Ordered'};
      db.purchaseOrders.unshift(p);save();logActivity('Purchase order created',p.id);closeDialog();renderPurchases();toast('Purchase order created.');return;
    }
    if(form.id==='userForm'){
      event.preventDefault();const fd=new FormData(form);const username=fd.get('username').trim().toLowerCase();if(db.users.some(u=>u.username.toLowerCase()===username)){toast('That username already exists.');return;}
      db.users.push({id:uid('U'),name:fd.get('name').trim(),username,password:fd.get('password'),role:fd.get('role'),active:true,joined:today()});save();logActivity('Staff account created',username);closeDialog();renderUsers();toast('Staff account created.');return;
    }
  }
  function login() {
    const username=$('loginUsername').value.trim().toLowerCase();const password=$('loginPassword').value;const user=db.users.find(u=>u.username.toLowerCase()===username&&u.password===password&&u.active);
    if(!user){$('loginError').textContent='Invalid username or password, or account is inactive.';return;}
    $('loginError').textContent='';db.currentUserId=user.id;
    db.session={id:uid('ATT'),userId:user.id,name:user.name,role:user.role,loginAt:nowIso(),date:today()};
    db.attendance.unshift(db.session);save();
    $('loginScreen').classList.add('d-none');$('appShell').classList.remove('d-none');
    logActivity('User login',`${user.username} signed in`);renderHeader();nav('dashboard');
  }
  function logout() {
    const user=currentUser(); if(db.session){const record=db.attendance.find(a=>a.id===db.session.id);if(record)record.logoutAt=nowIso();}
    logActivity('User logout',`${user?.username||'User'} signed out`);db.session=null;db.currentUserId=null;save();cart=[];
    $('appShell').classList.add('d-none');$('loginScreen').classList.remove('d-none');$('loginPassword').value='';$('loginError').textContent='You have signed out.';
  }
  function bootstrapApp() {
    $('currentDate').textContent=new Date().toLocaleDateString('en-PK',{weekday:'short',day:'numeric',month:'short',year:'numeric'});$('footerYear').textContent=new Date().getFullYear();
    document.addEventListener('click',onClick);document.addEventListener('submit',onSubmit);
    $('inventorySearch').addEventListener('input',renderInventory);$('inventoryFilter').addEventListener('change',renderInventory);
    $('poFilter').addEventListener('change',renderPurchases);$('posSearch').addEventListener('input',renderPos);$('reportSearch').addEventListener('input',renderReports);
    $('attendanceDate').value=today();$('attendanceDate').addEventListener('change',renderAttendance);
    $('mobileMenu').addEventListener('click',()=>$('sidebar').classList.toggle('open'));
    // Restore an open demo session after a refresh so the local demo remains usable.
    if(db.session&&db.currentUserId&&currentUser()){$('loginScreen').classList.add('d-none');$('appShell').classList.remove('d-none');renderHeader();nav('dashboard');}
    else {$('loginScreen').classList.remove('d-none');$('appShell').classList.add('d-none');}
    setInterval(()=>{if(!$('page-attendance').classList.contains('d-none'))renderAttendance();},60000);
  }
  bootstrapApp();
})();
