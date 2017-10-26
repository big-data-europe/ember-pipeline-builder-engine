import Ember from 'ember';

export default Ember.Controller.extend({
  store: Ember.inject.service(),
  notify: Ember.inject.service('notify'),

  services: Ember.computed('model.pipeline.dockerFile', function(){
    return this.get('model.pipeline').then(function(pipeline){
      return pipeline.get('dockerFile').then(function(dockerFile){
        return dockerFile.get('dockerServices').filter(service => {
          return service.get('step.id') == null;
        });
      })
    })
  }),

  fillStepCode: function(step, service){
    // If the service already has a init daemon step code, check if user wants to use it (or use it by default if empty)
    const _this = this;
    service.getEnvironmentVariable("INIT_DAEMON_STEP").then(value => {
      _this.set('disableCode', false);
      let stepCode = value || step.get('code') || service.get('name');
      if(value) {
        _this.get('notify').info("Importing init daemon step code from service ["+service.get('name')+"].");
      }
      _this.set('model.code', stepCode);
      $('.step-code').children('.ember-text-field')[0].focus();
      Ember.run.later(function () {
        $('.step-code').children('.ember-text-field')[0].blur();
      });
    })
  },

  actions: {
    setSelectedService(step, service){
      if(service) {
        this.set('selectedService', service);
        this.fillStepCode(step, service);
      }
      else
      {
        this.set('selectedService', null);
      }
    },
    save(step, service) {
      let _this = this;
      let invalid = false;
      if (!service) {
        _this.get("notify").error("A service needs to be linked to this step.");
        invalid = true;
      }
      if(!step.get('code'))
      {
        _this.get("notify").error("A code needs to be specified for this step.");
        invalid = true;
      }
      if(!step.get('title'))
      {
        _this.get("notify").error("A title needs to be specified for this step.");
        invalid = true;
      }
      if(invalid){
        return null;
      }

      return step.linkNewStepToService(service).then(function () {
        return _this.transitionToRoute('steps', step.get('pipeline'));
      })

    },
    cancel(step) {
      step.get('pipeline').then(pipeline => {
        step.rollbackAttributes();
        return this.transitionToRoute('steps', pipeline.get('id'));
      });
    }
  }

});
