// Base de datos simulada de usuarios
const userDatabase = {
    users: [{
            id: 1,
            username: 'admin',
            password: 'administrador',
            name: 'Administrador',
            email: 'admin@example.com',
            role: 'admin'
        },
        {
            id: 2,
            username: 'user',
            password: '123456',
            name: 'Usuario Normal',
            email: 'user@example.com',
            role: 'user'
        }
    ],

    saveUsers: function() {
        localStorage.setItem('mockUsers', JSON.stringify(this.users));
    },

    loadUsers: function() {
        const storedUsers = localStorage.getItem('mockUsers');
        if (storedUsers) {
            this.users = JSON.parse(storedUsers);
        }
        return this.users;
    },

    addUser: function(user) {
        this.users.push(user);
        this.saveUsers();
        return user;
    },

    findUser: function(username) {
        return this.users.find(u => u.username === username);
    },

    findUserByEmail: function(email) {
        return this.users.find(u => u.email === email);
    }
};
userDatabase.loadUsers();

// Servidor de autenticación
const authServer = {
    login: async function(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const user = userDatabase.findUser(username);
                if (user && user.password === password) {
                    resolve({
                        success: true,
                        token: `simulated-jwt-token-${user.id}-${Date.now()}`,
                        user: {
                            id: user.id,
                            username: user.username,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Credenciales incorrectas'
                    });
                }
            }, 500);
        });
    },

    register: async function(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Validacion de espacios
                if (!userData.username || !userData.password || !userData.name || !userData.email) {
                    reject({ success: false, message: 'Todos los campos son obligatorios' });
                    return;
                }
                //Validar longitud de la contraseña
                if (userData.password.length < 6) {
                    reject({ success: false, message: 'La contraseña debe tener al menos 6 caracteres' });
                    return;
                }
                // Verificar si usuario ya existe
                if (userDatabase.findUser(userData.username)) {
                    reject({ success: false, message: 'El nombre de usuario ya está en uso' });
                    return;
                }
                //Validacion de correo electrónico
                if (userDatabase.findUserByEmail(userData.email)) {
                    reject({ success: false, message: 'El correo electrónico ya está registrado' });
                    return;
                }

                // Crear nuevo usuario
                const newUser = {
                    id: Math.max(...userDatabase.users.map(u => u.id)) + 1,
                    username: userData.username,
                    password: userData.password,
                    name: userData.name,
                    email: userData.email,
                    role: 'user',
                    createdAt: new Date().toISOString()
                };

                userDatabase.addUser(newUser);

                resolve({
                    success: true,
                    user: {
                        id: newUser.id,
                        username: newUser.username,
                        name: newUser.name,
                        email: newUser.email,
                        role: newUser.role
                    },
                    message: 'Usuario registrado con éxito'
                });
            }, 1000);
        });
    }
};

// Gestión de sesión local
const sessionManager = {
    getSession: function() {
        const session = localStorage.getItem('authSession');
        try {
            return session ? JSON.parse(session) : null;
        } catch (e) {
            console.error("Error parsing session data", e);
            return null;
        }
    },

    setSession: function(sessionData) {
        localStorage.setItem('authSession', JSON.stringify(sessionData));
    },

    clearSession: function() {
        localStorage.removeItem('authSession');
    },

    isAuthenticated: function() {
        const session = this.getSession();
        return !!session && session.token;
    },

    getCurrentUser: function() {
        const session = this.getSession();
        return session && session.user || null;
    }
};

// Servicio de autenticación
const authService = {
    login: async function(username, password) {
        try {
            const response = await authServer.login(username, password);

            if (response.success) {
                sessionManager.setSession({
                    token: response.token,
                    user: response.user
                });
                return { success: true };
            }
        } catch (error) {
            return { success: false, message: error.message || 'Error de autenticación' };
        }
    },

    logout: function() {
        sessionManager.clearSession();
        window.location.href = 'login.html';
    },

    checkAuth: function() {
        const currentPage = window.location.pathname.split('/').pop();
        const allowedPages = ['login.html', 'register.html', 'index.html'];

        if (!sessionManager.isAuthenticated() && !allowedPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
    },

    protectRoute: function() {
        if (!sessionManager.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    },

    register: async function(userData) {
        try {
            const response = await authServer.register(userData);

            if (response.success) {
                // Iniciar sesión automáticamente después del registro
                const loginResult = await this.login(userData.username, userData.password);

                if (loginResult.success) {
                    return {
                        success: true,
                        message: response.message,
                        autoLogin: true
                    };
                }
                return {
                    success: true,
                    message: response.message,
                    autoLogin: false
                };
            }
        } catch (error) {
            return { success: false, message: error.message || 'Error en el registro' };
        }
    }
};

window.addEventListener('DOMContentLoaded', function() {
    authService.checkAuth();
});