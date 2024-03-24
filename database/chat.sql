# Chat
## Chat 테이블 생성
CREATE TABLE IF NOT EXISTS p_chat (
  pc_index INT AUTO_INCREMENT NOT NULL COMMENT "관리 번호",
  pc_pp_index INT NOT NULL COMMENT "p_post 관리번호",
  pc_contents VARCHAR(512) NOT NULL DEFAULT "" COMMENT "내용",
  pc_user_index INT NOT NULL COMMENT "유저 Id",
  pc_is_anonymous ENUM("Y", "N") NOT NULL DEFAULT "Y" COMMENT "익명 Chat 여부",
  pc_is_use ENUM("Y", "N") NOT NULL DEFAULT "Y" COMMENT "사용(삭제) 여부",
  pc_register_date_time DATETIME DEFAULT NULL COMMENT "등록일시",
  pc_update_date_time DATETIME DEFAULT NULL COMMENT "갱신일시",
  pc_delete_date_time DATETIME DEFAULT NULL COMMENT "삭제일시",
  PRIMARY KEY (pc_index)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT 'p_chat';
