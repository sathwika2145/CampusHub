
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { api } from './api';
import { Home, Megaphone, CalendarDays, BookOpen, BriefcaseBusiness, MapPin, LogOut, Menu, X, UserRound, Plus, Search, ArrowUpRight, Users, Clock3, FileText, ShieldCheck, ChevronRight, Bell, GraduationCap, Compass,Pencil, Trash2} from 'lucide-react';
import campusBg from "../../NITW.jpg";
import campusLogo from "../../logo.png";
import './styles.css';
const modules = [
  { path: '/app', label: 'Overview', icon: Home, end: true },
  { path: '/app/announcements', label: 'Announcements', icon: Megaphone },
  { path: '/app/clubs-events', label: 'Clubs & events', icon: CalendarDays },
  { path: '/app/academics', label: 'Academic resources', icon: BookOpen },
  { path: '/app/opportunities', label: 'Career & opportunities', icon: BriefcaseBusiness },
  { path: '/app/directory', label: 'Campus directory', icon: MapPin },
   { path: '/app/admin', label: 'Admin', icon: Users, roles: ['Admin'] }
    ];
const roleNames = ['Student', 'Faculty', 'Career Coordinator', 'Admin'];
const departments = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Chemical', 'Biotechnology', 'Metallurgical & Materials', 'Other'];



function Auth({ onAuth }) {
  const [mode, setMode] = useState('login');

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Student',
    department: 'CSE'
  });

  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const update = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);

    try {
      const result =
        mode === 'login'
          ? await api.login({
              email: form.email,
              password: form.password
            })
          : await api.register(form);

      onAuth(result.user);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">

      {/* LEFT SIDE - BRANDING */}
      <section className="auth-story">

        <div className="brand brand-light">
          <span className="brand-mark">CH</span>
          <span>CampusHub</span>
        </div>

        <div className="story-copy">
          <span className="eyebrow light">
            YOUR CAMPUS, CONNECTED
          </span>

          <h1>
            Campus life,<br />
            <em>in one place.</em>
          </h1>

          <p>
            Keep up with what's happening. Make the most of your time at NITW.
          </p>
        </div>

        <div className="story-footer">
          <span>Learning · Community · Opportunity</span>
          <span>Never miss a beat.</span>
        </div>

        <div className="story-orbit orbit-one"></div>
        <div className="story-orbit orbit-two"></div>

      </section>


      {/* RIGHT SIDE - AUTHENTICATION FORM */}
      <section className="auth-form-side">

        <div className="mobile-brand brand">
          <span className="brand-mark">CH</span>
          <span>CampusHub</span>
        </div>

        <div className="auth-card">

          <span className="eyebrow">
            {mode === 'login'
              ? 'WELCOME BACK'
              : 'JOIN THE COMMUNITY'}
          </span>

          <h2>
            {mode === 'login'
              ? 'Sign in to CampusHub'
              : 'Create your account'}
          </h2>

          <p className="muted">
            {mode === 'login'
              ? 'Your campus is just a sign-in away.'
              : 'Create your account to get started.'}
          </p>


          {/* LOGIN / REGISTER TABS */}
          <div className="auth-tabs">

            <button
              type="button"
              className={mode === 'login' ? 'active' : ''}
              onClick={() => {
                setMode('login');
                setError('');
              }}
            >
              Sign in
            </button>

            <button
              type="button"
              className={mode === 'register' ? 'active' : ''}
              onClick={() => {
                setMode('register');
                setError('');
              }}
            >
              Create account
            </button>

          </div>


          {/* FORM */}
          <form onSubmit={submit} className="form-stack">

            {/* NAME - REGISTRATION ONLY */}
            {mode === 'register' && (
              <label>
                Your name

                <input
                  name="username"
                  value={form.username}
                  onChange={update}
                  placeholder="e.g. Ananya Rao"
                  required
                  maxLength="60"
                  autoComplete="name"
                />
              </label>
            )}
             {/* EMAIL - BOTH LOGIN AND REGISTRATION */}
            <label>
              College email

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </label>
             {/* PASSWORD - BOTH LOGIN AND REGISTRATION */}
            <label>
              Password

              <div className="password-field">

                <input
                  name="password"
                  type={show ? 'text' : 'password'}
                  value={form.password}
                  onChange={update}
                  placeholder={
                    mode === 'register'
                      ? 'At least 10 characters'
                      : 'Enter your password'
                  }
                  required
                  minLength={mode === 'register' ? 10 : 1}
                  autoComplete={
                    mode === 'login'
                      ? 'current-password'
                      : 'new-password'
                  }
                />

                <button
                  type="button"
                  className="text-button"
                  onClick={() => setShow(!show)}
                >
                  {show ? 'Hide' : 'Show'}
                </button>

              </div>
            </label>
            {/* ROLE - REGISTRATION ONLY */}
            {mode === 'register' && (
              <label>
                Select your role

                <select
                  name="role"
                  value={form.role}
                  onChange={update}
                  required
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Career Coordinator">Career Coordinator</option>
                </select>
              </label>
            )}


            {/* DEPARTMENT - STUDENTS ONLY */}
            {mode === 'register' && form.role === 'Student' && (
              <label>
                Department

                <select
                  name="department"
                  value={form.department}
                  onChange={update}
                  required
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div className="alert error">
                {error}
              </div>
            )}


            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="btn primary full"
              disabled={busy}
            >
              {busy
                ? 'Please wait…'
                : mode === 'login'
                  ? 'Sign in'
                  : 'Create account'}

              <ChevronRight size={17} />
            </button>

          </form>


          {/* FOOTER */}
          <p className="fine-print">
            By continuing, you agree to use CampusHub respectfully
            as part of the campus community.
          </p>

        </div>

      </section>

    </main>
  );
}



function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);
  const [notice, setNotice] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => { api.me().then(r => setUser(r.user)).catch(() => {}).finally(() => setChecking(false)); }, []);
  useEffect(() => { setMobileNav(false); }, [location.pathname]);
 useEffect(() => {
  document.body.style.backgroundImage = `
    linear-gradient(rgba(161, 211, 255, 0.78), rgba(255, 255, 255, 0.45)),
    url(${campusBg})
  `;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.backgroundRepeat = 'no-repeat';
}, []);
  async function logout() { try { await api.logout(); } finally { setUser(null); navigate('/'); } }
  if (checking) return <div className="loading-screen"><span className="brand-mark">CH</span><p>Getting your campus ready…</p></div>;
