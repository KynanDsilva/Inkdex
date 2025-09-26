import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export default function Explore() {
  /* ---------- original data ---------- */
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------- filter states ---------- */
  const [search, setSearch] = useState('');
  const [subjectF, setSubjectF] = useState('');
  const [semF, setSemF] = useState('');
  const [yearF, setYearF] = useState('');

  /* ---------- fetch notes ---------- */
  useEffect(() => {
    const q = query(collection(db, 'notes'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setFiles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, []);

  /* ---------- filter logic ---------- */
  const filtered = useMemo(() => {
    return files.filter((f) =>
      (search ? f.title.toLowerCase().includes(search.toLowerCase()) : true) &&
      (subjectF ? f.subject === subjectF : true) &&
      (semF ? f.semester === semF : true) &&
      (yearF ? f.year === yearF : true)
    );
  }, [files, search, subjectF, semF, yearF]);

  /* ---------- unique dropdown values ---------- */
  const subjects = [...new Set(files.map((f) => f.subject))].sort();
  const sems = [...new Set(files.map((f) => f.semester))].sort();
  const years = [...new Set(files.map((f) => f.year))].sort();

  /* ---------- clear ---------- */
  const clearFilters = () => {
    setSearch('');
    setSubjectF('');
    setSemF('');
    setYearF('');
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

        {/* ===== SEARCH + FILTERS ===== */}
        <div
          className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5 items-end"
          data-aos="zoom-in"
          data-aos-delay="600"
        >
          {/* Title search */}
          <div className="lg:col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Search by title</label>
            <input
              type="text"
              placeholder="e.g. Computer Networking Notes"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-white"
            />
          </div>

          {/* Subject dropdown */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Subject</label>
            <select
              value={subjectF}
              onChange={(e) => setSubjectF(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-white"
            >
              <option value="">All</option>
              {subjects.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Semester dropdown */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">Semester</label>
            <select
              value={semF}
              onChange={(e) => setSemF(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-white"
            >
              <option value="">All</option>
              {sems.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Year dropdown + clear */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Year</label>
              <select
                value={yearF}
                onChange={(e) => setYearF(e.target.value)}
                className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-white"
              >
                <option value="">All</option>
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>
            <button
              onClick={clearFilters}
              className="bg-white text-black px-3 py-2 rounded-lg hover:bg-gray-200 transition"
              title="Clear filters"
            >
              <i className="bx bx-reset" />
            </button>
          </div>
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
                <div>
                  <h3 className="text-lg font-semibold mb-2">{file.title}</h3>
                  <div className="text-gray-400 text-sm space-y-1">
                    <p><strong>Subject:</strong> {file.subject}</p>
                    <p><strong>Semester:</strong> {file.semester}</p>
                    <p><strong>Year:</strong> {file.year}</p>
                  </div>
                </div>

                <a
                  href={file.fileURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:underline mt-4 self-start"
                >
                  Download →
                </a>
              </div>
            ))}
          </div>
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
