// Open the IndexedDB database
const openDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('user', 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
  
        // Create an object store
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'email' });
        }
      };
  
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(db);
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };

  export const readUser = async (email) => {
    const db = await openDB();
  
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readonly');
      const objectStore = transaction.objectStore('users');
      const request = objectStore.get(email);
  
      request.onsuccess = (event) => {
        const user = event.target.result;
        resolve(user);
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };
  
  export const writeUser = async (user) => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readwrite');
      const objectStore = transaction.objectStore('users');
      const request = objectStore.put(user);
  
      transaction.oncomplete = () => {
        const updatedDB = request.transaction.db; 
        // Get the updated database reference
        db.close(); // Close the IndexedDB connection
        resolve(updatedDB);
      };
  
      transaction.onerror = (event) => {
        db.close(); // Close the IndexedDB connection
        reject(event.target.error);
      };
    });
  };