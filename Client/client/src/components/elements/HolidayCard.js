import React from 'react'
import { useNavigate } from 'react-router-dom'
import { convertDate } from '../utils/Tools'

const HolidayCard = ({ holiday }) => {
	const navigate = useNavigate()

	const goToHoliday = (e) => {
		navigate(`/user_holiday/${e.target.value}`)
	}

	return (
		<>
			<div className='center'>
				<div className='property-card'>
					<div className='property-image'>
						<div className='property-image-title'>
							<h3>{holiday.holiday_id.title}</h3>
						</div>
					</div>
					<div className='property-description'>
						<h5>
							{!holiday.holiday_id.destination
								? 'Destination: TBC'
								: holiday.holiday_id.destination}
						</h5>
						<ul>
							<p>
								Dates:
								{!holiday.holiday_id.start_date
									? ' TBC'
									: ` ${convertDate(
											holiday.holiday_id.start_date
									  )} - ${convertDate(
											holiday.holiday_id.end_date
									  )}`}
							</p>
						</ul>
						<button value={holiday.id} onClick={goToHoliday}>
							Continue
						</button>
					</div>
					<div className='property-social-icons'></div>
				</div>
			</div>
		</>
	)
}

export default HolidayCard
