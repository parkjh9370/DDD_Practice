import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { Result } from 'src/shared/core/domain/Result';

interface PostUploadFileProps {
  postIndex: number;
  fileUrl: string;
  isUse: boolean;
}

export class PostUploadFile extends AggregateRoot<PostUploadFileProps> {
  private constructor(props: PostUploadFileProps, id: number) {
    super(props, id);
  }

  static create(props: PostUploadFileProps, id: number): Result<PostUploadFile> {
    return Result.ok(new PostUploadFile(props, id));
  }

  static createNew(props: PostUploadFileProps): Result<PostUploadFile> {
    return this.create({ ...props }, 0);
  }

  get postIndex(): number {
    return this.props.postIndex;
  }

  get fileUrl(): string {
    return this.props.fileUrl;
  }

  get isUse(): boolean {
    return this.props.isUse;
  }
}
