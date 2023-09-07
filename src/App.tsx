import './App.scss'
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import Home from "./components/screens/home/Home.tsx";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

function App() {

  return (
    <>
        <PrimeReactProvider>
            <Home/>
        </PrimeReactProvider>
    </>
  )
}

export default App
