/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ConnectDashboard from './pages/ConnectDashboard';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ConnectDashboard />} />
        <Route path="/connect" element={<ConnectDashboard />} />
      </Routes>
    </Router>
  );
}
