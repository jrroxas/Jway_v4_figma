import * as migration_20260727_174500_add_contact_form_schema from './20260727_174500_add_contact_form_schema';
import * as migration_20260728_090000_add_pages_collection from './20260728_090000_add_pages_collection';
import * as migration_20260728_114500_add_pages_locked_relation from './20260728_114500_add_pages_locked_relation';
import * as migration_20260728_120000_seed_pages from './20260728_120000_seed_pages';
import * as migration_20260728_123000_add_pages_seo_settings from './20260728_123000_add_pages_seo_settings';
import * as migration_20260901_090000_add_header_footer_scripts_global from './20260901_090000_add_header_footer_scripts_global';
import * as migration_20261103_122500_add_trash_global_and_items from './20261103_122500_add_trash_global_and_items';

export const migrations = [
  {
    up: migration_20260727_174500_add_contact_form_schema.up,
    down: migration_20260727_174500_add_contact_form_schema.down,
    name: '20260727_174500_add_contact_form_schema',
  },
  {
    up: migration_20260728_090000_add_pages_collection.up,
    down: migration_20260728_090000_add_pages_collection.down,
    name: '20260728_090000_add_pages_collection',
  },
  {
    up: migration_20260728_114500_add_pages_locked_relation.up,
    down: migration_20260728_114500_add_pages_locked_relation.down,
    name: '20260728_114500_add_pages_locked_relation',
  },
  {
    up: migration_20260728_120000_seed_pages.up,
    down: migration_20260728_120000_seed_pages.down,
    name: '20260728_120000_seed_pages',
  },
  {
    up: migration_20260728_123000_add_pages_seo_settings.up,
    down: migration_20260728_123000_add_pages_seo_settings.down,
    name: '20260728_123000_add_pages_seo_settings',
  },
  {
    up: migration_20260901_090000_add_header_footer_scripts_global.up,
    down: migration_20260901_090000_add_header_footer_scripts_global.down,
    name: '20260901_090000_add_header_footer_scripts_global',
  },
  {
    up: migration_20261103_122500_add_trash_global_and_items.up,
    down: migration_20261103_122500_add_trash_global_and_items.down,
    name: '20261103_122500_add_trash_global_and_items',
  },
];
