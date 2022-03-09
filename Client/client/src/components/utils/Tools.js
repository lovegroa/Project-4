export const convertDate = (date) => {
	const new_date = new Date(date)
	const options = {
		weekday: 'short',
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	}
	return new_date.toLocaleDateString('en-GB', options)
}
