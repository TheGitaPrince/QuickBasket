import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from "react-router-dom";
import { router } from "./route/index.jsx";
import {store } from './store/store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
       <RouterProvider router= {router} />
    </Provider>
)
