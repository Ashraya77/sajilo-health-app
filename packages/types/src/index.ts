export type EntityId = string;

export interface TimestampedEntity {
  readonly createdAt: string;
  readonly updatedAt: string;
}
