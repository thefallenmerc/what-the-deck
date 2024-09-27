import '@/App.css';
import ServerUI from '@/pages/server-ui';
import { ClientUI } from './pages/client-ui';

function App() {
    const searchParams = new URLSearchParams(window.location.search);
    const isClientRender = searchParams.get("view") === "client";
    console.log("view", searchParams.get("view"))

    return (
        <div id="App">
            {
                isClientRender ? <ClientUI /> : <ServerUI />
            }
        </div>
    );
}

export default App
