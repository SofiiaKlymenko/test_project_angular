import { Component, OnInit } from '@angular/core';
import { fromEvent, interval, BehaviorSubject } from 'rxjs';
import { buffer, debounceTime, filter, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  subscription;
  currentSecond = new BehaviorSubject({
    count: false,
    state: 0,
    wait: false
  });

  ngOnInit() {
    const button = document.querySelector('#wait');
    const mouse$ = fromEvent(button, 'click');

    const buff$ = mouse$.pipe(
      debounceTime(300),
    )

    const click$ = mouse$.pipe(
      buffer(buff$),
      map(list => {
        return list.length;
      }),
      filter(x => x === 2),
    )

    click$.subscribe(() => {
      this.waitClicked();
    })
  }

  startTimer() {
    this.subscription = interval(1000).pipe(tap((value) => {
      const state = this.currentSecond.getValue().state;

      this.currentSecond.next({
        state: state + 1,
        count: true,
        wait: false
      });
    })).subscribe();
  }

  stopTimer() {
    this.currentSecond.next({
      state: this.currentSecond.getValue().state,
      count: false,
      wait: false
    });
    this.subscription.unsubscribe();
  }

  startClicked() {
    if (!this.currentSecond.getValue().count) {
      this.startTimer();
    }
  }

  stopClicked() {
    this.stopTimer();
    this.resetTimer();
  }

  waitClicked() {
    this.stopTimer();
    this.currentSecond.next({
      state: this.currentSecond.getValue().state,
      count: false,
      wait: true
    });
  }

  resetTimer() {
    this.stopTimer();
    this.currentSecond.next({
      state: 0,
      count: false,
      wait: false
    });
  }

  resetClicked() {
    this.resetTimer();
    this.startTimer();
  }

  secondsToHms(d) {
    return new Date(d * 1000).toISOString().substr(11, 8);
  }

}
