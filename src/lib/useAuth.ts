import { reactive } from 'vue'
import { UnwrapNestedRefs } from '@vue/reactivity'
import { NavigationGuardWithThis } from 'vue-router'

interface AuthContext {
  authState: UnwrapNestedRefs<AuthContextState>
  logout: typeof logout
  login: typeof login
  loader: Promise<void>
}

function logout() {
  window.location.href = 'http://localhost:8080/logout'
}

function login() {
  // For now, in dev we simply redirect to the Quarkus instance.
  // In production, we may want to serve vue from quarkus, in which case we let quarkus handle the redirect
  window.location.href = 'http://localhost:8080/login'
}

interface User {
  // keep this small as it will be serialized to localStorage
  email: string,
}

interface AuthContextState {
  loading: boolean
  isAuthenticated: boolean
  user: User|null
}
const state = reactive<AuthContextState>({
  loading: true,
  isAuthenticated: false,
  user: null,
})

async function fetchState() {
  if (state.loading) {
    const stateStr = localStorage.getItem('authState')
    if (stateStr) {
      const authState = JSON.parse(stateStr) // @todo: sanitize
      state.isAuthenticated = authState.isAuthenticated
      state.user = authState.user
    }
    if (!state.isAuthenticated) {
      state.isAuthenticated = true
      state.user = {email: 'user@localhost'}
    }
    state.loading = false
  }
}
let instance: AuthContext

export function useAuth(): AuthContext {
  if (instance) {
    return instance
  }
  const loader = fetchState()
  instance = {authState: state, logout, login, loader}
  return instance
}

export const authNavigationGuard: NavigationGuardWithThis<undefined> = async () => {
  const {authState, loader} = useAuth()
  await loader
  if (authState.isAuthenticated) {
    return true
  } else {
    login()
  }
}
