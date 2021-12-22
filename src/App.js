import React, { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Button, ButtonGroup, Col, Container, Form, Navbar, Row, Table } from 'react-bootstrap';



function App() {
  const api = "http://127.0.0.1:8088/api/users";

  const initialState = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: ''
  };
  useEffect(() => {
    loadUsers();
  }, []);

  const [state, setState] = useState(initialState);

  const { first_name, last_name, email, phone, password } = state;

  const [data, setData] = useState([]);

  const [userId, setUserId] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const loadUsers = async () => {
    const response = await axios.get(api);
    setData(response.data)
  };

  const handleUpdate = (id) => {
    const singleUser = data.find((dt)=>dt.id === id);
    setState({...singleUser});
    setUserId(id);
    setEditMode(true);
  } 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!first_name || !last_name || !email || !phone) {
      toast.error("fill all")
    } else {
      if (!editMode) {
      axios.post(api, state);
      toast.success("Success");
      setState({ first_name: "", last_name: "", email: "", phone: "" });
      setTimeout(() => loadUsers(), 100);
      } else {
        axios.put(`${api}/${userId}`, state);
        toast.success("Updated successfully");
        setState({ first_name, last_name, email, phone});
      }
    }
    setTimeout(() => loadUsers(), 100);
  }

  const handleChange = (e) => {
    let { name, value } = e.target;
    setState({ ...state, [name]: value });
  }

  const handleDelete = async (id) => {
    if (window.confirm("Delete-?")) {
      toast.success("Deleted")
      axios.delete(`${api}/${id}`)
      setTimeout(() => loadUsers(), 100);
    }
  }

 
  

  console.log(state);
  return (
    <>
      <ToastContainer />
      <Navbar bg="success" variant='dark' className='justify-content-center'>
        <Navbar.Brand>
          Build a CRUD application
        </Navbar.Brand>
      </Navbar>
      <Container style={{ marginTop: '50px' }}>
        <Row>
          <Col md={4}>
            <Form onClick={handleSubmit}>
              <Form.Group>
                <Form.Label style={{ textAlign: 'left' }}>Password</Form.Label>
                <Form.Control type="text" placeholder='Enter Name' name='password' value={password} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ textAlign: 'left' }}>Name</Form.Label>
                <Form.Control type="text" placeholder='Enter Name' name='first_name' value={first_name} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ textAlign: 'left' }}>Last Name</Form.Label>
                <Form.Control type="text" placeholder='Enter Last Name' name='last_name' value={last_name} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ textAlign: 'left' }}>Email</Form.Label>
                <Form.Control type="text" placeholder='Enter email' name='email' value={email} onChange={handleChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ textAlign: 'left' }}>Phone</Form.Label>
                <Form.Control type="text" placeholder='Enter Phone' name='phone' value={phone} onChange={handleChange} />
              </Form.Group>
              <div className='d-grid gap-2 mt-2'>
                <Button type="submit" variant='primary' size='lg'>
                  {editMode ? "Update" : "Submit"}
                </Button>
              </div>
            </Form>
          </Col>
          <Col md={8}>
            <Table bordered hover>
              <thead>
                <tr>
                  {/* <th>№</th> */}
                  <th>Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              {data && data.map((dt) => (
                <tbody key={dt.id}>
                  <tr>
                    {/* <td>{dt.id}</td> */}
                    <td>{dt.first_name}</td>
                    <td>{dt.last_name}</td>
                    <td>{dt.email}</td>
                    <td>{dt.phone}</td>
                    <td>  <ButtonGroup>
                      <Button style={{ marginRight: '5px' }} variant='warning' onClick={()=>handleUpdate(dt.id)}>
                        Update
                      </Button>
                      <Button style={{ marginRight: '5px' }} variant='danger' onClick={() => handleDelete(dt.id)}>
                        Delete
                      </Button>
                    </ButtonGroup>
                    </td>
                  </tr>
                </tbody>
              ))}
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
