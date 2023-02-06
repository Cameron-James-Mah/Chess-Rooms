import { useState, useEffect } from "react";

import { Box, List, ListItem, ListItemText, Grid, Typography, Button, ListItemButton } from "@mui/material";

import Axios from "axios";

const Profile = ({user, displayName, rating}) =>{

    const [games, setGames] = useState([""])
    const [record, setRecord] = useState("")
    const [name, setName] = useState("")
    const [username, setUserName] = useState("")
    const [userRating, setUserRating] = useState(0)
    

    const getGames = () =>{
        Axios.post(`${process.env.REACT_APP_SERVER_URL}/getUserGames`,
      {
        Username: user,
      }).then((response)=>{ 
        if(response.data){
            setGames(response.data)
            //console.log(games)
        }
        else{
          
        }
      })
    }
    const getRecord = () =>{
      Axios.post(`${process.env.REACT_APP_SERVER_URL}/getUserRecord`,{
        Username: user
      }).then((response)=>{
        setRecord(`${response.data.Wins} Wins/${response.data.Losses} Losses/${response.data.Draws} Draws`)
        
      })
    }

    const downloadTxtFile = (e) => {
    const element = document.createElement("a");
    const file = new Blob([e.target.value], {
      type: "text/plain"
    });
    element.href = URL.createObjectURL(file);
    element.download = "Game.txt";
    document.body.appendChild(element);
    element.click();
  };

    useEffect(()=>{
        //console.log("Getting games for "+user)
        getGames()
        getRecord()
        setName(displayName)
        setUserName(user)
        setUserRating(rating)
        console.log(rating)
    },[])

    return(
        <>

          <Grid container columnSpacing = "7em" direction="row"
        alignItems="center"
        justifyContent="center" marginTop={4}>
          <Box component="span" sx={{ p: 10, border: '1px solid grey' }}>
          <Grid item>
            <Typography variant = "h5">Display Name: {name}</Typography>
            <Typography variant = "h5">Username: {username}</Typography>
            <Typography variant = "h5">Rating: {userRating}</Typography>
            <Typography variant = "h5">Record: {record}</Typography>
            <Typography variant = "h5">Recent Games:</Typography>
            <List
            sx={{
              width: '100%',
      
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              maxHeight: 300,
            
            }}
          >
            
            {games.map((elem, i)=>
              <li>
                <ul>
              <ListItem key={i}>
                  <Button value = {`${elem}`} onClick = {downloadTxtFile}>{i}. Game</Button>
              </ListItem>
              </ul>
              </li>
            )}
          </List>
          </Grid>
          </Box>
          

        </Grid>  
        </>
    )
}
export default Profile;