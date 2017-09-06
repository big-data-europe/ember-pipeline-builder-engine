import Ember from 'ember';

const PipelinesStepsIndexRoute = Ember.Route.extend({
  store: Ember.inject.service('store'),
  model() {
    return this.modelFor('pipelines.steps').get('steps');
  },
  actions: {
    delete(step) {
      const index = step.get('order');
      step.destroyRecord();
      const steps = this.modelFor('pipelines.steps.index').sortBy('order');
      return Ember.run(() =>
        steps.forEach(function(step, i) {
          if (i > index) {
            step.set('order', i - 1);
            return step.save();
          }
        })
      );
    },
    newStep() {
      return this.transitionTo('pipelines.steps.new');
    },
    back() {
      return this.transitionTo('pipelines.index');
    }
  }
});

export default PipelinesStepsIndexRoute;
