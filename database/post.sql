# Post
## Post 테이블 생성
CREATE TABLE IF NOT EXISTS p_post (
  pp_index INT AUTO_INCREMENT NOT NULL COMMENT "관리 번호",
  pp_ps_index INT NOT NULL COMMENT "p_space 관리번호",
  pp_name VARCHAR(50) NOT NULL DEFAULT "" COMMENT "제목",
  pp_type ENUM("NOTICE", "QUESTION") NOT NULL DEFAULT "QUESTION" COMMENT "종류",
  pp_contents VARCHAR(2000) NOT NULL DEFAULT "" COMMENT "내용",
  pp_user_index INT NOT NULL COMMENT "등록한 유저 Id",
  pp_is_anonymous ENUM("Y", "N") DEFAULT "N" NOT NULL COMMENT "익명 여부",
  pp_is_use ENUM("Y", "N") NOT NULL DEFAULT "Y" COMMENT "사용(삭제) 여부",
  pp_register_date_time DATETIME DEFAULT NULL COMMENT "등록일시",
  pp_update_date_time DATETIME DEFAULT NULL COMMENT "갱신일시",
  pp_delete_date_time DATETIME DEFAULT NULL COMMENT "삭제일시",
  PRIMARY KEY (pp_index)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT 'p_post';
