import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="d-flex flex-column vh-100">
            <Navbar />
            <div className="d-flex flex-grow-1 overflow-hidden">
                <Sidebar />
                <main className="flex-grow-1 p-4 bg-white overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
