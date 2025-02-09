// Initialize event manager
const eventManager = new EventManager();

// Tab switching
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Form handling
const eventForm = document.getElementById('eventForm');
eventForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const eventData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        datetime: document.getElementById('datetime').value,
        timezone: document.getElementById('timezone').value
    };

    const editId = eventForm.dataset.editId;

    try {
        if (editId) {
            await eventManager.editEvent(editId, eventData);
            delete eventForm.dataset.editId;
        } else {
            await eventManager.addEvent(eventData);
        }

        eventForm.reset();
        document.querySelector('[data-tab="events"]').click();
    } catch (error) {
        console.error('Error saving event:', error);
        alert('Error saving event. Please try again.');
    }
});

// Update timers every second
setInterval(() => {
    eventManager.updateTimers();
}, 1000);

// Initial render
eventManager.renderEvents();