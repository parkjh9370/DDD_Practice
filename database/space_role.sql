# SpaceRole
## SpaceRole 테이블 생성
CREATE TABLE IF NOT EXISTS p_space_role (
  psr_index INT AUTO_INCREMENT NOT NULL COMMENT "관리 번호",
  psr_cs_index INT NOT NULL COMMENT "p_space 관리번호",
  psr_role VARCHAR(255) NOT NULL DEFAULT "" COMMENT "역할",
  psr_has_administrator_rights ENUM("Y", "N") DEFAULT "N" NOT NULL COMMENT "관리 권한 여부",
  psr_is_use ENUM("Y", "N") NOT NULL DEFAULT "Y" COMMENT "사용(삭제) 여부",
  psr_register_date_time DATETIME DEFAULT NULL COMMENT "등록일시",
  psr_update_date_time DATETIME DEFAULT NULL COMMENT "갱신일시",
  psr_delete_date_time DATETIME DEFAULT NULL COMMENT "삭제일시",
  PRIMARY KEY (psr_index)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT 'p_space_role';
