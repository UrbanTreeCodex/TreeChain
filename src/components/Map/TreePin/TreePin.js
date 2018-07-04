import React, { PureComponent } from 'react';

const pin = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;

const tree =
  'M50,9.32,20.37,19.8l3.81,31,6,4.75,1.2,9.83L48,78.53V87H39.58a2,2,0,1,0,0,4H60.42a2,2,0,0,0,0-4H52V78.53L68.61,65.41l1.21-9.83,6-4.75,3.81-31Zm22.05,39.4-6,4.75-1.21,9.83L52,73.43V54.66l9-9a2,2,0,0,0-2.83-2.83L52,49V34.06a2,2,0,0,0-4,0V57.64l-5.93-5.93a2,2,0,0,0-2.83,2.83L48,63.29V73.43L35.16,63.29,34,53.46l-6-4.75L24.73,22.5,50,13.56,75.27,22.5Z';

const pinStyle = {
  cursor: 'pointer',
  fill: 'green',
  stroke: 'none'
};

export default class TreePin extends PureComponent {
  render() {
    const { size = 100, onClick } = this.props;

    return (
      <svg
        height={size}
        viewBox="0 0 24 24"
        style={{
          ...pinStyle,
          transform: `translate(${-size / 2}px,${-size}px)`
        }}
        onClick={onClick}
      >
        ><path d={pin} />
      </svg>
    );
  }
}
