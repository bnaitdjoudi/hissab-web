export interface Account {
  id: number;
  acountName: string;
  totalAccount: number;
  isMain: boolean;
  type: string;
  parentId: number;
  path: string;
  isLeaf: boolean;
}
