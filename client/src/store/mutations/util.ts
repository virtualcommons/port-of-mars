import { State } from '@port-of-mars/client/store/state';
import { Role } from '@port-of-mars/shared/types';

export function getRole(state: State, role?: Role) {
  return role ? role : state.role;
}
