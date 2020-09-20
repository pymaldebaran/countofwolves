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

	const UPDATE_INTERVAL_MS = 50; // in ms
	const ROOT_CLOCK_SELECTOR = '.counter';
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

	// This function can inly be called once the page is loaded so the script must be loaded with defer attribute
	function initializeClock(root_class, endtime) {
	  const allClocks = document.querySelectorAll(root_class);

	  let timeIntervalID = null; // will be defined later

	  function updateClock() {
			const t = getTimeRemaining(endtime);

			allClocks.forEach(clock => {
		  	const minutesDivs = clock.querySelectorAll('.minutes.dynamic');
			  const secondsDivs = clock.querySelectorAll('.seconds.dynamic');
			  const centisecondsDivs = clock.querySelectorAll('.centiseconds.dynamic');
			  const totalDivs = clock.querySelectorAll('.total');

			  minutesDivs.forEach(div => div.innerHTML = ('0' + t.minutes).slice(-2));
			  secondsDivs.forEach(div => div.innerHTML = ('0' + t.seconds).slice(-2));
			  centisecondsDivs.forEach(div => div.innerHTML = ('0' + t.centiseconds).slice(-2));

			  // if( minutesDiv && secondsDiv && centisecondsDiv ) {
				 //  minutesDiv.innerHTML = ('0' + t.minutes).slice(-2);
					// secondsDiv.innerHTML = ('0' + t.seconds).slice(-2);
					// centisecondsDiv.innerHTML = ('0' + t.centiseconds).slice(-2);
			  // }

				totalDivs.forEach(div => div.innerHTML = ('0000000' + t.total).slice(-8));

			  // if( totalDiv ) {
					// totalDivs.innerHTML = ('0000000' + t.total).slice(-8);
			  // }
		  });


			if (t.total <= 0 && timeIntervalID) {
			  clearInterval(timeIntervalID);
			}
	  }

	  updateClock();
	  timeIntervalID = setInterval(updateClock, UPDATE_INTERVAL_MS);
	}

	const deadline = new Date(Date.now() + ROUND_DURATION_MIN * SEC_IN_MIN * MS_IN_SEC);
	initializeClock(ROOT_CLOCK_SELECTOR, deadline);
})();
