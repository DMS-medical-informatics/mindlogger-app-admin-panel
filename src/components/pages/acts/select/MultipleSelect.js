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
  constructor(props){
    super(props);
    this.handler = this.props.handler.bind(this);
    this.state = {
      name: []
    };
  }

  handleChange = event => {
    const { menu } = this.props;
    this.setState({ name: event.target.value });
    this.props.handler({'filter': menu.name, 'ids': event.target.value});
  };

  render() {
    const { menu } = this.props;
    let names = this.state.name.map((group)=>{
      for (var item=0; item<menu.items.length; item++) {
        if (menu.items[item] && menu.items[item]._id===group) {
          return menu.items[item].name;
        }
      }
    }).join(', ');
    return (
      <div className={menu.name + "-class multipleSelectRoot"}>
        <FormControl className={menu.name + "-class multipleSelectSelect"}>
          <Select
            multiple
            value={this.state.name}
            name={names}
            onChange={this.handleChange}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => names}
          >
            {menu.items ? menu.items.map(item => (item &&
              <MenuItem key={item._id} value={item._id}>
                <Checkbox checked={this.state.name.indexOf(item._id) > -1} />
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
