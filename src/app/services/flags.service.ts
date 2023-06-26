import { Injectable } from '@angular/core';
import { FlagsDataBase } from './databases/flags.db';
import { Flag } from '../model/flags.model';

@Injectable()
export class FlagsService {
  constructor(private flagsDb: FlagsDataBase) {}

  async findAllFlags(): Promise<Flag[]> {
    return this.flagsDb.findAll();
  }

  async createFlag(flag: Flag): Promise<any> {
    return this.flagsDb.create(flag);
  }
}
