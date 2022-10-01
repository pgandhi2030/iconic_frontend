import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Cookies} from "react-cookie";
import {fetchStart, fetchSuccess, setAUthToken} from "../redux/actions";
import jwtAxios from './Api'
import {SET_AUTH_USER_DATA, UPDATE_LOAD_USER} from "../constants/ActionTypes";
import moment from "moment";

export const useAuthToken = () => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const {user} = useSelector(({auth}) => auth);

	useEffect(() => {

		const validateAuth = async () => {
			dispatch(fetchStart());
			// const cookies = new Cookies();
			// const token = cookies.get("token");
			// console.log("token: =====>", token)
			// if (!token) {
			// 	dispatch(fetchSuccess());
			// 	return;
			// }
			// dispatch(setAUthToken(token));
			try {
				const {data} = await jwtAxios.post("user/me");
				data.dateOfBirth = moment(data.dateOfBirth)
				dispatch(fetchSuccess());
				dispatch({
					type: SET_AUTH_USER_DATA,
					payload: data
				});
				return;
			} catch (err) {
				console.log("err in auth: ",err)
				dispatch(fetchSuccess());
				return;
			}
		};

		const checkAuth = () => {
			Promise.all([validateAuth()]).then(() => {
				setLoading(false);
				dispatch({type: UPDATE_LOAD_USER});
			});
		};
		checkAuth();
	}, [dispatch]);

	return [loading, user];
};

export const useAuthUser = () => {
	const {user} = useSelector(({auth}) => auth);

	if (user) {
		return {id: 1, ...user};
	}
	return [null];
};
