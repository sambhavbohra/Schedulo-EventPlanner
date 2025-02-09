class EventManager {
    constructor() {
        this.events = JSON.parse(localStorage.getItem('events')) || [];
        this.initializeTimezones();
    }

    async initializeTimezones() {
        try {
            // Using GeoNames API to fetch timezones
            const username = 'sammy';
            const response = await fetch(`http://api.geonames.org/timezoneJSON?formatted=true&lat=0&lng=0&username=${username}&style=full`);
            const data = await response.json();
            
            // GeoNames provides timezone data in a different format
            const timezones = [
                "Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers",
                "Africa/Cairo", "Africa/Casablanca", "Africa/Lagos", "Africa/Nairobi",
                "America/Anchorage", "America/Bogota", "America/Chicago", "America/Denver",
                "America/Los_Angeles", "America/Mexico_City", "America/New_York", "America/Phoenix",
                "America/Santiago", "America/Sao_Paulo", "America/Toronto", "America/Vancouver",
                "Asia/Bangkok", "Asia/Dubai", "Asia/Hong_Kong", "Asia/Istanbul",
                "Asia/Jakarta", "Asia/Jerusalem", "Asia/Kolkata", "Asia/Kuwait",
                "Asia/Manila", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore",
                "Asia/Tokyo", "Australia/Adelaide", "Australia/Brisbane", "Australia/Melbourne",
                "Australia/Perth", "Australia/Sydney", "Europe/Amsterdam", "Europe/Athens",
                "Europe/Berlin", "Europe/Brussels", "Europe/Budapest", "Europe/Copenhagen",
                "Europe/Dublin", "Europe/Helsinki", "Europe/Istanbul", "Europe/Kiev",
                "Europe/Lisbon", "Europe/London", "Europe/Madrid", "Europe/Moscow",
                "Europe/Oslo", "Europe/Paris", "Europe/Prague", "Europe/Rome",
                "Europe/Stockholm", "Europe/Vienna", "Europe/Warsaw", "Europe/Zurich",
                "Pacific/Auckland", "Pacific/Fiji", "Pacific/Honolulu", "Pacific/Sydney"
            ];

            const timezoneSelect = document.getElementById('timezone');
            timezoneSelect.innerHTML = ''; // Clear existing options
            
            timezones.forEach(timezone => {
                const option = document.createElement('option');
                option.value = timezone;
                option.textContent = timezone.replace('_', ' ');
                if (timezone === 'Asia/Kolkata') {
                    option.selected = true;
                }
                timezoneSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching timezones:', error);
            // Fallback to a basic timezone list if API fails
            const basicTimezones = ['Asia/Kolkata', 'UTC', 'America/New_York', 'Europe/London'];
            const timezoneSelect = document.getElementById('timezone');
            
            basicTimezones.forEach(timezone => {
                const option = document.createElement('option');
                option.value = timezone;
                option.textContent = timezone;
                if (timezone === 'Asia/Kolkata') {
                    option.selected = true;
                }
                timezoneSelect.appendChild(option);
            });
        }
    }

    convertToIndianTime(date, fromTimezone) {
        const eventDate = new Date(date);
        const indianTime = new Date(eventDate.toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata'
        }));
        return indianTime;
    }

    async addEvent(eventData) {
        const event = {
            id: Date.now().toString(),
            ...eventData,
            indianTime: this.convertToIndianTime(eventData.datetime, eventData.timezone)
        };

        this.events.push(event);
        this.saveEvents();
        this.renderEvents();
        this.setupEventReminders();
    }

    editEvent(eventId, newData) {
        const index = this.events.findIndex(e => e.id === eventId);
        if (index !== -1) {
            this.events[index] = {
                ...this.events[index],
                ...newData,
                indianTime: this.convertToIndianTime(newData.datetime, newData.timezone)
            };
            this.saveEvents();
            this.renderEvents();
            this.setupEventReminders();
        }
    }

    deleteEvent(eventId) {
        this.events = this.events.filter(e => e.id !== eventId);
        this.saveEvents();
        this.renderEvents();
    }

    saveEvents() {
        localStorage.setItem('events', JSON.stringify(this.events));
    }

    renderEvents() {
        const container = document.querySelector('.events-container');
        container.innerHTML = '';

        this.events.sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
            .forEach(event => {
                const card = this.createEventCard(event);
                container.appendChild(card);
            });
    }

    createEventCard(event) {
        const card = document.createElement('div');
        card.className = 'event-card';
        card.innerHTML = `
            <h3>${event.title}</h3>
            <p>${event.description || 'No description'}</p>
            <p>Time: ${new Date(event.datetime).toLocaleString()}</p>
            <p>Indian Time: ${new Date(event.indianTime).toLocaleString()}</p>
            <div class="event-timer" data-time="${event.datetime}"></div>
            <div class="event-actions">
                <button class="btn-secondary edit-event" data-id="${event.id}">Edit</button>
                <button class="btn-danger delete-event" data-id="${event.id}">Delete</button>
            </div>
        `;

        this.setupCardListeners(card, event);
        return card;
    }

    setupCardListeners(card, event) {
        const editBtn = card.querySelector('.edit-event');
        const deleteBtn = card.querySelector('.delete-event');

        editBtn.addEventListener('click', () => this.handleEdit(event));
        deleteBtn.addEventListener('click', () => this.handleDelete(event.id));
    }

    handleEdit(event) {
        document.getElementById('title').value = event.title;
        document.getElementById('description').value = event.description || '';
        document.getElementById('datetime').value = event.datetime;
        document.getElementById('timezone').value = event.timezone;

        document.querySelector('[data-tab="create"]').click();

        const form = document.getElementById('eventForm');
        form.dataset.editId = event.id;
    }

    handleDelete(eventId) {
        const modal = document.getElementById('deleteModal');
        modal.classList.add('active');

        const confirmBtn = document.getElementById('confirmDelete');
        const cancelBtn = document.getElementById('cancelDelete');

        const handleConfirm = () => {
            this.deleteEvent(eventId);
            modal.classList.remove('active');
            cleanup();
        };

        const handleCancel = () => {
            modal.classList.remove('active');
            cleanup();
        };

        const cleanup = () => {
            confirmBtn.removeEventListener('click', handleConfirm);
            cancelBtn.removeEventListener('click', handleCancel);
        };

        confirmBtn.addEventListener('click', handleConfirm);
        cancelBtn.addEventListener('click', handleCancel);
    }

    setupEventReminders() {
        this.events.forEach(event => {
            const eventTime = new Date(event.datetime).getTime();
            const now = new Date().getTime();
            const timeUntilEvent = eventTime - now;

            if (timeUntilEvent > 0) {
                setTimeout(() => {
                    this.showEventAlert(event);
                }, timeUntilEvent);
            }
        });
    }

    showEventAlert(event) {
        const modal = document.getElementById('alertModal');
        const message = document.getElementById('alertMessage');
        const closeBtn = document.getElementById('closeAlert');

        message.textContent = `Event "${event.title}" is starting now!`;
        modal.classList.add('active');

        closeBtn.onclick = () => modal.classList.remove('active');
    }

    updateTimers() {
        const timerElements = document.querySelectorAll('.event-timer');
        timerElements.forEach(element => {
            const eventTime = new Date(element.dataset.time).getTime();
            const now = new Date().getTime();
            const distance = eventTime - now;

            if (distance < 0) {
                element.textContent = 'Event has passed';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            element.textContent = `Time remaining: ${days}d ${hours}h ${minutes}m ${seconds}s`;
        });
    }
}