const hamburgerBtn = document.querySelector('.hamburger-menu');
const navLinks = document.querySelector('.nav-links');

hamburgerBtn.addEventListener('click', () => {
    
    navLinks.classList.toggle('active');
    
    
    const icon = hamburgerBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times'); // Ícone de x para sair
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars'); //Barra do icone para celular
    }
});

// Fecha o menu ao clicar em um link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            // Reseta o ícone
            hamburgerBtn.querySelector('i').classList.remove('fa-times');
            hamburgerBtn.querySelector('i').classList.add('fa-bars');
        }
    });
});


// --- LÓGICA DO CALENDÁRIO ---
const availableDays = document.querySelectorAll('.calendar-days .available');
const timeSlots = document.querySelectorAll('.time-slots button:not(:disabled)');
const hiddenDateInput = document.getElementById('selected_date');
const hiddenTimeInput = document.getElementById('selected_time');
const calendarMonthYear = document.getElementById('calendar-month-year').textContent;

// Variável para guardar o botão de hora selecionado
let selectedTimeButton = null;

availableDays.forEach(dayButton => {
    dayButton.addEventListener('click', () => {
        availableDays.forEach(btn => btn.classList.remove('selected'));
        dayButton.classList.add('selected');
        const day = dayButton.textContent;
        hiddenDateInput.value = `${day} de ${calendarMonthYear}`;
    });
});

timeSlots.forEach(timeButton => {
    timeButton.addEventListener('click', () => {
        timeSlots.forEach(btn => btn.classList.remove('selected'));
        timeButton.classList.add('selected');
        hiddenTimeInput.value = timeButton.textContent;
        
        // Guarda a referência do botão clicado
        selectedTimeButton = timeButton;
    });
});
const form = document.getElementById('booking-form');
const scriptURL = 'https://script.google.com/macros/s/AKfycbxI9LPVryzpjrD3IBbb7gSrv0C-tpW0Xcre-6u6M52I0PdrTjd5LAeQznbmSINsZePs/exec';

form.addEventListener('submit', e => {
    e.preventDefault();

    if (!hiddenDateInput.value || !hiddenTimeInput.value) {
        alert('Por favor, selecione um dia e um horário disponíveis.');
        return;
    }

    // Adiciona o timestamp do momento do pedido
    const dataDoPedido = new Date().toLocaleString('pt-BR');
    document.getElementById('timestamp_pedido').value = dataDoPedido;


    const submitButton = form.querySelector('.btn-submit');
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            if (response.ok) {
                alert('Agendamento enviado com sucesso! Entraremos em contato para confirmar.');
                form.reset();

                // --- LÓGICA DE BLOQUEIO VISUAL ---

                // 1. Bloqueia o botão de HORA que foi agendado
                if (selectedTimeButton) {
                    selectedTimeButton.classList.remove('selected');
                    selectedTimeButton.disabled = true; // Desabilita
                    selectedTimeButton.textContent = 'Agendado'; // Muda o texto
                }
                
                // 2. Apenas limpa a seleção do DIA
                const diaAgendado = document.querySelector('.calendar-days button.selected');
                if (diaAgendado) {
                    diaAgendado.classList.remove('selected');
                }

                // 3. Limpa os inputs hidden para evitar reenvio
                hiddenDateInput.value = '';
                hiddenTimeInput.value = '';
                selectedTimeButton = null; // Limpa a referência

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