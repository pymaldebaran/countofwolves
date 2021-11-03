/**
 * Count of Wolves main JS file containing all the logic.
 *
 * This code is based on the
 * [Build a Countdown Timer in Just 18 Lines of JavaScript](https://www.sitepoint.com/build-javascript-countdown-timer-no-dependencies/)
 * tutorial.
 */

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

/**
 * Convert a time duration from seconds to minutes.
 *
 * @param {number} timeInSec - A duration in seconds
 *
 * @returns {number} The duration converted to minutes
 */
export function sec2min(timeInSec) {
	return timeInSec / SEC_IN_MIN;
}

/**
 * Convert a time duration from minutes to milliseconds.
 *
 * @param {number} timeInMin - A duration in minutes
 *
 * @returns {number} The duration converted to milliseconds
 */
export function min2ms(timeInMin) {
	return timeInMin * SEC_IN_MIN * MS_IN_SEC;
}

/**
 * Convert a time duration from milliseconds to centiseconds.
 *
 * @param {number} timeInMs - A duration in milliseconds
 *
 * @returns {number} The duration converted to centiseconds
 */
export function ms2cs(timeInMs) {
	return timeInMs / MS_IN_CS;
}

/**
 * Convert a time duration from milliseconds to seconds.
 *
 * @param {number} timeInMs - A duration in milliseconds
 *
 * @returns {number} The duration converted to seconds
 */
export function ms2sec(timeInMs) {
	return timeInMs / MS_IN_SEC;
}

/**
 * Convert a time duration from milliseconds to minutes.
 *
 * @param {number} timeInMs - A duration in milliseconds
 *
 * @returns {number} The duration converted to minutes
 */
export function ms2min(timeInMs) {
	return timeInMs / (MS_IN_SEC * SEC_IN_MIN);
}

/**
 * Convert a time duration from milliseconds to hours.
 *
 * @param {number} timeInMs - A duration in milliseconds
 *
 * @returns {number} The duration converted to hours
 */
export function ms2hour(timeInMs) {
	return timeInMs / (MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR);
}

/**
 * Convert a time duration from milliseconds to days.
 *
 * @param {number} timeInMs - A duration in milliseconds
 *
 * @returns {number} The duration converted to days
 */
export function ms2day(timeInMs) {
	return timeInMs / (MS_IN_SEC * SEC_IN_MIN * MIN_IN_HOUR * HOUR_IN_DAY);
}

// TODO: encapsulate this in an object
const ACTION_PHASE_PART = 18 / 30;  // relative to round duration
const TEAM_PHASE_DURATION_PART = 6 / 30;  // relative to round duration
// const PRESS_PHASE_DURATION_PART = 6 / 30;  // relative to round duration

const ROUND_DURATION_MIN = 30; // in min
const ACTION_PHASE_DURATION_MIN = ROUND_DURATION_MIN * ACTION_PHASE_PART; // in min
const TEAM_PHASE_DURATION_MIN = ROUND_DURATION_MIN * TEAM_PHASE_DURATION_PART; // in min
// const PRESS_PHASE_DURATION_MIN = ROUND_DURATION_MIN * PRESS_PHASE_DURATION_PART; // in min

/**
 * Remainig time is represented as an object
 *
 * @member {number} ms - remaining time till the end in milliseconds
 * @member {?number} lastUpdate - date of the last update in milliseconds, null if never updated
 * @member {?number} paused - date (in ms) since the begining of the pause started (or null if there is no pause at the moment)
 */
export class TimeRemaining {
	constructor(ms) {
		this.ms = Math.max(0, ms);
		this.lastUpdate = null;
		this.paused = false;
	}

	/**
	 * Compute the number of centiseconds remaining not counting the full days, hours, minutes and seconds
	 */
	get centiseconds() {
		return Math.max(0, Math.floor(ms2cs(this.ms) % CS_IN_SEC));
	}

	/**
	 * Compute the number of seconds remaining not counting the full days, hours and minutes
	 */
	get seconds() {
		return Math.max(0, Math.floor(ms2sec(this.ms) % SEC_IN_MIN));
	}

	/**
	 * Compute the number of minutes remaining not counting the full days and hours
	 */
	get minutes() {
		return Math.max(0, Math.floor(ms2min(this.ms) % MIN_IN_HOUR));
	}

	/**
	 * Compute the number of hours remaining not counting the full days
	 */
	get hours() {
		return Math.max(0, Math.floor(ms2hour(this.ms) % HOUR_IN_DAY));
	}

	/**
	 * Compute the number of days remaining
	 */
	get days() {
		return Math.max(0, Math.floor(ms2day(this.ms)));
	}

