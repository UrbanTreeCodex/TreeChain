import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import T from 'transmute-framework';

import withRoot from '../withRoot';

import Map from '../Map';

import * as TreeService from '../../tree-service';

console.log(TreeService);

var ipfsAPI = require('ipfs-api');

const styles = theme => ({
  root: {
    // textAlign: 'center',
    // paddingTop: theme.spacing.unit * 20
  }
});

let lastClick = {
  latitude: 30.3072,
  longitude: -97.756
};

class Index extends React.Component {
  state = {
    open: false,
    image: 'http://via.placeholder.com/350x150',
    ...lastClick
  };

  async componentWillMount() {
    const stateFromTreeService = await TreeService.getStartState();
    console.log(stateFromTreeService);

    this.setState({
      ...stateFromTreeService
    });
  }

  upload = () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const ipfs = ipfsAPI('localhost', 5001); // Connect to IPFS
      const buf = Buffer(reader.result); // Convert data into buffer
      ipfs.files.add(buf, (err, result) => {
        // Upload buffer to IPFS
        if (err) {
          console.error(err);
          return;
        }
        let url = `http://localhost:8080/ipfs/${result[0].hash}`;
        this.setState({
          image: url
        });
      });
    };
    const photo = document.getElementById('photo');
    reader.readAsArrayBuffer(photo.files[0]); // Read Provided File
  };

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  handleClick = () => {
    this.setState({
      open: true
    });
  };

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSaveTree = async () => {
    console.log('about to save: ', this.state);
    await TreeService.saveTree(this.state);
  };

  onClick = event => {
    let lastClick = {
      longitude: event.lngLat[0],
      latitude: event.lngLat[1]
    };

    this.setState({
      ...lastClick
    });
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;

    if (!this.state.streamModel) {
      return null;
    }

    let modelTrees = this.state.streamModel.model
      ? this.state.streamModel.model.trees
      : [];

    return (
      <div className={classes.root}>
        <pre>{JSON.stringify(this.state.lastClick)}</pre>
        <Map trees={modelTrees} onClick={this.onClick}>
          <div className="control-panel">
            <Typography variant="display1" gutterBottom>
              TreeChain
            </Typography>
            <Typography variant="subheading" gutterBottom>
              IPFS + Ethereum Tree Tracker.
            </Typography>
            <img src={this.state.image} alt='tree img' style={{width: '100%'}}/>
            <input type="file" name="photo" id="photo" />
            <Button color="primary" onClick={this.upload}>
              Upload Image
            </Button>

            <br />
            <TextField
              id="latitude"
              label="Latitude"
              className={classes.textField}
              value={this.state.latitude}
              onChange={this.handleChange('latitude')}
              margin="normal"
            />
            <br />
            <TextField
              id="longitude"
              label="Longitude"
              className={classes.textField}
              value={this.state.longitude}
              onChange={this.handleChange('longitude')}
              margin="normal"
            />
            <br />
            <Button
              color="primary"
              variant="raised"
              onClick={this.handleSaveTree}
            >
              Add Tree
            </Button>
          </div>
        </Map>
      </div>
    );
  }
}

Index.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(Index));
