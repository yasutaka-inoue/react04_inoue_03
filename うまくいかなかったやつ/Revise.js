import React, { useState } from "react";
import { storage, db } from "./firebase";
import firebase from "firebase/app";
import Grid from '@material-ui/core/Grid';
import { Button,  FormControl, TextField} from "@material-ui/core";
import Paper from '@material-ui/core/Paper';
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: 8,
        marginTop: 50,
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
      img: {
        display: 'block',
        margin: 'auto',
        maxWidth: '100%',
        maxHeight: '100%',
      },
  }));

const Revise = ({id, image, comment, place}) => {
    const classes = useStyles();
    const [inputImage, setInputImage] = useState(null);
    const [rePlace, setPlace] = useState(place);
    const [reComment, setComment] = useState(comment);

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
    setInputImage(null);
    setPlace("");
    setComment("");
    };
    return (
        <>
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
                    onChange={(e) => setPlace(e.target.value)}
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
                    onChange={(e) => setComment(e.target.value)}
                  />
                  </FormControl>
                </Grid>
                <Grid item>
                {/* 送信ボタン */}
                  <Button variant="contained" color="primary" type="submit" disabled={!place}>
                    登録
                  </Button>
                </Grid>
              </Grid>
              </Grid>
              </Grid>
              </form>
            </Paper>
        </>
    )
}

export default Revise

// モーダルを閉じる処理がうまくいかない。