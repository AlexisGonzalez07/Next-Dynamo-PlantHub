// Open the IndexedDB database
const openUserDb = () => {
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
    const db = await openUserDb();
  
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['users'], 'readonly');
      const objectStore = transaction.objectStore('users');
      const request = objectStore.get(email);
  
      request.onsuccess = (event) => {
        const user = event.target.result;
        console.log("THIS IS WHAT WAS READ")
        console.log(user)
        resolve(user);
      };
  
      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  };
  
  export const writeUser = async (user) => {
    const db = await openUserDb();
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

// Open a connection to the database
const openBackUpDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("backup", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore("last_user");
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

export const resetBackupDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("backup", 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Delete the object store if it already exists
      if (db.objectStoreNames.contains("last_user")) {
        db.deleteObjectStore("last_user");
      }
      const objectStore = db.createObjectStore("last_user");
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

// Function to read the last logged-in user from the database
export const readLastLogged = async () => {
  const db = await openBackUpDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction("last_user", 'readonly');
    const objectStore = transaction.objectStore("last_user");
    const request = objectStore.get('last_logged_in');

    request.onsuccess = (event) => {
      const user = event.target.result;
      console.log('READ BACKUP DB')
      console.log(user)
      resolve(user);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export async function writeLastLogged(data) {
  try {
    const db = await openBackUpDB();
    const transaction = db.transaction('last_user', 'readwrite');
    const objectStore = transaction.objectStore('last_user');
    const putRequest = objectStore.put(data, 'last_logged_in');

    await new Promise((resolve, reject) => {
      putRequest.onsuccess = () => {
        db.close(); // Close the IndexedDB connection
        resolve();
      };

      putRequest.onerror = (event) => {
        reject('Failed to write to the database: ' + event.target.error);
      };
    });
  } catch (error) {
    throw new Error('Failed to write to the database: ' + error);
  }
}