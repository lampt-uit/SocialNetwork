import React from 'react';
import { useSelector } from 'react-redux';

import Status from '../components/home/Status';
import Posts from '../components/home/Posts';
import LoadIcon from '../images/loading.gif';
import RightSideBar from '../components/home/RightSideBar';

const Home = () => {
	const { homePosts } = useSelector((state) => state);

	return (
		<div className='home row mx-0'>
			<div className='col-md-8'>
				<Status />
				{homePosts.loading ? (
					<img src={LoadIcon} alt='loading' className='d-block mx-auto' />
				) : homePosts.result === 0 && homePosts.posts.length === 0 ? (
					<h2 className='text-center'>No Posts</h2>
				) : (
					<Posts />
				)}
			</div>
			<div className='col-md-4'>
				<RightSideBar />
			</div>
		</div>
	);
};

export default Home;
