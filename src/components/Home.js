import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [newData, setNewData] = useState({
    username: '',
    password: '',
    image: null,
    audio: null,
    video: null,
    document: null,
    link: '',
  });
  const [editDataId, setEditDataId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/data');
      setData(response.data);
    } catch (error) {
      toast.error('Error fetching data: ' + error.message);
    }
  };

  const handleClose = () => {
    setShow(false);
    setNewData({
      username: '',
      password: '',
      image: null,
      audio: null,
      video: null,
      document: null,
      link: '',
    });
    setEditDataId(null);
  };

  const handleShow = (item) => {
    if (item) {
      setNewData({
        username: item.username,
        password: item.password,
        link: item.link,
        image: null,
        audio: null,
        video: null,
        document: null,
      });
      setEditDataId(item._id);
    }
    setShow(true);
  };

  const handleAddOrUpdateData = async () => {
    try {
      const formData = new FormData();
      formData.append('username', newData.username);
      formData.append('password', newData.password);
      formData.append('link', newData.link);
      if (newData.image) formData.append('image', newData.image);
      if (newData.audio) formData.append('audio', newData.audio);
      if (newData.video) formData.append('video', newData.video);
      if (newData.document) formData.append('document', newData.document);

      if (editDataId) {
        await axios.put(`http://localhost:5000/data/${editDataId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Data updated successfully!');
      } else {
        await axios.post('http://localhost:5000/data', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Data added successfully!');
      }

      fetchData();
      handleClose();
    } catch (error) {
      toast.error('Error saving data: ' + error.message);
    }
  };

  const handleDeleteData = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/data/${id}`);
      toast.success('Data deleted successfully!');
      fetchData();
    } catch (error) {
      toast.error('Error deleting data: ' + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Data Saving App</h1>
      <Button variant="primary" onClick={() => handleShow(null)}>
        Add Data
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Image</th>
            <th>Audio</th>
            <th>Video</th>
            <th>Document</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item._id}>
              <td>{item.username}</td>
              <td>
                {showPassword ? item.password : '●●●●●●●●'}
                <button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </td>
              <td>
                {item.image && (
                  <img src={item.image} alt="Uploaded" style={{ width: '100px', height: '100px' }} />
                )}
              </td>
              <td>
                {item.audio && (
                  <audio controls>
                    <source src={item.audio} />
                    Your browser does not support the audio tag.
                  </audio>
                )}
              </td>
              <td>
                {item.video && (
                  <video width="100" height="100" controls>
                    <source src={item.video} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </td>
              <td>
                {item.document && (
                  <a href={item.document} download>
                    Download Document
                  </a>
                )}
              </td>
              <td>
                <a href={item.link} target="_blank" rel="noopener noreferrer">Open Link</a>
              </td>
              <td>
                <Button variant="warning" onClick={() => handleShow(item)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteData(item._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editDataId ? 'Edit Data' : 'Add Data'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={newData.username}
                onChange={e => setNewData({ ...newData, username: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                value={newData.password}
                onChange={e => setNewData({ ...newData, password: e.target.value })}
              />
              <button onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={e => setNewData({ ...newData, image: e.target.files[0] })}
              />
            </Form.Group>
            <Form.Group controlId="audio">
              <Form.Label>Audio</Form.Label>
              <Form.Control
                type="file"
                onChange={e => setNewData({ ...newData, audio: e.target.files[0] })}
              />
            </Form.Group>
            <Form.Group controlId="video">
              <Form.Label>Video</Form.Label>
              <Form.Control
                type="file"
                onChange={e => setNewData({ ...newData, video: e.target.files[0] })}
              />
            </Form.Group>
            <Form.Group controlId="document">
              <Form.Label>Document</Form.Label>
              <Form.Control
                type="file"
                onChange={e => setNewData({ ...newData, document: e.target.files[0] })}
              />
            </Form.Group>
            <Form.Group controlId="link">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                value={newData.link}
                onChange={e => setNewData({ ...newData, link: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdateData}>
            {editDataId ? 'Update Data' : 'Add Data'}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Home;
