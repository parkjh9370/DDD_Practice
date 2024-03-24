import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PostUploadFile } from 'src/post/domain/PostUploadFile';
import { PostUploadFileEntity, PostUploadFileEntityIsUse } from '../entity/PostUploadFileEntity';
import { PostUploadFileRepository } from '../PostUploadFileRepository';

export class MysqlPostUploadFileRepository implements PostUploadFileRepository {
  constructor(
    @InjectRepository(PostUploadFileEntity)
    private readonly postUploadFileRepository: Repository<PostUploadFileEntity>,
  ) {}

  async save(postUploadFile: PostUploadFile): Promise<number> {
    const entity = await this.postUploadFileRepository
      .createQueryBuilder()
      .insert()
      .into(PostUploadFileEntity)
      .values({
        postIndex: postUploadFile.postIndex,
        fileUrl: postUploadFile.fileUrl,
        isUse: postUploadFile.isUse === true ? PostUploadFileEntityIsUse.YES : PostUploadFileEntityIsUse.NO,
        registerDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .execute();

    return entity.raw.insertId;
  }
}
