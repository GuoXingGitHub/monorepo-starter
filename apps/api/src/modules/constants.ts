export type EntityStatus = 'A' | 'I' | 'D';

export const ROLE_ADMIN = 'ADMIN';

export const toStatusText = (char: EntityStatus) => {
  const statusMapping = {
    A: 'active',
    I: 'inactive',
    D: 'deleted',
  };

  return statusMapping[char];
};
