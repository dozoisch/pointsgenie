#History

##0.3.5
- Confirmation before putting user admin
- Better ranking algorithm in match
- Refresh event list after matching
- Added infos to footer
- Added glyphicon to show wheter a use has a promocard or not
- Added a link to assign a promocard to a user from user list page
- Added link to change list

##0.3.4
- Printable schedules
- Fixed small issue with how the multi select of appliance was handled

##0.3.3
- ReFetching user Store when adding a promocard
- Updated react-router to 0.9.x
- Fixed issue with LDAP connection, now connection is always on
- Put the commit short hash in the layout

##0.3.2
- Added a page to list user and be able to make them admin

##0.3.1
- Added a way to add a promocard to a user. This will create the user if he doesn't exist

##0.3.0
- Added promocard constraints
- Version now fetched from package.json

##0.2.8
- Added event scheduling (matching users to event)
- When user apply to an event they now have only 1 preference
- Better handling of date picker
- Bump deps

##0.2.7
- Fixed issue with date picker on french browsers
- User point logs now uses a reason string instead of event id

##0.2.6
- Small bug fixes

##0.2.5
- Now able to modify an event
- Better server initialization

#0.2.4
- Better date picker
- Error message on login fails

#0.2.3
- Base64 encode images

##0.2.2
- Added missing deps

##0.2.1
- Added prod build that minifies files
- Bug fix path that had been renamed

##0.2.0
- Continuous Integration
- Added admin Section
- Admin event creation and list

##0.1.0
- Index page:
    - Enables user to apply to future events
    - Show user points log
- Profile page :
    - Show users general informations
    - Enable users to change their password
    - Show promocard info
- Code for Fetching user from LDAP
- CAS login
- Local login
