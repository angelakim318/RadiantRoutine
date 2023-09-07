const API_URL = `http://localhost:8080`

document.addEventListener('DOMContentLoaded', function() {
  const calendar = document.getElementById('calendar');
  const routinesDiv = document.getElementById('routines');

  // Function to display routines for a specific date
  function displayRoutines(date) {
      // Fetch routines data from the backend API
      fetch(`${API_URL}/api/routines?date=${date}`)
          .then(response => response.json())
          .then(data => {
              routinesDiv.innerHTML = ''; // Clear previous routines
              if (data.length === 0) {
                  routinesDiv.textContent = 'No routines for this day.';
              } else {
                  data.forEach(routine => {
                      const routineElement = document.createElement('div');
                      routineElement.textContent = `${routine.routineType} Routine`; // Customize as needed
                      routinesDiv.appendChild(routineElement);
                  });
              }
          })
          .catch(error => {
              console.error('Error fetching routines data:', error);
              routinesDiv.textContent = 'Error fetching routines data.';
          });
  }

  function createCalendar(year, month) {
    // ... (previous code)

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
  
    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month, 1));
    const monthNameElement = document.getElementById('month-name');
    monthNameElement.textContent = monthName;

    const calendarTable = document.createElement('table');
    calendarTable.className = 'calendar-table';

    // Create table header (days of the week)
    const headerRow = document.createElement('tr');
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    daysOfWeek.forEach(day => {
        const headerCell = document.createElement('th');
        headerCell.textContent = day;
        headerRow.appendChild(headerCell);
    });
    calendarTable.appendChild(headerRow);

    let currentDay = 1;
    for (let i = 0; i < 5; i++) {
        const weekRow = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const dayCell = document.createElement('td');
            if (i === 0 && j < firstDay) {
                // Empty cells before the first day of the month
                dayCell.textContent = '';
            } else if (currentDay <= daysInMonth) {
                // Display day number and add click event
                dayCell.textContent = currentDay;
                dayCell.addEventListener('click', () => {
                    const selectedDate = `${year}-${month + 1}-${currentDay.toString().padStart(2, '0')}`;
                    displayRoutines(selectedDate);
                });
                currentDay++;
            }
            weekRow.appendChild(dayCell);
        }
        calendarTable.appendChild(weekRow);
    }

    calendar.appendChild(calendarTable);
}



  const today = new Date();
  let currentYear = today.getFullYear();
  let currentMonth = today.getMonth();
  
  // Function to update the calendar
  function updateCalendar(year, month) {
      // Clear previous calendar and routines
      calendar.innerHTML = '';
      routinesDiv.innerHTML = '';
  
      createCalendar(year, month); // Call the createCalendar function to display the new month
  
      // Update the month name
      const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(year, month, 1));
      const monthNameElement = document.getElementById('month-name');
      monthNameElement.textContent = monthName;
  
      // Display routines for the current date in the new month
      const today = new Date();
      displayRoutines(`${year}-${month + 1}-${today.getDate().toString().padStart(2, '0')}`);
  }
  
  // Add event listeners for previous and next month buttons
  const prevMonthButton = document.getElementById('prev-month');
  const nextMonthButton = document.getElementById('next-month');
  
  prevMonthButton.addEventListener('click', () => {
      currentMonth--; // Decrease the current month by 1
      if (currentMonth < 0) {
          currentMonth = 11; // Wrap to December if going back from January
          currentYear--;
      }
      updateCalendar(currentYear, currentMonth);
  });
  
  nextMonthButton.addEventListener('click', () => {
      currentMonth++; // Increase the current month by 1
      if (currentMonth > 11) {
          currentMonth = 0; // Wrap to January if going forward from December
          currentYear++;
      }
      updateCalendar(currentYear, currentMonth);
  });

  createCalendar(currentYear, currentMonth);
  displayRoutines(`${currentYear}-${currentMonth + 1}-${today.getDate().toString().padStart(2, '0')}`);
});
