import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { GLOBALTYPES } from '../redux/actions/global.type';
import { createPost, updatePost } from '../redux/actions/post.action';
import Icons from './Icons';

const StatusModal = () => {
	const { auth, theme, status, socket } = useSelector((state) => state);
	const dispatch = useDispatch();
	const videoRef = useRef();
	const refCanvas = useRef();

	const [content, setContent] = useState('');
	const [images, setImages] = useState([]);
	const [stream, setStream] = useState(false);
	const [tracks, setTracks] = useState('');

	const handleChangeImages = (e) => {
		const files = [...e.target.files];
		let err = '';
		let newImages = [];

		files.forEach((file) => {
			if (!file) return (err = 'File does not exists.');

			if (file.size > 1024 * 1024 * 5) {
				return (err = 'The image largest is 5mb.');
			}

			return newImages.push(file);
		});

		if (err) dispatch({ type: GLOBALTYPES.ALERT, payload: { errors: err } });
		setImages([...images, ...newImages]);
	};

	const imageShow = (src) => {
		return (
			<img
				src={src}
				alt='images'
				className='img-thumbnail'
				style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
			/>
		);
	};

	const videoShow = (src) => {
		return (
			<video
				src={src}
				controls
				alt='images'
				className='img-thumbnail'
				style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
			/>
		);
	};

	const deleteImage = (index) => {
		// console.log(index);
		const newArray = [...images];
		newArray.splice(index, 1);
		setImages(newArray);
	};

	//Turn on Steam
	const handleStream = () => {
		setStream(true);
		//Use camera of devices
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((mediaStream) => {
					videoRef.current.srcObject = mediaStream;
					videoRef.current.play();
					const track = mediaStream.getTracks();
					// console.log(track);
					setTracks(track[0]);
				})
				.catch((error) => console.log(error));
		}
	};

	//Take photo
	const handleCapture = () => {
		const width = videoRef.current.clientWidth;
		const height = videoRef.current.clientHeight;

		refCanvas.current.setAttribute('width', width);
		refCanvas.current.setAttribute('height', height);

		const ctx = refCanvas.current.getContext('2d');
		ctx.drawImage(videoRef.current, 0, 0, width, height);
		let URL = refCanvas.current.toDataURL();
		setImages([...images, { camera: URL }]);
	};

	//Stop stream
	const handleStopStream = () => {
		tracks.stop();
		setStream(false);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (images.length === 0)
			return dispatch({
				type: GLOBALTYPES.ALERT,
				payload: { errors: 'Please add your photo.' }
			});

		if (status.onEdit) {
			dispatch(updatePost({ content, images, auth, status }));
		} else {
			dispatch(createPost({ content, images, auth, socket }));
		}

		setContent('');
		setImages([]);
		if (tracks) tracks.stop();
		dispatch({ type: GLOBALTYPES.STATUS, payload: false });
	};

	useEffect(() => {
		if (status.onEdit) {
			setContent(status.content);
			setImages(status.images);
		}
	}, [status]);
	return (
		<div className='status_modal'>
			<form onSubmit={handleSubmit}>
				<div className='status_header'>
					<h5 className='m-0'>Create Post</h5>
					<span
						onClick={() =>
							dispatch({ type: GLOBALTYPES.STATUS, payload: false })
						}
					>
						&times;
					</span>
				</div>
				<div className='status_body'>
					<textarea
						name='content'
						value={content}
						placeholder={`${auth.user.username}, what are you thinking ?`}
						onChange={(e) => setContent(e.target.value)}
						style={{
							filter: theme ? 'invert(1)' : 'invert(0)',
							color: theme ? 'white' : '#111',
							background: theme ? 'rgba(0,0,0,.03)' : ''
						}}
					></textarea>
					<div className='d-flex'>
						<div className='flex-fill'></div>
						<Icons setContent={setContent} content={content} theme={theme} />
					</div>
					<div className='show_images'>
						{images.map((img, index) => (
							<div key={index} id='file_img'>
								{/* <img
									//Check image selfie or image upload
									src={
										image.camera
											? image.camera
											: image.url
											? image.url
											: URL.createObjectURL(image)
									}
									alt='images'
									className='img-thumbnail'
									style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
								/> */}

								{img.camera ? (
									imageShow(img.camera)
								) : img.url ? (
									<>
										{img.url.match(/video/i)
											? videoShow(img.url)
											: imageShow(img.url)}
									</>
								) : (
									<>
										{img.type.match(/video/i)
											? videoShow(URL.createObjectURL(img))
											: imageShow(URL.createObjectURL(img))}
									</>
								)}

								<span onClick={() => deleteImage(index)}>&times;</span>
							</div>
						))}
					</div>

					{stream && (
						<div className='stream position-relative'>
							<video
								autoPlay
								muted
								ref={videoRef}
								width='100%'
								height='100%'
								style={{ filter: theme ? 'invert(1)' : 'invert(0)' }}
							/>
							<span onClick={handleStopStream}>&times;</span>
							<canvas ref={refCanvas} style={{ display: 'none' }}></canvas>
						</div>
					)}
					<div className='input_images'>
						{stream ? (
							<i className='fas fa-camera' onClick={handleCapture} />
						) : (
							<>
								<i className='fas fa-camera' onClick={handleStream} />
								<div className='file_upload'>
									<i className='fas fa-image' />
									<input
										type='file'
										name='file'
										id='file'
										multiple
										accept='image/*,video/*'
										onChange={handleChangeImages}
									/>
								</div>
							</>
						)}
					</div>
				</div>
				<div className='status_footer'>
					<button className='btn btn-secondary w-100' type='submit'>
						Post
					</button>
				</div>
			</form>
		</div>
	);
};

export default StatusModal;
