/**
 * Count of Wolves main JS file containing all the logic.
 *
 * This code is based on the
 * [Build a Countdown Timer in Just 18 Lines of JavaScript](https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/)
 * tutorial.
 */
(() => { // Just a wrapper to prevent pollution of the global namespace
	'use strict';

	const MS_IN_SEC = 1000;
	const MS_IN_CS = 10;
	const CS_IN_SEC = 100;
	const SEC_IN_MIN = 60;
	const MIN_IN_HOUR = 60;
	const HOUR_IN_DAY = 24;

	const UPDATE_INTERVAL = 33;

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

	// This function can inly be called once the page is loaded so the script must be loaded with defer attribute
	function initializeClock(id, endtime) {
	  const clock = document.getElementById(id);
	  const hoursSpan = clock.querySelector('.hours');
	  const minutesSpan = clock.querySelector('.minutes');
	  const secondsSpan = clock.querySelector('.seconds');
	  const centisecondsSpan = clock.querySelector('.centiseconds');
	  const totalSpan = clock.querySelector('.total');

	  let timeIntervalID = null; // will be defined later

	  function updateClock() {
			const t = getTimeRemaining(endtime);

			hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
			minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
			secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
			centisecondsSpan.innerHTML = ('0' + t.centiseconds).slice(-2);
			totalSpan.innerHTML = t.total;

			if (t.total <= 0 && timeIntervalID) {
			  clearInterval(timeIntervalID);
			}
	  }

	  updateClock();
	  timeIntervalID = setInterval(updateClock, UPDATE_INTERVAL);
	}

	const deadline = new Date(Date.now() + 15 * MIN_IN_HOUR * SEC_IN_MIN * MS_IN_SEC);
	initializeClock('clockdiv', deadline);
})();
