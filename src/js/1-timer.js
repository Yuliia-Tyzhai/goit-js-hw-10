import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
  },
};


const datetimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const timerFields = document.querySelectorAll('.value');


let userSelectedDate = null;
let countdownInterval = null;


flatpickr(datetimePicker, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        userSelectedDate = selectedDates[0];

        if (userSelectedDate <= new Date()) {
            iziToast.error({
                title: 'Error',
                message: 'Please choose a date in the future',
            });
            startButton.disabled = true;
        } else {
            startButton.disabled = false;
        }
    },
});


startButton.addEventListener('click', () => {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    startButton.disabled = true;
    datetimePicker.disabled = true;
    
    countdownInterval = setInterval(updateTimer, 1000);
    updateTimer();
});


function updateTimer() {
    const now = new Date();
    const timeLeft = userSelectedDate - now;

    if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        startButton.disabled = true;
        datetimePicker.disabled = false;
        updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    updateTimerDisplay({ days, hours, minutes, seconds });
}


function updateTimerDisplay({ days, hours, minutes, seconds }) {
    timerFields[0].textContent = addLeadingZero(days);
    timerFields[1].textContent = addLeadingZero(hours);
    timerFields[2].textContent = addLeadingZero(minutes);
    timerFields[3].textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
    return String(value).padStart(2, '0');
}


function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}