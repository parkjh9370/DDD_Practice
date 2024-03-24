# PostUploadFile
## PostUploadFile 테이블 생성
CREATE TABLE IF NOT EXISTS p_post_upload_file (
  ppuf_index INT AUTO_INCREMENT NOT NULL COMMENT "관리 번호",
  ppuf_cp_index INT NOT NULL COMMENT "p_post 관리번호",
  ppuf_file_url VARCHAR(512) NOT NULL DEFAULT "" COMMENT "저장된 파일 URL",
  ppuf_is_use ENUM("Y", "N") NOT NULL DEFAULT "Y" COMMENT "사용(삭제) 여부",
  ppuf_register_date_time DATETIME DEFAULT NULL COMMENT "등록일시",
  ppuf_delete_date_time DATETIME DEFAULT NULL COMMENT "삭제일시",
  PRIMARY KEY (ppuf_index)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT 'p_post_upload_file';
