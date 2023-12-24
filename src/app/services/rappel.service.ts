import { Injectable } from '@angular/core';
import { RappelDataBase } from './databases/rappel.db';
import { Rappel } from '../model/rappel.model';
import { PagingData } from '../model/paging-data';
import { PagingRequest } from '../model/paging-request.model';
import { resolve } from 'cypress/types/bluebird';

@Injectable({
  providedIn: 'root',
})
export class RappelService {
  constructor(readonly rappelBd: RappelDataBase) {}

  async findAll(): Promise<Rappel[]> {
    return new Promise<Rappel[]>(async (resolve, reject) => {
      try {
        let rappels = await this.rappelBd.findAll();
        resolve(rappels);
      } catch (error) {
        reject('erreur avec la bd');
        console.error(error);
      }
    });
  }

  async create(rappel: Rappel): Promise<Rappel> {
    return new Promise<Rappel>(async (resolve, reject) => {
      try {
        let rappelResult = await this.rappelBd.create(rappel);

        resolve(rappelResult);
      } catch (error) {
        reject('problem durant excecusion de la requette');
        console.error(error);
      }
    });
  }

  async deleteById(id: number): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.rappelBd.deleteById([id]);
        resolve();
      } catch (error) {
        reject('erreur dans la cummunication avec la bd');
        console.error(error);
      }
    });
  }

  async findByPaging(request: PagingRequest): Promise<PagingData<Rappel>> {
    return new Promise<PagingData<Rappel>>(async (resolve, reject) => {
      try {
        let data = await this.rappelBd.findByPaging(request);

        resolve(data);
      } catch (error) {
        console.log(error);
        reject('erreur avec la bd');
      }
    });
  }

  async update(rappel: Rappel) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.rappelBd.update(rappel, rappel.id);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
