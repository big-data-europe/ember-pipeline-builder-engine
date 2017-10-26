import Ember from 'ember';

const InlineEditModelComponent = Ember.Component.extend({
  field: 'text',
  saveLabel: Ember.String.htmlSafe("<i class='material-icons'>done</i>"),
  value: Ember.computed('model', 'attr', function() {
    return this.get('model').get(this.get('attr'));
  }),
  shouldSendAction: false,
  actions: {
    changeAttr(attribute, value) {
      const _this = this;
      this.get('model').set(attribute, value);
      return this.get('model').save().then(model => {
        if(_this.get('shouldSendAction')){
          _this.sendAction('changedAttribute', model, attribute, value);
        }
        return model;
      });
    },
    rollback(attribute) {
      const oldValue = this.get('model').get(attribute);
      return this.set('value', oldValue);
    }
  }
});

export default InlineEditModelComponent;