return (
  <Routes>
    <Route
      path="/"
      element={
        user ? (
          <Navigate to="/app" replace />
        ) : (
          <Auth
            onAuth={u => {
              setUser(u);
              navigate('/app');
            }}
          />
        )
      }
    />

    <Route
      path="/app/*"
      element={
        user ? (
          <div className="app-shell">
            <aside className={`sidebar ${mobileNav ? 'open' : ''}`}>
              <div className="CH">
                <div className="brand">
  <div className="logo-circle">
    <img src={campusLogo} alt="CampusHub" />
  </div>
  <span>CampusHub</span>
</div>

                <button
                  className="icon-button mobile-close"
                  onClick={() => setMobileNav(false)}
                  aria-label="Close navigation"
                >
                  <X />
                </button>
              </div>

              <nav className="side-nav">
                {modules.filter(m => !m.roles || m.roles.includes(user.role)).map(({ path, label, icon: Icon, end }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={end}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'selected' : ''}`
                    }
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                    {label === 'Announcements' && (
                      <span className="nav-new">NEW</span>
                    )}
                  </NavLink>
                ))}
              </nav>

              <div className="sidebar-bottom">
                <div className="user-mini">
                  <div className="avatar">
                    {user.username?.slice(0, 1).toUpperCase()}
                  </div>

                  <div className="user-mini-text">
                    <strong>{user.username}</strong>
                    <span>{user.role}</span>
                  </div>

                  <button
                    className="icon-button"
                    onClick={logout}
                    title="Sign out"
                    aria-label="Sign out"
                  >
                    <LogOut size={17} />
                  </button>
                </div>
              </div>
            </aside>

            {mobileNav && (
              <button
                className="scrim"
                onClick={() => setMobileNav(false)}
                aria-label="Close navigation"
              />
            )}

            <main className="main-area">
              <header className="topbar">
                <button
                  className="icon-button mobile-menu"
                  onClick={() => setMobileNav(true)}
                  aria-label="Open navigation"
                >
                  <Menu />
                </button>

                <div className="breadcrumbs">
                  CampusHub <span>/</span>{' '}
                  <strong>
                    {modules.find(m => m.path === location.pathname)?.label ||
                      'Your workspace'}
                  </strong>
                </div>

                <div className="top-actions">
                  <button
                    className="icon-button"
                    title="Profile"
                    aria-label="Profile"
                    onClick={() => navigate('/app/profile')}
                  >
                    <UserRound size={18} />
                  </button>
                </div>
              </header>

              {notice && (
                <div className="toast" role="status">
                  {notice}
                  <button onClick={() => setNotice('')} aria-label="Dismiss notice">
                    ×
                  </button>
                </div>
              )}

             
<Routes>
  <Route
    index
    element={<Dashboard user={user} setNotice={setNotice} />}
  />
  <Route
    path="announcements"
    element={<Announcements user={user} setNotice={setNotice} />}
  />
  <Route
    path="clubs-events"
    element={<ClubsEvents user={user} setNotice={setNotice} />}
  />
  <Route
    path="academics"
    element={<Academics user={user} setNotice={setNotice} />}
  />
  <Route
    path="opportunities"
    element={<Opportunities user={user} setNotice={setNotice} />}
  />
  <Route
    path="directory"
    element={<Directory user={user} setNotice={setNotice} />}
  />
  <Route
    path="profile"
    element={
      <Profile
        user={user}
        onUpdate={setUser}
        setNotice={setNotice}
      />
    }
  />
  <Route
    path="admin"
    element={<Admin user={user} setNotice={setNotice} />}
  />
  <Route
    path="*"
    element={<Navigate to="/app" replace />}
  />
</Routes>

    </main>
  </div>
) : (
  <Navigate to="/" replace />
)
}
/>
</Routes>
);
}




function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function useLoad(path, query = '') {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const reload = () => { setLoading(true); api.list(path, query).then(setData).catch(e => setError(e.message)).finally(() => setLoading(false)); };
  useEffect(() => { reload(); }, [path, query]);
  return { data, loading, error, reload, setData };
}
function LoadingOrError({ loading, error }) { if (loading) return <div className="empty-state"><div className="loader"></div><p>Loading campus information…</p></div>; if (error) return <div className="alert error">{error}<p className="small">Check that the API and MongoDB are running.</p></div>; return null; }
function Empty({ title = 'Nothing here yet', text = 'New items will appear here when they are published.' }) { return <div className="empty-state"><div className="empty-icon"><Compass size={22}/></div><h3>{title}</h3><p>{text}</p></div>; }
function Dashboard({ user, setNotice }) {
  const [counts, setCounts] = useState(null);
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  useEffect(() => { api.dashboard().then(setCounts).catch(() => {}); api.list('events').then(setEvents).catch(() => {}); api.list('announcements').then(setAnnouncements).catch(() => {}); }, []);
  const roleLine = { Student: 'Your campus life, all in one place.', Faculty: 'Keep your department and club activities moving.', 'Career Coordinator': 'Help the campus find its next opportunity.', Admin: 'A clear view of the  and its activity.' }[user.role];
  return <div className="page-content">
    <div className="welcome-strip"><div> <span className="eyebrow light">
      {new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: '2-digit'
      }).toUpperCase()}
    </span><h1>Good to have you here, {user.username.split(' ')[0]}.</h1><p>{roleLine}</p></div><div className="welcome-stamp"><span>CH</span><small>CH<br/></small></div></div>
    <div className="section-head"><div><h2>A little of everything</h2></div></div>
    <div className="metric-grid">{[
      ['Announcements', counts?.counts?.announcements ?? '—', Megaphone, 'amber'],
      ['Upcoming events', counts?.counts?.events ?? '—', CalendarDays, 'coral'],
      ['Opportunities', counts?.counts?.opportunities ?? '—', BriefcaseBusiness, 'green'],
      ['Study resources', counts?.counts?.resources ?? '—', BookOpen, 'lilac']
    ].map(([label,value,Icon,tone]) => <div className="metric-card" key={label}><div className={`metric-icon ${tone}`}><Icon size={19}/></div><span>{label}</span><strong>{value}</strong></div>)}</div>
    <div className="dashboard-columns"><section className="content-panel"><div className="panel-head"><div><h3>Recent announcements</h3></div><NavLink to="/app/announcements" className="inline-link">All announcements <ArrowUpRight size={15}/></NavLink></div>{announcements.slice(0,3).map(a => <article className="announcement-row" key={a._id}><div className="date-block"><strong>{new Date(a.createdAt).getDate()}</strong><span>{new Date(a.createdAt).toLocaleString('en',{month:'short'}).toUpperCase()}</span></div><div><h4>{a.title}</h4><p>{a.body}</p><small>{a.author?.username || 'CampusHub team'} · {a.author?.role || 'Campus'}</small></div></article>)}{!announcements.length && <Empty title="A quiet noticeboard" text="Published campus announcements will show up here."/>}</section>
      <section className="content-panel event-panel"><div className="panel-head"><div><h3>Coming up</h3></div><NavLink to="/app/clubs-events" className="inline-link">All events <ArrowUpRight size={15}/></NavLink></div>{events.filter(e => new Date(e.startsAt) >= new Date()).slice(0,3).map((e,i)=><article className="event-row" key={e._id}><div className={`event-date date-tone-${i%3}`}><span>{new Date(e.startsAt).toLocaleString('en',{month:'short'}).toUpperCase()}</span><strong>{new Date(e.startsAt).getDate()}</strong></div><div><h4>{e.title}</h4><p><MapPin size={13}/> {e.venue}</p><small><Clock3 size={12}/> {new Date(e.startsAt).toLocaleTimeString('en',{hour:'2-digit',minute:'2-digit'})}</small></div></article>)}{!events.length && <Empty title="Room for something good" text="Upcoming events will appear here."/>}</section></div>
    {(user.role === 'Admin' || user.role === 'Career Coordinator' || user.role === 'Faculty') && <div className="quick-actions"><div><span className="eyebrow">YOUR TOOLS</span><h3>Get things moving</h3></div>{user.role === 'Admin' && <NavLink to="/app/admin" className="btn secondary"><ShieldCheck size={16}/> Manage users</NavLink>}{user.role === 'Faculty' && <NavLink to="/app/academics" className="btn secondary"><Plus size={16}/> Add resources</NavLink>}{user.role === 'Career Coordinator' && <NavLink to="/app/opportunities" className="btn secondary"><Plus size={16}/> Post opportunity</NavLink>}</div>}
  </div>;
}

function Announcements({ user, setNotice }) {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title:'', body:'', departments:[] });
  const [refresh, setRefresh] = useState(0);
  const { data, loading, error } = useLoad('announcements', `?search=${encodeURIComponent(search)}&department=${encodeURIComponent(department)}&refresh=${refresh}`);
  async function create(e) { e.preventDefault(); try { await api.create('announcements', form); setShowForm(false); setForm({title:'',body:'',departments:[]}); setRefresh(v=>v+1); setNotice('Announcement published.'); } catch(err) { setNotice(err.message); } }
  const canPost = ['Faculty','Admin'].includes(user.role);
  return <div className="page-content"><PageHeading eyebrow="" title="Announcements" description="" action={canPost && <button className="btn primary" onClick={()=>setShowForm(!showForm)}><Plus size={16}/> Write announcement</button>}/>
    <div className="filter-bar"><div className="search-field"><Search size={17}/><input placeholder="Search announcements…" value={search} onChange={e=>setSearch(e.target.value)}/></div><select value={department} onChange={e=>setDepartment(e.target.value)}><option value="">All departments</option>{departments.map(d=><option key={d}>{d}</option>)}</select></div>
    {showForm && <form className="editor-panel" onSubmit={create}><h3>New announcement</h3><label>Subject<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Message<textarea required rows="4" value={form.body} onChange={e=>setForm({...form,body:e.target.value})}/></label><label>Department (leave blank for all)<select value={form.departments[0]||''} onChange={e=>setForm({...form,departments:e.target.value?[e.target.value]:[]})}><option value="">All departments</option>{departments.map(d=><option key={d}>{d}</option>)}</select></label><div className="form-actions"><button type="button" className="btn secondary" onClick={()=>setShowForm(false)}>Cancel</button><button className="btn primary">Publish announcement</button></div></form>}
    <LoadingOrError loading={loading} error={error}/><div className="announcement-list">{data.map(a=><article className="notice-card" key={a._id}><div className="notice-meta"><span className="pill">{a.departments?.length ? a.departments.join(', ') : 'Campus-wide'}</span><span className='Date'>{new Date(a.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span></div><h2>{a.title}</h2><p>{a.body}</p><div className="notice-author"><div className="avatar small-avatar">{(a.author?.username||'C').slice(0,1)}</div><span><strong>{a.author?.username||'CampusHub'}</strong><small>{a.author?.role||'Campus team'}</small></span></div></article>)}</div>{!loading&&!error&&!data.length&&<Empty title="No announcements match" text="Try another search or check back later."/>}
  </div>;
}


function ClubsEvents({ user, setNotice }) {
  const [tab, setTab] = useState('events');
  const [clubs, setClubs] = useState([]);
  const [events, setEvents] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    startsAt: '',
    endsAt: '',
    registrationOpensAt: new Date().toISOString().slice(0, 16),
    registrationDeadline: '',
    capacity: '',
    club: ''
  });
const canManage = user.role === 'Faculty';

const availableClubs = user.role === 'Admin'
  ? clubs
  : clubs.filter(c =>
      String(c.facultyCoordinator?._id || c.facultyCoordinator || '') ===
      String(user.id || user._id || '')
    );

async function reload() {
  setLoading(true);

  try {
    // Fetch clubs independently
    const clubData = await api.list('clubs');

    setClubs(
      Array.isArray(clubData)
        ? clubData
        : Array.isArray(clubData?.clubs)
          ? clubData.clubs
          : []
    );

    // Fetch other data independently
    const results = await Promise.allSettled([
      api.list('events'),
      api.list('memberships'),
      api.list('registrations')
    ]);

    const getList = result =>
      result.status === 'fulfilled' && Array.isArray(result.value)
        ? result.value
        : [];

    setEvents(getList(results[0]));
    setMemberships(getList(results[1]));
    setRegistrations(getList(results[2]));

  } catch (err) {
    setNotice(err.message);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    reload();
  }, []);

  // Find the current student's membership in a particular club.
  function membershipFor(clubId) {
    return memberships.find((item) => {
      const id =
        item.clubId?._id ||
        item.clubId ||
        item.club?._id ||
        item.club;

      return id != null && String(id) === String(clubId);
    });
  }

  async function join(id) {
    try {
      await api.joinClub(id);
      setNotice('Club membership request sent.');
      await reload();
    } catch (err) {
      setNotice(err.message);
    }
  }

  async function register(id) {
    try {
      await api.registerEvent(id);
      setNotice('You are registered for the event.');
      await reload();
    } catch (err) {
      setNotice(err.message);
    }
  }

async function create(e) {
  e.preventDefault();

  try {
    if (!form.club) {
      setNotice('Please select your assigned club.');
      return;
    }

    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.venue.trim() ||
      !form.startsAt ||
      !form.endsAt ||
      !form.registrationOpensAt ||
      !form.registrationDeadline
    ) {
      setNotice('Please fill in all required event details.');
      return;
    }

    const startsAt = new Date(form.startsAt);
    const endsAt = new Date(form.endsAt);
    const registrationOpensAt = new Date(form.registrationOpensAt);
    const registrationDeadline = new Date(form.registrationDeadline);

    if (
      [startsAt, endsAt, registrationOpensAt, registrationDeadline]
        .some(date => Number.isNaN(date.getTime()))
    ) {
      setNotice('Please enter valid event dates and times.');
      return;
    }

    if (endsAt <= startsAt) {
      setNotice('Event end time must be after its start time.');
      return;
    }

    if (registrationDeadline > startsAt) {
      setNotice('Registration deadline must be before the event starts.');
      return;
    }

    if (registrationOpensAt >= registrationDeadline) {
      setNotice('Registration opening time must be before its deadline.');
      return;
    }

    await api.create('events', {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      venue: form.venue.trim(),
      capacity: form.capacity ? Number(form.capacity) : null,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      registrationOpensAt: registrationOpensAt.toISOString(),
      registrationDeadline: registrationDeadline.toISOString()
    });

    setShowForm(false);

    setForm({
      title: '',
      description: '',
      venue: '',
      startsAt: '',
      endsAt: '',
      registrationOpensAt: new Date().toISOString().slice(0, 16),
      registrationDeadline: '',
      capacity: '',
      club: ''
    });

    setNotice('Event published successfully.');
    await reload();

  } catch (err) {
    setNotice(err.message || 'Unable to publish event.');
  }
}

  return (
    <div className="page-content">

      <PageHeading
        title="Clubs & events"
        description=""
        action={
          canManage && (
            <button
              className="btn primary"
              onClick={() => {
                setTab('events');
                setShowForm(!showForm);
              }}
            >
              <Plus size={16} /> Create event
            </button>
          )
        }
      />

      {/* Tabs */}
      <div className="tab-row">
        <button
          className={tab === 'events' ? 'active' : ''}
          onClick={() => setTab('events')}
        >
          Upcoming events <span>{events.length}</span>
        </button>

        <button
          className={tab === 'clubs' ? 'active' : ''}
          onClick={() => setTab('clubs')}
        >
          Student clubs <span>{clubs.length}</span>
        </button>
      </div>

      {/* Event creation form */}
      {showForm && (
        <form className="editor-panel" onSubmit={create}>
          <h3>Publish an event</h3>

          <div className="form-grid">
            <label>
              Event name
              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </label>

            <label>
              Organizing club
              <select
                required
                value={form.club}
                onChange={(e) =>
                  setForm({ ...form, club: e.target.value })
                }
              >
                <option value=""> {availableClubs.length ? 'Choose a club' : 'No clubs assigned to you'}</option>
               {availableClubs.map((c) => (
  <option value={c._id} key={c._id}>
    {c.name}
  </option>
))}
              </select>
            </label>

            <label>
              Venue
              <input
                required
                value={form.venue}
                onChange={(e) =>
                  setForm({ ...form, venue: e.target.value })
                }
              />
            </label>

            <label>
              Capacity (optional)
              <input
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: e.target.value })
                }
              />
            </label>

            <label>
              Starts at
              <input
                required
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) =>
                  setForm({ ...form, startsAt: e.target.value })
                }
              />
            </label>

            <label>
              Ends at
              <input
                required
                type="datetime-local"
                value={form.endsAt}
                onChange={(e) =>
                  setForm({ ...form, endsAt: e.target.value })
                }
              />
            </label>

            <label>
              Registration opens
              <input
                required
                type="datetime-local"
                value={form.registrationOpensAt}
                onChange={(e) =>
                  setForm({ ...form, registrationOpensAt: e.target.value })
                }
              />
            </label>

            <label>
              Registration deadline
              <input
                required
                type="datetime-local"
                value={form.registrationDeadline}
                onChange={(e) =>
                  setForm({ ...form, registrationDeadline: e.target.value })
                }
              />
            </label>
          </div>

          <label>
            Description
            <textarea
              rows="3"
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button className="btn primary">
              Publish event
            </button>
          </div>
        </form>
      )}
{/* FACULTY MEMBERSHIP REQUESTS */}

      {/* Main content */}
      {loading ? (
        <LoadingOrError loading={loading} />
      ) : tab === 'events' ? (

        /* EVENTS TAB */
        <div className="event-grid">
          {events
            .filter(
              (e) =>
                new Date(e.startsAt) >=
                new Date(Date.now() - 86400000)
            )
            .map((e, i) => {
       const isRegistered = registrations.some((r) => {
    const eventId =
        r.event?._id ||
        r.eventId?._id ||
        r.eventId ||
        r.event;

    const studentId =
        r.student?._id ||
        r.studentId?._id ||
        r.studentId ||
        r.student;

    return (
        eventId != null &&
        studentId != null &&
        String(eventId) === String(e._id) &&
        String(studentId) === String(user.id)
    );
});

              return (
                <article className="event-card" key={e._id}>
                  <div className={`event-art art-${i % 4}`}>
                    <span className="art-label">
                      {e.club?.name || 'CAMPUS EVENT'}
                    </span>

                    <CalendarDays size={40} />

                    <span className="art-date">
                      {new Date(e.startsAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short'
                      })}
                    </span>
                  </div>

                  <div className="event-card-body">
                    <div className="event-card-meta">
                      <span>{e.status}</span>
                      <span>
                        <Users size={13} />
                        {e.registrationCount || 0}
                        {e.capacity ? ` / ${e.capacity}` : ''}
                      </span>
                    </div>

                    <h3>{e.title}</h3>
                    <p>{e.description}</p>

                    <div className="event-detail">
                      <MapPin size={14} />
                      {e.venue}
                    </div>

                    <div className="event-detail">
                      <Clock3 size={14} />
                      {new Date(e.startsAt).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </div>
<div className="event-card-footer">
  {user.role === 'Student' && (
    isRegistered ? (
      <button className="btn secondary small-btn" disabled  style={{
    color: '#000000',
    opacity: 1
  }}>
        ✓ Already registered
      </button>
    ) : e.registrationOpen ? (
      <button
        className="btn primary small-btn"
        onClick={() => register(e._id)}
      >
        Register now
      </button>
    ) : (
      <button className="btn secondary small-btn" disabled>
        Registration is closed
      </button>
    )
  )}
</div>
                    
                  </div>
                </article>
              );
            })}
        </div>

      ) : (

        /* STUDENT CLUBS TAB */
        <div className="club-grid">
          {clubs.map((c, i) => {
            const m = membershipFor(c._id);

            return (
              <article className="club-card" key={c._id}>
                <div className={`club-cover cover-${i % 4}`}>
                  {c.coverUrl ? (
                    <img
                      src={c.coverUrl}
                      alt={`${c.name} cover`}
                    />
                  ) : (
                    <span className="club-initial">
                      {(c.name || 'C').slice(0, 1)}
                    </span>
                  )}

                  <span className="club-category">
                    {c.category || 'Student club'}
                  </span>
                </div>

                <div className="club-body">
                  <h3>{c.name}</h3>

                  <pre>{c.description?.trim() || 'No description available.'}</pre>

                  <div className="club-coordinator">
                    <GraduationCap size={15} />
                    {c.facultyCoordinator?.username ||
                      'Faculty coordinator not assigned'}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading &&
        !(tab === 'events' ? events : clubs).length && (
          <Empty
            title={
              tab === 'events'
                ? 'No events listed yet'
                : 'No clubs listed yet'
            }
            text={
              tab === 'events'
                ? 'Campus events will appear here when organizers publish them.'
                : 'Student clubs will appear here when administrators add them.'
            }
          />
        )}
    </div>
  );
}


function Academics({user,setNotice}) {
  const [search,setSearch]=useState('');const [type,setType]=useState('');const [department,setDepartment]=useState('');const [show,setShow]=useState(false);
  const [form,setForm]=useState({title:'',subject:'',department:'CSE',type:'Study material',semester:'',description:''});const [refresh,setRefresh]=useState(0);
  const {data,loading,error}=useLoad('resources',`?search=${encodeURIComponent(search)}&type=${encodeURIComponent(type)}&department=${encodeURIComponent(department)}&r=${refresh}`);
  async function submit(e){e.preventDefault();const fd=new FormData();Object.entries(form).forEach(([k,v])=>fd.append(k,v));const file=e.target.elements.file.files[0];if(file)fd.append('file',file);try{await api.uploadResource(fd);setShow(false);setRefresh(v=>v+1);setNotice('Resource added.');}catch(err){setNotice(err.message);}}
const canPost = user.role === 'Faculty';  return <div className="page-content"><PageHeading eyebrow="" title="Academic resources" description="" action={canPost&&<button className="btn primary" onClick={()=>setShow(!show)}><Plus size={16}/> Add resource</button>}/>
    <div className="filter-bar"><div className="search-field"><Search size={17}/><input placeholder="Search subjects or resources…" value={search} onChange={e=>setSearch(e.target.value)}/></div><select value={department} onChange={e=>setDepartment(e.target.value)}><option value="">All departments</option>{departments.map(d=><option key={d}>{d}</option>)}</select><select value={type} onChange={e=>setType(e.target.value)}><option value="">All types</option>{['Exam paper','Class notes','Lab manual','Study material','Other'].map(t=><option key={t}>{t}</option>)}</select></div>
    {show&&<form className="editor-panel" onSubmit={submit}><h3>Share a resource</h3><div className="form-grid"><label>Title<input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><label>Subject<input required value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})}/></label><label>Department<select value={form.department} onChange={e=>setForm({...form,department:e.target.value})}>{departments.map(d=><option key={d}>{d}</option>)}</select></label><label>Resource type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>{['Exam paper','Class notes','Lab manual','Study material','Other'].map(t=><option key={t}>{t}</option>)}</select></label><label>Semester / year<input value={form.semester} onChange={e=>setForm({...form,semester:e.target.value})}/></label><label>File (PDF, image, TXT, DOCX; max 8 MB)<input name="file" type="file" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.docx"/></label></div><label>Or external link<input type="url" value={form.externalUrl||''} onChange={e=>setForm({...form,externalUrl:e.target.value})} placeholder="https://…"/></label><label>Description<textarea rows="2" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><div className="form-actions"><button type="button" className="btn secondary" onClick={()=>setShow(false)}>Cancel</button><button className="btn primary">Publish resource</button></div></form>}
    <LoadingOrError loading={loading} error={error}/><div className="resource-list">{data.map(r=><article className="resource-row" key={r._id}><div className="file-icon"><FileText size={22}/></div><div className="resource-info"><div className="resource-topline"><span className="pill">{r.type}</span><span>{r.department}</span></div><h3>{r.title}</h3><p>{r.subject}{r.semester?` · ${r.semester}`:''} {r.description?`· ${r.description}`:''}</p><small>Shared by {r.author?.username||'campus member'} · {new Date(r.createdAt).toLocaleDateString('en-IN')}</small></div><a className="resource-open" href={r.fileUrl?`http://localhost:4000${r.fileUrl}`:r.externalUrl||'#'} target="_blank" rel="noreferrer" onClick={e=>{if(!r.fileUrl&&!r.externalUrl)e.preventDefault();}}>{r.fileUrl||r.externalUrl?'Open resource':'No file attached'} <ArrowUpRight size={15}/></a></article>)}</div>{!loading&&!error&&!data.length&&<Empty title="Your study shelf is empty" text="Try a different filter, or share the first resource."/>}
  </div>;
}


function Opportunities({ user, setNotice }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    title: '',
    category: 'Internship',
    description: '',
    organization: '',
    eligibility: '',
    compensation: '',
    deadline: '',
    applicationUrl: '',
    departments: []
  };

  const [form, setForm] = useState(emptyForm);

  const { data, loading, error } = useLoad(
    'opportunities',
    `?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&r=${refresh}`
  );

  // Only Career Coordinator can post opportunities
  const canPost = user.role === 'Career Coordinator';

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShow(false);
  }

  // Create or update an opportunity
  async function submit(e) {
    e.preventDefault();

    try {
      const body = {
        ...form,
        deadline: form.deadline || null
      };

      if (editingId) {
        await api.patch('opportunities', editingId, body);
        setNotice('Opportunity updated successfully.');
      } else {
        await api.create('opportunities', body);
        setNotice('Opportunity published.');
      }

      resetForm();
      setRefresh(v => v + 1);
    } catch (err) {
      setNotice(err.message);
    }
  }

  // Fill form with existing opportunity details
  function editOpportunity(o) {
    setForm({
      title: o.title || '',
      category: o.category || 'Internship',
      description: o.description || '',
      organization: o.organization || '',
      eligibility: o.eligibility || '',
      compensation: o.compensation || '',
      deadline: o.deadline
        ? new Date(o.deadline).toISOString().slice(0, 10)
        : '',
      applicationUrl: o.applicationUrl || '',
      departments: o.departments || []
    });

    setEditingId(o._id);
    setShow(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Delete an opportunity
  async function deleteOpportunity(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this opportunity?'
    );

    if (!confirmed) return;

    try {
      await api.remove('opportunities', id);
      setNotice('Opportunity deleted successfully.');
      setRefresh(v => v + 1);
    } catch (err) {
      setNotice(err.message);
    }
  }

  return (
    <div className="page-content">

      <PageHeading
        eyebrow=""
        title="Career & opportunities"
        description=""
        action={
          canPost && (
            <button
              className="btn primary"
              onClick={() => {
                if (show) {
                  resetForm();
                } else {
                  setForm(emptyForm);
                  setEditingId(null);
                  setShow(true);
                }
              }}
            >
              <Plus size={16} />
              Post opportunity
            </button>
          )
        }
      />

      <div className="filter-bar">
        <div className="search-field">
          <Search size={17} />
          <input
            placeholder="Search roles, companies, programmes…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Every category</option>
          {[
            'Internship',
            'Job',
            'Hackathon',
            'Workshop',
            'Scholarship',
            'Competition',
            'Other'
          ].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {show && canPost && (
        <form className="editor-panel" onSubmit={submit}>
          <h3>
            {editingId ? 'Edit opportunity' : 'New opportunity'}
          </h3>

          <div className="form-grid">

            <label>
              Title
              <input
                required
                value={form.title}
                onChange={e =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </label>

            <label>
              Category
              <select
                value={form.category}
                onChange={e =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                {[
                  'Internship',
                  'Job',
                  'Hackathon',
                  'Workshop',
                  'Scholarship',
                  'Competition',
                  'Other'
                ].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>

            <label>
              Organization
              <input
                value={form.organization}
                onChange={e =>
                  setForm({ ...form, organization: e.target.value })
                }
              />
            </label>

            <label>
              Compensation / benefits
              <input
                value={form.compensation}
                onChange={e =>
                  setForm({ ...form, compensation: e.target.value })
                }
              />
            </label>

            <label>
              Deadline
              <input
                type="date"
                value={form.deadline}
                onChange={e =>
                  setForm({ ...form, deadline: e.target.value })
                }
              />
            </label>

            <label>
              Application URL
              <input
                type="url"
                value={form.applicationUrl}
                onChange={e =>
                  setForm({ ...form, applicationUrl: e.target.value })
                }
                placeholder="https://…"
              />
            </label>

          </div>

          <label>
            Eligibility
            <input
              value={form.eligibility}
              onChange={e =>
                setForm({ ...form, eligibility: e.target.value })
              }
            />
          </label>

          <label>
            Description
            <textarea
              rows="3"
              required
              value={form.description}
              onChange={e =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={resetForm}
            >
              Cancel
            </button>

            <button className="btn primary" type="submit">
              {editingId ? 'Save Changes' : 'Publish opportunity'}
            </button>
          </div>
        </form>
      )}

      <LoadingOrError loading={loading} error={error} />

      <div className="opportunity-list">

       {data.map((o, i) => {

  const isOwner =
    String(o.createdBy?._id || o.createdBy) ===
    String(user._id || user.id);

  const canManage =
    user.role === 'Career Coordinator' && isOwner;

  return (
    <article
      className="opportunity-card"
      key={o._id}
    >
      <div className={`opportunity-mark mark-${i % 4}`}>
        <BriefcaseBusiness size={21} />
      </div>

      <div className="opportunity-main">

        <div className="resource-topline">
          <span className="pill">{o.category}</span>

          {o.deadline && (
            <span className="deadline">
              <Clock3 size={13} />
              Apply by {new Date(o.deadline).toLocaleDateString(
                'en-IN',
                {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                }
              )}
            </span>
          )}
        </div>

        <h3>{o.title}</h3>

        <p className="org-name">
          {o.organization || 'Campus opportunity'}
          {o.compensation ? ` · ${o.compensation}` : ''}
        </p>

        <pre>{o.description}</pre>

        {o.eligibility && (
          <small>Eligibility: {o.eligibility}</small>
        )}

        {/* Edit and Delete buttons */}
        {canManage && (
          <div className="opportunity-actions">

            <button
              type="button"
              className="edit-btn"
              onClick={() => editOpportunity(o)}
            >
              <Pencil size={14} />
              Edit
            </button>

            <button
              type="button"
              className="delete-btn"
              onClick={() => deleteOpportunity(o._id)}
            >
              <Trash2 size={14} />
              Delete
            </button>

          </div>
        )}

      </div>

      {o.applicationUrl && (
        <a
          href={o.applicationUrl}
          className="btn secondary apply-btn"
          target="_blank"
          rel="noreferrer"
        >
          View details
          <ArrowUpRight size={15} />
        </a>
      )}

    </article>
  );
})}

      </div>

      {!loading && !error && !data.length && (
        <Empty
          title="Nothing open right now"
          text="New internships, events and scholarships will be listed here."
        />
      )}

    </div>
  );
}


function Directory({user,setNotice}) {
  const [search,setSearch]=useState('');const [category,setCategory]=useState('');const [show,setShow]=useState(false);const [refresh,setRefresh]=useState(0);
  const [form,setForm]=useState({name:'',category:'Facility',department:'',description:'',location:'',contact:'',officialUrl:''});
  const {data,loading,error}=useLoad('directory',`?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}&r=${refresh}`);
  async function submit(e){e.preventDefault();try{await api.create('directory',form);setShow(false);setRefresh(v=>v+1);setNotice('Directory entry added.');}catch(err){setNotice(err.message);}}
  return <div className="page-content"><PageHeading eyebrow="" title="Campus directory" description="" action={user.role==='Admin'&&<button className="btn primary" onClick={()=>setShow(!show)}><Plus size={16}/> Add entry</button>}/>
    <div className="directory-intro"><div><span className="eyebrow light"></span><h2>A campus with room to explore.</h2><p>Find campus facilities, departments and people.</p><a href="https://www.nitw.ac.in/" target="_blank" rel="noreferrer">Visit official CH website <ArrowUpRight size={15}/></a></div><div className="directory-doodle"><Compass size={70}/><span>17°58′ N<br/>79°32′ E</span></div></div>
    <div className="filter-bar"><div className="search-field"><Search size={17}/><input placeholder="Search a place or person…" value={search} onChange={e=>setSearch(e.target.value)}/></div><select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{['Faculty','Department','Building','Classroom/Lab','Facility','Other'].map(c=><option key={c}>{c}</option>)}</select></div>
    {show&&<form className="editor-panel" onSubmit={submit}><h3>Add directory entry</h3><div className="form-grid"><label>Name<input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Category<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{['Faculty','Department','Building','Classroom/Lab','Facility','Other'].map(c=><option key={c}>{c}</option>)}</select></label><label>Department<input value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/></label><label>Location<input value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/></label><label>Contact<input value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})}/></label><label>Official URL<input type="url" value={form.officialUrl} onChange={e=>setForm({...form,officialUrl:e.target.value})}/></label></div><label>Description<textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label><div className="form-actions"><button type="button" className="btn secondary" onClick={()=>setShow(false)}>Cancel</button><button className="btn primary">Save entry</button></div></form>}
    <LoadingOrError loading={loading} error={error}/><div className="directory-grid">{data.map((d,i)=><article className="directory-card" key={d._id}><div className={`directory-icon dir-${i%4}`}>{d.category==='Faculty'?<GraduationCap/>:d.category==='Building'?<MapPin/>:<Compass/>}</div><span className="pill">{d.category}</span><h3>{d.name}</h3><p>{d.description||'More details will be added when verified.'}</p>{d.department&&<small>{d.department}</small>}{d.location&&<div className="event-detail"><MapPin size={14}/>{d.location}</div>}{d.contact&&<p className="contact-line">{d.contact}</p>}{d.officialUrl&&<a className="inline-link" href={d.officialUrl} target="_blank" rel="noreferrer"> <ArrowUpRight size={14}/></a>}</article>)}</div>{!loading&&!error&&!data.length&&<Empty title="No directory entries yet" text="Only verified entries should be added to this directory."/>}
  </div>;
}

function Profile({user,onUpdate,setNotice}) {
  const [form,setForm]=useState({username:user.username,department:user.department||'',yearOfStudy:user.yearOfStudy||3,phone:user.phone||'',subjects:(user.subjects||[]).join(', ')});
  async function submit(e){e.preventDefault();try{const result=await api.request?.('/profile');}catch{}try{const result=await fetch(`${import.meta.env.VITE_API_URL||'http://localhost:4000/api'}/profile`,{method:'PATCH',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,subjects:form.subjects.split(',').map(s=>s.trim()).filter(Boolean)})});const data=await result.json();if(!result.ok)throw new Error(data.message);onUpdate(data.user);setNotice('Profile saved.');}catch(err){setNotice(err.message);}}
  return <div className="page-content"><PageHeading eyebrow="" title="Profile" description=""/><form className="editor-panel profile-form" onSubmit={submit}><div className="profile-banner"><div className="profile-avatar">{user.username.slice(0,1).toUpperCase()}</div><div><h2>{user.username}</h2><span>{user.role} · {user.email}</span></div></div><div className="form-grid"><label>Display name<input required value={form.username} onChange={e=>setForm({...form,username:e.target.value})}/></label><label>Email (managed by account)<input disabled value={user.email}/></label><label>Department<input value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/></label>{user.role==='Student'&&<label>Year of study<select value={form.yearOfStudy} onChange={e=>setForm({...form,yearOfStudy:Number(e.target.value)})}>{[1,2,3,4].map(y=><option value={y} key={y}>Year {y}</option>)}</select></label>}<label>Phone<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>{user.role==='Faculty'&&<label>Subjects taught (comma-separated)<input value={form.subjects} onChange={e=>setForm({...form,subjects:e.target.value})}/></label>}</div><button className="btn primary">Save changes</button></form></div>;
}


function Admin({ user, setNotice }) {
  const [data, setData] = useState({ users: [], counts: [] });
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clubLoading, setClubLoading] = useState(false);
  const [editingClub, setEditingClub] = useState(null);

  const emptyForm = {
    name: '',
    category: 'Student club',
    description: '',
    facultyCoordinator: ''
  };

  const [clubForm, setClubForm] = useState(emptyForm);

  async function reload() {
    setLoading(true);
    try {
      const result = await api.adminUsers();
      setData(result);
    } catch (e) {
      setNotice(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function reloadClubs() {
    try {
      const result = await api.list('clubs');
      setClubs(Array.isArray(result) ? result : result.clubs || []);
    } catch (e) {
      setNotice(e.message);
    }
  }

  useEffect(() => {
    reload();
    reloadClubs();
  }, []);

  async function change(id, patch) {
    try {
      await api.patch('admin/users', id, patch);
      setNotice('User updated.');
      await reload();
    } catch (e) {
      setNotice(e.message);
    }
  }

  function startEdit(club) {
    setEditingClub(club._id || club.id);
    setClubForm({
      name: club.name || '',
      category: club.category || 'Student club',
      description: club.description || '',
      facultyCoordinator:
        club.facultyCoordinator?._id ||
        club.facultyCoordinator ||
        ''
    });
  }

  function resetClubForm() {
    setEditingClub(null);
    setClubForm(emptyForm);
  }

  async function saveClub(e) {
    e.preventDefault();

    if (!clubForm.name.trim() || !clubForm.description.trim()) {
      setNotice('Enter the club name and description.');
      return;
    }

    const clubData = {
      name: clubForm.name.trim(),
      category: clubForm.category,
      description: clubForm.description.trim(),
      facultyCoordinator: clubForm.facultyCoordinator || null
    };

    setClubLoading(true);

    try {
      if (editingClub) {
        await api.updateClub(editingClub, clubData);
        setNotice('Club updated successfully.');
      } else {
        await api.createClub(clubData);
        setNotice('Club added successfully.');
      }

      resetClubForm();
      await reloadClubs();
    } catch (e) {
      setNotice(e.message);
    } finally {
      setClubLoading(false);
    }
  }

  async function deleteClub(id) {
    if (!window.confirm('Are you sure you want to delete this club?')) {
      return;
    }

    try {
      await api.deleteClub(id);
      setNotice('Club deleted successfully.');
      await reloadClubs();
    } catch (e) {
      setNotice(e.message);
    }
  }

  const facultyUsers = data.users.filter(
    u => u.role === 'Faculty' && u.active
  );

  return (
    <div className="page-content">
      <PageHeading
        eyebrow=""
        title="User and club management"
        description=""
      />

      {/* USER COUNTS */}
      <div className="metric-grid admin-counts">
        {roleNames.map(role => (
          <div className="metric-card" key={role}>
            <div className="metric-icon lilac">
              <Users size={18} />
            </div>
            <span>{role}s</span>
            <strong>
              {data.counts.find(c => c._id === role)?.count || 0}
            </strong>
          </div>
        ))}
      </div>

      {/* USER MANAGEMENT */}
      <h2>User management</h2>

      <LoadingOrError loading={loading} />

      {!loading && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Member</th>
                <th>Department</th>
                <th>Role</th>
                <th>Access</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {data.users.map(u => (
                <tr key={u.id || u._id}>
                  <td>
                    <strong>{u.username}</strong>
                    <small>{u.email}</small>
                  </td>

                  <td>{u.department || '—'}</td>

                  <td>
                    <select
                      value={u.role}
                      onChange={e =>
                        change(u.id || u._id, {
                          role: e.target.value
                        })
                      }
                    >
                      {roleNames.map(r => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <span className={`status ${u.active ? 'on' : 'off'}`}>
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td>
                    <button
                      className="tiny-btn"
                      onClick={() =>
                        change(u.id || u._id, {
                          active: !u.active
                        })
                      }
                    >
                      {u.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CLUB MANAGEMENT */}
      <div className="section-heading">
        <h2>Club management</h2>
        <p>Add clubs and assign their Faculty Coordinators.</p>
      </div>

      <form className="form-card" onSubmit={saveClub}>
        <h3>{editingClub ? 'Edit club' : 'Add new club'}</h3>

        <label>
          Club name
          <input
            type="text"
            value={clubForm.name}
            onChange={e =>
              setClubForm({ ...clubForm, name: e.target.value })
            }
            required
          />
        </label>

        <label>
          Category
          <select
            value={clubForm.category}
            onChange={e =>
              setClubForm({ ...clubForm, category: e.target.value })
            }
          >
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Literary">Literary</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Description
          <textarea
            value={clubForm.description}
            onChange={e =>
              setClubForm({ ...clubForm, description: e.target.value })
            }
            required
          />
        </label>

        <label>
          Faculty Coordinator
          <select
            value={clubForm.facultyCoordinator}
            onChange={e =>
              setClubForm({
                ...clubForm,
                facultyCoordinator: e.target.value
              })
            }
          >
            <option value="">Not assigned</option>

            {facultyUsers.map(f => (
              <option key={f.id || f._id} value={f.id || f._id}>
                {f.username} ({f.email})
              </option>
            ))}
          </select>
        </label>

        <div className="form-actions">
          <button
            className="btn primary"
            type="submit"
            disabled={clubLoading}
          >
            {clubLoading
              ? 'Saving...'
              : editingClub
                ? 'Update club'
                : 'Add club'}
          </button>

          {editingClub && (
            <button
              className="btn secondary"
              type="button"
              onClick={resetClubForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* EXISTING CLUBS */}
      <h3>Existing clubs</h3>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Club</th>
              <th>Category</th>
              <th>Faculty Coordinator</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {clubs.map(club => (
              <tr key={club._id || club.id}>
                <td>
                  <strong>{club.name}</strong>
                </td>

                <td>{club.category || '—'}</td>

                <td>
                  {club.facultyCoordinator?.username || 'Not assigned'}
                </td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => startEdit(club)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteClub(club._id || club.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {clubs.length === 0 && (
              <tr>
                <td colSpan="4">No clubs added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default App;
