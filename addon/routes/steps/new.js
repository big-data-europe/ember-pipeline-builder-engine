import Ember from 'ember';

const PipelinesStepsNewRoute = Ember.Route.extend({
  store: Ember.inject.service('store'),
  beforeModel() {
    const _this = this;
    const pipeline = this.modelFor('steps');
    return pipeline.get('dockerFile').then(function(dockerFile) {
      return dockerFile.get('dockerServices').then(services => {
        let unlinked = services.filter(service => {
          return service.get('step.id') == null;
        });
        if(unlinked.get('length') === 0)
        {
          _this.transitionTo('steps');
        }
      });
    });
  },
  model() {
    let _this = this;
    const pipeline = this.modelFor('steps');
    return pipeline.get('steps').then(function(steps){
      return _this.get('store').createRecord('step', {
        order: steps.get('length'),
        pipeline
      });
    });
  },

  resetController(controller, isExiting, transition){
    if(isExiting)
    {
      controller.set('selectedService', null);
    }
  }
});

export default PipelinesStepsNewRoute;
