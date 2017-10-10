import Ember from 'ember';

export default Ember.Controller.extend({
  classNames: ['pipeline-steps'],
  queryParams: ['relatedWorkflow'],
  relatedWorkflow: ""
});
