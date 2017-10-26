import Ember from 'ember';

const PipelinesStepsIndexController = Ember.Controller.extend({
  stepSorting: ['order'],
  sortedSteps: Ember.computed.sort('model.steps', 'stepSorting'),
  saveLabel: Ember.String.htmlSafe("<i class='material-icons'>done</i>"),

  dockerFile: Ember.computed.alias('model.dockerFile'),
  dockerServices: Ember.computed.alias('model.dockerServices'),
  services: Ember.computed('model.dockerServices.@each.step.id', function(){
    return this.get('dockerServices').filter(service => {
      return service.get('step.id') == null;
    });
  }),
  reorderingSteps: false,
  draggingItem: false,

  actions: {
    toggleCollapse(step){
      step.toggleProperty('collapsed');
    },
    setSelectedService(step, service) {
      return step.linkToService(service);
    },
    reorderSteps(steps, draggedStep) {
      const _this = this;
      this.set('reorderingSteps', true);
      draggedStep.removeLinksForStep().then(res1 => {
        let promises = [];
        steps.forEach((step, i) => {
          step.set('order', i);
          return promises.push(step.save());
        });
        return Ember.RSVP.all(promises).then(res2 => {
          return draggedStep.insertLinksForStep().then(res3 => {
            _this.set('reorderingSteps', false);
            return draggedStep;
          })
        })
      });
    },
    rollback(step) {
      return step.rollbackAttributes();
    }
  }
});

export default PipelinesStepsIndexController;
