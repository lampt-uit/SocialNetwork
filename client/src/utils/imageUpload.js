export const checkImage = (file) => {
	let error = '';
	if (!file) return (error = 'File does not exist.');

	if (file.size > 1024 * 1024)
		//1mb
		error = 'The largest image size is 1mb.';

	if (file.type !== 'image/jpeg' && file.type !== 'image/png')
		error = 'Image format is incorrect.';

	return error;
};

export const imageUpload = async (images) => {
	let imageArray = [];
	for (const item of images) {
		const formData = new FormData();
		// console.log(item);
		if (item.camera) {
			formData.append('file', item.camera);
		} else {
			formData.append('file', item);
		}
		formData.append('upload_preset', 'uctzbygv');
		formData.append('cloud_name', 'lampt');

		const res = await fetch(
			'https://api.cloudinary.com/v1_1/lampt/image/upload',
			{
				method: 'POST',
				body: formData
			}
		);

		const data = await res.json();
		// console.log(data);

		imageArray.push({ public_id: data.public_id, url: data.secure_url });
	}
	return imageArray;
};
