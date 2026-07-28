import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="d-flex flex-column vh-100" style={{ backgroundColor: 'var(--bg-body)' }}>
            <Navbar toggleSidebar={toggleSidebar} />
            <div className="d-flex flex-grow-1 overflow-hidden">
                <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
                <main className="flex-grow-1 p-4 overflow-auto" style={{ backgroundColor: 'var(--bg-body)' }}>
                    <div className="container-fluid max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
