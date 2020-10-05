/**
 * Count of Wolves main JS file containing all the logic.
 *
 * This code is based on the
 * [Build a Countdown Timer in Just 18 Lines of JavaScript](https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/)
 * tutorial.
 */

// Just a wrapper to prevent pollution of the global namespace
// http://benalman.com/news/2010/11/immediately-invoked-function-expression/
(function(){
	'use strict';

	const MS_IN_SEC = 1000;
	const MS_IN_CS = 10;
	const CS_IN_SEC = 100;
	const SEC_IN_MIN = 60;
	const MIN_IN_HOUR = 60;
	const HOUR_IN_DAY = 24;

	const ROOT_CLOCK_SELECTOR = '.counter';
	const TOTAL_SELECTOR = '.total';
	const MINUTES_SELECTOR = '.minutes.dynamic';
	const SECONDS_SELECTOR = '.seconds.dynamic';
	const CENTISECONDS_SELECTOR = '.centiseconds.dynamic';

	const UPDATE_INTERVAL_MS = 50; // in ms

	const ROUND_DURATION_MIN = 30; // in min

	function getTimeRemaining(endtime) {
	  const total = Date.parse(endtime) - Date.now();
	  const centiseconds = Math.floor(total / MS_IN_CS % CS_IN_SEC);
	  const seconds = Math.floor(total / MS_IN_SEC % SEC_IN_MIN);
	  const minutes = Math.floor(total / (MS_IN_SEC * SEC_IN_MIN) % MIN_IN_HOUR);
	  const hours = Math.floor(total / (MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR) % HOUR_IN_DAY);
	  const days = Math.floor(total / (MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR * HOUR_IN_DAY));

	  return {
			total,
			days,
			hours,
			minutes,
			seconds,
			centiseconds,
	  };
	}

	function getClockDivs() {
	  const total = document.querySelectorAll(`${ROOT_CLOCK_SELECTOR} ${TOTAL_SELECTOR}`);
		const minutes = document.querySelectorAll(`${ROOT_CLOCK_SELECTOR} ${MINUTES_SELECTOR}`);
	  const seconds = document.querySelectorAll(`${ROOT_CLOCK_SELECTOR} ${SECONDS_SELECTOR}`);
	  const centiseconds = document.querySelectorAll(`${ROOT_CLOCK_SELECTOR} ${CENTISECONDS_SELECTOR}`);

	  return {
	  	total,
	  	minutes,
	  	seconds,
	  	centiseconds,
	  };
	}

	/**
	 * This function can only be called once the page is loaded so the script must be loaded with defer attribute
	 */
	function initializeClock(endtime) {
	  let timeIntervalID = null; // will be defined later

	  function updateClock() {
			const remaining = getTimeRemaining(endtime);

			const divs = getClockDivs();

			const minutesStr = remaining.minutes.toString().padStart(2, '0');
			const secondsStr = remaining.seconds.toString().padStart(2, '0');
			const centisecondsStr = remaining.centiseconds.toString().padStart(2, '0');
			const totalStr = remaining.total.toString().padStart(8, '0');

		  divs.minutes.forEach(div => div.innerHTML = minutesStr);
		  divs.seconds.forEach(div => div.innerHTML = secondsStr);
		  divs.centiseconds.forEach(div => div.innerHTML = centisecondsStr);
			divs.total.forEach(div => div.innerHTML = totalStr);

			// If the countdown is over, we stop the update
			if (remaining.total <= 0 && timeIntervalID) {
			  clearInterval(timeIntervalID);
			}
	  }

	  updateClock();
	  timeIntervalID = setInterval(updateClock, UPDATE_INTERVAL_MS);
	}

	const deadline = new Date(Date.now() + ROUND_DURATION_MIN * SEC_IN_MIN * MS_IN_SEC);
	initializeClock(deadline);
})();
