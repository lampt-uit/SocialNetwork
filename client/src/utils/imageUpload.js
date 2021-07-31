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
