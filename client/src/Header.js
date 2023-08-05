import { Link, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { toast } from 'react-toastify';



export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  useEffect(() => {
    fetch('http://localhost:4000/profile',
      {
        credentials: 'include',
      }
    ).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  function logout() {
    fetch('http://localhost:4000/logout', {
      credentials: 'include',
      method: 'POST',
    });

    setUserInfo(null);
    toast.success(`Successfully logged out`, {
      position: toast.POSITION.CENTER,
    });
  }

  const username = userInfo?.username;
  return (
    <header>
      <Link to="/" className="logo" id="thoughts">Thoughts</Link>
      <nav>
        {username && (
          <>
            <Link to="/create" className="create">Create new post</Link>
            <a onClick={logout}>Logout ({username})</a>
          </>
        )}
        {!username && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
}
