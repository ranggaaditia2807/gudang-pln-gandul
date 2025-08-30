// Script debugging untuk aplikasi Gudang PLN
// Jalankan di console browser setelah membuka aplikasi

class GudangDebugger {
  constructor() {
    this.init();
  }

  init() {
    console.log('🔧 Gudang Debugger Loaded');
    console.log('📋 Available commands:');
    console.log('  - debugger.loginTest() - Test login functionality');
    console.log('  - debugger.checkUser() - Check current user state');
    console.log('  - debugger.checkRoutes() - Check route accessibility');
    console.log('  - debugger.checkLocalStorage() - Check localStorage data');
    console.log('  - debugger.simulateLogin() - Simulate login for testing');
  }

  loginTest() {
    console.log('🧪 Testing login functionality...');
    
    // Test login dengan user mock
    const testUsers = [
      { email: 'owner@gudang.com', password: 'password123', role: 'owner' },
      { email: 'user@gudang.com', password: 'password123', role: 'user' }
    ];

    testUsers.forEach(user => {
      console.log(`Testing login for: ${user.email}`);
      
      // Simulate form input
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      const loginButton = document.querySelector('button[type="submit"]');
      
      if (emailInput && passwordInput && loginButton) {
        emailInput.value = user.email;
        passwordInput.value = user.password;
        
        // Trigger input events
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        
        console.log(`✅ Form filled for ${user.email}`);
      } else {
        console.log('❌ Login form not found');
      }
    });
  }

  checkUser() {
    console.log('👤 Checking user state...');
    
    // Coba akses React context melalui DOM
    const rootElement = document.getElementById('root');
    
    if (rootElement && rootElement._reactRootContainer) {
      const reactRoot = rootElement._reactRootContainer._internalRoot;
      let currentFiber = reactRoot.current;
      
      while (currentFiber) {
        if (currentFiber.type && currentFiber.type.name === 'UserProvider') {
          const contextValue = currentFiber.memoizedProps?.value;
          if (contextValue) {
            console.log('📊 UserContext:', contextValue);
            return contextValue;
          }
        }
        currentFiber = currentFiber.child;
      }
    }
    
    console.log('ℹ️ User context not accessible, checking localStorage...');
    this.checkLocalStorage();
    return null;
  }

  checkRoutes() {
    console.log('🗺️ Checking route accessibility...');
    
    const routes = ['/', '/dashboard', '/transactions', '/reports', '/warehouse', '/login'];
    
    routes.forEach(route => {
      const fullUrl = window.location.origin + '/gudang-pln-gandul' + route;
      console.log(`🔗 ${route}: ${fullUrl}`);
    });
  }

  checkLocalStorage() {
    console.log('💾 Checking localStorage...');
    
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('✅ User found in localStorage:', user);
        return user;
      } catch (error) {
        console.log('❌ Error parsing user data:', error);
      }
    } else {
      console.log('ℹ️ No user data in localStorage');
    }
    return null;
  }

  simulateLogin(userType = 'owner') {
    console.log(`🔧 Simulating login as ${userType}...`);
    
    const users = {
      owner: { id: '1', name: 'Pemilik Gudang', role: 'owner', email: 'owner@gudang.com' },
      user: { id: '2', name: 'Staff Gudang', role: 'user', email: 'user@gudang.com' }
    };
    
    const user = users[userType];
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      console.log(`✅ Login simulated:`, user);
      console.log('🔄 Please refresh the page to see changes');
    } else {
      console.log('❌ Invalid user type. Use "owner" or "user"');
    }
  }

  clearLogin() {
    console.log('🧹 Clearing login data...');
    localStorage.removeItem('user');
    console.log('✅ Login data cleared');
    console.log('🔄 Please refresh the page');
  }
}

// Initialize debugger
const gudangDebug = new GudangDebugger();

// Global access
window.gudangDebugger = gudangDebug;
