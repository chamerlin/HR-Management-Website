import React from 'react';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Home from './modules/Home'
import Leave from './modules/Leave';
import PerformanceReview from './modules/Perfomance_Review';
import AddLeave from './modules/Leave/add_new_leave';
import Claims from './modules/Claims';

const App = () => {
    return (
        <MantineProvider>
            <NotificationsProvider position='top-right' limit={3}>
                <ModalsProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route exact path='/' element={<Home />} />
                            <Route exact path="/login" element={<LoginPage />} />
                            <Route exact path="/signup" element={<SignUpPage />} />

                            <Route exact path="/claims" element={<Claims />} />
                            <Route exact path="/leave" element={<Leave />} />
                            <Route exact path="/performance_review" element={<PerformanceReview />} />

                            <Route exact path='/add_leave' element={<AddLeave />} />
                        </Routes>
                    </BrowserRouter>
                </ModalsProvider>
            </NotificationsProvider>
        </MantineProvider>
    );
}

export default App;
