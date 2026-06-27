import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import RegisterPopup from './RegisterPopup';

export default function PublicLayout() {
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar onRegisterOpen={() => setRegisterOpen(true)} />
      <main>
        <Outlet context={{ onRegisterOpen: () => setRegisterOpen(true) }} />
      </main>
      <Footer onRegisterOpen={() => setRegisterOpen(true)} />
      <RegisterPopup isOpen={registerOpen} onClose={() => setRegisterOpen(false)} />
    </div>
  );
}
