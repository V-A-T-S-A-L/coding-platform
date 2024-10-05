import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Nav from './components/Nav';
import PrivateComponent from './components/PrivateComponent';
import Signup from './components/Signup';
import Login from './components/Login';
import Land from './components/Home';
import PostLoginhome from './components/PostLoginHome';
import CreateChallenge from './components/NewProblem';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route path='/home' element={<PostLoginhome />}/>
            <Route path='/room/:room_id' element={<h1 style={{color: "white"}}>room</h1>}/>
            <Route path='/room/:room_id/create-challenge' element={<CreateChallenge />}/>
          </Route>
          <Route path='/' element={<Land />}/>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/login' element={<Login />}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
