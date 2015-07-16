#History

## 0.7.3
- Added obligatory hours support

## 0.7.2
- Stricter ordering in admin match-to-event page

## 0.7.1
- Added a list of student in normal user page

## 0.7.0
- Added a way to close an event for postulation from the schedule page
- Added ability to modify an application
- Refactored EventStore to flummox
    - Removed old EventStore
- Bump deps

## 0.6.0
- Server side Rendering
- Refactor:
    - app to own files
    - new getValue on multiselect
    - Whole User app now using Flummox stores
        - Store are using api and model classes specific to client
    - New naming convention for files
        - Before hypens, now ClassName
    - Renaming .jsx to .js
    - Removing "use strict"
        - es6 modules are strict by default
    - New 404 page
- Added get for single event
- Added client side models
- improved transitions
- removed ugly last border in profile
- bump deps

## 0.5.3
- Added sortability to admin-user-list
- More prefetching for faster build
- better transitions

## 0.5.2
- bug fix key is undefined in password-change
- adding lot of promocard is now easier
- added transition between pages!
- updated readme
- validation is now sooner in ldap

## 0.5.1
- Migrated React Component to ES6
- Removed window.React Assignment
- Fixed config

## 0.5.0
- Moved src/client to ../app
- Build
    - Now builds using Webpack
    - Now builds using babel transform
    - Removed gulp build
- Deps
    - Updated to React 0.13 (RRouter, RBoostrap)
    - Updated to Mongoose 4.0
    - Updated to superagent 1.2
    - Bump deps
- Added gitter badge
- Travis
    - Now uses travis container based build
    - Added IOJS
    - Added node 0.12
    - Removed node 0.11

## 0.4.7.
- Added FAQ
- Added Total User Points in user list
- Changed prefered task display name
- Support for french response from CAS
- Database Config in its own file

## 0.4.6
- Added a page to attribute points
- Users now appear in 3 differents colors and ranking in the match-to-event page
    This was made in order to have people with no preferrence appear
    before people with another preferred task than the one we're looking at.
- Better handling for null X-Fowarded-Proto

## 0.4.5
- Added a field that shows the list of user emails in schedule page
- Email list is hidden from printing
- Fixed a bug with the password change system.

## 0.4.4
- New ways of fetching missing user profiles
- Better connection workflow, that fetches infos from ldap when cas fails
- Added a view that is easier to print for the match-to-event page
- Fixed CAS protocol to use HTTPS when the req is https by proxy

## 0.4.3
- Added an action to see user points from admin log
- Ability to mark an event as points attributed
- Fixed an issue where the filter was not working
- Fixed an issue where it was no longer possible to switch event
- User appear in a different color on their favorite tasks in math-to-event
- Fallback on cip when name is undefined for scheduling

## 0.4.2
- Added meta viewport
- Update message on login page
- Update admin schedule to have names when possible
- Fixed a bug where applications where badly ordered for schedule
- Fixed bug where it was possible to postulate to a closed event
- Added more tests

## 0.4.1
- Only show upcoming events where the user hasn't postulated.

## 0.4.0
- Awarding points to user
- Negative lines now appear red in points log
- Gulp build no longer breaks on parse error for less and jsx
- Moved small components to utils
- User now reuse id and not uid

## 0.3.5
- Confirmation before putting user admin
- Better ranking algorithm in match
- Refresh event list after matching
- Added infos to footer
- Added glyphicon to show whether a user has a promocard or not
- Added a link to assign a promocard to a user from user list page
- Added link to change list

## 0.3.4
- Printable schedules
- Fixed small issue with how the multi select of appliance was handled

## 0.3.3
- ReFetching user Store when adding a promocard
- Updated react-router to 0.9.x
- Fixed issue with LDAP connection, now connection is always on
- Put the commit short hash in the layout

## 0.3.2
- Added a page to list user and be able to make them admin

## 0.3.1
- Added a way to add a promocard to a user. This will create the user if he doesn't exist

## 0.3.0
- Added promocard constraints
- Version now fetched from package.json

## 0.2.8
- Added event scheduling (matching users to event)
- When user apply to an event they now have only 1 preference
- Better handling of date picker
- Bump deps

## 0.2.7
- Fixed issue with date picker on french browsers
- User point logs now uses a reason string instead of event id

## 0.2.6
- Small bug fixes

## 0.2.5
- Now able to modify an event
- Better server initialization

#0.2.4
- Better date picker
- Error message on login fails

#0.2.3
- Base64 encode images

## 0.2.2
- Added missing deps

## 0.2.1
- Added prod build that minifies files
- Bug fix path that had been renamed

## 0.2.0
- Continuous Integration
- Added admin Section
- Admin event creation and list

## 0.1.0
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
