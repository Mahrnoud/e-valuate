// src/services/mockApiService.js

// Helper to simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize localStorage with demo data if it doesn't exist
const initializeLocalStorage = () => {
    // Check if we've already initialized
    if (localStorage.getItem('mock_initialized')) return;

    // Create mock data structure
    const initialData = {
        users: [
            {
                id: 'user1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                phoneNumber: '+15551234567',
                isProfileComplete: true
            },
            {
                id: 'user2',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane@example.com',
                phoneNumber: '+15559876543',
                isProfileComplete: true
            }
        ],
        circles: [
            { id: 'circle1', name: 'Friends', userId: 'user1' },
            { id: 'circle2', name: 'Family', userId: 'user1' },
            { id: 'circle3', name: 'Work', userId: 'user1' },
            { id: 'circle4', name: 'Friends', userId: 'user2' },
            { id: 'circle5', name: 'Family', userId: 'user2' }
        ],
        contacts: [
            { id: 'contact1', name: 'Alice Brown', phoneNumber: '+15551112222', email: 'alice@example.com', circleId: 'circle1', userId: 'user1' },
            { id: 'contact2', name: 'Bob Johnson', phoneNumber: '+15553334444', email: 'bob@example.com', circleId: 'circle2', userId: 'user1' },
            { id: 'contact3', name: 'Charlie Davis', phoneNumber: '+15555556666', email: 'charlie@example.com', circleId: 'circle3', userId: 'user1' },
            { id: 'contact4', name: 'John Doe', phoneNumber: '+15551234567', email: 'john@example.com', circleId: 'circle4', userId: 'user2' }
        ],
        traits: [
            { id: 'trait1', positiveName: 'Polite', negativeName: 'Rude', description: 'How someone treats others in social situations' },
            { id: 'trait2', positiveName: 'Generous', negativeName: 'Stingy', description: 'Willingness to share resources and help others' },
            { id: 'trait3', positiveName: 'Honest', negativeName: 'Dishonest', description: 'Truthfulness and integrity in communication' },
            { id: 'trait4', positiveName: 'Humble', negativeName: 'Arrogant', description: 'Level of modesty and self-importance' },
            { id: 'trait5', positiveName: 'Patient', negativeName: 'Impatient', description: 'Ability to wait calmly for results or endure difficulties' }
        ],
        ratings: {},
        tokens: {
            verificationCodes: {},
            sessions: {},
            ratingTokens: []
        },
        notifications: []
    };

    // Save to localStorage
    Object.entries(initialData).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
    });

    // Mark as initialized
    localStorage.setItem('mock_initialized', 'true');
};

// Initialize on service import
initializeLocalStorage();

