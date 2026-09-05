import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable, subscribeOn, Subscriber } from 'rxjs';

// Observables -> For managing events & streamed data
// Signals -> For managing application state

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  clickCount = signal(0);
  // converting signal to observables here
  clickCount$ = toObservable(this.clickCount);
  // converting observables to signal here
  interval$ = interval(1000);
  // observables do not have a initial value
  intervalSignal = toSignal(this.interval$, { initialValue: 0 });

  // interval = signal(0);
  // doubleInterval = computed(() => this.interval() * 2);
  // private destroyRef = inject(DestroyRef);

  // Custom observable here
  customInterval$ = new Observable((subscriber) => {
    let timesExecuted = 0;

    const interval = setInterval(() => {
      if (timesExecuted > 3) {
        clearInterval(interval);
        subscriber.complete();
        return;
      }
      console.log('Emitting new value...');
      subscriber.next({ message: 'New value' });
      timesExecuted++;
    }, 2000);
  });

  constructor() {
    // effect(() => {
    //   console.log(`Clicked button ${this.clickCount()} times`);
    // });
    // toObservable(this.clickCount);
  }

  ngOnInit(): void {
    // setInterval(() => {
    //   this.interval.update((prev) => prev + 1);
    // }, 1000);
    // const subscription = interval(1000)
    //   .pipe(map((val) => val * 2))
    //   .subscribe({
    //     next: (val) => console.log(val),
    //   });
    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // });
    // const subscription = this.clickCount$.subscribe({
    //   next: (val) =>  console.log(`Clicked button ${this.clickCount()} times`);
    // })
    // this.destroyRef.onDestroy(() => {
    //   subscription.unsubscribe();
    // });

    this.customInterval$.subscribe({
      next: (val) => console.log(val),
      complete: () => console.log('COMPLETED!'),
      error: () => console.log('err'),
    });
  }

  onClick() {
    this.clickCount.update((prev) => prev + 1);
  }
}
