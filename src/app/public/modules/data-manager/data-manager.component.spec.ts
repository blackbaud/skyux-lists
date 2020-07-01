import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  SkyUIConfigService
} from '@skyux/core';

import {
  expect
} from '@skyux-sdk/testing';

import {
  Subject
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

describe('SkyDataManagerComponent', () => {
  let dataManagerFixture: ComponentFixture<DataManagerFixtureComponent>;
  let dataManagerComponent: DataManagerFixtureComponent;
  let dataManagerNativeElement: HTMLElement;
  let dataManagerService: SkyDataManagerService;
  let uiConfigService: SkyUIConfigService;

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
    dataManagerNativeElement = dataManagerFixture.nativeElement;
    dataManagerComponent = dataManagerFixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);
    uiConfigService = TestBed.inject(SkyUIConfigService);
  });

  it('should set the data manager config via the data manager service on initialization', () => {
    spyOn(dataManagerService, 'updateDataManagerConfig');
    dataManagerFixture.detectChanges();

    expect(dataManagerService.updateDataManagerConfig).toHaveBeenCalledWith(dataManagerComponent.dataManagerConfig);
  });

  it('should set the data state via the data manager service with the default if no settings key is provided', () => {
    spyOn(dataManagerService, 'updateDataState');
    dataManagerFixture.detectChanges();

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(dataManagerComponent.dataState, 'dataManager');
  });

  describe('with settings key provided', () => {
    const key = 'key';
    let dataState: SkyDataManagerState;
    let uiConfigServiceGetObservable: Subject<any>;
    let uiConfigServiceSetObservable: Subject<any>;

    beforeEach(() => {
      dataState = new SkyDataManagerState({});
      uiConfigServiceGetObservable = new Subject<any>();
      uiConfigServiceSetObservable = new Subject<any>();
    });

    it('should request a data state from the ui config service', async(() => {
      spyOn(uiConfigService, 'getConfig').and.returnValue(uiConfigServiceGetObservable);
      dataManagerComponent.settingsKey = key;
      dataManagerComponent.dataState = dataState;
      dataManagerFixture.detectChanges();

      dataManagerFixture.whenStable().then(() => {
        expect(uiConfigService.getConfig).toHaveBeenCalledWith(key, dataState.getStateOptions());
      });
    }));

    it('should update the data state via the data manager service when the ui config service returns a data state', async(() => {
      spyOn(uiConfigService, 'getConfig').and.returnValue(uiConfigServiceGetObservable);
      spyOn(dataManagerService, 'updateDataState');
      dataManagerComponent.settingsKey = key;
      dataManagerComponent.dataState = dataState;
      dataManagerFixture.detectChanges();

      dataManagerFixture.whenStable().then(() => {
        uiConfigServiceGetObservable.next(dataState.getStateOptions());
        expect(uiConfigService.getConfig).toHaveBeenCalledWith(key, dataState.getStateOptions());
        expect(dataManagerService.updateDataState).toHaveBeenCalledWith(dataState, 'dataManager');
      });
    }));

    it('should update the ui config service when the data state changes', async(() => {
      const newDataState = new SkyDataManagerState({ searchText: 'test' });
      spyOn(uiConfigService, 'getConfig').and.returnValue(uiConfigServiceGetObservable);
      dataManagerComponent.settingsKey = key;
      dataManagerComponent.dataState = dataState;
      dataManagerFixture.detectChanges();

      dataManagerFixture.whenStable().then(() => {
        spyOn(uiConfigService, 'setConfig').and.returnValue(uiConfigServiceSetObservable);
        dataManagerService.updateDataState(newDataState, sourceId);

        expect(uiConfigService.setConfig).toHaveBeenCalled();
      });
    }));

    it('should log an error when unable to update the ui config service when the data state changes', async(() => {
      const newDataState = new SkyDataManagerState({ searchText: 'test' });
      const errorMessage = 'something went wrong';
      spyOn(uiConfigService, 'getConfig').and.returnValue(uiConfigServiceGetObservable);
      dataManagerComponent.settingsKey = key;
      dataManagerComponent.dataState = dataState;
      dataManagerFixture.detectChanges();

      dataManagerFixture.whenStable().then(() => {
        spyOn(uiConfigService, 'setConfig').and.returnValue(uiConfigServiceSetObservable);
        spyOn(console, 'warn');
        dataManagerService.updateDataState(newDataState, sourceId);

        uiConfigServiceSetObservable.error(errorMessage);
        expect(uiConfigService.setConfig).toHaveBeenCalled();
        expect(console.warn).toHaveBeenCalledWith(errorMessage);
      });
    }));
  });

  it('should pass accessibility', async(() => {
    expect(dataManagerNativeElement).toBeAccessible();
  }));
});
