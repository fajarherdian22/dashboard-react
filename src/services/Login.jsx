import React from "react";
import PostReq from './Post' 

const Login = () => {
    const User = {
      Username: "fajarherd22",
      Password: "fajartamvan1"
    };

    const { data, loading, error } = PostReq('/login', User);

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Error: {error.message}</div>;
    }

    localStorage.setItem("token", data);
    
    return null
  }

  export default Login;