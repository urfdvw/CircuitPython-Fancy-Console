import React from 'react'
import ReactDOM from 'react-dom/client'
// import App from './App'
import App from '../component_tests/TestFancyConsole'
// import App from '../component_tests/TestRepl'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
