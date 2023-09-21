export interface LeafAccount {
  id: number;
  acountName: string;
  path: string;
  isLeaf: boolean;
  type: string;
  balance?: number;
}
