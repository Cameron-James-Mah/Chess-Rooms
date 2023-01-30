import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import {Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useMediaQuery, TextField, Menu, MenuItem} from "@mui/material"
import { CssBaseline } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Axios from "axios"

const Menubar = ({setLoggedUser, setLoggedDisplay}) =>{
    const [open, setOpen] = useState(false)//MUI display component state
    //Textbox fields
    const [user, setUser] = useState("")
    const [pass, setPass] = useState("")
    const [displayName, setDisplayName] = useState("")

    const [registerErr, setRegisterErr] = useState(false) //Track whether user attempted to register with valid username
    const [userLbl, setUserLbl] = useState("Username")
    const [anchorEl, setAnchorEl] = useState(null);
    const loggedIn = useRef(false)
    const loggedUser = useRef("")
    

    const [action, setAction] = useState("Login") //Tracks if the user is trying to login or register

    /*Menubar actions*/
    function handleClose(){
        setOpen(false);
        setRegisterErr(false)
        setUserLbl("Username")
    }

    function handleLogin(){//Update the action selected on the menubar
      setAction("Login")
      setOpen(true);
    };
    function handleRegister(){//Update the action selected on the menubar
      setAction("Register")
      setOpen(true);
    };

    function handleUser(){//Helper function to choose to attempt login/creation of user with textfield values
        if(action == "Login"){
          loginUser()
        }
        else if(action == "Register"){
          createUser()
        }
        else{
          console.log("no action error")
        } 
    }

    function profileMenuClose(){
      setAnchorEl(null);
    }

    function profileMenuOpen(e){
      setAnchorEl(e.currentTarget);
    }

    /*Text for MUI Display*/
    function userText(e){
      setUser(e.target.value)
    }

    function passText(e){
      setPass(e.target.value)
    }

    function displayNameText(e){
      setDisplayName(e.target.value)
    }


    function logOut(){
      loggedUser.current = ""
      loggedIn.current = false
      setLoggedUser("")
      setLoggedDisplay("")
      profileMenuClose()
    }

    const createUser = () =>{
      Axios.post(`${process.env.REACT_APP_SERVER_URL}/createUser`, //Change this later to be url for render server
      {
        Username: user,
        Password: pass,
        DisplayName: displayName
      }).then((response)=>{ 
        //console.log(response)
        if(!response.data){//Response.data contains the new account info if valid, and NULL if not
          setRegisterErr(true)
          setUserLbl("Username not available")
        }
        else{
          handleClose()
        }
      }) 
    }
    const loginUser = () =>{
      Axios.post(`${process.env.REACT_APP_SERVER_URL}/loginUser`, //Change this later to be url for render server
      {
        Username: user,
        Password: pass,
      }).then((response)=>{
        //console.log(response)
        if(response.data){
          loggedUser.current = user
          loggedIn.current = true
          handleClose()
          setLoggedUser(user)
          setLoggedDisplay(response.data.DisplayName)
          
        }
        else{
          setRegisterErr(true)
          setUserLbl("Incorrect login info")
        }
      })
    }

    useEffect(()=>{
      //console.log(loggedIn.current)
      
    }, [])

    if(!loggedIn.current){
        return (
        <>
        <CssBaseline/>
      <AppBar position="static">
        <Toolbar>
            <Box display='flex' flexGrow={1}>
            {/* left side */}
            </Box>
          <Button color="inherit" onClick={handleLogin}>Login</Button>
          <Button color="inherit" onClick={handleRegister}>Register</Button>
        </Toolbar>
      </AppBar>
      <Dialog
        open={open}
      >
        <DialogTitle id="responsive-dialog-title" textAlign={"center"}>
            Welcome
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography>NOTE: users must be logged in to save games</Typography> 
          </DialogContentText>
          <DialogContentText>
            <TextField label="Display Name" variant="filled" onChange={displayNameText} disabled = {action == "Login"}/>
          </DialogContentText>
          <DialogContentText>
            <TextField label={userLbl} variant="filled" style={{marginTop: 12}} onChange={userText} error = {registerErr}/>
          </DialogContentText>
          <DialogContentText>
            <TextField label="Password" variant="filled" style={{marginTop: 12}} onChange={passText}/>
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{justifyContent: "center"}}>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button autoFocus onClick={handleUser}>
            {action}
          </Button>
          
        </DialogActions>
      </Dialog>
    </>
  );
  }
  else{
    return (
        <>
        <CssBaseline/>
      <AppBar position="static">
        <Toolbar>
            <Box display='flex' flexGrow={1}>
            {/* left side */}
            </Box>
            <div>
          <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={profileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={profileMenuClose}
              >
                <MenuItem component = {Link} to = "/Profile" onClick={profileMenuClose}>Profile</MenuItem>
                <MenuItem onClick={logOut}>Log out</MenuItem>
              </Menu>
              </div>
        </Toolbar>
      </AppBar>
    </>
  );
  }
    
}

export default Menubar;