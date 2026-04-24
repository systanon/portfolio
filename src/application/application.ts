import { ref, type Ref } from 'vue'
import EventEmitter from 'eventemitter3'

import type { AuthApplication } from './auth.application'
import type { UserApplication } from './user.application'
import type { TodoApplication } from './todo.application'
import type { NoteApplication } from './note.application'
import type { StatisticApplication } from './statistic.application'

export class Application<
  EventTypes extends EventEmitter.ValidEventTypes = string | symbol,
  EventContext extends any = any,
> {
  private ee: EventEmitter = new EventEmitter()
  public todoApplication: TodoApplication
  public authApplication: AuthApplication
  public userApplication: UserApplication
  public noteApplication: NoteApplication
  public statisticApplication: StatisticApplication
  private _loading: Ref<boolean> = ref(false)
  private _pageTitle: Ref<string | null> = ref(null)

  constructor(
    authApplication: AuthApplication,
    userApplication: UserApplication,
    todoApplication: TodoApplication,
    noteApplication: NoteApplication,
    statisticApplication: StatisticApplication,
  ) {
    this.authApplication = authApplication
    this.userApplication = userApplication
    this.todoApplication = todoApplication
    this.noteApplication = noteApplication
    this.statisticApplication = statisticApplication
  }

  public get loading(): boolean {
    return this._loading.value
  }

  public get pageTitle() {
    return this._pageTitle.value
  }

  public setPageTitle(title: string) {
    this._pageTitle.value = title
  }

  public clearPageTitle() {
    this._pageTitle.value = null
  }

  public on<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn: EventEmitter.EventListener<EventTypes, T>,
    context?: EventContext,
  ): EventEmitter {
    return this.ee.on(event, fn, context)
  }

  public off<T extends EventEmitter.EventNames<EventTypes>>(
    event: T,
    fn?: EventEmitter.EventListener<EventTypes, T>,
    context?: EventContext,
    once?: boolean,
  ): EventEmitter {
    return this.ee.off(event, fn, context, once)
  }

  public async init() {
    this.userApplication.getProfile()
  }
}
