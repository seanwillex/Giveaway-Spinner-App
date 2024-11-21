class ThemeManager {
    static init() {
        const preferences = JSON.parse(localStorage.getItem('preferences')) || {
            theme: 'light'
        };
        document.documentElement.setAttribute('data-theme', preferences.theme);
    }
}

// Initialize theme when the DOM is loaded
document.addEventListener('DOMContentLoaded', ThemeManager.init);
