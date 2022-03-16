export const convertDate = (date) => {
	const new_date = new Date(date)
	const options = {
		// weekday: 'short',
		// year: '2-digit',
		month: 'short',
		day: 'numeric'
	}
	return new_date.toLocaleDateString('en-GB', options)
}

export const convertDateForApi = (date) => {
	const new_date = new Date(date)
	const options = {
		// weekday: 'short',
		year: 'numeric',
		month: 'numeric',
		day: 'numeric'
	}
	return new_date.toLocaleDateString('en-GB', options)
}
