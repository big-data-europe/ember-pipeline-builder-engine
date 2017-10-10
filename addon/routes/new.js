import Ember from 'ember';

const PipelinesNewRoute = Ember.Route.extend({
  store: Ember.inject.service('store'),
  model() {
    return this.get('store').createRecord('pipeline', { dockerFile: null});
  },
  actions: {
    save() {
      return this.modelFor('new').save().then(pipeline => {
        return this.transitionTo('steps', pipeline);
      });
    },
    cancel() {
      this.modelFor('new').rollbackAttributes();
      return this.transitionTo('index');
    }
  }
});

export default PipelinesNewRoute;
