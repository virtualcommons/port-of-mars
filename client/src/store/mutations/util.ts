import { State } from '@port-of-mars/shared/game/client/state';
import { Role } from '@port-of-mars/shared/types';

export function getRole(state: State, role?: Role) {
  return role ? role : state.role;
}
