import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { Result } from 'src/shared/core/domain/Result';

import { PostUploadFile } from './PostUploadFile';

interface PostProps {
  spaceIndex: number;
  name: string;
  type: PostType;
  contents: string;
  userIndex: number;
  isAnonymous: boolean;
  isUse: boolean;
  postUploadFiles?: PostUploadFile[];
}

export enum PostType {
  NOTICE = 'NOTICE',
  QUESTION = 'QUESTION',
}

export class Post extends AggregateRoot<PostProps> {
  private constructor(props: PostProps, id: number) {
    super(props, id);
  }

  static create(props: PostProps, id: number): Result<Post> {
    return Result.ok(new Post(props, id));
  }

  static createNew(props: PostProps): Result<Post> {
    return this.create({ ...props }, 0);
  }

  get spaceIndex(): number {
    return this.props.spaceIndex;
  }

  get name(): string {
    return this.props.name;
  }

  get type(): PostType {
    return this.props.type;
  }

  get contents(): string {
    return this.props.contents;
  }

  get userIndex(): number {
    return this.props.userIndex;
  }

  get isAnonymous(): boolean {
    return this.props.isAnonymous;
  }

  get isUse(): boolean {
    return this.props.isUse;
  }

  get postUploadFiles(): PostUploadFile[] {
    return this.props.postUploadFiles;
  }
}
