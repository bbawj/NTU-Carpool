import React from 'react'
import "./Login.css"

function Login() {
    return (
        <div className="login">
            <div className="card1">
                <h1>NTU Carpool</h1>
                <h2>Never be late again.</h2>
            </div>
            <div className="card2">
                <h1>Login</h1>
                <div className="inputContainer">
                    <span class="material-icons-outlined">person_outline</span>
                    <input placeholder="Username" type="text" />
                </div>
                
                <div className="inputContainer">
                <span class="material-icons-outlined">lock</span>
                    <input placeholder="Password" type="text" />
                </div>
                
                <p>Don't have an account? Signup.</p>
            </div>
        </div>
    )
}

export default Login
