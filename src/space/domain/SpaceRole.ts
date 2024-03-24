import { AggregateRoot } from 'src/shared/core/domain/AggregateRoot';
import { Result } from 'src/shared/core/domain/Result';

interface SpaceRoleProps {
  spaceIndex: number;
  role: string;
  hasAdministratorRights: boolean;
  isUse: boolean;
}

export class SpaceRole extends AggregateRoot<SpaceRoleProps> {
  private constructor(props: SpaceRoleProps, id: number) {
    super(props, id);
  }

  static create(props: SpaceRoleProps, id: number): Result<SpaceRole> {
    return Result.ok(new SpaceRole(props, id));
  }

  static createNew(props: SpaceRoleProps): Result<SpaceRole> {
    return this.create({ ...props }, 0);
  }

  get spaceIndex(): number {
    return this.props.spaceIndex;
  }

  get role(): string {
    return this.props.role;
  }

  get hasAdministratorRights(): boolean {
    return this.props.hasAdministratorRights;
  }

  get isUse(): boolean {
    return this.props.isUse;
  }
}
