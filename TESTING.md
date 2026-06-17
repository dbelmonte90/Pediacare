# PediaCare — Manual Testing Guide

## Prerequisites

```bash
npx expo start
```

Scan the QR code with **Expo Go** (iOS / Android) or press `i` / `a` for the simulator.

---

## 1. First Launch

- App shows a loading spinner briefly while Zustand stores hydrate from AsyncStorage.
- After hydration, the Home screen appears with two demo profiles: **Sofía** (child) and **Mamá** (pregnancy).
- Active profile defaults to Sofía. Bottom tabs show: Home · Health · Nutrition · Development.

## 2. Profile Switching

- Tap the profile pill (top-right) to open the drawer.
- Switch to **Mamá** → bottom tabs update to show only **Pregnancy**. Confirm no crash.
- Switch back to **Sofía** → full child tab set reappears.
- Open drawer → tap **+ Añadir perfil** → complete both steps of the form → new profile appears in drawer.

## 3. Adaptive Navigation

| Active profile type | Expected tabs |
|---|---|
| child | Home · Health · Nutrition · Development |
| pregnancy | Pregnancy |

## 4. Home Screen

- Summary cards for Health, Nutrition, and Development populate with mock data for Sofía/Lucas.
- Switching to a new (empty) child profile shows empty-state cards instead of crashing.

## 5. Health Screen

- **Crecimiento** tab: percentile gauge and bar chart render. Tap **+ Registro** → fill form → new entry appears.
- **Vacunas** tab: vaccine list renders with toggle controls.
- **Síntomas** tab: tap **+ Síntoma** → fill form → entry appears in list.

## 6. Nutrition Screen

- **Alimentos** tab: food groups expand/collapse. Tap a food row to change its status. Reaction count in header updates reactively.
- **Diario** tab: tap **+ Registrar comida** → add foods → save → entry appears grouped by date.
- **Reacciones** tab: any foods/diary entries marked as reaction appear here.
- Adding/removing an allergy via the Alergias card persists across tab switches.

## 7. Development Screen

- Switching profiles triggers a re-render (stats and progress update immediately).
- **Resumen** tab: category progress bars reflect current achievements.
- **Hitos** tab: expand a group → tap a milestone → mark as achieved → count updates.
- **Logros** tab: achieved milestones listed by category. Tap ✕ to un-achieve.

## 8. Pregnancy Screen

- Only visible when the active profile is of type `pregnancy`.
- Week dots, weight chart, prenatal checklist, and FAQ all render without crashing.
- Add a weight entry → chart updates.
- Toggle a checklist item → state persists after switching away and back.

## 9. Persistence

1. Make a data change (e.g. mark a vaccine, add a diary entry).
2. Close Expo Go completely.
3. Reopen → same data is present. No flash of empty state.

## 10. Add Profile Flow

- Tap **+ Añadir perfil** in the drawer.
- **Pregnancy**: enter mother name, FUR (DD/MM/AAAA), FPP, blood type → save.
- **Child**: enter name, sex, birth date, blood type, allergies → save.
- New profile appears in the drawer and can be set as active.

## 11. Edge Cases

- No profiles: create all profiles from scratch after clearing AsyncStorage via the dev reset utility (`resetAppData()` in `src/shared/utils/resetAppData.ts`).
- Profile with no data: new child profile shows empty states in all tabs — no crash.
- Very young baby (0 months): development screen shows upcoming milestones only.
