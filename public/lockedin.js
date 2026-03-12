document.addEventListener('DOMContentLoaded', () => {
  let totalSeconds = parseInt(sessionStorage.getItem('sessionSeconds'));  // Get long user wants to revise
  const socket = io();

  socket.emit('lock-in');
  window.sendUpdate(`Locked in.`);

  if (!totalSeconds || totalSeconds <= 0) { // Go back home if you can't find value or value is less than or equal to 0
    socket.emit('stop-session');
    window.location.href = 'home.html';
  }

  let remaining = totalSeconds;
  const countdownMin = document.getElementById('minutes-display');
  const countdownSec = document.getElementById('seconds-display');

  function formatTime(seconds) {
    const h = Math.floor(seconds / 3600); // Hours
    const m = Math.floor((seconds % 3600) / 60);  // Minutes
    const s = seconds % 60; // Seconds
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; // 01:30:05
    // padStart ensures the string is at least 2 characters long (adds 0 if not)
  }

  function formatMin(seconds) {
    const m = Math.floor(seconds / 60);
    return `${m}`;
  }

  function formatSec(seconds) {
    const s = seconds % 60;
    return `${String(s).padStart(2, '0')}`;
  }

  countdownMin.textContent = formatMin(remaining); // Chnage countdown text content to display time
  countdownSec.textContent = formatSec(remaining); // Chnage countdown text content to display time

  const timer = setInterval(() => {
    remaining--; // Subtracts 1
    countdownMin.textContent = formatMin(remaining); // Chnage countdown text content to display time
    countdownSec.textContent = formatSec(remaining); // Chnage countdown text content to display time

    if (remaining <= 0) {
      clearInterval(timer); // Stops interval from running using id that was saved (above)
      subtractTime(totalSeconds); // Number of seconds user wanted to study and they did 
      alert('Time is up! Great work!');

      socket.emit('stop-session');
      window.location.href = 'home.html';
    }
  }, 1000); // Runs function every second

  function subtractTime(secondsStudied) {
    const currentMins = (parseFloat(sessionStorage.getItem('targetMins')) + parseFloat(sessionStorage.getItem('targetHours')) * 60) || 0; // How many hours user has left in total
    const studiedMins = Math.round(secondsStudied / 60); // hoursStudied
    const leftMins = Math.max(0, currentMins - studiedMins);
    const newHours = Math.floor(leftMins/60); // How many hours user has left after subtracting session 
    const newMins = Math.max(0, leftMins - (newHours * 60));
    sessionStorage.setItem('targetHours', newHours); // Convert to string and round to 2 dp
    sessionStorage.setItem('targetMins', newMins);
    window.sendUpdate(`Completed a ${Math.floor(studiedMins / 60)} hour and ${studiedMins % 60} minute session.`);
  }

  document.querySelector('.lockedin-button').addEventListener('click', (e) => {
      e.preventDefault();
      clearInterval(timer); // Stops interval from running using id that was saved (above)
      const secondsStudied = totalSeconds - remaining; // How long user studied
      subtractTime(secondsStudied);

      socket.emit('stop-session');
      window.location.href = 'home.html';
  });
});