	/**
	 * Update the remaining time since last update.
	 */
	update() {
		if (this.paused) {
			return;
		}

		let now = Date.now();

		// Decrease the time remaining since the last update (if it exists)
		this.ms -= this.lastUpdate ? now - this.lastUpdate : 0;

		// Prevent any negative time
		if (this.ms < 0) {
			this.ms = 0;
		}

		this.lastUpdate = now;
	}

	/**
	 * Restart the timer with a new total value.
	 *
	 * @param newRemaining {number} - new total time in ms to wait
	 */
	reset(newRemaining) {
		this.ms = newRemaining
	}

	togglePause() {
		if(this.paused) {
			const pauseDuration = Date.now() - this.paused
			this.ms += pauseDuration
			this.paused = null
		} else {
			this.paused = Date.now();
		}
	}
}

/**
 * Get all the divs needed to display the clocks.
 *
 * Each element is in fact a list of div since we have multiple divs with se same content in order to achieve the desired light effect.
 *
 * @returns {{
 * 		clocks: NodeListOf<Element>,
 * 		ms: NodeListOf<Element>,
 * 		minutes: NodeListOf<Element>,
 * 		seconds: NodeListOf<Element>,
 * 		centiseconds: NodeListOf<Element>}}
 */
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
 * Get all the divs needed to control the clocks.
 *
 * @returns {{reset: Element, pause: Element}}
*/
function getControlButtons() {
	return {
		reset: document.querySelector('.controls #reset'),
		pause: document.querySelector('.controls #pause'),
	};
}

/**
 * @member {number} timeIntervalID - Reference to the setInterval used to update the clock remaining time
 * @member {TimeRemaining} remaining Remaining time till the end of the clock
 * @member {{
 * 		clocks: NodeListOf<Element>,
 * 		ms: NodeListOf<Element>,
 * 		minutes: NodeListOf<Element>,
 * 		seconds: NodeListOf<Element>,
 * 		centiseconds: NodeListOf<Element>}} clockDivs - list of usefull divs
 */
class Clock {
	/**
	 * @param {number} duration - time till the end of the count down to create in milliseconds
	 */
	constructor (duration) {
		this.remaining = new TimeRemaining(duration);
		this.clockDivs = getClockDivs();
		this.controls = getControlButtons();

		// Controls
		this.controls.reset.onclick = () => { this.remaining.reset(min2ms(ROUND_DURATION_MIN)) };
		this.controls.pause.onclick = () => { this.remaining.togglePause() };

		// Update the clock now and set a timer to update it regularly
		this.update();
		this.timeIntervalID = setInterval(this.update.bind(this), UPDATE_INTERVAL_MS);
	}

	/**
	 * Update the clock state
	 */
	update() {
		this.remaining.update();

		const ROUND_DURATION_MS = min2ms(ROUND_DURATION_MIN);
		const ACTION_PHASE_LIMIT_MS = min2ms(ROUND_DURATION_MIN - ACTION_PHASE_DURATION_MIN);
		const TEAM_PHASE_LIMIT_MS = min2ms(ROUND_DURATION_MIN - ACTION_PHASE_DURATION_MIN - TEAM_PHASE_DURATION_MIN);

		// Update the color of the clock according to the remaining time
		this.clockDivs.clocks.forEach(clock => {
			clock.classList.remove("red", "orange", "green");
			if (ROUND_DURATION_MS >= this.remaining.ms && this.remaining.ms > ACTION_PHASE_LIMIT_MS) {
				clock.classList.add("green");
			} else if (ACTION_PHASE_LIMIT_MS >= this.remaining.ms && this.remaining.ms > TEAM_PHASE_LIMIT_MS) {
				clock.classList.add("orange");
			} else if (TEAM_PHASE_LIMIT_MS >= this.remaining.ms) {
				clock.classList.add("red");
			}
		});

		// Uddate clocks values
		const minutesStr = this.remaining.minutes.toString().padStart(2, '0');
		const secondsStr = this.remaining.seconds.toString().padStart(2, '0');
		const centisecondsStr = this.remaining.centiseconds.toString().padStart(2, '0');
		const totalStr = this.remaining.ms.toString().padStart(8, '0');

		this.clockDivs.minutes.forEach(div => div.innerHTML = minutesStr);
		this.clockDivs.seconds.forEach(div => div.innerHTML = secondsStr);
		this.clockDivs.centiseconds.forEach(div => div.innerHTML = centisecondsStr);
		this.clockDivs.ms.forEach(div => div.innerHTML = totalStr);

		// If the countdown is over, we stop the update
		if (this.remaining.ms <= 0 && this.timeIntervalID) {
			clearInterval(this.timeIntervalID);
		}
	}
}


// Code actualy launched
export const clock = new Clock(min2ms(ROUND_DURATION_MIN));
