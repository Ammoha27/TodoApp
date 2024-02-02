// App.tsx
import React from 'react';
// other imports...
import {Todolist} from './components/Todolist';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';

import {Header} from "./components/Header";
function App() {
    return (
        <Router>
        <Header/>

                <Routes>
                    <Route path="/" element={<Todolist />} />
                </Routes>
        </Router>
    );
}


export default App;
