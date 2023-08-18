import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import whole_list from "../../domeWhatappData.json";
import SelectedUserShow from "./SelectedUserShow";
import { useGlobalData } from "../assets/reducer";
const ENDPOINT = 'http://localhost:8000';

const UserShow = (props) => {
    const ifPhotoAdded = true;
    const [allUsersFoundChatWith, setAllUsersFoundChatWith] = useState();
    const navigate = useNavigate();
    const { state, dispatch } = useGlobalData();
    const id = localStorage.getItem("token");
    const { setLoginStatus } = props;

    const findAllUsers = async () => {
        const response = await fetch(`${ENDPOINT}/getusers/${id}`);
        const currUserData = await response.json();
        setAllUsersFoundChatWith(currUserData);
    };

    useEffect(() => {
        findAllUsers();
    }, []);


    return (
        <UserMainDiv>
            <div style={{ marginBottom: '5rem' }}>
                <div className="my-options">
                    {
                        ifPhotoAdded ?
                            <img src="../../../sameep.jpeg" alt="My Image" className="my-image" />
                            :
                            <div className="my-image">
                                <i className="fa-solid fa-user"></i>
                            </div>
                    }
                    <div className="my-options-container">
                        <i className="fa-regular fa-message" onClick={() => {
                            navigate('/allusers');
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
                                <button type="button" className="logout-btn" onClick={() => {
                                    localStorage.removeItem("token");
                                    props.setLoginStatus(false);
                                    navigate('/');
                                }}>Logout</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div>{allUsersFoundChatWith ? allUsersFoundChatWith.name : null}:</div>
            </div>
            <div className="users-list">
                {
                    allUsersFoundChatWith ?
                        <>{
                            allUsersFoundChatWith.whole_list.length > 0 ?
                                allUsersFoundChatWith.whole_list.map((curObj, index) => {
                                    return (
                                        <div className="user-class" key={index} onClick={() => {
                                            navigate(`/user/${id}/${curObj._id}`);
                                        }}>
                                            {
                                                curObj.icon ?
                                                    <img src="../../../sameep.jpeg" alt="My Image" className="user-image" />
                                                    :
                                                    <div className="user-image">
                                                        <i className="fa-solid fa-user"></i>
                                                    </div>
                                            }
                                            <div className="user-details">
                                                <div className="user-name">
                                                    <h4>{curObj.name}</h4>
                                                    <p>{curObj.latest_message_time}</p>
                                                </div>
                                                <div>
                                                    {curObj.latest_message}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                                : <h4 className="no-users-msg">No Users Yet</h4>
                        }
                        </>
                        :
                        null
                }
            </div>
        </UserMainDiv>
    );
};

const UserMainDiv = styled.div`

background-color: #2e2e2e;
display: flex;
flex-direction: column;
min-width: 10rem;
resize: horizontal;
overflow-x: hidden;
height: 100vh;

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
                display: none;
                .logout-btn{
                    font-size: 1rem;
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

`;

export default UserShow;
