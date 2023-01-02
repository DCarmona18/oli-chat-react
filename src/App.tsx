import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <div className="App">
        <BrowserRouter>
          <Routes>
            {AppRoutes.map((route, index) => {
              const { element, ...rest } = route;
              return <Route key={index} {...rest} element={element} />;
            })}
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
