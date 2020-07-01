import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  Observable
} from 'rxjs';

import {
  DataManagerFixtureComponent
} from './fixtures/data-manager.component.fixture';

import {
  DataManagerFixtureModule
} from './fixtures/data-manager.module.fixture';

import {
  DataViewCardFixtureComponent
} from './fixtures/data-manager-card-view.component.fixture';

import {
  DataViewRepeaterFixtureComponent
} from './fixtures/data-manager-repeater-view.component.fixture';

import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState
} from '../../public_api';

describe('SkyDataManagerService', () => {
  let dataManagerFixture: ComponentFixture<DataManagerFixtureComponent>;
  let dataManagerComponent: DataManagerFixtureComponent;
  let dataManagerService: SkyDataManagerService;
  let initialDataState: SkyDataManagerState;

  const sourceId = 'test';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataManagerFixtureComponent,
        DataViewCardFixtureComponent,
        DataViewRepeaterFixtureComponent
      ],
      imports: [
        DataManagerFixtureModule,
        SkyDataManagerModule
      ]
    });

    dataManagerFixture = TestBed.createComponent(DataManagerFixtureComponent);
    dataManagerComponent = dataManagerFixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);
    initialDataState = dataManagerComponent.dataState;

    dataManagerFixture.detectChanges();
  });

  describe('dataState', () => {
    const dataStateUpdate = new SkyDataManagerState({
      searchText: 'testChange'
    });

    it('getCurrentDataState should return the current data state of the data manager', () => {
      expect(dataManagerService.getCurrentDataState()).toEqual(initialDataState);
    });

    it('should update the data state of all subscribed components', () => {
      expect(dataManagerService.getCurrentDataState()).toEqual(initialDataState);

      dataManagerService.updateDataState(dataStateUpdate, 'test');

      expect(dataManagerService.getCurrentDataState()).toEqual(dataStateUpdate);
      expect(dataManagerComponent.dataState).toEqual(dataStateUpdate);
    });

    describe('getDataStateUpdates observable', () => {
      let dataState: SkyDataManagerState;
      let dataStateObservable: Observable<SkyDataManagerState>;

      beforeEach(() => {
        dataStateObservable = dataManagerService.getDataStateUpdates(sourceId);
        dataState = dataManagerService.getCurrentDataState();

        dataStateObservable.subscribe(state => {
          dataState = state;
        });
      });

      it('should emit new values when the sourceId of the change is different from the given sourceId', () => {
        const startingDataState = dataState;

        expect(dataState).toEqual(startingDataState);

        dataManagerService.updateDataState(dataStateUpdate, 'differentId');

        expect(dataState).not.toEqual(startingDataState);
        expect(dataState).toEqual(dataStateUpdate);
      });

      it('should not emit new values when the sourceId of the change matches the given sourceId', () => {
        const startingDataState = dataState;

        expect(dataState).toEqual(startingDataState);

        dataManagerService.updateDataState(dataStateUpdate, sourceId);

        expect(dataState).toEqual(startingDataState);
      });
    });
  });

  describe('dataManagerConfig', () => {
    const dataConfigUpdate = {
      additionalOptions: {
        test: 'data'
      }
    };

    it('getCurrentDataManagerConfig should return the current config of the data manager', () => {
      expect(dataManagerService.getCurrentDataManagerConfig()).toEqual(dataManagerComponent.dataManagerConfig);
    });

    it('updateDataManagerConfig should update the config of all subscribed components', () => {
      expect(dataManagerService.getCurrentDataState()).toEqual(initialDataState);

      dataManagerService.updateDataManagerConfig(dataConfigUpdate);

      expect(dataManagerService.getCurrentDataManagerConfig()).toEqual(dataConfigUpdate);
    });

    it('getDataManagerConfigUpdates observable should emit new config values', () => {
      const initialDataConfig = dataManagerService.getCurrentDataManagerConfig();
      const dataConfigObservable = dataManagerService.getDataManagerConfigUpdates();
      let dataConfig = initialDataConfig;

      dataConfigObservable.subscribe(config => {
        dataConfig = config;
      });

      expect(dataConfig).toEqual(initialDataConfig);

      dataManagerService.updateDataManagerConfig(dataConfigUpdate);

      expect(dataConfig).not.toEqual(initialDataConfig);
      expect(dataConfig).toEqual(dataConfigUpdate);
    });
  });

  describe('activeViewId', () => {
    const newActiveViewId = 'cardsView';

    it('updateActiveViewId should update the active view id and emit it to all subscribed components', () => {

      expect(dataManagerComponent.activeViewId).not.toEqual(newActiveViewId);

      dataManagerService.updateActiveViewId(newActiveViewId);

      expect(dataManagerComponent.activeViewId).toEqual(newActiveViewId);
    });

    it('getActiveViewIdUpdates observable should emit new id values', () => {
      const initialActiveViewId = dataManagerComponent.activeViewId;
      const activeViewIdObservable = dataManagerService.getActiveViewIdUpdates();
      let activeViewId = initialActiveViewId;

      activeViewIdObservable.subscribe(id => {
        activeViewId = id;
      });

      expect(activeViewId).toEqual(initialActiveViewId);

      dataManagerService.updateActiveViewId(newActiveViewId);

      expect(activeViewId).not.toEqual(initialActiveViewId);
      expect(activeViewId).toEqual(newActiveViewId);
    });
  });

  describe('views', () => {
    it('getViewById should return the SkyDataViewConfig with the given id', async(() => {
      dataManagerFixture.whenStable().then(() => {
        const repeaterViewConfig = dataManagerComponent.repeaterView.viewConfig;

        expect(dataManagerService.getViewById(repeaterViewConfig.id)).toEqual(repeaterViewConfig);
      });
    }));

    describe('registerOrUpdateView', () => {
      it('registers a new view config when it is not already registered', async(() => {
        dataManagerFixture.whenStable().then(() => {
          const newView = { id: 'newView', name: 'newView' };

          expect(dataManagerService.getViewById(newView.id)).toBeUndefined();

          dataManagerService.registerOrUpdateView(newView);

          expect(dataManagerService.getViewById(newView.id)).toEqual(newView);
        });
      }));

      it('updates a view config when it is already registered', async(() => {
        dataManagerFixture.whenStable().then(() => {
          const repeaterViewConfig = dataManagerComponent.repeaterView.viewConfig;
          const modifiedConfig = {
            id: repeaterViewConfig.id,
            name: 'new name'
          };

          let registeredConfig = dataManagerService.getViewById(repeaterViewConfig.id);

          expect(registeredConfig).toEqual(repeaterViewConfig);
          expect(registeredConfig).not.toEqual(modifiedConfig);

          dataManagerService.registerOrUpdateView(modifiedConfig);
          registeredConfig = dataManagerService.getViewById(repeaterViewConfig.id);

          expect(registeredConfig).not.toEqual(repeaterViewConfig);
          expect(registeredConfig).toEqual(modifiedConfig);
        });
      }));
    });
  });
});
