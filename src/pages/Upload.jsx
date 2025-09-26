import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, collection, addDoc, getDoc } from 'firebase/firestore';
import { storage, db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const EXISTING = {
  subject: ['Calculus', 'Physics', 'Chemistry'],
  sem: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
  year: ['2021', '2022', '2023', '2024', '2025'],
};

export default function Upload() {
  const { currentUser } = useAuth();
  const [userCollege, setUserCollege] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const snap = await getDoc(doc(db, 'users', currentUser.uid));
      if (snap.exists()) setUserCollege(snap.data().college || 'Unknown');
    })();
  }, [currentUser])

  /* form fields */
  const [subject, setSubject] = useState('');
  const [sem, setSem] = useState('');
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);

  /* tag options */
  const [subjectOpts, setSubjectOpts] = useState(EXISTING.subject);
  const [semOpts, setSemOpts] = useState(EXISTING.sem);
  const [yearOpts, setYearOpts] = useState(EXISTING.year);

  /* upload progress & message */
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  /* ---------- helpers ---------- */
  const handleCreate = (val, setter, opts, optSetter) => {
    const v = val?.trim();
    if (!v) return;
    if (!opts.includes(v)) optSetter([...opts, v]);
    setter(v);
  };

  /* ---------- submit handler ---------- */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setMessage('Please select a file to upload.');
    if (!currentUser) return setMessage('You must be logged in to upload.');

    const storageRef = ref(storage, `${Date.now()}-${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snap) => {
        const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(pct);
        setMessage(`Upload is ${pct.toFixed(0)}% done`);
      },
      (err) => {
        setMessage('Upload failed: ' + err.message);
        console.error(err);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setMessage('Saving note details…');

        await addDoc(collection(db, 'notes'), {
          title,
          subject,
          semester: sem,
          year,
          college: userCollege,   // ← auto-tagged from profile
          fileURL: downloadURL,
          ownerId: currentUser.uid,
          sessionId: sessionStorage.getItem('sessionId'),
          createdAt: new Date(),
        });

        setMessage('Note successfully uploaded!');
        // reset form
        setTitle('');
        setFile(null);
        setSubject('');
        setSem('');
        setYear('');
        setProgress(0);
      }
    );
  };

  /* ---------- render ---------- */
  return (
    <>
      <Header />
      <main
        className="max-w-3xl mx-auto px-6 py-20 text-white"
        data-aos="fade-up"
        data-aos-duration="1000"
      >
        <h1 className="text-4xl font-bold mb-8" data-aos="fade-right" data-aos-delay="200">
          Upload Notes
        </h1>

        <form
          className="space-y-6"
          onSubmit={handleFormSubmit}
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          {/* Title */}
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-white"
            required
          />

          {/* College Display */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">College</label>
            <input
              type="text"
              value={userCollege}
              disabled
              className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 text-white cursor-not-allowed"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">Subject</label>
            <select
              value={subject}
              onChange={(e) =>
                e.target.value === '__create'
                  ? (() => {
                    const v = prompt('New subject tag:');
                    handleCreate(v, setSubject, subjectOpts, setSubjectOpts);
                  })()
                  : setSubject(e.target.value)
              }
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-white"
              required
            >
              <option value="">Pick or create</option>
              {subjectOpts.map((s) => (
                <option key={s}>{s}</option>
              ))}
              <option value="__create">+ Create new subject</option>
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">Semester</label>
            <select
              value={sem}
              onChange={(e) =>
                e.target.value === '__create'
                  ? (() => {
                    const v = prompt('New semester tag:');
                    handleCreate(v, setSem, semOpts, setSemOpts);
                  })()
                  : setSem(e.target.value)
              }
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-white"
              required
            >
              <option value="">Pick or create</option>
              {semOpts.map((s) => (
                <option key={s}>{s}</option>
              ))}
              <option value="__create">+ Create new semester</option>
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm mb-2 text-gray-400">Year</label>
            <select
              value={year}
              onChange={(e) =>
                e.target.value === '__create'
                  ? (() => {
                    const v = prompt('New year tag:');
                    handleCreate(v, setYear, yearOpts, setYearOpts);
                  })()
                  : setYear(e.target.value)
              }
              className="w-full px-4 py-2 rounded bg-gray-900 border border-gray-700 focus:outline-none focus:border-white"
              required
            >
              <option value="">Pick or create</option>
              {yearOpts.map((y) => (
                <option key={y}>{y}</option>
              ))}
              <option value="__create">+ Create new year</option>
            </select>
          </div>

          {/* File */}
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full text-gray-400"
            required
          />

          {/* Progress bar */}
          {progress > 0 && (
            <div className="w-full bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Status message */}
          {message && <p className="text-gray-400 text-sm">{message}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="bg-[#a7a7a7] text-black px-6 py-2 rounded-full hover:bg-white transition"
          >
            Submit
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}