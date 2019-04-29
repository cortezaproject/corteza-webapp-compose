export const Default = `
// Crust automation triggers will help you manage your records
// It is a simple JavaScript engine that runs custom code that triggers manually
// or automatically before/after certain record events (create, update, delete)
`.trimLeft()

export const LeadConversion = `
// we will assign current record to variable lead just for readability
let lead = record

if (lead.values.Status === 'assigned') {
  // Lead already assigned, nothing to do here
  return true
}

// create new record of type/module Account and copy all values from
// lead. All values from fields that are named the same in both modules will
// be copied 1:1, others will be ignored
let account = crust.helpers.record.new('Account', lead)

// Do some modifications to account record
// Finds Crust user by his email and assigns him as an owner
let user = await crust.api.user.find('email@example.tld')

account.values.Owner = user.userID
account.values.Status = 'converted'

// Saves the account
await crust.api.record.save(account)

// Notifies the owner that a new account was created and assigned to him
crust.notify.send.email({
  // Accepts userID or email
  to: account.values.Owner,

  // Send 2 carbon copies to sales department and CSO
  cc: ['sales@example.cc Sales Department', 'cso@example.cc'],

  subject: \`Lead "\${lead.values.Name}" coverted\`,
  html: \`Account summary:&lt;hr>\${crust.fmt.record.toHTML(account)}\`,
})

// Notify current user 
crust.notify.ui.alert.success('Lead converted and assigned')

// We'll be executing this trigger beforeCreate/beforeUpdate
// so we can count on the system to pick up this change
// and save it for us.
lead.values.Status = 'assigned'

// Reload current page
// crust.helpers.record.page.reload()

// Redirect to another record page
// crust.helpers.record.page.open(record)

`.trimLeft()
