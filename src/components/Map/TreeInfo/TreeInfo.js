import React, {PureComponent} from 'react';

export default class TreeInfo extends PureComponent {

  render() {
    const {info} = this.props;
    const displayName = `${info.latitude}, ${info.longitude}`;

    return (
      <div>
        <div>
          {displayName} 
        </div>
        <img width={240} src={info.image} />
      </div>
    );
  }
}