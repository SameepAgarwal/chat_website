import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalData } from "./reducer";
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client';
import { ENDPOINT } from '../HideData';
// const ENDPOINT = 'http://localhost:8000';
// const ENDPOINT = 'https://sameep-chat-website.onrender.com';
// const END_POINT = 'http://localhost:8000';
var socket;

const SelectedUserShow = (props) => {
    const chatId = props.selectedUserChat;
    const { state, dispatch } = useGlobalData();
    let id = state !== undefined ? state.id : undefined;
    const [messages, setMessages] = useState([]);
    const [newMessages, setNewMessages] = useState('');
    const [user, setUser] = useState();
    const [name, setName] = useState('');
    const [onlineStatus, setOnlineStatus] = useState(false);
    const [typingStatus, setTypingStatus] = useState(false);
    const navigate = useNavigate();

    const [loadingAnimation, setLoadingAnimation] = useState(false);

    let scroll_to_bottom = document.querySelector('#scroll-msg');

    function scrollBottom(element) {
        element.scroll({ top: element.scrollHeight, behavior: "smooth" });
    }

    const findUserMessages = async () => {
        const response = await fetch(`${ENDPOINT}/message/getmessages/${id}/${chatId}`);
        const data = await response.json();
    };
    const fetchMessages = async () => {
        setLoadingAnimation(true);
        try {
            const response = await fetch(`${ENDPOINT}/user/getusers/${id}/${chatId}`);
            const data = await response.json();

            // chat person data
            setUser(data);

            //chat person name
            setName(data.name);

            //chat person messages array
            setMessages(data.messages);

            setLoadingAnimation(false);
            socket.emit('join chat', id);

        } catch (error) {
            console.log({ error: error.message });
            setLoadingAnimation(false);
        }
        // let scroll_to_bottom = document.getElementById('scroll-msg');
        // scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
        if (scroll_to_bottom)
            scrollBottom(scroll_to_bottom);
    };
    const sendMessages = async () => {
        if (newMessages === '') {
            alert("Enter Message To Send!");
            return;
        }
        setLoadingAnimation(true);

        const newMessageSenderObj = {
            "message": newMessages,
            "message_time": new Date(Date.now()).toLocaleTimeString(),
            "sender_name": state.name
        };
        const response_sender = await fetch(`${ENDPOINT}/message/newmessage/sender/${id}/${chatId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessageSenderObj)
        });

        const data_sender = await response_sender.json();
        const newMessageReceiverObj = {
            "message": newMessages,
            "message_time": new Date(Date.now()).toLocaleTimeString(),
            "sender_name": state.name
        };
        const response_receiver = await fetch(`${ENDPOINT}/message/newmessage/receiver/${data_sender.sender_id}/${state._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessageReceiverObj)
        });

        const data_receiver = await response_receiver.json();
        setNewMessages("");
        const newMessageObject = { message: newMessageSenderObj.message, message_time: newMessageSenderObj.message_time, sender_name: newMessageSenderObj.sender_name, receiver_id: data_sender.sender_id, _id: data_receiver._id };
        console.log({ data_receiver: data_receiver });

        setMessages([...messages, data_receiver]);

        socket.emit('new message', newMessageObject);
        setLoadingAnimation(false);
        if (scroll_to_bottom) scrollBottom(scroll_to_bottom);
        // console.log("sent");
    };

    useEffect(() => {
        if (state == undefined) {
            navigate('/');
        }
        else {
            // console.log({ state_from_selecctedUser: state });
            id = state._id;
            // setId(state._id);
            fetchMessages();
            setOnlineStatus(false);
        }
        if (socket) socket.emit("online", id);
        if (user != undefined)
            if (socket) socket.on("check online", (_id) => {
                if (user.sender_id == _id) {
                    setOnlineStatus(true);
                    // console.log(user.sender_id);
                    socket.emit("confirm online", id);
                }
            });
        if (socket) socket.on("online confirm", (_id) => {
            if (id == _id) {
                // console.log(_id);
                setOnlineStatus(true);
            }
        });
    }, [chatId]);

    useEffect(() => {
        const id = localStorage.getItem('token');
        if (id !== null) {
            socket = io(ENDPOINT);
            socket.emit("setup", id);
        }
    }, []);

    useEffect(() => {
        socket.on("message received", (messageObject) => {
            console.log(state);
            if (messageObject.receiver_id === state._id) {

                // console.log({ messageObject: messageObject });
                // console.log({ messages: messages });
                console.log({ id: id });
                setMessages([...messages, { message: messageObject.message, message_time: messageObject.message_time, sender_name: messageObject.sender_name, _id: messageObject._id }]);
                if (scroll_to_bottom)
                    scrollBottom(scroll_to_bottom);
            }
        });
        if (scroll_to_bottom) scrollBottom(scroll_to_bottom);
        socket.emit("online", id);
        if (user !== undefined)
            socket.on("check online", (_id) => {
                if (user.sender_id == _id) {
                    setOnlineStatus(true);
                    console.log(user.sender_id);
                    // socket.emit("confirm online", id);
                }
            });
        // socket.on("online confirm", (_id) => {
        //     if (id == _id) {
        //         console.log(_id);
        //     }
        // });
    }, [messages, newMessages, onlineStatus]);

    return (
        <SelectedUser onDoubleClick={() => {
            if (window.innerWidth <= 850) {
                const user_show = document.querySelector('.user-show-container');
                user_show.style.display = 'none';
                user_show.style.opacity = 0;
            }
        }}>
            <div className="user-details-div">
                {
                    <i className="fa-solid fa-bars menu-btn" style={{
                        cursor: 'pointer',
                        backgroundColor: '#2e2e2e',
                        padding: '1rem',
                        borderRadius: '50%'
                    }} onClick={() => {
                        if (window.innerWidth <= 850) {
                            const user_show = document.querySelector('.user-show-container');
                            user_show.style.display = 'flex';
                            user_show.style.opacity = 1;
                        }
                    }}></i>
                }
                {
                    user !== undefined && user.icon ?
                        <img src="../../sameep.jpeg" alt="My Image" className="selected-user-image" />
                        :
                        <div className="selected-user-image">
                            <i className="fa-solid fa-user"></i>
                        </div>
                }
                <h4>
                    {user !== undefined ? user.name : <></>}
                    {
                        onlineStatus ? <p style={{ color: '#2e3e' }}>Online</p> : <p style={{ color: 'red' }}>Offline</p>
                    }
                </h4>
                <div className="search-message">
                    <i className="fa-solid fa-magnifying-glass" onClick={findUserMessages}></i>
                </div>
            </div>
            <div style={{
                height: "100%",
                width: '100%',
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: 'scroll',
            }} className="main-div-scrollBar" >
                {
                    <>
                        {
                            !messages.length > 0 ?
                                <div className="no-messages" id="scroll-msg">
                                    <p>No messages</p>
                                </div>
                                :
                                <div className="messages" id="scroll-msg" >
                                    {
                                        messages.length > 0 ?
                                            messages.map((currMes, msgIndex) => {
                                                if (currMes.sender_name !== name) {
                                                    return <div key={currMes._id} className="sended-message-div">
                                                        <div className="sended-message">
                                                            <p style={{ color: '#be1818', textAlign: 'right' }}>You</p>
                                                            {currMes.message}
                                                            <p style={{
                                                                color: '#bcb7b7',
                                                                textAlign: 'right',
                                                                fontSize: '1rem'
                                                            }}>{currMes.message_time}</p>
                                                        </div>
                                                        {/* <img src="../../../sameep.jpeg" alt="My Image" className="sender-image" /> */}
                                                        {
                                                            user !== undefined && !user.icon ?
                                                                <img src="../../sameep.jpeg" alt="My Image" className="sender-image" />
                                                                :
                                                                <div className="sender-image">
                                                                    <i className="fa-solid fa-user"></i>
                                                                </div>
                                                        }
                                                    </div>;
                                                }
                                                else {
                                                    return <div key={currMes._id} className="received-message-div">
                                                        {
                                                            user !== undefined && user.icon ?
                                                                <img src="../../sameep.jpeg" alt="My Image" className="receiver-image" />
                                                                :
                                                                <div className="receiver-image">
                                                                    <i className="fa-solid fa-user"></i>
                                                                </div>
                                                        }
                                                        <div className="receiver-message">
                                                            <p style={{
                                                                color: '#20bf3e'
                                                            }}>{currMes.sender_name}</p>
                                                            {currMes.message}
                                                            <p style={{
                                                                color: '#bcb7b7',
                                                                fontSize: '1rem'
                                                            }}>{currMes.message_time}</p>
                                                        </div>
                                                    </div>;
                                                }
                                            }) : <>Reload!</>
                                    }
                                </div>
                        }
                    </>
                }
            </div>
            <div className="send-message-div">
                <div>
                    <div className="emoji-picker" style={{

                    }}>
                        <EmojiPicker
                            onEmojiClick={(emoji) => {
                                setNewMessages(newMessages + emoji.emoji);
                                const emojiPicker = document.querySelector('.emoji-picker');
                                emojiPicker.style.display = 'none';
                                const message_input = document.querySelector('.message-input');
                                message_input.focus();
                            }}
                            width="300px"
                        />
                    </div>
                    <span onClick={() => {
                        const emojiPicker = document.querySelector('.emoji-picker');
                        if (emojiPicker.style.display != 'block') {
                            emojiPicker.style.display = 'block';
                        }
                        else {
                            emojiPicker.style.display = 'none';
                        }
                    }} style={{ cursor: 'pointer', padding: '0.3rem 1rem' }}>😊</span>
                </div>
                <input type="text" className="message-input" autoComplete="off" onChange={(e) => {
                    setNewMessages(e.target.value);
                }} onKeyDown={(press) => {
                    if (press.key === 'Enter') {
                        sendMessages();
                    }
                }} name="new-message" value={newMessages} placeholder="Message" />
                <div className="send-btn">
                    {
                        loadingAnimation ?
                            <i className="fa-solid fa-spinner fa-spin-pulse"></i>
                            :
                            <i className="fa-solid fa-paper-plane" onClick={sendMessages}></i>
                    }
                </div>
            </div>
        </SelectedUser>
    );
};

