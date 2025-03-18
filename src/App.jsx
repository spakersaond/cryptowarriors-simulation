import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Navbar from './components/Navbar'
import DashboardPage from './dashboard/[walletAddress]/DashboardPage'
import Instructions from './instructions/Instructions'
import CampaignPage from './campaign/[campaignAddress]/CampaignPage'
function App() {
  return (
    <div className="w-screen font-poppins bg-slate-100 h-screen">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard/:accountAddress" element={<DashboardPage />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/campaign/:campaignAddress" element={<CampaignPage />} />
      </Routes>
    </div>
  )
}

export default App
