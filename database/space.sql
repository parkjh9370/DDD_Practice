# Space
## Space 테이블 생성
CREATE TABLE IF NOT EXISTS p_space (
  p_index INT AUTO_INCREMENT NOT NULL COMMENT "관리 번호",
  p_name VARCHAR(100) NOT NULL DEFAULT "" COMMENT "이름",
  p_logo_image_url VARCHAR(255) NOT NULL DEFAULT "" COMMENT "로고 이미지 URL",
  p_access_code VARCHAR(50) NOT NULL DEFAULT "" COMMENT "참여 코드",
  p_admin_access_code VARCHAR(50) NOT NULL DEFAULT "" COMMENT "관리자용 참여 코드",
  p_user_index INT NOT NULL COMMENT "등록한 유저 Id",
  p_is_use ENUM("Y", "N") NOT NULL DEFAULT "Y" COMMENT "사용(삭제) 여부",
  p_register_date_time DATETIME DEFAULT NULL COMMENT "등록일시",
  p_update_date_time DATETIME DEFAULT NULL COMMENT "갱신일시",
  p_delete_date_time DATETIME DEFAULT NULL COMMENT "삭제일시",
  PRIMARY KEY (p_index)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT 'p_space';
