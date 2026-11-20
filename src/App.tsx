import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { StudentsPage } from './pages/StudentsPage';
import { AttendancePage } from './pages/AttendancePage';
import { BehaviorPage } from './pages/BehaviorPage';
import { BehaviorDetailPage } from './pages/BehaviorDetailPage';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/subject/:subjectId/students" element={<StudentsPage />} />
        <Route path="/subject/:subjectId/attendance" element={<AttendancePage />} />
        <Route path="/subject/:subjectId/behavior" element={<BehaviorPage />} />
        <Route path="/subject/:subjectId/behavior/:studentId" element={<BehaviorDetailPage />} />
      </Routes>
    </Layout>
  );
}