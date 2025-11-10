// --- Interatividade do Calendário ---
// Usando 'const' para valores que não mudam
const availableDays = document.querySelectorAll('.calendar-days .available');
const timeSlots = document.querySelectorAll('.time-slots button:not(:disabled)');
const hiddenDateInput = document.getElementById('selected_date');
const hiddenTimeInput = document.getElementById('selected_time');
const calendarMonthYear = document.getElementById('calendar-month-year').textContent;

// Usando 'forEach' com arrow function '=>' (mais curto)
availableDays.forEach(dayButton => {
    dayButton.addEventListener('click', () => {
        // Remove 'selected' de outros dias
        availableDays.forEach(btn => btn.classList.remove('selected'));
        // Adiciona 'selected' ao clicado
        dayButton.classList.add('selected');
        // Atualiza o input escondido
        const day = dayButton.textContent;
        hiddenDateInput.value = `${day} de ${calendarMonthYear}`;
    });
});

timeSlots.forEach(timeButton => {
    timeButton.addEventListener('click', () => {
        // Remove 'selected' de outros horários
        timeSlots.forEach(btn => btn.classList.remove('selected'));
        // Adiciona 'selected' ao clicado
        timeButton.classList.add('selected');
        // Atualiza o input escondido
        hiddenTimeInput.value = timeButton.textContent;
    });
});

// --- Lógica de Envio para o Google Sheets ---
const form = document.getElementById('booking-form');
// <-- PONTO CRÍTICO: SUBSTITUIR PELA SUA URL.
const scriptURL = 'https://script.google.com/macros/s/AKfycbxI9LPVryzpjrD3IBbb7gSrv0C-tpW0Xcre-6u6M52I0PdrTjd5LAeQznbmSINsZePs/exec'; 

form.addEventListener('submit', e => {
    e.preventDefault();

    if (!hiddenDateInput.value || !hiddenTimeInput.value) {
        alert('Por favor, selecione um dia e um horário disponíveis.');
        return;
    }

    const submitButton = form.querySelector('.btn-submit');
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            if (response.ok) {
                alert('Agendamento enviado com sucesso! Entraremos em contato para confirmar.');
                form.reset();
                // Limpa seleções
                document.querySelectorAll('.calendar-days .selected, .time-slots .selected').forEach(el => {
                    el.classList.remove('selected');
                });
            } else {
                throw new Error('Houve um problema com a resposta do servidor.');
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Ocorreu um erro. Por favor, tente novamente.');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Solicitar Agendamento';
        });
});