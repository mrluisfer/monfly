import { atom } from "jotai";

export const mobileHeaderSheetOpenAtom = atom(false);

export const onMobileHeaderSheetOpenChangeAtom = atom(
  null,
  (_get, set, nextOpen: boolean) => {
    set(mobileHeaderSheetOpenAtom, nextOpen);
  }
);
