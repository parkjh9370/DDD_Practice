import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Post } from 'src/post/domain/Post';
import { PostEntity, PostEntityIsAnonymous, PostEntityIsUse } from '../entity/PostEntity';
import { PostRepository, PostRepositoryFindByOptions, PostRepositoryFindOneByOptions } from '../PostRepository';
import { MysqlPostRepositoryMapper } from './mapper/MysqlPostRepositoryMapper';

export class MysqlPostRepository implements PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async save(post: Post): Promise<number> {
    const entity = await this.postRepository
      .createQueryBuilder()
      .insert()
      .into(PostEntity)
      .values({
        spaceIndex: post.spaceIndex,
        name: post.name,
        type: post.type as string,
        contents: post.contents,
        userIndex: post.userIndex,
        isAnonymous: post.isAnonymous === true ? PostEntityIsAnonymous.YES : PostEntityIsAnonymous.NO,
        isUse: post.isUse === true ? PostEntityIsUse.YES : PostEntityIsUse.NO,
        registerDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .execute();

    return entity.raw.insertId;
  }

  async findOneByOptions(options: PostRepositoryFindOneByOptions): Promise<Post> {
    const { id } = options;

    let whereClause = `1=1`;

    if (id) {
      whereClause += ` AND post.cp_index = ${id}`;
    }

    const entity = await this.postRepository
      .createQueryBuilder(`post`) //
      .leftJoinAndSelect(`post.chat`, `chat`)
      .leftJoinAndSelect(`post.postUploadFile`, `postUploadFile`)
      .orderBy(`chat.cc_index`, `ASC`)
      .where(whereClause)
      .getOne();

    return entity ? MysqlPostRepositoryMapper.toDomain(entity) : null;
  }

  async findByOptions(options: PostRepositoryFindByOptions): Promise<Post[]> {
    const { userId } = options;

    let whereClause = `1=1`;

    if (userId) {
      whereClause += ` AND post.cp_user_index = ${userId}`;
    }

    const entities = await this.postRepository
      .createQueryBuilder(`post`) //
      .leftJoinAndSelect(`post.postUploadFile`, `postUploadFile`)
      .leftJoinAndSelect(`post.chat`, `chat`)
      .orderBy(`post.cp_index`, `ASC`)
      .orderBy(`postUploadFile.cpuf_index`, `ASC`)
      .orderBy(`chat.cc_index`, `ASC`)
      .where(whereClause)
      .getMany();

    return entities ? MysqlPostRepositoryMapper.toDomains(entities) : [];
  }

  async delete(post: Post): Promise<void> {
    await this.postRepository
      .createQueryBuilder()
      .update<PostEntity>(PostEntity, {
        isUse: PostEntityIsUse.NO,
        deleteDateTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      })
      .where(`index = ${post.id}`)
      .execute();
  }
}
