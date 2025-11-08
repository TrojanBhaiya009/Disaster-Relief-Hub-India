// Index.js - Disaster Relief Coordination Hub

// Volunteer Management
class VolunteerManager {
    constructor() {
        this.volunteers = [];
    }

    registerVolunteer(name, email, phone, state, skills, startDate, endDate) {
        const volunteer = {
            id: Date.now(),
            name,
            email,
            phone,
            state,
            skills,
            startDate,
            endDate,
            status: 'Active'
        };
        this.volunteers.push(volunteer);
        return volunteer;
    }
}

const volunteerManager = new VolunteerManager();

// Volunteer Form Handler
const volunteerForm = document.querySelector('form');
if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = volunteerForm.querySelectorAll('input, textarea, select');
        const [name, email, phone, state, skills, startDate, endDate] = Array.from(inputs).map(el => el.value);
        
        volunteerManager.registerVolunteer(name, email, phone, state, skills, startDate, endDate);
        alert('Registration successful!');
        volunteerForm.reset();
    });
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        target?.scrollIntoView({ behavior: 'smooth' });
    });
});
