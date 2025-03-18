import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThirdwebProvider } from 'thirdweb/react'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThirdwebProvider>
      <App />
    </ThirdwebProvider>
  </BrowserRouter>
)
