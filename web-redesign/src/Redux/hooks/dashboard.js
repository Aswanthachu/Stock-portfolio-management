import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectDataByName, selectStatusByName } from '../Features/dashboard';
import { getDashboardGraph, getDashboardTable } from '../Actions/dashboard';


export function getDashboardTableQuery(reqData) {
  const dispatch = useDispatch();
 
  const name="getDashboardTable";
  const status = useSelector((state) => selectStatusByName(state, name));
  const data = useSelector((state) => selectDataByName(state, name));

  useEffect(() => {
    if (status === undefined) {
      dispatch(getDashboardTable(reqData))
    }
  }, [status, name, dispatch])

  
  const isUninitialized = status === undefined
  const isLoading = status === 'pending' || status === undefined
  const isError = status === 'rejected'
  const isSuccess = status === 'fulfilled'

  return { data, isUninitialized, isLoading, isError, isSuccess }
}

export function getDashboardGraphQuery(reqData) {
  const dispatch = useDispatch()
 
  const name="getDashboardGraph";
  const status = useSelector((state) => selectStatusByName(state, name));
  const data = useSelector((state) => selectDataByName(state, name));

  useEffect(() => {
    console.log("hiii");
    if (status === undefined) {
      console.log("hello");
      dispatch(getDashboardGraph())
    }
  }, [status, name, dispatch])

  
  const isUninitialized = status === undefined
  const isLoading = status === 'pending' || status === undefined
  const isError = status === 'rejected'
  const isSuccess = status === 'fulfilled'

  return { data, isUninitialized, isLoading, isError, isSuccess }
}