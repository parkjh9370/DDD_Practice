/* eslint-disable @typescript-eslint/no-explicit-any */
interface ValueObjectProps {
  [index: string]: any;
}

export abstract class ValueObject<T extends ValueObjectProps> {
  public props;

  protected constructor(props: T) {
    this.props = {
      ...props,
    };
  }

  public equals(valueObject?: ValueObject<T>): boolean {
    if (valueObject === undefined) {
      return false;
    }

    return JSON.stringify(this.props) === JSON.stringify(valueObject.props);
  }
}
