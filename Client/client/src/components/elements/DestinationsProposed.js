import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { convertDateForApi } from '../utils/Tools'

const DestinationsProposed = ({ userHolidayData }) => {
	const [kiwiData, setKiwiData] = useState({ updated: false })
	const [filteredKiwiData, setFilteredKiwiData] = useState([])

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
				const start_date = convertDateForApi(
					userHolidayData.holiday_id.start_date
				)
				const end_date = convertDateForApi(
					userHolidayData.holiday_id.end_date
				)
				const currency = 'GBP'
				const url = `https://tequila-api.kiwi.com/v2/search?fly_from=${AirportFrom}&dateFrom=${start_date}&dateTo=${start_date}&returnFrom=${end_date}&returnTo=${end_date}&curr=${currency}`
				const { data } = await axios.get(url, headers)
				setKiwiData({ ...data, updated: true })
				// console.log(data.data)
			} catch (error) {
				console.log(error.message)
			}
		}
		getDestinations()
	}, [])

	useEffect(() => {
		const tempData = []
		if (kiwiData.updated) {
			for (const [key, value] of Object.entries(kiwiData.data)) {
				// console.log(`${key}: ${value}`)
				tempData.push(value)
			}
		}

		const onlyUnique = (value, index, self) => {
			return self.findIndex((x) => x.cityTo === value.cityTo) === index
		}

		const unique = tempData.filter(onlyUnique)
		// console.log(unique)

		setFilteredKiwiData([...unique])
	}, [kiwiData])

	return (
		<>
			<h2>Where shall we go?</h2>
			{kiwiData.updated
				? filteredKiwiData.map((flight) => {
						return (
							<div key={flight.id} className='center'>
								<div className='property-card'>
									<div className='property-image'>
										<div className='property-image-title'>
											<h3>{flight.cityTo}</h3>
										</div>
									</div>
									<div className='property-description'>
										<div className='property-description-left'>
											<h5>Price</h5>
											<p>£{flight.price}</p>
										</div>
										<div className='property-description-right'>
											<h5>Flying from</h5>
											<p>{flight.flyFrom}</p>
										</div>
									</div>
								</div>
							</div>
						)
				  })
				: 'loading'}
		</>
	)
}

export default DestinationsProposed
