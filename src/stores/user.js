import axios from 'axios';

import { defineStore } from 'pinia'

export const userStore = defineStore('userStore', {
    state: () => ({
        user: {
            data: null,
            token: null
        }
    }),
    actions: {
        saveUserData(user) {
            this.user.data = user[0];
            this.user.token = user[1];
            this.$patch();
            this.saveToSessionStorage();
            this.setupAxiosInterceptors(); // Attach interceptor after saving user data
        },
        logout() {
            this.user.data = null;
            this.user.token = null;
            this.$patch();
            this.saveToSessionStorage(); // Save to sessionStorage
            this.removeAxiosInterceptors(); // Remove interceptor on logout
        },
        loadFromSessionStorage() {
            const userData = sessionStorage.getItem('user');

            if (userData) {
                const parsedUserData = JSON.parse(userData);
                this.user.data = parsedUserData.data;
                this.user.token = parsedUserData.token;
                this.setupAxiosInterceptors(); // Attach interceptor after loading user data
            }
            this.$patch(); // Notify Pinia that the state has been modified
        },
        saveToSessionStorage() {
            sessionStorage.setItem('user', JSON.stringify(this.user));
        },
        // Add the bind statement to explicitly bind this function to the store instance
        setupAxiosInterceptors() {
            // Add the request interceptor
            axios.interceptors.request.use(
                (config) => {
                    const token = this.user.token;
                    if (token) {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                    return config;
                },
                (error) => {
                    return Promise.reject(error);
                }
            );
        },
        removeAxiosInterceptors() {
            // Remove the request interceptor when logging out
            axios.interceptors.request.eject(0); // Adjust the interceptor index if you have multiple interceptors
        },
    },
    // Use beforeUnmount to save the cart data before the component is destroyed
    beforeUnmount() {
        this.saveToSessionStorage();
    },
    // Use onAction to load data from sessionStorage when an action is called
    onAction(action, context) {
        if (action === 'loadFromSessionStorage') {
            context.state.loadFromSessionStorage();
        }
    }
})