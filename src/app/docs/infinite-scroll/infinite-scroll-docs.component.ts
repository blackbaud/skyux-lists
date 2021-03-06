import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

let nextId = 0;

@Component({
  selector: 'app-infinite-scroll-docs',
  templateUrl: './infinite-scroll-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteScrollDocsComponent implements OnInit {

  public data: any[] = [];

  public hasMore = true;

  constructor(
    private changeRef: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.addData();
  }

  public onScrollEnd(): void {
    if (this.hasMore) {
      this.addData();
    }
  }

  private addData(): void {
    this.mockRemote().then((result: any) => {
      this.data = this.data.concat(result.data);
      this.hasMore = result.hasMore;
      this.changeRef.markForCheck();
    });
  }

  private mockRemote(): Promise<any> {
    const data: any[] = [];

    for (let i = 0; i < 8; i++) {
      data.push({
        name: `Item #${++nextId}`
      });
    }

    // Simulate async request.
    return new Promise((resolve: any) => {
      setTimeout(() => {
        resolve({
          data,
          hasMore: (nextId < 50)
        });
      }, 1000);
    });
  }
}
