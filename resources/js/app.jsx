import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/app.css';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ItemList from "./components/ItemList";
import Chat from "./components/Chat";
import Videochat from "./components/Videochat";

function App() {
    return (
        <BrowserRouter>
        <div className="container">
        <div className="row">
            <div className="col-4">
                        <nav className="navbar navbar-expand-lg navbar-light bg-light">

                            <div className="container-fluid">
                                <Link className="navbar-brand" to="/">Now Optics</Link>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarNav">
                                    <ul className="navbar-nav">
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/">Task 1</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/chat">Task 2</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/videochat">Task 3</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>
                    </div>
                <div className="col-8">
                <Routes>
                    <Route path="/" element={<ItemList />} />
                    {/* Asegúrate de agregar los componentes correspondientes para las rutas siguientes */}
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/videochat" element={<Videochat />} />
                </Routes>
                </div>
            </div>

            </div>



        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
