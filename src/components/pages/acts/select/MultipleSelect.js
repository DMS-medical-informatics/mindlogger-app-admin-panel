import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';

class MultipleSelect extends React.Component {
  constructor(){
    super();
    this.state = {
      name: []
    };
  }

  handleChange = event => {
    this.setState({ name: event.target.value });
  };

  render() {
    const { menu } = this.props;
    return (
      <div className={menu.name + "-class multipleSelectRoot"}>
        <FormControl className={menu.name + "-class multipleSelectSelect"}>
          <Select
            multiple
            value={this.state.name}
            name={this.state.name.join(', ')}
            onChange={this.handleChange}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => selected.join(', ')}
          >
            {menu.items ? menu.items.map(item => (item &&
              <MenuItem key={item._id} value={item.name}>
                <Checkbox checked={this.state.name.indexOf(item.name) > -1} />
                <ListItemText primary={(item.meta && item.meta.shortName && item.meta.shortName != item.name) ? item.meta.shortName + " (" + item.name + ")" : item.name} />
              </MenuItem>
            )) : []}
          </Select>
        </FormControl>
        <div className="greyTriangleDown"></div>
      </div>
    );
  }
}

export default (MultipleSelect);
