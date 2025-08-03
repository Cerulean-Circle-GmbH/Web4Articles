// SimpleTaskStateMachine.ts (migrated from UpDown/temp)
// Minimal OOP state machine for task status

export type StatusState = 'open' | 'in-progress' | 'qa-review' | 'done' | 'blocked';

export class SimpleTaskStateMachine {
  private state: StatusState = 'open';

  getState() {
    return this.state;
  }

  startProgress() {
    if (this.state === 'open') {
      this.state = 'in-progress';
    }
  }

  submitForQA() {
    if (this.state === 'in-progress') {
      this.state = 'qa-review';
    }
  }

  markDone() {
    if (this.state === 'qa-review') {
      this.state = 'done';
    }
  }

  block() {
    if (this.state !== 'blocked' && this.state !== 'done') {
      this.state = 'blocked';
    }
  }

  unblock() {
    if (this.state === 'blocked') {
      this.state = 'open';
    }
  }
}
