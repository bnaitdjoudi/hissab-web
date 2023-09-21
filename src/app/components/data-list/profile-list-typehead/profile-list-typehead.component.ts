import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProfileModel } from 'src/app/model/profil.model';

@Component({
  selector: 'profile-list-typehead',
  templateUrl: './profile-list-typehead.component.html',
  styleUrls: ['./profile-list-typehead.component.scss'],
})
export class ProfileListTypeheadComponent implements OnInit {
  @Input() set items(items: ProfileModel[]) {
    this.filteredItems = items;
  }
  @Input() selectedItems: string[] = [];
  @Input() title = 'Select Items';
  @Input() value: string;

  @Output() selectionCancel = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<ProfileModel>();

  filteredItems: ProfileModel[] = [];
  workingSelectedValues: string[] = [];

  ngOnInit() {
    this.workingSelectedValues = [...this.selectedItems];
  }

  trackItems(index: number, item: ProfileModel) {
    return item.mail;
  }

  cancelChanges() {
    this.selectionCancel.emit();
  }

  confirmChanges() {
    this.selectionChange.emit(
      this.filteredItems.find((el) => this.value === el.mail)
    );
  }

  searchbarInput(ev: any) {
    this.filterList(ev.target.value);
  }

  /**
   * Update the rendered view with
   * the provided search query. If no
   * query is provided, all data
   * will be rendered.
   */
  filterList(searchQuery: string | undefined) {
    /**
     * If no search query is defined,
     * return all options.
     */
    if (searchQuery === undefined) {
      this.filteredItems = [...this.items];
    } else {
      /**
       * Otherwise, normalize the search
       * query and check to see which items
       * contain the search query as a substring.
       */
      const normalizedQuery = searchQuery.toLowerCase();
      this.filteredItems = this.items.filter((item) => {
        return (item.firstName + item.lastName)
          .toLowerCase()
          .includes(normalizedQuery);
      });
    }
  }

  isChecked(value: string) {
    return this.workingSelectedValues.find((item) => item === value);
  }

  radioChange(ev: any) {
    const { checked, value } = ev.detail;

    this.value = value;
  }
}
