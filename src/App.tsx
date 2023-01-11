import { Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import { Navigation } from './Routes/Navigation/Navigation';

const App = () => {
  return (
    <div className="App">
        <Routes>
          <Route index path='/' element={<Login />} />
          <Route path='/home' element={<Navigation />}>
            <Route index element={<Home />}/>
          </Route>
        </Routes>
    </div>
  );
}

export default App;
