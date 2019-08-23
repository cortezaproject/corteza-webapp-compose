import { emptyGenericState, genericGetters, genericActions, genericMutations } from 'corteza-webapp-common/src/lib/store/generic'
import AutomationScript from 'corteza-webapp-common/src/lib/types/shared/automation-script'

export default function (ComposeAPI) {
  const opt = {
    client: ComposeAPI,
    epm: 'automationScript',
    Type: AutomationScript,
    primaryKey: 'scriptID',
  }

  return {
    namespaced: true,
    state: emptyGenericState,
    getters: genericGetters(opt),
    actions: genericActions(opt),
    mutations: genericMutations(opt),
  }
}
