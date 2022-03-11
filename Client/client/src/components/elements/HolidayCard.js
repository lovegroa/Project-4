import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { convertDate } from '../utils/Tools'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const HolidayCard = ({ holiday }) => {
	const navigate = useNavigate()
	const [isCopied, setIsCopied] = useState(false)

	const goToHoliday = (e) => {
		navigate(`/user_holiday/${e.target.value}`)
	}

	const onCopyText = () => {
		setIsCopied(true)
		setTimeout(() => {
			setIsCopied(false)
		}, 1000)
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
						<div className='property-description-left'>
							<h5>
								{!holiday.holiday_id.destination
									? 'Destination: TBC'
									: holiday.holiday_id.destination}
							</h5>
							<ul>
								<p>
									<strong>Dates:</strong>
									<br />

									{!holiday.holiday_id.start_date
										? ' TBC'
										: ` ${convertDate(
												holiday.holiday_id.start_date
										  )} - ${convertDate(
												holiday.holiday_id.end_date
										  )}`}
								</p>
							</ul>
							<p>
								<strong>Who's coming:</strong>
							</p>
							{holiday.holiday_id.user_holidays.map(
								(user_holiday) => {
									return (
										<p>
											{user_holiday.user_id.first_name}{' '}
											{user_holiday.user_id.last_name}
										</p>
									)
								}
							)}
						</div>
						<div className='property-description-right'>
							<br />
							<p>Invite your friends</p>
							<CopyToClipboard
								text={`http://192.168.0.60:3000/join/${holiday.holiday_id.join_code}`}
								onCopy={onCopyText}
							>
								<p className='code'>
									{isCopied
										? 'Copied!'
										: `http://192.168.0.60:3000/join/${holiday.holiday_id.join_code}`}
								</p>
							</CopyToClipboard>
							<button value={holiday.id} onClick={goToHoliday}>
								Continue
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default HolidayCard
