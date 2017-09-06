import Ember from 'ember';

const InlineEditModelComponent = Ember.Component.extend({
  field: 'text',
  saveLabel: Ember.String.htmlSafe("<i class='material-icons'>done</i>"),
  value: Ember.computed('model', 'attr', function() {
    return this.get('model').get(this.get('attr'));
  }),
  actions: {
    changeAttr(attribute, value) {
      this.get('model').set(attribute, value);
      return this.get('model').save();
    },
    rollback(attribute) {
      const oldValue = this.get('model').get(attribute);
      return this.set('value', oldValue);
    }
  }
});

export default InlineEditModelComponent;
