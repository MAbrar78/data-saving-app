import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { FaEyeSlash, FaEye, FaDownload, FaFilePdf, FaFileWord, FaFileExcel, FaFileAlt } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css'; // Import your custom CSS file

const Home = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    description: '',
    image: null,
    audio: null,
    video: null,
    document: null,
    generalFile: null,
    link: '',
  });
  const [filePreviews, setFilePreviews] = useState({
    image: '',
    audio: '',
    video: '',
    document: '',
    generalFile: '',
  });
  const [fileNames, setFileNames] = useState({
    image: '',
    audio: '',
    video: '',
    document: '',
    generalFile: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [editDataId, setEditDataId] = useState(null);
  const [tablePasswordVisibility, setTablePasswordVisibility] = useState({});
  const [modalPasswordVisibility, setModalPasswordVisibility] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setFormData(prevData => ({ ...prevData, [name]: file }));
      setFilePreviews(prevPreviews => ({ ...prevPreviews, [name]: url }));
      setFileNames(prevNames => ({ ...prevNames, [name]: file.name }));
    }
  };

  const handleAddOrUpdateData = async () => {
    const { username, password, description, image, audio, video, document, generalFile, link } = formData;
    const dataToSend = new FormData();
    dataToSend.append('username', username);
    dataToSend.append('password', password);
    dataToSend.append('description', description);

    // Conditionally append files
    if (image && typeof image === 'object') dataToSend.append('image', image);
    if (audio && typeof audio === 'object') dataToSend.append('audio', audio);
    if (video && typeof video === 'object') dataToSend.append('video', video);
    if (document && typeof document === 'object') dataToSend.append('document', document);
    if (generalFile && typeof generalFile === 'object') dataToSend.append('generalFile', generalFile);

    dataToSend.append('link', link);

    try {
      if (editDataId) {
        await axios.put(`http://localhost:5000/data/${editDataId}`, dataToSend);
        toast.success('Data updated successfully');
      } else {
        await axios.post('http://localhost:5000/data', dataToSend);
        toast.success('Data added successfully');
      }
      fetchData();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Error saving data');
    }
  };

  const handleShowModal = (data) => {
    if (data) {
      setFormData({
        username: data.username,
        password: data.password,
        description: data.description,
        image: null,
        audio: null,
        video: null,
        document: null,
        generalFile: null,
        link: data.link,
      });
      setFilePreviews({
        image: data.image ? `http://localhost:5000${data.image}` : '',
        audio: data.audio ? `http://localhost:5000${data.audio}` : '',
        video: data.video ? `http://localhost:5000${data.video}` : '',
        document: data.document ? `http://localhost:5000${data.document}` : '',
        generalFile: data.generalFile ? `http://localhost:5000${data.generalFile}` : '',
      });
      setFileNames({
        image: data.imageName || '',
        audio: data.audioName || '',
        video: data.videoName || '',
        document: data.documentName || '',
        generalFile: data.generalFileName || '',
      });
      setEditDataId(data._id);
      setModalPasswordVisibility(false); // Reset modal password visibility state
    } else {
      setFormData({
        username: '',
        password: '',
        description: '',
        image: null,
        audio: null,
        video: null,
        document: null,
        generalFile: null,
        link: '',
      });
      setFilePreviews({
        image: '',
        audio: '',
        video: '',
        document: '',
        generalFile: '',
      });
      setFileNames({
        image: '',
        audio: '',
        video: '',
        document: '',
        generalFile: '',
      });
      setEditDataId(null);
      setModalPasswordVisibility(false); // Reset modal password visibility state
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleDeleteData = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/data/${id}`);
      toast.success('Data deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Error deleting data');
    }
  };

  const toggleTablePasswordVisibility = (id) => {
    setTablePasswordVisibility(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const toggleModalPasswordVisibility = () => {
    setModalPasswordVisibility(prevState => !prevState);
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return null;
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf />;
      case 'doc':
      case 'docx':
        return <FaFileWord />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel />;
      default:
        return <FaFileAlt />;
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <Button variant="primary" onClick={() => handleShowModal(null)}>Add Data</Button>
      <Table striped bordered hover className="custom-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Description</th>
            <th>Image</th>
            <th>Audio</th>
            <th>Video</th>
            <th>Document</th>
            <th>General File</th>
            <th>Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.username}</td>
              <td>
                <div className="password-container">
                  {tablePasswordVisibility[item._id] ? item.password : '••••••••'}
                  <Button variant="link" onClick={() => toggleTablePasswordVisibility(item._id)}>
                    {tablePasswordVisibility[item._id] ? <FaEye /> : <FaEyeSlash />}
                  </Button>
                </div>
              </td>
              <td>{item.description}</td>
              <td>
                {item.image && (
                  <img 
                    src={`http://localhost:5000${item.image}`} 
                    alt="Uploaded content" 
                    className="image-preview" 
                  />
                )}
              </td>
              <td>
                {item.audio && (
                  <div className="file-container">
                    <audio controls src={`http://localhost:5000${item.audio}`} className="file-preview" />
                    <a href={`http://localhost:5000${item.audio}`} download>
                      <FaDownload /> {item.audioName}
                    </a>
                  </div>
                )}
              </td>
              <td>
                {item.video && (
                  <div className="file-container">
                    <video controls src={`http://localhost:5000${item.video}`} className="file-preview" />
                    <a href={`http://localhost:5000${item.video}`} download>
                      <FaDownload /> {item.videoName}
                    </a>
                  </div>
                )}
              </td>
              <td>
                {item.document && (
                  <div className="file-container">
                    {getFileIcon(item.documentName)}
                    <a href={`http://localhost:5000${item.document}`} download className="download-link">
                      <FaDownload /> {item.documentName}
                    </a>
                  </div>
                )}
              </td>
              <td>
                {item.generalFile && (
                  <div className="file-container">
                    {getFileIcon(item.generalFileName)}
                    <a href={`http://localhost:5000${item.generalFile}`} download className="download-link">
                      <FaDownload /> {item.generalFileName}
                    </a>
                  </div>
                )}
              </td>
              <td>
                {item.link && (
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="link-preview">
                    {item.link}
                  </a>
                )}
              </td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleShowModal(item)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteData(item._id)} className="ml-2">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editDataId ? 'Edit Data' : 'Add Data'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <div className="password-container">
                <Form.Control
                  type={modalPasswordVisibility ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                />
                <Button variant="link" onClick={toggleModalPasswordVisibility}>
                  {modalPasswordVisibility ? <FaEye /> : <FaEyeSlash />}
                </Button>
              </div>
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter description"
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleFileUpload} />
              {filePreviews.image && (
                <img
                  src={filePreviews.image}
                  alt="Selected"
                  className="image-preview mt-2"
                />
              )}
            </Form.Group>
            <Form.Group controlId="formAudio">
              <Form.Label>Audio</Form.Label>
              <Form.Control type="file" name="audio" onChange={handleFileUpload} />
              {filePreviews.audio && (
                <div className="file-container mt-2">
                  <audio controls src={filePreviews.audio} className="file-preview" />
                  <span>{fileNames.audio}</span>
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="formVideo">
              <Form.Label>Video</Form.Label>
              <Form.Control type="file" name="video" onChange={handleFileUpload} />
              {filePreviews.video && (
                <div className="file-container mt-2">
                  <video controls src={filePreviews.video} className="file-preview" />
                  <span>{fileNames.video}</span>
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="formDocument">
              <Form.Label>Document</Form.Label>
              <Form.Control type="file" name="document" onChange={handleFileUpload} />
              {filePreviews.document && (
                <div className="file-container mt-2">
                  {getFileIcon(fileNames.document)}
                  <span>{fileNames.document}</span>
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="formGeneralFile">
              <Form.Label>General File</Form.Label>
              <Form.Control type="file" name="generalFile" onChange={handleFileUpload} />
              {filePreviews.generalFile && (
                <div className="file-container mt-2">
                  {getFileIcon(fileNames.generalFile)}
                  <span>{fileNames.generalFile}</span>
                </div>
              )}
            </Form.Group>
            <Form.Group controlId="formLink">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="text"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                placeholder="Enter link"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddOrUpdateData}>
            {editDataId ? 'Update Data' : 'Add Data'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Home;
