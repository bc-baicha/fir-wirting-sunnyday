import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Axios from 'axios';
import Bricks from "bricks.js";
import moment from 'moment';

//header组件
function Comments(props) {
  return (
    <div className={styles.commentsTitle}><span className={styles.textLess}>{props.text}</span></div>
  )
}

//获取数据接口
function getData(limit = 50, offset) {
  return Axios.get("https://musicapi.leanapp.cn/comment/music", {
    params: {
      id: 186016,
      limit,
      offset, // 倒叙
    },
  }).then((res) => res.data);
}

let page = 1;
let hotCommentInst;
let commentInst;

function CommentCard({ avatarUrl, nickname, content, time }) {
  return (
    <div className={styles.grid_item} style={{ backgroundColor: "#fff" }}>
      <div className={styles.userinfo}>
        <img className={styles.avatar} src={avatarUrl} alt="avatar" />
      </div>
      <div className={styles.content}>
        <span>{content}</span>
        <div className={styles.nickname}>- {nickname}</div>
        <div className={styles.time}>{moment(time).format('YYYY-MM-DD')}</div>
      </div>
    </div>
  );
}

export default function () {
  document.title = '晴天の网易云评论';
  const [hotComments, setHotComments] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    getData(50, 2027450 - page * 50)
      .then((data) => {
        setComments(comments.concat(data.comments));
        page === 1 ? commentInst.pack() : commentInst.update();
        page++;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData(20).then((data) => {
      setHotComments(data.hotComments);
      hotCommentInst.pack();
    });
    loadMore();
    const sizeOpt = [
      { columns: 2, gutter: 10 },
      { mq: "600px", columns: 3, gutter: 10 },
      { mq: "800px", columns: 4, gutter: 10 },
      { mq: "1000px", columns: 5, gutter: 16 },
      { mq: "1130px", columns: 5, gutter: 16 },
    ];
    hotCommentInst = Bricks({
      container: "#hot-comment-list",
      packed: "data-packed",
      sizes: sizeOpt,
    });
    commentInst = Bricks({
      container: "#comment-list",
      packed: "data-packed",
      sizes: sizeOpt,
    });
  }, [])

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>- 晴天の网易云评论 -</div>
      <div className={styles.vedioWrap}>
        <iframe
          src="//player.bilibili.com/player.html?aid=328746951&bvid=BV1VA411e7PM&cid=208118542&page=1"
          scrolling="no"
          border="0"
          frameborder="no"
          framespacing="0"
          allowfullscreen="true"
          style={{ width: 1200, height: 800 }}
          title='晴天'
        />
      </div>
      <Comments text='热评 Top15' />
      <div style={{width:'100%'}} id="hot-comment-list">
        {hotComments.map(({ user, content, commentId, time }) => (
          <CommentCard
            key={commentId}
            avatarUrl={user.avatarUrl}
            nickname={user.nickname}
            content={content}
            time={time}
          />
        ))}
      </div>

      <Comments text='评论回忆' />
      <div id="comment-list">
        {comments.map(({ user, content, commentId, time }) => (
          <CommentCard
            key={commentId}
            avatarUrl={user.avatarUrl}
            nickname={user.nickname}
            content={content}
            time={time}
          />
        ))}
      </div>
      <div className={styles.load_more}>
        <a className={styles.load_more_button} onClick={loadMore}>
          {loading ? "..." : "加载更多"}
        </a>
      </div>

    </div>
  );
}
