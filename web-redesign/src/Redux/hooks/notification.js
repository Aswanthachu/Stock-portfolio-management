import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllNotification, getNewNotification } from "../Actions/notification";
import { selectDataByName, selectStatusByName } from "../Features/notification";


export function getAllNotificationQuery(reqData) {
  const dispatch = useDispatch();

  const name = "getAllNotification";
  const status = useSelector((state) => selectStatusByName(state, name));
  const data = useSelector((state) => selectDataByName(state, name));

  useEffect(() => {
    if (status === undefined) {
      dispatch(getAllNotification(reqData));
    }
  }, [status, name, dispatch]);

  const isUninitialized = status === undefined;
  const isLoading = status === "pending" || status === undefined;
  const isError = status === "rejected";
  const isSuccess = status === "fulfilled";

  return { data, isUninitialized, isLoading, isError, isSuccess };
}

export function getNewNotificationQuery(reqData) {
  const dispatch = useDispatch();

  const name = "getNewNotification";
  const status = useSelector((state) => selectStatusByName(state, name));
  const data = useSelector((state) => selectDataByName(state, name));

  useEffect(() => {
    if (status === undefined) {
      dispatch(getNewNotification(reqData));
    }
  }, [status, name, dispatch]);

  const isUninitialized = status === undefined;
  const isLoading = status === "pending" || status === undefined;
  const isError = status === "rejected";
  const isSuccess = status === "fulfilled";

  return { data, isUninitialized, isLoading, isError, isSuccess };
}
