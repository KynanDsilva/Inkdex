import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import NoteCard from '../components/NoteCard';

import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Explore() {
  /* ---------- original data ---------- */
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- summary-panel state ---------- */
  const [summaryURL, setSummaryURL] = useState(null); // PDF url to summarise
  const [summaryText, setSummaryText] = useState('');   // bullet text
  const [loadingSum, setLoadingSum] = useState(false);

  /* ---------- filter states ---------- */
  const [search, setSearch] = useState('');
  const [subjectF, setSubjectF] = useState('');
  const [semF, setSemF] = useState('');
  const [yearF, setYearF] = useState('');
  const [collegeF, setCollegeF] = useState('');

  /* ---------- fetch notes ---------- */
  useEffect(() => {
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const raw = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setFiles(raw);
      setLoading(false);

      // ------ DEBUG: log every college value ------
      const collegesInDb = [...new Set(raw.map(f => f.college))].sort();
      console.log('Colleges in DB →', collegesInDb);
      console.log('Raw notes →', raw);
    });
    return unsub;
  }, []);

  /* ---------- filter logic ---------- */
  const filtered = useMemo(() => {
    return files.filter((f) =>
      (search ? f.title.toLowerCase().includes(search.toLowerCase()) : true) &&
      (subjectF ? f.subject === subjectF : true) &&
      (semF ? f.semester === semF : true) &&
      (yearF ? f.year === yearF : true) &&
      (collegeF ? f.college?.trim().toLowerCase() === collegeF.trim().toLowerCase() : true)
    );
  }, [files, search, subjectF, semF, yearF, collegeF]);

  /* ---------- unique dropdown values ---------- */
  const subjects = [...new Set(files.map((f) => f.subject))].sort();
  const sems = [...new Set(files.map((f) => f.semester))].sort();
  const years = [...new Set(files.map((f) => f.year))].sort();
  const colleges = [...new Set(files.map((f) => f.college))].sort();

  /* ---------- clear ---------- */
  const clearFilters = () => {
    setSearch('');
    setSubjectF('');
    setSemF('');
    setYearF('');
    setCollegeF('');
  };

  /* ---------- render ---------- */
  return (
    <>
      <Header />
      <main
        className="max-w-5xl mx-auto px-6 py-20 text-white"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h1 className="text-4xl font-bold mb-4" data-aos="fade-right" data-aos-delay="200">
          Explore Notes
        </h1>
        <p className="text-gray-400 mb-8" data-aos="fade-right" data-aos-delay="400">
          Search, filter and download notes shared by students across India.
        </p>

        {/* ===== SINGLE-ROW FILTER BAR ===== */}
        <div
          className="mb-8 flex items-center gap-3"
          data-aos="zoom-in"
          data-aos-delay="600"
        >
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700
                 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
            />
          </div>

          {/* Subject */}
          <div className="flex-1">
            <select
              value={subjectF}
              onChange={(e) => setSubjectF(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700
                 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
            >
              <option value="">All subjects</option>
              {subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div className="flex-1">
            <select
              value={semF}
              onChange={(e) => setSemF(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700
                 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
            >
              <option value="">All sems</option>
              {sems.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="flex-1">
            <select
              value={yearF}
              onChange={(e) => setYearF(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700
                 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
            >
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </div>

          {/* College */}
          <div className="flex-1">
            <select
              value={collegeF}
              onChange={(e) => setCollegeF(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700
                 focus:outline-none focus:ring-2 focus:ring-white/60 transition"
            >
              <option value="">All colleges</option>
              {colleges.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Clear button – fixed width */}
          <button
            onClick={clearFilters}
            className="shrink-0 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            title="Clear filters"
          >
            <i className="bx bx-reset" />
          </button>
        </div>

        {/* ===== RESULTS ===== */}
        {loading ? (
          <p>Loading notes…</p>
        ) : filtered.length === 0 ? (
          <p>No notes match your filters.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((file, i) => (
              <div
                key={file.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col justify-between hover:border-white transition"
                data-aos="zoom-in"
                data-aos-delay={100 * i}
              >
                <div key={file.id} className="flex flex-col gap-2">   {/* plain wrapper */}
                  <NoteCard file={file} index={i} />                 {/* the ONLY card */}
                  <a
                    href={file.fileURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline self-start"
                  >
                    Download →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {summaryURL && (
          <>
            {/* backdrop – click to close */}
            <div
              className="panel-backdrop fixed inset-0 bg-black/50 z-30"
              onClick={() => setSummaryURL(null)}
            />
            {/* side panel */}
            <aside className="side-panel open fixed top-0 right-0 h-full w-1/3 min-w-[380px] max-w-[480px]
                      bg-gray-900 border-l border-gray-700 p-6 text-white overflow-y-auto z-40">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Note Summary</h3>
                <button
                  onClick={() => setSummaryURL(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  &times;
                </button>
              </div>

              {loadingSum && <p className="animate-pulse">Creating summary…</p>}
              {summaryText && !loadingSum && (
                <div className="prose prose-invert prose-sm text-gray-300 whitespace-pre-wrap">
                  {summaryText}
                </div>
              )}
            </aside>
          </>
        )}

        <div className="mt-10" data-aos="fade-up" data-aos-delay="600">
          <Link
            to="/upload"
            className="inline-block bg-[#a7a7a7] text-black px-6 py-2 rounded-full hover:bg-white transition"
          >
            Upload your own →
          </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}