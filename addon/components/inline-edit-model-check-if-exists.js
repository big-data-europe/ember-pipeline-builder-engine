import Ember from 'ember';

const InlineEditModelComponentCheckIfExists = Ember.Component.extend({
  store: Ember.inject.service('store'),
  field: 'text',
  saveLabel: Ember.String.htmlSafe("<i class='material-icons'>done</i>"),
  value: Ember.computed('model', 'attr', function() {
    return this.get('model').get(this.get('attr'));
  }),

  actions: {
    changeAttr(attribute, value) {
      if(this.get('model').get(attribute) === value) {
        // Value didn't change, get out
        return false;
      }

      let _this = this;
      let options = {filter: {}, include: 'pipeline'};
      options.filter[":exact:"+attribute] = value;
      return this.get('store').query('step', options).then(steps => {
        if(steps.get('length') > 0) {
          // At least one step code with that name, ask confirmation from user
          let names = [];
          steps.forEach(item => {
            if(!names.includes(item.get('pipeline.title'))) {
              names.push(item.get('pipeline.title'));
            }
          });
          let pipelines = names.join(', ');
          let confirmed = confirm("The step code you provided appears to be used in the following workflows: ["+pipelines+"].\n\nThis might confuse your workflow manager, proceed with caution.");
          if(confirmed) {
            _this.get('model').set(attribute, value);
            return _this.get('model').save();
          }
          const oldValue = _this.get('model').get(attribute);
          return _this.set('value', oldValue);
        }
        else {
          // No record with that attribute, go on ahead
          _this.get('model').set(attribute, value);
          return _this.get('model').save();
        }
      });
    },
    rollback(attribute) {
      const oldValue = this.get('model').get(attribute);
      return this.set('value', oldValue);
    }
  }
});

export default InlineEditModelComponentCheckIfExists;
