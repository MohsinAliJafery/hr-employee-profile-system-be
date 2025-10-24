import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {/* This is where route pages appear */}
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
