// app.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const SERVER_URL = 'http://localhost:8080';

function App() {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [stature, setStature] = useState('');
  const [goal, setGoal] = useState('');
  const [fileName, setFileName] = useState('')

  const fetchData = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/api/veri`);
      const veri = response.data;
      setData(veri);
    } catch (error) {
      console.error('Hata:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('image', fileName)
      formData.append('name', name);
      formData.append('weight', weight);
      formData.append('stature', stature);
      formData.append('goal', goal);

  
      const response = await axios.post(`${SERVER_URL}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        setFile(null);
        setName('');
        setWeight('');
        setStature('');
        setGoal('');
        fetchData();
      }
    } catch (error) {
      console.log(error); // Hatayı konsola yazdır
    }
  };
  

  const handleDelete = async (itemId) => {
    const endpoint = `${SERVER_URL}/api/veri/${itemId}`;

    try {
      const response = await axios.delete(endpoint);

      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileSave = (e) => {
    setFile(e.target.files[0]);
    //ismini kaydetmek icin de başka bir state açarsın
    setFileName(e.target.value);
    //yaparsın
    }

  return (
    <div className='App'>
      <h1>CRUD APP</h1>
      <form>
        <input
          type="file"
          name='image'
          accept='image/*'
          onChange={e => handleFileSave(e) }
        />
        <input
          type="text"
          name='name'
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder='Lütfen Futbolcu Adı Yazın'
        />
        <input
          type="text"
          name='weight'
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder='Lütfen Futbolcu Kilosunu Yazın'
        />
        <input
          type="text"
          name='stature'
          value={stature}
          onChange={e => setStature(e.target.value)}
          placeholder='Lütfen Futbolcu Boyunu Yazın'
        />
        <input
          type="text"
          name='goal'
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder='Lütfen Futbolcunun Attığı Gol Sayısı Yazın'
        />
        <button type='submit' onClick={handleAddItem}>Gönder</button>
      </form>
      <br />
      <br />
      <br />
      <br />
      <ul id='ul-container'>
        {data.map((item) => (
          <li key={item._id} id='li-container'>
            <div className="item-container" id='container'>
            <div className='image-container'>
              {item._id && <img src={`${SERVER_URL}/${item.image}`} alt="Resim" />}
              {!item._id && <p>Resim bulunamadı.</p>}
            </div>


              <div className='item-details'>
                <p>{item.name}</p>
                <p>Weight: {item.weight}</p>
                <p>Stature: {item.stature}</p>
                <p>Goal: {item.goal}</p>
                <button onClick={() => handleDelete(item._id)}>SİL</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
