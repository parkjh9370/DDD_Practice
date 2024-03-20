import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { Result } from 'src/shared/core/domain/Result';
import { SpaceUser } from 'src/space/domain/SpaceUser';

interface UserProps {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  profileImageUrl?: string;
  isAdmin?: boolean;
  isUse: boolean;
  refreshToken?: string;
  refreshTokenExpirationDateTime?: string;
  spaceUsers?: SpaceUser[];
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps, id: number) {
    super(props, id);
  }

  static create(props: UserProps, id: number): Result<User> {
    return Result.ok(new User(props, id));
  }

  static createNew(props: UserProps): Result<User> {
    return this.create({ ...props }, 0);
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get profileImageUrl(): string {
    return this.props.profileImageUrl;
  }

  get isAdmin(): boolean {
    return this.props.isAdmin;
  }

  get isUse(): boolean {
    return this.props.isUse;
  }

  get refreshToken(): string {
    return this.props.refreshToken;
  }

  get refreshTokenExpirationDateTime(): string {
    return this.props.refreshTokenExpirationDateTime;
  }

  get spaceUsers(): SpaceUser[] {
    return this.props.spaceUsers;
  }

  get fullName(): string {
    return `${this.lastName}${this.firstName}`;
  }
}
