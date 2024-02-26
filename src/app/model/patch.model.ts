export interface Patchquery {
  codePatch: string;
  query: string;
}

export interface Patch {
  queries: Patchquery[];
}
