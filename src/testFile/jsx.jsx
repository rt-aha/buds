import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import SideBar from '@/layout/SideBar';
import List from '@/layout/List';
import ChatMain from '@/components/chatroom/ChatMain';
import ChatList from '@/components/chatroom/ChatList';
import ReceivedList from 'src/components/chatroom/ReceivedList';
import {fetchMyInfo} from '@/actions/me';

const ChatroomView = styled.div`
  width: 100%;
  ${'' /* max-width: 960px; */}
  height: 100%;
  margin: 0 auto;
  display: flex;
`;

const Chatroom = (props) => {
  const [currList, setCurrList] = useState('friend');
  const {fetchMyInfo} = props;

  const handleCurrList = (type) => {
    setCurrList(type);
  };

  useEffect(() => {
    const token = localStorage.getItem('token') || '';

    if (token) {
      fetchMyInfo();
    }
  }, [fetchMyInfo]);

  return (
    <ChatroomView>
      <SideBar {...props} handleCurrList={handleCurrList} />
      <List>
        {currList === 'message' && <ReceivedList />}
        {currList === 'friend' && <ChatList />}
      </List>
      <ChatMain />
    </ChatroomView>
  );
};

export default connect(null, {fetchMyInfo})(Chatroom);
