import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId="271758727494-504maj7nul4ar9hoeiihnrkrbutbvkfc.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
)
