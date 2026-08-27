import React, { useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";

const initialItems = [
  { id: 1, type: "Lost", name: "Black Backpack", category: "Bags", location: "College Library", date: "Aug 25, 2026", description: "Black backpack with a blue notebook inside.", icon: "🎒" },
  { id: 2, type: "Found", name: "iPhone 13", category: "Electronics", location: "Main Gate", date: "Aug 24, 2026", description: "Black iPhone found near the main gate.", icon: "📱" },
  { id: 3, type: "Lost", name: "Student ID Card", category: "Documents", location: "CSE Block", date: "Aug 23, 2026", description: "College ID card with a blue holder.", icon: "🪪" },
  { id: 4, type: "Found", name: "House Keys", category: "Keys", location: "Cafeteria", date: "Aug 22, 2026", description: "A set of three keys with a small keychain.", icon: "🔑" },
  { id: 5, type: "Lost", name: "Scientific Calculator", category: "Electronics", location: "ECE Lab", date: "Aug 21, 2026", description: "Casio scientific calculator with initials on the back.", icon: "🧮" },
  { id: 6, type: "Found", name: "Water Bottle", category: "Others", location: "Sports Ground", date: "Aug 20, 2026", description: "Steel bottle with a black cap.", icon: "🥤" }
];

function Navbar() {
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark">🔎</span>
        <span>Lost<span>&</span>Found</span>
      </Link>
      <nav>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/items">Browse Items</NavLink>
        <NavLink to="/report-lost">Report Lost</NavLink>
        <NavLink to="/report-found">Report Found</NavLink>
      </nav>
      <Link className="login-btn" to="/login">Login</Link>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div>
        <strong>Lost & Found Portal</strong>
        <p>Helping people reconnect with their lost belongings.</p>
      </div>
      <p>© 2026 Lost & Found Portal</p>
    </footer>
  );
}

function ItemCard({ item }) {
  return (
    <article className="item-card">
      <div className="item-icon">{item.icon}</div>
      <div className="item-content">
        <div className="item-top">
          <span className={`badge ${item.type.toLowerCase()}`}>{item.type}</span>
          <span className="category">{item.category}</span>
        </div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="meta">
          <span>📍 {item.location}</span>
          <span>📅 {item.date}</span>
        </div>
      </div>
      <Link className="view-btn" to={`/items/${item.id}`}>View</Link>
    </article>
  );
}

function Home({ items }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const recent = items.slice(0, 4);

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">COMMUNITY LOST & FOUND</div>
          <h1>Find what's lost.<br /><span>Return what's found.</span></h1>
          <p>A simple place to report, search and reconnect people with their missing belongings.</p>
          <div className="hero-actions">
            <Link className="primary-btn" to="/report-lost">+ Report Lost Item</Link>
            <Link className="secondary-btn" to="/report-found">Report Found Item</Link>
          </div>
        </div>
        <div className="hero-art">
          <div className="search-orb">🔍</div>
          <div className="float-card card-one">🎒 <b>Backpack</b><small>Library</small></div>
          <div className="float-card card-two">🔑 <b>Keys</b><small>Cafeteria</small></div>
          <div className="float-card card-three">📱 <b>Phone</b><small>Main Gate</small></div>
        </div>
      </section>

      <section className="search-section">
        <div>
          <div className="eyebrow">QUICK SEARCH</div>
          <h2>Looking for something?</h2>
        </div>
        <div className="search-box">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search item, category or location..." />
          <button onClick={() => navigate(`/items?search=${encodeURIComponent(query)}`)}>🔍 Search</button>
        </div>
      </section>

      <section className="stats">
        <div><strong>{items.filter(i => i.type === "Lost").length}</strong><span>Lost Reports</span></div>
        <div><strong>{items.filter(i => i.type === "Found").length}</strong><span>Found Reports</span></div>
        <div><strong>100%</strong><span>Community Driven</span></div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div><div className="eyebrow">LATEST REPORTS</div><h2>Recent Items</h2></div>
          <Link to="/items">View all →</Link>
        </div>
        <div className="items-grid">
          {recent.map(item => <ItemCard key={item.id} item={item} />)}
        </div>
      </section>
    </main>
  );
}

