# CampReady

CampReady is a mobile application designed to help users create and manage personalized camping checklists. The app allows users to plan their camping trips by organizing essential items, viewing itineraries, and sharing their checklists with friends and family. It provides a simple, intuitive interface to help users stay organized and prepared for their trips.

## Features

- **User Authentication**: Secure login and registration using Firebase Authentication.
- **Create and Manage Lists**: Easily create checklists for camping items, edit them, and delete individual items.
- **View and Edit Checklists**: Access a list of all created checklists, view details, and make changes as needed.
- **Share Lists**: Share checklists via social media or messaging platforms using Expo's sharing API.
- **Itinerary Management**: View and manage itineraries, including reservations and activities.
- **Weather Data**: Fetch and display weather data related to reservation locations using the OpenWeather API.

## Technologies Used

- **React Native**: For building the mobile app interface.
- **Expo**: A framework and platform for universal React applications.
- **Firebase**: For authentication, storing checklists, and managing user data.
- **Firestore**: A NoSQL cloud database used to store checklists and items.
- **React Navigation**: For handling screen navigation within the app.
- **axios**: For fetching external API data such as weather and activity data.
- **OpenWeather API**: To retrieve weather information for campsite locations.
- **Expo Sharing**: To share checklists through social media or messaging platforms.

## Installation

### Prerequisites

Make sure you have the following installed on your machine:
- **Node.js**: https://nodejs.org/
- **Expo CLI**: Install Expo CLI globally by running `npm install -g expo-cli`.
- **Firebase Project**: Set up a Firebase project and configure your Firebase SDK in the project.

### Steps

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/ryannnemi/campready.git
   cd campready
