import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Breathe from './pages/Breathe'
import Journal from './pages/Journal'
import Sounds from './pages/Sounds'
import Focus from './pages/Focus'
import Affirmations from './pages/Affirmations'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/breathe" element={<Breathe />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/sounds" element={<Sounds />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/affirmations" element={<Affirmations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
