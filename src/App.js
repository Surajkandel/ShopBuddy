// npm run tailwind:watch
// npx tailwindcss -i ./src/styles/tailwind.css -o ./src/styles/output.css --watch
import './index.css';
import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
 import { ToastContainer} from 'react-toastify';

function App() {
  return (
  <>
  <ToastContainer />
  <Header/>
    <Outlet/>
    <Footer/>
  </>
  
  );
}

export default App;

