import { makeStyles} from '@material-ui/core/styles';
import { AppBar, IconButton, Toolbar, Typography } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react'

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));

const Nav = () => {
    const classes = useStyles();
    return (
        <div className={classes.root}>
          <AppBar position="static"z>
            <Toolbar>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                To Go List
              </Typography>
                {/* <IconButton color="inherit">
                <Badge badgeContent={1} color="secondary">
                    <NotificationsIcon />
                </Badge>
                </IconButton> */}
              {/* <Button color="inherit">Login</Button> */}
            </Toolbar>
          </AppBar>
        </div>
      );
}

export default Nav
