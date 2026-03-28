import { BrowserRouter, Routes, Route } from "react-router-dom"
import Chat from "./pages/Chat"
import Layout from "./Layout"

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Chat />} />
        </Route>
      </Routes>    
    </BrowserRouter>

  )
}