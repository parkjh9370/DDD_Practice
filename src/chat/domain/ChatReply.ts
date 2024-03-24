import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { Result } from 'src/shared/core/domain/Result';

interface ChatReplyProps {
  chatIndex: number;
  contents: string;
  userIndex: number;
  postIndex: number;
  isAnonymous: boolean;
  isUse: boolean;
}

export class ChatReply extends AggregateRoot<ChatReplyProps> {
  private constructor(props: ChatReplyProps, id: number) {
    super(props, id);
  }

  static create(props: ChatReplyProps, id: number): Result<ChatReply> {
    return Result.ok(new ChatReply(props, id));
  }

  static createNew(props: ChatReplyProps): Result<ChatReply> {
    return this.create({ ...props }, 0);
  }

  get chatIndex(): number {
    return this.props.chatIndex;
  }

  get contents(): string {
    return this.props.contents;
  }

  get userIndex(): number {
    return this.props.userIndex;
  }

  get postIndex(): number {
    return this.props.userIndex;
  }

  get isAnonymous(): boolean {
    return this.props.isAnonymous;
  }

  get isUse(): boolean {
    return this.props.isUse;
  }
}
