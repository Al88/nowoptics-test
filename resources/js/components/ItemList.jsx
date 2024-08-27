import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function ItemList() {
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newItem, setNewItem] = useState({ name: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    connectWebSocket();
    getMessages();
    return () => {
        window.Pusher.unsubscribe('items');
    };
  }, []);

  const connectWebSocket = () => {
    var channel = window.Pusher.subscribe('items');

    channel.bind('updated', function(data) {
        getMessages();
        console.log(1);
        notify("Item " + data.message +" successfully!");
    });

  }

  const getMessages = async () => {
    try {
      const response = await axios.get('/api/items');
      setItems(response.data);
    } catch (err) {
      toast.error('🦄 ' + err.message + '!', { position: "top-left" });
    }
  };

  const notify = (text) => toast(text);

  const handleInputChange = (event) => {
    setNewItem({ ...newItem, [event.target.name]: event.target.value });
  };

  const handleEditInputChange = (event) => {
    setEditValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/items', newItem);
      setNewItem({ name: '' });
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error('🦄 Error creating item.', { position: "top-left" });
    }
  };

  const handleEditClick = (item) => {
    setEditingItemId(item.id);
    setEditValue(item.name);
  };

  const handleSaveClick = async (itemId) => {
    setIsSaving(true);
    try {
      const response = await axios.put(`/api/items/${itemId}`, { name: editValue });
      setEditingItemId(null);
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('🦄 Error saving item.', { position: "top-left" });
    } finally {
        setIsSaving(false);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`/api/items/${itemId}`);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('🦄 Error deleting item.', { position: "top-left" });
    }
  };

  return (
    <div>
      <h2>Items list</h2>
      <ul className="item-list">
        {items.map(item => (
          <li key={item.id} className={editingItemId === item.id ? 'editing' : ''}>
            {editingItemId === item.id ? (
              <input
                type="text"
                value={editValue}
                onChange={handleEditInputChange}
                className="edit-input"
              />
            ) : (
              <span>{item.name}</span>
            )}
            {isSaving && editingItemId === item.id ? (
              <i className="bi bi-arrow-repeat spin-icon"></i>
            ) : (
              <i
                className={editingItemId === item.id ? 'bi bi-check-lg save-icon' : 'bi bi-pencil edit-icon'}
                onClick={() =>
                  editingItemId === item.id ? handleSaveClick(item.id) : handleEditClick(item)
                }
              ></i>
            )}
            <i className="bi bi-trash delete-icon" onClick={() => handleDelete(item.id)}></i>
          </li>
        ))}
      </ul>

      <h2>Add new item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={newItem.name}
          onChange={handleInputChange}
          placeholder="Item Name"
        />
        <button type="submit">Create</button>
      </form>
      <ToastContainer position="top-left" />
    </div>
  );
}

export default ItemList;
