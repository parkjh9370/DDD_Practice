import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { Result } from 'src/shared/core/domain/Result';
import { SpaceRole } from './SpaceRole';
import { SpaceUser } from './SpaceUser';
import { Post } from 'src/post/domain/Post';

interface SpaceProps {
  name: string;
  logoImageUrl: string;
  accessCode: string;
  adminAccessCode: string;
  isUse: boolean;
  userIndex: number;
  spaceRoles?: SpaceRole[];
  spaceUsers?: SpaceUser[];
  posts?: Post[];
}

export class Space extends AggregateRoot<SpaceProps> {
  private constructor(props: SpaceProps, id: number) {
    super(props, id);
  }

  static create(props: SpaceProps, id: number): Result<Space> {
    return Result.ok(new Space(props, id));
  }

  static createNew(props: SpaceProps): Result<Space> {
    return this.create({ ...props }, 0);
  }

  get name(): string {
    return this.props.name;
  }

  get logoImageUrl(): string {
    return this.props.logoImageUrl;
  }

  get accessCode(): string {
    return this.props.accessCode;
  }

  get adminAccessCode(): string {
    return this.props.adminAccessCode;
  }

  get userIndex(): number {
    return this.props.userIndex;
  }

  get isUse(): boolean {
    return this.props.isUse;
  }

  get spaceRoles(): SpaceRole[] {
    return this.props.spaceRoles;
  }

  get spaceUsers(): SpaceUser[] {
    return this.props.spaceUsers;
  }

  get posts(): Post[] {
    return this.props.posts;
  }
}
