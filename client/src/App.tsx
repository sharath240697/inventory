import './App.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Sales from './pages/Sales';
import Inventory from './Inventory';
import { SalesProvider } from './context/SalesContext';
import { SearchProvider } from './context/SearchContext';

const router = createBrowserRouter([
  {'path': '/', element: 
    <SalesProvider>
      <SearchProvider>
        <Sales />
      </SearchProvider>
    </SalesProvider>
  },
  {'path': '/add', element: <Inventory />},
])

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
