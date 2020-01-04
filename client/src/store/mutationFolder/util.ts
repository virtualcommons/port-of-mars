import { State } from '@/store/state';
import { Role } from 'shared/types';

export function getRole(state: State, role?: Role) {
  return role ? role : state.role;
}
