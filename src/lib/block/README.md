# CRM admin & end user blocks

This is the place for all block types (kinds), their edit and view components.

## File structure
```
/*.js                classes for all known kinds
  /BuilderEdit/...         editor components (what we show to admin, when block is edited)
  /BuilderPreview/...      previewer components (what we show to the admin)
  /Edit/...                edit mode blocks (what we show to the end-user)
  /View/...                view mode blocks (what we show to the end-user)

```

## Entry points

 - `lib/block` block class, can load appropriate kind when requested
 - `lib/block/BuilderEdit` block kind editing component, see `src/components/Admin/Page/Builder/Editor.vue`
 - `lib/block/View` block kind viewing component, see `src/components/Public/....`

## Adding new block kind component

Please note the names for view, edit components and kind classes. When adding new kinds make sure you keep the
same file name for all three locations.

When you add class and all needed components, extend loaders under Edit and View folders.
