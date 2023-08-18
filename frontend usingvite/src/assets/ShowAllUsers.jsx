import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalData } from "./reducer";
import styled from "styled-components";
const ENDPOINT = 'https://sameep-chat-website.onrender.com/';
// const ENDPOINT = 'http://localhost:8000';

const ShowAllUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const { state, dispatch } = useGlobalData();
    const navigate = useNavigate();
    const id = localStorage.getItem('token');

    const fetchUsers = async () => {
        const response = await fetch(`${ENDPOINT}/getusers`);
        const data = await response.json();
        setAllUsers(data);
    };

    const startConversation = async (index) => {
        console.log(allUsers);
        console.log(index);
        const response_sender = await fetch(`http://localhost:8000/startconversation/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: allUsers[index].name,
                _id: allUsers[index]._id
            }),
        });
        const response_receiver = await fetch(`http://localhost:8000/startconversation/${allUsers[index]._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: state.name,
                _id: id
            }),
        });

        const sender_data = await response_sender.json();
        const receiver_data = await response_receiver.json();
        console.log({ sender_data: sender_data });
        console.log({ receiver_data: receiver_data });
        navigate('/');
    };
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <MainDiv>
            <h3>All Users</h3>
            {
                allUsers ?
                    allUsers.map((user, index) => {
                        if (user._id !== id)
                            return (
                                <div key={user._id} className="all-users" onClick={() => {
                                    startConversation(index);
                                }}>{user.name}</div>
                            );
                    }) : null
            }
        </MainDiv>
    );
};

const MainDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
    .all-users{
        padding: 1rem;
        cursor: pointer;
        &:hover{
            background-color: #454546;
        }
    }
`;

export default ShowAllUsers;