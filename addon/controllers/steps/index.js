import Ember from 'ember';

const PipelinesStepsIndexController = Ember.Controller.extend({
  stepSorting: ['order'],
  sortedSteps: Ember.computed.sort('model', 'stepSorting'),
  saveLabel: Ember.String.htmlSafe("<i class='material-icons'>done</i>"),
  actions: {
    reorderSteps(steps, draggedStep) {
      return steps.forEach((step, i) => {
        step.set('order', i);
        return step.save();
      });
    },
    changeAttr(step, attribute, value) {
      step.set(attribute, value);
      return step.save();
    },
    rollback(step) {
      return step.rollbackAttributes();
    }
  }
});

export default PipelinesStepsIndexController;
