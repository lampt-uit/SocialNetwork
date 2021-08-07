import React, { useState, useEffect } from 'react';

import PostThumb from '../home/comments/PostThumb';

const Posts = ({ auth, profile, id, dispatch }) => {
	const [posts, setPosts] = useState([]);
	const [result, setResult] = useState(9);

	useEffect(() => {
		profile.posts.forEach((data) => {
			if (data._id === id) {
				setPosts(data.posts);
				setResult(data.result);
			}
		});
	}, [profile.posts, id]);
	return (
		<div>
			<PostThumb posts={posts} result={result} />
		</div>
	);
};

export default Posts;
