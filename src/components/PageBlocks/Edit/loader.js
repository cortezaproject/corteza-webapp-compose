// Components that are the same in view and in edit mode
export {
  Automation,
  RecordList,
  Calendar,
  Chart,
  Content,
  SocialFeed,
  File,
  RecordOrganizer,
} from '../View/loader'

// Components that have their own version of edit mode
export {
  default as Record,
} from './Record'
