import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Ensure this hook provides currentUser correctly
import { db } from '../firebase'; // Ensure this import is correct based on your firebase setup
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore'; // Update import paths for Firestore methods

function DataList() {
  const { currentUser } = useAuth(); // Ensure currentUser is provided by AuthContext
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!currentUser) return; // Return early if there is no current user

    // Define the collection reference and query
    const dataCollection = collection(db, 'data');
    const dataQuery = query(dataCollection, where('userId', '==', currentUser.uid));

    // Set up real-time listener
    const unsubscribe = onSnapshot(dataQuery, snapshot => {
      const newData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log('Data fetched:', newData); // Debug log
      setData(newData);
    }, error => {
      console.error('Error fetching data:', error); // Error handling
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [currentUser]);

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, 'data', id));
      console.log(`Document with ID ${id} deleted.`); // Debug log
      alert('Data deleted successfully!'); // Success message
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Error deleting data. Please try again.'); // Error message
    }
  }

  return (
    <div>
      <h2>Data List</h2>
      <ul>
        {data.length === 0 ? (
          <li>No data available.</li>
        ) : (
          data.map(item => (
            <li key={item.id}>
              {item.title} - {item.description}
              <button onClick={() => handleDelete(item.id)}>Delete</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default DataList;
