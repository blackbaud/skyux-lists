import {
  Injectable
} from '@angular/core';

import {
  Observable,
  of
} from 'rxjs';

@Injectable()
export class DataManagerVisual2DataService {

  public getData(): Observable<any> {
    const items = [];

    for (let i = 0; i < 1000; i++) {
      items.push({
        col1: `Column 1 row ${i + 1} data`,
        col2: `Column 2 row ${i + 1} data`,
        col3: `Column 3 row ${i + 1} data`
      });
    }

    return of({
      items
    });
  }

}
