# SpaceUser
## SpaceUser 테이블 생성
CREATE TABLE IF NOT EXISTS p_space_user (
  psu_index INT AUTO_INCREMENT NOT NULL COMMENT "관리 번호",
  psu_cs_index INT NOT NULL COMMENT "p_space 관리번호",
  psu_cu_index INT NOT NULL COMMENT "p_user 관리번호",
  psu_role VARCHAR(255) NOT NULL DEFAULT "" COMMENT "역할",
  psu_has_administrator_rights ENUM("Y", "N") DEFAULT "N" NOT NULL COMMENT "관리 권한 여부",
  psu_is_participating ENUM("Y", "N") DEFAULT "N" NOT NULL COMMENT "현재 공간 참여중인지 여부",
  psu_is_create_space_user ENUM("Y", "N") DEFAULT "N" NOT NULL COMMENT "공간 개설자(소유자) 여부",
  psu_register_date_time DATETIME DEFAULT NULL COMMENT "등록일시",
  psu_update_date_time DATETIME DEFAULT NULL COMMENT "갱신일시",
  PRIMARY KEY (psu_index)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT 'p_space_user';
