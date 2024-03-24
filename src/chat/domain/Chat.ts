import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { Result } from 'src/shared/core/domain/Result';
import { ChatReply } from './ChatReply';

interface ChatProps {
  postIndex: number;
  contents: string;
  userIndex: number;
  isAnonymous: boolean;
  isUse: boolean;
  chatReply?: ChatReply[];
}

export class Chat extends AggregateRoot<ChatProps> {
  private constructor(props: ChatProps, id: number) {
    super(props, id);
  }

  static create(props: ChatProps, id: number): Result<Chat> {
    return Result.ok(new Chat(props, id));
  }

  static createNew(props: ChatProps): Result<Chat> {
    return this.create({ ...props }, 0);
  }

  get postIndex(): number {
    return this.props.postIndex;
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

  get chatReply(): ChatReply[] {
    return this.props.chatReply;
  }
}
