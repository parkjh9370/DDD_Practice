# ChatReply
## ChatReply 테이블 생성
CREATE TABLE IF NOT EXISTS p_chat_reply (
  pcr_index INT AUTO_INCREMENT NOT NULL COMMENT "관리 번호",
  pcr_cc_index INT NOT NULL COMMENT "p_chat 관리번호",
  pcr_contents VARCHAR(512) NOT NULL DEFAULT "" COMMENT "내용",
  pcr_user_index INT NOT NULL COMMENT "유저 Id",
  pcr_post_index INT NOT NULL COMMENT "포스트 Id",
  pcr_is_anonymous ENUM("Y", "N") NOT NULL DEFAULT "Y" COMMENT "익명 Chat reply 여부",
  pcr_is_use ENUM("Y", "N") NOT NULL DEFAULT "Y" COMMENT "사용(삭제) 여부",
  pcr_register_date_time DATETIME DEFAULT NULL COMMENT "등록일시",
  pcr_update_date_time DATETIME DEFAULT NULL COMMENT "갱신일시",
  pcr_delete_date_time DATETIME DEFAULT NULL COMMENT "삭제일시",
  PRIMARY KEY (pcr_index)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT 'p_chat_reply';
