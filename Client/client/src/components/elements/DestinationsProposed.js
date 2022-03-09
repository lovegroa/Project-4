import axios from 'axios'
import React, { useEffect } from 'react'

const DestinationsProposed = () => {
	// use Effect to retrieve profile information on page load
	useEffect(() => {
		const getDestinations = async () => {
			try {
				const headers = {
					headers: {
						apikey: `9Syd6YU3GvGD9q8G9Xtq_MLwL-Qgz4Ub`
					}
				}
				const AirportFrom = 'LON'
				const start_date = '01/04/2022'
				const end_date = '08/04/2022'
				const currency = 'GBP'
				const url = `https://tequila-api.kiwi.com/v2/search?fly_from=${AirportFrom}&dateFrom=${start_date}&dateTo=${start_date}&returnFrom=${end_date}&returnTo=${end_date}&curr=${currency}`
				const { data } = await axios.get(url, headers)
				console.log(data)
			} catch (error) {
				console.log(error.message)
			}
		}
		getDestinations()
	}, [])

	return <></>
}

export default DestinationsProposed
