import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { GLOBALTYPES } from '../../redux/actions/global.type';

import Loading from './Loading';
import Toast from './Toast';

const Alert = () => {
	const { alert } = useSelector((state) => state);
	const dispatch = useDispatch();

	return (
		<div>
			{alert.loading && <Loading />}
			{alert.success && (
				<Toast
					msg={{ title: 'Success', body: alert.success }}
					handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
					bgColor='bg-success'
				/>
			)}
			{alert.errors && (
				<Toast
					msg={{ title: 'Error', body: alert.errors }}
					handleShow={() => dispatch({ type: GLOBALTYPES.ALERT, payload: {} })}
					bgColor='bg-danger'
				/>
			)}
		</div>
	);
};

export default Alert;