// Helper to generate IDs
const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Mock API endpoints
const mockApiService = {
    // Auth Service
    auth: {
        requestVerificationCode: async (phoneNumber) => {
            await delay(1000); // Simulate network delay

            // Generate a simple 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // Store in tokens
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            tokens.verificationCodes[phoneNumber] = code;
            localStorage.setItem('tokens', JSON.stringify(tokens));

            console.log(`Verification code for ${phoneNumber}: ${code}`);
            return { success: true };
        },

        verifyCode: async (phoneNumber, code) => {
            await delay(1000);

            const tokens = JSON.parse(localStorage.getItem('tokens'));

            // Check if code matches
            if (tokens.verificationCodes[phoneNumber] !== code) {
                throw new Error('Invalid verification code');
            }

            // Find or create user
            let users = JSON.parse(localStorage.getItem('users'));
            let user = users.find(u => u.phoneNumber === phoneNumber);

            if (!user) {
                // Create new user
                user = {
                    id: generateId('user'),
                    phoneNumber,
                    isProfileComplete: false
                };
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));
            }

            // Generate session token
            const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            tokens.sessions[token] = user.id;
            localStorage.setItem('tokens', JSON.stringify(tokens));

            // Clean up verification code
            delete tokens.verificationCodes[phoneNumber];
            localStorage.setItem('tokens', JSON.stringify(tokens));

            return { token, user };
        },

        getCurrentUser: async () => {
            await delay(500);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const userId = tokens.sessions[token];
            if (!userId) throw new Error('Invalid token');

            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.id === userId);
            if (!user) throw new Error('User not found');

            return user;
        },

        updateProfile: async (profileData) => {
            await delay(1000);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const userId = tokens.sessions[token];
            if (!userId) throw new Error('Invalid token');

            let users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex === -1) throw new Error('User not found');

            // Update user profile
            users[userIndex] = {
                ...users[userIndex],
                ...profileData,
                isProfileComplete: true
            };

            localStorage.setItem('users', JSON.stringify(users));
            return users[userIndex];
        }
    },

    // Contacts Service
    contacts: {
        getCircles: async () => {
            await delay(500);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const userId = tokens.sessions[token];
            if (!userId) throw new Error('Invalid token');

            const circles = JSON.parse(localStorage.getItem('circles'));
            return circles.filter(circle => circle.userId === userId);
        },

        createCircle: async (circleData) => {
            await delay(800);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const userId = tokens.sessions[token];
            if (!userId) throw new Error('Invalid token');

            const circle = {
                id: generateId('circle'),
                userId,
                ...circleData
            };

            let circles = JSON.parse(localStorage.getItem('circles'));
            circles.push(circle);
            localStorage.setItem('circles', JSON.stringify(circles));

            return circle;
        },

        updateCircle: async (circleId, circleData) => {
            await delay(800);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            let circles = JSON.parse(localStorage.getItem('circles'));
            const circleIndex = circles.findIndex(c => c.id === circleId);
            if (circleIndex === -1) throw new Error('Circle not found');

            circles[circleIndex] = {
                ...circles[circleIndex],
                ...circleData
            };

            localStorage.setItem('circles', JSON.stringify(circles));
            return circles[circleIndex];
        },

        deleteCircle: async (circleId) => {
            await delay(800);

            let circles = JSON.parse(localStorage.getItem('circles'));
            circles = circles.filter(c => c.id !== circleId);
            localStorage.setItem('circles', JSON.stringify(circles));

            // Also delete contacts in this circle
            let contacts = JSON.parse(localStorage.getItem('contacts'));
            contacts = contacts.filter(c => c.circleId !== circleId);
            localStorage.setItem('contacts', JSON.stringify(contacts));

            return { success: true };
        },

        getContacts: async () => {
            await delay(500);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const userId = tokens.sessions[token];
            if (!userId) throw new Error('Invalid token');

            const contacts = JSON.parse(localStorage.getItem('contacts'));
            return contacts.filter(contact => contact.userId === userId);
        },

        addContact: async (contactData) => {
            await delay(800);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const userId = tokens.sessions[token];
            if (!userId) throw new Error('Invalid token');

            const contact = {
                id: generateId('contact'),
                userId,
                ...contactData
            };

            let contacts = JSON.parse(localStorage.getItem('contacts'));
            contacts.push(contact);
            localStorage.setItem('contacts', JSON.stringify(contacts));

            return contact;
        },

        updateContact: async (contactId, contactData) => {
            await delay(800);

            let contacts = JSON.parse(localStorage.getItem('contacts'));
            const contactIndex = contacts.findIndex(c => c.id === contactId);
            if (contactIndex === -1) throw new Error('Contact not found');

            contacts[contactIndex] = {
                ...contacts[contactIndex],
                ...contactData
            };

            localStorage.setItem('contacts', JSON.stringify(contacts));
            return contacts[contactIndex];
        },

        deleteContact: async (contactId) => {
            await delay(800);

            let contacts = JSON.parse(localStorage.getItem('contacts'));
            contacts = contacts.filter(c => c.id !== contactId);
            localStorage.setItem('contacts', JSON.stringify(contacts));

            return { success: true };
        },

        sendRatingInvitations: async (contactIds) => {
            await delay(1500);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const userId = tokens.sessions[token];
            if (!userId) throw new Error('Invalid token');

            // Get contacts
            const contacts = JSON.parse(localStorage.getItem('contacts'));
            const selectedContacts = contacts.filter(c => contactIds.includes(c.id));

            // Create rating tokens
            let allTokens = JSON.parse(localStorage.getItem('tokens'));
            const users = JSON.parse(localStorage.getItem('users'));
            const currentUser = users.find(u => u.id === userId);

            // Create notifications
            let notifications = JSON.parse(localStorage.getItem('notifications'));

            // Process each contact
            selectedContacts.forEach(contact => {
                // Generate token
                const ratingToken = generateId('rate');

                allTokens.ratingTokens.push({
                    token: ratingToken,
                    userId: userId,
                    contactId: contact.id
                });

                // Simulate notification for the user being rated
                notifications.push({
                    id: generateId('notif'),
                    userId: userId,
                    message: `Rating invitation sent to ${contact.name}`,
                    type: 'invitation_sent',
                    read: false,
                    createdAt: new Date().toISOString()
                });

                // Find if this contact is also a user in our system
                const contactUser = users.find(u => u.phoneNumber === contact.phoneNumber);
                if (contactUser) {
                    // Create notification for the contact who received rating request
                    notifications.push({
                        id: generateId('notif'),
                        userId: contactUser.id,
                        message: `${currentUser.firstName} ${currentUser.lastName} has requested your feedback`,
                        type: 'rating_request',
                        read: false,
                        createdAt: new Date().toISOString()
                    });
                }

                console.log(`Rating URL for ${contact.name}: http://localhost:5173/rate/${userId}?token=${ratingToken}`);
            });

            // Save tokens and notifications
            localStorage.setItem('tokens', JSON.stringify(allTokens));
            localStorage.setItem('notifications', JSON.stringify(notifications));

            return {
                success: true,
                sent: selectedContacts.length
            };
        },
    },

    // Ratings Service
    ratings: {
        getTraits: async () => {
            await delay(500);
            return JSON.parse(localStorage.getItem('traits'));
        },

        getUserRatings: async (userId) => {
            await delay(800);

            const ratings = JSON.parse(localStorage.getItem('ratings')) || {};
            return ratings[userId] || {};
        },

        submitRating: async (userId, traitId, rating) => {
            await delay(1000);

            // Get current ratings
            let allRatings = JSON.parse(localStorage.getItem('ratings')) || {};

            // Initialize user ratings if not exist
            if (!allRatings[userId]) {
                allRatings[userId] = {};
            }

            // Get token to identify the circle
            const token = localStorage.getItem('ratingToken');
            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const tokenInfo = tokens.ratingTokens.find(t => t.token === token);

            if (!tokenInfo) throw new Error('Invalid rating token');

            // Get contact info to determine circle
            const contacts = JSON.parse(localStorage.getItem('contacts'));
            const contact = contacts.find(c => c.id === tokenInfo.contactId);

            if (!contact) throw new Error('Contact not found');
            const circleId = contact.circleId;

            // Initialize circle ratings if not exist
            if (!allRatings[userId][circleId]) {
                allRatings[userId][circleId] = {};
            }

            // Initialize trait ratings if not exist
            if (!allRatings[userId][circleId][traitId]) {
                allRatings[userId][circleId][traitId] = [];
            }

            // Add rating
            allRatings[userId][circleId][traitId].push(rating);

            // Save updated ratings
            localStorage.setItem('ratings', JSON.stringify(allRatings));

            // Create notification for user being rated
            let notifications = JSON.parse(localStorage.getItem('notifications'));
            notifications.push({
                id: generateId('notif'),
                userId: userId,
                message: 'You received a new rating!',
                type: 'new_rating',
                read: false,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('notifications', JSON.stringify(notifications));

            return { success: true };
        },

        validateRatingToken: async (token) => {
            await delay(800);

            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const tokenInfo = tokens.ratingTokens.find(t => t.token === token);

            if (!tokenInfo) throw new Error('Invalid rating token');

            // Store token for future rating submissions
            localStorage.setItem('ratingToken', token);

            // Get user being rated
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.id === tokenInfo.userId);

            return {
                valid: true,
                user: user
            };
        },

        getTraitDetails: async (userId, traitId) => {
            await delay(500);

            const traits = JSON.parse(localStorage.getItem('traits'));
            const trait = traits.find(t => t.id === traitId);

            if (!trait) throw new Error('Trait not found');

            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.id === userId);

            if (!user) throw new Error('User not found');

            return {
                trait,
                user
            };
        }
    },

    // Notifications Service
    notifications: {
        getNotifications: async () => {
            await delay(500);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const userId = tokens.sessions[token];
            if (!userId) throw new Error('Invalid token');

            const notifications = JSON.parse(localStorage.getItem('notifications'));
            const userNotifications = notifications.filter(n => n.userId === userId);

            const unreadCount = userNotifications.filter(n => !n.read).length;

            return {
                notifications: userNotifications,
                unreadCount
            };
        },

        markAsRead: async (notificationId) => {
            await delay(300);

            let notifications = JSON.parse(localStorage.getItem('notifications'));
            const notificationIndex = notifications.findIndex(n => n.id === notificationId);

            if (notificationIndex === -1) throw new Error('Notification not found');

            notifications[notificationIndex].read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));

            return { success: true };
        },

        markAllAsRead: async () => {
            await delay(500);

            const token = localStorage.getItem('token');
            if (!token) throw new Error('Not authenticated');

            const tokens = JSON.parse(localStorage.getItem('tokens'));
            const userId = tokens.sessions[token];
            if (!userId) throw new Error('Invalid token');

            let notifications = JSON.parse(localStorage.getItem('notifications'));

            notifications = notifications.map(notification => {
                if (notification.userId === userId) {
                    return { ...notification, read: true };
                }
                return notification;
            });

            localStorage.setItem('notifications', JSON.stringify(notifications));

            return { success: true };
        },

        deleteNotification: async (notificationId) => {
            await delay(300);

            let notifications = JSON.parse(localStorage.getItem('notifications'));
            notifications = notifications.filter(n => n.id !== notificationId);
            localStorage.setItem('notifications', JSON.stringify(notifications));

            return { success: true };
        }
    }
};

export default mockApiService;
