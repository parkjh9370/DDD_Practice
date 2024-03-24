import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { Result } from 'src/shared/core/domain/Result';

interface SpaceUserProps {
  spaceIndex: number;
  userIndex: number;
  role: string;
  hasAdministratorRights: boolean;
  isParticipating: boolean;
  isCreateSpaceUser: boolean;
}

export class SpaceUser extends AggregateRoot<SpaceUserProps> {
  private constructor(props: SpaceUserProps, id: number) {
    super(props, id);
  }

  static create(props: SpaceUserProps, id: number): Result<SpaceUser> {
    return Result.ok(new SpaceUser(props, id));
  }

  static createNew(props: SpaceUserProps): Result<SpaceUser> {
    return this.create({ ...props }, 0);
  }

  get spaceIndex(): number {
    return this.props.spaceIndex;
  }

  get userIndex(): number {
    return this.props.userIndex;
  }

  get role(): string {
    return this.props.role;
  }

  get hasAdministratorRights(): boolean {
    return this.props.hasAdministratorRights;
  }

  get isCreateSpaceUser(): boolean {
    return this.props.isCreateSpaceUser;
  }

  get isParticipating(): boolean {
    return this.props.isParticipating;
  }
}
