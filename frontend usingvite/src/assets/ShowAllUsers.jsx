import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalData } from "./reducer";
import styled from "styled-components";
import { ENDPOINT } from '../HideData';
// const ENDPOINT = 'http://localhost:8000';
// const ENDPOINT = 'https://sameep-chat-website.onrender.com';

const ShowAllUsers = (props) => {
    const [allUsers, setAllUsers] = useState([]);
    const [allGroups, setAllGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);


    const { state, dispatch } = useGlobalData();
    const navigate = useNavigate();
    const id = localStorage.getItem('token');

    const fetchUsers = async () => {
        setLoadingUsers(true);
        const response = await fetch(`${ENDPOINT}/user/getusers`);
        const data = await response.json();
        setAllUsers(data);
        setLoadingUsers(false);
    };
    const fetchGroups = async () => {
        setLoadingGroups(true);
        try {
            const response = await fetch(`${ENDPOINT}/group`);
            const data = await response.json();
            setAllGroups(data);
            setLoadingGroups(false);
        } catch (error) {
            console.log(error);
            setLoadingGroups(false);
        }
    };

    const startConversation = async (index) => {
        const response_sender = await fetch(`${ENDPOINT}/user/startconversation/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: allUsers[index].name,
                _id: allUsers[index]._id
            }),
        });
        const response_receiver = await fetch(`${ENDPOINT}/user/startconversation/${allUsers[index]._id}`, {
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
        props.setShowUsers(false);
    };

    const joinGroup = async (group_id) => {
        const response = await fetch(`${ENDPOINT}/group/join/${group_id}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        props.setSelectedUserChat(data._id);
        props.setShowUsers(false);
    };

    useEffect(() => {
        fetchUsers();
        fetchGroups();
    }, []);

    return (
        <MainDiv>
            <button onClick={() => {
                props.setShowUsers(false);
            }} style={{ margin: '1rem' }}>Go Back</button>
            <div style={{ color: 'aqua' }}>Users:</div>
            <div>
                {
                    loadingUsers ?
                        <i className="fa-solid fa-spinner fa-spin-pulse"></i> :
                        <>
                            {
                                allUsers ?
                                    allUsers.map((user, index) => {
                                        if (user._id !== id)
                                            return (
                                                <div key={user._id} className="all-users" onClick={() => {
                                                    startConversation(index);
                                                }}>{user.name}</div>
                                            );
                                    }) :
                                    null
                            }
                        </>
                }
            </div>
            <div style={{ color: 'aqua' }}>Groups:</div>
            <div>
                {
                    loadingGroups ?
                        <i className="fa-solid fa-spinner fa-spin-pulse"></i> :
                        <>{
                            allGroups ?
                                allGroups.map((group, index) => {
                                    return (
                                        <div key={group._id} className="all-users" onClick={() => {
                                            joinGroup(group._id);
                                        }}>{group.group_name}</div>
                                    );
                                }) : null
                        }
                        </>
                }
            </div>
        </MainDiv>
    );
};

const MainDiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
    background-color: #454546;
    height: 100vh;
    min-width: 35rem;
    .all-users{
        padding: 1rem;
        cursor: pointer;
        &:hover{
            background-color: #303031;
        }
    }
`;

export default ShowAllUsers;