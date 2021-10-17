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

	// TODO: encapsulate this in an object
	const ROUND_DURATION_MIN = 30/60; // in min
	const ACTION_PHASE_DURATION_MIN = 18/60; // in min
	const TEAM_PHASE_DURATION_MIN = 7/60; // in min
	// const PRESS_PHASE_DURATION_MIN = 5/60; // in min

	// Remainig time is represented as an object
	class TimeRemaining {
		constructor(ms) {
			this.ms = Math.max(0, ms);
			this.lastUpdate = null;
			this.paused = false;
		}

		get centiseconds() {
			return Math.max(0, Math.floor(this.ms / MS_IN_CS % CS_IN_SEC));
		}

	  get seconds() {
			return Math.max(0, Math.floor(this.ms / MS_IN_SEC % SEC_IN_MIN));
		}

	  get minutes() {
			return Math.max(0, Math.floor(this.ms / (MS_IN_SEC * SEC_IN_MIN) % MIN_IN_HOUR));
		}

	  get hours() {
			return Math.max(0, Math.floor(this.ms / (MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR) % HOUR_IN_DAY));
		}

	  get days() {
			return Math.max(0, Math.floor(this.ms / (MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR * HOUR_IN_DAY)));
		}

		/*
		 * Update the reùaining time since last update.
		 */
	  update() {
	  	if (this.paused) {
	  		return;
	  	}

	  	let now = Date.now();

	  	this.ms -= this.lastUpdate ? now - this.lastUpdate : 0;
	  	if (this.ms < 0) {
	  		this.ms = 0;
	  	}

	  	this.lastUpdate = now;
	  }
	}

	function getClockDivs() {
		const clocks = document.querySelectorAll(`${ROOT_CLOCK_SELECTOR}:not(.debug)`);
	  const ms = document.querySelectorAll(`${ROOT_CLOCK_SELECTOR} ${TOTAL_SELECTOR}`);
		const minutes = document.querySelectorAll(`${ROOT_CLOCK_SELECTOR} ${MINUTES_SELECTOR}`);
	  const seconds = document.querySelectorAll(`${ROOT_CLOCK_SELECTOR} ${SECONDS_SELECTOR}`);
	  const centiseconds = document.querySelectorAll(`${ROOT_CLOCK_SELECTOR} ${CENTISECONDS_SELECTOR}`);

	  return {
	  	clocks,
	  	ms,
	  	minutes,
	  	seconds,
	  	centiseconds,
	  };
	}

	/**
	 * This function can only be called once the page is loaded so the script must be loaded with defer attribute
	 */
	function initializeClock(duration) {
	  let timeIntervalID = null; // will be defined later
	  const remaining = new TimeRemaining(duration);

	  function updateClock() {
			remaining.update();

			const divs = getClockDivs();

			// Update clocks colors
			const ROUND_DURATION_MS = ROUND_DURATION_MIN * SEC_IN_MIN * MS_IN_SEC;
			const ACTION_PHASE_LIMIT_MS = (ROUND_DURATION_MIN - ACTION_PHASE_DURATION_MIN) * SEC_IN_MIN * MS_IN_SEC;
			const TEAM_PHASE_LIMIT_MS = (ROUND_DURATION_MIN - ACTION_PHASE_DURATION_MIN - TEAM_PHASE_DURATION_MIN) * SEC_IN_MIN * MS_IN_SEC;
			divs.clocks.forEach(clock => {
				clock.classList.remove("red", "orange", "green");
				if (ROUND_DURATION_MS >= remaining.ms && remaining.ms > ACTION_PHASE_LIMIT_MS) {
					clock.classList.add("green");
				} else if (ACTION_PHASE_LIMIT_MS >= remaining.ms && remaining.ms > TEAM_PHASE_LIMIT_MS) {
					clock.classList.add("orange");
				} else if (TEAM_PHASE_LIMIT_MS >= remaining.ms) {
					clock.classList.add("red");
				}
			});

			// Uddate clocks values
			const minutesStr = remaining.minutes.toString().padStart(2, '0');
			const secondsStr = remaining.seconds.toString().padStart(2, '0');
			const centisecondsStr = remaining.centiseconds.toString().padStart(2, '0');
			const totalStr = remaining.ms.toString().padStart(8, '0');

		  divs.minutes.forEach(div => div.innerHTML = minutesStr);
		  divs.seconds.forEach(div => div.innerHTML = secondsStr);
		  divs.centiseconds.forEach(div => div.innerHTML = centisecondsStr);
			divs.ms.forEach(div => div.innerHTML = totalStr);

			// If the countdown is over, we stop the update
			if (remaining.ms <= 0 && timeIntervalID) {
				clearInterval(timeIntervalID);
			}
	  }

	  updateClock();
	  timeIntervalID = setInterval(updateClock, UPDATE_INTERVAL_MS);
	}

	initializeClock(ROUND_DURATION_MIN * SEC_IN_MIN * MS_IN_SEC);
})();
