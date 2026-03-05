import { atom } from "jotai";

export const mobileHeaderSheetOpenAtom = atom(false);
export const mobileSettingsDialogOpenAtom = atom(false);

const shouldOpenSettingsAfterSheetCloseAtom = atom(false);
const shouldReopenSheetAfterSettingsCloseAtom = atom(false);

export const onMobileHeaderSheetOpenChangeAtom = atom(
  null,
  (get, set, nextOpen: boolean) => {
    set(mobileHeaderSheetOpenAtom, nextOpen);

    if (!nextOpen && get(shouldOpenSettingsAfterSheetCloseAtom)) {
      set(shouldOpenSettingsAfterSheetCloseAtom, false);
      set(mobileSettingsDialogOpenAtom, true);
    }

    if (nextOpen) {
      set(shouldOpenSettingsAfterSheetCloseAtom, false);
    }
  }
);

export const openSettingsFromMobileSheetAtom = atom(null, (_get, set) => {
  set(shouldReopenSheetAfterSettingsCloseAtom, true);
  set(shouldOpenSettingsAfterSheetCloseAtom, true);
  set(onMobileHeaderSheetOpenChangeAtom, false);
});

export const onMobileSettingsDialogOpenChangeAtom = atom(
  null,
  (get, set, nextOpen: boolean) => {
    set(mobileSettingsDialogOpenAtom, nextOpen);

    if (!nextOpen && get(shouldReopenSheetAfterSettingsCloseAtom)) {
      set(shouldReopenSheetAfterSettingsCloseAtom, false);
      set(onMobileHeaderSheetOpenChangeAtom, true);
    }
  }
);
