'use client';

import { KEYS } from 'platejs';

import { EmojiToolbarButton } from '../emoji-toolbar-button';
import { LinkToolbarButton } from '../link-toolbar-button';
import { MediaToolbarButton } from '../media-toolbar-button';
import { TableToolbarButton } from '../table-toolbar-button';
import { ToolbarGroup } from '../toolbar';

export function RichContentGroup() {
  return (
    <ToolbarGroup>
      <LinkToolbarButton />
      <TableToolbarButton />
      <EmojiToolbarButton />
      <MediaToolbarButton nodeType={KEYS.img} />
      <MediaToolbarButton nodeType={KEYS.video} />
      <MediaToolbarButton nodeType={KEYS.audio} />
      <MediaToolbarButton nodeType={KEYS.file} />
    </ToolbarGroup>
  );
}