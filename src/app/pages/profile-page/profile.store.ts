import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProfileModel } from '../../model/profil.model';
import { ProfileStoreModel } from '../../model/profile-store.model';
import { ProfileService } from '../../services/profile.service';
import { Store } from '../../store/store';

@Injectable({ providedIn: 'root' })
export class ProfileStore extends Store<ProfileStoreModel> {
  profile$ = this.select((state) => state.profile);
  profileList$: Observable<ProfileModel[]> = this.select(
    (state) => state.listProfile
  );

  constructor(readonly profileService: ProfileService) {
    super({
      profile: {
        mail: '',
        firstName: '',
        lastName: '',
        phone: '',
        isAdmin: false,
      },
      listProfile: [],
    });

    this.loadProfile();
    this.loadListProfile();
  }
  async loadListProfile() {
    try {
      let profiles = await this.profileService.findAllProfiles();
      this.setProfileList(profiles);
    } catch (error) {
      console.log(error);
    }
  }
  loadProfile() {
    this.profileService
      .findProfile()
      .then((profile) => {
        this.setProfile(profile);
      })
      .catch((error) => console.error(error));
  }
  setProfile(profile: ProfileModel) {
    this.setState({ ...this.state, profile: profile });
  }

  async updateProfile(profil: ProfileModel): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.profileService.updateProfile(profil);
        this.loadProfile();
        resolve();
      } catch (error) {
        reject('erreur dans lexcecusion d ela requette');
        console.error(error);
      }
    });
  }

  setProfileList(profiles: ProfileModel[]) {
    this.setState({ ...this.state, listProfile: profiles });
  }

  async createProfile(profil: ProfileModel): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await this.profileService.creationProfile(profil);
        this.loadListProfile();
        resolve();
      } catch (error) {
        reject('ereur en appelant le service');
        console.error(error);
      }
    });
  }
}
