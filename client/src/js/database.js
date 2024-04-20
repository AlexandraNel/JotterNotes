import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// Export a function we will use to PUT to the database.
export const putDb = async (content) => {
  console.log('add content to the database');

  // Create a connection to the database database and version we want to use.
  try {const contactDb = await openDB('jate', 1);

  // Create a new transaction and specify the database and data privileges.
  const tx = contactDb.transaction('jate', 'readwrite');

  // Open up the desired object store.
  const store = tx.objectStore('jate');

  // Use the .put() method on the store and pass in the content.
  //only 1 item in our database, always update that item
  const request = store.put({ id: 1, value: content });

  // Get confirmation of the request.
  const result = await request;
  console.log('Data saved to the database', result);}
  catch (error) {
  console.error('putDb not implemented');
}
};


// Export a function we will use to GET to the database.
export const getDb = async () => {
  console.log('GET from the database');
try{
  // Create a connection to the database database and version we want to use.
  const contactDb = await openDB('jate', 1);

  // Create a new transaction and specify the database and data privileges.
  const tx = contactDb.transaction('jate', 'readonly');

  // Open up the desired object store.
  const store = tx.objectStore('jate');

  // Use the .getAll() method to get all data in the database.
  const request = store.getAll();
  
  // Get confirmation of the request.
  const result = await request;
  console.log('result.value', result);
  return result.value;}
  
  catch (err)
{console.error('getDb not implemented');};
};

initdb();

