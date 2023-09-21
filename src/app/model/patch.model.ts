export interface PatchQuery {
  codePatch: string;
  query: string;
}

export interface Patch {
  queries: PatchQuery[];
}
