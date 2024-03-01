import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectDataByName, selectStatusByName } from '../Features/chatAssistant';
import { fetchSingleThreadMessage, getActiveChat, getAllUsersCreatedChat } from '../Actions/chatAssistant';


export function getActiveChatQuery(reqData) {
  const dispatch = useDispatch();
 
  const name="getActiveChat";
  const status = useSelector((state) => selectStatusByName(state, name));
  const data = useSelector((state) => selectDataByName(state, name));

  useEffect(() => {
    if (status === undefined) {
      dispatch(getActiveChat(reqData))
    }
  }, [status, name, dispatch])

  
  const isUninitialized = status === undefined
  const isLoading = status === 'pending' || status === undefined
  const isError = status === 'rejected'
  const isSuccess = status === 'fulfilled'

  return { data, isUninitialized, isLoading, isError, isSuccess }
}

export function getAllUsersCreatedChatQuery(reqData) {
  const dispatch = useDispatch();
 
  const name="getAllUsersCreatedChat";
  const status = useSelector((state) => selectStatusByName(state, name));
  const data = useSelector((state) => selectDataByName(state, name));

  useEffect(() => {
    if (status === undefined) {
      dispatch(getAllUsersCreatedChat(reqData))
    }
  }, [status, name, dispatch])

  
  const isUninitialized = status === undefined
  const isLoading = status === 'pending' || status === undefined
  const isError = status === 'rejected'
  const isSuccess = status === 'fulfilled'

  return { data, isUninitialized, isLoading, isError, isSuccess }
}

export function fetchSingleThreadMessageQuery(reqData) {
  const dispatch = useDispatch();
 
  const name="fetchSingleThreadMessage";
  const status = useSelector((state) => selectStatusByName(state, name));
  const data = useSelector((state) => selectDataByName(state, name));

  useEffect(() => {
    if (status === undefined) {
      dispatch(fetchSingleThreadMessage(reqData))
    }
  }, [status, name, dispatch])

  
  const isUninitialized = status === undefined
  const isLoading = status === 'pending' || status === undefined
  const isError = status === 'rejected'
  const isSuccess = status === 'fulfilled'

  return { data, isUninitialized, isLoading, isError, isSuccess }
}