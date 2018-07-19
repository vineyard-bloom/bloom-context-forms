# CHANGELOG

### July 19, 2018
- Fix bug where files didn't always end up in 'files' attribute on submitForm trigger

### July 17, 2018
- Publish 1.0.0
- Update `connectForm` to simpler API
    * from `props => connectForm(props)(Component)` to `connectForm(Component)`
- rename FormProvider to FormHandler for less confusion
- updated all tests
    * now use Enzyme and Jest instead of Enzyme and Mocha
    * actually test existing functionality instead of old bloom tests
- updated README and Docs
- removing CSS and associated files

### April 23, 2018
- Publish 0.0.1 beta