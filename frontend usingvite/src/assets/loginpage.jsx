import React, { useState } from "react";
import styled from 'styled-components';
import { useGlobalData } from "./reducer";
import { useNavigate } from "react-router-dom";
// const ENDPOINT = 'http://localhost:8000';
const ENDPOINT = 'https://sameep-chat-website.onrender.com';

const Loginpage = (props) => {
    const { state, dispatch } = useGlobalData();
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        name: "",
        password: "",
        cpassword: "",
        email: "",
        number: "",
    });
    const inputEvent = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setLoginData({ ...loginData, [name]: value });
    };
    return (
        <MainDiv>
            <h2>Login</h2>
            <form className="login-div">
                <div className="input-fields-div">
                    <label>Username</label>
                    <input name="name" type="text" onChange={inputEvent} value={loginData.name} placeholder="Username" />
                </div>
                <div className="input-fields-div">
                    <label>Number</label>
                    <input name="number" type="number" onChange={inputEvent} value={loginData.number} placeholder="Number" />
                </div>
                <div className="input-fields-div">
                    <label>Email</label>
                    <input name="email" type="email" onChange={inputEvent} value={loginData.email} placeholder="Email" />
                </div>
                <div className="input-fields-div">
                    <label>Password</label>
                    <input name="password" type="password" onChange={inputEvent} value={loginData.password} placeholder="Password" />
                </div>
                <div className="input-fields-div">
                    <label>Confirm Password</label>
                    <input name="cpassword" type="password" onChange={inputEvent} value={loginData.cpassword} placeholder="Confirm Password" />
                </div>
                <div>
                    <input type="file" accept="image/*" id="imageInput" onChange={(event) => {
                        const imageInput = document.getElementById('imageInput');
                        const previewImage = document.getElementById('previewImage');

                        const selectedFile = event.target.files[0];
                        if (selectedFile) {
                            const reader = new FileReader();

                            reader.onload = function (e) {
                                previewImage.src = e.target.result;
                            };

                            reader.readAsDataURL(selectedFile);
                        }
                    }} />
                    <img id="previewImage" src="#" alt="Preview" style={{ maxWidth: "100px", maxHeight: "100px" }} />
                    <button id="convertButton" onClick={(e) => {
                        e.preventDefault();
                        const previewImage = document.getElementById('previewImage');
                        const imageUrl = previewImage.src;
                        console.log({ 'Image URL:': imageUrl });
                    }}>Convert and Use</button>
                </div>
                <button type="submit" onClick={async (e) => {
                    e.preventDefault();
                    const { name, number, email, password, cpassword } = loginData;
                    if (!name || !number || !email || !password || !cpassword) {
                        alert("Please fill all the fields");
                        return;
                    }
                    const response = await fetch(`${ENDPOINT}/newuser`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name,
                            number,
                            email,
                            password,
                            cpassword,
                            whole_list: [],
                        }),
                    });
                    const data = await response.json();
                    console.log({ logindata: data });
                    localStorage.setItem("token", data._id, {
                        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
                    });
                    dispatch({ type: 'USERSDATA', payload: data });
                    props.setLoginStatus(true);
                }}>Login</button>
            </form>
        </MainDiv>
    );
};

const MainDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: fit-content;
    margin: auto;
    h2{
        margin: 3rem;
        margin-top: 14rem;
        font-size: 3rem;   
    }
    .login-div{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        width: 400px;
        padding: 2rem 0rem;
        border-radius: 1rem;
        background-color: #3a3a3a;
        .input-fields-div{
            display: flex;
            flex-direction: row;
            justify-content:space-evenly;
            align-items: center;
            width: 100%;
        }
    }
`;

export default Loginpage;