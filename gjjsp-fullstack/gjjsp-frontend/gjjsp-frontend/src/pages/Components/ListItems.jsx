import * as React from 'react';
import * as MUI from '../../import'
import { Link } from 'react-router-dom';


export const SMP_ListItems = (
  <React.Fragment>
  <MUI.ListSubheader component="div" inset sx={{ paddingLeft: '12px', backgroundColor: '#fbf3f2' }}>
    Main
  </MUI.ListSubheader>
  <MUI.ListItemButton component={Link} to='/' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.DashboardIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Dashboard"  sx={{fontSize: '12px !important'}}/>
  </MUI.ListItemButton>
  <MUI.ListSubheader component="div" inset sx={{ paddingLeft: '12px', backgroundColor: '#fbf3f2', '@media (max-width: 600px)': { display: 'none'} }}>
    Management
  </MUI.ListSubheader>
  <MUI.ListItemButton component={Link} to='/scholar' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.PeopleIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Scholars" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/submission' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
    <MUI.AppRegistrationIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Submissions" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/notification' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.NotificationsIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Notifications" />
  </MUI.ListItemButton >
  <MUI.ListItemButton component={Link} to='/report' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.BarChartIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Reports" />
  </MUI.ListItemButton>
  <MUI.ListSubheader component="div" inset sx={{ paddingLeft: '12px', backgroundColor: '#fbf3f2' }}>
    Quick Actions
  </MUI.ListSubheader>
  <MUI.ListItemButton component={Link} to='/export' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.FileDownloadOutlinedIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Export Data" />
  </MUI.ListItemButton>

  <MUI.ListItemButton  component={Link} to='/create' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.AddBoxOutlinedIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Create" />
  </MUI.ListItemButton>

  <MUI.ListItemButton  component={Link} to='/ask' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
    <MUI.Box
      component="img"
      sx={{
        height: 40,
        width: 60,
        marginLeft: '-20px',
      }}
      alt="The house from the offer."
      src="https://raw.githubusercontent.com/TianMeds/image--stocks-for-coding/main/AI%20LOGO.png"
    />

    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Ask AI" />
  </MUI.ListItemButton>
</React.Fragment>
);



export const SAP_ListItems = (
  <React.Fragment>
  <MUI.ListSubheader component="div" inset sx={{ paddingLeft: '12px', backgroundColor: '#fbf3f2' }}>
    Main
  </MUI.ListSubheader>
  <MUI.ListItemButton component={Link} to='/' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon >
      <MUI.DashboardIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Dashboard"/>
  </MUI.ListItemButton>
  <MUI.ListSubheader component="div" inset sx={{ paddingLeft: '12px', backgroundColor: '#fbf3f2' }}>
    Management
  </MUI.ListSubheader>
  <MUI.ListItemButton component={Link} to='/user' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.PeopleIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Users" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/scholarship' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.SchoolIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Scholarships" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/school' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.LocationCityIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Schools" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/submission' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
    <MUI.AppRegistrationIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Submissions" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/notification' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.NotificationsIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Notifications" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/report' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.BarChartIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Reports" />
  </MUI.ListItemButton>
  <MUI.ListSubheader component="div" inset sx={{ paddingLeft: '12px', backgroundColor: '#fbf3f2' }}>
    Quick Actions
  </MUI.ListSubheader>
  <MUI.ListItemButton component={Link} to='/export' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.FileDownloadOutlinedIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Export Data" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/create' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.AddBoxOutlinedIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Create" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/ask' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
    <MUI.Box
      component="img"
      sx={{
        height: 40,
        width: 60,
        marginLeft: '-20px',
      }}
      alt="The house from the offer."
      src="https://raw.githubusercontent.com/TianMeds/image--stocks-for-coding/main/AI%20LOGO.png"
    />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Ask AI" />
  </MUI.ListItemButton>
</React.Fragment>
);



export const SP_ListItems = (
  <React.Fragment>
  <MUI.ListSubheader component="div" inset sx={{ paddingLeft: '12px', backgroundColor: '#fbf3f2', '@media (max-width: 600px)': { textAlign: 'center' } }}>
    Main
  </MUI.ListSubheader>
  <MUI.ListItemButton component={Link} to='/' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.DashboardIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Dashboard" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/profile' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.PersonIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Scholar Profile" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/submission' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
    <MUI.AppRegistrationIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Submissions" />
  </MUI.ListItemButton>
  <MUI.ListSubheader component="div" inset sx={{ paddingLeft: '12px', backgroundColor: '#fbf3f2', '@media (max-width: 600px)': { textAlign: 'center' } }}>
    Quick Actions
  </MUI.ListSubheader>
  <MUI.ListItemButton component={Link} to='/create' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
      <MUI.AddBoxOutlinedIcon />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Create" />
  </MUI.ListItemButton>
  <MUI.ListItemButton component={Link} to='/ask' sx={{ paddingLeft: '16px' }}>
    <MUI.ListItemIcon>
    <MUI.Box
      component="img"
      sx={{
        height: 40,
        width: 60,
        marginLeft: '-20px',
      }}
      alt="The house from the offer."
      src="https://raw.githubusercontent.com/TianMeds/image--stocks-for-coding/main/AI%20LOGO.png"
    />
    </MUI.ListItemIcon>
    <MUI.ListItemText secondary="Ask AI" />
  </MUI.ListItemButton>
</React.Fragment>
);

