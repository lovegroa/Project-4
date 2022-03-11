import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './components/elements/Login'
import Holiday from './components/pages/Holiday'
import Home from './components/pages/Home'
import Join from './components/pages/Join'
import NewHoliday from './components/pages/NewHoliday'
import { userAuthenticated } from './components/utils/UserAuthenticated'

function App() {
	const [userAuthenticatedState, setUserAuthenticatedState] = useState(
		userAuthenticated()
	)

	return (
		<>
			<BrowserRouter>
				<Routes>
					{userAuthenticatedState ? (
						<>
							<Route path='/' element={<Home />} />
							<Route
								path='/holiday/new'
								element={<NewHoliday />}
							/>
							<Route
								path='/holiday/:holidayID'
								element={<NewHoliday />}
							/>
							<Route
								path='/user_holiday/:userHolidayID'
								element={<Holiday />}
							/>
							<Route path='/join/:joinCode' element={<Join />} />
						</>
					) : (
						<>
							<Route
								path='/*'
								element={
									<Login
										setUserAuthenticatedState={
											setUserAuthenticatedState
										}
										path={window.location.pathname}
									/>
								}
							/>
						</>
					)}
				</Routes>
			</BrowserRouter>
		</>
	)
}

export default App
