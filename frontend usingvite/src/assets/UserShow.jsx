import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import whole_list from "../../domeWhatappData.json";
import SelectedUserShow from "./SelectedUserShow";
import { useGlobalData } from "../assets/reducer";
import io from 'socket.io-client';
import { ENDPOINT } from '../HideData';
// const ENDPOINT = 'http://localhost:8000';
// const ENDPOINT = 'https://sameep-chat-website.onrender.com';
var socket;

const UserShow = (props) => {
    const ifPhotoAdded = true;
    const [allUsersFoundChatWith, setAllUsersFoundChatWith] = useState([]);
    const [allGroupsJoinWith, setAllGroupsJoinWith] = useState([]);
    const navigate = useNavigate();
    const { state, dispatch } = useGlobalData();
    // const [selectedUserChat, setSelectedUserChat] = useState();
    const id = localStorage.getItem("token");
    const { setLoginStatus } = props;
    const [loadingAnimation, setLoadingAnimation] = useState(false);

    const findAllChats = async () => {
        setLoadingAnimation(true);
        try {
            const response = await fetch(`${ENDPOINT}/user/getusers/${id}`);
            const currUserData = await response.json();
            setAllUsersFoundChatWith(currUserData);
            setLoadingAnimation(false);
        } catch (error) {
            console.log("error", error);
        }
    };
    const findAllGroups = async () => {
        try {
            const response = await fetch(`${ENDPOINT}/group/${id}`);
            const data = await response.json();
            setAllGroupsJoinWith(data);
        } catch (error) {
            console.log(error);
        }
    };
    const createGroup = async (group_name) => {
        if (group_name.value === '') {
            alert("Please Type a Group Name");
            return;
        }
        try {
            const response = await fetch(`${ENDPOINT}/group/create/${group_name}/${state._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application' }
            });
            const data = await response.json();
            setAllGroupsJoinWith([...allGroupsJoinWith, data]);
            // console.log({ data_create_group: data });
            // console.log(group_name);
            // console.log(state._id);
        } catch (e) {
            alert("error creating group");
            console.log(e);
        }
        const create_group = document.querySelector('.create-new-group-div');
        create_group.style.display = 'none';
    };

    useEffect(() => {
        const id = localStorage.getItem('token');
        if (id !== null) {
            socket = io(ENDPOINT);
            socket.emit("setup", id);
        }
    }, []);

    useEffect(() => {
        // console.log({ userShow_state: state });
        findAllChats();
        findAllGroups();
    }, []);


    return (
        <UserMainDiv>
            <div className="my-details-div" style={{ marginBottom: '5rem' }}>
                <div className="my-options">
                    {
                        ifPhotoAdded ?
                            <img src="../../sameep.jpeg" alt="My Image" className="my-image" />
                            :
                            <div className="my-image">
                                <i className="fa-solid fa-user"></i>
                            </div>
                    }
                    <div className="my-options-container">
                        <i className="fa-regular fa-message" onClick={() => {
                            // navigate('/allusers');
                            props.setShowUsers(true);
                        }}></i>
                        <div className="more-options-div" onClick={() => {
                            const more_options_div = document.querySelector('.more-options-div');
                            console.log({ more_options_div });
                            console.log(more_options_div.children[1].style.display);
                            if (more_options_div.children[1].style.display == "" || more_options_div.children[1].style.display == "none") {
                                more_options_div.children[1].style.display = 'flex';
                            }
                            else {
                                more_options_div.children[1].style.display = "none";
                            }
                        }}>
                            <i className="fa-solid fa-list-ul" ></i>
                            <div className="hidden-options-div">
                                <p className="logout-btn" onClick={() => {
                                    localStorage.removeItem("token");
                                    props.setLoginStatus(false);
                                    navigate('/');
                                }}>Logout</p>
                                <p onClick={() => {
                                    //TODO: Handle Creating New Group
                                    const create_group = document.querySelector('.create-new-group-div');
                                    create_group.style.display = 'block';
                                }}>Create New Group</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="user-name-main">{allUsersFoundChatWith ? allUsersFoundChatWith.name : null}</div>
            </div>
            <div className="create-new-group-div">
                <div className="create-new-group">
                    <input type="text" placeholder="Enter Group Name" className="group-name" onKeyDown={async (press) => {
                        if (press.key === 'Enter') {
                            const group_name = document.querySelector('.group-name');
                            await createGroup(group_name.value);
                        }
                    }} />
                    <div className="create-group-btn-div">
                        <button onClick={() => {
                            const create_group = document.querySelector('.create-new-group-div');
                            create_group.style.display = 'none';
                        }}>Back</button>
                        <button onClick={async () => {
                            const group_name = document.querySelector('.group-name');
                            await createGroup(group_name.value);
                        }}>Create Group</button>
                    </div>
                </div>
            </div>
            <div className="users-list">
                {
                    loadingAnimation ?
                        <div style={{ width: '100%', textAlign: 'center' }}><i className="fa-solid fa-spinner fa-spin-pulse fa-2xl"></i></div> :
                        <>
                            {
                                allUsersFoundChatWith ?
                                    <>{
                                        allUsersFoundChatWith.whole_list ?
                                            <>
                                                {
                                                    allUsersFoundChatWith.whole_list.length > 0 ?
                                                        allUsersFoundChatWith.whole_list.map((curObj, index) => {
                                                            return (
                                                                <div className="user-class" key={index} onClick={() => {
                                                                    props.setIsGroup(false);
                                                                    props.setSelectedUserChat(curObj._id);
                                                                }}>
                                                                    {
                                                                        curObj.icon ?
                                                                            <img src="../../sameep.jpeg" alt="My Image" className="user-image" />
                                                                            :
                                                                            <div className="user-image">
                                                                                <i className="fa-solid fa-user"></i>
                                                                            </div>
                                                                    }
                                                                    <div className="user-details">
                                                                        <div className="user-name">
                                                                            <h4>{curObj.name}</h4>
                                                                            <p style={{ fontSize: '1.3rem' }}>{curObj.latest_message_time ? curObj.latest_message_time : null}</p>
                                                                        </div>
                                                                        <div>
                                                                            {curObj.messages.length > 0 ? curObj.messages[curObj.messages.length - 1].sender_name : null}{curObj.latest_message ? ' : ' + curObj.latest_message : null}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                        :
                                                        <h4 className="no-users-msg">No Users Yet</h4>
                                                }
                                            </>
                                            :
                                            null
                                    }
                                    </>
                                    :
                                    null
                            }
                            <div>Groups:</div>
                            {
                                allGroupsJoinWith ?
                                    <>{
                                        allGroupsJoinWith.length > 0 ?
                                            allGroupsJoinWith.map((curGroup, index) => {
                                                return (
                                                    <div className="user-class" key={index}
                                                        onClick={() => {
                                                            //*Here We Give Group Id to selected user chat
                                                            props.setIsGroup(true);
                                                            props.setSelectedUserChat(curGroup._id);
                                                            // navigate(`/user/${curObj._id}`);
                                                        }}
                                                    >
                                                        {
                                                            curGroup.icon ?
                                                                <img src="../../sameep.jpeg" alt="My Image" className="user-image" />
                                                                :
                                                                <div className="user-image">
                                                                    <i className="fa-solid fa-user"></i>
                                                                </div>
                                                        }
                                                        <div className="user-details">
                                                            <div className="user-name">
                                                                <h4>{curGroup.group_name}</h4>
                                                                <p style={{ fontSize: '1.3rem' }}>{curGroup.latest_message_time ? curGroup.latest_message_time : null}</p>
                                                            </div>
                                                            <div>
                                                                {curGroup.messages.length > 0 ? curGroup.messages[curGroup.messages.length - 1].sender_name : null}{curGroup.latest_message ? ' : ' + curGroup.latest_message : null}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                            : <h4 className="no-users-msg">No Groups Yet</h4>
                                    }
                                    </>
                                    :
                                    <>
                                        Not Loaded
                                    </>
                            }
                        </>
                }
            </div>
        </UserMainDiv>
    );
};

const UserMainDiv = styled.div`

background-color: #2e2e2e;
display: flex;
flex-direction: column;
min-width: 35rem;
resize: horizontal;
overflow-x: hidden;
height: 100vh;
.create-new-group-div{
    display: none;
    width: 100vw;
    height: 100vh;
    position: absolute;
    opacity: 1;
    z-index: 2;
    background-color: rgba(50, 49, 49, 0.38);
    .create-new-group{
        position: absolute;
        background-color: rgb(181, 180, 180);
        padding: 2rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2rem;
        input{
            width: 100%;
            padding: 0.9rem;
            border-radius: 1rem;
        }
        button{
            margin: 0rem 2rem;
            background-color: #2e2e2eeb;
        }
    }
}

.my-details-div{
    .user-name-main{
        padding: 1rem;
        font-size: 2.5rem;
        text-decoration: underline;
    }
}

.my-options{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 2rem 2rem 0rem 2rem;
    margin-bottom: 0rem;
    .my-image{
        background-color: #3c3a3a;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        height: 5rem;
        width: 5rem;
    }
    .my-options-container{
        display: flex;
        flex-direction: row;
        /* background-color: #000; */
        align-items: center;
        gap: 3rem;
        padding: 1rem;
        i{
            font-size: 2rem;
            cursor: pointer;
            &::-ms-tooltip{
                
            }
        }
        .more-options-div{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            .hidden-options-div{
                background-color: #4e4c4c;
                position: absolute;
                padding: 0.5rem;
                top: 3rem;
                right: -1rem;
                display: none;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: max-content;
                p{
                    font-size: 1.3rem;
                    cursor: pointer;
                    width: 100%;
                    padding: 0.3rem;
                    color: #eee;
                    &:hover{
                        background-color: #2e2e2e;
                    }
                }
            }
        }
    }
}
.users-list{
    display: flex;
    flex-direction: column;
    .no-users-msg{
        margin: auto;
    }
    .user-class{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
        padding: .9rem 1.4rem;
        cursor: pointer;
        &:hover{
            background-color: #4e4c4c;
        }
        .user-image{
            background-color: #3c3a3a;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            height: 5rem;
            width: 6rem;
        }
        .user-details{
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
            .user-name{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                width: 100%;
            }
        }
    }
}

@media screen and (max-width: 850px) {
    width: 100%;
}
`;

export default UserShow;
