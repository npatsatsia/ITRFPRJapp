import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/layout";
import Home from '../components/home/home'
import Login from '../components/login/login'
import Register from '../components/register/register'
import SingleCollection from '../components/singleCollection/singleCollection'
import RequireAuth from '../components/requireAuth/requireAuth'
import Admin from '../components/admin/admin'
import User from '../components/user/user'
import Missing from '../components/notFound/notFound'
import PersistLogin from "../components/PersistLogin/persistLogin";

const ROLES = {
  'USER': '2001',
  'ADMIN': '5150'
}

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route element={<PersistLogin/>}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='collection/:id' element={<SingleCollection />} />

          <Route element={<RequireAuth allowedRole={"5150"} />}>
            <Route path="admin" element={<Admin />}/>
          </Route>

          <Route element={<RequireAuth allowedRole={"2001"} />}>
            <Route path="collections" element={<User />}/>
          </Route>
        </Route>

        <Route path='*' element={<Missing />} />
      </Route>
    </Routes>
  );
};

export default App;