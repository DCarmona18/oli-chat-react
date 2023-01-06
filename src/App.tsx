import { Route, Routes } from 'react-router-dom';
import './App.css';
import AppRoutes from './AppRoutes';

const App = () => {
  return (
    <div className="App">
        <Routes>
          {AppRoutes.map((route, index) => {
            const { element, ...rest } = route;
            return <Route key={index} {...rest} element={element} />;
          })}
        </Routes>
    </div>
  );
}

export default App;
