import TREES from '../data/TREES.json';

import T from 'transmute-framework';

const eventStoreFactoryArtifact = require('../contracts/EventStoreFactory.json');
const eventStoreArtifact = require('../contracts/EventStore.json');
const transmuteConfig = require('../transmute-config');
const eventStoreFactory = new T.EventStoreFactory({
  eventStoreFactoryArtifact,
  ...transmuteConfig
});

const filter = event => {
  // process all events
  return event.key.type === 'TREE_ADDED';
};

const reducer = (state, event) => {
  console.log(state, event);
  let trees = (state && state.trees) || [];

  switch (event.key.type) {
    case 'TREE_ADDED': {
      return {
        ...state,
        trees: [...trees, event.value]
      };
    }

    default: {
      return state;
    }
  }
};

export const getTreeModelFromStream = async address => {
  const eventStore = new T.EventStore({
    eventStoreArtifact,
    ...transmuteConfig
  });
  eventStore.eventStoreContractInstance = await eventStore.eventStoreContract.at(
    address
  );
  const streamModel = new T.StreamModel(eventStore, filter, reducer, {
    trees: []
  });
  await streamModel.sync();
  // console.log('streamModel: ', streamModel)
  return streamModel.state;
};

export const getStartState = async () => {
  await eventStoreFactory.init();
  const accounts = await eventStoreFactory.getWeb3Accounts();
  let eventStoreAddresses = await eventStoreFactory.getEventStores();
  console.log(eventStoreAddresses);
  let eventStoreAddress;
  if (eventStoreAddresses.length) {
    eventStoreAddress = eventStoreAddresses[0];
  } else {
    await eventStoreFactory.createEventStore(accounts[0]);
    eventStoreAddresses = await eventStoreFactory.getEventStores();
    eventStoreAddress = eventStoreAddresses[eventStoreAddresses.length - 1];
  }

  return {
    accounts,
    eventStoreAddress,
    trees: TREES,
    streamModel: await getTreeModelFromStream(eventStoreAddress)
  };
};

export const saveTree = async state => {
  console.log('save the tree...', this.state);
  const eventStore = new T.EventStore({
    eventStoreArtifact,
    ...transmuteConfig
  });
  eventStore.eventStoreContractInstance = await eventStore.eventStoreContract.at(
    state.eventStoreAddress
  );
  let event = {
    key: {
      type: 'TREE_ADDED'
    },
    value: {
      image: state.image,
      latitude: state.latitude,
      longitude: state.longitude
    }
  };

  console.log('save event...', event)
  let result = await eventStore.write(
    state.accounts[0],
    event.key,
    event.value
  );
  console.log(result);
};
