import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Container, Header, Segment, Grid, Image, Modal, TextArea, Divider, Button } from 'semantic-ui-react';
import { Form, FormField, FormInput, Dropdown } from 'semantic-ui-react';

const PortfolioPage = () => {
    const [projects, setProjects] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [technology, setTechnology] = useState('');
    const [backendFeatures, setBackendFeatures] = useState('');
    const [frontendFeatures, setFrontendFeatures] = useState('');
    const [id, setId] = useState('');

    const [user, setUser] = useState('');
    const [username, setUsername] = useState('');
    const [token, setToken] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);

    const [selectedProject, setSelectedProject] = useState(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);
        formData.append('technology', technology);
        formData.append('backend_features', backendFeatures);
        formData.append('frontend_features', frontendFeatures);

        axios.post(`${process.env.REACT_APP_API_URL}/api/portfolio/create`, formData, {
            withCredentials: true,
            headers: {
                "X-CSRFToken": token,
                "Content-Type": "multipart/form-data",
            }
        }).then((response) => {
            console.log(response);
            window.location.reload();
        }).catch((error) => {
            console.error("error:", error);
        })
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    const handleTechnologyChange = (e) => {
        setTechnology(e.target.value);
    }

    const handleBackendFeaturesChange = (e) => {
        setBackendFeatures(e.target.value);
    }

    const handleFrontendFeaturesChange = (e) => {
        setFrontendFeatures(e.target.value);
    }

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        setId(project.id);
        setTitle(project.title);
        setDescription(project.description);
        setImage(project.image);
        setTechnology(project.technology);
        setBackendFeatures(project.backend_features);
        setFrontendFeatures(project.frontend_features);
    }

    const handleEditFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }
        formData.append('technology', technology);
        formData.append('backend_features', backendFeatures);
        formData.append('frontend_features', frontendFeatures);

        console.log('id:', id, 'formData:', formData.get('title'), 'token:', token)
    
        axios.put(`${process.env.REACT_APP_API_URL}/api/portfolio/update/${id}`, formData, {
            withCredentials: true,
            headers: {
                "X-CSRFToken": token,
                "Content-Type": "multipart/form-data",
            }
        }).then((response) => {
            console.log(response);
            window.location.reload();
        }).catch((error) => {
            console.error("error:", error);
        })
    }

    const handleDeleteProject = (e) => {
        e.preventDefault();
        axios.delete(`${process.env.REACT_APP_API_URL}/api/portfolio/delete/${projectToDelete.id}`, {
            withCredentials: true,
            headers: {
                "X-CSRFToken": token,
                "Content-Type": "application/json",
            }
        }).then((response) => {
            console.log(response);
            window.location.reload();
        }).catch((error) => {
            console.error("error:", error);
        });
    }

    useEffect(() => {
        const token = Cookies.get('csrftoken');
        setToken(token);
        const user = localStorage.getItem('userId');
        setUser(user);
        const username = localStorage.getItem('username');
        setUsername(username);
        console.log('user:', user, 'username:', username);
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/portfolio/`)
        .then((response) => response.json())
        .then((data) => setProjects(data))
    }, []);

    return (
        <Container>
            {username === "\"admin\"" ? (
                <>
                <Dropdown text='Manage Projects'>
                    <Dropdown.Menu>
                        <Dropdown.Item text='Add Project' onClick={() => setShowAddModal(true)} />
                        <Dropdown.Item text='Edit Project' onClick={() => setShowEditModal(true)} />
                    </Dropdown.Menu>
                </Dropdown>
                
                <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
                    <Modal.Header>Add Project</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={handleFormSubmit}>
                            <FormField>
                                <FormInput
                                    label='Title'
                                    type='text'
                                    value={title}
                                    onChange={handleTitleChange}
                                />
                            </FormField>
                            <FormField>
                                <FormInput
                                    label='Description'
                                    type='text'
                                    control={TextArea}
                                    value={description}
                                    onChange={handleDescriptionChange}
                                />
                            </FormField>
                            <FormField>
                                <FormInput
                                    label='Image'
                                    type='file'
                                    onChange={handleImageChange}
                                />
                            </FormField>
                            <FormField>
                                <FormInput
                                    label='Technology'
                                    type='text'
                                    value={technology}
                                    onChange={handleTechnologyChange}
                                />
                            </FormField>
                            <FormField>
                                <FormInput
                                    label='Backend Features'
                                    type='text'
                                    control={TextArea}
                                    value={backendFeatures}
                                    onChange={handleBackendFeaturesChange}
                                />
                            </FormField>
                            <FormField>
                                <FormInput
                                    label='Frontend Features'
                                    type='text'
                                    control={TextArea}
                                    value={frontendFeatures}
                                    onChange={handleFrontendFeaturesChange}
                                />
                            </FormField>
                            <Button type='submit'>Submit</Button>
                        </Form>
                    </Modal.Content>
                </Modal>

                <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
                    <Modal.Header>Edit Project</Modal.Header>
                    <Modal.Content>
                        <Dropdown text="Select Project">
                            <Dropdown.Menu>
                                {projects.map((project) => (
                                    <Dropdown.Item key={project.id} text={project.title} onClick={() => handleProjectSelect(project)} />
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>

                        {selectedProject && (
                            <Form onSubmit={handleEditFormSubmit}>
                                <FormField hidden>
                                    <FormInput
                                        label='ID'
                                        type='number'
                                        value={id}
                                        readOnly
                                    />
                                </FormField>
                                <FormField>
                                    <FormInput
                                        label='Title'
                                        type='text'
                                        value={title}
                                        onChange={handleTitleChange}
                                    />
                                </FormField>
                                <FormField>
                                    <FormInput
                                        label='Description'
                                        type='text'
                                        value={description}
                                        onChange={handleDescriptionChange}
                                    />
                                </FormField>
                                <FormField>
                                    <FormInput
                                        label='Image'
                                        type='file'
                                        onChange={handleImageChange}
                                    />
                                </FormField>
                                <FormField>
                                    <FormInput
                                        label='Technology'
                                        type='text'
                                        value={technology}
                                        onChange={handleTechnologyChange}
                                    />
                                </FormField>
                                <FormField>
                                    <FormInput
                                        label='Backend Features'
                                        type='text'
                                        control={TextArea}
                                        value={backendFeatures}
                                        onChange={handleBackendFeaturesChange}
                                    />
                                </FormField>
                                <FormField>
                                    <FormInput
                                        label='Frontend Features'
                                        type='text'
                                        control={TextArea}
                                        value={frontendFeatures}
                                        onChange={handleFrontendFeaturesChange}
                                    />
                                </FormField>
                                <Button type='submit'>Submit</Button>
                                <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
                                <Button type='button' onClick={() => { setShowDeleteModal(true); setProjectToDelete(selectedProject); }}>Delete</Button>
                            </Form>
                        )}
                    </Modal.Content>
                </Modal>

                <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                    <Modal.Header>Delete Project</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to delete the project {projectToDelete?.title}?</p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                        <Button onClick={handleDeleteProject}>Delete</Button>
                    </Modal.Actions>
                </Modal>

                </>
            ) : null}
            <Header as='h1' textAlign='center'>Portfolio</Header>
            <Segment>
                <Grid>
                    {projects.map((project) => (
                        <React.Fragment key={project.id}>
                            <Grid.Row>
                                <Grid.Column width={8} verticalAlign='middle' >
                                    <Image src={`${project.image}`}  />
                                </Grid.Column>
                                <Grid.Column width={8} verticalAlign='middle' >
                                    <Header as='h2'>{project.title}</Header>
                                    <p><strong>Description: </strong>{project.description}</p>
                                    <p><strong>Technologies: </strong><em>{project.technology}</em></p>
                                    <p><strong>Backend Features:</strong> {project.backend_features}</p>
                                    <p><strong>Frontend Features:</strong> {project.frontend_features}</p>
                                    {username === "\"admin\"" && (
                                        <>
                                            <Button onClick={() => { setShowEditModal(true); handleProjectSelect(project); }}>Edit</Button>
                                            <Button onClick={() => { setShowDeleteModal(true); setProjectToDelete(project); }}>Delete</Button>
                                        </>
                                    )}
                                </Grid.Column>
                            </Grid.Row>
                            {projects.length > 0 && <Divider />}
                        </React.Fragment>
                    ))}
                    {projects.length === 0 && <p>No projects</p>}
                </Grid>
            </Segment>
        </Container>
    );
}

export default PortfolioPage;