function Items({ items }) {
  const params = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(params.get("search") || "");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    return items.filter(item => {
      const matchesType = filter === "All" || item.type === filter;
      const text = `${item.name} ${item.category} ${item.location} ${item.description}`.toLowerCase();
      return matchesType && text.includes(query.toLowerCase());
    });
  }, [items, query, filter]);

  return (
    <main className="page">
      <div className="page-header">
        <div className="eyebrow">ITEM DIRECTORY</div>
        <h1>Browse Lost & Found Items</h1>
        <p>Search through the latest community reports.</p>
      </div>
      <div className="filters">
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="🔍 Search..." />
        {["All", "Lost", "Found"].map(f => (
          <button key={f} className={filter === f ? "filter active" : "filter"} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="items-list">
        {filtered.length ? filtered.map(item => <ItemCard key={item.id} item={item} />) : <div className="empty">No matching items found.</div>}
      </div>
    </main>
  );
}

function Report({ type, onAdd }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", category: "Others", location: "", date: "", description: "" });
  const [message, setMessage] = useState("");

  const submit = e => {
    e.preventDefault();
    if (!form.name || !form.location || !form.date) {
      setMessage("Please fill in all required fields.");
      return;
    }
    const icons = { Bags: "🎒", Electronics: "📱", Documents: "🪪", Keys: "🔑", Clothing: "👕", Others: "📦" };
    onAdd({ ...form, type, id: Date.now(), icon: icons[form.category] || "📦" });
    setMessage(`${type} item reported successfully!`);
    setTimeout(() => navigate("/items"), 800);
  };

  return (
    <main className="page narrow">
      <div className="page-header">
        <div className="eyebrow">{type.toUpperCase()} REPORT</div>
        <h1>Report a {type} Item</h1>
        <p>Provide accurate details so the item can be identified quickly.</p>
      </div>
      <form className="form-card" onSubmit={submit}>
        <label>Item Name *<input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Black Backpack" /></label>
        <label>Category
          <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option>Bags</option><option>Electronics</option><option>Documents</option><option>Keys</option><option>Clothing</option><option>Others</option>
          </select>
        </label>
        <label>Location *<input value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="Where was it lost/found?" /></label>
        <label>Date *<input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></label>
        <label>Description<textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Add useful identifying details..." /></label>
        {message && <div className="form-message">{message}</div>}
        <button className="primary-btn full" type="submit">Submit {type} Report</button>
      </form>
    </main>
  );
}

function Login() {
  return (
    <main className="page narrow">
      <div className="form-card login-card">
        <div className="login-logo">🔎</div>
        <div className="eyebrow">WELCOME BACK</div>
        <h1>Login</h1>
        <p className="muted">Sign in to manage your reports.</p>
        <label>Email<input type="email" placeholder="you@example.com" /></label>
        <label>Password<input type="password" placeholder="••••••••" /></label>
        <button className="primary-btn full">Login</button>
        <p className="muted center">Demo UI — authentication can be connected to Node.js + MongoDB later.</p>
      </div>
    </main>
  );
}

function Details({ items }) {
  const id = Number(window.location.pathname.split("/").pop());
  const item = items.find(i => i.id === id);
  if (!item) return <main className="page"><div className="empty">Item not found.</div></main>;

  return (
    <main className="page narrow">
      <div className="detail-card">
        <div className="detail-icon">{item.icon}</div>
        <span className={`badge ${item.type.toLowerCase()}`}>{item.type}</span>
        <h1>{item.name}</h1>
        <p>{item.description}</p>
        <div className="detail-info">
          <div><small>Category</small><b>{item.category}</b></div>
          <div><small>Location</small><b>{item.location}</b></div>
          <div><small>Date</small><b>{item.date}</b></div>
        </div>
        <button className="primary-btn full" onClick={() => alert("Contact feature can be connected to the backend.")}>Contact Reporter</button>
      </div>
    </main>
  );
}

export default function App() {
  const [items, setItems] = useState(initialItems);
  const addItem = item => setItems(current => [item, ...current]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home items={items} />} />
        <Route path="/items" element={<Items items={items} />} />
        <Route path="/items/:id" element={<Details items={items} />} />
        <Route path="/report-lost" element={<Report type="Lost" onAdd={addItem} />} />
        <Route path="/report-found" element={<Report type="Found" onAdd={addItem} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}