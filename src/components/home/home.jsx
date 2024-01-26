import React from "react"
import './index.css'
import useAuth from "../../hooks/useAuth";

const Home = () => {
    const { auth } = useAuth();

    return (
        <section>
            <h1>{auth.jwt}</h1>
        </section>
    )
}

export default Home