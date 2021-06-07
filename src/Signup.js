import React from 'react'
import { Link } from 'react-router-dom'
import "./Login.css"

function Signup() {
    return (
        <div className="login">
            <div className="card1">
                <h1>NTU Carpool</h1>
                <h2>Never be late again.</h2>
            </div>
            <div className="card2">
                <h1>Sign Up</h1>
                <form action="">
                <div className="inputContainer">
                    <span class="material-icons-outlined">person_outline</span>
                    <input placeholder="Username" type="text" />
                </div>
                
                <div className="inputContainer">
                <span class="material-icons-outlined">lock</span>
                    <input placeholder="Password" type="text" />
                </div>
                <div className="loginBtn">
                <button>Register</button>
                </div>
                </form>
                <p>Already have an account? <Link to="/">Login.</Link></p>
            </div>
        </div>
    )
}

export default Signup
