import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { store } from './store/store.js';
import { Toaster } from 'react-hot-toast';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
    <Toaster
      // toastOptions={{
      //   className: "",
      //   style: {
      //     padding: "12px",
      //     color: "#713200",
      //     background: "#f1efef",
      //     fontFamily: "Lato, sans-serif",
      //     fontSize: "17px",
      //     width: "280px",
      //   },
      // }}
      />
  </StrictMode>,
)
