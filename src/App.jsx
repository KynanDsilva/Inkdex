import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home   from './pages/Home';
import Explore  from './pages/Explore';
import Upload from './pages/Upload';
import Auth from './pages/Auth';
import Notes from './pages/Notes';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}   />
        <Route path="/explore" element={<Explore />}  />
        <Route path="/upload" element={<Upload />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}