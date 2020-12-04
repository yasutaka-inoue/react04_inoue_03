import React, { useState } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Backdrop, Button, IconButton, Modal, Fade} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { db } from "./firebase";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Img from "./img/noimage.png";
import Revise from "./Revise";

/* 表示される各Togoのcomponent */

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: 8,
      },
      paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 500,
      },
      image: {
        width: 128,
        height: 128,
      },
      img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
      },
      date: {
        display: 'inline-block',
        width: 140,
        marginRight: 60,
      },
      button:{
        marginRight: 5,
      },
      modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
  }));

const TogoItem = ({id, image, comment, place, timestamp}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    // 削除処理
    const DeleteInputData = ()=>{
        db.collection("togo").doc(id).delete();
        console.log();
    };
    // 修正処理
    const ReviseInputData = ()=>{
      //modalが開いて、その中にデータが入っている。それを修正して格納
      setOpen(true);
  };
      //modal処理
      const handleClose = () => {
        setOpen(false);
      };

    return (
        // 画面表示
        <div key={id} className={classes.root}>

            {/* 外枠 */}
            <Paper className={classes.paper}>

            {/* 中身 */}
            <Grid container spacing={2}>

            {/* 画像 */}
            <Grid item>
                {/* 画像がある時はそれ、それ以外の時はテンプレ表示*/}
                { image ? (
                <>
                <ButtonBase className={classes.image}>
                    <img src={image} alt={`${place}の画像`} className={classes.img}/>
                </ButtonBase>
                </>
                ) : (
                <>
                <ButtonBase className={classes.image}>
                    <img src={Img} alt="画像はありません" className={classes.img}></img>
                </ButtonBase>
                </>
                )}
            </Grid>
            
            {/* place, comment 表示 */}
            <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  Place:『{place}』
                </Typography>
                <Typography gutterBottom variant="subtitle1">
                  Comment:
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {comment}
                </Typography>
                </Grid>
                <Grid item>
                <Typography variant="body2" color="textSecondary" className={classes.date}>
                {new Date(timestamp?.toDate()).toLocaleString()}
                </Typography>
                {/* 編集ボタン */}
                <Button variant="contained" color="primary" onClick={ReviseInputData} className={classes.button}>
                  修正する
                </Button>
                {/* 削除ボタン */}
                <IconButton aria-label="delete" onClick={DeleteInputData}>
                  <DeleteIcon fontSize="small"/>
                </IconButton>
              </Grid>
            </Grid>
            </Grid>
            </Grid>
            </Paper>

            {/* 編集モーダル */}
            <>
            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={open}
              onClose={handleClose}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
              timeout: 500,
              }}
            >
              <Fade in={open}>
                <Revise 
                id={id}
                image={image}
                place={place}
                comment={comment}
                />
              </Fade>
            </Modal>
            </>
        </div>
    )
}

export default TogoItem
