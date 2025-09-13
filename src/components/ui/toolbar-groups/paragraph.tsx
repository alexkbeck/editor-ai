'use client';

import { AlignToolbarButton } from '../align-toolbar-button';
import { IndentToolbarButton, OutdentToolbarButton } from '../indent-toolbar-button';
import { BulletedListToolbarButton, NumberedListToolbarButton, TodoListToolbarButton } from '../list-toolbar-button';
import { ToolbarGroup } from '../toolbar';
import { ToggleToolbarButton } from '../toggle-toolbar-button';

export function ParagraphGroup() {
  return (
    <ToolbarGroup>
      <AlignToolbarButton />
      <NumberedListToolbarButton />
      <BulletedListToolbarButton />
      <TodoListToolbarButton />
      <ToggleToolbarButton />
      <OutdentToolbarButton />
      <IndentToolbarButton />
    </ToolbarGroup>
  );
}