import * as admin from './Admin/C3'
import * as chart from './Chart/C3'
import * as common from './Common/C3'
import * as moduleFields from './ModuleFields/C3'
import * as namespace from './Namespaces/C3'
import * as publicCmps from './Public/C3'
import * as rightPanel from './RightPanel/C3'
import * as translator from './Translator/C3'
import { pageBlockBase, pageBlockConfigurators } from './PageBlocks/C3'

import FileConfigurator from './Admin/EditorToolbar.c3'

export default {
  ...admin,
  ...chart,
  ...common,
  ...moduleFields,
  ...namespace,
  ...pageBlockConfigurators,
  ...pageBlockBase,
  ...publicCmps,
  ...rightPanel,
  ...translator,
  FileConfigurator,
}
