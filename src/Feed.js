import React, { useState, useEffect } from "react";
import { db } from "./firebase";
import TogoItem from "./TogoItem";

/*dbデータの受け取りをするcomponent  */

const Feed = () => {

    // firebaseに作成した項目を受け取るための変数＝useState
    const [togo, setTogo] = useState([
        {
            id: "",
            image: "",
            place:"",
            comment: "",
            timestamp: null, 
        },
        ]);

    // firebaseからデータ受信（firebaseに変更があった場合のみ、動作）
    useEffect(() => {
        const firebaseData = db
            .collection("togo")
            .orderBy("timestamp", "desc")
            .onSnapshot((snapshot) =>
                setTogo(
                  snapshot.docs.map((doc) => ({
                    // firebaseから読み込んだデータをdocに入れて、
                    // 各プロパティに入れて、postを更新
                    id: doc.id,
                    image: doc.data().image,
                    place: doc.data().place,
                    comment: doc.data().comment,
                    timestamp: doc.data().timestamp,
                  }))
                )
              );
        //   クリーンアップ関数（前回の処理を削除する処理らしい）
        return () => {
            firebaseData();
            };
        }, []);
        console.log(togo);

    return (
        <>
            {/* togoが あったときだけ、表示処理をする*/}
            { togo && (
                <>
                {/* togoの中身をtogoItemに入れて表示処理 */}
                {togo.map((togoItem) => (
                    // TogoItemコンポーネントにid, image, comment, place, timestampを渡す
                    <TogoItem
                    key={togoItem.id}
                    id={togoItem.id}
                    image={togoItem.image}
                    place={togoItem.place}
                    comment={togoItem.comment}
                    timestamp={togoItem.timestamp}
                    />
                ))}
                </>
            )}

        </>
    )
}

export default Feed

