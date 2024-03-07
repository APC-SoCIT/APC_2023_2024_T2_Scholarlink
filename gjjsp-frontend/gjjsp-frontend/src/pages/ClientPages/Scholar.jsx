import React, {useEffect, useState} from 'react'
import * as MUI from '../../import';
import Layout from '../../component/Layout/SidebarNavbar/Layout';
import theme from '../../context/theme';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SearchIconWrapperV2,StyledInputBaseV2 } from '../../component/Layout/SidebarNavbar/Styles';
import useScholarStore from '../../store/ScholarStore';
import useUserStore from '../../store/UserStore';
import useLoginStore from '../../store/LoginStore';
import { DevTool } from "@hookform/devtools";
import {useForm, Controller } from 'react-hook-form';
import axios from '../../api/axios';
import useAuthStore from '../../store/AuthStore';
import useAuth from '../../hooks/useAuth';

const FormValues = {
  'scholarship_categ_id': '',
  'project_partner_id': '',
  'scholar_status_id': '',
  'school_id': '',

}

const USER_REGEX = /^[A-Za-z.-]+(\s*[A-Za-z.-]+)*$/;
const EMAIL_REGEX =  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export default function Scholar({state}) {
  const form  = useForm();
  const { register, control, handleSubmit, formState, reset, watch, validate} = form
  const { errors } = formState;
  const navigate = useNavigate();
  
  //Zustand hooks 
  const {getAuthToken,alertOpen, setAlertOpen, errorOpen, setErrorOpen,alertMessage, setAlertMessage, errorMessage, setErrorMessage} = useAuthStore();

  const {scholars, scholar, setScholars,editScholar, setEditScholar, handleOpenScholar, handleCloseScholar, filteredScholar, setFilteredScholar, searchQuery,handleSearch, scholarshipCateg, setScholarshipCateg, projectPartner, setProjectPartner, school, setSchool, modalScholars, setModalScholars,
  handleOpenModalScholars, handleCloseModalScholars, deleteModal, setDeleteModal, restoreModal, setRestoreModal, scholarIdToRestore, setScholarIdToRestore,
 scholarIdToDelete, setScholarIdToDelete
} = useScholarStore();

  const [scholarsData, setScholarsData] = useState([]);

  const { setLoading, setLoadingMessage} = useLoginStore();

  const {setAvatarInitial, users, setUsers, selectedUser, setSelectedUser} = useUserStore();

  const {auth} = useAuth();
  const role_id = auth?.user?.role_id || '';

  // Update Scholar Details Data
  const onSubmit = async  (data, event) => {
    event.preventDefault();
    const authToken = getAuthToken();

    const config = {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }

    try {
      if(editScholar){
        setAlertOpen(true);
        setAlertMessage('Updating Scholar...');
        setLoading(true);
        setLoadingMessage("Updating Scholar");

        let updatedData = {
          scholarship_categ_id: parseInt(data.scholarship_categ_id),
          project_partner_id: parseInt(data.project_partner_id),
          scholar_status_id: parseInt(data.scholar_status_id),
          school_id: parseInt(data.school_id)
        };
  
        if (data.school_id === 'other') {
          // If school_id is 'other', create a new school entry
          const response = await axios.post('/api/schools', {
            school_name: data.school_name, // Assuming you have a field for new school name in your form
            school_type: data.school_type, // Assuming you have a field for new school type in your form
            school_address: data.school_address // Assuming you have a field for new school address in your form
          }, config);
          
          // Set the school_id to the ID of the newly created school
          updatedData.school_id = parseInt(response.data.data.id);
        }
        else if (Array.isArray(data.school_id)) {
          // If school_id is an array, extract the first integer value
          updatedData.school_id = parseInt(data.school_id[0]);
        }

        const response = await axios.put(`/api/scholars-data/${selectedUser.id}`,  updatedData, config)
        handleCloseScholar();
        handleCloseModalScholars();
        setEditScholar(false);
        setSelectedUser(null);
        setLoading(false);
        setAlertOpen(true);
        setAlertMessage('Scholar Updated');

        const scholarResponse = await axios.get('/api/userScholars', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (scholarResponse.status === 200) {
          setScholarsData(scholarResponse.data.data);
          setAlertOpen(false);
          setAlertMessage("Updated Scholars List")
        } else {
          setErrorOpen(true);
          setErrorMessage("Error updating scholars list")
        }
        
      }
      form.reset(FormValues);
    }
    catch (error) {
      if (error.response.status === 401) {
        setErrorOpen(true);
        setErrorMessage("Session expired. Please login again.")
        navigate('/login')
      }
      else if (error.response.status === 422) {
        setErrorOpen(true);
        setErrorMessage("Please fill up all the required fields");
      }
    }

  };

  useEffect(() => {
    setAlertOpen(true);
    setErrorOpen(false);
    setAlertMessage('Please wait updating scholar list');

    const fetchScholarshipCategory = async () => {
      try {
        const authToken = useAuthStore.getState().getAuthToken();
        const response = await axios.get('/api/scholarships', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (response.status === 200) {
          setScholarshipCateg(response.data.data);
          setAlertOpen(false);
          setAlertMessage("Updated Scholarship Category")
        } else {
          setErrorOpen(true);
          setErrorMessage("Error updating scholarship category")
        }

        const projectPartnerResponse = await axios.get('/api/project-partners', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (projectPartnerResponse.status === 200) {
          setProjectPartner(projectPartnerResponse.data.data);
          setAlertOpen(false);
          setAlertMessage("Updated Project Partner")
        } else {
          setErrorOpen(true);
          setErrorMessage("Error updating project partner")
        }

        const schoolResponse = await axios.get('/api/schools', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (schoolResponse.status === 200) {
          setSchool(schoolResponse.data.data);
          setAlertOpen(false);
          setAlertMessage("Updated School")
        }
        else {
          setErrorOpen(true);
          setErrorMessage("Error updating school")
        }
        
      } catch (err) {
        if (err.response.status === 401 || err.projectPartnerResponse.status === 401 || err.schoolResponse.status === 401 ) {
          setErrorOpen(true);
          setErrorMessage("Session expired. Please login again.")
          navigate('/login')
        }
      }
    }

    fetchScholarshipCategory();
  }, []);

  //Fetch Scholar Details
  useEffect(() => {
    setAlertOpen(true);
    setErrorOpen(false);
    setAlertMessage('Please wait updating scholar list');
    
    const fetchScholarData = async () => {
      try {
        const authToken = useAuthStore.getState().getAuthToken();
        const response = await axios.get('/api/userScholars', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (response.status === 200) {
          setScholarsData(response.data.data); 
          setAlertOpen(false);
          setAlertMessage("Updated Scholars List")
        } else {
          setErrorOpen(true);
          setErrorMessage("Error updating scholars list")
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setErrorOpen(true);
          setErrorMessage("Session expired. Please login again.")
          navigate('/login')
        }
      }
    }

    fetchScholarData();
  }, []);

  const handleOpenDeleteModal = (id, first_name, last_name) => {
    setScholarIdToDelete(id);
    setSelectedUser({first_name, last_name});
    setDeleteModal(true);
  }

  const handleCloseDeleteModal = () => {
    setScholarIdToDelete(null);
    setDeleteModal(false);
  }

  // Delete Profile Scholar
  const deleteScholar = async (event) => {

    if(scholarIdToDelete) {
      try {
        const authToken = getAuthToken();
        setLoading(true);
        setLoadingMessage("Deleting user");
        setAlertOpen(true);
        setAlertMessage('Deleting user...');

        await axios.delete(`/api/userScholars/${scholarIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        const response = await axios.get('/api/userScholars', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });

        if (response.status === 200) {
          setScholarsData(response.data.data);
          setAlertOpen(true);
          setAlertMessage("Successfully deleted scholar")
        } else {
          setErrorOpen(true);
          setErrorMessage("Error deleting scholar")
        }

        setAlertOpen(true);
        setAlertMessage('User Deleted');
        setLoading(false);
      }
      catch (error) {
        if (error.response.status === 401) {
          setErrorOpen(true);
          setErrorMessage("Session expired. Please login again.")
          navigate('/login')
        }
        setLoading(false);
      }

    }
    handleCloseDeleteModal();
  };

  const updateScholar = (scholarId) => {
    const selectedUser = scholarsData.find((scholarData) => scholarData.id === scholarId);
    setEditScholar(true);
    setSelectedUser(selectedUser);
    handleOpenScholar();
    form.reset(selectedUser);
  }

  // View Profile Scholar 
  const viewScholarProfile = (scholarId) => {
    const selectedUser = scholarsData.find((scholarData) => scholarData.id === scholarId);

    if (selectedUser) {
      const {role_id, first_name, last_name} = selectedUser;

      setSelectedUser(selectedUser);
      setAvatarInitial(`${first_name.charAt(0).toUpperCase()}${last_name.charAt(0).toUpperCase()}`);
      
      const path = role_id === 3 ? '/scholar-profile' : '/*';
      navigate(path)
    }
    else{
      console.log('Scholar Not Found')
    }
   
  };

  const restoreScholar = async (scholarId) => {

    setLoading(true);
    setLoadingMessage("Restoring user");
    setAlertOpen(true);
    setAlertMessage('Restoring user...');
    try {
      const authToken = getAuthToken();
      const restoreResponse = await axios.get(`/api/restoreUser/${scholarId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (restoreResponse.status === 200) {
        setAlertOpen(true);
        setAlertMessage('User restored');
      } else {
        setErrorOpen(true);
        setErrorMessage('Failed to restore user');
      }

      const response = await axios.get('/api/userScholars', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response.status === 200) {
        setScholarsData(response.data.data);
        setAlertOpen(true);
        setAlertMessage('Scholar list has been updated');
      } else {
        setErrorOpen(true);
        setErrorMessage('Failed to fetch data');
      }

      setLoading(false);

    } catch (error) {
      if (error.response.status === 401) {
        setErrorOpen(true);
        setErrorMessage("Session expired. Please login again.")
        navigate('/login')
      }
      setLoading(false);
    }
  };

  const handleOpenRestoreModal = (userId) => {
    setScholarIdToRestore(userId);
    setRestoreModal(true);
  };

  const handleCloseRestoreModal = () => {
    setScholarIdToRestore(null);
    setRestoreModal(false);
  };


  const handleCancelScholar = () => {
    form.reset(FormValues);
    setEditScholar(false);
    handleCloseScholar();
  }

  const statusMapping = {
    "New": 1,
    "For Renewal": 2,
    "For Renewal: Graduating": 3,
    "Renewed": 4,
    "Graduating": 5,
    "Graduated": 6,
    "Alumni": 7,
    "Withdrew": 8,
  }

  const getStatusClassName = (statusId) => {
    switch (statusId) {
      case 1:
        return "New";
      case 2:
        return "For_Renewal";
      case 3:
        return "For_Renewal_Graduating";
      case 4:
        return "Renewed";
      case 5:
        return "Graduating";
      case 6:
        return "Graduated";
      case 7:
        return "Alumni";
      case 8:
        return "Withdrew";
      default:
        return "";
    }
  };
  
  return (
    <Layout>
    <MUI.ThemeProvider theme={theme}>
      <MUI.Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <MUI.Grid container spacing={3}>
          
          <MUI.Grid item xs={12} mb={4}>
            <MUI.Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{xs: 'left', md: 'center'}} margin={2} justifyContent="space-between">
              <MUI.Typography variant="h1" id="tabsTitle" sx={{color: 'black'}}>Scholars</MUI.Typography>
                        
              <MUI.Box>     
                

                
              <MUI.Button variant='contained' component={Link} to="/export"  id='addButton' sx={{mr: 4}}>
                <MUI.FileUploadOutlinedIcon sx={{mr: 1}}/>
                <MUI.Typography variant='body2'>Export Data</MUI.Typography>
              </MUI.Button>
              
              </MUI.Box>  

            </MUI.Box>
          </MUI.Grid>

          <MUI.Grid sx={{ borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', overflow: 'auto', overflowX: 'hidden',  width: '100%' }}>

          {/* Search Bar */}
          <MUI.Container sx={{mt: 4, mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Search>
              <SearchIconWrapperV2>
                <MUI.SearchIcon />
              </SearchIconWrapperV2>
              <StyledInputBaseV2
                placeholder="Search for names, groups, or email addresses"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={handleSearch} 
              />
            </Search>

          
            <MUI.FormControl>
              <MUI.Select
                value={filteredScholar}
                onChange={(e) => setFilteredScholar(e.target.value)}
                displayEmpty
                  inputProps={{ 'aria-label': 'Filter' }}
                  startAdornment={
                    <MUI.InputAdornment position="start">
                      <MUI.FilterListIcon
                        viewBox="0 0 24 24"
                        sx={{ width: 20, height: 20, color: 'rgba(0, 0, 0, 0.54)' }}
                      />
                    </MUI.InputAdornment>
                  }
                  sx={{ borderRadius: '12px' }}
              >
                <MUI.MenuItem value="All">All</MUI.MenuItem>
                <MUI.MenuItem value="New">New</MUI.MenuItem>
                <MUI.MenuItem value="For Renewal">For Renewal</MUI.MenuItem>
                <MUI.MenuItem value="For Renewal: Graduating">For Renewal: Graduating</MUI.MenuItem>
                <MUI.MenuItem value="Renewed">Renewed</MUI.MenuItem>
                <MUI.MenuItem value="Graduating">Graduating</MUI.MenuItem>
                <MUI.MenuItem value="Graduated">Graduated</MUI.MenuItem>
                <MUI.MenuItem value="Alumni">Alumni</MUI.MenuItem>
                <MUI.MenuItem value="Withdrew">Withdrew</MUI.MenuItem>
              </MUI.Select>
            </MUI.FormControl>

        
          </MUI.Container>

          {/* -------- Table Section  ----------*/}
          <MUI.TableContainer sx={{ backgroundColor: '#fbf3f2', margin: '2rem 0 0 1rem' }}>
            <MUI.Table> 
              <MUI.TableHead>
                <MUI.TableRow>
                  <MUI.TableCell sx={{fontWeight: 'bold', fontSize: '1rem'}}>Name</MUI.TableCell>
                  <MUI.TableCell sx={{fontWeight: 'bold', fontSize: '1rem'}}>Email</MUI.TableCell>
                  <MUI.TableCell sx={{fontWeight: 'bold', fontSize: '1rem'}}>Scholarship Category</MUI.TableCell>
                  <MUI.TableCell sx={{fontWeight: 'bold', fontSize: '1rem'}}>Scholar Status</MUI.TableCell>
                  <MUI.TableCell sx={{fontWeight: 'bold', fontSize: '1rem'}}>Action</MUI.TableCell>
                </MUI.TableRow>
              </MUI.TableHead>
                <MUI.TableBody>
                  {scholarsData
                    .filter((scholar) => {
                      return filteredScholar === 'All' ? true : (
                        scholar.scholar_status_id[0] === (statusMapping && statusMapping[filteredScholar] || null)
                      );
                    })
                    .filter((scholar) => 
                      (scholar.email_address && scholar.email_address.toLowerCase().includes(searchQuery?.toLowerCase())) ||
                      ((`${scholar.first_name} ${scholar.middle_name} ${scholar.last_name}`).toLowerCase().includes(searchQuery?.toLowerCase()))
                    )
                    .map((scholar, index) => (
                      (scholar.role_id === 3) ? (
                    <MUI.TableRow key={index} className='scholar'>
                      <MUI.TableCell sx={{border: 'none'}} className='scholarName'>
                        {`${scholar.first_name} ${scholar.middle_name || ""} ${scholar.last_name}`}
                      </MUI.TableCell>
                      <MUI.TableCell sx={{border: 'none'}} className='scholarEmail'>
                        {scholar.email_address}
                      </MUI.TableCell>
                      <MUI.TableCell sx={{border: 'none'}} className='scholarCatergory'>
                        {scholar.scholarship_categ_id.map(id => (
                          <div key={id}>
                            {scholarshipCateg.find(category => category.id === id)?.scholarship_categ_name || 'Unknown Category'}
                          </div>
                        ))}
                      </MUI.TableCell>

                      <MUI.TableCell sx={{ border: 'none' }}>
                      <span className={`scholarStatus ${getStatusClassName(scholar.scholar_status_id[0])}`}>
                        {scholar.scholar_status_id[0] === 1
                          ? "New"
                          : scholar.scholar_status_id[0] === 2
                          ? "For Renewal"
                          : scholar.scholar_status_id[0] === 3
                          ? "For Renewal: Graduating"
                          : scholar.scholar_status_id[0] === 4
                          ? "Renewed"
                          : scholar.scholar_status_id[0] === 5
                          ? "Graduating"
                          : scholar.scholar_status_id[0] === 6
                          ? "Graduated"
                          : scholar.scholar_status_id[0] === 7
                          ? "Alumni"
                          : scholar.scholar_status_id[0] === 8
                          ? "Withdrew"
                          : ""}
                      </span>
                      </MUI.TableCell>
                      
                      <MUI.TableCell sx={{border: 'none', color: '#2684ff' }}>
                        
                        <MUI.IconButton
                          color="inherit"
                          onClick={() => viewScholarProfile(scholar.id)}
                        >
                          <MUI.TableChartIcon sx={{transform: 'rotate(90deg)'}}/>

                        </MUI.IconButton>

                        <MUI.IconButton
                          color="inherit"
                          onClick={() => updateScholar(scholar.id)}
                        >
                          <MUI.BorderColorIcon />

                        </MUI.IconButton>

                        {scholar.deleted_at !== null && role_id === 1 ? (
                        <MUI.IconButton
                          variant='contained'
                          sx={{
                            borderRadius: '10px',
                            borderColor: 'primary.main',
                            textTransform: 'capitalize',
                          }}
                          onClick={() => handleOpenRestoreModal(scholar.id)}
                        >
                          <MUI.RestoreIcon />
                        </MUI.IconButton>
                      ) : (
                        <MUI.IconButton
                          type='button'
                          color="error"
                          onClick={(event) => handleOpenDeleteModal(scholar.id, scholar.first_name, scholar.last_name)} // Open delete confirmation modal
                          sx={{ textTransform: 'capitalize' }}
                        >
                          <MUI.DeleteIcon />
                        </MUI.IconButton>
                      )}
                      </MUI.TableCell>
                    </MUI.TableRow>
                      ) : null
                  ))}
                </MUI.TableBody>
            </MUI.Table>
            <MUI.Divider sx={{width:'100%'}}/>
          </MUI.TableContainer>   

          </MUI.Grid>

          {/* ------------------ Dialog Box of the  Scholars ---------------*/ }

           {/* Add Scholar Dialog */}
           <MUI.Dialog open={scholar} onClose={handleCloseScholar} fullWidth maxWidth="xs" component='form' onSubmit={handleSubmit(onSubmit)} method="post" noValidate>
                <MUI.DialogTitle variant='h3' sx={{fontWeight: 'bold'}}>Update Scholar</MUI.DialogTitle>
                <MUI.Typography variant='body2' id="dialogLabel">Required fields are marked with an asterisk *</MUI.Typography>
                <MUI.DialogContent>
                
            
                <MUI.Grid id="scholarshipCategGrid">
                  <MUI.InputLabel htmlFor="scholarship_categ_id" id="scholarshipCategLabel">Scholarship Type</MUI.InputLabel>
                  <Controller
                    name="scholarship_categ_id"
                    control={control}
                    defaultValue={scholarshipCateg.id} // Ensure it's a scalar value
                    rules={{
                      required: 'Scholarship Type is required',
                      validate: (value) => value !== '' || 'Please select a scholarship type'
                    }}
                    render={({ field }) => (
                      <MUI.FormControl sx={{ width: '100%', borderRadius: '8px' }}>
                        <MUI.Select
                          id='scholarship_categ_id' // Unique ID for this component
                          native
                          {...field}
                          value={field.value || ''}
                        >
                          <option value="" disabled>Select Scholarship Category</option>
                          {scholarshipCateg.map((category) => (
                            <option key={category.id} value={category.id}>{category.scholarship_categ_name}</option>
                          ))}
                        </MUI.Select>
                      </MUI.FormControl>
                    )}
                  />

                  {errors.scholarship_categ_id && (
                    <p id='errMsg'>
                      <MUI.InfoIcon className='infoErr'/>
                      {errors.scholarship_categ_id?.message}
                    </p>
                  )}
                </MUI.Grid>

                <MUI.Grid id="projectPartnerGrid">
                    <MUI.InputLabel htmlFor="project_partner_id" id="projectPartnerLabel">Project Partner</MUI.InputLabel>
                    <Controller
                      name="project_partner_id"
                      control={control}
                      defaultValue={null}
                      rules={{ 
                        required: 'Status is required', 
                        validate: (value) => value !== '' || 'Please select a status' 
                      }}
                      render={({ field }) => (
                        
                        <MUI.FormControl sx={{ width: '100%', borderRadius: '8px' }}>
                        <MUI.Select
                          id='project_partner_id' // Unique ID for this component
                          native
                          {...field}
                        >
                          <option value="" disabled>Select Project Partner</option>
                          {projectPartner.map((partner) => (
                            <option key={partner.id} value={partner.id}>{partner.project_partner_name}</option>
                          ))}
                        </MUI.Select>
                        </MUI.FormControl>
                      )}
                    />

                    {errors.project_partner_id && (
                      <p id='errMsg'>
                        <MUI.InfoIcon className='infoErr'/>
                        {errors.project_partner_id?.message}
                      </p>
                    )}
                </MUI.Grid>
                
                <MUI.Grid id="schoolGrid">
                  <MUI.InputLabel htmlFor="school_id" id="schoolLabel">School</MUI.InputLabel>
                  <Controller
                    name="school_id"
                    control={control}
                    defaultValue={null}
                    rules={{
                      required: "School is required",
                      validate: (value) => value !== '' || 'Please select a school'
                    }}
                    render={({ field }) =>  (
                      <MUI.FormControl sx={{  width: '100%', borderRadius: '8px' }}>
                        <MUI.Select
                          native
                          {...field}
                          id='school_id'
                          sx={{ mb: 2 }}
                        >
                          <option value="" disabled>Select School</option>
                          {school.map((schoolItem) => (
                            <option key={schoolItem.id} value={schoolItem.id}>{schoolItem.school_name}</option>
                          ))}
                          <option value="other">Other</option>
                        </MUI.Select>
                      </MUI.FormControl>
                    )}
                  />
                  {errors.school_id && (
                    <p id='errMsg'> <MUI.InfoIcon className='infoErr'/>{errors.school_id?.message}</p>
                  )}
                </MUI.Grid>

                {watch('school_id') === 'other' && (
                  <>
                  <MUI.Grid id="addSchoolGrid">
                    <MUI.InputLabel htmlFor="school_name" id="addSchoolLabel">Add School</MUI.InputLabel>
                    <MUI.TextField
                      id="school_name"
                      type="text"
                      {...register('school_name', {
                        required: 'School is required',
                      })}
                      sx={{ width: '100%', borderRadius: '8px', mb: 2 }}
                    />
                    {errors.school_name && (
                      <p id='errMsg'> <MUI.InfoIcon className='infoErr'/>{errors.school_name?.message}</p>
                    )}
                  </MUI.Grid>

                   <MUI.Grid id="schoolTypeGrid">
                  <MUI.InputLabel htmlFor="school_type" id="schoolTypeLabel">School Type</MUI.InputLabel>
                    <Controller
                      name="school_type"
                      control={control}
                      defaultValue={null}
                      rules={{
                        required: "School Type is required",
                        validate: (value) => value !== '' || 'Please select a school type'
                      }}
                      render={({ field }) =>  (
                        <MUI.FormControl sx={{  width: '100%', borderRadius: '8px', mb: 2 }}>
                          <MUI.Select
                            native
                            {...field}
                            id='school_type'
                          >
                            <option value="" disabled>Select School Type</option>
                            <option value="Private">Private</option>
                            <option value="Public">Public</option>
                          </MUI.Select>
                        </MUI.FormControl>
                      )}
                    />
                    {errors.school_type && (
                      <p id='errMsg'> <MUI.InfoIcon className='infoErr'/>{errors.school_type?.message}</p>
                    )}
                </MUI.Grid>

                <MUI.Grid id="schoolAddressGrid">
                  <MUI.InputLabel htmlFor="school_address" id="schoolAddressLabel">School Address</MUI.InputLabel>
                  <MUI.TextField
                    id="school_address"
                    type="text"
                    {...register('school_address', {
                      required: 'School Address is required',
                    })}
                    sx={{ width: '100%', borderRadius: '8px', mb: 2 }}
                  />
                  {errors.school_address && (
                    <p id='errMsg'> <MUI.InfoIcon className='infoErr'/>{errors.school_address?.message}</p>
                  )}
                </MUI.Grid>
                
                </>
                )}                

                <MUI.Grid id="scholarStatusGrid">
                    <MUI.InputLabel htmlFor="scholar_status_id" id="scholarStatusLabel">Scholar Status</MUI.InputLabel>
                    <Controller
                      name='scholar_status_id'
                      control={control}
                      defaultValue={null}
                      rules={{
                        required: "Scholar Status is required",
                        validate: (value) => value !== '' || 'Please select a scholar status'
                      }}
                      render={({ field }) =>  (
                        <MUI.FormControl sx={{  width: '100%', borderRadius: '8px',}}>
                          <MUI.Select
                            id='scholar_status_id'
                            native
                            {...field}
                            sx={{mb: 2}}
                          >
                            <option value="" disabled>Select Scholar Status</option>
                            <option value="1">New Scholar</option>
                            <option value="2">For Renewal</option>
                            <option value="3">For Renewal: Graduating</option>
                            <option value="4">Renewed</option>
                            <option value="5">Graduating</option>
                            <option value="6">Graduated</option>
                            <option value="7">Alumni</option>
                            <option value="8">Withdrew</option>
                          </MUI.Select>
                        
                        </MUI.FormControl>
                      )}
                    />
                    {errors.scholar_status_id && (
                      <p id='errMsg'> <MUI.InfoIcon className='infoErr'/>{errors.scholar_status_id  ?.message}</p>
                    )}
                </MUI.Grid>

                    
                </MUI.DialogContent>

                  <MUI.DialogActions>
                    <MUI.Button onClick={handleCancelScholar} color="primary">
                      Cancel
                    </MUI.Button>
                    <MUI.Button 
                      variant='contained'
                      color="primary"
                      onClick={handleOpenModalScholars}
                    >
                
                      Save Changes
                    </MUI.Button>
                  </MUI.DialogActions>

            </MUI.Dialog>

            {/* Modal for Update User */}
            <MUI.Dialog open={modalScholars} onClose={handleCloseModalScholars}>

              <MUI.DialogTitle id="dialogTitle" mt={2}>Heads Up!</MUI.DialogTitle>
              <MUI.DialogContent>
                <MUI.Typography variant='h5' ml={1} sx={{color: '#44546F'}}>
                  You're about to make some changes to a scholar's information. Everything look good?
                </MUI.Typography>
              </MUI.DialogContent>

              <MUI.DialogActions>
                <MUI.Button onClick={handleCloseModalScholars} color="primary">
                  Cancel
                </MUI.Button>
                <MUI.Button  
                  onClick={handleSubmit(onSubmit)} 
                  type='submit' 
                  color="primary" 
                  variant="contained" 
                  sx={{backgroundColor: '#0C66E4', borderRadius: '5px', mb: 2, mt: 2 }}
                  >
                  Save Changes
                </MUI.Button>
              </MUI.DialogActions>

            </MUI.Dialog>

            {/* Delete Modal */}
            <MUI.Dialog open={deleteModal} onClose={handleCloseDeleteModal}>

            <MUI.DialogTitle 
              id="dialogTitle" 
              mt={2}>
              <MUI.WarningIcon 
              sx={{
                color: '#CA3521', 
                fontSize: '1.2rem'}}
            /> 
              Deleting {selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : ''}
            </MUI.DialogTitle>

            <MUI.DialogContent>
              <MUI.Typography variant='h5' ml={1} sx={{color: '#44546F'}}>
                Heads up! This will permanently delete's <b>{selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name}` : ''}  </b> account. Are you sure you want to proceed?
              </MUI.Typography>
            </MUI.DialogContent>

            <MUI.DialogActions>
              <MUI.Button onClick={handleCloseDeleteModal} color="primary">
                Cancel
              </MUI.Button>
              <MUI.Button
                onClick={deleteScholar}
                color="primary"
                variant="contained"
                sx={{
                  backgroundColor: '#CA3521', 
                  borderRadius: '5px', 
                  mb: 2, 
                  mt: 2,
                  '&:hover': {
                    backgroundColor: '#CA3521', // Override hover color to stay red
                  }
                }}
              >
                Yes, Delete Scholar
              </MUI.Button>
            </MUI.DialogActions>

            </MUI.Dialog>

            {/* Restore Modal */}
            <MUI.Dialog open={restoreModal} onClose={handleCloseRestoreModal}>
            <MUI.DialogTitle id="dialogTitle" mt={2}>
              Heads Up!
            </MUI.DialogTitle>
            <MUI.DialogContent>
              <MUI.Typography variant='h5' ml={1} sx={{color: '#44546F'}}>
                You're about to restore a user's account. Are you sure you want to proceed?
              </MUI.Typography>
            </MUI.DialogContent>

            <MUI.DialogActions>
              <MUI.Button onClick={handleCloseRestoreModal} color="primary">
                Cancel
              </MUI.Button>
              <MUI.Button
                onClick={() => {
                  restoreScholar(scholarIdToRestore);
                  handleCloseRestoreModal();
                }}
                color="primary"
                variant="contained"
                sx={{
                  borderRadius: '5px',
                  mb: 2,
                  mt: 2,
                  backgroundColor: '#43a047',
                  '&:hover': {
                    backgroundColor: '#43a047', // Change color on hover
                  },
                }}
              >
                Yes, Restore User
              </MUI.Button>
            </MUI.DialogActions>

          </MUI.Dialog>
            
        </MUI.Grid>

        <MUI.Snackbar
            open={alertOpen}
            autoHideDuration={5000}
            onClose={() => setAlertOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MUI.MuiAlert onClose={() => setAlertOpen(false)} variant="filled" severity="success" sx={{ width: '100%' }}>
              {alertMessage}
            </MUI.MuiAlert>
          </MUI.Snackbar>

          <MUI.Snackbar
            open={errorOpen}
            autoHideDuration={5000}
            onClose={() => setErrorOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MUI.MuiAlert onClose={() => setErrorOpen(false)} variant='filled' severity='error' sx={{width: '100%'}}>
              {errorMessage}
            </MUI.MuiAlert>
          </MUI.Snackbar>


        <DevTool control={control} />
      </MUI.Container>
    </MUI.ThemeProvider>
  </Layout>
  )
}
