import { classToPlain, plainToClass, Transform, Type, ClassTransformOptions } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import * as moment from 'moment';

export function ToNumber() {
  return Transform(Number);
}

/**
 * Shorthand for tranformation the value to moment.Moment object
 * Reference: https://github.com/typestack/class-transformer#basic-usage
 *
 * Example:
 * import { Moment } from 'moment'
 *
 * class Example {
 *  @ToMoment()
 *  date: Moment;
 * }
 *
 *
 */
export function ToMoment() {
  return (target: any, key: string) => {
    Type(() => Date)(target, key);
    Transform(value => value && moment(value), { toClassOnly: true })(target, key);
  };
}

export function mapTo<T extends Object, V>(cls: ClassType<T>, fromObject: V, transformOptions?: ClassTransformOptions) {
  const plain = classToPlain(fromObject, { excludeExtraneousValues: true, ...transformOptions });
  return plainToClass(cls, plain);
}
