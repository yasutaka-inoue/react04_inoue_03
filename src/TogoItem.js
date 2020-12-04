import React, { useState } from 'react'
import DeleteIcon from '@material-ui/icons/Delete';
import { Backdrop, Button, IconButton, Modal, Fade, FormControl, TextField} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { storage, db } from "./firebase";
import firebase from "firebase/app";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Img from "./img/noimage.png";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";

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
      modalPaper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 500,
      },
      preview: {
        width: 256,
        height: 256,
        backgroundColor: 'rgba(128,128,128,0.5)',
        cursor: "pointer",
        position: "relative",
        verticalAlign: "middle",
        textAlign: "center",
        display: "table-cell",
        '&:hover': {backgroundColor:'rgba(128,128,128,0.3)'},
      },
      inputFile: {
        display: "none",
      },
      imgIcon:{
        position: "absolute",
        left: 114,
        top: 114,
        color: "white",
      },
      margin:{
        marginTop: 10,
      },
  }));

const TogoItem = ({id, image, comment, place, timestamp}) => {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [inputImage, setInputImage] = useState(null);
    const [rePlace, setRePlace] = useState(place);
    const [reComment, setReComment] = useState(comment);

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
        setInputImage(null);
        setOpen(false);
      };
    
    // inputの処理
    const onChangeImageHandler = (e) => {
      if (e.target.files[0]) {
        setInputImage(e.target.files[0]);
        // サムネイル表示処理
        const reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('thumbnail').setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
      }
        e.target.value = "";        
    };
  
  // 送信された時の処理
  const sendTogo = (e) => {
      // 画面リロードを防ぐ処理
      e.preventDefault();
      // テキストだけの時とイメージがあるときと処理を分ける
      if(inputImage){
      // firebaseの仕様で同じファイル名の画像を複数回アップしてしまうと元々あったファイルが削除される
      // そのためにファイル名をランダムにする必要がある、それが下
      const S =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"; //ランダムな文字列を作るための候補、62文字
      const N = 16; //16文字の文字列を作るという意味 生成したい文字数が１６の文字列になる
      const randomMoji = Array.from(crypto.getRandomValues(new Uint32Array(N))) //乱数を生成してくれるもので0からランダムな数字が１６こ選ばれる
          .map((n) => S[n % S.length])
          .join("");
      const fileName = randomMoji + "_" + inputImage.name;

      // firebase storageに登録
      const uploadTogoImg = storage.ref(`images/${fileName}`).put(inputImage);
      
      // firebase dbに登録
      uploadTogoImg.on(
          firebase.storage.TaskEvent.STATE_CHANGED,
          () => {},  //進捗度合
          (err) => {  //エラーの時
            alert(err.message);
          },
          async () => { //成功の時
            await storage
              .ref("images")
              .child(fileName)
              // storageのファイルURLにアクセスし、取得
              .getDownloadURL()
              .then(async (url) => {
                // 更新処理
                await db.collection("togo").doc(id).update({
                  image: url,
                  place: rePlace,
                  comment: reComment,
                  timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                });
              });
          }
        );
      } else {
          // テキストだけの更新処理
    db.collection("togo").doc(id).update({
      place: rePlace,
      comment: reComment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }
  setOpen(false);
  setInputImage(null);
  setRePlace(rePlace);
  setReComment(reComment);
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
              <Paper className={classes.modalPaper}>
            <form onSubmit={sendTogo}>
              {/* 中身 */}
             <Grid container spacing={2}>
             <Grid item>
             <label>
              <div className={classes.preview}>
                {/* 画像があったら、サムネイル表示 */}
              {inputImage && 
                <img id="thumbnail" accept="image/*" src="" alt="選択中の画像" className={classes.img}/>
              }
              {/* 既に入っている画像があれば表示するが、新しいのが入ったら表示しない */}
              {!inputImage && image &&  
                <img id="thumbnail" src={image} alt="選択中の画像" className={classes.img}/>}
                <AddAPhotoIcon className={classes.imgIcon}/>    
                 
                  {/* 画像を入れる時は、type=file */}
                  <input
                    type="file"
                    onChange={onChangeImageHandler}
                    className={classes.inputFile}
                  />    
              </div>
              </label> 
              </Grid>
              {/* place, comment 表示 */}
              <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  {/* placeを入力 */}
                  <FormControl>
                  <TextField
                    type="text"
                    autoFocus
                    value={rePlace}
                    label="場所の名前"
                    required
                    //  外だしせずにここで書く方法
                    onChange={(e) => setRePlace(e.target.value)}
                  />
                  </FormControl>
                  {/* commentを入力 */}
                  <FormControl >
                  <TextField
                    type="text"
                    value={reComment}
                    label="コメント"
                    multiline
                    rows={4}
                    variant="outlined"
                    className={classes.margin}
                    //  外だしせずにここで書く方法
                    onChange={(e) => setReComment(e.target.value)}
                  />
                  </FormControl>
                </Grid>
                <Grid item>
                {/* 送信ボタン */}
                  <Button variant="contained" color="primary" type="submit" disabled={!rePlace}>
                    登録
                  </Button>
                </Grid>
              </Grid>
              </Grid>
              </Grid>
              </form>
            </Paper>
              </Fade>
            </Modal>
            </>
        </div>
    )
}

export default TogoItem
