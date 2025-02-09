# Schedulo - Event Planner

A modern, responsive event planning application built with vanilla JavaScript that helps users manage their events with timezone support.

## Features

- **Event Management**
  - Create events with title, description, date, and time
  - Edit existing events
  - Delete events with confirmation
  - View all events in a clean card layout

- **Timezone Support**
  - Automatic timezone conversion to Indian Time (IST)
  - Support for multiple global timezones via GeoNames API
  - Fallback timezone list when API is unavailable

- **User Interface**
  - Clean and modern design
  - Light/Dark theme toggle
  - Responsive layout for all devices
  - Tab-based navigation
  - Modal dialogs for confirmations

- **Event Tracking**
  - Real-time countdown timer for each event
  - Automatic alerts when events are due
  - Events sorted by date and time

- **Data Persistence**
  - Local storage integration
  - No data loss on page refresh

## Setup

1. Clone the repository
2. Sign up for a free account at [GeoNames](http://www.geonames.org/login)
3. Replace `'YOUR_GEONAMES_USERNAME'` in `js/events.js` with your GeoNames username
4. Open `index.html` in a modern web browser

## Project Structure

```
schedulo/
├── assets/
│   └── logo.svg
├── js/
│   ├── app.js
│   ├── events.js
│   └── theme.js
├── index.html
├── style.css
└── README.md
```

## Technologies Used

- HTML
- CSS
- Vanilla JavaScript
- GeoNames API for timezone data
- Font Awesome for icons
- Local Storage API

## Theme Colors

- **Light Theme**
  - Primary: #6200EE
  - Background: #FFFFFF

- **Dark Theme**
  - Primary: #BB86FC
  - Background: #121212

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
