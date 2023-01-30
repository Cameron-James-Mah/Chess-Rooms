import { useState, useEffect } from "react";

import { Box, List, ListItem, ListItemText, Grid, Typography } from "@mui/material";

import Axios from "axios";

const Profile = ({user, displayName}) =>{

    const [games, setGames] = useState([""])

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

    useEffect(()=>{
        //console.log("Getting games for "+user)
        getGames()
    },[])

    return(
        <>

          <Grid container columnSpacing = "7em" direction="row"
        alignItems="center"
        justifyContent="center" marginTop={4}>
          <Box component="span" sx={{ p: 10, border: '1px solid grey' }}>
          <Grid item>
            <Typography variant = "h5">Display Name: {displayName}</Typography>
            <Typography variant = "h5">Username: {user}</Typography>
            <Typography variant = "h5">Rating: </Typography>
            <Typography variant = "h5">Record: </Typography>
          </Grid>
          </Box>
          <Grid item>
            <List
            sx={{
              width: '100%',
              maxWidth: 360,
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'auto',
              maxHeight: 300,
              '& ul': { padding: 0 },
            }}
          >
            <Typography variant = "h5">Completed Games</Typography>
            {games.map((elem, i)=>
              <li>
                <ul>
              <ListItem key={i}>
                  <ListItemText primary={`${elem}`} />
              </ListItem>
              </ul>
              </li>
            )}
          </List>
        </Grid>

        </Grid>  
        </>
    )
}
export default Profile;