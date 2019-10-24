import { BootstrapTheme } from '@fullcalendar/bootstrap'
import { createPlugin } from '@fullcalendar/core'

export class CortezaTheme extends BootstrapTheme {}
CortezaTheme.prototype.classes.widget = 'corteza-unthemed'
CortezaTheme.prototype.classes.button = 'btn btn-outline-primary'

CortezaTheme.prototype.baseIconClass = 'fc-icon'
CortezaTheme.prototype.iconClasses = {
  close: 'fc-icon-x',
  prev: 'fc-icon-chevron-left',
  next: 'fc-icon-chevron-right',
  prevYear: 'fc-icon-chevrons-left',
  nextYear: 'fc-icon-chevrons-right',
}

CortezaTheme.prototype.iconOverrideOption = 'buttonIcons'
CortezaTheme.prototype.iconOverrideCustomButtonOption = 'icon'
CortezaTheme.prototype.iconOverridePrefix = 'fc-icon-'

export default createPlugin({
  themeClasses: {
    corteza: CortezaTheme,
  },
})
