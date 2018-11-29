# CMS admin & end user blocks

This is the place for all block types (kinds), their edit and view components.

## File structure
```
/...               wrapper block
  /Edit/...        editor components (what we show to admin, when block is edited)
    /mixin/...     editor component mixins

  /Preiew/...      previewer components (what we show to the admin)
    /mixins/...    previewer component mixins

  /View/...        viewer components (what we show to the end-user)
    /mixins/...    viewer component mixins

  /kind/...        classes for all known kinds
```

## Entry points

 - `lib/block` block class, can load appropriate kind when requested
 - `lib/block/Edit` block kind editing component, see `src/components/Admin/Page/Builder/Editor.vue`
 - `lib/block/View` block kind viewing component, see `src/components/Public/....`

## Adding new block kind component

Please note the names for view, edit components and kind classes. When adding new kinds make sure you keep the
same file name for all three locations.

When you add class and all needed components, extend loaders under Edit and View folders.
