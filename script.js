document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const addNoteForm = document.getElementById('addNoteForm');
    const dateInput = document.getElementById('date');
    const noteInput = document.getElementById('note');
    let currentYear, currentMonth;

    const updateCurrentMonthYear = (year, month) => {
        const monthNames = ["leden", "únor", "březen", "duben", "květen", "červen", "červenec", "srpen", "září", "říjen", "listopad", "prosinec"];
        document.getElementById("currentMonthYear").innerText = `${monthNames[month]} ${year}`;
    };

    const addDayClickListeners = () => {
        const tableCells = document.querySelectorAll("td");
        tableCells.forEach((cell) => {
          cell.addEventListener("click", (event) => {
            const cellContent = event.currentTarget.textContent;
            const day = cellContent.match(/^\d+/);
            if (!day) return;
      
            const date = new Date(currentYear, currentMonth, day[0]);
            dateInput.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          });
        });
      };

    const loadNotes = () => {
        const notesJSON = localStorage.getItem('notes');
        return notesJSON ? JSON.parse(notesJSON) : {};
    };

    const saveNotes = (notes) => {
        localStorage.setItem('notes', JSON.stringify(notes));
    };

    const createCalendar = (year, month) => {
        currentYear = year;
        currentMonth = month;
        const date = new Date(year, month);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startDay = new Date(year, month, 1).getDay() || 7;
    
        let calendarHTML = '<table><tr><th>Po</th><th>Út</th><th>St</th><th>Čt</th><th>Pá</th><th>So</th><th>Ne</th></tr><tr>';
    
        for (let i = 1; i < startDay; i++) {
            calendarHTML += '<td></td>';
        }
    
        const notes = loadNotes();
    
        for (let day = 1; day <= daysInMonth; day++) {
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayNotes = notes[dateKey] || [];
    
            calendarHTML += `<td>${day}<ul>${dayNotes.map(note => `<li>${note}</li>`).join('')}</ul></td>`;
    
            if ((day + startDay - 1) % 7 === 0) {
                calendarHTML += '</tr><tr>';
            }
        }
    
        calendarHTML += '</tr></table>';
        calendar.innerHTML = calendarHTML;
        addDayClickListeners();
        updateCurrentMonthYear(year, month);
    };

    addNoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const date = dateInput.value;
        const note = noteInput.value;

        if (!date || !note) return;

        const notes = loadNotes();
        notes[date] = notes[date] || [];
        notes[date].push(note);

        saveNotes(notes);
        createCalendar(new Date(date).getFullYear(), new Date(date).getMonth());

        noteInput.value = '';
    });

    const today = new Date();
    createCalendar(today.getFullYear(), today.getMonth());

    const changeMonth = (offset) => {
        const newMonth = currentMonth + offset;
        const newYear = currentYear + Math.floor(newMonth / 12);
        createCalendar(newYear, newMonth % 12);
    };
    
    document.getElementById("prevMonth").addEventListener("click", () => changeMonth(-1));
    document.getElementById("nextMonth").addEventListener("click", () => changeMonth(1));

    
     
});
