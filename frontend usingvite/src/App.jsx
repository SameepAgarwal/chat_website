import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import styled from 'styled-components';
import Loginpage from './assets/loginpage';
import UserShow from './assets/UserShow';
import SelectedUserShow from './assets/SelectedUserShow';
import ShowAllUsers from './assets/ShowAllUsers';
import VideoUploader from './assets/Video';
import { useGlobalData } from './assets/reducer';
const ENDPOINT = 'http://localhost:8000';

const userPersonalDetail = {
  name: "Sameep",
  password: "123",
  cpassword: "123",
  number: 1234567891,
  email: "sameep@gmail.com",
  _id: "64d90b003edce4235b8aab2c"
};

function App() {
  const [loginStatus, setLoginStatus] = useState(false);
  const { state, dispatch } = useGlobalData();
  const [userData, setUserData] = useState();
  const getDetail = async (id) => {
    const user = await fetch(`${ENDPOINT}/getusers/${id}`);
    const data = await user.json();
    setUserData(data);
    console.log({ data: data });
    dispatch({ type: 'USERSDATA', payload: data });
    setLoginStatus(true);
  };

  useEffect(() => {
    const id = localStorage.getItem('token');
    console.log({ token: id });
    if (id !== null) {
      getDetail(id);
      setLoginStatus(true);
    }
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={
          <MainDiv>
            {
              !loginStatus ?
                <Loginpage
                  setLoginStatus={setLoginStatus}
                /> :
                <div className='main-container'>
                  <UserShow
                    setLoginStatus={setLoginStatus}
                  />
                </div>
            }
          </MainDiv>
        } />
        <Route exact path="/allusers" element={
          <MainDiv>
            {
              !loginStatus ?
                <Loginpage
                  setLoginStatus={setLoginStatus}

                />
                :
                <div className='main-container'>
                  <ShowAllUsers
                    setLoginStatus={setLoginStatus}
                  />
                </div>
            }
          </MainDiv>
        } />
        <Route exact path="/user/:id/:chatId" element={
          <MainDiv>
            {
              !loginStatus ?
                <Loginpage
                  setLoginStatus={setLoginStatus}
                /> :
                <div className='main-container'>
                  <div className='user-show-container'>
                    <UserShow
                      setLoginStatus={setLoginStatus}
                    />
                  </div>
                  <SelectedUserShow />
                </div>
            }
          </MainDiv>
        } />
        <Route exact path='/login' element={
          <MainDiv>
            <Loginpage
              setLoginStatus={setLoginStatus}
            />
          </MainDiv>
        } />
        <Route exact path='/video' element={
          <MainDiv>
            <VideoUploader />
          </MainDiv>
        } />
        <Route path="/*" element={
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            width: '100vw',
            backgroundColor: '#2e2e2e',
            fontSize: '3rem'
          }}>
            404 ERROR
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

const MainDiv = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  width: 100vw;
  margin: auto;
  /* ul{
    display: flex;
    flex-direction: row;
    gap: 3rem;
  } */
  .main-container{
    display: flex;
    flex-direction: row;
    /* margin: 2rem; */
    height: 100%;
    width: 100%;
  }
  @media screen and (max-width: 850px) {
    .main-container{
      width: 100%;
    }
    
  }
`;

export default App;