const SelectedUser = styled.section`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;    
    height: 100vh;
    max-height: 100vh;
    background: linear-gradient(#adafae , rgba(101, 103, 105, 0.93));   
    .user-details-div{
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 1rem 1.4rem;
        justify-content: flex-start;
        gap: 1.4rem;
        width: 100%;
        background-color: #696767;
        h4{
            ul{
                flex-direction: column;
            }
        }
        .selected-user-image{
            /* height: 5rem;
            border-radius: 50%;
            background-color: #3c3a3a; */
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            height: 5rem;
            width: 5rem;
        }
        .search-message{
            margin-left: auto;
        }
    }
    .main-div-scrollBar{
        overflow: scroll;
        &::-webkit-scrollbar{
            display: none;
        }
    }
    .no-messages{
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        p{
            color: #000;
        }
    }
    .messages{
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 1rem 0rem;
        gap: 1rem;
        overflow: scroll;
        margin-top: auto;
        
        &::-webkit-scrollbar{
            display: none;
        }
        .sended-message-div{
            align-self: flex-end;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-end;
            gap: 1rem;
            width: 100%;
            .sended-message{
                background-color: #2e2e2e;
                padding: 0.5rem 1rem;
                border-radius: 1rem;
                border-color: transparent;
                border-top-right-radius: 0rem;
                position: relative;
                color: #fff;
                font-size: 1.5rem;
                max-width: 90%;
                &::after{
                    content: "";
                    position: absolute;
                    top: 0rem;
                    right: -1.89rem;
                    height: 0;
                    width: 0;
                    border: 10px solid black;
                    border-color: transparent;
                    border-left-color: #2e2e2e;
                }
            }
            .sender-image{
                background-color: #3c3a3a;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                height: 4rem;
                width: 4rem;
            }
        }
        .received-message-div{
            align-self: flex-start;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 1rem;
            width: 100%;
            .receiver-message{
                padding: 0.5rem 1rem;
                background-color: #2e2e2e;
                border-radius: 1rem;
                border-color: transparent;
                border-top-left-radius: 0rem;
                position: relative;
                color: #fff;
                font-size: 1.5rem;
                max-width: 90%;
                &::after{
                    content: "";
                    position: absolute;
                    top: 0rem;
                    left: -1.89rem;
                    height: 0;
                    width: 0;
                    border: 10px solid black;
                    border-color: transparent;
                    border-right-color: #2e2e2e;
                }
            }
            .receiver-image{
                background-color: #3c3a3a;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                height: 4rem;
                width: 4rem;
            }
        }
    }

    .send-message-div{
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
        background-color: #2a2929;
        position: relative;
        margin-top: auto;
        .emoji-picker{
                display: none;
                position: absolute;
                bottom: 5rem;
                ul{
                    display: flex;
                    flex-direction: column !important;
                }
            }
        input{
            width: 100%;
            border: none;
            padding: 0.7rem;
            background-color: transparent;
            text-transform: capitalize;
        }
        .send-btn{
            background-color: #40babc;
            /* background-color: #3c3c3c; */
            padding: 0.4rem 1rem;
            cursor: pointer;
            border-radius: 50%;
            margin: 1rem;

        }
    }
    

`;

export default SelectedUserShow;
