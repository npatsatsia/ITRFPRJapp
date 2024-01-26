
import React, { useState } from 'react';
import './index.css';
import { Dropdown } from 'antd';
import { AiOutlineMenu } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogOut';


const Header = () => {
  const [searchValue, setSearchValue] = useState('')
  // const [toggle , setToggle] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const {auth} = useAuth()
  const logout = useLogout()

  const signOut = async () => {
    logout()
    navigate('/')
  }

  const items = [
    {
      label: <div>My Collections</div>,
      key: '0',
    },
    {
      label: <div>chdivnge view color</div>,
      key: '1',
    },
    {
      label: <div>change language</div>,
      key: '2',
    },

  ];


    return (
        <header style={location.pathname === '/login' || location.pathname === '/register' ? {display: "none" } : {}} className="header">
          <div className="main-header-container">
            <div className="headerup">
              <div className='toggle-icon'>
                <Dropdown
                    menu={{
                      items,
                    }}
                    trigger={['click']}
                  >
                    <div onClick={(e) => e.preventDefdivult()}>
                      <AiOutlineMenu/>
                    </div>
                </Dropdown>
              </div>
              <div className="header-left-section">
                  <span>Nautilus: Pelagic Mollusc</span>
              </div>
              <div className={`header-right-section`}>
                  <span>My Collections</span>
                  <span>change view color</span>
                  <span>change language</span>
              </div>
            </div>
            <nav className="hader-navbar">
              <h1 className="logo">PROJECT</h1>
              <div className='header-searchbar'>
                <input type="text" placeholder="Search" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                <button>Search</button>
              </div>
              <div className="header-auth-container">
                <div style={auth?.jwt ? {display: "flex"} : {display: 'none'}} className="loggedinMode">
                  <div className="usernameContainer">
                    <span>Welcome Back <b>{auth?.jwt && auth.username}</b></span>
                  </div>
                  <button onClick={signOut}>Sign Out</button>
                </div>
                <div style={auth?.jwt ? {display: "none"} : {display: 'flex'}} className="nav-buttons">
                    <button>Sign Up</button>
                    <button>Sign In</button>
                </div>
              </div>
            </nav>
          </div>
        </header>
    );
}

export default Header;