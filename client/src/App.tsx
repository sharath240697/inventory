import './App.css'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Sales from './Sales';
import Inventory from './Inventory';

const router = createBrowserRouter([{'path': '/', element: <Sales />},
  {'path': '/add', element: <Inventory />},
])
function App() {
  return (<RouterProvider router={router} />)

}

export default App
